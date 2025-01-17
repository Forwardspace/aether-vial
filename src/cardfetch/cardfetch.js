
import placeholder from "../res/placeholder.jpg";

var queue = []
var cache = {}

export function fetchCardByName(name, setImage) {
    if (cache[name] != undefined) {
        setImage(cache[name]);
        return;
    }

    queue.push({name, setImage})
    
    return;
}

var id = setInterval(() => {
    if (queue.length == 0) {
        return;
    }

    var {name, setImage} = queue.shift();
    fetchCardByNameNonThrottled(name, setImage);
}, 100);

export function fetchCardByNameNonThrottled(name, setImage) {
    function getCardImageURIFromData(data) {
        if (data.card_faces != undefined && data.image_uris == undefined) {
            // Multi-faced card, select proper face
            for (var face of data.card_faces) {
                if (face.name == name) {
                    return face.image_uris.normal;
                }
            }
            return placeholder;
        }
        return data.image_uris.normal != undefined ? data.image_uris.normal : placeholder;
    }

    return fetch(`https://api.scryfall.com/cards/named?fuzzy=${name}`)
        .then(response => response.json())
        .then(data => getCardImageURIFromData(data))
        .then(url => { setImage(url); cache[name] = url; });
}