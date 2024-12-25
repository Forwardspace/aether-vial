export function receiveData(data, isHost, state, setState, cards, setCards) {
    var json = JSON.parse(data);

    switch (json.messageType) {
        case "initialState":
            setState({...state, isEnemyTurn: json.isEnemyTurn, isConnected: true});
            break;
        case "updateCards":
            setCards(json.cards);
            break;
        case "endTurn":
            setState({...state, isEnemyTurn: !state.isEnemyTurn});
            break;
        case "updateCounters":
            setState({ ...state, playerLife: json.counters.playerLife, playerTax: json.counters.playerTax, enemyLife: json.counters.enemyLife, enemyTax: json.counters.enemyTax });
            break;
        case "newGame":
            setCards([]);
            setState({ ...state, playerLife: 20, enemyLife: 20, playerTax: 0, enemyTax: 0 });
            break;
    }
}

export function sendCardData(peer, cards) {
    Object.keys(peer.connections).map((key) => peer.connections[key][0].send(JSON.stringify({
        messageType: "updateCards",
        cards: cards.slice().map(card => {
            return { ...card, location: card.location.startsWith("player")? card.location.replace("player", "enemy") : card.location.replace("enemy", "player") };
        })
    })));
}

export function sendEndTurn(peer) {
    Object.keys(peer.connections).map((key) => peer.connections[key][0].send(JSON.stringify({
        messageType: "endTurn"
    })));
}

export function sendCounterData(peer, state) {
    Object.keys(peer.connections).map((key) => peer.connections[key][0].send(JSON.stringify({
        messageType: "updateCounters",
        /* Swap player and enemy around */
        counters: {
            enemyLife: state.playerLife,
            enemyTax: state.playerTax,
            playerLife: state.enemyLife,
            playerTax: state.enemyTax
        }
    })));
}

export function sendNewGameMessage(peer) {
    Object.keys(peer.connections).map((key) => peer.connections[key][0].send(JSON.stringify({
        messageType: "newGame"
    })));
}