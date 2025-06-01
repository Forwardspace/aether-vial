import { useState, createRef, Fragment, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Card } from '../card/Card';

import { useDispatch, useSelector } from 'react-redux';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Separator, Item, Menu, useContextMenu } from 'react-contexify';

import "./Zone.css";
import { getNewCardWithName } from '../state/gameStateReducer';

export function Zone(props) {
    const us = useSelector(state => state["local"]["role"]);
    const relevantCards = useSelector(state => state["common"][props.who]["zones"][props.where]);
    const hostId = useSelector(state => state["local"]["hostId"]);
    var searchZone = useSelector(state => state["local"]["searchZone"]);

    const { isOver, setNodeRef } = useDroppable({
        id: props.where + '_' + props.who + (props.expand ? "_expand" : ""),
    });

    var menuId = Math.random().toString().slice(2);
    const { show } = useContextMenu({
        id: menuId
    });

    var [scroll, setScroll] = useState(0);
    var scrollContainerRef = createRef();
    var zoneContainerRef = createRef();
    function onScroll(e) {
        var xMin = zoneContainerRef.current.getBoundingClientRect().left;
        var xMax = zoneContainerRef.current.getBoundingClientRect().right;
        var scrollXMin = scrollContainerRef.current.getBoundingClientRect().left;
        var scrollXMax = scrollContainerRef.current.getBoundingClientRect().right;

        if ((xMax - xMin) > (scrollXMax - scrollXMin)) {
            setScroll(0);
            return; // Container fully visible
        }
        if (scrollXMin > (xMax - 100) && e.deltaY > 0) {
            return; // Container fully scrolled right
        }
        if (scrollXMax < (xMin + 100) && e.deltaY < 0) {
            return; // Container fully scrolled left
        }

        var position = scroll + e.deltaY * 0.33;
        setScroll(position);
        console.log(scroll);
    }

    var spawnCardRef = useRef();
    var importDeckRef = useRef();
    const dispatch = useDispatch();

    function onSpawnCard() {
        setSpawnCardModalOpen(false);

        var cardName = spawnCardRef.current.value;
        if (cardName === "") {
            return;
        }
        
        dispatch({ type: "ADD_CARD", payload: { who: props.who, where: props.where, card: getNewCardWithName(cardName) }});
    }
    function onImportDeck() {
        setImportDeckModalOpen(false);

        var decklist = importDeckRef.current.value;
        if (decklist === "") {
            return;
        }

        dispatch({ type: "IMPORT_DECK", payload: { who: us, decklist: decklist }});
    }

    var [spawnCardModalOpen, setSpawnCardModalOpen] = useState(false);
    var [importDeckModalOpen, setImportDeckModalOpen] = useState(false);
    var [gameDetailsModalOpen, setGameDetailsModalOpen] = useState(false);

    var style = {
        backgroundColor: isOver ? "rgba(0, 0, 150, 0.3)" : undefined,
        backgroundImage: isOver ? "none" : undefined
    };

    if (!us) {
        return null; // Not connected yet
    }

    // Special case - if this is the library/exile/graveyard, display the cards in a "stack" as a single card
    if (!props.expand && (props.where === "library" || props.where === "exile" || props.where === "graveyard") && relevantCards.length > 0) {
        return (
            <div className={relevantCards.length > 1 ? props.className + " zone_multiple" : props.className} ref={setNodeRef} style={style}>
                <SortableContext items={Array.of(relevantCards[relevantCards.length - 1].id)}>
                    <Card card={relevantCards[relevantCards.length - 1]} where={props.where} who={props.who} fake={searchZone && searchZone.where == props.where && searchZone.who == props.who}/>
                </SortableContext>
            </div>
        );
    }

    return (
        <Fragment>
            <div className={props.className} ref={(element) => { zoneContainerRef.current = element; setNodeRef(element); }} style={style} onWheel={onScroll} onContextMenu={(ev) => show({ event: ev })}>
                <div ref={scrollContainerRef} className="horizontal-container" style={{ transform: "translate(" + scroll + "px, 0px)" }}>
                    <SortableContext items={relevantCards.map(card => card.id)}>
                        {
                            (relevantCards.length > 0) ? relevantCards.map((card, index) => (
                                <Card card={card} key={card.id} where={props.where} who={props.who} index={index} scroll={scroll} expand={props.expand}/>
                            )) : props.name_human_readable
                        }
                    </SortableContext>
                </div>
            </div>

            {createPortal((
                <Menu id={menuId}>
                    <Item disabled>{props.name_human_readable}</Item>
                    <Separator />
                    <Item>Clear zone</Item>
                    <Separator />
                    <Item onClick={() => setSpawnCardModalOpen(true)}>Spawn card</Item>
                    <Item onClick={() => setImportDeckModalOpen(true)}>Import decklist to Library</Item>
                    <Item onClick={() => setGameDetailsModalOpen(true)}>Game details</Item>
                </Menu>
            ), document.body)}
            {spawnCardModalOpen && createPortal((
                <div className="modal-frame" onClick={() => setSpawnCardModalOpen(false)}>
                    <div className="spawn-modal-content" onClick={(ev) => ev.stopPropagation()}>
                        <h3>Spawn new card</h3>
                        <input ref={spawnCardRef} className="modal-input" type="text" placeholder="Card name" />
                        <button className="modal-button" onClick={() => onSpawnCard()}>Spawn</button>
                    </div>
                </div>
            ), document.body)}
            {importDeckModalOpen && createPortal((
                <div className="modal-frame" onClick={() => setImportDeckModalOpen(false)}>
                    <div className="import-modal-content" onClick={(ev) => ev.stopPropagation()}>
                        <h3>Import decklist</h3>
                        <textarea ref={importDeckRef} className="modal-textarea" placeholder="Decklist (if exporting from other sites, use the MTG Online export format)" />
                        <button className="modal-button" onClick={() => onImportDeck()}>Import</button>
                    </div>
                </div>
            ), document.body)}
            {gameDetailsModalOpen && createPortal((
                <div className="modal-frame" onClick={() => setGameDetailsModalOpen(false)}>
                    <div className="game-details-modal-content" onClick={(ev) => ev.stopPropagation()}>
                        <h3>Game Details</h3>
                        <p>Your role: {props.who}</p>
                        <button disabled={props.who != "host"} className="modal-button" onClick={() => {navigator.clipboard.writeText(hostId)}}>Copy Host ID</button>
                        <button className="modal-button" onClick={() => {}}>Backup Game State</button>
                        <button className="modal-button" onClick={() => {}}>Recover Game State</button>
                        <button className="modal-button" onClick={() => setGameDetailsModalOpen(false)}>Close</button>
                    </div>
                </div>
            ), document.body)}
        </Fragment>
    );
}