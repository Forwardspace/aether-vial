
import React from 'react';

import { sendNewGameMessage, sendCardData, sendCounterData, sendEndTurn } from '../netdata/netdata.js';

import './MenuBar.css';

export function MenuBar(props) {
    const resetGame = () => {
        props.setCards([]);
        props.setState({ ...props.state.current, playerTax: 0, enemyTax: 0, playerHealth: 20, enemyHealth: 20 })
        sendNewGameMessage();
    };

    const serializeGame = () => {
        var game = JSON.stringify({
            cards: props.cards.current,

            enemyTurn: props.state.current.isEnemyTurn,
            playerTax: props.state.current.playerTax,
            enemyTax: props.state.current.enemyTax,
            playerLife: props.state.current.playerLife,
            enemyLife: props.state.current.enemyLife
        });

        navigator.clipboard.writeText(game);
    };

    const deserializeGame = () => {
        navigator.clipboard.readText().then(game => {
            var gameData = JSON.parse(game);

            props.setCards(gameData.cards);

            if (gameData.enemyTurn && !props.state.current.isEnemyTurn) {
                sendEndTurn(props.peer);
            }

            props.setState({
                ...props.state.current,
                isEnemyTurn: gameData.enemyTurn,
                playerTax: gameData.playerTax,
                enemyTax: gameData.enemyTax,
                playerLife: gameData.playerLife,
                enemyLife: gameData.enemyLife
            });

            sendCardData(props.peer, gameData.cards);
            sendCounterData(props.peer, props.state.current);
        });
    };

    return (
        <div className="menu-bar">
            <button className="menu-button new-game-button" onClick={resetGame}>New Game</button>
            <button className="menu-button load-game-button" onClick={deserializeGame}>Load Game</button>
            <button className="menu-button save-game-button" onClick={serializeGame}>Save Game</button>
            <button className="menu-button disconnect-button" onClick={props.disconnect}>Disconnect</button>
        </div>
    );
}