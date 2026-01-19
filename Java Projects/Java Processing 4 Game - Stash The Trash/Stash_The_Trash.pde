//Code structure and layout based from -- https://www.toptal.com/game/ultimate-guide-to-processing-simple-game -- and -- https://stackoverflow.com/questions/58206391/how-can-i-make-my-countdown-timer-display-minutes-and-seconds-not-just-second --

/********** VARIABLES ***********/
//Forming Variable Inputs

int gameScreen = 0; //Screen Variable
float theta = 0; //Angle Variable for Sun Rotation

PImage stage; //Background Image Variable
PImage truck; //Sprite Variable
PImage soda, banana, paper, bottle; //Wastes Variables

PImage garbage, litter, clean; //Game Over Screen Background Variables

float frame=0; // Start on frame 0 of the sprite sheet
int truck_x=400; // Spawns the sprite in the middle of screen
int direction=0;

int score = 0; //Create Score Variable
int score_count; //Score Counter

int quit_flag=0; // This is set to 1 when game is over

//Code taken from --  https://stackoverflow.com/questions/58206391/how-can-i-make-my-countdown-timer-display-minutes-and-seconds-not-just-second --
//Values changed into 30
int begin; //variable to start the countdown
int duration = 30; //Starts seconds at 30
int time = 30; //Sets the timer at 0:30

//Position and Speed Variables
int soda_x=20+(int)random(740); // Choose drop starting position
int soda_y=90;
int soda_speed = (int)random(3) + 1; //Speed of drop

//Apply for other variables
int banana_x=20+(int)random(740);  
int banana_y=90;
int banana_speed = (int)random(3) + 1;
 
int paper_x=20+(int)random(740);  
int paper_y=90;
int paper_speed = (int)random(3) + 1;  
  
int bottle_x=20+(int)random(740); 
int bottle_y=90;
int bottle_speed = (int)random(3) + 1; 

int count = (int)random(1,5); //Integer value to fill 4 random colors to the circle in the gameScreen()

/********* SETUP BLOCK *********/
//In this setup block, I implemented my PImage variables to load images I downloaded to the directory of this sketch

void setup() 
{
  size(800,600,P2D); //Window Size
  
  //gameScreen(0 background image
  //Background png file taken from -- https://pngtree.com/freebackground/hand-painted-green-safe-travel-road-background-material_922653.html --
  stage = loadImage("BackgroundImage.png");
  stage.resize(width,height); //Size of background image set with window size
  
  //Wastes Images
  //Images taken from  -- https://icons8.com/icons/set/garbage-sprite --
  soda = loadImage("Soda.png");
  banana = loadImage("BadBanana.png");
  paper = loadImage("Paper.png");
  bottle = loadImage("Bottle.png");
  
  //Truck image taken from -- https://icons8.com/icons/set/garbage-sprite -- and edited from -- https://www.piskelapp.com/ --
  truck = loadImage("GarbageTruck.png");
  
  //Game Over Background Images
  //Image from -- https://foodandclimate.ecoliteracy.org/interactive-guide/page_0011.xhtml --
  garbage = loadImage("Garbage.png");
  garbage.resize(width,height);
   //Image from -- https://wallpapercave.com/trash-wallpapers --
  litter = loadImage("Litter.png");
  litter.resize(width,height);
  //Image from -- https://outdoorfamiliesonline.com/eco-friendly-tips-tricks-go-green/ --
  clean = loadImage("Clean.png");
  clean.resize(width,height);
  
  textureMode(NORMAL); // Scale texture Top right (0,0) to (1,1)
  blendMode(BLEND); //Blend textures
  
  smooth(); //Smooths Out Shapes 
  rectMode(CENTER); //Position Shapes
  noStroke(); //No Shape Borders 
}

/********* DRAW BLOCK *********/
//In this block, I took the code from -- https://www.toptal.com/game/ultimate-guide-to-processing-simple-game -- to form 3 functions and build up 3 different game states/screens within them. I replaced most of those codes and added my own that's made from my labs to create the game I had explained from my proposal

void draw() 
{
  // Display the contents of the current screen
  if (gameScreen == 0) { //Integer variable to declare game state numbers and assigned them to each function
    initialScreen(); //Title Screen
  } else if (gameScreen == 1) {
    gameScreen(); //Game Screen
  } else if (gameScreen == 2) {
    gameOverScreen(); //Game Over Screen
  }
}

/********* SCREEN CONTENTS *********/

