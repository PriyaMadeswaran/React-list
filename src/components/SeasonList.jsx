import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import SweetAlertPopup from '../../Common/SweetAlertPopup';
import useFullPageLoader from "../../../hooks/useFullPageLoader";
import SeasonService from "../../../services/Master/SeasonService";
import Nodify from "../../Common/ReactNotification"
import SearchRetain from "../../Common/SearchRetain";
import { Redirect } from 'react-router-dom';
import { TableHeader, Pagination, Search, PageCount } from "../../Datatable";
import { SeasonActionId } from "../../Common/PageActionNumber";
import CommonService from '../../../services/Common/CommonService';
import { retrieveSeason } from "../../../actions/season";


const SeasonList = (props) => {
    const [getID, setID] = useState({ showPopupDelete: false, Params: {} });
    const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(5);
    const [getPlaceholder] = useState("Season");
    const [currentPage, setCurrentPage] = useState(1);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });

    const dispatch = useDispatch();

    //reducer
    const reducerState = useSelector((state) => state);
    const { user: currentUser } = reducerState.auth;
    const comments = reducerState.season.seasonList;
    let isLoadingSeason = reducerState.season.isLoadingSeason;

    useEffect(() => {
        let SeasonID = 0;
        if (comments.length == 0) {
            dispatch(retrieveSeason(SeasonID));
        }
       
        const state1 = props.location.state
        if (state1 !== undefined && state1 !== null) {
            let Msg;
            let Type = 'success'; // default, info, warning
            let title = 'Success!';
            if (state1.message === 'Edit') {
                Msg = 'Season updated successfully.';
            } else if (state1.message === 'Add') {
                Msg = 'Season added successfully.';
            } else {
                Msg = 'Error occured';
                Type = 'warning';
                title = 'Error!';
            }
            window.history.replaceState(null, '')
            Nodify(title, Type, Msg);
        }
        var page = getPlaceholder;
        var setConstraint = SearchRetain(page);
        if (setConstraint !== undefined) {
            setCurrentPage(setConstraint.CurrentPage);
            setITEMS_PER_PAGE(setConstraint.PageItems);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!isLoadingSeason) {
            hideLoader();
        } else {
            showLoader();
        }
    }, [isLoadingSeason]);

    const headers = [
        {
            name: "Season",
            field: "seasonName",
            sortable: true
        }, {
            name: "Created Date",
            field: "createddate",
            sortable: true
        }, {
            name: "Action",
            field: "",
            sortable: false
        },
    ];

    const commentsData = useMemo(() => {
        let computedComments = comments;

        if (search) {
            computedComments = computedComments.filter(comment => comment.seasonName.toLowerCase().includes(search.toLowerCase()));
        }
        setTotalItems(computedComments.length);

        // Sorting comments
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedComments = computedComments.sort((a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field]));
        }
        // Current Page slice
        let records = computedComments.slice((currentPage - 1) * parseInt(ITEMS_PER_PAGE), (currentPage - 1) * parseInt(ITEMS_PER_PAGE) + parseInt(ITEMS_PER_PAGE));
        if (records.length === 0 && currentPage != 1) {
            setCurrentPage(currentPage - 1);
        }
        return computedComments.slice((currentPage - 1) * parseInt(ITEMS_PER_PAGE), (currentPage - 1) * parseInt(ITEMS_PER_PAGE) + parseInt(ITEMS_PER_PAGE));
    }, [
        comments,
        currentPage,
        search,
        sorting,
        ITEMS_PER_PAGE
    ]);

    const pageRedirect = (dataParams, redirect, page) => {
        localStorage.setItem('Pagination', JSON.stringify({ CurrentPage: currentPage, Page: page, PageItems: ITEMS_PER_PAGE }));
        if (redirect === 'Add') {
            props.history.push('/AddSeason', { params: [] });
        } else if (redirect === 'Edit') {
            props.history.push(`/EditSeason`, { params: dataParams });
        } else {
            let Params = {
                Operation: SeasonActionId,
                Id: dataParams.seasonID,
            };
            CommonService.CheckMappedItem(Params).then(res => {
                if (res.data.outputResult === "-2") {
                    let Title = "Warning!";
                    let message = "This season is already mapped.";
                    let type = "warning";

                    Nodify(Title, type, message);
                }
                else {
                    setID({ showPopupDelete: true, Params: dataParams });
                }
            });
        }
    };

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    const Delcallback = (value) => {
        setID({ showPopupDelete: false, Params: [] });
    }

    return (
        <>
            <div className="page-body">
                <ReactNotification />
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <div className="widget">
                            <div className="widget-header ">
                                <span className="widget-caption">Season List</span>
                            </div>

                            <div className="widget-body"
                                style={
                                    { paddingBottom: '4%' }
                                }>
                                <div id="simpledatatable_wrapper" className="dataTables_wrapper form-inline no-footer">
                                    <div className="table-toolbar pull-left">
                                        <Search onSearch={
                                            value => {
                                                setSearch(value);
                                                setCurrentPage(1);
                                            }
                                        }

                                            placeholder={getPlaceholder} />
                                    </div>
                                    <div className="table-toolbar pull-right">
                                        &nbsp;
                                        <span className="btn btn-primary" onClick={() => pageRedirect('', 'Add', getPlaceholder)}>
                                            <i className="fa fa-plus"></i>&nbsp;Add
                                        </span>
                                    </div>

                                    <table className="table table-striped table-bordered table-hover dataTable no-footer" id="editabledatatable">
                                        <TableHeader headers={headers}
                                            onSorting={
                                                (field, order) => setSorting({ field, order })
                                            } />
                                        <tbody>
                                            {
                                                commentsData.map(comment => (
                                                    <tr key={
                                                        comment.seasonID
                                                    }>
                                                        <td>{
                                                            comment.seasonName
                                                        }</td>
                                                        <td>{
                                                            comment.createddate
                                                        }</td>
                                                        <td>
                                                            <span title='Edit Season' onClick={() => pageRedirect(comment, 'Edit', getPlaceholder)}
                                                                className="btn btn-info btn-xs edit">
                                                                <i className="fa fa-edit"></i>
                                                            </span>
                                                            &nbsp;
                                                            <span title='Delete Season' onClick={() => pageRedirect(comment, '', getPlaceholder)}
                                                                className="btn btn-danger btn-xs delete">
                                                                <i className="fa fa-trash-o"></i>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))

                                            }
                                            {
                                                totalItems === 0 ?
                                                    <tr>
                                                        <td colSpan="5" className='norecordfound'><span>No record found</span></td>
                                                    </tr> : ''
                                            }

                                        </tbody>
                                    </table>
                                    <PageCount onPageCount={
                                        value => {
                                            setITEMS_PER_PAGE(value);
                                            setCurrentPage(1);
                                        }
                                    } />
                                    <Pagination total={totalItems}
                                        itemsPerPage={
                                            parseInt(ITEMS_PER_PAGE)
                                        }
                                        currentPage={currentPage}
                                        onPageChange={
                                            page => setCurrentPage(page)
                                        } />
                                </div>
                            </div>
                            {
                                getID.showPopupDelete ? <SweetAlertPopup data={
                                    getID.Params
                                }
                                    deleteCallback={Delcallback}
                                    showpopup={true}
                                    pageActionId={SeasonActionId}
                                    Msg={"Season deleted successfully."} /> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            {loader} </>
    );
};
export default SeasonList;