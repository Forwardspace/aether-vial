
import React from 'react';

import './CounterArea.css';

export function CounterArea() {
    var [lifeValue, setLifeValue] = React.useState(40);
    var [taxValue, setTaxValue] = React.useState(0);

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