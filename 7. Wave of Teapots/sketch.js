var center_teapot;
var center_rot;
var center_count = 0;
var falling;
var color_idx = 0;
var current_color;
var teapotmodel;

class Teapot {
    constructor(radius, count, index, scale) {
        this.obj = teapotmodel;

        this.scale = scale;
        this.angle = radians(float(360) / count * index);
        this.radius = radius;
    }

    draw(delta, rotX, transZ) {
        rotateZ(HALF_PI + this.angle + delta);
        translate(0, this.radius, transZ);
        rotateX(-rotX);

        rotateZ(HALF_PI * 3);

        scale(this.scale);

        model(teapotmodel);
    }
}

class TeapotLayer {
    constructor(numTeapot, radius, scale) {
        this.teapots = [];
        this.delta = 0.3 / scale / numTeapot;
        for (let i = 0; i < numTeapot; i++) {
            this.teapots.push(new Teapot(radius, numTeapot, i, scale));
        }
        this.numTeapot = numTeapot;
        this.radius = radius;
        this.scale = scale;
        if (numTeapot % 2 == 1) {
            this.rotX = HALF_PI / 2;
            this.falling = true;
        } else {
            this.rotX = -HALF_PI / 2;
            this.falling = false;
        }
        this.fall_count = 0;
        this.rot = 0;
    }

    draw() {

        var transZ;

        if (this.falling) {
            transZ = (2500 - (this.fall_count - 50) * (this.fall_count - 50)) / 100 * this.scale;
        } else {
            transZ = (-2500 + (this.fall_count - 50) * (this.fall_count - 50)) / 100 * this.scale;
        }
        this.fall_count += 1;
        if (this.fall_count == 100) {
            this.fall_count = 0;
            this.falling = !this.falling;
        }

        this.teapots.forEach(function (pot) {

            push();
            pot.draw(this.rot, this.rotX, transZ);
            pop();

        }, this)
        this.rot += this.delta;
        this.rotX += radians(360.0 / 200);
    }

}

var layers;

function preload() {
    teapotmodel = loadModel("teapot.obj")

}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    colorMode(HSB, 360, 100, 100);
    layers = [];
    falling = false;
    center_rot = HALF_PI;

    layers.push(new TeapotLayer(5, 250, 6));
    layers.push(new TeapotLayer(12, 380, 3.8));
    layers.push(new TeapotLayer(21, 500, 3));
    layers.push(new TeapotLayer(40, 620, 2.5));
    layers.push(new TeapotLayer(83, 750, 1.8));
    layers.push(new TeapotLayer(160, 890, 1.3));
    layers.push(new TeapotLayer(231, 1000, 1));
}

function draw() {
    background(0);
    
    //set light
    pointLight(184, 15, 100, 0, 0, 800);
    pointLight(271, 80, 50, 1200, 0, 0);
    pointLight(5, 80, 50, -1200, 0, 0);
    
    //set color
    fill(frameCount % 360, 20, 50);
    noStroke();
    
    //draw pots
    layers.forEach(function (potlayer) {
        potlayer.draw();
    })

    //calculate position & scale of the pot at the center
    var transZ = 0;

    if (falling) {
        transZ = (2500 - (center_count - 50) * (center_count - 50)) / 100 * 20;
    } else {
        transZ = (-2500 + (center_count - 50) * (center_count - 50)) / 100 * 20;
    }
    center_count += 1;
    if (center_count == 100) {
        center_count = 0;
        falling = !falling;
        color_idx = (color_idx + 1) % 7;
    }
    
    //draw pot at the center
    translate(0, 0, transZ);
    rotateX(center_rot);
    rotateY(center_rot);

    scale(8 + transZ / 100);

    model(teapotmodel);

    center_rot += radians(360.0 / 200);
}