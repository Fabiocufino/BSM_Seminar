let cols, rows;
let scl = 10; // Scale for the grid
let w = 400;
let h = 400;
let potential = [];
let radiusSlider, angleSlider;
let radiusValue, angleValue;

function setup() {
  createCanvas(w, h, WEBGL);
  cols = w / scl;
  rows = h / scl;

  // Calculate potential values
  for (let x = 0; x < cols; x++) {
    potential[x] = [];
    for (let y = 0; y < rows; y++) {
      let xx = map(x, 0, cols, -3, 3);
      let yy = map(y, 0, rows, -3, 3);
      potential[x][y] = higgsPotential(xx, yy);
    }
  }

  // Create sliders
  radiusSlider = createSlider(0, 5, 2.5, 0.1);
  radiusSlider.position(10, h + 10);
  angleSlider = createSlider(0, 360, 180);
  angleSlider.position(10, h + 40);
  radiusValue = createP('');
  radiusValue.position(150, h + 5);
  angleValue = createP('');
  angleValue.position(150, h + 35);
}

function draw() {
  background(255);
  orbitControl();

  // Draw the potential field in 3D
  translate(-w / 2, -h / 2, -200); // Move the origin to the center
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let val = potential[x][y];
      let col = getColor(val);
      fill(col);
      noStroke();
      push();
      translate(x * scl, y * scl, -val * 10); // Adjust Z-axis scaling
      box(scl, scl, scl);
      pop();
    }
  }

  // Get slider values
  let radius = radiusSlider.value();
  let angle = angleSlider.value() * (PI / 180);

  // Update and draw the moving ball
  let pointX = radius * cos(angle) * 80; // Adjust scaling factor for visualization
  let pointY = radius * sin(angle) * 80;

  radiusValue.html('Radius: ' + radius);
  angleValue.html('Angle: ' + angleSlider.value());

  fill(0);
  push();
  translate(width / 2 + pointX, height / 2 + pointY, -higgsPotential(pointX / 80, pointY / 80) * 10);
  sphere(10);
  pop();
}

function higgsPotential(x, y) {
  let lambda = 1;
  let v = 2.5;
  let phi = sqrt(x * x + y * y);
  return lambda * (phi * phi - v * v) * (phi * phi - v * v);
}

function getColor(value) {
  let normValue = map(value, 0, 100, 0, 1); // Adjust the range as needed
  let r = 150 + 105 * normValue; // Adjust the red component
  let g = 0;
  let b = 255 - 200 * normValue; // Adjust the blue component
  return color(r, g, b);
}
