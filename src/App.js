import PlayArea from "./playarea/PlayArea";
import { store } from "./state/store.js";

import { SearchZone } from "./zone/SearchZone.jsx";

import React, { useState, useEffect, useRef } from "react";
import { connect, Provider, useSelector } from "react-redux";

import "./App.css";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";

import { moveCard } from "./state/gameStateReducer.js"
import { Card } from "./card/Card.jsx";
import { HandDrawer } from "./handdrawer/HandDrawer.jsx";
import { WelcomeScreen } from "./welcome/WelcomeScreen.jsx";

import { getCardLocation, getNewCardWithName } from "./state/gameStateReducer.js";

import { Peer } from "peerjs";

export var peer = new Peer();
var isControlPressed = false;

function onDragStart(event, setDraggedItem) {
  const { fromWhere, fromWho } = getCardLocation(store.getState(), event.active.id);

  setDraggedItem(store.getState().common[fromWho]["zones"][fromWhere].find(card => card.id === event.active.id));
}

function onDragEnd(event, setDraggedItem) {
  const { active, over } = event;

  if (over == null) {
    return;
  }

  store.dispatch(moveCard(store.getState(), active.id, over.id, isControlPressed));
  setDraggedItem(null);
}

function onKeydown(who, e) {
  if (e.key == "Control") {
    isControlPressed = true;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    store.dispatch({ type: "ADD_CARD", payload: { who: "host", where: "battlefield", card: getNewCardWithName("Black Lotus") } });
  }
  else if (e.key === 'Tab') {
    e.preventDefault();
    store.dispatch({ type: "UNTAP_ALL", payload: { who: who } });
  }
}

function onKeyup(e) {
  if (e.key == "Control") {
    isControlPressed = false;
  }
}

function customIntersection({ droppableContainers, ...args }) {
  // Prioritize intersection for hand drawers
  const rectIntersectionCollisions = rectIntersection({
    ...args,
    droppableContainers: droppableContainers.filter((container) => typeof container.id == "string" && container.id.includes("hand")),
  });

  if (rectIntersectionCollisions.length > 0) {
    return rectIntersectionCollisions;
  }

  // Fallback to default intersection detection for other zones
  return rectIntersection({
    ...args,
    droppableContainers: droppableContainers,
  });
}

function App() {
  var [peerId, setPeerId] = useState(null);

  peer.on('open', function (id) {
    setPeerId(id);
  });

  peer.on('connection', function (connection) {
    store.dispatch({ type: "SET_ROLE", payload: "host" });
    store.dispatch({ type: "SET_CONNECTED", payload: true });

    connection.on('open', function () {
      connection.on('data', function (data) {
        data["origin"] = "remote";
        store.dispatch(data);
      });

      store.dispatch({ type: "UPDATE_COMMON_STATE" });
    });
  });
  function connectTo(peerId) {
    var connection = peer.connect(peerId);
    connection.on('open', function () {
      store.dispatch({ type: "SET_ROLE", payload: "client" });
      store.dispatch({ type: "SET_CONNECTED", payload: true });

      connection.on('data', function (data) {
        data["origin"] = "remote";
        store.dispatch(data);
      });
    });
  }

  var [draggedItem, setDraggedItem] = useState(null);
  var who = store.getState().local.role;
  var enemy = (who === "host" ? "client" : "host");

  useEffect(() => {
    window.removeEventListener('keydown', onKeydown); window.addEventListener('keydown', onKeydown.bind(this, who));
    window.removeEventListener('keyup', onKeyup); window.addEventListener('keyup', onKeyup);
  }, [])

  return (
    <Provider store={store}>
      <WelcomeScreen hostId={peer.id} connectTo={connectTo} />
      <DndContext onDragStart={(event) => onDragStart(event, setDraggedItem)} onDragEnd={(event) => onDragEnd(event, setDraggedItem)} collisionDetection={customIntersection}>

        <HandDrawer who={enemy} />
        <PlayArea />
        <HandDrawer who={who} />

        <DragOverlay style={{ opacity: 0.7 }}>
          {draggedItem &&
            (<Card card={draggedItem} />)
          }
        </DragOverlay>
        <SearchZone />
      </DndContext>
    </Provider>
  );
}

export default App;