
import { Battlefield } from "../battlefield/Battlefield.js";
import { CommandZone } from "../commandzone/CommandZone.js";
import { Exile } from "../exile/Exile.js";
import { Graveyard } from "../graveyard/Graveyard.js";
import { Lands } from "../lands/Lands.js";
import { Library } from "../library/Library.js";
import { PlayerHand } from "../playerhand/PlayerHand.js";
import { CounterArea } from "../counterarea/CounterArea.js";

export function PlayerPlayArea(props) {
    const style = {
        opacity: props.isEnemyTurn ? 0.5 : 1
    };

    return (
        <div className="play-area-container">
            <div className="play-area" style={style}>
                <div className="play-area-grid">
                    <div className="play-area-row">
                        <Battlefield cards={props.cards} enemy={false} state={props.state}/>
                        <CommandZone cards={props.cards} enemy={false} state={props.state}/>
                        <Exile cards={props.cards} enemy={false} state={props.state}/>
                    </div>
                    <div className="play-area-row">
                        <Lands cards={props.cards} enemy={false} state={props.state}/>
                        <Library cards={props.cards} enemy={false} state={props.state}/>
                        <Graveyard cards={props.cards} enemy={false} state={props.state}/>
                    </div>
                    <PlayerHand cards={props.cards} state={props.state}/>
                </div>
            </div>
            <CounterArea peer={props.peer} state={props.state} setState={props.setState} enemy={false}/>
        </div>
    );
}