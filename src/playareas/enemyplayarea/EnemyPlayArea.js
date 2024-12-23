
import { Battlefield } from "../battlefield/Battlefield.js";
import { CommandZone } from "../commandzone/CommandZone.js";
import { Exile } from "../exile/Exile.js";
import { Graveyard } from "../graveyard/Graveyard.js";
import { Lands } from "../lands/Lands.js";
import { Library } from "../library/Library.js";
import { EnemyHand } from "../enemyhand/EnemyHand.js";
import { CounterArea } from "../counterarea/CounterArea.js";

export function EnemyPlayArea(props) {
    const style = {
        opacity: props.isEnemyTurn ? 1 : 0.6
    };

    return (
        <div className="play-area-container">
            <div className="play-area" style={style}>
                <EnemyHand cards={props.cards} state={props.state}/>
                <div className="play-area-grid">
                    <div className="play-area-row">
                        <Lands cards={props.cards} enemy={true} state={props.state}/>
                        <Library cards={props.cards} enemy={true} state={props.state}/>
                        <Graveyard cards={props.cards} enemy={true} state={props.state}/>
                    </div>
                    <div className="play-area-row">
                        <Battlefield cards={props.cards} enemy={true} state={props.state}/>
                        <CommandZone cards={props.cards} enemy={true} state={props.state}/>
                        <Exile cards={props.cards} enemy={true} state={props.state}/>
                    </div>
                </div>
            </div>
            <CounterArea peer={props.peer} state={props.state} setState={props.setState} enemy={true}/>
        </div>
    );
}