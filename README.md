# TestGame

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.2.

# StarNavi: Game In Dots

### To successful passing of our test you should handle with following criterions:

- the game MUST work without errors
- presets for game difficulty you can fetch using this endpoint this-domain/game-settings. This is should be request to the server NOT just copy paste of data.
    >This data is array of objects with two fields:
    - field - contain size of game field. Should be square form
    - delay - time in milliseconds
    
- data for leader board you can get from this-domain/winners. Also it should be a request.

- when someone wins you should send request to server with JSON which contain two fields winner and date

### We have next gameplay:
- user set game difficulty and name
- press PLAY
- at a specified time interval (in the delay field) a random square on the field is highlighted in blue
- if the user managed to click on the square during this time - he turns green, the player gets a point and the field changes color to green
- if not, the field turns red and the point goes to the computer
- when a player or computer paints >50% of all possible squares in his color - he becomes the winner
- an inscription appears between the control buttons and the playing field that the player (the name he entered) / computer won
- button PLAY changes the caption to PLAY AGAIN
- result of the game need to be send to server on this endpoint this-domain/winners in JSON with two fields winner and date both strings.
- results in table should be auto update

### Example of design
![Example of design](./src/assets/game-example.png)
