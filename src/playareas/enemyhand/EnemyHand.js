import { useId, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";

import { Card } from "../../card/Card";

import "./EnemyHand.css";

export function EnemyHand(props) {
    var [collapsed, setCollapsed] = useState(true);

    const {isOver, setNodeRef} = useSortable({
        id: useId(),
        data: { name: "enemy_hand" }
    });

    const style = {
        backgroundColor: isOver ? '#233e1e' : undefined,
        transform: collapsed? "translate(0vw, -12vh)" : undefined,
    };

    return (
        <div className="enemy-play-area-hand" ref={setNodeRef} style={style} onMouseOver={() => setCollapsed(false)} onMouseOut={() => setCollapsed(true)}>
            {
                props.cards.current.filter(card => card.location == "enemy_hand").sort((a, b) => a.index - b.index).map(card => (
                    <div className="hand-card-container">
                        <Card card={card}></Card>
                    </div>
                ))
            }
        </div>
    )
}