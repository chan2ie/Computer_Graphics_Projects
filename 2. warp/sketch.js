// LightSpeed travel

const num_lights = 1000;

var outer_circle_radius;
var star_lights=[];

var tl, tr, bl, br;

class StarLight {
  constructor(degree){
    this.ini_start = [0, 0];
    this.ini_end = point_at(outer_circle_radius, degree);
    this.degree = degree;
    
    this.start = [0,0];
    this.end = [0,0];
    
    this.status = int(random(15));
    
    this.start_p = 0;
    this.end_p = 0;
    
    this.speed = 1;
    
    this.paused = false;
  }
  
  update_initials(){
    this.ini_start = [mouseX, mouseY];
    this.ini_end = point_at(outer_circle_radius, this.degree);
  }
  
  update_line_seg(){
    if(this.paused){
      if(this.status == 0){
        this.status = 1;
      }
      this.end_p -= this.status * 0.015;
      if (this.end_p < this.start_p){
        this.end_p = this.start_p;
      }
    }
    else{
      this.start_p = this.start_p + (0.07 + (random(1)-0.5)*0.1)*this.speed;
      this.end_p = this.start_p + (this.status * 0.05 + (random(1) - 0.5) * 0.1)*this.speed; 
    }
    var res = line_segment(this.ini_start, this.ini_end, this.start_p, this.end_p);
    this.start = res[0];
    this.end = res[1];
  }
  
  update_status(){
    this.update_initials();
    if(this.paused){
      this.speed = 0.001;
    }
    else if(random(3)<1 && this.status == 0){
      this.satus = 1;
    }
    else if(this.status < 15){
      this.status += 1;
    }
    else{
      this.status = 0;
      this.start_p = 0;
      this.end_p = 0;
    }
    if(this.speed < 1){
      this.speed *=2;
    }
    
    this.update_line_seg();
  }
  
  draw(){
    let rand = 100 + int(random(150))
    stroke(rand, rand, 250);
    line(this.start[0], this.start[1], this.end[0], this.end[1]);
    if(this.paused){
    }
  }
  
}

function preload() {
  consolas = loadFont('consola.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  frameRate(24);
  
  for(let i = 0; i<360; i+=360/num_lights){
    star_lights.push(new StarLight(i));
  }
}

function mouseClicked(){
    for(let i = 0; i < star_lights.length; i++){
      star_lights[i].paused = !star_lights[i].paused; 
  }
}

function draw() {
  resizeCanvas(windowWidth, windowHeight);
  background(220);
  
  noStroke();
  fill(0);
  outer_circle_radius = windowHeight/2;
  ellipse(windowWidth/2, windowHeight/2, outer_circle_radius * 2);
  
  for(let i = 0; i < star_lights.length; i++){
    star_lights[i].update_status();
    star_lights[i].draw(); 
  }
  
  noStroke();
  fill(0);
  
  tr = point_at(outer_circle_radius, 30);
  tl = point_at(outer_circle_radius, 150);
  bl = point_at(outer_circle_radius, 210);
  br = point_at(outer_circle_radius, 330);
  
  rect(0, 0, windowWidth, tr[1]);
  rect(0, 0, tl[0], windowHeight);
  rect(0, bl[1], windowWidth, windowHeight - bl[1]);
  rect(tr[0], 0, windowWidth - tr[0], windowHeight);

  stroke(255);
  noFill();
  rect(tl[0], tl[1], tr[0]-tl[0], bl[1]-tl[1])
  
  noStroke();
  textFont(consolas);
  fill(255, 232, 4);
  textSize(40);
  textAlign(CENTER, CENTER);
  text('warp.', width / 2,tr[1]/2)
  textSize(18);
  text('mouse click to start/stop', width / 2, (windowHeight + bl[1])/2)
}
  

function line_segment(start, end, start_p, end_p){
  var full_length = Math.sqrt((start[0]-end[0])*(start[0]-end[0]) + (start[1]-end[1]) * (start[1]-end[1]));
  var new_start = [];
  var new_end = [];
  
  new_start[0] = start[0] * (1-start_p) + end[0] * start_p;
  new_start[1] = start[1] * (1-start_p) + end[1] * start_p;
  
  new_end[0] = start[0] * (1-end_p) + end[0] * end_p;
  new_end[1] = start[1] * (1-end_p) + end[1] * end_p;
  
  
  
  return [new_start, new_end];
}

function point_at(distance, degree){
  let rad = degree / 360 * Math.PI * 2;
  let x = distance * cos(rad) + windowWidth/2;
  let y = -distance * sin(rad) + windowHeight/2;
  
  return [x, y];
}