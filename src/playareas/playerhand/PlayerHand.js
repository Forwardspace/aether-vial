import { useId, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";

import { Card } from "../../card/Card";

import "./PlayerHand.css";

export function PlayerHand(props) {
    var [collapsed, setCollapsed] = useState(true);

    const {isOver, setNodeRef} = useSortable({
        id: useId(),
        data: { name: "player_hand" }
    });

    const style = {
        backgroundColor: isOver ? '#233e1e' : undefined,
        transform: collapsed? "translate(0vw, 12vh)" : undefined,
    };

    return (
        <div className="play-area-hand" ref={setNodeRef} style={style} onMouseOver={() => setCollapsed(false)} onMouseOut={() => setCollapsed(true)}>
            {
                props.cards.current.filter(card => card.location == "player_hand").sort((a, b) => a.index - b.index).map(card => (
                    <div className="hand-card-container">
                        <Card card={card}></Card>
                    </div>
                ))
            }
        </div>
    )
}