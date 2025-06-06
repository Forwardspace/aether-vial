import "./PlayArea.css";
import { Zone } from "../zone/Zone"; 
import { SwapSpectatorButtons } from "./SwapSpectatorButtons";

import { useSelector } from 'react-redux';

export default function PlayArea(props) {
    var us = useSelector(state => state["local"]["role"]);
    var enemy = useSelector(state => state["local"]["spectating"]);

    if (!us || !enemy) {
        return null; // Don't render the play area if we don't have roles set
    }

    return (
        <div className="play-area-container">
            <div className="play-area">
                <SwapSpectatorButtons />
                <div className="battlefield-area">
                    <Zone className="lands" name_human_readable="Lands" where="lands" who={enemy}/>
                    <Zone className="battlefield" name_human_readable="Battlefield" where="battlefield" who={enemy}/>
                    <Zone className="battlefield battlefield-lower" name_human_readable="Battlefield" where="battlefield" who={us}/>
                    <Zone className="lands" name_human_readable="Lands" where="lands" who={us}/>
                </div>
                <div className="other-zones">
                    <Zone className="graveyard" name_human_readable="Graveyard" where="graveyard" who={enemy}/>
                    <Zone className="exile" name_human_readable="Exile" where="exile" who={enemy}/>
                    <Zone className="exile" name_human_readable="Exile" where="exile" who={us}/>
                    <Zone className="graveyard" name_human_readable="Graveyard" where="graveyard" who={us}/>
                </div>
                <div className="other-zones">
                    <Zone className="library" name_human_readable="Library" where="library" who={enemy}/>
                    <Zone className="command-zone" name_human_readable="Command Zone" where="commandzone" who={enemy}/>
                    <Zone className="command-zone" name_human_readable="Command Zone" where="commandzone" who={us}/>
                    <Zone className="library" name_human_readable="Library" where="library" who={us}/>
                </div>
            </div>
        </div>
    );
}