
import placeholder from "../res/placeholder.jpg";

export async function fetchCardByName(name) {
    await new Promise((resolve) => setTimeout(resolve, 110))   // To conform to Scryfall's rate limit of less than 10 requests per second

    return fetch(`https://api.scryfall.com/cards/named?fuzzy=${name}`)
        .then(response => response.json())
        .then(data => data.image_uris != undefined ? data.image_uris.normal : placeholder);
}