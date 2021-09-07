var sentence = ["Your body", "is a","battleground"];
var boundboxes = [];
var startpoints = [];
var textsize = 200;
var points = [];
var mousepointercolor;
var power = 300;
var shot;
var reversed = false;
var count = 0;

class Point{
  constructor(initX, initY, marginX, marginY){
    this.x = marginX + initX;
    this.y = marginY + initY;
    this.orgX = this.x;
    this.orgY = this.y;
    this.distance = 0;
  }
  pushed(){
    let distance = sqrt(pow(mouseX - this.x, 2) + pow(mouseY - this.y, 2));
    let weight = sqrt(distance)
    let angle = atan((-mouseY + this.y)/(mouseX - this.x));
    if (mouseX > this.x){
      angle -= Math.PI;
    }
    
    let [dx,dy] = getdelta(angle, power / weight);
    
    this.x += dx;
    this.y += dy;
  }
  tick(){
    let distance = sqrt(pow(this.x - this.orgX, 2) + pow(this.y - this.orgY, 2));
    if(distance < 1 || isNaN(distance)){
      distance = 0;
    }
    this.distance = distance;
    if(distance <= 0){
      return;
    }
    let weight = distance * 0.00005;
    let angle = atan((-this.orgY + this.y)/(this.orgX - this.x));
    if (this.orgX > this.x){
      angle -= Math.PI;
    }
    let [dx,dy] = getdelta(angle, power * weight);
    
    this.x -= dx;
    this.y -= dy;
  }
}

function preload(){
  font = loadFont("./futurabolditalic.ttf");
  shot = loadSound("Gunshots-1.wav");
  
  shot.setVolume(0.3);
}
function setup(){
  frameRate(60);
  
  createCanvas(windowWidth, windowHeight);
  
  mousepointercolor = color(255, 0, 0);
  mousepointercolor.setAlpha(128);
  
  let boundheight = 0;
  for(var i =0; i < sentence.length; i++){
    let s = sentence[i];
    
    append(boundboxes, font.textBounds(s, 0, 0, textsize));
    
    boundheight += boundboxes[i].h;
  }
  
  let margintop = 0;
  
  for(var i =0; i < sentence.length; i++){
    let s = sentence[i];
    
    p = font.textToPoints(s, 0, 0, textsize, {
      sampleFactor: 0.2
    }); 
    
    for(var j = 0; j < p.length; j++){
      temp = new Point(p[j].x, p[j].y, 
                   windowWidth/2 - boundboxes[i].w/2,
                   windowHeight/2 - boundheight/2 + margintop - boundboxes[i].y);
      append(points, temp);
    }
    
    append(startpoints, 
           [windowWidth/2 - boundboxes[i].w/2, 
            windowHeight/2 - boundheight/2 + margintop]);
    margintop += boundboxes[i].h;
  }
 
}

function draw(){

  background(0);
  
  //fill(234, 9, 7);
  //stroke(234, 9, 7);
  //strokeWeight(10);
  
  //for(var i =0; i < sentence.length; i++){
  //  rect(startpoints[i][0], startpoints[i][1], boundboxes[i].w, boundboxes[i].h);
  //}
  
  noStroke();
  
  for(var i = 0; i < points.length; i++){
    points[i].tick();
    c = pow(points[i].distance, 1.5) > 255? 0: 255 - pow(points[i].distance, 1.5);
    fill(lerpColor(color(234, 9, 7), color(255, 255, 255), c/255));
    ellipse(points[i].x, points[i].y, 10, 10);
  }
  
  fill(mousepointercolor)
  ellipse(mouseX, mouseY, 30, 30);
  
  if(reversed){
    background(255);
  }
  
  if(reversed){
    count += 1;
    if(count == 5){
      reversed = false;
      count = 0;
    }
  }
}

function mouseClicked(){
  for(var i = 0; i < points.length; i++){
    points[i].pushed();
  }
  
  shot.play();
  
  reversed = true;
}

function getdelta(angle, distance){
  let rad = angle;
  let x = distance * cos(rad);
  let y = -distance * sin(rad);
  
  return [x, y];
}
