const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* ARRAYS */

let particles = [];
let targets = [];
let starsFar = [];
let starsMid = [];
let starsNear = [];
let sparkles = [];
let fireworks = [];
let heartExplosion = [];
let floatingHearts = [];
let meteors = [];
let meteorSparks = [];

/* ESTADOS */

let heartComplete = false;
let explosionDone = false;

/* TIEMPO */

let heartOpenAmount = 0;
let heartOpening = false;
let explosionTimer = 0;
let time = 0;
let targetIndex = 0;
let messagesStarted = false;

/* CONFIG */

const HEART_POINTS = 300;
const HEART_SCALE = window.innerWidth < 768 ? 11 : 15;

/* ECUACION DEL CORAZON */

function heart(t){

return{

x:16*Math.pow(Math.sin(t),3),

y:13*Math.cos(t)
-5*Math.cos(2*t)
-2*Math.cos(3*t)
-Math.cos(4*t)

}

}

/* CREAR OBJETIVOS */

function createTargets(){

for(let i=0;i<HEART_POINTS;i++){

let t=Math.random()*Math.PI*2;

let pos=heart(t);

let offsetY = window.innerWidth < 768 ? 40 : 0;

targets.push({

x: canvas.width/2 + pos.x * HEART_SCALE,
y: canvas.height/2 + offsetY - pos.y * HEART_SCALE

});

}

}

createTargets();

/* ESTRELLAS */

function createStars(){

for(let i=0;i<40;i++){
starsFar.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2,
speed:0.05
});
}

for(let i=0;i<30;i++){
starsMid.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:1+Math.random()*2,
speed:0.12
});
}

for(let i=0;i<20;i++){
starsNear.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:1.5+Math.random()*1.2,
speed:0.25
});
}

}

createStars();

/* EMISION DE CORAZONES */

function emitParticles(){

let batch = 3;

for(let i=0;i<batch;i++){

if(targetIndex>=targets.length){

heartComplete=true;
return;

}

let target=targets[targetIndex];

let fromLeft=Math.random()>0.5;

let startXLeft = canvas.width * 0.18;

let startXRight = canvas.width * 0.82;

/* altura diferente para dispositivos móveis */

let startY = window.innerWidth < 768 
? canvas.height - 70 
: canvas.height - 110;

particles.push({
  
x: fromLeft ? startXLeft : startXRight,
y: startY,

targetX:target.x,
targetY:target.y,

size:10,
speed:0.045,
curve:Math.random()*100

});

targetIndex++;

}

}

/* EXPLOSION */

function explodeHeart(){

let maxExplosion = 300;

for(let i=0;i<maxExplosion;i++){

let p = particles[Math.floor(Math.random()*particles.length)];

heartExplosion.push({

x:p.x,
y:p.y,

vx:(Math.random()-0.5)*5,
vy:(Math.random()-0.5)*5,

size:8,
life:120

})

}

}

/* FUEGOS ARTIFICIALES */

canvas.addEventListener("click",function(e){

const colors=[
"#ffb3ff",
"#d896ff",
"#c77dff",
"#e0aaff",
"#bdb2ff"
];

for(let i=0;i<40;i++){

fireworks.push({

x:e.clientX,
y:e.clientY,

vx:(Math.random()-0.5)*5,
vy:(Math.random()-0.5)*5,

life:50,
size:3,
color:colors[Math.floor(Math.random()*colors.length)]

})

}

});

/* DIBUJAR ESTRELLAS */

function drawStarsLayer(layer){

layer.forEach(s=>{

ctx.fillStyle="white";

ctx.beginPath();
ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
ctx.fill();

s.y += s.speed;

if(s.y > canvas.height){
s.y = 0;
s.x = Math.random()*canvas.width;
}

});

}

/* NEBULOSA */

