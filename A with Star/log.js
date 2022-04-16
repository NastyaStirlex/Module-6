var n;

function getN(){
    n = document.getElementById('inp_1').value; //считываем размер сетки
}
function removeFromArray(arr,elem){ //удаляем элемент из массива
    for (var i = arr.length-1;i>=0;i--){
        if (arr[i]==elem){
            arr.splice(i,1);
        }
    }
}

function heuristic(a, b){
    var d = Math.max(abs(a.i - b.i),abs(a.j - b.j)); //Расстояние Чебышева
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

    //создание сетки
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
//выбираем стенки
function chooseWalls() {
    let boxes = document.querySelectorAll('.elem');

    boxes.forEach(element=>{
        element.addEventListener('click',()=>{
            element.classList.toggle('wall')
        })
    })
    
}
//выбираем начало и конец
function chooseBeginandEnd(){
    let boxes = document.querySelectorAll('.elem');

    boxes.forEach(element=>{
        element.addEventListener('click',()=>{
            element.classList.toggle('begining')
        })
    })
}


function alg(){
    class Spot { //класс для каждой клетки
        constructor(i, j) {
            this.i = i; //координата х
            this.j = j; //координата у
            this.f = 0; //значение эвристической функции "расстояние + стоимость" для вершины
            this.g = 0; //стоимость пути от начальной вершины до x
            this.h = 0; //эвристическая оценка расстояния от вершины x до конечной вершины
            this.neighbors = []; //соседи
            this.previous = null; //предыдущая вершина
            this.wall = false; //стена или нет
            this.show = function () {
                setTimeout(() => {
                    massDivs[i][j].style.background= '#b300ff';
                }, 2000);
            }
            this.show1 = function () {
            setTimeout(() => {
                massDivs[i][j].style.background= '#2fa35991';
            }, 1000);
        };
        this.show2 = function () {
            setTimeout(() => {
                massDivs[i][j].style.background= '#c58839c7';
            }, 1000);
        };
            this.addNeighbors = function(grid){  //добавляем соседей
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
            if (massDivs[i][j].classList.contains('wall') && !massDivs[i][j].classList.contains('begining') && !massDivs[i][j].classList.contains('path')){
               grid[i][j].wall = true;  //смотрим стена или нет
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
            start = grid[i][j];  //пишем старт
            else if (start != 0 && massDivs[i][j].classList.contains('begining'))
            end = grid[i][j];  //сохраняем выход
        }       
    }
    openSet.push(start);  //добавляем начало
    while (openSet.length > 0){
        var winner = 0;  //индекс лучшей вершины
        for (var i = 0; i<openSet.length;i++){
            if (openSet[i].f < openSet[winner].f){ //сравниваем значение функции
                winner = i;
            }
        }
        var current = openSet[winner];  //текущая - лучшая 
        if (current == end){
            break;  //если дошли до конца
        }

        removeFromArray(openSet,current); //удаляем из массива
        closeSet.push(current);  //просмотрели вершину

        var neighbors = current.neighbors;  //просматриваем всех соседей
        for (var i = 0; i < neighbors.length; i++){
            var neighbor = neighbors[i];

            if (!closeSet.includes(neighbor) && !neighbor.wall){
                var tempG = current.g + 1;  //увеличиваем длину пройденного
                
                var newPath = false;  //новый ли путь
                if (openSet.includes(neighbor)){ //если мы ещё не посетили соседа
                    if (tempG < neighbor.g){
                        neighbor.g = tempG;  //если длина меньше, то перезаписываем
                    }
                }
                else {  //если еще не посетили соседа, то создаём новый путь
                    neighbor.g = tempG; 
                    newPath = true;
                    openSet.push(neighbor);
                }
                if (newPath){  //если новый путь
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }
        for (var i = 0; i<closeSet.length; i++){
            closeSet[i].show1();
        }
    
        
    
        for (var i = 0; i<openSet.length; i++){
            openSet[i].show2();
        }
    
    }  

    if (openSet.length = 0 || current != end) {
        iddiv.innerHTML="No solution";
        nosolution = true;
    }
    if (!nosolution){  //показываем путь
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
        iddiv.innerHTML="Done! See result later";
    }
}