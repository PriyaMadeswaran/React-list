import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrieveList } from "../actions/home";
import { Link } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const reducerState = useSelector((state) => state);
    const users = reducerState.home.userList;

    useEffect(() => {
        dispatch(retrieveList());
    }, [dispatch]);

    return (
        <div>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <Link to={`user/${user.id}`}>{user.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home;