function drawNebula(){

let gradient = ctx.createRadialGradient(
canvas.width/2,
canvas.height/2,
50,
canvas.width/2,
canvas.height/2,
400
);

gradient.addColorStop(0,"rgba(255,120,180,0.15)");
gradient.addColorStop(0.4,"rgba(255,80,160,0.08)");
gradient.addColorStop(1,"rgba(0,0,0,0)");

ctx.fillStyle = gradient;

ctx.beginPath();
ctx.arc(canvas.width/2,canvas.height/2,400,0,Math.PI*2);
ctx.fill();

}

/* SPARKLES */

function emitSparkles(){

if(Math.random()<0.03){

sparkles.push({
x:canvas.width/2 + (Math.random()-0.5)*300,
y:canvas.height/2 + (Math.random()-0.5)*200,
life:40,
size:1+Math.random()*2
});

}

}
/*METEORITOS*/
function emitMeteors(){

if(Math.random() < 0.02){

const colors = [
"rgba(255,255,255,0.9)",   // blanco
"rgba(247, 153, 187, 0.9)",   // rosado claro
"rgba(238, 100, 148, 0.9)"    // rosado
];

meteors.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height*0.4,

vx:6 + Math.random()*2,
vy:2 + Math.random(),

life:150,
size:2 + Math.random(),

color:colors[Math.floor(Math.random()*colors.length)]

});

}

}
function drawSparkles(){

sparkles.forEach((s,i)=>{

ctx.fillStyle="white";

ctx.beginPath();
ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
ctx.fill();

s.life--;

if(s.life<=0){
sparkles.splice(i,1);
}

});

}
function drawMeteors(){

meteors.forEach((m,i)=>{

/* cola luminosa */

let gradient = ctx.createLinearGradient(
m.x,
m.y,
m.x - m.vx*15,
m.y - m.vy*15
);

gradient.addColorStop(0, m.color);
gradient.addColorStop(1,"rgba(255,255,255,0)");

ctx.strokeStyle = gradient;
ctx.lineWidth = m.size;

ctx.beginPath();
ctx.moveTo(m.x,m.y);
ctx.lineTo(m.x - m.vx*15, m.y - m.vy*15);
ctx.stroke();

/* mover meteorito */

m.x += m.vx;
m.y += m.vy;

m.life--;
// distancia al corazón
let dx = m.x - canvas.width/2;
let dy = m.y - canvas.height/2;

let distance = Math.sqrt(dx*dx + dy*dy);

if(distance < 250 && Math.random() < 0.3){

meteorSparks.push({

x: m.x,
y: m.y,

vx: (canvas.width/2 - m.x) * 0.01,
vy: (canvas.height/2 - m.y) * 0.01,

life: 40,
size: 2 + Math.random()*2

});

}
if(m.life <= 0){
meteors.splice(i,1);
}

});

}
function drawMeteorSparks(){

meteorSparks.forEach((s,i)=>{

ctx.fillStyle = "rgba(255,150,200,0.8)";

ctx.beginPath();
ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
ctx.fill();

s.x += s.vx;
s.y += s.vy;

s.life--;

if(s.life <= 0){
meteorSparks.splice(i,1);
}

});

}
/* DIBUJAR CORAZON */

function drawHeart(x,y,size){

ctx.font=size+"px Arial";

ctx.fillStyle="#ff4d6d";

ctx.shadowColor="#ff8fab";
ctx.shadowBlur=8;

ctx.fillText("❤",x,y);

ctx.shadowBlur=0;

}

/* EXPLOSION */

function drawExplosion(){

heartExplosion.forEach((p,i)=>{

drawHeart(p.x,p.y,p.size);

p.x+=p.vx;
p.y+=p.vy;

p.vy+=0.02;

p.life--;

if(p.life<=0){
heartExplosion.splice(i,1);
}

});

}

/* CORAZONES FLOTANTES */

