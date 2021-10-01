import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Nodify from "../../Common/ReactNotification";
import SearchRetain from "../../Common/SearchRetain";
import ReactNotification from 'react-notifications-component';
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import { updateSeason } from "../../../actions/season";

const EditSeason = (props) => {
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);

    const [getSeasonInfo, setSeasonInfo] = useState({});
    const [buttonLoader, setButtonLoader] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    function BindSeasonValue(props) {
        let SeasonInfoValue = {
            Operation: 2,
            SeasonID: 0,
            SeasonName: '',
            Createdby: currentUser.employeeinformationID,
        };
        if (props.location.state !== undefined) {
            if (props.location.state.params.length !== 0) {
                if (props.location.state.params.seasonID !== 0) {
                    SeasonInfoValue.Operation = 2;
                    SeasonInfoValue.SeasonID = props.location.state.params.seasonID;
                    SeasonInfoValue.SeasonName = props.location.state.params.seasonName;
                    return SeasonInfoValue;
                }
            }
        }
        else {
            return SeasonInfoValue;
        }
    }

    //
    useEffect(() => {
        let Seasoninfo = BindSeasonValue(props);
        setSeasonInfo(Seasoninfo);
    }, []);


    const PageRedirect = (Func) => {
        props.history.push({
            pathname: "/SeasonList",
            state: {
                message: Func,
            },
        }
        );
    };

    const ResetOperation = (e) => {
        if (e === "Back") {
            props.history.push('/SeasonList')
        } else {
            //      setSubmitted(false);
            // let Seasoninfo = BindSeasonValue(props);
            // setSeasonInfo(Seasoninfo);
            window.location.reload();
        }
    }

    const ValidationPopup = (Msg) => {
        setButtonLoader(false);
        Nodify('Warning!', 'warning', Msg);
    };

    const handleChange = (e) => {
        let Value = getSeasonInfo;

        if (e.target.name === "SeasonName") {
            if (e.target.value.trim() !== '') {
                setSubmitted(true);
            }
            else {
                setSubmitted(false);
            }
            Value[e.target.name] = e.target.value;
        }
        setSeasonInfo(Value);
    }

    const SaveSeason = (e) => {
        setButtonLoader(true);
        e.preventDefault();
        if (getSeasonInfo.SeasonName.trim() === '') {
            setButtonLoader(false);
            Nodify('Warning!', 'warning', 'Season name is required.');
        }
        if (getSeasonInfo.SeasonName.trim()) {
            getSeasonInfo.SeasonName = getSeasonInfo.SeasonName.trim();
            
            dispatch(updateSeason(getSeasonInfo))
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
                        getSeasonInfo.SeasonName = '';
                        setSeasonInfo(getSeasonInfo);
                        Nodify('Warning!', 'warning', 'This name is already exist.');
                    }
                    setButtonLoader(false);
                })
                .catch(e => {
                    console.log(e);
                });
        }
        else {
            setSubmitted(true);
        }
    }

    return (
        <div className="page-body">
            <ReactNotification />
            <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                    <div className="widget flat radius-bordered">
                        <div className="widget-header heading_box_style">
                            <h3 className="heading_style_common">
                                Edit Season Info
                            </h3>
                        </div>
                        <div className="widget-body">
                            <div id="registration-form">
                                <Form>
                                    <div className="row">
                                        <div className="form-group col-sm-4">
                                            <label htmlFor="SeasonName">
                                                Season Name
                                                <span className="text-danger">*</span>
                                            </label>
                                            <span className="input-icon icon-right">
                                                <Input
                                                    placeholder={"Enter Season"}
                                                    id="SeasonName"
                                                    name="SeasonName"
                                                    value={getSeasonInfo.SeasonName}
                                                    type="text"
                                                    maxLength="50"
                                                    autoComplete="off"
                                                    onChange={handleChange}
                                                    className='form-control'
                                                    style={{ border: submitted && !getSeasonInfo.SeasonName ? '1px solid red' : '' }}
                                                    autoFocus
                                                />
                                            </span>

                                        </div>
                                    </div>

                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div
                        className="buttons-preview"
                        align="right"
                        style={{ marginTop: "15px" }}
                    >
                        <div className="buttons-preview" align="right">
                            <span className="btn btn-primary" onClick={() => ResetOperation("Back")}>
                                <i className="fa fa-arrow-circle-left"></i> Back
                            </span>
                            <span className="btn btn-danger" onClick={() => ResetOperation()}>
                                <i className="fa fa-times"></i> Reset
                            </span>
                            <button
                                type="submit"
                                className="btn btn-success"
                                onClick={SaveSeason}
                                disabled={buttonLoader}
                            >

                                <i className="fa fa-check right"></i> &nbsp; Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EditSeason;