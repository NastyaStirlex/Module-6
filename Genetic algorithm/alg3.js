var
mass = [],
data = [],
roads = [],
elements = [],
fit = 0;


function pointDots() {
    var block = document.getElementById('page1');
block.onclick = function(e) {
  var point = document.createElement('div');
  point.className = 'dot';
  point.style.left = e.pageX -5+ 'px';
  point.style.top = e.pageY -5+ 'px';
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
    var length = Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
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
    newLine.style.left=a.x - 6+'px';
    newLine.style.top=a.y -6+'px';
    newLine.style.width=lines.dist+'px';
    newLine.style.transform='rotate(' + Math.round(angle) + 'deg)';
    newLine.style.transformOrigin =0+"px"; 
    block.appendChild(newLine); 
}

function distance(array){
  let meaning = 0;
  for (var i = 0; i<array.length-1; i++){
    for (var j = 0; j<roads.length; j++){
      if(array[i]==roads[j].start && array[i+1]==roads[j].end){
        meaning+= roads[j].dist;
      }
    }
    for (var j = 0; j<roads.length; j++){
      if(array[0]==roads[j].start && array[array.length-1]==roads[j].end){
        meaning+= roads[j].dist;
        break;
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

function mutation(array, dist1){
  let dist2;
  let copyArr = array.slice(0);
  let city1 = Math.floor(Math.random() * array.length);
  let city2 = city1;
  while(city2 == city1)
    city2 = Math.floor(Math.random() * array.length);

  if (city1 > city2) 
    [city1, city2] = [city2, city1];

  for (let i = city1, j = city2; j-i > 0; i++, j--) [array[i], array[j]] = [array[j], array[i]];
  
  dist2 = distance(array);

  if (dist1 < dist2) return copyArr;
  else return array;
}

function crossing(gen1, gen2){
  let randomIndex = Math.floor(Math.random() * gen1.length);
  let array = [];
  for (var i = 0; i<randomIndex;i++){
    array.push(gen1[i]);
}
  for (var j = randomIndex; j<gen2.length;j++){
    if (!array.includes(gen2[j])){
      array.push (gen2[j]);
    }
    }
    
  if (array.length != gen1.length){
   for (var i = 0; i<gen1.length;i++){
     if (!array.includes(gen1[i])){
      array.push(gen1[i]);
    }

  }
 }
 dist = distance(array);
 let changeArr = [];
 for (let i = 0; i < gen1.length; i++){
   changeArr = mutation(array, dist);
 }
 let newGen;
 if (array != changeArr){
   dist = distance(changeArr);
   newGen = new Generation(changeArr,dist);
 }
 else{
    newGen = new Generation(array,dist);
 }
  if (dist<=fit){
    return newGen;
  }
  else{
    return undefined;
  }
}


function algorithm(){
    for (var i = 0; i<mass.length;i++){
        data[i] = new Dot(parseInt(mass[i].style.left, 10), parseInt(mass[i].style.top,10));
      }
    for (var i = 0; i<data.length;i++){
        for (var j = i+1; j<data.length;j++){
        createLine(data[i],data[j]);
        createLine(data[j],data[i]);
    }
}
roads.sort((a,b) => {return a.dist >= b.dist ? 1: a === b ? 0: -1});

for (var i = 0; i<50;i++){
  let array = generatePopulation();
  let dist = distance(array);
  var generation = new Generation(array,dist);
  elements.push(generation);
}

for (var sets = 0; sets < 400; sets++){
   fit = elements[0].dist;
   for (var i = 0; i<elements.length - 1;i++){
    for (var j = i+1; j<elements.length -1; j++){
      let newArray = crossing(elements[i].generation,elements[j].generation);
      if (newArray){
                elements.pop();
                elements.push(newArray);
      }
    }
  }
  elements.sort((a,b) => {return a.dist >= b.dist ? 1: a === b ? 0: -1});
  
}

for (var i = 0; i<elements[0].generation.length;i++){
  for (var j = 0; j<roads.length; j++){
    if(elements[0].generation[i]==roads[j].start && elements[0].generation[i+1]==roads[j].end){
      createDivLine(roads[j]);
      break;
    }
  }
}
  for (var i = 0; i<elements[0].generation.length-1; i++){
    for (var j = 0; j<roads.length; j++){
      if(elements[0].generation[0]==roads[j].start && elements[0].generation[elements[0].generation.length-1]==roads[j].end){
        createDivLine(roads[j]);
        break;
      }
    }
  }
  iddiv.innerHTML=elements[0].dist;
}

