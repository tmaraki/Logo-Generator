// Import fs as it is a CommonJS module
const fs = require('fs');


// Dynamically import the 'inquirer' module and handle it in an async function
import('inquirer').then(inquirerModule => {
    const { triangle, circle, square } = require('./lib/shapes');

    console.log("Logo Generator! Prepare to create your own logo");
    

    class Svg {
        constructor() {
            this.textElement = '';
            this.shapeElement = '';
        }
        render() {
            return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="300" height="200">${this.shapeElement}${this.textElement}</svg>`;
        }
        setTextElement(text, color) {
            this.textElement = `<text x="150" y="125" font-size="60" text-anchor="middle" fill="${color}">${text}</text>`;
        }
        setShapeElement(shape) {
            this.shapeElement = shape.render();
        }
    }

    const questions = [
        {
            type: 'input',
            name: 'text',
            message: 'Enter up to 3 characters:',
            validate: (input) => input.length > 0 && input.length <= 3,
        },
        {
            type: 'input',
            name: 'textColor',
            message: 'Enter a color for the text (keyword or hexadecimal):'
        },
        {
            type: 'list',
            name: 'shape',
            message: 'Choose a shape:',
            choices: ['circle', 'triangle', 'square'],
        },
        {
            type: 'input',
            name: 'shapeColor',
            message: 'Enter a color for the shape (keyword or hexadecimal):',
        }
    ];

    function writeToFile(fileName, data) {
        fs.writeFile(fileName, data, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Successfully generated logo.svg!');
            }
        });
    }

    async function init() {
        console.log("Starting init");
        const answers = await inquirerModule.default.prompt(questions);
        let shapeInstance;
        switch (answers.shape) {
            case 'circle':
                shapeInstance = new circle();
                break;
            case 'triangle':
                shapeInstance = new triangle();
                break;
            case 'square':
                shapeInstance = new square();
                break;
            default:
                console.log('Invalid shape selected.');
                return;
        }

        shapeInstance.setColor(answers.shapeColor);

        var svg = new Svg();
        svg.setTextElement(answers.text, answers.textColor);
        svg.setShapeElement(shapeInstance);

        const svgString = svg.render();
        console.log("Logo generated:\n", svgString);
        writeToFile("logo.svg", svgString);
    }

    init().catch(err => console.error("Error during initialization:", err));
}).catch(error => console.error('Failed to dynamically import inquirer:', error));