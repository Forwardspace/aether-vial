
import "./ImportModal.css";

import { useState } from "react";

export function ImportModal(props) {
    var [text, setText] = useState("");

    function importCards() {
        var cards = text.split("\n");
        var newCards = [];

        for (var i = 0; i < cards.length; i++) {
            if (cards[i].trim() == "") {
                continue;
            }

            var amount = parseInt(cards[i].split(" ")[0]);
            var name = cards[i].split(" ").slice(1).join(" ");

            for (var j = 0; j < amount; j++) {
                newCards.push({
                    id: Math.round(Math.random() * 1000000),
                    name: name,
                    location: "player_library",
                    tapped: false,
                    visible: true,
                    visibility_override: false,
                    index: props.cards.current.filter(card => card.location == "player_hand").length,
                    numGenericCounters: 0,
                    numPlusOneCounters: 0
                });
            }
        }

        props.setCards(props.cards.current.concat(newCards));
        props.sendCardData(props.cards.current.concat(newCards));

        props.setState({...props.state.current, isImportModalOpen: false});
    }

    return(
        <div className="import-modal" onClick={() => { props.setState({...props.state.current, isImportModalOpen: false}) }}>
            <div className="import-modal-content" onClick={ (ev) => { ev.stopPropagation() } }>
                <h2>Import deck from list</h2>
                <textarea placeholder="Deck list" className="deck-list-input" value={text} onChange={(ev) => { setText(ev.target.value) }} />
                <button className="import-deck-button" onClick={importCards}>Import</button>
            </div>
        </div>
    );
}