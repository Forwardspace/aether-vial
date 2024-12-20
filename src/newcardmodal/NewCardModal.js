
import "./NewCardModal.css";

import { useState } from "react";

export function NewCardModal(props) {
    var [cardName, setCardName] = useState("");

    function spawnCard() {
        var cardName = document.querySelector(".card-name-input").value;

        var newCards = props.cards.current.slice().concat({
            id: Math.round(Math.random() * 1000000),
            name: cardName,
            location: "player_battlefield",
            tapped: false,
            visible: true,
            visibility_override: false,
            index: props.cards.current.filter(card => card.location == "player_battlefield").length,
            numGenericCounters: 0,
            numPlusOneCounters: 0
        })
        
        props.setCards(newCards);
        props.sendCardData(newCards);

        props.setState({...props.state.current, isNewCardModalOpen: false});
    }

    return(
        <div className="newcard-modal" onClick={() => { props.setState({...props.state.current, isNewCardModalOpen: false}) }}>
            <div className="newcard-modal-content" onClick={ (ev) => { ev.stopPropagation() } }>
                <h2>Spawn card</h2>
                <input type="text" placeholder="Card Name" className="card-name-input" value={cardName} onChange={(ev) => { setCardName(ev.target.value) }} />
                <button className="spawn-card-button" onClick={spawnCard}>Spawn</button>
            </div>
        </div>
    );
}