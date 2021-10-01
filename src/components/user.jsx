import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrieveUser } from "../actions/home";

const User = (props) => {
    const UserId = props.match.params.id;

    const dispatch = useDispatch();
    const reducerState = useSelector((state) => state);
    const user = reducerState.home.user;

    useEffect(() => {
        dispatch(retrieveUser(UserId));
    }, [dispatch]);

    return (
        <div>
            <h2>User Details</h2>
            <h1>{user.name}</h1>
            <div>
                Email: {user.email}
            </div>
            <div>
                Phone: {user.phone}
            </div>
            <div>
                Website: {user.website}
            </div>
        </div>
    )
}
export default User;