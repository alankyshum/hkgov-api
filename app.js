const express = require("express");
const path = require('path');
var PDFImage = require("pdf-image").PDFImage;
var getPixels = require("get-pixels");

var pdfImage = new PDFImage("./test/test.pdf");
const app = express();

app.get('/get-positions', (req, res) => {
  getPixel()
    .then(pixels => {
      res.send(pixels);
    });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(3000, () => { console.log('Express server listening at port 3000') });

function getPixel() {
  // pdfImage.convertPage(0).then(function (imagePath) {
  return new Promise((resolve, reject) => {
    getPixels("./test/test-0.png", function(err, pixels) {
    //  getPixels(imagePath, function(err, pixels) {
      if(err) {
        console.log("Bad image path")
        return;
      }

      const leftOffset = 76;
      const topOffset = 106;
      const tableCellWidth = 16;
      const tableCellHeight = 18.47;

      const columnsCnt = 31;
      const rowsCnt = 30; // deends on month

      const parsedPixelArray = [];

      for(let y = 0; y < rowsCnt; y++) {
        for(let x = 0; x < columnsCnt; x++) {
          const pixelPos = {
            y: topOffset + y * tableCellHeight,
            x: leftOffset + x * tableCellWidth,
          };

          const pixelColour = {
            r: pixels.get(pixelPos.x, pixelPos.y, 0),
            g: pixels.get(pixelPos.x, pixelPos.y, 1),
            b: pixels.get(pixelPos.x, pixelPos.y, 2),
            a: pixels.get(pixelPos.x, pixelPos.y, 3),
          };

          parsedPixelArray.push({
            pixelPos, pixelColour
          });
        }
      }

      resolve(parsedPixelArray);
    });
  })
// });
}
