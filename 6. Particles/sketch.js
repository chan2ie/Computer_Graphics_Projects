const num_vertices = 32;
const MAX_STAGE = 7;
var Blobs = [];
var added = [];

class _Blob {
    constructor(ox, oy, size, dir) {
        this.born = frameCount;
        this.state = 0;
        this.state_stage = 0;
        this.ox = ox;
        this.oy = oy;
        this.new_ox = ox;
        this.new_oy = oy;
        this.size = size;
        this.size_change = size;
        this.life_span = floor(random(48, 120));

        this.speed = random(1, 3);

        this.vertex = create_circular_vertex(this.size);
        this.rad_rand_weight = create_rand_weight();
        this.dir = radians(dir);

        this.pop = false;
    }

    arrange_rand_weight() {
        var temp = []
        this.rad_rand_weight.forEach(weight => {
            weight += 0.01 * random([-1, 0, 1]);
            weight = weight < 0.95 ? 0.95 : weight;
            weight = weight > 1.05 ? 1.05 : weight;
            temp.push(weight);
        })
        this.rad_rand_weight = temp;
    }

    tick() {
        if (this.ox != this.new_ox || this.oy != this.new_oy){
          this.ox = this.new_ox;
          this.oy = this.new_oy;
        }
        if (this.size_change != this.size) {
            this.size = this.size_change;
            this.vertex = create_circular_vertex(this.size);
        }
        this.arrange_rand_weight();
        this.move();

        if (frameCount - this.born >= this.life_span && this.size > 250 && this.state == 0) {
            this.state = 1;
            this.state_stage = 0;
            this.org_vert = this.vertex.slice();
            this.dest_vert = create_divided_circle_vertex(this.size, degrees(this.dir));
        }

        if (this.state == 1 && this.state_stage < MAX_STAGE) {
            this.state_stage++;

            for (var i = 0; i < num_vertices; i++) {
                this.vertex[i] = get_dividing_point(this.org_vert[i], this.dest_vert[i],
                    this.state_stage, MAX_STAGE - this.state_stage);
            }
        }

        if (this.state_stage == MAX_STAGE) {
            this.pop = true;
        }
    }

    move() {
        if (this.oy + Math.sqrt(this.size) > windowHeight) {
            this.dir = radians(360) - this.dir;
            this.oy = windowHeight - Math.sqrt(this.size);
        } else if (this.oy < Math.sqrt(this.size)) {
            this.dir = radians(360) - this.dir;
            this.oy = Math.sqrt(this.size);
        } else if (this.ox < Math.sqrt(this.size)) {
            this.dir = radians(540) - this.dir;
            this.ox = Math.sqrt(this.size);

        } else if (this.ox + Math.sqrt(this.size) > windowWidth) {
            this.dir = radians(540) - this.dir;
            this.ox = windowWidth - Math.sqrt(this.size);
        }

        this.ox += this.speed * cos(this.dir);
        this.oy += this.speed * sin(this.dir);
      
        this.new_ox = this.ox;
        this.new_oy = this.oy;
    }

    get_new_Blob() {
        if (this.state == 1) {
            var temp = [];
            var radius = Math.sqrt(this.size / 2);
            var dir = degrees(this.dir);

            temp.push(new _Blob(this.ox + cos(radians(dir - 90)) * radius,
                this.oy + sin(radians(dir - 90)) * radius,
                this.size / 2, dir - 90 + floor(random(60))));
            temp.push(new _Blob(this.ox + cos(radians(dir + 90)) * radius,
                this.oy + sin(radians(dir + 90)) * radius,
                this.size / 2, dir + 90 - floor(random(60))));

            return temp;
        }
    }

    draw() {
        push();

        translate(this.ox, this.oy);
        rotate(this.dir - radians(90));

        noStroke();
        fill(255);

        beginShape();

        curveVertex(this.vertex[num_vertices - 1][0] * this.rad_rand_weight[num_vertices - 1],
            this.vertex[num_vertices - 1][1] * this.rad_rand_weight[num_vertices - 1]);

        for (var i = 0; i < num_vertices; i++) {
            curveVertex(this.vertex[i][0] * this.rad_rand_weight[i],
                this.vertex[i][1] * this.rad_rand_weight[i]);
        }
        curveVertex(this.vertex[0][0] * this.rad_rand_weight[0],
            this.vertex[0][1] * this.rad_rand_weight[0]);

        curveVertex(this.vertex[1][0] * this.rad_rand_weight[1],
            this.vertex[1][1] * this.rad_rand_weight[1]);

        endShape();

        pop();
    }
}

