//Set Up Variables
var sequence = []; //Array Storing sequence
var keys    = []; //Keys Checker Array
var pressed = []; //Pressed Buttons Array

var loop; //Loop for sequence
var showing; //Showing Button 

var cooldown; //Cooldown per press
var cooldownTimer; //Cooldown timer set

var score = 0; //Score Default to 0
var highScore = 0; // Initialize high score and default 0

var playing = false; //Not playing 
var pending = true; //Game Pending 

//Loading Up Button Function
onload = function() 
{
    //Select the buttons in query from HTML file
    var green = document.querySelector("#greenButton");
    var red = document.querySelector("#redButton");
    var yellow = document.querySelector("#yellowButton");
    var blue = document.querySelector("#blueButton");
    
    //Set up button keys to check
    keys = [green, red, yellow, blue];
    
    //Start Button Function
    var button = document.querySelector("#startSwitch");
    if (button) //Set Up Default function of button to "OFF"/Red
    {
        button.style.borderColor = "red";
    }
    
    //If pressed a coloured button
    green.onclick = function() 
    {
        if (playing || (!pending && showing != null)) 
        {
            //Push the press button array up by 1 for the sequence to start a new one
            pressed.push(0);
        }
    }
    //Apply the same
    red.onclick = function() 
    {
        if (playing || (!pending && showing != null)) 
        {
            pressed.push(1);
        }
    }
    yellow.onclick = function() 
    {
        if (playing || (!pending && showing != null)) 
        {
            pressed.push(2);
        }
    }
    blue.onclick = function() 
    {
        if (playing || (!pending && showing != null)) 
        {
            pressed.push(3);
        }
    }
}

//CLick function
onclick = function() 
{
    //If the game still pending or not playing, return back to OFF button
    if(pending || showing || !playing)
        return;
    
    //If the player press the right signal button
    if(pressed[pressed.length - 1] == sequence[pressed.length - 1]) 
    {
        if(pressed.length == sequence.length) 
        {
            //Up the score
            score++;

            // Update high score if current score surpasses it
            if (score > highScore) 
            {
                highScore = score;
                //Show highscore in "00" format
                document.querySelector("#highScore").innerHTML = (highScore < 10 ? '0' : '') + highScore;
            }
            //Show score in "00" format
            document.querySelector("#score").innerHTML = (score < 10 ? '0' : '') + score
            pressed = [];
            pending = true;
        }
    }
    else 
    {
        gameOver(); // Call game over function if player picks wrong color
        return;
    }
    // Timeout mechanism
    clearTimeout(cooldownTimer);
    cooldownTimer = setTimeout(function() 
    {
        // Game Over if the player takes more than five seconds
       gameOver();
       return;
    }, 5000); // 5000 milliseconds (5 seconds)
}

function gameOver() 
{
    toggleGame(); //Return back to the Start
    flashAllButtons(5); // Flash all buttons five times if the player fails;
}

//Flash button function
function flashAllButtons(count) 
{
    var flashCount = 0;
    var flashInterval = setInterval(function() 
    {
        for (var i = 0; i < keys.length; i++) 
        {
            keys[i].classList.toggle('glow'); //Flash the keyed buttons
        }
        flashCount++;//Increment flash amount by 1
        if (flashCount >= count * 2) // If the counter is twice as the flash count
        {
            clearInterval(flashInterval); //reset it
        }
    }, 500);// each flash last 1/2 seconds
}

//Starting the Game function
function startGame() 
{
    //If you're playing
    if(playing) 
    {
        //If the game is in pending mode
        if(cooldown <= 0 && pending) 
        {
            //Pick random coloured buttoms for the sequence to push another so on
            sequence.push(Math.floor(Math.random() * 4));
            
            //Pause for 100ms
            cooldown = 100;
            pending  = false; //The game is not pending
            showsequence();

            //If you're at the 5th, 9th or 13th part of the signal sequence, speed the game up
            if (sequence.length === 5 || sequence.length === 9 || sequence.length === 13) 
            {
                clearInterval(loop);
                loop = setInterval(startGame, 0); // Speed up interval
            }

                // Timeout mechanism
    clearTimeout(cooldownTimer);
    cooldownTimer = setTimeout(function() 
    {
        // Game Over if the player takes more than five seconds
       gameOver();
       return;
    }, 5000); // 5000 milliseconds (5 seconds)
            
        }
        //else if you're on pending, reduce the cooldown
        else if(pending)
            cooldown--;
    }
}

//Building up the sequence
function showsequence() 
{
    //Start at 0
    var index = 0;
    
    //Show intervals of the function per 500 ms
    showing = setInterval(function() 
    {
        //Setting up timeout in 450 ms in loops of key buttons of the js class
        var reset = setTimeout(function() 
        {
            for(var i in keys)
               keys[i].setAttribute("class", "key");
        }, 450); 
        
        if(index >= sequence.length) 
        {
            clearInterval(showing);
            showing = null;
            return;
        }
        //If the index is bigger than the array sequence length, don't show it and return
        
        //Array function set to make buttons flash per element of the pattern
        keys[sequence[index]].setAttribute("class", "key glow");
        index++;
        
    }, 500);
}

//Checking the game when it stops
function toggleGame() 
{
    //if buttons are showing, stop and return
    if(showing != null)
        return;
    
    //Set all to opposite/negative/null values to make the game stop running until you press the power button again
    playing  = !playing;
    pending  = true;
    
    loop = null;
    showing  = null;
    
    cooldown = 10; //Cool the game down for 10 ms
    score    = 0;
    
    sequence  = [];
    pressed  = [];
    
    //Reset to OFF
    var button = document.querySelector("#startSwitch");
    //Reset Score
    document.querySelector("#score").innerHTML = (score < 10 ? '0' : '') + score;
    
    //If the game has started
    if(playing) 
    {
        setTimeout(function () 
        {
            loop = setInterval(startGame, 0);
        }, 3000); // Delay for 3 seconds
        button.style.backgroundColor = "#0a0"; 
    }
    else 
    {
        clearInterval(showing);
        clearInterval(loop);
        button.style.backgroundColor = "#d00"; //Clear all values if stopped and back to default
        
    }
}