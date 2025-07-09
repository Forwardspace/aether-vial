import { Fragment, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./welcomescreen.css";

export function WelcomeScreen(props) {
    var show = !useSelector(state => state["local"]["isConnectedOrInDemoMode"]);

    var [showPrompt, setShowPrompt] = useState(null);
    var idInput = useRef();
    var dispatch = useDispatch();

    function onSelectRole(role) {
        if (role == "host") {
            setShowPrompt("hostprompt");
        }
        else if (role == "client") {
            setShowPrompt("clientprompt");
        }
        else if (role == "test") {
            dispatch({ type: "SET_CONNECTED", payload: true });
            dispatch({ type: "SET_ROLE", payload: "host" });
            dispatch({ type: "SET_SPECTATING", payload: "client1"})
        }
        else if (role == "demo") {
            dispatch({ type: "SET_CONNECTED", payload: true });
            dispatch({ type: "SET_ROLE", payload: "host" });
            dispatch({ type: "SET_SPECTATING", payload: "client1"})

            // Set up a demo game
            dispatch({ type: "SETUP_DEMO_STATE" });
        }
        else {
            console.error("Unknown role selected in welcome screen!");
        }
    }

    if (!show) {
        return null; // Don't show the welcome screen if we are already connected or in demo mode
    }

    return (
        <Fragment>
            <div className="welcome-screen" />
            <div className="welcome-modal">
                <h1>Welcome to Aether Vial!</h1>
                <p>Playing against somebody?</p>
                <div className="welcome-modal-horizontal-flex">
                    <button className="welcome-role-button button-host" onClick={() => onSelectRole("host")}>Host</button>
                    <button className="welcome-role-button button-client" onClick={() => onSelectRole("client")}>Connect</button>
                </div>
                <p>Want to test out a deck?</p>
                <div className="welcome-modal-horizontal-flex">
                    <button className="welcome-role-button button-singleplayer" onClick={() => onSelectRole("test")}>Singleplayer</button>
                    <button className="welcome-role-button button-demo" onClick={() => onSelectRole("demo")}>Demo</button>
                </div>
                {showPrompt == "hostprompt" && (
                    <div className="welcome-prompt">
                        <div className="welcome-hostid-prompt">
                            <p>Your host ID is:<br/><br/> <b style={{ userSelect: "all" }}>{props.hostId}</b></p>
                        </div>
                    </div>
                )}
                {showPrompt == "clientprompt" && (
                    <div className="welcome-prompt">
                        <p>Enter the host ID:</p>
                        <input ref={idInput} className="welcome-input" type="text" placeholder="Host ID" />
                        <button className="button-connect" onClick={() => props.connectTo(idInput.current.value)}>Connect</button>
                    </div>
                )}
            </div>
        </Fragment>
    )
}