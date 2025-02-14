import { Card } from "../../card/Card";
import { useId } from "react";
import { useDroppable } from "@dnd-kit/core";

export function Library(props) {
    const {isOver, setNodeRef} = useDroppable({
        id: useId(),
        data: { name: props.enemy? "enemy_library" : "player_library" }
    });

    var relevantCards = props.cards.current.filter(card => card.location == (props.enemy? "enemy_library" : "player_library")).sort((a, b) => a.index - b.index);

    const style = {
        backgroundColor: isOver ? '#233e1e' : undefined,
        filter: relevantCards.length > 1? "drop-shadow(4px 12px 0px #000000)" : undefined
    };

    return (
        <div style={style} className="play-area-library" ref={setNodeRef}>
            { relevantCards.length == 0 ? (<p>Library</p>) : <Card card={relevantCards[relevantCards.length - 1]} style={style}></Card> }
        </div>
    );
}