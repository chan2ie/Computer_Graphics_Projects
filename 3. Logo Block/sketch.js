var setting_left;
var setting_top;

function preload(){
  logo_font = loadFont('/BlackHanSans-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  setting_left = windowWidth/2 + 100 + 10;
  setting_top = windowHeight/2 - 200 + 10;
  
  textFont('Helvetica');
  
  //Text Settings
  input = createInput();
  input.value('Type Here');
  text_size = createSlider(40, 80, 55);
  text_color = createColorPicker('#840101');
  stroked = createCheckbox('', true);
  line_width = createSlider(1, 15, 3);
  
  //Shadow Settings
  mode = createSelect();
  mode.option('plain');
  mode.option('gradient');
  mode.selected('plain');
  shadow_length = createSlider(10, 120, 40);
  shadow_color1 = createColorPicker('#ed225d');
  shadow_color2 = createColorPicker('#FFFFFF');
  
  //Save Button
  save_pb = createButton('Save');
  save_pb.mousePressed(saveLogo);
  
  //create logo area
  logo_area = createGraphics(400, 400);
  logo_area.clear();
  logo_area.textFont(logo_font);
}

function draw() {
  //Repaint background
  resizeCanvas(windowWidth, windowHeight);
  background(255,233,244);
  fill(245,245,245);
  noStroke();
  rect(windowWidth/2 - 300, windowHeight/2  - 200, 
       600, 400, 10);
  
  //**********Paint Logo**********//
  logo_area.background(255);
  logo_area.textSize(text_size.value());
  
  //Calculate text position
  var text_x = 200 - shadow_length.value() / 2 - logo_area.textWidth(input.value())/2;
  var text_y = 200 - shadow_length.value() / 2 + logo_area.textAscent()*text_size.value()/20;
  
  //Draw Shadow
  for(var i = shadow_length.value(); i > 0; i--){
    //Calculate Shadow Color
    if(mode.value() == 'plain'){
      c = shadow_color1.color();
    }
    else if(mode.value() == 'gradient'){
      var c1 = shadow_color1.color();
      var c2 = shadow_color2.color();
      c = lerpColor(c1, c2, i/shadow_length.value());
    }  
    if(stroked.checked()){
      logo_area.fill(c);
      logo_area.strokeWeight(line_width.value());
      logo_area.stroke(c);
    }
    else{
      logo_area.fill(c);
      logo_area.noStroke(); 
    }
    logo_area.text(input.value(), text_x + i, text_y + i);
  }
  
  //Get Text Style
  if(stroked.checked()){
    logo_area.fill(255);
    logo_area.strokeWeight(line_width.value());
    logo_area.stroke(text_color.color());
  }
  else{
    logo_area.fill(text_color.color());
    logo_area.noStroke(); 
  }
  
  //Draw Text
  logo_area.text(input.value(), text_x, text_y);
  
  //Paint Logo
  image(logo_area, windowWidth/2 - 300, windowHeight/2  - 200);
  
  //Calculate GUI position
  setting_left = windowWidth/2 + 100 + 10;
  setting_top = windowHeight/2 - 200 + 20;
  
  //Repaint GUI
  paintTexts();
  setPosition();
}

function paintTexts(){
  textFont('Helvetica');
  fill(0);
  
  textStyle(BOLDITALIC);
  text('Text Settings', setting_left, setting_top);
  
  textStyle(NORMAL);
  text('Text Size', setting_left, setting_top + 50);
  text('Color', setting_left, setting_top + 70);
  text('Stroked', setting_left + 125, setting_top + 70);
  if(stroked.checked()){
    text('Weight', setting_left, setting_top + 95);
  }
  
  textStyle(BOLDITALIC);
  text('Shadow Settings', setting_left, setting_top + 130);
  textStyle(NORMAL);
  text('Length', setting_left, setting_top + 150);
  text('Mode', setting_left, setting_top + 175);
  text('Color 1', setting_left, setting_top + 200);
  if(mode.value() == 'gradient'){
    text('Color 2', setting_left, setting_top + 225);
  }
}

function setPosition(){
  input.position(setting_left, setting_top + 10);
  text_size.position(setting_left + 50, setting_top + 35);
  text_color.size(50, 20);
  text_color.position(setting_left + 50, setting_top + 55);
  stroked.position(setting_left + 105, setting_top + 55);
  line_width.position(setting_left + 50, setting_top + 80);
  if(stroked.checked()){
    line_width.show();
  }
  else{
    line_width.hide();
  }
  
  shadow_length.position(setting_left + 50, setting_top + 135);
  mode.position(setting_left + 50, setting_top + 160);
  
  shadow_color1.position(setting_left + 50, setting_top + 185);
  shadow_color2.position(setting_left + 50, setting_top + 210);
  shadow_color1.size(50, 20);
  shadow_color2.size(50, 20);
  if(mode.value() == 'plain'){
    shadow_color2.hide();
  }
  else{
    shadow_color2.show();
  }
  
  save_pb.position(setting_left + 135, setting_top + 350);
}

function saveLogo(){
    saveCanvas(logo_area, 'myLogo', 'jpg');
}