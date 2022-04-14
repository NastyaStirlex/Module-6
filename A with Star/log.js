var n;

function getN(){
    n = document.getElementById('inp_1').value;
}
function removeFromArray(arr,elem){
    for (var i = arr.length-1;i>=0;i--){
        if (arr[i]==elem){
            arr.splice(i,1);
        }
    }
}

function heuristic(a,b){
    var d = Math.max(abs(a.i - b.i),abs(a.j - b.j));
    return d;
}

var cols;
var rows;
var grid = new Array(cols);
var massDivs = new Array(cols);

var openSet = [];
 var closeSet = [];
 var start = 0;
 var end = 0;
 var path = [];
 var nosolution = false;  

function setup(){
    cols = n;
    rows = n;

for (var i = 0; i < n; i++) {
    grid[i]= new Array (rows);
    massDivs[i]= new Array (rows);
    var row = createRow();
    for (var k = 0; k < n; k++) {
      createElement(row, i, k);
    };
  };
  
  function createRow() {
    var parent = document.getElementById('parent');
    var row = document.createElement('div');
    row.className = "row";
    parent.appendChild(row);
    return row;
  }
  
  function createElement(parent, i, j) {
    var elem = document.createElement('div');
    elem.className = "elem";
    parent.appendChild(elem);
    massDivs[i][j] = elem;
    if (random(1)<0.3){
        massDivs[i][j].classList.toggle('wall');
    }
  }
  
}

function chooseWalls() {
    let boxes = document.querySelectorAll('.elem');

    boxes.forEach(element=>{
      element.addEventListener('click',()=>{
          element.classList.toggle('wall')
      })
    })
    
}

function chooseBeginandEnd(){
    let boxes = document.querySelectorAll('.elem');

    boxes.forEach(element=>{
      element.addEventListener('click',()=>{
          element.classList.toggle('begining')
      })
    })
}

function alg(){
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
            this.show = function () {
                massDivs[i][j].style.background= '#b300ff';
            };
            this.show1 = function () {
                massDivs[i][j].classList.toggle('openS')
            };
            this.show2 = function () {
                massDivs[i][j].classList.toggle('closeS')
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
                if (i<cols -1  && j>0){
                    this.neighbors.push(grid[i+1][j-1]);
                }
            }
        }
    }
    for (var i = 0; i < cols;i++){
        for (var j = 0; j < rows;j++){
           grid[i][j] = new Spot(i,j);
           if (massDivs[i][j].classList.contains('wall') && !massDivs[i][j].classList.contains('begining')&& !massDivs[i][j].classList.contains('path')){
               grid[i][j].wall = true;
            }
    }
    }
    for (var i = 0; i < cols;i++){
        for (var j = 0; j < rows;j++){
            grid[i][j].addNeighbors(grid);
        }       
    }
    for (var i = 0; i < cols;i++){
        for (var j = 0; j < rows;j++){
            if (start == 0 && massDivs[i][j].classList.contains('begining'))
            start = grid[i][j];
            else if (start != 0 && massDivs[i][j].classList.contains('begining'))
            end = grid[i][j];
        }       
    }
    openSet.push(start);
    while (openSet.length > 0){
        var winner = 0;
        for (var i = 0; i<openSet.length;i++){
            if (openSet[i].f < openSet[winner].f){
                winner = i;
            }
        }
        var current = openSet[winner];
        if (current == end){
            break;
        }

        removeFromArray(openSet,current);
        closeSet.push(current);

        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++){
            var neighbor = neighbors[i];

            if (!closeSet.includes(neighbor) && !neighbor.wall){
                var tempG = current.g + 1;
                
                var newPath = false;
                if (openSet.includes(neighbor)){
                    if (tempG < neighbor.g){
                        neighbor.g = tempG;
                    }
                }
                else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }
                if (newPath){
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }
        
    }  
   
        for (var i = 0; i<closeSet.length; i++){
            closeSet[i].show1();
        }
    
        
    
        for (var i = 0; i<openSet.length; i++){
                openSet[i].show2();
        }
    
    if (openSet.length = 0 || current != end) {
        iddiv.innerHTML="No solution";
        nosolution = true;
    }
    if (!nosolution){
            path = [];
                    var temp = current;
                    path.push(temp);
                    while (temp.previous){
                        path.push(temp.previous);
                        temp = temp.previous;
                    }
            
            for (var i = 0; i < path.length; i++){ 
               path[i].show();
            }
            iddiv.innerHTML="Done!";
    }
}