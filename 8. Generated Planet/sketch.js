/*
  Code Credits
  - Voxel Sphere : https://codepen.io/sha99y8oy/pen/kXRZLr
  
  Features
  - 1st slider: control size of the planet
  - 2nd slider: control complexity of landscape
  - 3rd slider: control color of the planet
  - key pressed: reset noise seed
*/

var maxBoxSz = 720;
var minBoxSz = 200;
var defBoxSz = 320;

var gridSz = defBoxSz / 8;

var rotX = 0;
var rotY = 0;

var zTranslate = -defBoxSz;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    colorMode(HSB);

    // set sliders
    boxSz_sl = createSlider(minBoxSz, maxBoxSz, defBoxSz);
    boxSz_sl.position(10, 30);

    noiseSz_sl = createSlider(20, 100, 50);
    noiseSz_sl.position(10, 50);

    hue_sl = createSlider(1, 255, 119);
    hue_sl.position(10, 70);

}

function draw() {
    background(0);
  

    // set camera position
    zTranslate = -boxSz_sl.value() * boxSz_sl.value() / 320;
    translate(0, 0, zTranslate);

    let xp = (mouseX - windowWidth / 2);
    let yp = (mouseY - windowHeight / 2)
    rotate(sqrt(pow(xp, 2) + pow(yp, 2)) * 0.01, [-yp, xp, 0])
  
    // draw planet
    push();
    VoxelShpere(boxSz_sl.value());
    pop();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function VoxelShpere(boxSz) {
    var radius = boxSz - (boxSz / 10);

    noStroke();
    hue_green = hue_sl.value()
    hue_blue = (hue_sl.value() + 84) % 255;

    for (var x = -boxSz + gridSz; x <= boxSz - gridSz; x += gridSz) {
        for (var y = -boxSz + gridSz; y <= boxSz - gridSz; y += gridSz) {
            for (var z = -boxSz + gridSz; z <= boxSz - gridSz; z += gridSz) {

                var d = dist(0, 0, 0, x, y, z);
                if ((d > radius - gridSz) && (d < radius)) {
                    push();
                    // set color
                    var nos = noise(
                        (x + maxBoxSz) * noiseSz_sl.value() * 0.0001,
                        (y + maxBoxSz) * noiseSz_sl.value() * 0.0001,
                        (z + maxBoxSz) * noiseSz_sl.value() * 0.0001);
                    if (nos < 0.5)
                        fill(hue_green, 81, 20 + nos * 100);
                    else
                        fill(hue_blue, 100, 70 - nos * 50);
                    translate(x, y, z);
                    box(gridSz);
                    pop();
                }
            }
        }
    }
}

function keyPressed() {
    // set noise seed
    noiseSeed(10000 * random(1))
}