void initialScreen() //Title Screen
//In this screen, I created an animated background image of a hillside landscape using methods I learnt from Stephen Brown's lectures
{
  //Color schemes taken from -- https://www.rapidtables.com/convert/color/rgb-to-hex.html --
  background(0,255,255); //Sky in Cyan Color
 
  fill(0,255,0); //Lime color
  rect(200, 600, 1200, 200); //Hill Landscapes 

  pushMatrix();  
  translate(width/2, height/2); //Translate by half of the size window's dimensions  
  rotate(theta); //Rotate by an angle
  theta += TWO_PI/500; //Sun Rotation 

  pushMatrix();  
  translate(0, 0);  
  fill(255,255,0); //Yellow Color
  rect(0, 0, 200, 200);  
  popMatrix(); //Sun Rays 
  
  fill(255); //White Color 
  ellipse(0, 0, 175, 175);  
  popMatrix(); //Sun 

  fill(0,255,0); //Lime Color
  ellipse(700, 500, 400, 600);   
  ellipse(300, 500, 200, 200);    
  ellipse(100, 500, 300, 300); //Hills 

  fill(128); //Grey Color
  rect(200, 600, 1200, 100); //Road 
   
  fill(255); //White Color  
  ellipse(random(800),random(400),40,20); //Random Generated Clouds 

  fill(128,0,0); //Maroon Color 
  rect(600, 500, 25, 100);  
  rect(200, 500, 50, 100); 
  rect(700,450,50,200); 
  triangle(220, 500, 100,200,100,100); 
  ellipse(100, 450, 100,200); 
  rect(100, 300, 50, 500); // Tree Trunks 

  fill(0,128,0); //Dark Green Color 
  ellipse(700, 300, 200, 250); 
  rect(600,450,100,100); //Green Tree Leaves 
  
  fill(128,128,0);  
  triangle(100, 500, 200,200,100,100); //Olive Tree Leaves

  textSize(25);
  fill(255);
  text("Click To Start", height/1.85, width/1.37); //Text Guide To Start The Game
  
  textSize(50);
  fill(255);
  text("Stash The Trash!", height/2.8, width/6.5); //Game Title
}


