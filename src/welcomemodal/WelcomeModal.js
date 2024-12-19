import "./WelcomeModal.css";

import { useState } from "react";

export function WelcomeModal(props) {
    var [hostId, setHostId] = useState("");

    function onClickHost() {
        props.setState({...props.state.current, isAwaitingConnection: true});
        props.peer.on("connection", (conn) => {
            props.setState({...props.state.current, isAwaitingConnection: false, isConnected: true});

            conn.on("data", (data) => {
                console.log("Received data from client: ", data);
                props.handleData(data, true);
            });

            // Send initial game state to the new connection
            var enemyIsStartingPlayer = Math.random() > 0.5;

            conn.on("open", () => {
                conn.send(JSON.stringify({
                    messageType: "initialState",
                    isEnemyTurn: enemyIsStartingPlayer,
                }));

                props.setState({...props.state.current, isEnemyTurn: !enemyIsStartingPlayer});

                // Send (only our) cards to the new connection
                conn.send(JSON.stringify({
                    messageType: "updateCards",
                    cards: props.cards.current.filter(card => card.location.startsWith("player"))
                }));
            });
        });
    }

    function onClickJoin() {
        var connection = props.peer.connect(hostId);

        connection.on("open", () => {
            connection.on("data", (data) => {
                console.log("Received data from host: ", data);
                props.handleData(data, false);
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