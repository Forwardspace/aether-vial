import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { Zone } from "../zone/Zone.jsx";

export function SearchZone(props) {
    var data = useSelector(state => state["local"]["searchZone"]);
    var dispatch = useDispatch();

    return (
        (data && createPortal(
            (<div className="search-zone-container" onClick={() => { dispatch({ type: "SET_SEARCH_ZONE", payload: null }) }}>
                <h2>Search Zone</h2>
                <Zone className="search-zone" name_human_readable="Search Zone" where={data.where} who={data.who} expand={true}/>
            </div>), document.body)
        )
    );
}