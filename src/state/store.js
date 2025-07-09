import { configureStore } from '@reduxjs/toolkit'
import { metaStateReducer } from './metaStateReducer' 
import { gameStateReducer } from './gameStateReducer'

import { peer } from '../App.js';

const initialState = {
    local: {
        numPlayers: 2,

        role: null,
        spectating: null,
        
        hostId: null,
        isConnectedOrInDemoMode: false,
        searchZone: null
    },
    common: {
        host: {
            state: {
                health: 40,
                infect: 0,
                tax: 0
            },
            zones: {
                hand: [],
                battlefield: [],
                lands: [],
                graveyard: [],
                exile: [],
                library: [],
                commandzone: []
            }
        },
        client1: {
            state: {
                health: 40,
                infect: 0,
                tax: 0
            },
            zones: {
                hand: [],
                battlefield: [],
                lands: [],
                graveyard: [],
                exile: [],
                library: [],
                commandzone: []
            }
        }
    }
}

function rootReducer(state, action) {
    if (state == undefined) {
        return initialState;
    }

    // Check if we're recieving the common state from the remote peer
    if (action.origin && action.type == "UPDATE_COMMON_STATE") {
        if (action.origin == "host" || state.local.role == "host") {
            return {...state, common: action.payload};
        }
    }

    switch (action.type) {
        case "SET_ROLE":
        case "SET_HOST_ID":
        case "SET_CONNECTED":
        case "SET_SPECTATING":
        case "SET_HOST_HEALTH":
        case "SET_HOST_INFECT":
        case "SET_HOST_TAX":
        case "SET_CLIENT_HEALTH":
        case "SET_CLIENT_INFECT":
        case "SET_CLIENT_TAX":
        case "SET_SEARCH_ZONE":
        case "SET_NUM_PLAYERS":
            return metaStateReducer(state, action);

        case "SETUP_DEMO_STATE":
        case "ADD_CARD":
        case "REMOVE_CARD":
        case "MOVE_CARD":
        case "IMPORT_DECK":
        case "SET_LIBRARY":
        case "TAP_CARD":
        case "UNTAP_ALL":
        case "SHUFFLE_LIBRARY":
            return gameStateReducer(state, action);
        
        default:
            return (state == undefined) ? initialState : state;
    }
}

function reduceAndSend(state, action) {
    var newState = rootReducer(state, action);

    if (action["origin"] != "host" && state && state.local.isConnectedOrInDemoMode) {
        var connections = Object.values(peer.connections);
        for (var i = 0; i < connections.length; i++) {
            var peerId = connections[i][0].peer;

            if (action.type == "SET_NUM_PLAYERS") {
                peer.connections[peerId][0].send({...action, origin: state.local.role});
            }
            else {
                peer.connections[peerId][0].send({type: "UPDATE_COMMON_STATE", payload: newState.common, origin: state.local.role});
            }
        }
    }

    return newState;
}

export var store = configureStore({ reducer: reduceAndSend }, initialState)