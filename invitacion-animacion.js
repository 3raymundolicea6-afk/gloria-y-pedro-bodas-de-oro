const audio=document.querySelector('#musica');
const toggle=document.querySelector('#sonido');
function refresh(){toggle.textContent=audio.paused?'♫ Reanudar':'♫ Silenciar';toggle.setAttribute('aria-label',toggle.textContent.slice(2)+' música')}
async function play(){try{await audio.play()}catch{}refresh()}
document.querySelector('#abrir').onclick=()=>{toggle.hidden=false;audio.volume=.55;play();document.querySelector('#comienzo').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})};
toggle.onclick=()=>{if(audio.paused)play();else audio.pause();refresh()};
audio.onplay=audio.onpause=refresh;
const confirmation = document.querySelector('#confirm');
const people = document.querySelector('#personas');
const whatsapp = document.querySelector('#abrir-confirmacion');
const draft = document.querySelector('#mensaje-confirmacion');

function prepareConfirmation() {
  if (!people.reportValidity()) return false;
  const count = people.valueAsNumber;
  const attendance = count === 1 ? 'Confirmo mi asistencia. Asistirá 1 persona.'
    : 'Confirmamos nuestra asistencia. Somos ' + count + ' personas.';
  const message = '¡Hola, Gloria y Pedro! ' + attendance +
    ' Nos vemos en sus bodas de oro el 16 de enero. ¡Gracias por invitarnos!';
  whatsapp.href = 'https://wa.me/525526556014?text=' + encodeURIComponent(message);
  draft.value = message;
  draft.hidden = false;
  return true;
}
whatsapp.addEventListener('click', event => {
  if (!prepareConfirmation()) event.preventDefault();
});
confirmation.addEventListener('submit', event => {
  event.preventDefault();
  whatsapp.click();
});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.16});document.querySelectorAll('section').forEach(s=>observer.observe(s))}

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const celebration = document.querySelector('.event');
if ('IntersectionObserver' in window) {
  const celebrationObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) celebration.classList.add('en-escena');
    else celebration.classList.remove('en-escena');
  });
  celebrationObserver.observe(celebration.querySelector('small'));
}
const captions = [...document.querySelectorAll('.album article > *, .letter small, .letter blockquote span, .letter i, .rsvp h2, footer div > *')];
const letter = document.querySelector('.letter');
let frame = 0;
function moveCamera() {
  frame = 0;
  if (motionPreference.matches) return;
  const height = document.documentElement.clientHeight;
  const tops = captions.map(caption => caption.getBoundingClientRect().top -
    (parseFloat(caption.style.getPropertyValue('--lift')) || 0));
  for (const [index, caption] of captions.entries()) {
    caption.classList.add('motion-text');
    const top = tops[index];
    const progress = Math.max(0, Math.min(1, (height * .98 - top) / (height * .30)));
    const eased = 1 - Math.pow(1 - progress, 3);
    caption.style.setProperty('--lift', (1 - eased) * 32 + 'px');
    caption.style.setProperty('--ink', .12 + .88 * eased);
  }
  const bounds = letter.getBoundingClientRect();
  const travel = Math.max(0, Math.min(1, (height - bounds.top) / (height + bounds.height)));
  letter.style.setProperty('--drift', (travel - .5) * 6 + '%');
}
function requestCamera() {
  if (!frame) frame = requestAnimationFrame(moveCamera);
}
addEventListener('scroll', requestCamera, {passive:true});
addEventListener('resize', requestCamera);
motionPreference.addEventListener?.('change', requestCamera);
moveCamera();

const albumWater = document.querySelector('.waterfall video');
function updateWater() {
  const bounds = albumWater.parentElement.getBoundingClientRect();
  const visible = bounds.bottom > 0 && bounds.top < innerHeight;
  if (visible && !document.hidden && !motionPreference.matches) {
    if (albumWater.paused) albumWater.play().catch(() => {});
  } else {
    albumWater.pause();
  }
}
new IntersectionObserver(updateWater).observe(albumWater.parentElement);
motionPreference.addEventListener?.('change', updateWater);
document.addEventListener('visibilitychange', updateWater);

