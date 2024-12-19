
import "./ImportModal.css";

import { useState } from "react";

export function ImportModal(props) {
    var [text, setText] = useState("");

    function importCards() {
        
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