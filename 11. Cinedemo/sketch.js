let cam_x, cam_y, cam_z;
let cam_cx, cam_cy, cam_cz;
let cam_dx, cam_dy, cam_dz;
let pan, tilt;

let roadModel;
let roadTexture;
let grassTexture;
let dennisModel;
let dennisTexture;
let streetLampModel;
let slider;

let startPos = null;
let endPos = null;

let cameraIsMoving = false;
let animationLength;
let animationCount;

class CamPos {
    constructor(cam_x, cam_y, cam_z, pan, tilt) {
        this.cam_x = cam_x;
        this.cam_y = cam_y;
        this.cam_z = cam_z;
        this.pan = pan;
        this.tilt = tilt;
    }
}

function preload() {
    roadModel = loadModel("/assets/old_road.obj");
    roadTexture = loadImage("/assets/old_road-texture.png")
    grassTexture = loadImage("/assets/grassTexture.png")
    dennisModel = loadModel("/assets/rp_dennis_posed_004_30k.obj")
    dennisTexture = loadImage("assets/rp_dennis_posed_004_dif_2k.jpg")
    streetLampModel = loadModel("/assets/StreetLamp.obj")

}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // init camera
    cam_x = -100;
    cam_y = 0;
    cam_z = 150;

    pan = 0;
    tilt = 0;

    updateCamCenter()
    createGUI()
}


function createGUI() {
    p = createP('Quick Pos')
    p.style('color', 'white')
    p.position(10, -5)

    sel = createSelect()
    sel.option('Initial Position')
    sel.option('Full Shot')
    sel.option('Chest Shot')
    sel.option('Close Up Shot')
    sel.option('First Person Perspective')
    sel.position(95, 11)
    sel.changed(setCameraPosition)

    start_position_btn = createButton('Set Start Point');
    start_position_btn.position(10, 40);
    start_position_btn.mousePressed(setStartPos)

    end_position_btn = createButton('Set End Point');
    end_position_btn.position(120, 40);
    end_position_btn.mousePressed(setEndPos)

    slider = createSlider(0, 300, 60);
    slider.position(8, 70)

    start_btn = createButton('Start Demo');
    start_btn.position(150, 70)
    start_btn.mousePressed(startAnimation)

}

function setCameraPosition() {
    let pos = sel.value()

    if (pos == 'Initial Position') {
        setPos(-100, 0, 150, 0, 0)
    } else if (pos == 'Full Shot') {
        setPos(-168.3, 242.6, 72, -0.9, 0.18)
    } else if (pos == 'Chest Shot') {
        setPos(-61.7, -53, 138, -0.36, 0.1)
    } else if (pos == 'Close Up Shot') {
        setPos(110.3, -66.5, 168, -1.7, -0.12)
    } else if (pos == 'First Person Perspective') {
        setPos(106.8, -118.8, 168, -3.5, -0.1)
    }
}

function setPos(x, y, z, pa, t) {
    cam_x = x;
    cam_y = y;
    cam_z = z;
    pan = pa;
    tilt = t;

    updateCamCenter()
}

function setStartPos() {
    startPos = new CamPos(cam_x, cam_y, cam_z, pan, tilt)
}

function setEndPos() {
    endPos = new CamPos(cam_x, cam_y, cam_z, pan, tilt)
}

function startAnimation() {
    if (cameraIsMoving) return;
    if (!startPos || !endPos) return;

    cameraIsMoving = true;
    animationLength = slider.value()
    animationCount = 0
}

