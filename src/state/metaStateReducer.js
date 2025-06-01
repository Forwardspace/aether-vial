function deepCopyState(state) {
    return JSON.parse(JSON.stringify(state));
}

export function metaStateReducer(state, action) {
    var newState = deepCopyState(state);

    switch (action.type) {
        case "SET_ROLE":
            newState["local"]["role"] = action.payload; break;
        case "SET_HOST_ID":
            newState["local"]["hostId"] = action.payload; break;
        case "SET_CONNECTED":
            newState["local"]["isConnectedOrInDemoMode"] = action.payload; break;
        case "SET_SPECTATING":
            newState["local"]["spectating"] = action.payload; break;
        case "SET_SEARCH_ZONE":
            newState["local"]["searchZone"] = action.payload; break;
        case "SET_HOST_INFECT":
            newState["common"]["host"]["state"]["infect"] = action.payload; break;
        case "SET_HOST_TAX":
            newState["common"]["host"]["state"]["tax"] = action.payload; break;
        case "SET_HOST_HEALTH":
            newState["common"]["host"]["state"]["health"] = action.payload; break;
        case "SET_CLIENT_INFECT":
            newState["common"]["client"]["state"]["infect"] = action.payload; break;
        case "SET_CLIENT_TAX":
            newState["common"]["client"]["state"]["tax"] = action.payload; break;
        case "SET_CLIENT_HEALTH":
            newState["common"]["client"]["state"]["health"] = action.payload; break;
        case "SET_NUM_PLAYERS":
            // If we have no role, assume the role of the last client
            if (!newState["local"]["role"]) {
                newState["local"]["role"] = "client" + (action.payload - 1);
            }
            newState["local"]["numPlayers"] = action.payload;

            // Create blank state for the new client
            if (action.payload > 1 && newState["common"]["client" + (action.payload - 1)] === undefined) {
                newState["common"]["client" + (action.payload - 1)] = {
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
                };
            }; break;
        default:
            console.error("Unknown action in local state reducer!");
    }

    return newState;
}