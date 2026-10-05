// ========================================
// MOVE TOGETHER — a six-click p5.js story
// Click through a small story of loneliness,
// kindness, and accepting a candy.
// ========================================

// CONSTANTS: values shared by the sketch.
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const GROUND_Y = 380;
const INK = '#171717';
const PAPER = '#ffffff';
const GROUND = '#8bdc3f';
const MOVE_EASING = 0.075;
const ARRIVAL_DISTANCE = 2;

// VARIABLES: the story state changes as the user clicks.
let character1;
let character2;
let candy;
let groundDots = [];
let storyStep = 0;
let isAnimating = false;
let statusText;
let restartButton;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  textFont('Trebuchet MS');

  // OBJECTS: each character stores its position and pose.
  character1 = new Figure(-70, GROUND_Y, '#e7352d');
  character2 = new Figure(870, GROUND_Y, '#1598c5');
  candy = new Candy();

  // ARRAYS + LOOPS: repeated dots make a hand-printed ground.
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 34; column++) {
      groundDots.push({
        x: 12 + column * 24 + random(-5, 5),
        y: 420 + row * 24 + random(-5, 5),
        size: random(2, 5)
      });
    }
  }

  // UI ELEMENTS: a live story caption and replay button.
  statusText = createP('Click 1: help the first person walk into the picture.');
  statusText.style('font-size', '15px');
  statusText.style('font-family', 'Trebuchet MS, sans-serif');
  statusText.style('margin', '10px 0 4px');

  restartButton = createButton('Start again');
  restartButton.mousePressed(resetStory);
}

function draw() {
  background(PAPER);
  drawFrameAndGround();

  // Update animated characters every frame.
  character1.update();
  character2.update();
  candy.update();

  character1.draw();
  character2.draw();
  candy.draw();

  // The marker pulses gently with a basic trigonometric function.
  if (storyStep >= 3 && storyStep < 6) {
    drawMotionMarks(character2.x, character2.y - 125);
  }
}

function drawFrameAndGround() {
  // Green grass rises in a gentle wave, like the reference image.
  noStroke();
  fill(GROUND);
  beginShape();
  vertex(0, 390);
  bezierVertex(55, 380, 105, 365, 165, 375);
  bezierVertex(225, 385, 250, 400, 315, 385);
  bezierVertex(375, 370, 420, 370, 480, 385);
  bezierVertex(545, 400, 575, 395, 635, 380);
  bezierVertex(700, 365, 740, 365, 780, 375);
  bezierVertex(795, 380, 800, 390, 800, 398);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Thick black outline traces the wavy top of the grass.
  noFill();
  stroke(INK);
  strokeWeight(6);
  beginShape();
  vertex(0, 390);
  bezierVertex(55, 380, 105, 365, 165, 375);
  bezierVertex(225, 385, 250, 400, 315, 385);
  bezierVertex(375, 370, 420, 370, 480, 385);
  bezierVertex(545, 400, 575, 395, 635, 380);
  bezierVertex(700, 365, 740, 365, 780, 375);
  bezierVertex(795, 380, 800, 390, 800, 398);
  endShape();

  // Small black rectangular marks give the grass a printed texture.
  noStroke();
  fill(INK);
  for (const dot of groundDots) {
    rect(dot.x, dot.y, dot.size * 2.5, dot.size);
  }
  
  // Keep the black rectangular frame around the whole picture.
  noFill();
  stroke(INK);
  strokeWeight(5);
  rect(22, 22, width - 24, height - 24);
  // Keep the black rectangular frame around the whole picture.
  noFill();
  stroke(INK);
  strokeWeight(5);
  rect(22, 22, width - 24, height - 24);
}
function drawMotionMarks(x, y) {
  noFill();
  stroke(INK);
  strokeWeight(4);
  const wiggle = sin(frameCount * 0.12) * 3;
  for (let i = 0; i < 3; i++) {
    const offset = i * 10;
    arc(x - 45 - offset, y + wiggle, 20, 24, PI, TWO_PI);
    arc(x + 45 + offset, y - wiggle, 20, 24, PI, TWO_PI);
  }
}

// EVENTS: each click advances one story beat, in order.
function mousePressed() {
  if (isAnimating || storyStep >= 6) return;

  storyStep += 1;
  isAnimating = true;

  if (storyStep === 1) {
    statusText.html('Click 1: the first person walks to a place in the picture.');
    character1.walkTo(285);
  } else if (storyStep === 2) {
    statusText.html('Click 2: the first person sits down, feeling sad.');
    character1.sitDown();
    finishBeatAfter(420);
  } else if (storyStep === 3) {
    statusText.html('Click 3: another person enters the picture.');
    character2.walkTo(690);
  } else if (storyStep === 4) {
    statusText.html('Click 4: the second person walks closer.');
    character2.walkTo(405);
  } else if (storyStep === 5) {
    statusText.html('Click 5: the second person reaches out with a candy.');
    character2.offerCandy(candy);
  } else if (storyStep === 6) {
    statusText.html('Click 6: the first person stands up and takes the candy.');
    character1.standUpWithCandy(candy);
  }
}

function finishBeatAfter(milliseconds) {
  setTimeout(() => { isAnimating = false; }, milliseconds);
}

function resetStory() {
  storyStep = 0;
  isAnimating = false;
  character1.reset(-70);
  character2.reset(870);
  candy.hide();
  statusText.html('Click 1: help the first person walk into the picture.');
}

// OOP: reusable figure class; instances have their own state and behavior.
class Figure {
  constructor(x, groundY, color) {
    this.x = x;
    this.targetX = x;
    this.y = groundY;
    this.color = color;
    this.pose = 'standing';
    this.visible = true;
    this.hasCandy = false;
    this.facing = 1;
  }

