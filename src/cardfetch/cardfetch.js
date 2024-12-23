
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
    return fetch(`https://api.scryfall.com/cards/named?fuzzy=${name}`)
        .then(response => response.json())
        .then(data => data.image_uris != undefined ? data.image_uris.normal : placeholder)
        .then(url => { setImage(url); cache[name] = url; });
}