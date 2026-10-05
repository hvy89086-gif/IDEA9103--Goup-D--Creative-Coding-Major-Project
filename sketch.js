// ========================================
// MOVE TOGETHER
// MAIN SKETCH
//
// Main controller for:
// Vy     → User Input
// Emery  → Time-based
// Zihen  → Audio
// ========================================

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


