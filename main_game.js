// final project : Nik Kota, UIN : 676167466
// ART 151

var c;
var bird_machine;
var pipe_bird;
var town_bird;
var floor_ground;
var start_text;
var beepsoundfx;
var wingosoundeffect;
var tapsoundfx;
var deathsoundfx;
var wingersoundfx;
var our_font;

//mouse presses
var mouse_press_test = false;
var mouse_test_sense = false;
var release_test_pointer = false;
var keyPress = false;
var test_press_unlock = false;
var key_press_unlock = false;

//game attributes
var object_poles = [];
var final_score = 0;
var max_score = 0;
var max_speed = 3;
var distance_width = 80;
var end_game_event = false;
var menu_page = "MENU";
var X_axis_lmit = 0;
var game_start = false;

var bird_game = {
  
  x : 100,
  y : 0,
  
  target : 0,
  
  velocityY : 0,
  
  fly : false,
  
  angle : 0,
  
  falls : false,
  flashAnim : 0,
  flashReturn : false,
  kinematicAnim : 0,
  
  display : function() {
    
    if((!mouse_press_test) || this.falls) {
      push();
        translate(this.x,this.y);
        rotate(radians(this.angle));
        image(bird_machine,0,0, bird_machine.width*1.5,bird_machine.height*3, 0,0 ,bird_machine.width/2,bird_machine.height*3);
      pop();
    }
    else {
      push();
        translate(this.x,this.y);
        rotate(radians(this.angle));
        image(bird_machine,0,0, bird_machine.width*1.5,bird_machine.height*3, bird_machine.width/2,0 ,bird_machine.width/2,bird_machine.height*3);
      pop();
    }
  },
  
  update : function() {
    if(this.falls) {
      if(this.flashAnim>255) {
        this.flashReturn = true;
      }
      
      if(this.flashReturn) {
        this.flashAnim -=60;
      }
      else {
        this.flashAnim +=60;
      }
      
      if(this.flashReturn && this.flashAnim === 0) {
        end_game_event = true;
        menu_gameover.easein();
        try { deathsoundfx.play(); } catch(e) {}
        
        if(final_score > max_score) { max_score = final_score; }
      }
      
      this.y += this.velocityY;
      this.velocityY += 0.4;
      this.angle += 4;
      
      if(max_speed > 0) {
        max_speed = 0;
      }
      
      if(this.angle > 90) {
        this.angle = 90;
      }
    }
    else {
      this.y += this.velocityY;
      this.angle += 2.5;
    
      if(this.angle > 90) {
        this.angle = 90;
      }
    
      if(mouse_test_sense || (test_press_unlock && key == ' ') ) {
        try { wingosoundeffect.play(); } catch(e) {}
        
        this.velocityY = 0;
        this.fly = true;
        this.target = clamp(this.y - 60,-19,height);
        this.angle = -45;
      }
    
    
      if(this.y < this.target) {
        this.fly = false;
        this.target = 10000;
      }
    
    
      if(!this.fly) {
        this.velocityY+=0.4;
      }
      else {
        this.y -= 5;
      }
      
      if(this.y > height-49) {
        if(!bird_game.falls) { try { tapsoundfx.play(); } catch(e) {} }
        this.falls = true;
      }
    }
    this.y = clamp(this.y,-20,height-50);
  },
  
  kinematicMove : function() {
    if(end_game_event) {
      this.x = width/2;
      this.y = height/2;
      
      end_game_event = false;
      final_score = 0;
      distance_width = 90;
    }
    

    this.y = height/2 + map( sin(frameCount*0.1),0,1,-2,2 );
    push();
      translate(this.x,this.y);
      image(bird_machine,0,0, bird_machine.width*1.5,bird_machine.height*3, 0,0 ,bird_machine.width/2,bird_machine.height*3);
    pop();
  }
}
function setup() {
  if(mobile()) {
    c = createCanvas(windowWidth,windowHeight);
  }
  else {
    c = createCanvas(400,600);
  }
  
  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(CENTER);
  textAlign(CENTER,CENTER);
  noSmooth();
  object_poles[0] = new Pipe();
  bird_machine = loadImage('assets/bird_model.png');
  pipe_bird = loadImage('assets/pole.png');
  town_bird = loadImage('assets/town.png');
  floor_ground = loadImage('assets/floor.png');
  start_text = loadImage('assets/main_text.png');
  beepsoundfx = loadSound('assets/fx_beep.wav');
  tapsoundfx = loadSound('assets/fx_tap.wav');
  deathsoundfx = loadSound('assets/fx_death.wav');
  wingosoundeffect = loadSound('assets/fx_wingeffect.wav');
  wingersoundfx = loadSound('assets/fx_winger.wav');
  our_font = loadFont('assets/flappy-font.ttf');
  bird_game.y = height/2;
  try { textFont(our_font); } catch(e) {}
}

