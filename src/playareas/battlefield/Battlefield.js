import { Card } from "../../card/Card";
import { useId } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

export function Battlefield(props) {
    const {isOver, setNodeRef} = useDroppable({
        id: useId(),
        data: { name: props.enemy? "enemy_battlefield" : "player_battlefield" }
    });

    const style = {
        backgroundColor: isOver ? '#233e1e' : undefined,
    };

    var relevantCards = props.cards.current.filter(card => card.location == (props.enemy? "enemy_battlefield" : "player_battlefield")).sort((a, b) => a.index - b.index);

    return (
        <SortableContext items={relevantCards}>
            <div style={style} className="play-area-battlefield" ref={setNodeRef}>
                { relevantCards.length == 0 ? (<p>Battlefield</p>) : relevantCards.map(card => <Card card={card}></Card>) }
            </div>
        </SortableContext>
    );
}