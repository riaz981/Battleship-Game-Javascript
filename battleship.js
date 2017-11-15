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
	ships: [ { location: [0,0,0], hits:["","",""] },
		     { location: [0,0,0], hits:["","",""] },
		     { location: [0,0,0], hits:["","",""] } ],
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
    },
    generateShipLocations: function(){
        var locations;
        for(var i = 0; i < this.numShips; i++){
            do{
                locations = this.generateShip();
                console.log(locations);
            }while(this.collision(locations));
            this.ships[i].location = locations;
        }
        
    },
    generateShip: function(){
        var direction = Math.floor(Math.random()*2);
        var row, col;

        if(direction == 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }
        else{
            col = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }

        var newShipLocations = [];
        for(var i=0; i< this.shipLength; i++){
            if(direction == 1){
                newShipLocations.push(row + "" + (col+i));
            }
            else{
                newShipLocations.push((row+i) + "" + col);
            }
        }
        //console.log(newShipLocations);
        return newShipLocations;
    },

    collision: function(locations) {
        //console.log(locations);
        for (var i = 0; i < this.numShips; i++) {
        var ship = model.ships[i];
        console.log(ship);
        for (var j = 0; j < locations.length; j++) {
                if (ship.location.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
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
    model.generateShipLocations();
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