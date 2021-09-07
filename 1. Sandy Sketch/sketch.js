class Trace {
  constructor(posX, posY){
    this.posX = posX;
    this.posY = posY;
    this.opacity = 1;
  }
  
  equlas(obj){
    if(this.posX == obj.posX && this.posY == obj.posY && this.opacity == obj.opacity){
      return true;
    }
    else{
      return false;
    }
  }
  
  faded(){
    this.opacity /= 3;
    if(this.opacity > 0.1){
      return false;
    }
    else{
      return true;
    }
  }

  draw(){
    noStroke();
    fill(91, 73, 35, 256*this.opacity - 1);
    ellipse(this.posX, this.posY, 15, 15);
  }
}

class Wave {
  constructor(){
    this.posX = -100;
    this.posY = 600;
    this.rising = false;
    this.left = Math.floor(Math.random()*2) == 0? true: false;
  }
  
  setImage(img){
    this.img = img;
  }
  
  tick(){
    var flag = false;
    
    if(this.left && this.posX < -170){
      this.left = Math.floor(Math.random()*(this.posX + 200)) == 0? true: false;
    }
    else if(!this.left && this.posX > -70){
      this.left = Math.floor(Math.random()*this.posX) == 0? true: false;
    }
    
    if(this.left){
      this.posX -= 1;
    }
    else{
      this.posX += 1;
    }
    
    if(this.rising){
      this.posY -= 3;
      if(this.posY < -120){
        this.rising = Math.floor(Math.random()*(this.posY+200)) <= 0? false:true;
        if(!this.rising){
          flag = true;
        }
      }
    }
    else{
      if(this.posY < 600){
        this.posY += 3;
      }
    }
    return flag;
  }
  
  startRising(){
    this.rising = true;
  }
  
  draw(){
    image(this.img, this.posX, this.posY);
  }
}

var sand;
var wave_img;
var d = new Date();
var last_wave = d.getSeconds();
var gap;
var background_opacity = 0;
var trace = new Set();
var wave = new Wave();
var footprints = new Set();
var footprint;
var background_music;
var mode = 1;
var count = 0;
var befX;
var befY;
var flipped = true;

function preload(){
  background_music = loadSound("https://chan2ie.github.io/resources/Seagulls_on_the_Sea.mp3");
  footprint = loadImage("https://i.ibb.co/wpKgzvs/footprint.png");
  sand = loadImage("https://i.ibb.co/cYvWrPF/sand.png");
  wave_image = loadImage("https://i.ibb.co/Gt3LvN8/wave.png");
}

function setup(){
  wave.setImage(wave_image);
  createCanvas(600, 600);
  gap = Math.floor(Math.random()*5) + 3;
  background_music.loop(0, 1, 0.15)
}

function keyPressed(){
  if(key == 'm'){
    if(background_music.isLooping()){
      background_music.pause();
    }
    else{
      background_music.play();
    }
  }
}

function draw(){
  image(sand, 0, 0, 600, 600);
  if(mouseIsPressed){
      trace.add(new Trace(mouseX, mouseY));
  }

  for(const tr of trace){
    tr.draw()
  }
  for(const fp of footprints){
    fp.draw()
  }
  
  var d_n = new Date();
  var now = d_n.getSeconds();
  var calc_gap = now - last_wave < 0? now - last_wave + 60 : now - last_wave;
  
  if(calc_gap == gap){
     wave.startRising();
  }
  if(wave.tick()){
    background_opacity = 0.5;
    d = new Date()
    last_wave = d.getSeconds();
    gap = Math.floor(Math.random()*5) + 8;
    
    var temp = new Set();
    
    for(const tr of trace){
      if(tr.faded()){
        temp.add(tr)
      }
    }
    
    for(const tr of temp){
      trace.delete(tr)
    }
  }
  
  if(background_opacity>0){
    noStroke();
    fill(91, 73, 35, 256*background_opacity -1);
    square(0, 0, 600);
    background_opacity -= 0.001;
  }
  wave.draw();
}
