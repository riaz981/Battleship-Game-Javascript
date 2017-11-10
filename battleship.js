var view = {
	displayMessage: function(msg){
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class","hit");
	},
	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class","miss");
	}
}

var model = {
	boardSize: 7,
	numShips: 3,
	shipsSunk: 0,
	shipLength: 3,
	ships: [ { location: ["06","16","26"], hits:["","",""] },
		     { location: ["24","34","44"], hits:["","",""] },
		     { location: ["10","11","12"], hits:["","",""] } ],
    fire: function(guess){
    	for(var i = 0; i < this.numShips; i++){
    		var ship = this.ships[i];
    		var index = ship.location.indexOf(guess);
    		if(index>=0){
    			ship.hits[index]="hit";
    			view.displayHit(guess);
    			view.displayMessage("HIT!!");
    			if(this.isSunk(ship)){
    				view.displayMessage("You sank my battleship! :(");
    				this.shipsSunk++;
    			}
    			return true;
    		}
    	}
    	view.displayMiss(guess);
    	view.displayMessage("You missed.");
    	return false;
    },
    isSunk: function(ship){
    	for(var i=0; i<this.shipLength; i++){
    		if(ship.hits[i] !== "hit"){
    			return false;
    		}
    	}
    	return true;
    }
};

var controller = {
    guesses: 0,
    processGuess: function(guess){
        var location = parseGuess(guess);
        if(location){
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){
                console.log("I am in processGuess");
                view.displayMessage("You sank all my battleships, in "+this.guesses+" guesses");
            }
        }

    }
    
};

function parseGuess(guess){
        var alphabet = ["A","B","C","D","E","F","G"];
        if(guess===null || guess.length !== 2){
            alert("Oops, please enter a letter and number on the board");
        }
        else{
            firstChar = guess.charAt(0);
            var row = alphabet.indexOf(firstChar);
            var column = guess.charAt(1);
            if(Number.isNaN(row) || Number.isNaN(column)){
                alert("Oops, this isnt on the board");
            }
            else if(row<0 || row>=model.boardSize || column < 0 || column >= model.boardSize){
                alert("Oops, thats off the board");
            }
            else{
                return row + column;
            }
        }
        return null;
    }

function init(){
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
}

function handleFireButton(){
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

window.onload = init;

// model.fire("53");
// model.fire("06");
// model.fire("16");
// model.fire("26");
// model.fire("34");
// model.fire("24");
// model.fire("44");
// model.fire("12");
// model.fire("11");
// model.fire("10");