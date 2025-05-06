const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

let currentlyPlaying = true;

class Field {
    constructor(field) {
        this._field = field;
        this.y = 0;
        this.x = 0;
    }

    get field() {
        return this._field;
    }

    //Print field in 2d plane
    print() {
        return this.field.map(row =>
            row.join('')
        ).join('\n');
    }

    //Take user input and move player
    ask() {
        let move = prompt('Where to move?(N for up, S for down, W for right, E for Left)');
        switch(move.toLowerCase()) {
            case 'n':
                console.log('Move up');
                this.y -= 1;
                break;
            case 's':
                console.log('Move down');
                this.y += 1;
                break;
            case 'w':
                console.log('Move right');
                this.x += 1;
                break;
            case 'e':
                console.log('Move left');
                this.x -= 1;
                break;
            default:
                break;
        }
    }

    //Test game status if player has won or lost
    checkWin() {
        if (this.field[this.y] == undefined) {
            console.log('You lose - Out of boundary');
            return currentlyPlaying = false;
        }
        switch (this.field[this.y][this.x]) {
            case hole:
                console.log('You lose - Fell in a Hole!!!');
                currentlyPlaying = false;
                break;
            case undefined:
                console.log('You lose -  Out of boundary');
                currentlyPlaying = false;
                break;
            case hat:
                console.log('You Win! You Found the Hat!');
                currentlyPlaying = false;
                break;
            case fieldCharacter:
                console.log('Keep looking for the hat...');
                this.field[this.y][this.x] = pathCharacter;
                break;
                case pathCharacter:
                    console.log('You are stepping on *');
                    break;
        }
    }

    static generateField(height, width, percentage) {
        
        //Helper function to return hole or fieldCharacter
        const fieldOrHole = (percentage) => {
            if (percentage >= 0 && percentage <= 100) {
                const ranNum = Math.random() * 100;
                if (ranNum < percentage) {
                    return hole;
                } else {
                    return fieldCharacter;
                }
            } else {
                console.log('Please enter a number between 0 - 100');
            }
        }

        //Helper function to return a field with no hat or pathCharacter
        const plainField = () => {
            function makeWidthArray() {
                    let widthArray = [];
                    for (let i = 0; i < width; i++) {
                        widthArray.push(fieldOrHole(percentage));
                    }
                    return widthArray;
                }
                let plainField = [];
                for (let i = 0; i < height; i++) {
                    plainField.push(makeWidthArray());
                }
                return plainField;
            }

            const gameReadyField = plainField();

            //Adding hat on field, with loop to check if hat is on * and move if so
            do {
                gameReadyField[Math.floor(Math.random() * height)][Math.floor(Math.random() * width)] = hat;
            } while (gameReadyField[0][0] == hat);

            //adding * to upper left corner
            gameReadyField[0][0] = pathCharacter;

            return gameReadyField;
        }

    }

    //Generating a new randomized field into "newField" and will insert to "myField" below:
    //generateField() takes 3 parameters. First is the y-axis, second is x-axis and third is the percentage of holes in field (0-100)

    const myField = new Field(Field.generateField(10,10,30));

    function game() {
        while(currentlyPlaying) {
            console.log(myField.print());
            myField.ask();
            myField.checkWin();
        }
        console.log('Game Over!');
    }

    game();