void gameScreen() 
//In this screen I also implemented most methods and logic from Stephen Brown's labs as well as some of Peter Mooney's labs. I changed bits of their structures and values based on the properties of my PNG images and mixing around the probabilities in here as shown in details below.
{
  background(stage); //Game Background Image Display
  
  //Methods taken from Stephen Brown
  float left =frame/8; //Divide frames by 8 as shown on the PNG image
  float right=(frame+1)/8; //Number of frames declared based on the sprite image
  
  if(direction==1)                  // Swap left and right UV values
  {                                 // to reverse direction sprite is facing
    float temp=left;
    left=right;
    right=temp;
  }
  
  //Making Sprite
  pushMatrix(); // Draw Garbage Truck Sprite
  translate(truck_x,360);
  beginShape();
  texture(truck);
  vertex( 0, 0, left, 0);
  vertex(130, 0, right, 0); //Size of a frame vertex data as checked within Microsoft Paint software
  vertex(130, 130, right, 1);
  vertex( 0, 130, left, 1); //Sprite Size Declared
  endShape(CLOSE);
  popMatrix(); // Restore origin point (top left 0,0)

  //Creating drop effects of the 4 wastes
  pushMatrix(); // Store current location of origin (0,0) 
  translate(soda_x,soda_y); // Change origin (0,0) for drawing to (soda_x,soda_y) 
  beginShape(); // Open graphics pipeline
  texture(soda); // Tell GPU to use drop to texture the polygon
  vertex( -20, -20, 0, 0); // Load vertex data (x,y) and (U,V) texture data into GPU 
  vertex(20, -20, 1, 0); // Square centred on (0,0) of width 40 and height 40
  vertex(20, 20, 1, 1); // Textured with an image of the soda
  vertex( -20, 20, 0, 1); 
  endShape(CLOSE); // Tell GPU you have loaded shape into memory.
  popMatrix(); // Recover origin(0,0)means top left hand corner again.
  soda_y += soda_speed; //Modified the speed of the drop to equate to random values
  if(soda_y>475) // If y value is entering the road line
  { 
  soda_x=20+(int)random(740); // Restart the drop again
  soda_y=90;
  soda_speed = (int)random(3) + 1;
  if(count == 1) //If the waste matches the color integer value
  {
    score_count -= 100; //If player misses the waste that matches the value, score decreases by 100
    duration -= 5; //If player misses the right waste, time decreases by 5 seconds
  } 
  }
  
  //The same logic applies for other wastes
  pushMatrix(); 
  translate(banana_x,banana_y); 
  beginShape(); 
  texture(banana); 
  vertex( -20, -20, 0, 0);
  vertex(20, -20, 1, 0);
  vertex(20, 20, 1, 1); 
  vertex( -20, 20, 0, 1); 
  endShape(CLOSE); 
  popMatrix(); 
  banana_y += banana_speed; 
  if(banana_y>475)
  { 
  banana_x=20+(int)random(740);
  banana_y=90; 
  banana_speed = (int)random(3) + 1;
  if(count == 2)
  {
    score_count -= 100;
    duration -= 5;
  } 
  }
  
  pushMatrix();  
  translate(paper_x,paper_y); 
  beginShape();  
  texture(paper); 
  vertex( -20, -20, 0, 0);  
  vertex(20, -20, 1, 0);  
  vertex(20, 20, 1, 1);  
  vertex( -20, 20, 0, 1); 
  endShape(CLOSE);  
  popMatrix();
  paper_y += paper_speed; 
  if(paper_y>475)
  { 
  paper_x=20+(int)random(740); 
  paper_y=90;
  paper_speed = (int)random(3) + 1;
  if(count == 3)
  {
    score_count -= 100;
    duration -= 5;
  } 
  }
  
  pushMatrix(); 
  translate(bottle_x,bottle_y); 
  beginShape();  
  texture(bottle);  
  vertex( -20, -20, 0, 0);  
  vertex(20, -20, 1, 0);  
  vertex(20, 20, 1, 1); 
  vertex( -20, 20, 0, 1); 
  endShape(CLOSE); 
  popMatrix();  
  bottle_y += bottle_speed;
  if(bottle_y>475) 
  { 
  bottle_x=20+(int)random(740); 
  bottle_y=90;
  bottle_speed = (int)random(3) + 1;
  if(count == 4)
  {
    score_count -= 100;
    duration -= 5;
  } 
  }
  
  //Controls to move sprite
   if (keyPressed == true)
   {
     if(keyCode == RIGHT) 
     {
       direction=0;          // Set direction to the right
       truck_x+=8;          // Increase X position move right
       frame++;              // Every step advance the frame
       if(frame >= 4) frame=0; // If frame is greater or equal to 4, reset it to 0
     }
     
     //Repeat for opposite direction
     if(keyCode == LEFT) 
     {
       direction=1;          // Set direction to the left
       truck_x-=8;          // Decrease X position move left
       frame++;
       if(frame >= 4) frame=0;
     }
   }
   
   //Taken from one Peter Mooney's Lab based on drawing circles. The 4 colors are based on the recycling bin colors that connects to each waste types. This creates a 25% probabilty scale each when generating the colors randomly
   if(count == 1){ //If the waste matches the color integer value
   fill(255,0,0); //Fill red color
   circle(100,100,100); //Draw Circle
   image(soda,75,75); //Draw waste image on the circle
   }

   if(count == 2){
   fill(0,255,0); //Fill green color
   circle(100,100,100);
   image(banana,75,75);
   }

   if(count == 3){
   fill(0,0,255); //Fill blue color
   circle(100,100,100);
   image(paper,75,75);
   }

   if(count == 4){
   fill(255,255,0); //Fill yellow color
   circle(100,100,100);
   image(bottle,75,75);
   }
   
   if(count == 5){
   count = 1; //Restarts the loop count
   }
 
  //Methods based from Stephen Brown's Labs and apply the logic of probality in them from the previous sets of codes
  if ((soda_y>368)&&(soda_y<470))     // If the drop is on same level as player 
  {
    if(abs((soda_x+10)-(truck_x+62))<25) // And the drop is near player
    {
      if(count == 1) //And the waste matches the color integer value
      {
        score_count += 100;                  // Increase the score count by 100 points
        duration += 5;                       // Increase the time by 5 seconds
        
        fill(255,0,0);
        circle(100,100,100);
        image(soda,75,75);   //Generate colors and images again
        count++; //Increase loop count by 1
      
        soda_x = 20+(int)random(740);   // Restart a new drop again at random positions
        soda_y=90;
      }
      else //If count does not match to the one assigned to this waste
      {
        score_count -= 100; //Decrease score by 100 points
        duration -= 5; //Decrease time by 5 seconds
        
        //Repeat again
        fill(255,0,0);
        circle(100,100,100);
        image(soda,75,75);
        count++;
      
        soda_x = 20+(int)random(740);   // Restart a new drop
        soda_y=90;
      }
    }
  }
  
  //Apply them again for different wastes
  if ((banana_y>368)&&(banana_y<470))   
  {
    if(abs((banana_x+10)-(truck_x+62))<25) 
    {
      if(count == 2)
      {
        score_count += 100;                 
        duration += 5;
        
        fill(0,255,0);
        circle(100,100,100);
        image(banana,75,75);
        count++;
      
        banana_x = 20+(int)random(740);   
        banana_y=90;
      }
      else
      {
        score_count -= 100;
        duration -= 5;
        
        fill(255,0,0);
        circle(100,100,100);
        image(banana,75,75);
        count++;
      
        banana_x = 20+(int)random(740);   
        banana_y=90;
      }
    }
  }
  
  if ((paper_y>368)&&(paper_y<470))    
  {
    if(abs((paper_x+10)-(truck_x+62))<25) 
    {
      if(count == 3)
      {
        score_count += 100;                  
        duration += 5;
        
        fill(0,0,255);
        circle(100,100,100);
        image(paper,75,75);
        count++;
      
        paper_x = 20+(int)random(740);   
        paper_y=90;
      }
      else
      {
        score_count -= 100;
        duration -= 5;
        
        fill(255,0,0);
        circle(100,100,100);
        image(paper,75,75);
        count++;
      
        paper_x = 20+(int)random(740);  
        paper_y=90;
      }
    }
  }
  
  if ((bottle_y>368)&&(bottle_y<470))    
  {
    if(abs((bottle_x+10)-(truck_x+62))<25) 
    {
      if(count == 4)
      {
        score_count += 100;                 
        duration += 5;
        
        fill(255,255,0);
        circle(100,100,100);
        image(bottle,75,75);
        count++;
      
        bottle_x = 20+(int)random(740);   
        bottle_y=90;
      }
      else
      {
        score_count -= 100;
        duration -= 5;
        
        fill(255,0,0);
        circle(100,100,100);
        image(bottle,75,75);
        count++;
      
        bottle_x = 20+(int)random(740);  
        bottle_y=90;
      }
    }
  }
  
  //Creating time countdown. Taken from -- https://stackoverflow.com/questions/58206391/how-can-i-make-my-countdown-timer-display-minutes-and-seconds-not-just-second --
  if(time > 0) //If time is greater than 0
  {
    //Converting seconds to minutes
    time = duration - (millis() - begin)/1000; //Time formated from 000 seconds to 0:00 layout in minutes
    int min = time / 60; //Convert 60 seconds to 1 minute
    int sec = time % 60; //convert it back to 60 seconds
    
    textSize(20);
    fill(0, 0, 255);
    text("Time: " + nf(min, 1) + ":" + nf(sec, 2), 620, 80); //Display game countdown
  }

  //Once countdown timer hits zero, goes to game over screen 
  if (time <= 0) { 
    gameOver();
  }
  
  //Once score goes down less than zero, goes to game over screen
  if(score_count < 0) {
    gameOver();
  }
  
  textSize(20);
  fill(255,0, 0);
  text("Score: " + score_count, 620, 40); //Display score
  
  textSize(18);
  fill(0);
  text("Press Left & Right Directional Keys To Move", 190, 60); //Display Control Guides
  
  textSize(15);
  fill(0,128,0);
  text("Stash a waste that matches its color", 190, 90);
  text("Stashing the wrong ones or miss the right ones will reduce your score and time!", 190, 120); //Display guides on how to beat the game
}