function ss(data) {
  console.log(data);
}
function draw() {
  background(123,196,208);
  
  switch(menu_page) {
    case 'GAME':
      page_game();
      break;
    case 'MENU':
      page_menu();
      break;
  }
  mouse_test_sense = false;
  release_test_pointer = false;
  test_press_unlock = false;
  key_press_unlock = false;
}
function mousePressed() {
  mouse_press_test = true;
  mouse_test_sense = true;
}
function mouseReleased() {
  mouse_press_test = false;
  release_test_pointer = true;
}
function keyPressed() {
  keyPress = true;
  test_press_unlock = true;
}
function keyReleased() {
  keyPress = false;
  key_press_unlock = true;
}
function page_game() {
  
  X_axis_lmit += max_speed;
  if(X_axis_lmit > town_bird.width/2) {
    X_axis_lmit = 0;
  }

  image(town_bird, town_bird.width/2/2 ,height-town_bird.height/2/2-40,town_bird.width/2,town_bird.height/2);

  if(!bird_game.falls) {
    if(parseInt(frameCount)%70 === 0) {
      object_poles.push(new Pipe());
    }
  }
  
  for(var i=0; i<object_poles.length; i++) {
    if(object_poles[i].x < -50) {
      object_poles.splice(i,1);
    }
    
    try {
      object_poles[i].display();
      object_poles[i].update();
    } catch(e) {}
  }
  
  image(floor_ground,floor_ground.width-X_axis_lmit,height-floor_ground.height ,floor_ground.width*2,floor_ground.height*2);
  image(floor_ground,floor_ground.width+floor_ground.width-X_axis_lmit,height-floor_ground.height ,floor_ground.width*2,floor_ground.height*2);
  image(floor_ground,floor_ground.width+floor_ground.width*2-X_axis_lmit,height-floor_ground.height ,floor_ground.width*2,floor_ground.height*2);
  
  
  bird_game.display();
  bird_game.update();
  bird_game.x = smoothMove(bird_game.x,90,0.02);
  
  if(!end_game_event) { // updates and checks game scoreboard
    push();
      stroke(0);
      strokeWeight(5);
      fill(255);
      textSize(30);
      text(final_score,width/2,50);
    pop();
  }
  
  push();
    noStroke();
    fill(255,bird_game.flashAnim);
    rect(width/2,height/2,width,height);
  pop();
  
  if(end_game_event) {
    menu_gameover.display();
    menu_gameover.update();
  }
}

function page_menu() {
  max_speed = 1;
  X_axis_lmit += max_speed;
  if(X_axis_lmit > town_bird.width/2) {
    X_axis_lmit = 0;
  }
  
  //town background
  image(town_bird, town_bird.width/2/2 ,height-town_bird.height/2/2-40,town_bird.width/2,town_bird.height/2);
  
  //test floor for objects
  image(floor_ground,floor_ground.width-X_axis_lmit,height-floor_ground.height ,floor_ground.width*2,floor_ground.height*2);
  image(floor_ground,floor_ground.width+floor_ground.width-X_axis_lmit,height-floor_ground.height ,floor_ground.width*2,floor_ground.height*2);
  image(floor_ground,floor_ground.width+floor_ground.width*2-X_axis_lmit,height-floor_ground.height ,floor_ground.width*2,floor_ground.height*2);
  
  image(start_text,width/2,100,start_text.width/4,start_text.height/4);
  
  bird_game.kinematicMove();
  
  push();
    fill(230,97,29);
    stroke(255);
    strokeWeight(3);
    text('Tap to play',width/2,height/2-50);
  pop();

  if(mouse_test_sense || (test_press_unlock && key == ' ') ) {
  	menu_page = "GAME";
    resetGame();
  	
  	bird_game.velocityY = 0;
    bird_game.fly = true;
    bird_game.target = clamp(this.y - 60,-19,height);
    bird_game.angle = -45;
    bird_game.update();
  }
  bird_game.x = width/2;
	
}

