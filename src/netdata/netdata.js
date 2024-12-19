export function receiveData(data, isHost, state, setState, cards, setCards) {
    var json = JSON.parse(data);

    switch (json.messageType) {
        case "initialState":
            setState({...state, isEnemyTurn: !json.isEnemyTurn, isConnected: true});
            break;
        case "updateCards":
            setCards(json.cards);
            break;
        case "endTurn":
            setState({...state, isEnemyTurn: !state.isEnemyTurn});
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