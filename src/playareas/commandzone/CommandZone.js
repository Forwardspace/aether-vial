import { Card } from "../../card/Card";
import { useId } from "react";
import { useDroppable } from "@dnd-kit/core";

export function CommandZone(props) {
    const {isOver, setNodeRef} = useDroppable({
        id: useId(),
        data: { name: props.enemy? "enemy_commandzone" : "player_commandzone" }
    });

    const style = {
        backgroundColor: isOver ? '#233e1e' : undefined,
    };

    var relevantCards = props.cards.current.filter(card => card.location == (props.enemy? "enemy_commandzone" : "player_commandzone")).sort((a, b) => a.index - b.index);

    return (
        <div style={style} className="play-area-command-zone" ref={setNodeRef}>
            { relevantCards.length == 0 ? (<p>Command zone</p>) : relevantCards.map(card => <Card card={card}></Card>) }
        </div>
    );
}