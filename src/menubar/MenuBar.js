
import React from 'react';
import './MenuBar.css';

export function MenuBar(props) {
    return (
        <div className="menu-bar">
            <button className="menu-button new-game-button" onClick={()=>{}}>New Game</button>
            <button className="menu-button load-game-button" onClick={props.onEndTurn}>Load Game</button>
            <button className="menu-button save-game-button" onClick={props.onSaveGame}>Save Game</button>
            <button className="menu-button disconnect-button" onClick={props.disconnect}>Disconnect</button>
        </div>
    );
}