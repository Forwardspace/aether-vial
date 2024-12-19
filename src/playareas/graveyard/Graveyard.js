import { Card } from "../../card/Card";
import { useId } from "react";
import { useDroppable } from "@dnd-kit/core";

export function Graveyard(props) {
    const {isOver, setNodeRef} = useDroppable({
        id: useId(),
        data: { name: props.enemy? "enemy_graveyard" : "player_graveyard" }
    });

    var relevantCards = props.cards.current.filter(card => card.location == (props.enemy? "enemy_graveyard" : "player_graveyard")).sort((a, b) => a.index - b.index);

    const style = {
        backgroundColor: isOver ? '#233e1e' : undefined,
        filter: relevantCards.length > 1? "drop-shadow(4px 12px 0px #000000)" : undefined
    };


    return (
        <div style={style} className="play-area-graveyard" ref={setNodeRef}>
            { relevantCards.length == 0 ? (<p>Graveyard</p>) : <Card card={relevantCards[relevantCards.length - 1]} style={style}></Card> }
        </div>
    );
}