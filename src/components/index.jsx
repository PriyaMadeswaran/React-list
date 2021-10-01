import React from "react";
import {
    BrowserRouter as Router, Link, Switch, Route
} from "react-router-dom";
import home from "./home";
import user from "./user";

const Webpages = () => {
    return (
        <Router>
            <Route exact path="/" component={home}></Route>
            <Route path="/user/:id" component={user}></Route>
        </Router>
    )

}
export default Webpages;