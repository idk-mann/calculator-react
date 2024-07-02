import React, { useState, useEffect } from 'react';
import './App.css';

const evaluateExpression = (expr) => {
    const ops = {'+': 1, '-': 1, '*': 2, '/': 2};
    const peek = (arr) => arr[arr.length - 1];
    const stack = [];
    const output = [];
    const tokens = expr.match(/(\d+(\.\d+)?)|[\+\-\*\/\(\)]/g);

    tokens.forEach((token, index) => {
        if (/\d/.test(token)) {
            output.push(token);
        } else if (token === '(') {
            stack.push(token);
            // Handle implicit multiplication
            if (index > 0 && /\d|\)/.test(tokens[index - 1])) {
                while (stack.length && ops[peek(stack)] >= ops['*']) {
                    output.push(stack.pop());
                }
                stack.push('*');
            }
        } else if (token === ')') {
            while (stack.length && peek(stack) !== '(') {
                output.push(stack.pop());
            }
            stack.pop(); // Remove the '(' from stack
        } else if ('+-*/'.includes(token)) {
            // Handle negative numbers
            if (token === '-' && (index === 0 || '()+-*/'.includes(tokens[index - 1]))) {
                output.push('0');
            }
            while (stack.length && ops[peek(stack)] >= ops[token]) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    });

    while (stack.length) {
        output.push(stack.pop());
    }

    const resultStack = [];

    output.forEach((token) => {
        if (/\d/.test(token)) {
            resultStack.push(parseFloat(token));
        } else {
            const b = resultStack.pop();
            const a = resultStack.pop();
            switch (token) {
                case '+': resultStack.push(a + b); break;
                case '-': resultStack.push(a - b); break;
                case '*': resultStack.push(a * b); break;
                case '/': resultStack.push(a / b); break;
                default: throw new Error('Unknown operator');
            }
        }
    });

    return resultStack[0];
};


const formatInput = (input) => {
    // Remove all existing spaces
    const rawInput = input.replace(/\s+/g, '');
    
    // Split the input by operators to format only the numbers
    const parts = rawInput.split(/([\+\-\×\/=])/);
    
    const formattedParts = parts.map(part => {
        // If the part is an operator, return it as is
        if (['+', '-', '×', '/', '='].includes(part)) {
            return part;
        }
        
        // Reverse the part, add spaces every three characters, and reverse it back
        const reversedPart = part.split('').reverse().join('');
        const formattedReversedPart = reversedPart.replace(/.{1,3}/g, '$& ');
        const formattedPart = formattedReversedPart.split('').reverse().join('').trim();
        
        return formattedPart;
    });

    // Join the parts back together
    return formattedParts.join(' ');
};


