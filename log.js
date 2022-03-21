var n;

function getN(){
    n = document.getElementById('inp_1').value;
}

var cols;
var rows;
var grid;

var openSet = [];
 var closeSet = [];
 var start;
 var end;
 var w, h;
 var path = [];
 var nosolution = false;  

function setup(){
    cols = n;
    rows = n;
    grid = new Array(cols);

for (var i = 0; i < n; i++) {
    var row = createRow();
    for (var k = 0; k < n; k++) {
      createElement(row);
    };
  };
  
  function createRow() {
    var parent = document.getElementById('parent');
    var row = document.createElement('div');
    row.className = "row";
    parent.appendChild(row);
    return row;
  }
  
  function createElement(parent) {
    var elem = document.createElement('div');
    elem.className = "elem";
    parent.appendChild(elem);

  }
  class Spot {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];
        this.previous = null;
        this.wall = false;
        

        this.show = function (col) {
            fill(col);
            noStroke();
            rect(this.i * w, this.j * h, w - 1, h - 1);
        };
        this.addNeighbors = function(grid){
            var i = this.i;
            var j = this.j;
            if (i < cols-1){
                this.neighbors.push(grid[i+1][j]);
            }
            if(i > 0){
                this.neighbors.push(grid[i-1][j]);
            }
            if (j < rows - 1){
                this.neighbors.push(grid[i][j+1]);
            }
            if (j > 0){
                this.neighbors.push(grid[i][j-1]);
            }
            if (i>0 && j>0){
                this.neighbors.push(grid[i-1][j-1]);
            }
            if (i>0  && j<rows - 1){
                this.neighbors.push(grid[i-1][j+1]);
            }
            if (i<cols -1  && j<rows - 1){
                this.neighbors.push(grid[i+1][j+1]);
            }
        }
    }
}

    createCanvas(n*27,n*27);
    w = width/cols;
    h = height/rows;

    for (var i = 0; i<cols;i++){
        grid[i] = new Array (rows);
    }

    for (var i = 0; i < cols;i++){
        for (var j = 0; j < rows;j++){
            grid[i][j] = new Spot(i, j);
        }       
    }
    for (var i = 0; i < cols;i++){
        for (var j = 0; j < rows;j++){
            grid[i][j].addNeighbors(grid);
        }       
    }
    
    
console.log(grid);
}

function chooseWalls(){
   
}

function chooseBeginandEnd(){

}
function draw(){
    background(0);
    for (var i = 0; i<cols;i++){
        for (var j = 0; j<rows;j++){
            grid[i][j].show(color(255));
        }       
    }
}