function Pipe() {
  
  this.gapSize = distance_width;
  this.y = random(150,height-150);
  this.x = width + 50;
  this.potential = true;
  
  this.display = function() {
    push();
      translate(this.x,this.y+this.gapSize+pipe_bird.height/2/2);
      image(pipe_bird, 0,0 ,pipe_bird.width/2,pipe_bird.height/2);
    pop();
    
    push();
      translate(this.x,this.y-this.gapSize-pipe_bird.height/2/2);
      rotate(radians(180));
      scale(-1,1);
      image(pipe_bird,0,0,pipe_bird.width/2,pipe_bird.height/2);
    pop();
    
    //Score
    if(this.potential && (bird_game.x > this.x-25 && bird_game.x < this.x+25)) {
      final_score++;
      try { beepsoundfx.play(); } catch(e) {}
      
      if(distance_width > 60) { distance_width--; }
      
      this.potential = false;
    }
    
    if( ( 
        (bird_game.x+20 > this.x-25 && bird_game.x-20 < this.x+25) && 
        (bird_game.y+20 > (this.y-this.gapSize-pipe_bird.height/2/2)-200 && bird_game.y-20 < (this.y-this.gapSize-pipe_bird.height/2/2)+200)
        )
        
        ||
        
        ( 
        (bird_game.x+20 > this.x-25 && bird_game.x-20 < this.x+25) && 
        (bird_game.y+20 > (this.y+this.gapSize+pipe_bird.height/2/2)-200 && bird_game.y-20 < (this.y+this.gapSize+pipe_bird.height/2/2)+200)
        )
        
        ) {
      
      if(!bird_game.falls) { try { tapsoundfx.play(); } catch(e) {} }
      bird_game.falls = true;
    }
  }
  this.update = function() {
    this.x-= max_speed;
  }
}

function clamp(value,min,max) {
  
  if(value < min) {
    value = min;
  }
  if(value > max) {
    value = max;
  }
  
  return value;
}

function resetGame() {
  end_game_event = false;
  distance_width = 80;
  max_speed = 3;
  final_score = 0;
  bird_game.y = height/2
  bird_game.falls = false;
  bird_game.velocityY = 0;
  bird_game.angle = 0;
  bird_game.flashAnim = 0;
  bird_game.flashReturn = false;
  object_poles = [];
  bird_game.target = 10000;
  menu_gameover.ease = 0;
}

var menu_gameover = {
  
  ease : 0,
  easing : false,
  open : false,
  
  display : function() {
    
    push();
      translate(width/2,height/2);
      scale(this.ease);
      
      stroke(83,56,71);
      strokeWeight(2);
      fill(222,215,152);
      rect(0,0,200,200);
      
      noStroke();
      fill(83,56,71);
      text('by Stephcraft',0,-50);
      
      //menu text
      textSize(20);
      strokeWeight(5);
      stroke(83,56,71);
      fill(255);
      text('Flappy Bird',0,-80);
      push();
        textAlign(LEFT,CENTER);
        textSize(12);
        noStroke();
        fill(83,56,71);
        text('score : ',-80,0);
        text('hightscore : ',-80,30);
        
        stroke(0);
        strokeWeight(3);
        fill(255);
        text(final_score,20,0);
        text(max_score,20,30);
      pop();
      
      if(press('restart',0,140,width/2,height/2)) { 
        resetGame();
      }
      
      if(press(' menu ',0,190,width/2,height/2)) { menu_page = 'MENU'; }
    pop();
  },
  
  update : function() {
    if(this.easing) {
      this.ease += 0.1;
      if(this.ease > 1) {
        this.open = true;
        this.ease = 1;
        this.easing = false;
      }
    }
  },
  
  easein : function() {
    this.easing = true;
  }
}

function press(txt,x,y,tX,tY) {
  var this_h = false;
  
  if(mouseX > tX+x-textWidth(txt)/2-10 && mouseX < tX+x+textWidth(txt)/2+10 && mouseY > tY+y-textAscent()/2-10 && mouseY < tY+y+textAscent()/2+10) {
    this_h = true;
  }
  
  push();
    textSize(16);
    
    if(this_h && mouse_press_test) {
      noStroke();
      fill(83,56,71);
      rect(x,y+3,textWidth(txt)+25+10,textAscent()+10+10);
      
      fill(250,117,49);
      stroke(255);
      strokeWeight(3);
      rect(x,y+2,textWidth(txt)+25,textAscent()+10);
    
      noStroke();
      fill(255);
      text(txt,x,y+2);
    }
    else {
    noStroke();
    fill(83,56,71);
    rect(x,y+2,textWidth(txt)+25+10,textAscent()+10+12);
    
    if(this_h) {
      fill(250,117,49);
    }
    else {
      fill(230,97,29);
    }
    stroke(255);
    strokeWeight(3);
    rect(x,y,textWidth(txt)+25,textAscent()+10);
    
    noStroke();
    fill(255);
    text(txt,x,y);
    }
  pop();
  
  if(this_h && release_test_pointer) { try { wingersoundfx.play(); } catch(e) {} }
  
  return (this_h && release_test_pointer);
}

function smoothMove(pos,target,speed) {
	return pos + (target-pos) * speed;
}

function mobile() { 
  if( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)
  ){
     return true;
   }
  else {
     return false;
   }
 }
 
 
 