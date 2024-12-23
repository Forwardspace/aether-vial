
import React from "react";
import { Card, CardShowcase } from "../card/Card";

import { useId, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";

import "./FullAreaViewModal.css";

export function FullAreaViewModal(props) {
    const {isOver, setNodeRef} = useDroppable({
        id: useId(),
        data: { name: props.name }
    });

    var ref = useRef({style: {translate: "0px"}});
    var scroll = useRef(0);

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
            case "player_commandzone":
                return "Your command zone";
            case "enemy_commandzone":
                return "Enemy's command zone";
            case "player_hand":
                return "Your hand";
            case "enemy_hand":
                return "Enemy's hand";
            default:
                return name;
        }
    }

    function shouldDisplayLastCard() {
        switch (props.name) {
            case "player_library":
            case "enemy_library":
            case "player_graveyard":
            case "enemy_graveyard":
            case "player_exile":
            case "enemy_exile":
                return false;
            default:
                return true;
        }
    }

    function handleScroll(ev) {
        var delta = ev.deltaY;
        scroll.current += delta;

        ref.current.style.translate = scroll.current + "px";
    }

    if (shouldDisplayLastCard()) {
        return (
            <div className="fav-modal">
                <div className="fav-modal-content" ref={setNodeRef} style={style}>
                    <h1>{getDisplayName(props.name)}</h1>
                    <div className="fav-cards-container" onWheel={handleScroll} ref={ref}>
                        {relevantCards.map((card) => <Card card={{...card, visibility_override: true}} />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fav-modal">
            <div className="fav-modal-content" ref={setNodeRef} style={style}>
                <h1>{getDisplayName(props.name)}</h1>
                <div className="fav-cards-container" onWheel={handleScroll} ref={ref}>
                    {relevantCards.map((card, idx) => idx != relevantCards.length - 1? <Card card={{...card, visibility_override: true}} /> : <CardShowcase card={{...card, visibility_override: true}} />)}
                </div>
            </div>
        </div>
    );
}