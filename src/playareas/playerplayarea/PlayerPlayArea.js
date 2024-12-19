
import { Battlefield } from "../battlefield/Battlefield.js";
import { CommandZone } from "../commandzone/CommandZone.js";
import { Exile } from "../exile/Exile.js";
import { Graveyard } from "../graveyard/Graveyard.js";
import { Lands } from "../lands/Lands.js";
import { Library } from "../library/Library.js";
import { PlayerHand } from "../playerhand/PlayerHand.js";

export function PlayerPlayArea(props) {
    const style = {
        opacity: props.isEnemyTurn ? 0.5 : 1
    };

    return (
        <div className="play-area" style={style}>
            <div className="play-area-grid">
                <div className="play-area-row">
                    <Battlefield cards={props.cards} enemy={false}/>
                    <CommandZone cards={props.cards} enemy={false}/>
                    <Exile cards={props.cards} enemy={false}/>
                </div>
                <div className="play-area-row">
                    <Lands cards={props.cards} enemy={false}/>
                    <Library cards={props.cards} enemy={false}/>
                    <Graveyard cards={props.cards} enemy={false}/>
                </div>
                <PlayerHand cards={props.cards}/>
            </div>
        </div>
    );
}