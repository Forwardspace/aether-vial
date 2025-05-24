import "./HandDrawer.css";

import { ReactComponent as ExpandButton } from "../res/expand_button.svg";

import { useEffect } from "react";
import { useSelector } from "react-redux";

import { Zone } from "../zone/Zone";
import { useDroppable } from "@dnd-kit/core";

import { useMouse } from "@uidotdev/usehooks";

export function HandDrawer(props) {
    useEffect(() => {
    window.scrollTo(0, 0)
    }, [])

    var who = useSelector(state => state["local"]["role"]);

    const { isOver, setNodeRef } = useDroppable({
        id: props.where + '_' + props.who,
    });

    var styleDrawer = {}
    var styleButton = {}

    var open = false;
    var [mouse, ref] = useMouse();
    if (mouse.elementY > 0 && mouse.elementY < ref.current?.offsetHeight) {
        open = true;
    }

    if (props.who != who) {
        styleDrawer = {
            transform: open ? "translate(0px, 0px)" : "translate(0px, -15vh)",
            top: "0",
            left: "0",
            transition: "transform 0.2s",
        }
        styleButton = {
            bottom: "-20px",
            left: "0px",
        }
    }
    else {
        styleDrawer = {
            transform: open ? "translate(0px, 0px)" : "translate(0px, 15vh)",
            bottom: "0",
            left: "0",
            transition: "transform 0.2s",
        }
        styleButton = {
            top: "-20px",
            left: "0px",
        }
    }

    return (
        <div ref={ref} className="card-drawer" style={styleDrawer} >
            <ExpandButton style={styleButton} className="card-drawer-button" />
            <Zone className="card-drawer-container" name_human_readable="Hand" where="hand" who={props.who}/>
        </div>
    );
}