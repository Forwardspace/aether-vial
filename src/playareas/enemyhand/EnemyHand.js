import { useId, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";

import { Card, CardShowcase } from "../../card/Card";

import "./EnemyHand.css";

export function EnemyHand(props) {
    var [collapsed, setCollapsed] = useState(true);

    const {isOver, setNodeRef} = useSortable({
        id: useId(),
        data: { name: "enemy_hand" }
    });

    const style = {
        backgroundColor: isOver ? '#233e1e' : undefined,
        transform: collapsed? "translate(0vw, -18vh)" : "translate(0vw, -2vh)"
    };

    return (
        <div className="enemy-play-area-hand" ref={setNodeRef} style={style} onMouseOver={() => setCollapsed(false)} onMouseOut={() => setCollapsed(true)}>
            {
                props.cards.current.filter(card => card.location == "enemy_hand").sort((a, b) => a.index - b.index).map(card => (
                    <div className="hand-card-container">
                        {props.state.current.isFullAreaViewModalOpen? <CardShowcase card={card}/> : <Card card={card}/>}
                    </div>
                ))
            }
        </div>
    )
}