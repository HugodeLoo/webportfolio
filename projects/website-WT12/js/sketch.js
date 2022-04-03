let yearBubbles = [];
let placeBubbles = [];
let listPlaceBubbles = [];
let timeLineActive = true;
let raceOverlay = false;
let yearDisplayer = document.getElementById("selectedYear");

let dataSetF1;
let formula1Bold;

function preload() {
  dataSetF1 = loadJSON("JSON/f1data.json");
  formula1Bold = loadFont('fonts/Formula1-Bold.otf');
}

function setup() {
  let myCanvas = createCanvas(1455, 722);
  myCanvas.parent("canvasHolder");
  textFont(formula1Bold);
  for (var i = 0; i < 64; i++) {
    yearBubbles[i] = {
      x: 0,
      y: 317,
      r: 15,
      year: 0,
      display: function (j) {
        this.x = j * this.r * 1.5 + this.r * 1.25;
        if (j % 2 == 1) {
          this.y = 403;
        }
        fill(225, 6, 0);
        strokeWeight(10);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
        this.year = j + 1950;
        textSize(10);
        fill(0, 0, 0);
        strokeWeight(0);
        text(this.year, this.x - this.r, this.y + this.r / 2.8);
      },
      clicked: function () {
        let d = dist(mouseX, mouseY, this.x, this.y);
        if (d < this.r) {
          clear();
          timeLineActive = false;
          yearIsSelected(this.year);
        }
      }
    }
  }
}

function draw() {
  background(48, 48, 48, 0.0);
  if (timeLineActive == true) {
    drawTimeline();
  }
}

function drawTimeline() {
  background(48, 48, 48);
  strokeWeight(10);
  stroke(225, 6, 0)
  line(0, 360, 1455, 360);
  for (var i = 0; i < yearBubbles.length; i++) {
    yearBubbles[i].display(i);
  }
}

function mousePressed() {
  if (timeLineActive == true) {
    for (let i = 0; i < yearBubbles.length; i++) {
      yearBubbles[i].clicked();
    }
  }

  if (timeLineActive == false) {
    for (let i = 0; i < placeBubbles.length; i++) {
      placeBubbles[i].clicked();
    }

    if (raceOverlay == false) {
      for (let j = 0; j < listPlaceBubbles.length; j++) {
        listPlaceBubbles[j].clicked();
      }
    }
  }

  if (raceOverlay == false) {
    if (mouseX > 1150 && mouseX < 1725 && mouseY > 665 && mouseY < 997.5) {
      clear();
      timeLineActive = true;
    }
  }

  if (raceOverlay == true) {
    if (mouseX > 1185 && mouseX < 1400 && mouseY > 640 && mouseY < 670) {
      clear();
      raceOverlay = false;
      drawPlaces();
    }
  }
}

function yearIsSelected(year) {
  yearDisplayer.innerHTML = year;
  placeBubbles = [];
  listPlaceBubbles = [];
  ncrementer = 0;
  for (let i = 0; i < dataSetF1.result.length; i++) {

    if (dataSetF1.result[i].year === year) {

      placeBubbles[ncrementer] = {
        x: dataSetF1.result[i].circuit.lng,
        y: dataSetF1.result[i].circuit.lat,
        r: 5,
        raceId: dataSetF1.result[i].raceId,
        display: function () {
          let newRed = 255 - dataSetF1.result[i].round * 15;
          fill(newRed, 6, 0);
          ellipse(this.x, this.y, this.r * 2, this.r * 2);
          for (let j = 0; j < 897; j++) {
            if (dataSetF1.result[j].raceId == this.raceId) {
              textSize(12);
              fill(255, 255, 255);
              text(dataSetF1.result[j].circuit.circuitRef, this.x, this.y);
            }
          }
        },
        clicked: function () {
          var d = dist(mouseX, mouseY, this.x, this.y);
          if (d < this.r) {
            venueIsSelected(this.raceId);
          }
        }
      }
      listPlaceBubbles[ncrementer] = {
        x: 1315,
        y: 49 + 30 * ncrementer,
        wdth: 125,
        hght: 20,
        raceId: dataSetF1.result[i].raceId,
        display: function () {
          let newRed = 255 - dataSetF1.result[i].round * 15;
          fill(newRed, 6, 0);
          rect(this.x, this.y, this.wdth, this.hght, 10);
          for (let j = 0; j < 897; j++) {
            if (dataSetF1.result[j].raceId == this.raceId) {
              textSize(12);
              fill(255, 255, 255);
              text(dataSetF1.result[j].circuit.circuitRef, this.x + 8, this.y + 14);
            }
          }
        },
        clicked: function () {
          if (mouseX > this.x && mouseX < this.x + this.wdth && mouseY > this.y && mouseY < this.y + this.hght) {
            venueIsSelected(this.raceId);
          }
        }
      }
      ncrementer = ncrementer + 1;
    }

  }
  drawPlaces();

}

function drawPlaces() {

  for (var j = 0; j < placeBubbles.length; j++) {
    placeBubbles[j].display();
    listPlaceBubbles[j].display();
  }

  fill(225, 6, 0);
  rect(1150, 665, 260, 30, 12);
  textSize(20);
  fill(255, 255, 255);
  text('back to the timeline', 1165, 687);

}

function venueIsSelected(raceId) {
  raceOverlay = true;
  let driverColor = { r: 0, g: 0, b: 0 };

  for (let i = 0; i < 897; i++) {
    if (dataSetF1.result[i].raceId == raceId) {

      rect(15, 15, 1425, 692, 20);

      stroke(225, 6, 0);
      strokeWeight(10);
      noFill();
      strokeCap(SQUARE);

      beginShape();
      vertex(600, 30);
      vertex(1410, 30);
      quadraticVertex(1425, 30, 1425, 45);
      vertex(1425, 677);
      quadraticVertex(1425, 692, 1410, 692);
      vertex(45, 692);
      endShape();

      let inputDate = Date.parse(dataSetF1.result[i].date);
      let convertedDate = new Date(inputDate);
      let outputDate = convertedDate.toString();
      let trimmedDate = outputDate.slice(0, 15);

      noStroke();
      textSize(20);
      fill(driverColor.r, driverColor.g, driverColor.b);
      text(dataSetF1.result[i].name + ', ' + trimmedDate, 30, 40);

      for (let j = 0; j < dataSetF1.result[i].results.length; j++) {

        if (dataSetF1.result[i].results[j].driver.isDriverActive == true) {
          driverColor.b = 255;
        }
        else {
          driverColor.b = 0;
        }
        textSize(40);
        fill(driverColor.r, driverColor.g, driverColor.b);
        text(
          dataSetF1.result[i].results[j].position + '. ' +
          dataSetF1.result[i].results[j].driver.forename + ' ' +
          dataSetF1.result[i].results[j].driver.surname + ' racing for ' +
          dataSetF1.result[i].results[j].constructor.name, 30, 60 * j + 120
        );
      }

      fill(225, 6, 0);
      rect(1185, 640, 215, 30, 12);
      textSize(20);
      fill(255, 255, 255);
      text('back to the map', 1198, 662);

    }
  }
}
