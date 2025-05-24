import { configureStore } from '@reduxjs/toolkit'
import { metaStateReducer } from './metaStateReducer' 
import { gameStateReducer } from './gameStateReducer'

import { peer } from '../App.js';

const initialState = {
    local: {
        role: "host",
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
        client: {
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
    if (action["origin"] == "remote" && action["type"] == "UPDATE_COMMON_STATE") {
        return {...state, common: action.payload};
    }

    switch (action.type) {
        case "SET_ROLE":
        case "SET_HOST_ID":
        case "SET_CONNECTED":
        case "SET_HOST_HEALTH":
        case "SET_HOST_INFECT":
        case "SET_HOST_TAX":
        case "SET_CLIENT_HEALTH":
        case "SET_CLIENT_INFECT":
        case "SET_CLIENT_TAX":
        case "SET_SEARCH_ZONE":
            return metaStateReducer(state, action);

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

    if (action["origin"] != "remote" && state && state.local.isConnectedOrInDemoMode && peer.connections.length > 0) {
        var connection = Object.values(peer.connections)[0][0];
        connection.send({type: "UPDATE_COMMON_STATE", payload: newState.common});
    }

    return newState;
}

export var store = configureStore({ reducer: reduceAndSend }, initialState)