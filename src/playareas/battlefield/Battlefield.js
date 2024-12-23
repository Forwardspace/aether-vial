import { Card, CardShowcase } from "../../card/Card";
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

    var content = null;
    if (relevantCards.length == 0) {
        content = <p>Battlefield</p>;
    }
    else if (props.state.current.isFullAreaViewModalOpen) {
        content = relevantCards.slice(0, 8).map(card => (<CardShowcase card={card}/>));
        if (relevantCards.length > 8) {
            content.push(<p>And {relevantCards.length - 8} more...</p>);
        }
    }
    else {
        content = relevantCards.slice(0, 8).map(card => (<Card card={card}/>));
        if (relevantCards.length > 8) {
            content.push(<p>And {relevantCards.length - 8} more...</p>);
        }
    }

    return (
        <SortableContext items={relevantCards}>
            <div style={style} className="play-area-battlefield" ref={setNodeRef}>
                {content}
            </div>
        </SortableContext>
    );
}