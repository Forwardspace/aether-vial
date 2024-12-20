
import React from 'react';

import { sendCounterData } from '../../netdata/netdata';

import './CounterArea.css';

export function CounterArea(props) {
    var lifeValue = props.enemy ? props.state.current.enemyLife : props.state.current.playerLife;
    var taxValue = props.enemy ? props.state.current.enemyTax : props.state.current.playerTax;

    function setLifeValue(value) {
        var newState = { ...props.state.current };

        if (props.enemy) {
            newState.enemyLife = value;
        } else {
            newState.playerLife = value;
        }

        props.setState(newState);
        sendCounterData(props.peer, newState);
    }

    function setTaxValue(value) {
        var newState = { ...props.state.current };

        if (props.enemy) {
            newState.enemyTax = value;
        } else {
            newState.playerTax = value;
        }

        props.setState(newState);
        sendCounterData(props.peer, newState);
    }

    return (
        <div className="counter-area-container">
            <div className="counter-area life-counter">
                <button className="counter-button life-counter" onClick={() => { setLifeValue(lifeValue + 1) }}>+</button>
                <input type="number" className="counter-input life-counter" value={lifeValue} onChange={(ev) => { setLifeValue(Number(ev.target.value)) }} />
                <button className="counter-button life-counter" onClick={() => { setLifeValue(lifeValue - 1) }}>-</button>
            </div>
            <div className="counter-area tax-counter">
                <button className="counter-button tax-counter" onClick={() => { setTaxValue(taxValue + 1) }}>+</button>
                <input type="number" className="counter-input tax-counter" value={taxValue} onChange={(ev) => { setTaxValue(Number(ev.target.value)) }} />
                <button className="counter-button tax-counter" onClick={() => { setTaxValue(taxValue - 1) }}>-</button>
            </div>
        </div>
    );
}