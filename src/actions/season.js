import {
    SEASON_LOADING,
    CREATE_SEASON_SUCCESS,
    UPDATE_SEASON_SUCCESS,
    RETRIEVE_SEASON,
    DELETE_SEASON,
} from "./types";
import SeasonService from "../services/Master/SeasonService";
import moment from "moment";

const seasonLoading = (isStatus) => ({
    type: SEASON_LOADING,
    payload: isStatus,
});

export const deleteSeason = (seasonID) => async (dispatch) => {
    try {
        dispatch({
            type: DELETE_SEASON,
            payload: seasonID,
        });

    } catch (err) {
        console.log(err);
    }
};

export const retrieveSeason = (seasonID) => async (dispatch) => {
    try {
        dispatch(seasonLoading(true));
        const res = await SeasonService.getSeasonList(seasonID);
        dispatch({
            type: RETRIEVE_SEASON,
            payload: res.data,
        });
        dispatch(seasonLoading(false));
    } catch (err) {
        console.log(err);
        dispatch(seasonLoading(false));
    }
};

export const insertUpdateSeasonGrid = (getSeasonList) => async (dispatch) => {
    let resData = "";
    await SeasonService.InsertUpdateSeasonGrid(getSeasonList).then((res) => {
        debugger;
        resData = res.data;
        if (resData.item2.outputResult === "1") {
            dispatch({ type: CREATE_SEASON_SUCCESS, payload: resData.item1 });
        }

    }).catch((err) => { return Promise.reject(err); });
    return Promise.resolve(resData.item2);
}

export const updateSeason = (getSeasonInfo) => async (dispatch) => {
    let resData = "";
    await SeasonService.InsertUpdateSeason(getSeasonInfo).then((res) => {
        resData = res.data;
        if (resData.outputResult === "2") {
            let CurrentDate = new Date();
            dispatch({
                type: UPDATE_SEASON_SUCCESS, payload: {
                    getSeasonInfo: getSeasonInfo, CurrentDate: moment(CurrentDate).format("MM/DD/YYYY hh:mm A")
                }
            });
        }

    }).catch((err) => { return Promise.reject(err); });
    return Promise.resolve(resData);
}