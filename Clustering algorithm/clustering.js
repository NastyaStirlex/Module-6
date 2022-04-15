var mass = [];
var data = [];
var clusters = [];
var k;

function pointDots() {  //ставим точку
    var block = document.getElementById('page1');
block.onclick = function(e) {
  var point = document.createElement('div');
  point.className = 'dot';
  point.style.left = e.pageX -4 + 'px';
  point.style.top = e.pageY -4 + 'px';
  document.body.appendChild(point);
  mass.push(point);
}
}
function getRandomColor() {  //рандом цвета
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function distance(a,b){
    return Math.sqrt(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2)); //евклидово расстояние
}

class Dot{  //структура точки
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = '#';
}
}
class Cluster{  //структура кластера
constructor(i, j) {
  this.x =i;
  this.y = j;
  this.groups = [];
  this.color = '#';
}
}
function groupsCreate(){
  //создзаем группы для каждого кластера
  for (var i = 0; i<data.length;i++){
    var dist = 100000;
    var choosenCluster = 0;
    for (var j = 0; j<k; j++){
      var newDist = Math.min(distance(clusters[j],data[i]),dist);  //смотрим до какого кластера ближе
      if (newDist < dist){
        choosenCluster = j;
        dist = newDist;
      }
    }
    clusters[choosenCluster].groups.push(data[i]);
  }
}
function moveCentre(){
  //сдвиг центров
  for (var i = 0; i<clusters.length;i++){
    var tempX = 0; var sumX = 0;
    var tempY = 0; var sumY = 0;
    for (var j = 0; j<clusters[i].groups.length;j++){
        sumX += clusters[i].groups[j].x;
        sumY += clusters[i].groups[j].y;
    }
    if (sumX>0){
      tempX = sumX/clusters[i].groups.length;  // находим среднее значение по Х
    }
    if (sumY>0){
    tempY = sumY/clusters[i].groups.length; // находим среднее значение по У
  }
    clusters[i].x = tempX;
    clusters[i].y = tempY;
    clusters[i].groups = [];
  }
}

function algorithm(){
    k = document.getElementById('inp_2').value;
    for (var i = 0; i<mass.length;i++){
      data[i] = new Dot(parseInt(mass[i].style.left, 10), parseInt(mass[i].style.top,10)); //записываем данные о точках
    }
    for (var i = 0; i<k;i++){
      let value = parseInt(Math.random()*data.length+1, 10); //рандомно выбираем начальное положение кластера
      clusters[i] = new Cluster(data[value-1].x, data[value-1].y);
    }
    for (var i = 0; i<250;i++){ //итерации алгоритма
      groupsCreate(); //генерация групп
      moveCentre(); //сдвиги
    }
    groupsCreate();

    for (var i = 0; i<k;i++){ //рисунок кластера
      clusters[i].color = getRandomColor(); 
      for (var j = 0; j<clusters[i].groups.length;j++){
        clusters[i].groups[j].color = clusters[i].color;
      }
      var block = document.getElementById('page1');
      var point = document.createElement('div');
      point.className = 'cluster';
      point.style.left = clusters[i].x  + 'px';
      point.style.top = clusters[i].y + 'px';
      block.appendChild(point); 
    }
    
    for (var i = 0; i<data.length;i++){
      mass[i].style.background = data[i].color; //смена цвета точки
    }
}