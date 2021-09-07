let leg_angle = 180;
let left_arm_angle = 30;
let right_arm_angle = 120;
let head_light;
delta = 3;
arm_delta = 2;

function preload(){
  bgm = createAudio("/bgm.mp3")
  
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    head_light = color(250, 40, 20, 150);  
    the_robot = new Robot(false, 0, 0, 0)
    robot_extras = new RobotExtras(12);
    bgm.volume(0.1)  
    bgm.play()
}

function draw() {
    camera(0, 1000, 1000, 0, -200, 0, 0, 1, 0);
    background(0);
    lights();
  
    // set lights
    spotLight(0, 250, 0, 0, 0, 1000, 0, 0, -1, Math.PI / 16);
    spotLight(244, 250, 0, 0, 0, 1000, 0.3 * cos(frameCount * 0.1), 0.3*sin(frameCount * 0.1), -1, Math.PI / 16); 
    spotLight(244, 0, 0, 0, 0, 1000, 0.3 - 0.5 * cos(frameCount * 0.07), 0.7*sin(25 + frameCount * 0.07), -1, Math.PI / 16); 
    spotLight(244, 0, 255, 0, 0, 1000,-1* cos(frameCount * 0.06), -0.4*sin(25 + frameCount * 0.06), -1, Math.PI / 16); 

    // draw plane & robots
    noStroke();
    fill(250);
    plane(3000);
    push()
    the_robot.draw_robot();
    robot_extras.draw_robot();
    pop()
  
    // rearrange leg & arm angles
    leg_angle += delta;
    if (leg_angle < 140 || leg_angle > 180) {
        delta *= -1
    }
    left_arm_angle += arm_delta;
    right_arm_angle -= arm_delta;
    if (left_arm_angle < 30 || left_arm_angle > 120){
        arm_delta *= -1
    }
  
    if (keyIsDown(LEFT_ARROW) && the_robot.left_arm_angle < 120){
      the_robot.left_arm_angle += 2
    }
    else if (the_robot.left_arm_angle > 0){
      the_robot.left_arm_angle -= 2
    }    
    if (keyIsDown(RIGHT_ARROW) && the_robot.right_arm_angle < 120){
      the_robot.right_arm_angle += 2
    }
    else if (the_robot.right_arm_angle > 0){
      the_robot.right_arm_angle -= 2
    }
    
    if (the_robot.right_arm_angle != 0 || the_robot.left_arm_angle != 0){
      head_light = color(0, 250, 20, 150);  
    }
    else{
      head_light = color(250, 40, 20, 150);  
    }
}


