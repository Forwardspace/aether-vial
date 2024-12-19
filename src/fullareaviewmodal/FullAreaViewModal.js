
import React from "react";
import { Card, CardShowcase } from "../card/Card";

import { useId } from "react";
import { useDroppable } from "@dnd-kit/core";

import "./FullAreaViewModal.css";

export function FullAreaViewModal(props) {
    const {isOver, setNodeRef} = useDroppable({
        id: useId(),
        data: { name: props.name }
    });

    const style = {
        backgroundColor: isOver ? '#233e1e' : undefined,
    };

    var relevantCards = props.cards.current.filter(card => card.location == props.name).sort((a, b) => a.index - b.index);

    function getDisplayName(name) {
        switch (name) {
            case "player_library":
                return "Your library";
            case "player_graveyard":
                return "Your graveyard";
            case "enemy_library":
                return "Enemy's library";
            case "enemy_graveyard":
                return "Enemy's graveyard";
            case "player_exile":
                return "Your exile";
            case "enemy_exile":
                return "Enemy's exile";
            default:
                return name;
        }
    }

    return (
        <div className="fav-modal">
            <div className="fav-modal-content" ref={setNodeRef} style={style}>
                <h1>{getDisplayName(props.name)}</h1>
                <div className="fav-cards-container">
                    {relevantCards.map((card, idx) => idx != relevantCards.length - 1? <Card card={{...card, visibility_override: true}} /> : <CardShowcase card={{...card, visibility_override: true}} />)}
                </div>
            </div>
        </div>
    );
}