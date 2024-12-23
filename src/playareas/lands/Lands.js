import { Card, CardShowcase } from "../../card/Card";
import { useId } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

export function Lands(props) {
    const {isOver, setNodeRef} = useDroppable({
        id: useId(),
        data: { name: props.enemy? "enemy_lands" : "player_lands" }
    });

    const style = {
        backgroundColor: isOver ? '#233e1e' : undefined,
    };

    var relevantCards = props.cards.current.filter(card => card.location == (props.enemy? "enemy_lands" : "player_lands")).sort((a, b) => a.index - b.index);

    var content = null;
    if (relevantCards.length == 0) {
        content = <p>Lands</p>;
    }
    else if (props.state.current.isFullAreaViewModalOpen) {
        content = relevantCards.map(card => (<CardShowcase card={card}/>));
    }
    else {
        content = relevantCards.map(card => (<Card card={card}/>));
    }

    return (
        <SortableContext items={relevantCards}>
            <div style={style} className="play-area-lands" ref={setNodeRef}>
                {content}
            </div>
        </SortableContext>
    );
}