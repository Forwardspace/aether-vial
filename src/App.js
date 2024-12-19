import { DndContext, rectIntersection } from '@dnd-kit/core';
import { useEffect, useId, useRef } from "react";
import { useState } from "react";
import arrayShuffle from 'array-shuffle';

import './App.css';
import "./PlayArea.css"

import { EnemyPlayArea } from "./playareas/enemyplayarea/EnemyPlayArea.js"
import { PlayerPlayArea } from "./playareas/playerplayarea/PlayerPlayArea.js"
import { WelcomeModal } from "./welcomemodal/WelcomeModal.js"
import { NewCardModal } from "./newcardmodal/NewCardModal.js"
import { FullAreaViewModal } from "./fullareaviewmodal/FullAreaViewModal.js"
import { ImportModal } from "./importmodal/ImportModal.js"
import { receiveData, sendCardData, sendEndTurn } from "./netdata/netdata.js"

import { Peer } from "peerjs"

var peer = new Peer();

function App() {
  // State list of cards in play
  var [cards, setCards] = useState([]);

  // Various game state variables
  var [state, setState] = useState({
    isConnected: true,
    isAwaitingConnection: false,

    isEnemyTurn: false,
    isNewCardModalOpen: false,
    isFullAreaViewModalOpen: false,
    fullAreaName: "",
    isImportModalOpen: true,

    isControlButtonPressed: false
  });

  function getLastIndex(location) {
    var relevant = cards.filter(card => card.location == location).sort((a, b) => a.index - b.index);
    if (relevant.length == 0) {
      return -1;
    }
    return relevant[relevant.length - 1].index;
  }
  
  const stateRef = useRef(state);
  const cardsRef = useRef(cards);
  stateRef.current = state;
  cardsRef.current = cards;

  // Various handlers

  const onDragEnd = ({ active, over }) => {
    if (over == null) {
      return;
    }

    var newCards = cardsRef.current.slice().map(card => {
      if (card.id == active.id) {
        if (card.location != over.data.current.name) {
          // Move the card to the new location
          // and reset its visibility
          return {...card, 
            location: over.data.current.name,
            index: getLastIndex(over.data.current.name) + 1,
            visibility_override: false
          };
        }
      }
      return card;
    });

    if (stateRef.current.isControlButtonPressed) {
      var temp = newCards.find(card => card.id == active.id);
      newCards = newCards.filter(card => card.id != active.id);

      newCards = [temp].concat(newCards);
    }

    setCards(newCards);
    sendCardData(peer, newCards);

    window.currentlyDragging = null;
  };
  const onDragStart = ({active}) => {
    window.currentlyDragging = active.id;
  }

  // Setup handling of key presses globally
  function handleKeyDown(event) {
    if (event.code == "ControlLeft") {
      setState({...stateRef.current, isControlButtonPressed: true});
    }

    if (event.code == "Space") {
      if (event.shiftKey) {
        // Open the new card modal
        setState({...stateRef.current, isNewCardModalOpen: true});

        return;
      }

      // Tap the currently dragging card
      var newCards = cardsRef.current.slice().map(card => {
        if (card.id == window.currentlyDragging) {
          card.tapped = !card.tapped;
        }
        return card;
      });
      setCards(newCards);
      sendCardData(peer, newCards);
    }
    else if (event.code == "Tab") {
      // Untap all cards belonging to the player
      if (event.shiftKey) {
        // Flip the card's visibility
        var newCards = cardsRef.current.slice().map(card => {
          if (card.id == window.currentlyDragging) {
            return {...card, visibility_override: !card.visibility_override};
          }
          return {...card};
        });

        setCards(newCards);
        sendCardData(peer, newCards);
        return;
      }

      var newCards = cardsRef.current.slice().map(card => {
        if (card.location.startsWith("player")) {
          card.tapped = false;
        }
        return card;
      });
      setCards(newCards);
      sendCardData(peer, newCards);
    }
    else if (event.code == "Enter") {
      setState({...stateRef.current, isEnemyTurn: !stateRef.current.isEnemyTurn});
      sendEndTurn(peer);
    }
    else if (event.code == "Delete") {
      var newCards = cardsRef.current.slice().filter(card => card.id != window.currentlyDragging);
      setCards(newCards);
      sendCardData(peer, newCards);
    }
    else if (event.code == "AltLeft") {
      if (window.currentlyDragging == null) {
        if (stateRef.current.isFullAreaViewModalOpen) {
          setState({...stateRef.current, isFullAreaViewModalOpen: false});
        }

        return;
      }

      var location = cardsRef.current.find(card => card.id == window.currentlyDragging).location;

      if (!location.includes("graveyard") && !location.includes("exile") && !location.includes("library")) {
        return;
      }

      setState({...stateRef.current, isFullAreaViewModalOpen: !stateRef.current.isFullAreaViewModalOpen, fullAreaName: location});
    }
    else if (event.code == "KeyF") {
      var newCards = cardsRef.current.slice().concat({
        id: Math.round(Math.random() * 1000000),
        name: "Fblthp, the Lost", 
        location: "player_battlefield", 
        tapped: false,
        visible: true, 
        visibility_override: false, 
        index: cardsRef.current.filter(card => card.location == "player_battlefield").length
      });

      setCards(newCards);
      sendCardData(peer, newCards);
    }
    else if (event.code == "KeyS") {
      // Shuffle the library
      var libraryShuffled = arrayShuffle(cardsRef.current.filter(card => card.location == "player_library"));
      var otherCards = cardsRef.current.filter(card => card.location != "player_library");

      for (var i = 0; i < libraryShuffled.length; i++) {
        libraryShuffled[i].index = i;
      }

      setCards(otherCards.concat(libraryShuffled));
      sendCardData(peer, otherCards.concat(libraryShuffled));
    }
  };

  function handleKeyUp(event) {
    if (event.code == "ControlLeft") {
      setState({...stateRef.current, isControlButtonPressed: false});
    }
  }

  function handleData(data, isHost) {
    receiveData(data, isHost, stateRef.current, setState, cardsRef.current, setCards);
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    document.addEventListener("keyup", handleKeyUp, false);
    return () => { document.removeEventListener("keydown", handleKeyDown); document.removeEventListener("keyup", handleKeyUp); }
  }, [cards, state]);

  // Render the app

  return (
    <div className="App">
      { !state.isConnected && <WelcomeModal peer={peer} state={stateRef} setState={setState} handleData={handleData} cards={cardsRef}/> }
      { state.isNewCardModalOpen && <NewCardModal state={stateRef} setState={setState} cards={cardsRef} setCards={setCards} sendCardData={sendCardData.bind(this, peer)}/> }
      { state.isImportModalOpen && <ImportModal state={stateRef} setState={setState} cards={cardsRef} setCards={setCards} sendCardData={sendCardData.bind(this, peer)}/> }
      <DndContext onDragEnd={onDragEnd} onDragStart={onDragStart} autoScroll={false}>
        { state.isFullAreaViewModalOpen && <FullAreaViewModal state={stateRef} setState={setState} cards={cardsRef} setCards={setCards} name={state.fullAreaName}/> }
        <EnemyPlayArea isEnemyTurn={state.isEnemyTurn} cards={cardsRef} setCards={setCards} ></EnemyPlayArea>
        <PlayerPlayArea isEnemyTurn={state.isEnemyTurn} cards={cardsRef} setCards={setCards}></PlayerPlayArea>
      </DndContext>
    </div>
  );
}

export default App;