function draw() {
    background(0);

    // light set-up
    spotLight(255, 255, 255, 80, 0, 300, 0, 0, -1, Math.PI / 2);
    pointLight(150, 150, 150, 80, 0, 300);
    push()
    translate(85, 0, 305)
    emissiveMaterial(80, 80, 20);
    sphere(5)
    pop()

    // camera set-up
    camera(cam_x, cam_y, cam_z, cam_cx, cam_cy, cam_cz, 0, 0, -1);
    perspective(radians(60), width / height, 1, 10000);

    // stage set-up
    noStroke();
    texture(grassTexture);
    plane(500)

    rotateX(radians(90));
    push()
    translate(0, -5, 0)
    scale(55);
    fill(0)

    texture(roadTexture);
    model(roadModel)

    pop()

    push()
    translate(130, 0, 120)
    rotateY(radians(-90))
    texture(dennisTexture)
    model(dennisModel)
    pop()

    translate(170, 85, 0)
    rotateY(radians(180))
    scale(0.2)
    fill(150)
    model(streetLampModel)

    lights()

    if (keyIsPressed && !cameraIsMoving) handleUserInput();

    // move camera for demo animation
    if (cameraIsMoving) {
        if (animationLength == animationCount) {
            cameraIsMoving = false
        } else {

            cam_x = getMidPoint(startPos.cam_x, endPos.cam_x)
            cam_y = getMidPoint(startPos.cam_y, endPos.cam_y)
            cam_z = getMidPoint(startPos.cam_z, endPos.cam_z)
            pan = getMidPoint(startPos.pan, endPos.pan)
            tilt = getMidPoint(startPos.tilt, endPos.tilt)

            updateCamCenter()
            animationCount += 1;
        }
    }
}

function getMidPoint(start, end) {

    return start + (end - start) / animationLength * animationCount;

}

function handleUserInput() {
    let s = 2; // moving speed
    switch (keyCode) {
        case UP_ARROW: // tilt up
            tilt += 0.02;
            if (tilt > HALF_PI) tilt = HALF_PI;
            break;
        case DOWN_ARROW: // tilt down
            tilt -= 0.02;
            if (tilt < -HALF_PI) tilt = -HALF_PI;
            break;
        case LEFT_ARROW: // pan to the left
            pan -= 0.02;
            break;
        case RIGHT_ARROW: // pan to the right
            pan += 0.02;
            break;
    }
    switch (key) {
        case 'w': // move forward
            cam_x += s * cam_dx;
            cam_y += s * cam_dy;
            break
        case 's': // move backward
            cam_x -= s * cam_dx;
            cam_y -= s * cam_dy;
            break

        case 'a': // move to left
            cam_x += s * sin(pan) * cos(tilt)
            cam_y -= s * cos(pan) * cos(tilt)
            break
        case 'd': // move to right
            cam_x -= s * sin(pan) * cos(tilt)
            cam_y += s * cos(pan) * cos(tilt)
            break
        case 'u': // move upward
            cam_z += s
            break
        case 'j': // move downward
            cam_z -= s
            break
        case 'p': // prnt camera position
            print(cam_x, cam_y, cam_z, pan, tilt)
            break

    }
    updateCamCenter();
}

function updateCamCenter() {
    // computer camera direction
    // tilt matrix (rotate about y)
    // | dx | = | cos(tilt) 0 -sin(tilt) | | 1 |
    // | dy | = | 0 1 0 | x | 0 |
    // | dz | = | sin(tilt) 0 cos(tilt) | | 0 |
    //cam_dx = cos(tilt);
    //cam_dy = 0;
    //cam_dz = sin(tilt);
    // pan matrix (rotate about z)
    // | dx | = | cos(pan) -sin(pan) 0 | | 1 |
    // | dy | = | sin(pan) cos(pan) 0 | x | 0 |
    // | dz | = | 0 0 1 | | 0 |
    //cam_dx = cos(pan);
    //cam_dy = sin(pan);
    //cam_dz = 0;
    // pan matrix x tilt matrix
    // | dx | = | cos(pan) -sin(pan) 0 | | cos(tilt) |
    // | dy | = | sin(pan) cos(pan) 0 | x | 0 |
    // | dz | = | 0 0 1 | | sin(tilt) |
    cam_dx = cos(pan) * cos(tilt);
    cam_dy = sin(pan) * cos(tilt);
    cam_dz = sin(tilt);
    // compute scene center position
    cam_cx = cam_x + cam_dx;
    cam_cy = cam_y + cam_dy;
    cam_cz = cam_z + cam_dz;
}