const veil = document.getElementById('vuelo');
const brush = veil.getContext('2d');
const butterfly = new Image();
butterfly.src = 'https://gloria-y-pedro-bodas-de-oro.antiqueart4.chatgpt.site/monarca.webp';
function drawButterfly(x, y, angle, width, beat, turn) {
  if (!butterfly.naturalWidth) return;
  const half = butterfly.naturalWidth / 2;
  const height = width * butterfly.naturalHeight / butterfly.naturalWidth;
  brush.save();
  brush.translate(x, y);
  brush.rotate(angle);
  for (const side of [-1, 1]) {
    const fold = .18 + .82 * Math.abs(Math.cos(beat + side * .12));
    const span = width * .5 * fold * (1 + side * turn * .22);
    brush.drawImage(butterfly, side < 0 ? 0 : half, 0, half, butterfly.naturalHeight,
      side < 0 ? -span : 0, -height / 2, span, height);
  }
  brush.restore();
}
let veilWidth, veilHeight, flightFrame, lastFlight=0;
function sizeVeil(){
  const ratio=Math.min(devicePixelRatio || 1,2);
  veilWidth=veil.clientWidth;veilHeight=veil.clientHeight;
  veil.width=Math.round(veilWidth*ratio);veil.height=Math.round(veilHeight*ratio);
  brush.setTransform(ratio,0,0,ratio,0,0);
}
function paintFlight(time){
  flightFrame=requestAnimationFrame(paintFlight);
  if(time-lastFlight<32)return;
  lastFlight=time;
  const t=time/1000, travel=scrollY, h=veilHeight, w=veilWidth;
  brush.clearRect(0,0,w,h);
  for(let i=0;i<4;i++){
    const phase = i * 2.61 + t * (.56 + i * .08) + travel * .0011;
    const bank = Math.sin(phase);
    const margin = (.14 + .078 * bank + .024 * Math.sin(phase * 2.7)) * w;
    const x = i % 2 ? w - margin : margin;
    const y = h + 50 - ((travel * .18 + t * (13 + i * 2) + i * (h + 100) / 4) % (h + 100))
      + 9 * Math.sin(phase * 2.1);
    const angle = (i % 2 ? -1 : 1) * .66 * Math.cos(phase);
    const width = (33 + (i % 3) * 7) * Math.min(1.2, w / 360);
    drawButterfly(x, y, angle, width, t * (6.3 + i * .7) + bank * 1.6, bank);
  }
  for(let i=0;i<22;i++){
    const edge=.025+.21*((i*.618)%1);
    const x=(i%2?1-edge:edge)*w+5*Math.sin(t*.3+i);
    const y=h+8-((i*137.9+travel*(.1+.03*(i%4))+t*3)%(h+16));
    const light=Math.pow((1+Math.sin(t*1.35+i*2.3))/2,3);
    brush.save();brush.translate(x,y);brush.scale(.4+light,.4+light);
    brush.fillStyle='rgba(255,227,151,'+(.09+.76*light)+')';
    brush.shadowColor='#fbc772';brush.shadowBlur=5;
    brush.beginPath();brush.moveTo(0,-3.6);brush.quadraticCurveTo(.4,-.5,2.5,0);brush.quadraticCurveTo(.5,.4,0,3.6);brush.quadraticCurveTo(-.4,.5,-2.5,0);brush.quadraticCurveTo(-.5,-.4,0,-3.6);brush.fill();brush.restore();
  }
}
function startFlight(){
  cancelAnimationFrame(flightFrame);
  if(!document.hidden && !motionPreference.matches && brush){sizeVeil();flightFrame=requestAnimationFrame(paintFlight)}
}
document.addEventListener('visibilitychange',startFlight);
addEventListener('resize',startFlight);
motionPreference.addEventListener?.('change',startFlight);
startFlight();

const photoDialog = document.querySelector('#foto-ampliada');
const enlargedPhoto = photoDialog.querySelector('img');
for (const trigger of document.querySelectorAll('.abrir-foto')) {
  trigger.addEventListener('click', () => {
    const photo = trigger.querySelector('img');
    enlargedPhoto.src = photo.currentSrc || photo.src;
    enlargedPhoto.alt = photo.alt;
    photoDialog.showModal();
  });
}
photoDialog.querySelector('button').onclick = () => photoDialog.close();
photoDialog.addEventListener('click', event => {
  if (event.target === photoDialog) photoDialog.close();
});

;(function(){var meta=new Date('2027-01-16T15:30:00-06:00');function p(n){return String(n).padStart(2,'0')}function t(){var d=meta-new Date();if(d<0)d=0;var a=Math.floor(d/864e5),h=Math.floor(d%864e5/36e5),m=Math.floor(d%36e5/6e4),s=Math.floor(d%6e4/1e3),e;e=document.getElementById('cd-dias');if(e)e.textContent=a;e=document.getElementById('cd-horas');if(e)e.textContent=p(h);e=document.getElementById('cd-min');if(e)e.textContent=p(m);e=document.getElementById('cd-seg');if(e)e.textContent=p(s)}t();setInterval(t,1e3)})();
