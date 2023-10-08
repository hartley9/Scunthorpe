

var circles = [];

function setup() {
  createCanvas(400, 400, document.getElementById('sketchCanvas'));

  // Lets make sure we don't get stuck in infinite loop
  var protection = 0;

  // Try to get to 500
  while (circles.length < 10000) {
    // Pick a random circle
    var circle = {
      x: random(width),
      y: random(height),
      r: random(1, 5)
    };

    // Does it overlap any previous circles?
    var overlapping = false;
    for (var j = 0; j < circles.length; j++) {
      var other = circles[j];
      var d = dist(circle.x, circle.y, other.x, other.y);
      if (d < circle.r + other.r) {
        overlapping = true;
      }
    }

    // If not keep it!
    if (!overlapping) {
      circles.push(circle);
    }

    // Are we stuck?
    protection++;
    if (protection > 1000000) {
      break;
    }
  }
  
  // draw underlay blob
    for (var i = 0; i < circles.length; i++) {
      blobUnderlay(circles[i].x, circles[i].y, circles[i].r * random(1.2, 1.5));
    }
  

  // Draw all the circles
  for (var i = 0; i < circles.length; i++) {
    fill(255, 0, 10, 100);
    noStroke();
    ellipse(circles[i].x, circles[i].y, circles[i].r * 2, circles[i].r * 2);
  }
  
  
  // add smaller white circulles on top of each
  for (var c = 0; c < circles.length; c++){
    var currentCircle = circles[c];
   
    
    // slightly lighter inner
    fill(205, 100, 100);
    noStroke();
    var randomInnerRadius = random(0.4, 0.75)
    ellipse(circles[c].x, circles[c].y, circles[c].r / randomInnerRadius, circles[c].r /randomInnerRadius)
    
     // dark center
    fill(255, 100, 100);
    noStroke();
    ellipse(circles[c].x, circles[c].y, circles[c].r / 2.5, circles[c].r / 2.5)
  }
  
  
  //
  
}

function blobUnderlay(x, y, radius){
  push()
  translate(x, y);
  fill (208, 144, 144);
  noStroke();
  beginShape();
  let xoff = random(0, 0.2);
  let yoff = random(0, 0.3);
  for (var a = 0; a < TWO_PI + PI; a += 0.55) {
    let offset = map(noise(xoff, yoff), 0, 1, random(3.5, 7), random(3.5, 7));
    let r = radius + offset;
    let x = r * cos(a);
    let y = r * sin(a);
    curveVertex(x, y);
    xoff += 0.1;
    //ellipse(x, y, 4, 4);
  }
  endShape();
  pop()
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    save('myCanvas.png');
  } else if (keyCode === RIGHT_ARROW) {
 
  }
}

