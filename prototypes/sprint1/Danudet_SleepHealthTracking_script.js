/* ----------------------------------
   Mock Data
---------------------------------- */

let history = [

{

date:"2026-07-08",
caffeine:"1 Cup",
stress:4,
exercise:"Moderate"

},

{

date:"2026-07-09",
caffeine:"3+ Cups",
stress:8,
exercise:"None"

}

];


/* ----------------------------------
   Show Mock Data
---------------------------------- */

const table=document.getElementById("historyTable");

function renderTable(){

table.innerHTML="";

history.forEach(item=>{

table.innerHTML+=`

<tr>

<td>${item.date}</td>

<td>${item.caffeine}</td>

<td>${item.stress}</td>

<td>${item.exercise}</td>

</tr>

`;

});

}

renderTable();


/* ----------------------------------
   Stress Slider
---------------------------------- */

const stress=document.getElementById("stress");
const stressValue=document.getElementById("stressValue");

stress.oninput=function(){

stressValue.textContent=this.value;

}


/* ----------------------------------
   Save Form
---------------------------------- */

document
.getElementById("trackingForm")
.addEventListener("submit",function(e){

e.preventDefault();

const caffeine=document.getElementById("caffeine").value;

const stress=document.getElementById("stress").value;

const exercise=document.getElementById("exercise").value;

history.unshift({

date:new Date().toLocaleDateString(),

caffeine,

stress,

exercise

});

renderTable();

generateAnalysis(caffeine,stress,exercise);

alert("Today's behavior has been saved!");

});


/* ----------------------------------
   Basic Recommendation
---------------------------------- */

function generateAnalysis(caffeine,stress,exercise){

let score=90;

if(caffeine==="3+ Cups")
score-=20;

if(stress>7)
score-=15;

if(exercise==="None")
score-=10;

document.getElementById("sleepScore")
.innerHTML="Sleep Score : "+score+"/100";

let message="";

if(score>=85){

message="Excellent daily habits. Keep your routine consistent.";

}

else if(score>=70){

message="Some habits may reduce sleep quality. Try lowering stress or caffeine.";

}

else{

message="High caffeine and stress may significantly impact sleep quality.";

}

document.getElementById("recommendation")
.innerHTML=message;

}


/* ----------------------------------
   Tab Switching
---------------------------------- */

const tabs=document.querySelectorAll(".tab");

tabs.forEach(tab=>{

tab.onclick=function(){

document.querySelectorAll(".tab")
.forEach(t=>t.classList.remove("active"));

document.querySelectorAll(".tab-content")
.forEach(c=>c.classList.remove("active"));

this.classList.add("active");

document
.getElementById(this.dataset.tab)
.classList.add("active");

}

});