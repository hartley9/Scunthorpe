var cells = new field2D(512);

var temperature = .5; 

// initialize random spins, either 1 or -1
cells.set(function() {
  if (random(2) == 0) { 
    return -1;
  } else { 
    return 1;
  }
});

// some normalization factors to soften the grid
var rsqrt2 = 0.70710678118655;
var moorenorm = 1/(4*(1+rsqrt2));
function entropy(C, x, y) {
  // entropy is high if neighbors are unequal:
  var sum = (C != cells.get(x, y+1)) +
      (C != cells.get(x, y-1)) +
      (C != cells.get(x+1, y)) +
      (C != cells.get(x-1, y)) //+
      // (C != cells.get(x+1, y+1))*rsqrt2 +
      // (C != cells.get(x-1, y-1))*rsqrt2 +
      // (C != cells.get(x+1, y-1))*rsqrt2 +
      // (C != cells.get(x-1, y+1))*rsqrt2;
  return moorenorm * sum;
     return sum / 4;
}

function update() {
  // pick many samples on each update:
  var samples = cells.width * cells.height;
  for (var i=0; i<samples; i++) {
    // pick a site at random:
    var x = random(cells.width);
    var y = random(cells.height);
    // run the rule:
    var C = cells.get(x, y);
    // compute current entropy in neighbourhood:
    var h0 = entropy(C, x, y);
    // compute entropy if the cell was flipped:
    var h1 = entropy(-C, x, y);
    
    // transition more probable if entropy increases:
    var prob = temperature * h0/h1; //= Math.exp(-(h1-h0)/temperature);
    if (random() < prob) {
      // accept change (else reject)
      cells.set(-C, x, y);
    }
    
  }
}

function draw() {
  cells.draw();
} 