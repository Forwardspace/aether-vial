function deepCopyState(state) {
    return JSON.parse(JSON.stringify(state));
}

export function gameStateReducer(state, action) {
    var newState = deepCopyState(state);
    
    switch (action.type) {
        case "SETUP_DEMO_STATE":
            newState.common = getDemoState(); return newState;
        case "ADD_CARD":
            newState.common[action.payload.who]["zones"][action.payload.where].push(action.payload.card); return newState;
        case "REMOVE_CARD":
            newState.common[action.payload.who]["zones"][action.payload.where] = newState.common[action.payload.who]["zones"][action.payload.where].filter(
                card => card.id !== action.payload.card.id
            ); return newState;
        case "MOVE_CARD":
            if (action.payload.fromWho === action.payload.toWho && action.payload.fromWhere === action.payload.toWhere) {
                // Reorder within zone
                newState.common[action.payload.fromWho]["zones"][action.payload.fromWhere].splice(
                    action.payload.newIndex,
                    0,
                    newState.common[action.payload.fromWho]["zones"][action.payload.fromWhere].splice(action.payload.oldIndex, 1)[0]
                );
            }
            else {
                // Move to another zone
                var card = deepCopyState(action.payload.card);

                // If we're moving to the library, make the card not visible and not revealed by default
                if (action.payload.toWhere === "library") {
                    card.visible = false;
                    card.revealed = false;
                }

                // Likewise, if we're moving from the library, make the card visible by default
                if (action.payload.fromWhere === "library") {
                    card.visible = true;
                    card.revealed = false
                }

                // Untap the card
                card.tapped = false;

                newState.common[action.payload.fromWho]["zones"][action.payload.fromWhere].splice(
                    action.payload.oldIndex,
                    1
                );
                newState.common[action.payload.toWho]["zones"][action.payload.toWhere].splice(
                    action.payload.newIndex,
                    0,
                    card
                );
            }
            return newState;
        case "IMPORT_DECK":
            // Uses MTG online import format
            var cards = action.payload.decklist.split("\n");
            var newCards = [];

            for (var i = 0; i < cards.length; i++) {
                if (cards[i].trim() == "") {
                    continue;
                }

                var amount = parseInt(cards[i].split(" ")[0]);
                var name = cards[i].split(" ").slice(1).join(" ");

                for (var j = 0; j < amount; j++) {
                    newCards.push(getNewCardWithName(name));
                }
            }

            newState.common[action.payload.who]["zones"]["library"] = newCards; return newState;
        case "SET_LIBRARY":
            newState.common[action.payload.who]["zones"]["library"] = action.payload.cards; return newState
        case "SHUFFLE_LIBRARY":
            newState.common[newState.local.role].zones.library = newState.common[newState.local.role].zones.library.sort(() => Math.random() - 0.5);
            return newState;
        case "TAP_CARD":
            // Don't tap cards in compressed zones
            if (action.payload.where != "battlefield" && action.payload.where != "lands") {
                return newState;
            }

            newState.common[action.payload.who]["zones"][action.payload.where] = newState.common[action.payload.who]["zones"][action.payload.where].map(
                card => {
                    if (card.id === action.payload.card.id) {
                        card.tapped = !card.tapped;
                    }
                    return card;
                }
            ); return newState;
        case "UNTAP_ALL":
            newState.common[newState.local.role]["zones"]["battlefield"] = newState.common[newState.local.role]["zones"]["battlefield"].map(
                card => {
                    card.tapped = false;
                    return card;
                }
            );
            newState.common[newState.local.role]["zones"]["lands"] = newState.common[newState.local.role]["zones"]["lands"].map(
                card => {
                    card.tapped = false;
                    return card;
                }
            ); return newState;
        default:
            return console.error("Unknown action in game state reducer!");
    }
}

export function getNewCardWithName(name) {
    return {id: Math.floor(Math.random() * (2**16)), name: name, tapped: false, visible: true, revealed: false, counters: {plusone: 0, generic: 0}};
}

export function getCardLocation(store, id) {
    var fromWhere = null;
    var fromWho = null;

    for (const [player, zones] of Object.entries(store.common)) {
        for (const [zone, cards] of Object.entries(zones.zones)) {
            if (cards.find(card => card.id === id)) {
                fromWhere = zone;
                fromWho = player;
                break;
            }
        }
        if (fromWhere !== null) {
            break;
        }
    }
    
    if (fromWhere === null) {
        console.error("Card not found in any zone!");
        return null;
    }

    return { fromWho, fromWhere };
}

export function moveCard(store, id, moveTo, lastCard=false) {
    // Find where the card is currently
    const { fromWho, fromWhere } = getCardLocation(store, id);

    var toWho, toWhere, oldIndex, newIndex;

    // Find out the index of the card in the current zone
    oldIndex = store.common[fromWho]["zones"][fromWhere].findIndex(card => card.id === id);

    if (typeof(moveTo) === "string") {
        // Move to a zone
        toWho = moveTo.split("_")[1];
        toWhere = moveTo.split("_")[0];

        // Find out the index of the card in the new zone
        newIndex = lastCard ? 0 : store.common[toWho]["zones"][toWhere].length;
    }
    else {
        // Move to a card
        // Find where the card is going
        const { fromWho, fromWhere } = getCardLocation(store, moveTo);
        toWho = fromWho; toWhere = fromWhere;

        // Find out the index of the card in the new zone
        newIndex = lastCard ? 0 : store.common[toWho]["zones"][toWhere].findIndex(card => card.id === moveTo);
    }

    return {
        type: "MOVE_CARD",
        payload: {
            card: store.common[fromWho]["zones"][fromWhere].find(card => card.id === id),
            fromWho: fromWho,
            fromWhere: fromWhere,
            toWho: toWho,
            toWhere: toWhere,
            oldIndex: oldIndex,
            newIndex: newIndex
        } 
    };
}

function getDemoState() {
    return {
        host: {
            state: {
                health: 28,
                infect: 0,
                tax: 0
            },
            zones: {
                hand: [getNewCardWithName("Forest"), getNewCardWithName("Forest"), getNewCardWithName("Wrenn and Realmbreaker"), getNewCardWithName("Reject Imperfection")],
                battlefield: [getNewCardWithName("Birds of Paradise"), getNewCardWithName("Binding the Old Gods")],
                lands: [getNewCardWithName("Forest"), getNewCardWithName("Swamp"), getNewCardWithName("Mana Confluence"), getNewCardWithName("Blood Crypt")],
                graveyard: [],
                exile: [],
                library: [getNewCardWithName("Swamp"), getNewCardWithName("Phyrexian Scriptures"), getNewCardWithName("Ondu Spiritdancer")],
                commandzone: [getNewCardWithName("Tom Bombadil")]
            }
        },
        client1: {
            state: {
                health: 35,
                infect: 0,
                tax: 0
            },
            zones: {
                hand: [getNewCardWithName("Plains"), getNewCardWithName("Ravenous Amulet")],
                battlefield: [getNewCardWithName("Annointed Procession"), getNewCardWithName("Warleader's Call"), getNewCardWithName("Cat Soldier"), getNewCardWithName("Sunspine Lynx")],
                lands: [getNewCardWithName("Mountain"), getNewCardWithName("Plains"), getNewCardWithName("Plains"), getNewCardWithName("Rogue's Passage")],
                graveyard: [],
                exile: [],
                library: [getNewCardWithName("Arid Mesa"), getNewCardWithName("Plains"), getNewCardWithName("Ajani Steadfast")],
                commandzone: [getNewCardWithName("Ajani, Nacatl Pariah")]
            }
        }
    }
}