import { RETRIEVE_LIST,RETRIEVE_USER } from "../actions/type";

const initialState = {
    userList: [],
    user: [],
};

const listReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case RETRIEVE_LIST:
            return { ...state, userList: payload };
        case RETRIEVE_USER:
            debugger;
             const results = state.userList.filter(c => c.id === parseInt(payload));
            return {
                ...state,
                user: results[0]
            };
        default:
            return state;
    }
};

export default listReducer;