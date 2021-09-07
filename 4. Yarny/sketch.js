//Initializing global variables
var rainbow_palette;
var color_idx = 0;
var color_count = 0;
var angle_count = 0;
var speed = 120;
var angle_delta = 1;
var x = 0;
var y = 0;
var x0 = 0;
var y0 = 0;
var nx = 0;
var ny = 0;
var drawing = false;
var doodle = false;
var distance = 100;

//Create canvas and color palette
function setup() {
  createCanvas(windowWidth, windowHeight);
  rainbow_palette = [color('#FC9BB3'), 
                       color('#EE2737'), 
                       color('#FF8200'), 
                       color('#FEDB00'), 
                       color('#56C271'), 
                       color('#5BC2E7'), 
                       color('#2E008B'), 
                       color('#6638B6')];
}

function draw() {
  //calculate color
  color_count += speed/60;
  if(color_count > speed){
    color_count = 0;
    color_idx = color_idx < 7? color_idx + 1: 0;
  }
  let next_color = color_idx < 7? color_idx + 1: 0;
  cur_color = lerpColor(rainbow_palette[color_idx], rainbow_palette[next_color], color_count / speed)
  stroke(cur_color);
  strokeWeight(20);

  // move origin point towards mouse position 
  x0 += (mouseX - x0) * 0.01;
  y0 += (mouseY - y0) * 0.01;
  
  //calculate new point
  angle_count = angle_count < speed? angle_count + angle_delta : 0;
  if(doodle){
    distance += random(-3, 3);
  }
  
  if(keyIsDown(RIGHT_ARROW)){
    distance += 1;
  }
  else if(keyIsDown(LEFT_ARROW)){
    distance -= 1;
  }
  
  [x, y] = getXY(angle_count/speed*360);
  translate(x0, y0);
  if(drawing){
    line(x, y, nx, ny);
    //ellipse(x, y, 30, 30);  
  }
  nx = x;
  ny = y;
}

function mouseClicked(){
  drawing = !drawing;
  x0 = mouseX;
  y0 = mouseY;
}

function keyReleased(){
  if (key == 'F' || key == 'f'){
    angle_delta = -angle_delta;
  }
  if (key == 'D' || key == 'd'){
    doodle = !doodle;
  }
  if (key == 'R' || key == 'r'){
    clear();
  }
}

function getXY(angle){
  let rad = angle / 360 * Math.PI * 2;
  let x = distance * cos(rad);
  let y = -distance * sin(rad);
  
  return [x, y];
}


