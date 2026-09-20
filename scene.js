import * as THREE from './assets/vendor/three.module.js';
const host=document.querySelector('#scene'), motion=document.querySelector('#motion'), reset=document.querySelector('#reset-scene');
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=preference.matches;
function setPaused(value){paused=value;motion.textContent=paused?'Resume motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));}
setPaused(paused);preference.addEventListener('change',e=>setPaused(e.matches));
try {
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0,0);
 host.replaceChildren(renderer.domElement);
 const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(33,1,.1,100);camera.position.set(7.4,6.8,10.8);camera.lookAt(0,.7,0);
 scene.add(new THREE.HemisphereLight(0xfffaef,0x777965,3));const sun=new THREE.DirectionalLight(0xfff2db,5);sun.position.set(-3,8,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-7;sun.shadow.normalBias=.035;scene.add(sun);
 const fill=new THREE.DirectionalLight(0xffffff,2);fill.position.set(5,3,-3);scene.add(fill);
 const world=new THREE.Group();scene.add(world);
 const mat=(c,r=.55,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
 const cream=mat(0xe9e4d4),orange=mat(0xf36b3c,.32),dark=mat(0x343b35,.38),sage=mat(0xaab593),silver=mat(0xaab2a8,.3,.45),white=mat(0xf8f7ed),leaf=mat(0x536f47);
 function mesh(geometry,material,x,y,z,parent=world){const a=new THREE.Mesh(geometry,material);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a;}
 function box(w,h,d,material,x,y,z,parent=world){return mesh(new THREE.BoxGeometry(w,h,d),material,x,y,z,parent);}
 function cylinder(rt,rb,h,material,x,y,z,parent=world){return mesh(new THREE.CylinderGeometry(rt,rb,h,64),material,x,y,z,parent);}
 const ground=mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.12}),0,-.47,0,scene);ground.rotation.x=-Math.PI/2;
 cylinder(3.1,3.1,.2,cream,0,-.34,0);cylinder(2.9,3.0,.16,sage,0,-.2,0);
 const table=box(4.9,.22,2.75,cream,0,.48,0);table.rotation.y=-.08;
 for(const x of [-1.95,1.95])for(const z of [-.92,.92])cylinder(.09,.1,.65,orange,x,.09,z);
 const laptop=new THREE.Group();laptop.position.set(-.2,.64,-.05);laptop.rotation.y=.13;world.add(laptop);
 box(2.2,.1,1.5,silver,0,0,0,laptop);box(.6,.006,.36,dark,0,.055,.42,laptop);
 for(let r=0;r<4;r++)for(let c=0;c<12;c++)box(.135,.015,.12,dark,-.9+c*.16,.06,-.5+r*.16,laptop);
 const screen=new THREE.Group();screen.position.set(0,.05,-.69);screen.rotation.x=-.16;laptop.add(screen);box(2.2,1.45,.085,dark,0,.72,0,screen);
 const textureCanvas=document.createElement('canvas');textureCanvas.width=768;textureCanvas.height=480;const ctx=textureCanvas.getContext('2d');
 ctx.fillStyle='#202b27';ctx.fillRect(0,0,768,480);ctx.fillStyle='#33413a';ctx.fillRect(0,0,768,49);['#ef805b','#e9c476','#a5b881'].forEach((c,i)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(23+i*23,24,6,0,Math.PI*2);ctx.fill();});
 ctx.font='19px monospace';ctx.fillStyle='#83958a';ctx.fillText('najim / making-things-happen.dart',130,31);
 const lines=[['#92a588','// A little logic. A lot of possibility.'],['#f3b586','class',' NajimBacha {'],['#dce6cb','  final craft = "Flutter";'],['#dce6cb','  final mindset = "Engineer";'],['#92a588',''],['#e8b992','  buildSomethingGreat() {'],['#b8d18e','    return ideas.intoReality();'],['#e8b992','  }'],['#f3b586','}']];
 lines.forEach((a,i)=>{ctx.fillStyle='#647b6b';ctx.fillText(String(i+1),24,92+i*38);ctx.fillStyle=a[0];ctx.fillText(a.slice(1).join(''),65,92+i*38);});
 const texture=new THREE.CanvasTexture(textureCanvas);texture.colorSpace=THREE.SRGBColorSpace;mesh(new THREE.PlaneGeometry(2.06,1.29),new THREE.MeshBasicMaterial({map:texture}),0,.73,.045,screen);
 // A phone on a tilted stand.
 const phone=new THREE.Group();phone.position.set(1.65,1.05,.35);phone.rotation.set(-.3,-.2,.12);world.add(phone);box(.58,1.08,.105,dark,0,0,0,phone);box(.49,.89,.012,orange,0,0,.06,phone);box(.16,.035,.02,dark,0,.47,.07,phone);
 const phoneMark=mesh(new THREE.TorusGeometry(.115,.035,12,40),white,0,.08,.08,phone);box(.22,.025,.02,white,0,-.19,.08,phone);box(.15,.02,.02,white,0,-.26,.08,phone);cylinder(.24,.32,.07,silver,1.65,.64,.5);
 // Ceramic planter and sculpted leaves.
 cylinder(.31,.22,.48,orange,-1.9,.9,-.65);cylinder(.26,.26,.015,dark,-1.9,1.145,-.65);
 for(let i=0;i<7;i++){const a=i*2.4;const s=mesh(new THREE.SphereGeometry(1,20,16),leaf,-1.9+Math.cos(a)*.19,1.35+(i%3)*.12,-.65+Math.sin(a)*.18);s.scale.set(.12,.42,.075);s.rotation.set(Math.sin(a)*.6,0,Math.cos(a)*.55);}
 // Coffee, notebook and pencil.
 cylinder(.19,.15,.3,white,-1.18,.8,.83);cylinder(.155,.155,.008,mat(0x60432d),-1.18,.955,.83);const handle=mesh(new THREE.TorusGeometry(.115,.036,12,24),white,-.965,.82,.83);handle.rotation.y=.2;
 const book=box(.65,.07,.8,sage,.7,.655,.69);book.rotation.y=-.2;const pencil=cylinder(.022,.022,.66,orange,.7,.72,.67);pencil.rotation.z=Math.PI/2;pencil.rotation.y=.4;
 // Floating dimensional sculpture and satellite forms.
 const sculpture=new THREE.Group();sculpture.position.set(1.8,2.95,-1);world.add(sculpture);
 const knot=mesh(new THREE.TorusKnotGeometry(.43,.13,100,16,2,3),orange,0,0,0,sculpture);knot.rotation.set(.4,.2,.4);
 const orb=mesh(new THREE.SphereGeometry(.21,32,24),sage,-2.25,2.6,.1);
 const cube=box(.32,.32,.32,orange,-1.6,3.15,-.85);cube.rotation.set(.3,.3,.4);
 const ring=mesh(new THREE.TorusGeometry(.3,.065,16,64),cream,2.55,1.8,.6);ring.rotation.set(.5,.3,.2);
 let angle=0,target=0,tilt=0,targetTilt=0,dragging=false,startX=0,startY=0,startAngle=0,startTilt=0,visible=true,last=0,time=0;
 host.addEventListener('pointerdown',e=>{{dragging=true;startX=e.clientX;startY=e.clientY;startAngle=target;startTilt=targetTilt;host.setPointerCapture(e.pointerId);}});
 host.addEventListener('pointermove',e=>{if(dragging){target=Math.max(-.85,Math.min(.85,startAngle+(e.clientX-startX)*.006));targetTilt=Math.max(-.18,Math.min(.18,startTilt+(e.clientY-startY)*.002));}});
 host.addEventListener('pointerup',()=>dragging=false);host.addEventListener('pointercancel',()=>dragging=false);
 host.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home')target=targetTilt=0;else if(e.key==='ArrowLeft')target-=.12;else if(e.key==='ArrowRight')target+=.12;else if(e.key==='ArrowUp')targetTilt-=.04;else targetTilt+=.04;target=Math.max(-.85,Math.min(.85,target));targetTilt=Math.max(-.18,Math.min(.18,targetTilt));}});
 reset.addEventListener('click',()=>{target=targetTilt=0;});motion.addEventListener('click',()=>setPaused(!paused));
 function resize(){const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(host);
 renderer.setAnimationLoop(now=>{const delta=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;if(!paused)time+=delta;angle+=(target-angle)*(paused?1:.09);tilt+=(targetTilt-tilt)*(paused?1:.09);world.rotation.set(tilt,angle,0);sculpture.position.y=2.95+Math.sin(time)*.13;sculpture.rotation.y=time*.23;orb.position.y=2.6+Math.sin(time*1.2)*.14;cube.rotation.y=time*.3;ring.position.y=1.8+Math.sin(time+.8)*.12;renderer.render(scene,camera);});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);document.querySelector('#scene-hint').textContent='3D paused — refresh to restore';});
} catch(error){document.querySelector('#scene-hint').textContent='A workspace for ideas';motion.hidden=true;reset.hidden=true;console.warn('3D rendering is unavailable.',error);}

