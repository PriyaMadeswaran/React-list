import React, { useState, useEffect, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactNotification from 'react-notifications-component';
import Nodify from "../../Common/ReactNotification"
import seasonService from "../../../services/Master/SeasonService";
import SearchRetain from "../../Common/SearchRetain";
import { insertUpdateSeasonGrid } from "../../../actions/season";
const AddSeason = (props) => {
    
    const EmptyInputFields =
        [{
            SeasonID: 0,
            SeasonName: '',
        }]
    const [inputFields, setInputFields] = useState(EmptyInputFields);
    const [submitted, setSubmitted] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [getSeasonList, setSeasonList] = useState([]);
    //const [ExistingList, setExistingList] = useState([]);

    const dispatch = useDispatch();
    //reducer
    const reducerState = useSelector((state) => state);
    const { user: currentUser } = reducerState.auth;
    const ExistingList = reducerState.season.seasonList;
    let isLoadingSeason = reducerState.season.isLoadingSeason;

    // useEffect(() => {
    //     seasonService.getSeasonList().then((response) => {
    //         if (response.data) {
    //             setExistingList(response.data);
    //         }
    //     });
    // }, []);

    const handleAddFields = (index) => {
        const values = [...inputFields];
        if (values[index].SeasonName.trim() !== '') {
            values.push({
                SeasonID: 0,
                SeasonName: '',
            });
            setInputFields(values);
            setSubmitted(false);
        }
        else {
            Nodify('Warning!', 'warning', 'Please fill the mandatory(*) fields.');
            setSubmitted(true);
        }
    };

    const handleInputChange = (index, event) => {

        const values = [...inputFields];
        let inputText = '';
        if (event.target.value.trim() !== '') {
            inputText = event.target.value;
        }
        values[index].SeasonName = inputText;
        setInputFields(values);
        setSeasonList({ Createdby: currentUser.employeeinformationID, SeasonInformation: values });
    };

    const handleRemoveFields = index => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
        setSeasonList({ Createdby: currentUser.employeeinformationID, SeasonInformation: values });
    };

    const ResetOperation = (e) => {
        if (e === "Back") {
            props.history.push('/SeasonList');
        } else {
            //   setInputFields(EmptyInputFields);
            // setSubmitted(false);
            // setButtonLoader(false);
            window.location.reload();
        }
    }

    const CheckDuplicate = (index) => {
        const values = [...inputFields];
        // seasonService.getSeasonList().then((response) => {
        if (ExistingList) {
            for (var i = 0; i < ExistingList.length; i++) {
                if (ExistingList[i].seasonName.trim().toLowerCase() === values[index].SeasonName.trim().toLowerCase()) {
                    values[index].SeasonName = '';
                    setInputFields(values);
                    Nodify('Warning!', 'warning', "This name is already exist.");
                    return false;
                }
            }
        }
        // });

        for (var i = 0; i < (inputFields.length); i++) {
            if (i !== index) {
                if (inputFields[i].SeasonName.trim() === inputFields[index].SeasonName.trim()) {
                    values[index].SeasonName = "";
                    setInputFields(values);
                    Nodify('Warning!', 'warning', 'This name is already exist.');
                    return false;
                }
            }
        }
    }

    const SaveSeasonList = (e) => {
        setButtonLoader(true);
        e.preventDefault();

        if (inputFields.length === 1 && inputFields[0].SeasonName === '') {
            setButtonLoader(false);
            setSubmitted(true);
            ValidationPopup("Please fill atleast one Season.");
        }
        else {

            for (var i = 0; i < (inputFields.length); i++) {
                if (inputFields[i].SeasonName.trim() === '') {
                    Nodify('Warning!', 'warning', 'Please fill the mandatory(*) fields.');
                    setSubmitted(true);
                    setButtonLoader(false);
                    return false;
                }

            }
            
            dispatch(insertUpdateSeasonGrid(getSeasonList))
                .then(data => {
                   
                    var page = "Remove";
                    SearchRetain(page);
                    let Func = 'Add';
                    if (data.outputResult === "1") {
                        Func = 'Add';
                        PageRedirect(Func);
                    } else if (data.outputResult === "2") {
                        Func = 'Edit';
                        PageRedirect(Func);
                    } else if (data.outputResult === "-2") {
                        setButtonLoader(false);
                        ValidationPopup("This name is already exist.");
                    }
                    setButtonLoader(false);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    const PageRedirect = (Func) => {
        props.history.push({
            pathname: "/SeasonList",
            state: {
                message: Func
            }
        });
    }

    const ValidationPopup = (Msg) => {
        setButtonLoader(false);
        Nodify('Warning!', 'warning', Msg);
        return false;
    }

    return (
        <div className="page-body">
            <ReactNotification />
            <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                    <div className="widget flat radius-bordered">
                        <div className="widget-header heading_box_style">
                            <h3 className="heading_style_common">Add Season</h3>
                        </div>
                        <div className="widget-body">
                            <div id="registration-form">
                                <form>
                                    {
                                        inputFields.map((inputField, index) => (
                                            <Fragment key={
                                                `${inputField}~${index}`
                                            }>
                                                <div className="row row_left10">
                                                    <div className="col-sm-3 divder_style">
                                                        <div className="form-group">
                                                            {/* <label htmlFor={"SeasonName_" + index}>Season Name<span className="text-danger">*</span></label> */}

                                                            <span className="input-icon icon-right">
                                                                <input type="text"
                                                                    className="form-control"
                                                                    id={"SeasonName_" + index}
                                                                    name="SeasonName"
                                                                    placeholder="Enter Season"
                                                                    maxLength="50"
                                                                    value={inputField.SeasonName}
                                                                    onChange={event => handleInputChange(index, event)}
                                                                    onBlur={() => CheckDuplicate(index)}
                                                                    style={{ border: submitted && !inputField.SeasonName ? '1px solid red' : '' }}
                                                                    autoFocus
                                                                />
                                                            </span>

                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3 paddingstatic">
                                                        {
                                                            inputFields.length !== 1 && (
                                                                <div className="col-lg-1_own col-xs-12">
                                                                    <button type="button" className="btn btn-danger" title="Delete Season" onClick={() => handleRemoveFields(index)}>
                                                                        <i className="fa fa-trash-o"></i>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        {
                                                            inputFields.length === (index + 1) && (
                                                                <div className="col-lg-1_own col-xs-12">

                                                                    <button type="button" className="btn btn-success" title="Add Season" onClick={() => handleAddFields(index)}>
                                                                        <i className="fa fa-plus"></i>
                                                                    </button>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </Fragment>
                                        ))
                                    }
                                    <div className="col-sm-12">
                                        <div className="buttons-preview" align="right">
                                            <span className="btn btn-primary"
                                                onClick={
                                                    () => ResetOperation("Back")
                                                }>
                                                <i className="fa fa-arrow-circle-left"></i>
                                                Back</span>
                                            <span className="btn btn-danger"
                                                onClick={
                                                    () => ResetOperation()
                                                }>
                                                <i className="fa fa-times"></i>
                                                Reset</span>
                                            <button type="button" className="btn btn-success" disabled={buttonLoader}
                                                onClick={SaveSeasonList}>

                                                <i className="fa fa-check right"></i>
                                                &nbsp; Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSeason;