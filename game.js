(() => {
'use strict';
const canvas=document.getElementById('scene'),ctx=canvas.getContext('2d');canvas.width=700;canvas.height=470;
const seasons=[
 {name:'Spring',icon:'🌷',crop:'turnip',cropName:'Turnip',emoji:'🌷',seedLabel:'Turnip seed',sell:22,price:12,sky:['#b8def0','#eef5d5'],hill:'#9bc78a',hill2:'#80b577',ground:'#93bd72',ground2:'#a8ca7c',flower:'#f4d56e',weather:'Sunny day',weatherIcon:'☀️'},
 {name:'Summer',icon:'☀️',crop:'tomato',cropName:'Tomato',emoji:'🍅',seedLabel:'Tomato seed',sell:34,price:18,sky:['#91d5e5','#f8edb2'],hill:'#77b878',hill2:'#4f9b68',ground:'#81b66b',ground2:'#a2c46d',flower:'#f8d967',weather:'Warm & bright',weatherIcon:'🌤️'},
 {name:'Autumn',icon:'🍂',crop:'pumpkin',cropName:'Pumpkin',emoji:'🎃',seedLabel:'Pumpkin seed',sell:50,price:24,sky:['#d9b6a0','#f4d8a2'],hill:'#ba8f69',hill2:'#9a7858',ground:'#bb9860',ground2:'#c9a76b',flower:'#e8784b',weather:'Crisp breeze',weatherIcon:'🍃'},
 {name:'Winter',icon:'❄️',crop:'radish',cropName:'Frost radish',emoji:'🥕',seedLabel:'Radish seed',sell:42,price:20,sky:['#a8c9da','#edf2e8'],hill:'#8aa9ad',hill2:'#709294',ground:'#a9c2b5',ground2:'#bdd0c2',flower:'#fff4dc',weather:'Light snowfall',weatherIcon:'❄️'}
];
let seasonIndex=0,day=1,year=1,gold=42,tool='plant',seeds=4,stamina=6,basket={},plots=Array.from({length:9},()=>({crop:null,stage:0,watered:false})),hover=-1,toastTimer;
const season=()=>seasons[seasonIndex];
try{const saved=JSON.parse(localStorage.getItem('littleFernSave'));if(saved){seasonIndex=Math.max(0,Math.min(3,saved.seasonIndex|0));day=Math.max(1,Math.min(7,saved.day|0));year=Math.max(1,saved.year|0);gold=Math.max(0,saved.gold|0);seeds=Math.max(0,saved.seeds|0);stamina=Math.max(0,Math.min(6,saved.stamina|0));basket=saved.basket||{};if(Array.isArray(saved.plots)&&saved.plots.length===9)plots=saved.plots;}}catch(e){}
const seasonSelect=document.getElementById('cropSelect');
function refresh(){const s=season();document.getElementById('seasonIcon').textContent=s.icon;document.getElementById('seasonName').textContent=s.name;document.getElementById('dayLabel').textContent=`Day ${day} · Year ${year}`;document.getElementById('weatherIcon').textContent=s.weatherIcon;document.getElementById('weatherLabel').textContent=s.weather;document.getElementById('gold').textContent=gold;document.getElementById('staminaText').textContent=`☀ ${stamina} / 6`;
 seasonSelect.innerHTML=`<option value="${s.crop}">${s.emoji} ${s.seedLabel} · ${s.price}g</option>`;document.getElementById('seedPrice').textContent=`${s.price}g`;document.getElementById('shopCopy').textContent=`A fresh pouch of ${s.cropName.toLowerCase()}s`;
 const basketEl=document.getElementById('basket'),basketTotal=Object.values(basket).reduce((a,b)=>a+b,0);basketEl.innerHTML=basketTotal?Object.entries(basket).map(([key,count])=>{let item=seasons.find(q=>q.crop===key);return `<span class="crop-chip">${item.emoji} ${item.cropName} <b>× ${count}</b></span>`}).join(''):'<span class="empty-basket">A little harvest goes here.</span>';document.getElementById('basketCount').textContent=`${basketTotal} item${basketTotal===1?'':'s'}`;document.getElementById('sellBtn').disabled=basketTotal===0;
 document.querySelector('.seed-row label').textContent=`SEED POUCH · ${seeds}`;let ready=plots.filter(p=>p.crop&&p.stage>=3).length;document.getElementById('goalText').textContent=ready?`${ready} crop${ready>1?'s':''} ready for a happy harvest!`:basketTotal?`Your basket has ${basketTotal} little treasure${basketTotal>1?'s':''}.`:'Your first little harvest is waiting.';
 document.getElementById('buyBtn').disabled=gold<s.price;document.getElementById('buyBtn').style.opacity=gold<s.price?'.55':'1';try{localStorage.setItem('littleFernSave',JSON.stringify({seasonIndex,day,year,gold,seeds,stamina,basket,plots}))}catch(e){}draw();}
function showToast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2100)}
function rounded(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function draw(){const W=700,H=470,s=season();ctx.clearRect(0,0,W,H);
 let sky=ctx.createLinearGradient(0,0,0,280);sky.addColorStop(0,s.sky[0]);sky.addColorStop(1,s.sky[1]);ctx.fillStyle=sky;ctx.fillRect(0,0,W,300);
 // distant hills
 ctx.fillStyle=s.hill;ctx.beginPath();ctx.moveTo(0,232);ctx.quadraticCurveTo(100,145,222,213);ctx.quadraticCurveTo(350,112,476,206);ctx.quadraticCurveTo(590,148,700,207);ctx.lineTo(700,300);ctx.lineTo(0,300);ctx.fill();
 ctx.fillStyle=s.hill2;ctx.beginPath();ctx.moveTo(0,260);ctx.quadraticCurveTo(140,184,275,250);ctx.quadraticCurveTo(413,175,547,248);ctx.quadraticCurveTo(640,203,700,241);ctx.lineTo(700,318);ctx.lineTo(0,318);ctx.fill();
 // cloud and sun
 ctx.fillStyle='#fff9e8b8';ctx.beginPath();ctx.arc(513,62,18,0,7);ctx.arc(536,55,24,0,7);ctx.arc(561,65,17,0,7);ctx.fill();ctx.fillRect(511,65,52,15);
 ctx.fillStyle=s.name==='Winter'?'#f6f7ed':'#ffe187';ctx.beginPath();ctx.arc(613,66,23,0,7);ctx.fill();
 // ground
 ctx.fillStyle=s.ground;ctx.fillRect(0,266,W,204);ctx.fillStyle=s.ground2;ctx.beginPath();ctx.moveTo(0,307);ctx.quadraticCurveTo(145,269,308,308);ctx.quadraticCurveTo(504,266,700,303);ctx.lineTo(700,470);ctx.lineTo(0,470);ctx.fill();
 // path to cottage
 ctx.fillStyle=s.name==='Winter'?'#d7dfd0':'#dfc99a';ctx.beginPath();ctx.moveTo(151,252);ctx.lineTo(224,252);ctx.lineTo(435,470);ctx.lineTo(314,470);ctx.fill();
 // cottage shadow, building, roof, door, windows
 ctx.fillStyle='#56744d40';ctx.beginPath();ctx.ellipse(145,286,99,15,0,0,7);ctx.fill();
 rounded(75,177,142,100,5,'#f4e3bf','#d3c59e');ctx.fillStyle='#ad6a56';ctx.beginPath();ctx.moveTo(60,186);ctx.lineTo(142,122);ctx.lineTo(232,185);ctx.lineTo(221,195);ctx.lineTo(142,143);ctx.lineTo(72,198);ctx.closePath();ctx.fill();
 rounded(124,211,38,66,4,'#8a604a');ctx.fillStyle='#e7c888';ctx.beginPath();ctx.arc(153,244,2,0,7);ctx.fill();
 rounded(88,204,25,24,3,'#b7d9d3','#fbf3d9');ctx.fillStyle='#fbf3d9';ctx.fillRect(99,204,3,24);ctx.fillRect(88,214,25,3);rounded(176,204,25,24,3,'#b7d9d3','#fbf3d9');ctx.fillStyle='#fbf3d9';ctx.fillRect(187,204,3,24);ctx.fillRect(176,214,25,3);
 // chimney
 ctx.fillStyle='#a75f50';ctx.fillRect(177,134,17,36);ctx.fillStyle='#914f46';ctx.fillRect(173,130,25,7);
 // tree
 ctx.fillStyle='#755a3e';ctx.fillRect(572,184,19,100);ctx.fillStyle='#557d4e';if(s.name==='Autumn')ctx.fillStyle='#d27a43';if(s.name==='Winter')ctx.fillStyle='#71918a';ctx.beginPath();ctx.arc(581,160,52,0,7);ctx.arc(548,179,34,0,7);ctx.arc(615,181,35,0,7);ctx.fill();ctx.fillStyle=s.name==='Autumn'?'#e4a654':'#8baa62';ctx.beginPath();ctx.arc(563,140,17,0,7);ctx.arc(598,148,19,0,7);ctx.fill();
 // garden fence
 ctx.strokeStyle='#e6d5aa';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(257,226);ctx.lineTo(640,226);ctx.moveTo(257,226);ctx.lineTo(257,254);ctx.moveTo(640,226);ctx.lineTo(640,254);ctx.stroke();ctx.fillStyle='#d3bd8f';for(let x=261;x<640;x+=41){ctx.fillRect(x,217,5,21);ctx.fillRect(x+5,220,4,18)}
 // beds
 for(let i=0;i<9;i++){let col=i%3,row=Math.floor(i/3),x=307+col*94,y=252+row*61;const p=plots[i];
 ctx.fillStyle='#657f4a35';ctx.beginPath();ctx.ellipse(x+36,y+37,40,11,0,0,7);ctx.fill();
 rounded(x,y,78,48,9,p.watered?'#76503d':'#916348',hover===i?'#fff5b4':'#70513c');
 // soil rows
 ctx.strokeStyle=p.watered?'#96705a':'#aa7b59';ctx.lineWidth=2;for(let r=1;r<4;r++){ctx.beginPath();ctx.moveTo(x+8,y+r*10);ctx.quadraticCurveTo(x+36,y+r*10-3,x+70,y+r*10);ctx.stroke()}
 if(p.crop){drawCrop(x+39,y+20,p.stage,p.watered,s)}else{ctx.fillStyle='#c9a079';ctx.beginPath();ctx.arc(x+38,y+25,2,0,7);ctx.fill();ctx.beginPath();ctx.arc(x+27,y+30,1.5,0,7);ctx.fill();}
 if(p.watered){ctx.fillStyle='#87ccdf';ctx.beginPath();ctx.arc(x+66,y+7,4,0,7);ctx.fill();}
 if(hover===i){ctx.strokeStyle='#fff2a1';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(x-2,y-2,82,52,10);ctx.stroke()}
 }
 // little flowers / grass
 for(let k=0;k<19;k++){const x=(k*83+21)%690,y=300+(k*53)%157;if(x>285&&x<593&&y<432)continue;ctx.fillStyle=k%3===0?s.flower:'#ecf0ba';ctx.fillRect(x,y,3,3);ctx.fillStyle='#628f55';ctx.fillRect(x+1,y+3,2,5)}
 if(s.name==='Winter'){ctx.fillStyle='#ffffffaa';for(let i=0;i<18;i++){let x=(i*127+32)%690,y=(i*71+18)%350;ctx.fillRect(x,y,3,3)}}
}
function drawCrop(cx,cy,stage,watered,s){let size=[5,9,13,16][stage]||16;ctx.strokeStyle='#4b7544';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx,cy+13);ctx.quadraticCurveTo(cx-2,cy+2,cx,cy-size);ctx.stroke();
 ctx.fillStyle=stage===0?'#84ae63':'#60964f';for(let j=0;j<Math.min(stage+1,4);j++){let yy=cy+5-j*5;ctx.beginPath();ctx.ellipse(cx+(j%2?7:-7),yy,7,3,j%2?-.6:.6,0,7);ctx.fill()}
 if(stage>=2){ctx.fillStyle=stage>=3?'#ece7c7':'#d6a64f';ctx.beginPath();if(s.crop==='turnip'){ctx.ellipse(cx,cy+8,7,8,0,0,7);ctx.fill();ctx.fillStyle='#e4d7ba';ctx.beginPath();ctx.moveTo(cx-3,cy+12);ctx.lineTo(cx,cy+20);ctx.lineTo(cx+3,cy+12);ctx.fill()}else if(s.crop==='tomato'){ctx.arc(cx+4,cy+2,6,0,7);ctx.fillStyle='#e87554';ctx.fill()}else if(s.crop==='pumpkin'){ctx.ellipse(cx+2,cy+6,10,7,0,0,7);ctx.fillStyle='#ed9841';ctx.fill()}else{ctx.ellipse(cx+5,cy+6,6,10,.4,0,7);ctx.fillStyle='#e6e9d7';ctx.fill()}}
 if(watered){ctx.fillStyle='#9cdbec';ctx.beginPath();ctx.arc(cx-12,cy+13,2.5,0,7);ctx.fill()}}