function emitFloatingHearts(){

if(Math.random()<0.05){

floatingHearts.push({

x:canvas.width/2+(Math.random()-0.5)*120,
y:canvas.height/2,

vy:-1-Math.random(),
size:3,
life:10

});

}

}

function drawFloatingHearts(){

floatingHearts.forEach((h,i)=>{

drawHeart(h.x,h.y,h.size);

h.y+=h.vy;
h.life--;

if(h.life<=0){
floatingHearts.splice(i,1);
}

});

}

/* FUEGOS ARTIFICIALES */

function drawFireworks(){

fireworks.forEach((f,i)=>{

ctx.fillStyle=f.color;

ctx.beginPath();
ctx.arc(f.x,f.y,f.size,0,Math.PI*2);
ctx.fill();

f.x+=f.vx;
f.y+=f.vy;

f.vy+=0.04;

f.life--;

if(f.life<=0){
fireworks.splice(i,1);
}

});

}

/* ANIMACION */

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

/* fondo */

drawStarsLayer(starsFar);
drawStarsLayer(starsMid);
drawStarsLayer(starsNear);

drawNebula();

emitSparkles();
drawSparkles();

emitMeteors();
drawMeteors();

drawMeteorSparks();
/* abrir corazon */

if(heartOpening){

heartOpenAmount += 0.02;

if(heartOpenAmount > 0.5){
heartOpening = false;
}

}

/* formar corazon */

if(!heartComplete){
emitParticles();
}

/* latido */

let pulse = 1 + Math.sin(time)*0.18;

particles.forEach(p=>{

let dx = p.targetX - p.x;
let dy = p.targetY - p.y;

let centerX = canvas.width/2;
let centerY = canvas.height/2;

let dirX = p.targetX - centerX;
let dirY = p.targetY - centerY;

let dist = Math.sqrt(dirX*dirX + dirY*dirY);

if(dist>0){

dirX /= dist;
dirY /= dist;

p.x += dirX * heartOpenAmount;
p.y += dirY * heartOpenAmount;

}

p.x += dx*p.speed + Math.sin(time+p.curve)*0.5;
p.y += dy*p.speed + Math.cos(time+p.curve)*0.4;

drawHeart(p.x,p.y,p.size*pulse);

});

/* explosion */

if(heartComplete && !explosionDone){

explosionTimer++;

if(explosionTimer>120){

explodeHeart();
explosionDone=true;

setTimeout(()=>{
document.querySelector(".center-photo").classList.add("show-photo");
},600);

heartOpening = true;

}

if(!messagesStarted){

messagesStarted=true;
setTimeout(startMessages,1500);

}

}

drawExplosion();

/* corazones flotantes */

if(heartComplete){
emitFloatingHearts();
}

drawFloatingHearts();
drawFireworks();

time += 0.05;

requestAnimationFrame(animate);

}

animate();

/* TYPEWRITER */

function typeWriter(elementId,text,speed){

let i=0;
let el=document.getElementById(elementId);

el.style.opacity=1;
el.innerHTML="";

function typing(){

if(i<text.length){

el.innerHTML+=text.charAt(i);
i++;
setTimeout(typing,speed);

}

}

typing();

}

/* MENSAJES */

function startMessages(){

typeWriter(
"text-left",
"Te deseo un bonito día mi vida, a pesar de no estar juntos en este momento siempre trataré de darte un presente, para mí eres la mejor mujer que pude haber conocido y doy las gracias porque llegaste a mi vida 💝.",
40
);

typeWriter(
"text-right",
"Prometo seguir cuidando este amor siempre, pase lo que pase yo estaré aquí para ti, eres la mujer que amo y amaré por mucho tiempo, que las cosas mejoren y nosotros junto con ello, te amo demasiado mi bubulina ❤️.",
40
);


}
const music = document.getElementById("music");

function startMusic(){
music.play().catch(()=>{});
document.removeEventListener("click", startMusic);
}

document.addEventListener("click", startMusic);





