/*
 * The below code is from http://rhuno.com/flashblog/2012/08/01/tutorial-puzzle-game-basics-with-html5-and-javascript/.
 * And we just use it for teaching purpose.
 */

window.onload = onReady;

var can;
var ctx;		
var img;
var blockSize = BLOCK_SIZE;
var selected1;
var selected2;
var piecesArray = new Array();

function onReady() {
	can = document.getElementById('puzzle');
	ctx = can.getContext('2d');

	img = new Image();
	img.onload = onImage1Load;
	img.src = IMAGE_SRC;

  can.addEventListener("click", function(evt) {
    onCanvasClick(evt);
  }, false);
}

function onImage1Load() {
	var r;
  var width = can.width / blockSize;
  var height = can.height / blockSize;

	for(var i = 0; i < width; i++)
	{
		for(var j = 0; j < height; j++)
		{
			r = new Rectangle(i * blockSize, j * blockSize, i*blockSize + blockSize, j * blockSize + blockSize);
			piecesArray.push(r);
		}				
	}

	scrambleArray(piecesArray, 30);
	drawImage();
}

function onCanvasClick(evt) {
  var height = can.height / blockSize;
  var clickX = evt.offsetX === undefined ? evt.layerX: evt.offsetX;
  var clickY = evt.offsetY === undefined ? evt.layerY: evt.offsetY;

	var drawX = Math.floor(clickX / blockSize);
	var drawY = Math.floor(clickY / blockSize);

	var index = drawX * height + drawY;

	var targetRect = piecesArray[index];
	var drawHighlight = true;

	drawX *= blockSize;
	drawY *= blockSize;

	ctx.clearRect(0, 0, can.width, can.height);

	if(selected1 != undefined && selected2 != undefined)
	{
		selected1 = selected2 = undefined;
	}

	if(selected1 == undefined)
	{
		selected1 = targetRect;
	}
	else
	{
		selected2 = targetRect;
		swapRects(selected1, selected2);
		drawHighlight = false;
	}

	drawImage();

	if(drawHighlight)	
		highlightRect(drawX, drawY);
}

function highlightRect(drawX, drawY) {
	ctx.beginPath();
	ctx.moveTo(drawX, drawY);
	ctx.lineTo(drawX + blockSize, drawY);
	ctx.lineTo(drawX + blockSize, drawY + blockSize);
	ctx.lineTo(drawX, drawY + blockSize);
	ctx.lineTo(drawX, drawY);
	ctx.lineWidth = 2;

  // set line color
  ctx.strokeStyle = "#ff0000";
  ctx.stroke();
}
		
function swapRects(r1, r2) {
  var index1;
  var index2;
  var temp = r1;

  index1 = piecesArray.indexOf(r1);
  index2 = piecesArray.indexOf(r2);

  piecesArray[index1] = r2;
  piecesArray[index2] = temp;			
}

function drawImage() {
  var width = can.width / blockSize;
  var height = can.height / blockSize;

  for(var k = 0; k < width; k++) {
    for(var l = 0; l < height; l++) {
      r = piecesArray[k*height+l];					
      ctx.drawImage(img, r.left, r.top, r.width, r.height, k*blockSize, l*blockSize, blockSize, blockSize);
    }
  }
}

function scrambleArray(ar, times) {
  var count = 0;
  var temp;
  var index1;
  var index2;
  while(count < times) {
   index1 = Math.floor(Math.random()*piecesArray.length);
   index2 = Math.floor(Math.random()*piecesArray.length);

   temp = piecesArray[index1];
   piecesArray[index1] = piecesArray[index2];
   piecesArray[index2] = temp;

   count++;
  }
}

function Rectangle(left, top, right, bottom) {
  this.left = left;
  this.top  = top;
  this.right = right;
  this.bottom = bottom;
  this.width = right - left;
  this.height = bottom - top;
}

function isCanvasSupported() {
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
