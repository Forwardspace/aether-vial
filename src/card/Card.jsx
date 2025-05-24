import "./Card.css";

import card_back from "../res/card_back.jpg";

import { useEffect, useState, Fragment } from "react";
import { createPortal } from "react-dom";
import { fetchCardByName } from "../cardfetch/cardfetch";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDispatch, useSelector } from "react-redux";

import { useContextMenu, Menu, Item, Separator, Submenu } from "react-contexify";
import { getNewCardWithName } from "../state/gameStateReducer";

export function Card(props) {
    var [image, setImage] = useState(card_back);
    var id = Math.random().toString().slice(2);

    const role = useSelector(state => state.local.role);
    const dispatch = useDispatch();

    const { show } = useContextMenu({
        id: id
    });

    var { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.card.id + (props.fake ? 9999 : 0),
    });

    function isCardVisible() {
        if (props.expand) return true; // Always visible in expanded zones (e.g. search zone)

        switch (props.where) {
            case "hand":
                if (props.who == role) {
                    // Our hand
                    return props.card.visible;
                }
                else {
                    // Opponent's hand
                    return props.card.revealed;
                }
            case "library":
                return props.card.revealed;
            default:
                return props.card.visible;
        }
    }

    function onTapUntap() {
        dispatch({ type: "TAP_CARD", payload: { who: props.who, where: props.where, card: props.card } });
    }
    function onSendToGraveyard() {
        dispatch({
            type: "MOVE_CARD", payload: {
                fromWho: props.who,
                fromWhere: props.where,
                toWho: props.who,
                toWhere: "graveyard",
                card: props.card,
                oldIndex: props.index,
                newIndex: 99999 /* ToDo: get actual length of graveyard */
            }
        });
    }
    function onDuplicate() {
        dispatch({ type: "ADD_CARD", payload: { who: props.who, where: props.where, card: getNewCardWithName(props.card.name) } });
    }
    function onDelete() {
        dispatch({ type: "REMOVE_CARD", payload: { who: props.who, where: props.where, card: props.card } });
    }
    function onSearchZone() {
        dispatch({ type: "SET_SEARCH_ZONE", payload: { who: props.who, where: props.where } });
    }
    function onShuffleLibrary() {
        dispatch({ type: "SHUFFLE_LIBRARY" });
    }

    var style = {
        translate: CSS.Translate.toString(transform),
        rotate: props.card.tapped ? "90deg" : "0deg",
        backgroundImage: isCardVisible() ? `url(${image})` : `url(${card_back})`,
        marginLeft: props.card.tapped ? "1.6em" : undefined,
        marginRight: props.card.tapped ? "1.6em" : undefined,
        transition
    };

    useEffect(() => {
        fetchCardByName(props.card.name, setImage);
    }, [props.card.name]);

    if (props.fake) {
        return (
            <div style={style} className="card" />
        );
    }

    return (
        <Fragment>
            <div style={style} className="card" ref={setNodeRef} {...listeners} {...attributes} onContextMenu={(ev) => { ev.stopPropagation(); show({ event: ev }); }}>
                {props.card.counters.plusone != 0 && (
                    <div class className="card-counter-area-plus-one">
                        <p>{props.card.counters.plusone > 0 ? '+' : ''}{props.card.counters.plusone}/{props.card.counters.plusone > 0 ? '+' : ''}{props.card.counters.plusone}</p>
                    </div>
                )}
                {props.card.counters.generic != 0 && (
                    <div className="card-counter-area-generic">
                        <p>{props.card.counters.generic}</p>
                    </div>
                )}
            </div>
            {createPortal(
                <Menu id={id}>
                    <Item disabled>{isCardVisible() ? props.card.name : "(hidden)"}</Item>
                    {props.where == "library" || props.where == "graveyard" || props.where == "exile" ? <Item onClick={onSearchZone}>Search Zone</Item> : null}
                    <Separator />
                    <Item disabled={props.where != "battlefield" && props.where != "lands"} onClick={onTapUntap} >{props.card.tapped ? "Untap" : "Tap"}</Item>
                    <Submenu label="Counters" disabled={props.where != "battlefield" && props.where != "lands"}>
                        <Item>Add +1/+1 counter</Item>
                        <Item>Remove +1/+1 counter</Item>
                        <Item>Add generic counter</Item>
                        <Item>Remove generic counter</Item>
                    </Submenu>
                    <Separator />
                    <Item onClick={onDuplicate}>Duplicate</Item>
                    <Item>{props.card.revealed ? "Hide" : "Reveal"}</Item>
                    <Item onClick={onSendToGraveyard}>Send to graveyard</Item>
                    <Item onClick={onDelete}>Delete</Item>
                    {props.where === "library" && <Separator />}
                    {props.where === "library" && <Item onClick={onShuffleLibrary}>Shuffle</Item>}
                </Menu>
                , document.body)}
        </Fragment>
    );
}