// ========================================
// MOVE TOGETHER
// MAIN SKETCH
//
// Vy     → User Input
// Emery  → Time-based
// Zihen  → Audio
// ========================================

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const GROUND_Y = 380;

const INK = '#171717';
const PAPER = '#ffffff';
const GROUND = '#8bdc3f';

const MOVE_EASING = 0.075;
const ARRIVAL_DISTANCE = 2;

let groundDots = [];

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  textFont('Trebuchet MS');

  // Start each mechanic
  setupUserInput();
  setupTimeBased();
  setupAudio();

  // Create grass texture
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 34; column++) {
      groundDots.push({
        x: 12 + column * 24 + random(-5, 5),
        y: 420 + row * 24 + random(-5, 5),
        size: random(2, 5)
      });
    }
  }
}

function draw() {
  background(PAPER);

  drawFrameAndGround();

  // -------------------------
  // USER INPUT
  // -------------------------
  updateUserInput();
  drawUserInput();

  // -------------------------
  // TIME-BASED
  // -------------------------
  updateTimeBased();
  drawTimeBased();

  // -------------------------
  // AUDIO
  // -------------------------
  updateAudio();
  drawAudio();
}


// ========================================
// BACKGROUND
// ========================================

function drawFrameAndGround() {

  // Green grass
  noStroke();
  fill(GROUND);

  beginShape();

  vertex(0, 390);

  bezierVertex( 55, 380, 105, 365, 165, 375);

  bezierVertex( 225, 385, 250, 400, 315, 385);

  bezierVertex( 375, 370, 420, 370, 480, 385);

  bezierVertex( 545, 400, 575, 395, 635, 380);

  bezierVertex( 700, 365, 740, 365, 780, 375);

  bezierVertex( 795, 380, 800, 390, 800, 398);

  vertex(width, height);
  vertex(0, height);

  endShape(CLOSE);


  // Grass outline
  noFill();
  stroke(INK);
  strokeWeight(6);

  beginShape();

  vertex(0, 390);

  bezierVertex( 55, 380, 105, 365, 165, 375);

  bezierVertex( 225, 385, 250, 400, 315, 385);

  bezierVertex( 375, 370, 420, 370, 480, 385);

  bezierVertex( 545, 400, 575, 395, 635, 380);

  bezierVertex(700, 365,740, 365,780, 375);

  bezierVertex(795, 380, 800, 390, 800, 398);

  endShape();


  // Grass texture
  noStroke();
  fill(INK);

  for (const dot of groundDots) {
    rect(
      dot.x,
      dot.y,
      dot.size * 2.5,
      dot.size
    );
  }


  // Frame
  noFill();
  stroke(INK);
  strokeWeight(5);

  rect(
    22,
    22,
    width - 24,
    height - 24
  );
}


// ========================================
// MOUSE
// ========================================

function mousePressed() {
  handleUserInput();
}


// ========================================
// RESET
// ========================================

function resetStory() {

  resetUserInput();
  resetTimeBased();
  resetAudio();
}