void gameOverScreen()
//For the game over screen, I added in three different backgrounds based on how high the player's score is
{
  
  if(score_count <= 1000) //If player's score is equal or less than 1000 points
  {
    background(garbage); //Display Garbage Background
    
    textSize(40);
    fill(0);
    text("Game Over! Try Again!", 200, 200); //Text to tell the player that it's still a game over
    text("Your Score: " + score_count, 200, 240); //Display final score
    
    textSize(20);
    text("Close the game and try again", 200, 280); //Guide to tell the player to close the game and rerun it again
  }
  
  if(score_count > 1000 && score_count < 5000) //If player's score is more than 1000 points and less than 5000 points
  {
    background(litter); //Display Litter Background
    
    textSize(30);
    fill(255);
    text("Good Job! Keep It Up!", 500, 200); //Text to tell the player that he/she did a good job but need to repeat to beat the game
    text("Your Score: " + score_count, 500, 240);
    
    textSize(20);
    text("Close the game and try again", 500, 280);
  }
  
  if(score_count >= 5000) //If player's score is equal or more than 5000 points
  {
    background(clean); //Display Clean Trophy Background
    
    textSize(40);
    fill(0);
    text("Excellent Work!", 250, 50); //Text to tell the player that he/she did an excellent work and beat the game
    text("Your Score: " + score_count, 250, 90);
    
    textSize(20);
    text("Close the game and try again", 250, 110);
  }
}

public void mousePressed() { //Function for mouse clicking
  // if we are on the initial screen when clicked, start the game
  if (gameScreen==0) {
    startGame(); //Starts the gameScreen()
    begin = millis();  //Begins countdown timer
 }
}

// This method sets the necessary variables to start the game  
void startGame() {
  gameScreen=1;
}
void gameOver() {
  gameScreen=2;
}

/********* Created by Mackenzie Pascual, Student Number: 22518529 *********/
