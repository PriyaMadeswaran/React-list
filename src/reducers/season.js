import {
    SEASON_LOADING,
    CREATE_SEASON_SUCCESS,
    UPDATE_SEASON_SUCCESS,
    RETRIEVE_SEASON,
    DELETE_SEASON,
} from "../actions/types";
import moment from "moment";
const initialState = {
    isLoadingSeason: true,
    seasonList: [],
};

const seasonReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SEASON_LOADING:
            return {
                ...state,
                isLoadingSeason: payload
            };
        case RETRIEVE_SEASON:
            return { ...state, seasonList: payload };
        case DELETE_SEASON:
            const results = state.seasonList.filter(c => c.seasonID !== payload.seasonID);
            return {
                ...state,
                seasonList: results
            };
        case CREATE_SEASON_SUCCESS:
            const newRows = payload;
            let seasonResults = [...state.seasonList, ...newRows];
            //Order by descending ( -1 : 1)
            seasonResults = seasonResults.sort((a, b) => (a["seasonID"] > b["seasonID"] ? -1 : 1));
            return {
                ...state,
                seasonList: seasonResults
            };
        case UPDATE_SEASON_SUCCESS:
            const newValue = payload.getSeasonInfo;
            const currentDate = payload.CurrentDate;
            let seasonResultList = [...state.seasonList];
            var index = seasonResultList.findIndex(x => x.seasonID === newValue.SeasonID);
            seasonResultList[index].seasonName = newValue.SeasonName;
            seasonResultList[index].modifiedDate = currentDate;
            seasonResultList = seasonResultList.sort((a, b) => (moment(new Date(a["modifiedDate"])) > moment(new Date(b["modifiedDate"])) ? -1 : 1));
            return {
                ...state,
                seasonList: seasonResultList
            };
        default:
            return state;
    }
};
export default seasonReducer;