const tips={plant:'Choose <b>Plant</b>, then tap an empty garden bed.',water:'Choose <b>Water</b>, then give your growing crops a drink.',harvest:'Choose <b>Harvest</b> and gather crops with a golden glow.'};
function setTool(next){tool=next;document.querySelectorAll('.tool').forEach(b=>b.classList.toggle('active',b.dataset.tool===tool));document.getElementById('tip').innerHTML=`<span>💡</span><span>${tips[tool]}</span>`;canvas.style.cursor=tool==='plant'?'copy':tool==='water'?'crosshair':'grab'}
document.querySelectorAll('.tool').forEach(button=>button.addEventListener('click',()=>setTool(button.dataset.tool)));
function plotAt(x,y){for(let i=0;i<9;i++){let px=307+(i%3)*94,py=252+Math.floor(i/3)*61;if(x>=px-4&&x<=px+82&&y>=py-4&&y<=py+53)return i}return -1}
function act(index){if(index<0)return;const p=plots[index],s=season();if(tool==='plant'){
 if(p.crop){showToast('This bed already has a little something growing.');return}if(seeds<=0){showToast('Your seed pouch is empty — visit the seed stand!');return}if(stamina<=0){showToast('You’re all tuckered out. End the day to rest.');return}p.crop=s.crop;p.stage=0;p.watered=false;seeds--;stamina--;showToast(`${s.cropName} seed tucked into bed ${index+1}.`)
 }else if(tool==='water'){
 if(!p.crop){showToast('Plant a seed here first.');return}if(p.stage>=3){showToast('This one is ripe and ready to pick!');return}if(p.watered){showToast('This little sprout already had a drink today.');return}if(stamina<=0){showToast('You’re all tuckered out. End the day to rest.');return}p.watered=true;stamina--;showToast('A refreshing drink for your crop 💧')
 }else{
 if(!p.crop){showToast('Nothing growing in this bed just yet.');return}if(p.stage<3){showToast('Not quite ripe — give it a few more sunny days.');return}basket[p.crop]=(basket[p.crop]||0)+1;p.crop=null;p.stage=0;p.watered=false;showToast(`${s.emoji} A lovely ${s.cropName.toLowerCase()} harvest!`)
 }refresh()}
