// Reference: a tiny luminous, almost abstract shape below a diffuse blue water surface.
(() => {
const canvas=document.querySelector('#pond'),ctx=canvas.getContext('2d');
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
let w,h,dpr,x,y,angle=-.6,time=0,last=0,escape=0,escapeAngle=0,speed=10,phase=0;
const ripples=[];
function size(){w=canvas.clientWidth;h=canvas.clientHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);x=w*(w<420?.53:w<760?.65:.72);y=h*(w<420?.59:w<760?.52:.43)}
addEventListener('resize',size);addEventListener('hashchange',()=>{if(!document.querySelector('#homeView').hidden)size()});size();
function silhouette(){
ctx.save();ctx.translate(x,y);ctx.rotate(angle);const scale=w<760?1.05:1.4;ctx.scale(scale,scale);
const sway=Math.sin(phase)*5;
// No eyes, scales, patches or sharp outlines: only the suggestion of a swimming body.
ctx.filter='blur(12px)';ctx.fillStyle='#b7f6ff66';ctx.beginPath();ctx.ellipse(0,0,37,18,0,0,Math.PI*2);ctx.fill();
ctx.filter='blur(1.6px)';ctx.globalAlpha=.9;
const g=ctx.createLinearGradient(-48,0,37,0);g.addColorStop(0,'#b7efff8a');g.addColorStop(.4,'#a0e9f4cc');g.addColorStop(1,'#d0f9fff0');
ctx.fillStyle=g;
// Dorsal view: the vertical caudal fin is seen edge-on, as in the supplied anatomy reference.
const tailSway=Math.sin(phase-.7)*8;
ctx.beginPath();ctx.moveTo(34,0);ctx.bezierCurveTo(33,-12,16,-18,-3,-14);ctx.bezierCurveTo(-21,-10,-34,sway-4,-47,sway-2);ctx.bezierCurveTo(-56,tailSway-1.8,-65,tailSway-1,-76,tailSway);ctx.bezierCurveTo(-65,tailSway+1,-56,tailSway+1.8,-47,sway+2);ctx.bezierCurveTo(-33,sway+4,-20,11,-3,14);ctx.bezierCurveTo(16,18,33,12,34,0);ctx.fill();
ctx.globalAlpha=.42;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(6,side*11);ctx.bezierCurveTo(-1,side*20,-13,side*(27+Math.sin(phase)*2),-17,side*23);ctx.quadraticCurveTo(-11,side*14,6,side*11);ctx.fill()}ctx.restore();
}
function animate(stamp){const dt=Math.min((stamp-last)/1000,.04)||.016;last=stamp;if(document.querySelector('#homeView').hidden){requestAnimationFrame(animate);return}time+=dt;ctx.clearRect(0,0,w,h);
if(!still){escape=Math.max(0,escape-dt);speed+=((escape>0?115:9)-speed)*(1-Math.exp(-dt*1.6));phase+=dt*(1.7+speed*.025);const cx=w*(w<420?.53:w<760?.66:.73),cy=h*(w<420?.57:w<760?.49:.4);const targetX=cx+Math.cos(time*.17)*w*.045,targetY=cy+Math.sin(time*.21)*h*.07;let target=escape>0?escapeAngle:Math.atan2(targetY-y,targetX-x);if(x<w*.27||x>w*.92||y<h*.2||y>h*.74)target=Math.atan2(cy-y,cx-x);const turn=Math.atan2(Math.sin(target-angle),Math.cos(target-angle));angle+=turn*(1-Math.exp(-dt*(escape>0?1.9:.55)));x+=Math.cos(angle)*speed*dt;y+=Math.sin(angle)*speed*dt}
ctx.save();ctx.filter='blur(.35px)';for(let i=ripples.length-1;i>=0;i--){const r=ripples[i];r.age+=dt;if(r.age<0)continue;r.radius+=dt*46;const opacity=Math.max(0,(1-r.age/2.6))*.65;ctx.beginPath();ctx.arc(r.x,r.y,r.radius,0,Math.PI*2);ctx.strokeStyle=`rgba(31,134,193,${opacity})`;ctx.lineWidth=1.3;ctx.stroke();ctx.beginPath();ctx.arc(r.x,r.y,r.radius+2.5,0,Math.PI*2);ctx.strokeStyle=`rgba(224,250,255,${opacity*.8})`;ctx.lineWidth=1;ctx.stroke();if(r.age>=2.6)ripples.splice(i,1)}ctx.restore();silhouette();requestAnimationFrame(animate)}
canvas.addEventListener('pointerdown',event=>{const bounds=canvas.getBoundingClientRect(),px=event.clientX-bounds.left,py=event.clientY-bounds.top;for(let i=0;i<4;i++)ripples.push({x:px,y:py,radius:2,age:-i*.18});if(Math.hypot(px-x,py-y)<110){escape=2.1;escapeAngle=Math.hypot(px-x,py-y)<20?angle-.8:Math.atan2(y-py,x-px)}});
requestAnimationFrame(animate);
})();
