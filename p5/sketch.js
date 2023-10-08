const heightAndWidth = 128;
let xcount, ycount;

const occupiedCells = [];

//console.log('my data: asdf');
let counter = 0;
function processImageData(pixelData){
    loadPixels();
   // console.log('loadedPixels: ', pixels)
    //console.log('data: ', pixelData);

    xcount = 0; 
    ycount = 0;
    let pixelCount = 0;

     for (let i = 0; i < pixelData.length; i+=4){
        const pixel = {r: pixelData[i+0], g:pixelData[i+1], b:pixelData[i+2], s:pixelData[i+3]};

        // check if we are at the end of a row
        if (xcount === heightAndWidth){
          console.log('xcount at this point: ', xcount)
          xcount = 0;
        }
        
        if (((pixelCount+ 1)) % heightAndWidth === 0){
          ycount++;
        }


        // check if cell is black
        if (pixel.r === 0 && pixel.g === 0 && pixel.b === 0){
          pixels[i+0] = 251;
          pixels[i+1] = 168;
          pixels[i+2] = 153;
          pixels[i+3] = 255;  

          occupiedCells.push({x: xcount, y: ycount})

          
        }

        xcount++;
        pixelCount++;

    }   

    console.log('end xcount: ', xcount)
    console.log('end ycount: ', ycount)

    updatePixels();

    console.log('occupied cells ', occupiedCells)

}



var circles = [];

function setup() {
  createCanvas(heightAndWidth, heightAndWidth, document.getElementById('sketchcanvas'));

 // drawingContext.putImageData(Object.values(arr), 0, 0);

  processImageData(Object.values(arr))

 console.log(Object.values(arr))


  // Lets make sure we don't get stuck in infinite loop
  var protection = 0;

  
  // Try to get to 500
  while (circles.length < 10000) {
    // Pick a random circle
    var randomPos = round(random(occupiedCells.length));
    
    var circle = {
      x: occupiedCells[randomPos].x,
      y: occupiedCells[randomPos].y,
      r: random(0.5, 1.2)
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
    if (protection > 100000) {
      break;
    }
  }
  
/*   // draw underlay blob
    for (var i = 0; i < circles.length; i++) {
      blobUnderlay(circles[i].x, circles[i].y, circles[i].r * random(1.2, 1.5));
    } */
  

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

