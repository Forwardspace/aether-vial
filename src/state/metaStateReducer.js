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
        default:
            console.error("Unknown action in local state reducer!");
    }

    return newState;
}