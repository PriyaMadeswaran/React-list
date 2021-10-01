import { RETRIEVE_LIST,RETRIEVE_USER } from "./type";

export const retrieveList = () => async (dispatch) => {
    try {
        fetch("https://jsonplaceholder.typicode.com/users/")
            .then(res => res.json())
            .then(
                (data) => {
                    dispatch({
                        type: RETRIEVE_LIST,
                        payload: data,
                    });
                },
                (error) => {
                }
            )
    }
    catch (err) {
        
    }
}

export const retrieveUser = (userId) => async (dispatch) => {
    debugger;
    try {
        dispatch({
            type: RETRIEVE_USER,
            payload: userId,
        });

    } catch (err) {
        console.log(err);
    }
};