function App() {
    const [rawInput, setRawInput] = useState('');
    const [displayInput, setDisplayInput] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }, [isDarkMode]);

    

    const calculate = () => {
        try {
            const result = evaluateExpression(rawInput);
            setDisplayInput(formatInput(result.toString().replace(/\*/g, '×')));
        } catch (error) {
            setRawInput('');
            setDisplayInput('Error');
        }
    };

    const handleButtonClick = (value) => {
        console.log(`Button clicked: ${value}`);
        console.log(`Current input: ${rawInput}`);
    
        if (value === 'C') {
            setRawInput('');
            setDisplayInput('');
            return;
        }
    
        if (value === '=') {
            calculate();
            return;
        }
    
        if (value === 'Backspace') {
            setRawInput((prevInput) => prevInput.slice(0, -1));
            setDisplayInput((prevInput) => formatInput(prevInput.slice(0, -1)));
            return;
        }
    
        setRawInput((prevInput) => {
            // Prevent multiple leading zeros
            if (prevInput === '' && value === '0') {
                return '0';
            }
    
            // Prevent multiple decimal points in the same number
            const lastNumber = prevInput.split(/[\+\-\*\/]/).pop();
            if (value === '.' && lastNumber.includes('.')) {
                return prevInput;
            }
    
            // Handle cases where a new number segment starts with '0'
            if (lastNumber === '0' && !['+', '-', '*', '/'].includes(value) && value !== '.') {
                return prevInput.slice(0, -1) + value;
            }
    
            // Prevent entering more than one operator at a time
            const lastChar = prevInput[prevInput.length - 1];
            const secondLastChar = prevInput[prevInput.length - 2];
            if (['+', '-', '*', '/'].includes(lastChar) && ['+', '-', '*', '/'].includes(value)) {
                return prevInput;
            }
            if (lastChar === ' ' && ['+', '-', '*', '/'].includes(secondLastChar) && ['+', '-', '*', '/'].includes(value)) {
                return prevInput;
            }
    
            return prevInput + value;
        });
    
        setDisplayInput((prevInput) => {
            // Prevent multiple leading zeros
            if (prevInput === '' && value === '0') {
                return '0';
            }
    
            // Prevent multiple decimal points in the same number
            const lastNumber = prevInput.split(/[\+\-\×\/]/).pop();
            if (value === '.' && lastNumber.includes('.')) {
                return prevInput;
            }
    
            // Handle cases where a new number segment starts with '0'
            if (lastNumber === '0' && !['+', '-', '×', '/'].includes(value) && value !== '.') {
                return prevInput.slice(0, -1) + value;
            }
    
            // Prevent entering more than one operator at a time
            const lastChar = prevInput[prevInput.length - 1];
            const secondLastChar = prevInput[prevInput.length - 2];
            if (['+', '-', '×', '/'].includes(lastChar) && ['+', '-', '×', '/'].includes(value)) {
                return prevInput;
            }
            if (lastChar === ' ' && ['+', '-', '×', '/'].includes(secondLastChar) && ['+', '-', '×', '/'].includes(value)) {
                return prevInput;
            }
    
            
            return formatInput(prevInput + value.replace('*', '×'));
        });
    };
    
    

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;
            if ((/\d/.test(key)) || [,'+', '-', '*', '/', '.', 'Enter', 'Backspace', 'Delete', 'C'].includes(key)) {
                event.preventDefault();
                
                if (key === 'Delete') {
                    handleButtonClick('C');
                } else {
                    handleButtonClick(key);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        
        <div className="container">    
            <table className="table table-bordered">
                    <tbody>
                    <tr>
                        <td colSpan="4">
                            <div id="display" className="display w-100">
                                {displayInput}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3"><button id="clear" className="btn btn-danger w-100" onClick={() => handleButtonClick('C')}>AC</button></td>
                        <td><button id="divide" className="btn btn-secondary w-100" onClick={() => handleButtonClick('/')}>÷</button></td>
                    </tr>
                    <tr>
                        <td><button id="seven" className="btn btn-light w-100" onClick={() => handleButtonClick('7')}>7</button></td>
                        <td><button id="eight" className="btn btn-light w-100" onClick={() => handleButtonClick('8')}>8</button></td>
                        <td><button id="nine" className="btn btn-light w-100" onClick={() => handleButtonClick('9')}>9</button></td>
                        <td><button id="multiply" className="btn btn-secondary w-100" onClick={() => handleButtonClick('*')}>×</button></td>
                    </tr>
                    <tr>
                        <td><button id="four" className="btn btn-light w-100" onClick={() => handleButtonClick('4')}>4</button></td>
                        <td><button id="five" className="btn btn-light w-100" onClick={() => handleButtonClick('5')}>5</button></td>
                        <td><button id="six" className="btn btn-light w-100" onClick={() => handleButtonClick('6')}>6</button></td>
                        <td><button id="subtract" className="btn btn-secondary w-100" onClick={() => handleButtonClick('-')}>-</button></td>
                    </tr>
                    <tr>
                        <td><button id="one" className="btn btn-light w-100" onClick={() => handleButtonClick('1')}>1</button></td>
                        <td><button id="two" className="btn btn-light w-100" onClick={() => handleButtonClick('2')}>2</button></td>
                        <td><button id="three" className="btn btn-light w-100" onClick={() => handleButtonClick('3')}>3</button></td>
                        <td><button id="add" className="btn btn-secondary w-100" onClick={() => handleButtonClick('+')}>+</button></td>
                    </tr>
                    <tr>
                        <td><button id="left-bracket" className="btn btn-light w-100" onClick={() => handleButtonClick('(')}>(</button></td>
                        <td><button id="right-bracket" className="btn btn-light w-100" onClick={() => handleButtonClick(')')}>)</button></td>
                        <td><button id="decimal" className="btn btn-light w-100" onClick={() => handleButtonClick('.')}>.</button></td>
                        <td><button id="equals" className="btn btn-primary w-100" onClick={() => handleButtonClick('=')}>=</button></td>
                    </tr>
                    <tr>
                        <td colSpan="3"><button id="zero" className="btn btn-light w-100" onClick={() => handleButtonClick('0')}>0</button></td>
                        <td><button id="backspace" className="btn btn-warning w-100" onClick={() => handleButtonClick('Backspace')}>⌫</button></td>
                    </tr>
                    </tbody>
                </table>
            
            <div class = "horizontal-center">
                
                <label className="switch">
                    <input
                        type="checkbox"
                        id="dark-mode-switch"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                    />
                    <span className="slider round"></span>
                </label>
                <label className="label-text">Dark mode</label>
            </div>
        </div>
    );
}

export default App;
