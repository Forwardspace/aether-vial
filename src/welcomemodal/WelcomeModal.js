import "./WelcomeModal.css";

import { useState } from "react";

export function WelcomeModal(props) {
    var [hostId, setHostId] = useState("");

    function onClickHost() {
        props.setState({...props.state.current, isAwaitingConnection: true});
    }

    function onClickJoin() {
        var connection = props.peer.connect(hostId);

        connection.on("open", () => {
            connection.on("data", (data) => {
                props.handleData(data, false);
            });

            connection.on("close", () => {
                props.setState({...props.state.current, isConnected: false});
            });
        })
    }

    return (
        <div className="welcome-modal">
            <div className="welcome-modal-content">
                <h2>Welcome to AetherVial!</h2>
                <div className="welcome-modal-buttons">
                    <button className="host-game-button" onClick={onClickHost}>Host Game</button>
                    <button className="join-game-button" onClick={onClickJoin}>Join Game</button>
                </div>
                { props.state.current.isAwaitingConnection && (<h2>Your Host ID is { props.peer.id } </h2>)}
                <input type="text" placeholder="Host ID" value={hostId} className="host-id-input" onChange={ (ev) => { setHostId(ev.target.value) } } />
            </div>
        </div>
    )
}