function setup() {
    frameRate(24);

    createCanvas(windowWidth, windowHeight);
    //background(0);
    Blobs = [new _Blob(windowWidth / 2, windowHeight / 2, floor(windowWidth * windowHeight/40), floor(random(360)))];
}

function draw() {
    background(0, 0, 0, 30);
    noStroke();
    var temp = [];
    var added_temp = [];
  
    noFill();
    strokeWeight(1);
    for (var i = 0; i < added.length; i++) {
        added[i][2]++;
        if (added[i][2] % 2) {
            stroke(255, 255, 255, 255 - added[i][2] * 30)
            ellipse(added[i][0], added[i][1], floor(added[i][2] / 2) * 35);
        }
        if (added[i][2] < 10) {
            added_temp.push(added[i]);
        }
    }

    for (var i = 0; i < Blobs.length; i++) {

        Blobs[i].tick();
        Blobs[i].draw();

        if (!Blobs[i].pop) {

            if (Blobs[i].state == 0) {
                for (var j = i + 1; j < Blobs.length; j++) {
                    if (collide(Blobs[i], Blobs[j]) && !Blobs[j].pop && Blobs[j].state == 0) {
                        let new_o = get_dividing_point([Blobs[i].new_ox, Blobs[i].new_oy],
                                                      [Blobs[j].new_ox, Blobs[j].new_oy],
                                                      Blobs[j].size_change,
                                                      Blobs[i].size_change);
                        Blobs[i].new_ox = new_o[0];
                        Blobs[i].new_oy = new_o[1];
                        Blobs[i].size_change += Blobs[j].size;
                        Blobs[j].size = 0;
                        if (frameCount - Blobs[i].born > 30 && Blobs[i].size < 3000) {
                            Blobs[i].born += 5;
                        }
                        Blobs[i].dir = (Blobs[i].dir * Blobs[i].size + Blobs[j].dir * Blobs[j].dir) / (Blobs[i].size_change);
                        Blobs[j].pop = true;
                        added_temp.push([Blobs[j].ox, Blobs[j].oy, 0]);
                    }
                }
            }
            if (!Blobs[i].pop) {
                temp.push(Blobs[i]);
            }
        } else {
            if (Blobs[i].state == 1) {
                Blobs[i].get_new_Blob().forEach(b => temp.push(b));
            }
        }
    }

    Blobs = temp;
    added = added_temp;

}

function create_circular_vertex(size) {
    var radius = Math.sqrt(size);
    var step = (360 / num_vertices) / 360 * Math.PI * 2;

    var vertices = []

    for (let i = 0; i < num_vertices; i++) {
        vertices.push([cos(step * i) * radius, sin(step * i) * radius]);
    }

    return vertices;
}

function create_rand_weight() {
    var rand = []

    for (let i = 0; i < num_vertices; i++) {
        rand.push(random(0.95, 1.05));
    }

    return rand;
}

function create_divided_circle_vertex(size, dir) {
    var radius = Math.sqrt(size / 2);

    var step = radians(360 / num_vertices) * 2;

    var vertices = []

    dir = 90

    for (let i = 0; i < num_vertices / 4; i++) {
        vertices.push([cos(radians(dir - 90)) * radius + cos(step * i) * radius,
            sin(radians(dir - 90)) * radius + sin(step * i) * radius
        ]);
    }

    for (let i = 0; i < num_vertices / 4; i++) {
        vertices.push([cos(radians(dir + 90)) * radius + cos(step * i) * radius,
            sin(radians(dir + 90)) * radius + sin(step * i) * radius
        ]);
    }

    for (let i = num_vertices / 4; i < num_vertices / 2; i++) {
        vertices.push([cos(radians(dir + 90)) * radius + cos(step * i) * radius,
            sin(radians(dir + 90)) * radius + sin(step * i) * radius
        ]);
    }

    for (let i = num_vertices / 4; i < num_vertices / 2; i++) {
        vertices.push([cos(radians(dir - 90)) * radius + cos(step * i) * radius,
            sin(radians(dir - 90)) * radius + sin(step * i) * radius
        ]);
    }
    var new_dir = dir - 90;
    new_dir = new_dir < 0 ? new_dir + 360 : new_dir;
    var idx = floor(new_dir / (360 / num_vertices));

    var result = vertices.slice(num_vertices - idx).concat(vertices.slice(0));

    return result;
}

function get_dividing_point(org, dest, m, n) {
    var vert = [];

    vert.push((m * dest[0] + n * org[0]) / (m + n));
    vert.push((m * dest[1] + n * org[1]) / (m + n));

    return vert;
}

function collide(a, b) {
    var dist = sqrt(pow(a.ox - b.ox, 2) + pow(a.oy - b.oy, 2));
    return dist < sqrt(a.size) + sqrt(b.size) - 3;
}