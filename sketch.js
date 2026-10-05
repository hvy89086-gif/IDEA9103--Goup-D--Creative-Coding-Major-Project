function setup() {
  createCanvas(800, 500);
}

function draw() {
  background(240);

  updateUserInput();
  updateTimeBased();
  updateAudio();

  drawUserInput();
  drawTimeBased();
  drawAudio();
}