canvas.addEventListener('pointermove',event=>{let r=canvas.getBoundingClientRect(),i=plotAt((event.clientX-r.left)*700/r.width,(event.clientY-r.top)*470/r.height);if(i!==hover){hover=i;draw()}});
canvas.addEventListener('pointerleave',()=>{hover=-1;draw()});canvas.addEventListener('pointerdown',event=>{event.preventDefault();let r=canvas.getBoundingClientRect();act(plotAt((event.clientX-r.left)*700/r.width,(event.clientY-r.top)*470/r.height))});
document.getElementById('buyBtn').addEventListener('click',()=>{const s=season();if(gold<s.price){showToast(`You need ${s.price}g for a seed pouch.`);return}gold-=s.price;seeds+=3;showToast(`Three ${s.cropName.toLowerCase()} seeds added to your pouch!`);refresh()});
document.getElementById('sellBtn').addEventListener('click',()=>{let earned=0;for(const [crop,count] of Object.entries(basket)){const item=seasons.find(q=>q.crop===crop);earned+=item.sell*count}if(!earned)return;gold+=earned;basket={};showToast(`Your harvest sold for ${earned}g. Nice work!`);refresh()});
document.getElementById('sleepBtn').addEventListener('click',()=>{
 let grew=0;for(const p of plots){if(p.crop&&p.watered){p.stage=Math.min(3,p.stage+1);grew++}p.watered=false}day++;stamina=6;let message=grew?`You wake to ${grew} happy crop${grew===1?'':'s'} a little taller.`:'A peaceful rest. Crops grow when they get watered!';
 if(day>7){day=1;seasonIndex=(seasonIndex+1)%seasons.length;if(seasonIndex===0)year++;let old=seasonIndex===0?'Winter':seasons[seasonIndex-1].name;let lost=0;for(const p of plots){if(p.crop&&p.crop!==season().crop){p.crop=null;p.stage=0;lost++}}seeds=3;message=`${season().name} has arrived! Your pouch has 3 new seeds.${lost?` ${lost} out-of-season crop${lost===1?' has':'s have'} wilted.`:''}`}
 refresh();showToast(message)});
document.getElementById('soundBtn').addEventListener('click',e=>{e.currentTarget.classList.toggle('muted');showToast(e.currentTarget.classList.contains('muted')?'Quiet mode on.':'A little valley music, in spirit.');});
refresh();
})();