  walkTo(targetX) {
    this.targetX = targetX;
    this.facing = targetX >= this.x ? 1 : -1;
  }

  sitDown() {
    this.pose = 'sitting';
    finishBeatAfter(420);
  }

  offerCandy(item) {
    item.x = this.x + this.facing * 58;
    item.y = this.y - 86;
    item.moveTo(this.x + this.facing * 58, this.y - 86);
    item.show();
    finishBeatAfter(650);
  }

  standUpWithCandy(item) {
    this.pose = 'standing';
    this.hasCandy = true;
    item.moveTo(this.x + 42, this.y - 105);
    finishBeatAfter(500);
  }

  update() {
    this.x = lerp(this.x, this.targetX, MOVE_EASING);
    if (abs(this.x - this.targetX) < ARRIVAL_DISTANCE) {
      this.x = this.targetX;
      // Unlock the next click after reaching the requested position.
      if (isAnimating && storyStep !== 2 && storyStep !== 5 && storyStep !== 6) {
        isAnimating = false;
      }
      if (storyStep === 6 && this.hasCandy) isAnimating = false;
    }
  }

  draw() {
    if (!this.visible) return;
    push();
    translate(this.x, this.y);
    scale(this.facing, 1);
    stroke(INK);
    strokeWeight(7);
    strokeCap(ROUND);
    strokeJoin(ROUND);

    if (this.pose === 'sitting') {
      this.drawSittingBody();
      this.drawSittingLegs();
    } else {
      this.drawStandingBody();
      this.drawStandingLegs();
    }

    this.drawArms();
    this.drawHead();
    pop();
  }

  drawStandingBody() {
    fill(this.color);
    beginShape();
    vertex(-23, -69);
    bezierVertex(-31, -53, -28, -20, -27, -4);
    vertex(27, -4);
    bezierVertex(28, -25, 31, -52, 23, -69);
    endShape(CLOSE);
  }

  drawStandingLegs() {
    line(-14, -7, -21, 27);
    line(14, -7, 23, 27);
    line(-21, 27, -34, 31);
    line(23, 27, 36, 31);
  }

  drawSittingBody() {
    fill(this.color);
    beginShape();
    vertex(-23, -69);
    bezierVertex(-31, -49, -28, -20, -26, -5);
    vertex(26, -5);
    bezierVertex(28, -25, 31, -51, 23, -69);
    endShape(CLOSE);
  }

  drawSittingLegs() {
    // Bent legs fold out into a seated pose.
    noFill();
    beginShape();
    vertex(-14, -6);
    vertex(-18, 15);
    vertex(-49, 17);
    vertex(-53, 28);
    endShape();
    beginShape();
    vertex(14, -6);
    vertex(21, 13);
    vertex(50, 14);
    vertex(56, 25);
    endShape();
  }

  drawArms() {
    noFill();
    if (this.pose === 'sitting') {
      // Arms rest close to the body while the character is sad.
      beginShape();
      vertex(-21, -60); bezierVertex(-43, -47, -34, -30, -22, -27);
      endShape();
      beginShape();
      vertex(21, -60); bezierVertex(37, -47, 34, -34, 24, -26);
      endShape();
    } else if (this.hasCandy) {
      // The receiving hand stays lifted to hold the candy.
      line(-21, -60, -36, -42);
      line(-36, -42, -22, -30);
      line(21, -60, 39, -80);
      line(39, -80, 48, -96);
    } else if (storyStep === 5 && this === character2) {
      // Reaching arm extends toward the seated person.
      line(-21, -60, -41, -48);
      line(-41, -48, -58, -57);
      line(21, -60, 42, -78);
      line(42, -78, 58, -86);
    } else {
      line(-21, -60, -39, -42);
      line(-39, -42, -48, -28);
      line(21, -60, 37, -43);
      line(37, -43, 45, -27);
    }
  }

  drawHead() {
    // Rounded head, small ears, and a short neck keep the body simple.
    stroke(INK);
    strokeWeight(5);
    fill('#fff0d9');
    ellipse(-23, -91, 10, 13);
    ellipse(23, -91, 10, 13);
    line(0, -69, 0, -63);
    ellipse(0, -91, 48, 48);
    // Minimal face: dots for eyes, curved mouth changes with the pose.
    noStroke();
    fill(INK);
    circle(-9, -94, 4);
    circle(9, -94, 4);
    noFill();
    stroke(INK);
    strokeWeight(2.5);
    if (this.pose === 'sitting' && !this.hasCandy) {
      arc(0, -82, 12, 8, PI, TWO_PI); // sad mouth
    } else {
      arc(0, -84, 12, 8, 0, PI); // small smile
    }
  }

  reset(startX) {
    this.x = startX;
    this.targetX = startX;
    this.pose = 'standing';
    this.visible = true;
    this.hasCandy = false;
  }
}

class Candy {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.visible = false;
  }

  show() { this.visible = true; }
  hide() { this.visible = false; this.x = 0; this.y = 0; this.targetX = 0; this.targetY = 0; }

  moveTo(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  update() {
    this.x = lerp(this.x, this.targetX, 0.12);
    this.y = lerp(this.y, this.targetY, 0.12);
  }

  draw() {
    if (!this.visible) return;
    push();
    translate(this.x, this.y + sin(frameCount * 0.08) * 2);
    rotate(sin(frameCount * 0.08) * 0.08);
    stroke(INK);
    strokeWeight(3);
    fill('#f5cc36');
    triangle(-7, 0, -18, -8, -18, 8);
    triangle(7, 0, 18, -8, 18, 8);
    ellipse(0, 0, 19, 15);
    pop();
  }
}
