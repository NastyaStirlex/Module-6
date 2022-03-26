var mass = [];
var data = [];
var k;

function pointDots() {
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
function distance(a,b){
    return Math.sqrt(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2));
}

function moveCenter() {
  let finished = false;
  for (var i = 0; i<groups.length; i++){
      finished = true;
      let x = 0, y = 0;
      for (var i = 0; i<groups.length; i++){
          x += gruops[i].x;
          y += gruops[i].y;
      }
    }

      let oldPos = {x: group.center.x,
         y: group.center.y};
      
      group.center = {
          x: x / group.dots.length,
          y: y / group.dots.length
      };
      let newPos = {x: group.center.x, y: group.center.y};

      if (oldPos.x !== newPos.x || oldPos.y !== newPos.y) finished = false;
      console.log(groups);

  if (finished){
      console.log('Algorithm is finished');
      console.log(groups);
  } 
}


function algorithm(){
  let groups = [];
  let entriesNumber = 0;
  let flag = false;

  class Dot{
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.color = [];
  }
}
class Cluster{
  constructor() {
    this.x = Math.random() * 400;
    this.y = Math.random() * 400;
    this.cluster = [];
}
}
    k = document.getElementById('inp_2').value;
    for (var i = 0; i<mass.length;i++){
      data[i] = new Dot(parseInt(mass[i].style.left, 10), parseInt(mass[i].style.top,10));
    }

    for (let i = 0; i < k; i++) {
      var g = new Cluster;
      groups.push(g);
     
    }
    console.log(groups);
    while (flag) {
      moveCenter();
    } 
    if (!flag) {
      //updateGroups();
    }
//    if (data[0].cluster == 0){
  //    mass[0].style.background="black"; //смена цвета от номера кластера
 // var block = document.getElementById('page1');
 // var point = document.createElement('div');
 // point.className = 'cluster';
 // point.style.left = g.x + 'px';
 // point.style.top = g.y -4 + 'px';
 // block.appendChild(point); //рисунок кластера
    //}
}