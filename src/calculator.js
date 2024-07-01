import React, { useState } from 'react';

function Calculator() {
    const [currentInput, setCurrentInput] = useState('');
    const [previousInput, setPreviousInput] = useState('');
    const [operator, setOperator] = useState(null);

    const handleButtonClick = (value, id) => {
        if (id === 'clear') {
            setCurrentInput('');
            setPreviousInput('');
            setOperator(null);
            return;
        }

        if (id === 'equals') {
            if (currentInput !== '' && previousInput !== '' && operator !== null) {
                const result = calculate(previousInput, currentInput, operator);
                setCurrentInput(result);
                setPreviousInput('');
                setOperator(null);
            }
            return;
        }

        if (['add', 'subtract', 'multiply', 'divide'].includes(id)) {
            if (currentInput === '') return;

            if (previousInput !== '') {
                const result = calculate(previousInput, currentInput, operator);
                setCurrentInput(result);
            }

            setOperator(value);
            setPreviousInput(currentInput);
            setCurrentInput('');
            return;
        }

        if (id === 'decimal') {
            if (currentInput.includes('.')) return;
        }

        setCurrentInput(currentInput + value);
    };

    const calculate = (a, b, operator) => {
        let result;

        switch (operator) {
            case '+':
                result = parseFloat(a) + parseFloat(b);
                break;
            case '-':
                result = parseFloat(a) - parseFloat(b);
                break;
            case '*':
                result = parseFloat(a) * parseFloat(b);
                break;
            case '/':
                result = parseFloat(a) / parseFloat(b);
                break;
            default:
                return '';
        }

        return result.toString();
    };

    return (
        <div className="container">
            <div id="display" className="row mb-2">{currentInput || previousInput}</div>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td colSpan="3"><button id="clear" className="btn btn-danger w-100" onClick={() => handleButtonClick('', 'clear')}>C</button></td>
                        <td><button id="divide" className="btn btn-secondary w-100" onClick={() => handleButtonClick('/', 'divide')}>/</button></td>
                    </tr>
                    <tr>
                        <td><button id="seven" className="btn btn-light w-100" onClick={() => handleButtonClick('7', 'seven')}>7</button></td>
                        <td><button id="eight" className="btn btn-light w-100" onClick={() => handleButtonClick('8', 'eight')}>8</button></td>
                        <td><button id="nine" className="btn btn-light w-100" onClick={() => handleButtonClick('9', 'nine')}>9</button></td>
                        <td><button id="multiply" className="btn btn-secondary w-100" onClick={() => handleButtonClick('*', 'multiply')}>*</button></td>
                    </tr>
                    <tr>
                        <td><button id="four" className="btn btn-light w-100" onClick={() => handleButtonClick('4', 'four')}>4</button></td>
                        <td><button id="five" className="btn btn-light w-100" onClick={() => handleButtonClick('5', 'five')}>5</button></td>
                        <td><button id="six" className="btn btn-light w-100" onClick={() => handleButtonClick('6', 'six')}>6</button></td>
                        <td rowSpan="2"><button id="subtract" className="btn btn-secondary w-100 h-100" onClick={() => handleButtonClick('-', 'subtract')}>-</button></td>
                    </tr>
                    <tr>
                        <td><button id="one" className="btn btn-light w-100" onClick={() => handleButtonClick('1', 'one')}>1</button></td>
                        <td><button id="two" className="btn btn-light w-100" onClick={() => handleButtonClick('2', 'two')}>2</button></td>
                        <td><button id="three" className="btn btn-light w-100" onClick={() => handleButtonClick('3', 'three')}>3</button></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><button id="zero" className="btn btn-light w-100" onClick={() => handleButtonClick('0', 'zero')}>0</button></td>
                        <td><button id="decimal" className="btn btn-light w-100" onClick={() => handleButtonClick('.', 'decimal')}>.</button></td>
                        <td><button id="equals" className="btn btn-primary w-100 h-100" onClick={() => handleButtonClick('=', 'equals')}>=</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Calculator;
