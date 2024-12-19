
import { Battlefield } from "../battlefield/Battlefield.js";
import { CommandZone } from "../commandzone/CommandZone.js";
import { Exile } from "../exile/Exile.js";
import { Graveyard } from "../graveyard/Graveyard.js";
import { Lands } from "../lands/Lands.js";
import { Library } from "../library/Library.js";
import { EnemyHand } from "../enemyhand/EnemyHand.js";

export function EnemyPlayArea(props) {
    const style = {
        opacity: props.isEnemyTurn ? 1 : 0.6
    };

    return (
        <div className="play-area" style={style}>
            <EnemyHand cards={props.cards}/>
            <div className="play-area-grid">
                <div className="play-area-row">
                    <Lands cards={props.cards} enemy={true}/>
                    <Library cards={props.cards} enemy={true}/>
                    <Graveyard cards={props.cards} enemy={true}/>
                </div>
                <div className="play-area-row">
                    <Battlefield cards={props.cards} enemy={true}/>
                    <CommandZone cards={props.cards} enemy={true}/>
                    <Exile cards={props.cards} enemy={true}/>
                </div>
            </div>
        </div>
    );
}