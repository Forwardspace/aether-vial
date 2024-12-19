
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

    return (
        <div className="fav-modal">
            <div className="fav-modal-content" ref={setNodeRef} style={style}>
                <h2>{props.name}</h2>
                <div className="fav-cards-container">
                    {relevantCards.map((card, idx) => idx != relevantCards.length - 1? <Card card={{...card, visibility_override: true}} /> : <CardShowcase card={{...card, visibility_override: true}} />)}
                </div>
            </div>
        </div>
    );
}