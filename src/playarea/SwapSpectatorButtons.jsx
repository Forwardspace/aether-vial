
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './SwapSpectatorButtons.css'; // Assuming you have a CSS file for styling

export function SwapSpectatorButtons() {
    var us = useSelector(state => state["local"]["role"]);

    var spectating = useSelector(state => state["local"]["spectating"]);
    var numPlayers = useSelector(state => state["local"]["numPlayers"]);

    var dispatch = useDispatch();

    if (!us || !spectating || numPlayers <= 2) {
        return null; // Don't render the buttons if we don't have roles set or if there's only one opponent
    }

    function isActive(spectating, playerIndex) {
        if (spectating == "host" && playerIndex == 0) {
            return " select-spectator-button-active";
        }
        if (spectating == "client" + playerIndex) {
            return " select-spectator-button-active";
        }

        return "";
    }

    var buttons = [];
    for (let i = 0; i < numPlayers; i++) {
        if (us == "host" && i == 0) continue; // Skip the host player button if we're the host
        if (us != "host" && us == ("client" + i)) continue; // Skip our own player button if we're a client

        buttons.push(
            <button
                key={i}
                className={"select-spectator-button" + isActive(spectating, i)}
                onClick={() => dispatch({ type: "SET_SPECTATING", payload: i == 0 ? "host" : "client" + i })}
            >
                Player {i}
            </button>
        );
    }

    return (
        <div className="swap-spectator-buttons">
            {buttons}
        </div>
    );
}