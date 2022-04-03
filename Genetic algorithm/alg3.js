var mass = [];
var data = [];
var roads = [];
var elements = [];
var fit = 0;
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
class Dot{
    constructor(x, y) {
      this.x = x;
      this.y = y;
  }
}
class Lines{
    constructor(start, end, len) {
      this.start = start;
      this.end = end;
      this.dist = len;
  }
}
class Generation{
  constructor(array, dist) {
    this.generation = array;
    this.dist = dist;
}
}
function createLine(a,b){
    var length = Math.sqrt(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2));
    var lines = new Lines(a,b,length);
    roads.push(lines);
}
function createDivLine(lines){
    var a = lines.start;
    var b = lines.end
    var angle= Math.atan2(b.y-a.y,b.x-a.x) * 180 / Math.PI;
    var block = document.getElementById('page1');
    var newLine = document.createElement('div');
    newLine.id = 'line';
    newLine.className = 'line';
    newLine.style.left=a.x - 5+'px';
    newLine.style.top=a.y - 117+'px';
    newLine.style.width=lines.dist+'px';
    newLine.style.transform='rotate(' + Math.round(angle) + 'deg)';
    newLine.style.transformOrigin ="0 0"; 
    block.appendChild(newLine); 
}
function deleteDivLine(lines){
  var block = document.getElementById("page1");
var child = document.getElementById("line");
if (child != undefined){
block.removeChild(child);
}
}
function distance(array){
  let meaning = 0;
  for (var i = 0; i<array.length-1; i++){
    for (var j = 0; j<roads.length; j++){
      if((array[i]==roads[j].start && array[i+1]==roads[j].end)||(array[i]==roads[j].end && array[i+1]==roads[j].start)){
        meaning+= roads[j].dist;
      }
    }
    
  }
  return meaning;
}
function generatePopulation(){
  let array = [];
  let randomIndex = Math.floor(Math.random() * data.length);
  for (var j = randomIndex; j<data.length;j++){
    array.push (data[j]);
    }
    for (var i = 0; i<randomIndex;i++){
    array.push (data[i]);
    }
  return array; 
}
function crossing(elem1, elem2){
  let randomIndex = Math.floor(Math.random() * elem1.generation.length);
  let array = [];
  for (var j = randomIndex; j<elem1.length;j++){
    array.push (elem1[j]);
    }
    for (var i = 0; i<randomIndex;i++){
        if (!array.includes(elem2[i])){
          array.push (elem2[i]);
        }
    }
  if (array.length != elem1.length){
    for (var i = 0; i<elem1.length;i++){
      if (!array.includes(elem1[i])){
        array.push(elem1[i]);
      }

    }
  }
  let dist = distance(array);
  if (dist<=fit){
    return array;
  }
  else{
    return undefined;
  }
}
function algorithm(){
    for (var i = 0; i<mass.length;i++){
        data[i] = new Dot(parseInt(mass[i].style.left, 10), parseInt(mass[i].style.top,10));
      }
    for (var i = 0; i<mass.length;i++){
        for (var j = i+1; j<mass.length;j++){
        createLine(data[i],data[j]);
    }
    
}

for (var sets = 0; sets <10; sets++){
  if (elements.length>0){
  for (var i = 0; i<elements[0].generation.length-1;i++){
    for (var j = 0; j<roads.length; j++){
      if((elements[0].generation[i]==roads[j].start && elements[0].generation[i+1]==roads[j].end)||(elements[0].generation[i]==roads[j].end && elements[0].generation[i+1]==roads[j].start)){
        deleteDivLine(roads[j]);
      }
    }
  }
}
for (var i = 0; i<data.length*2;i++){
  let array = generatePopulation();
  let dist = distance(array);
  var generation = new Generation(array,dist);
  elements.push(generation);
}

elements.sort((a,b) => {return a.dist > b.dist ? 1: a === b ? 0: -1});
for (var i = 0; i<data.length;i++){
  elements.pop();
}
fit = elements[elements.length-1];

for (var i = 0; i<elements.length;i++){
  for (var j = i+1; j<elements.length;j++){
    let array = crossing(elements[i],elements[j]);
    if (array){
      elements[elements.length-1]= array;
    }
  }
}
elements.sort((a,b) => {return a.dist > b.dist ? 1: a === b ? 0: -1});
for (var i = 0; i<elements[0].generation.length-1;i++){
  for (var j = 0; j<roads.length; j++){
    if((elements[0].generation[i]==roads[j].start && elements[0].generation[i+1]==roads[j].end)||(elements[0].generation[i]==roads[j].end && elements[0].generation[i+1]==roads[j].start)){
      createDivLine(roads[j]);
    }
  }
}
}
}
