
import "./Card.css";

import card_back from "../res/card_back.jpg";
import placeholder from "../res/placeholder.jpg";

import { fetchCardByName } from "../cardfetch/cardfetch";

import { useState, useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";

export function Card(props) {
    var cardRef = useRef(props.card);
    cardRef.current = props.card;

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.card.id,
    });

    const position = transform? `translate(${transform.x}px, ${transform.y}px)` : ``;
    const rotate = props.card.tapped? "rotate(90deg)" : "rotate(0deg)";

    var [image, setImage] = useState(placeholder);

    function isCardVisible() {
        if (cardRef.current.location == "enemy_hand") {
            return cardRef.current.visibility_override;
        }
        if (cardRef.current.location.includes("library")) {
            return cardRef.current.visibility_override;
        }

        return cardRef.current.visible;
    }

    var style = {
        transform: position + rotate,
        backgroundImage: isCardVisible() ? `url(${image})` : `url(${card_back})`,
        marginLeft: props.card.tapped? "2em" : undefined,
        marginRight: props.card.tapped? "2em" : undefined,
    };

    useEffect(() => {
        fetchCardByName(props.card.name, setImage);
    }, [cardRef.current.name]);

    function setHoveredCard() {
        window.hovering = cardRef.current.id;
    }

    return (
        <div ref={setNodeRef} className="card" style={style} {...listeners} {...attributes} onMouseEnter={setHoveredCard}>
            { props.card.numPlusOneCounters != 0 && (
                <div class className="card-counter-area-plus-one">
                    <p>{props.card.numPlusOneCounters > 0? '+':''}{props.card.numPlusOneCounters}/{props.card.numPlusOneCounters > 0? '+':''}{props.card.numPlusOneCounters}</p>
                </div>
            )}
            { props.card.numGenericCounters != 0 && (
                <div className="card-counter-area-generic">
                    <p>{props.card.numGenericCounters}</p>
                </div>
            )}
        </div>
    );
}

export function CardShowcase(props) {
    function isCardVisible() {
        if (props.card.visibility_override) {
            return props.card.visible;
        }

        if (props.card.location == "enemy_hand") {
            return false;
        }
        if (props.card.location.includes("library")) {
            return false;
        }

        return props.card.visible;
    }

    var [image, setImage] = useState(null);

    var style = {
        rotation: props.card.tapped? "90deg" : "0deg",
        backgroundImage: isCardVisible() ? `url(${image})` : `url(${card_back})`,
        marginLeft: props.card.tapped? "2em" : undefined,
        marginRight: props.card.tapped? "2em" : undefined,
    };

    useEffect(() => {
        fetchCardByName(props.card.name, setImage);
    }, []);

    return (
        <div className="card" style={style}>
            { props.card.numGenericCounters != 0 && (
                <div className="card-counter-area-generic">
                    <p>{props.card.numGenericCounters}</p>
                </div>
            )}
            { props.card.numPlusOneCounters != 0 && (
                <div class name="card-counter-area-plus-one">
                    <p>{props.card.numPlusOneCounters > 0? '+':''}{props.card.numPlusOneCounters}/{props.card.numPlusOneCounters > 0? '+':''}{props.card.numPlusOneCounters}</p>
                </div>
            )}
        </div>
    );
}