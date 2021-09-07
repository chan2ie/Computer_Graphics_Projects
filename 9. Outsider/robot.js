class RobotExtras {
  
  constructor(radius){
    this.array = [];
    this.radius = radius
    this.count = 0
    for(let x = -radius * 100; x < radius * 100; x += 200){
      for(let y = -radius * 100; y < radius * 100; y += 200){
        if ( x*x + y*y < this.radius * this.radius * 10000 &&
             x*x + y*y > 40000){
          if (random(0,1) > 0.7){
            this.array.push(new Robot(true, x, y, random(360)))
            this.count += 1
          }
        }
        
      }
    }
  }
  
  draw_robot(){
    for(let i = 0; i < this.array.length; i++){
      this.array[i].draw_robot();
    }
  }
  
}

class Robot {
  
    constructor(is_extra, x, y, rot){
        this.is_extra = is_extra
        if (is_extra){
          this.red = color(random(100, 200))
          this.body = color(random(100, 200))
          this.part = color(random(100, 200))
        }
        else{
          this.red = color(255, 20, 0)
          this.body = color(0, 255, 255)
          this.part = color(0, 200, 255)
        }
        this.left_arm_angle = 0
        this.right_arm_angle = 0
        this.x = x;
        this.y = y;
        this.rot = radians(rot);
    }

    draw_robot() {
        push()
        translate(this.x, this.y , 0);
        rotateZ(this.rot)
        this.draw_legs(leg_angle);
        translate(0, 0, 200 * sin(radians(leg_angle / 2)));
        this.draw_body();
        translate(0, 0, 75);
        this.draw_head();
        pop()
    }
    draw_legs(leg_angle) {
        push()
        translate(-30, 0, 0)
        this.draw_leg(leg_angle)
        pop()
        push()
        translate(30, 0, 0)
        this.draw_leg(leg_angle)
        pop()
    }
    draw_leg(leg_angle) {
        push()
        fill(this.red)
        translate(0, 10, 15)
        box(55, 80, 30)
        pop()
        push()
        fill(this.body)
        translate(0, 0, 100 * sin(radians(leg_angle / 2)) / 2 + 15)
        rotateX(-1 * radians(90 - leg_angle / 2))
        box(50, 50, 100);
        pop()
        push()
        fill(this.part);
        translate(0, 50 * cos(radians(leg_angle / 2)), 150 * sin(radians(leg_angle / 2)) / 2 + 35)
        rotateZ(radians(90))
        cylinder(20, 55);
        pop()
        push()
        fill(this.body)
        translate(0, 0, 150 * sin(radians(leg_angle / 2)) + 15)
        rotateX(radians(90 - leg_angle / 2))
        box(50, 50, 100);
        pop()
    }
    draw_arm(is_left, arm_angle) {
        push()
        translate(is_left * (60 + 10), 0, 40)
        rotateX(radians(arm_angle))
        push()
        fill(this.part)
        rotateZ(radians(90))
        cylinder(20, 30)
        pop()
        push()
        fill(this.body)
        translate(is_left * 2.5, 0, -35)
        box(20, 40, 80)
        rotateZ(radians(90))
        translate(0, 0, -40)
        fill(this.part)
        cylinder(20, 30)
        rotateZ(radians(-90))
        fill(this.body)
        translate(0, 40 * cos(radians(30)), -40 * sin(radians(30)))
        rotateX(radians(-120))
        box(20, 40, 80)
        pop()
        pop()
    }
    draw_body() {
        translate(0, 0, 75)
        fill(this.body)
        box(120, 120, 150)
        push()
        translate(0, 60, 0)
        fill(200)
        box(80, 10, 110)
        pop()
        push()
        translate(0, 0, 100)
        rotateX(radians(90))
        cylinder(20, 50)
        pop()

        this.draw_arm(-1, this.is_extra? right_arm_angle : this.right_arm_angle)
        this.draw_arm(1, this.is_extra? left_arm_angle : this.left_arm_angle)
    }
    draw_head() {
        translate(0, 0, 60);
        fill(this.body);
        box(100);
        push()
        translate(0, 0, 50);
        if(!this.is_extra){
          emissiveMaterial(head_light)
        }
        sphere(20);
        pop()
        push()
        translate(-20, 50, 10);
        fill(50);
        sphere(15);
        pop()
        push()
        translate(20, 50, 10);
        fill(50);
        sphere(15);
        pop()
        push()
        translate(0, 50, -20);
        fill(100);
        box(35, 5, 15);
        pop()
    }

}