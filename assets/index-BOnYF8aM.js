(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={easy:{name:`Leicht`,hear:.45,radio:6,shooters:2,damage:.6,reaction:1.4,flank:!1},normal:{name:`Normal`,hear:.6,radio:9,shooters:3,damage:.8,reaction:1.15,flank:!0},hard:{name:`Schwer`,hear:1,radio:14,shooters:99,damage:1,reaction:1,flank:!0}},t=`frontline.settings.v1`,n={quality:`auto`,aimAssist:!0,vibration:!0,screenShake:!0,showFps:!1,volume:.7,music:.5,touchSize:1,difficulty:`normal`};function r(){try{let e=localStorage.getItem(t);if(e)return{...n,...JSON.parse(e)}}catch{}return{...n}}var i=r();function a(){return e[i.difficulty]??e.normal}function o(){try{localStorage.setItem(t,JSON.stringify(i))}catch{}}var s=60/80/2,c=[[38,!1],[34,!0],[41,!0],[36,!0],[38,!1],[43,!1],[34,!0],[33,!0]],l=[0,0,7,0,12,0,7,`third`],u=[1,0,.45,.6,.9,0,.5,.35],d=e=>440*2**((e-69)/12),f=new class{ctx=null;out=null;dry=null;wet=null;noise=null;timer=0;nextT=0;step=0;level=0;duck=1;attach(e){if(this.ctx)return;this.ctx=e,this.out=e.createGain(),this.out.gain.value=0,this.out.connect(e.destination);let t=e.createDynamicsCompressor();t.threshold.value=-22,t.ratio.value=3,t.connect(this.out),this.dry=e.createGain(),this.dry.connect(t);let n=e.createConvolver(),r=Math.floor(e.sampleRate*3),i=e.createBuffer(2,r,e.sampleRate);for(let e=0;e<2;e++){let t=i.getChannelData(e);for(let e=0;e<r;e++)t[e]=(Math.random()*2-1)*(1-e/r)**3.2}n.buffer=i,this.wet=e.createGain(),this.wet.gain.value=.5,this.wet.connect(n).connect(t);let a=e.createBuffer(1,Math.floor(e.sampleRate*.5),e.sampleRate),o=a.getChannelData(0);for(let e=0;e<o.length;e++)o[e]=Math.random()*2-1;this.noise=a,this.nextT=e.currentTime+.2,this.applyVolume(2.5),this.timer=window.setInterval(()=>this.schedule(),120)}applyVolume(e=.3){let t=this.ctx;if(!t||!this.out)return;let n=i.volume*i.music*.55*this.duck;this.out.gain.cancelScheduledValues(t.currentTime),this.out.gain.setTargetAtTime(n,t.currentTime,e/3)}update(e,t,n=1){let r=t>this.level?.35:.06;this.level+=Math.max(-r*e,Math.min(r*e,t-this.level)),Math.abs(n-this.duck)>.01&&(this.duck=n,this.applyVolume(.6))}stop(){window.clearInterval(this.timer)}schedule(){let e=this.ctx;if(!e||e.state!==`running`)e&&(this.nextT=e.currentTime+.1);else for(this.nextT<e.currentTime-.5&&(this.nextT=e.currentTime+.05);this.nextT<e.currentTime+.4;)this.playStep(this.step,this.nextT),this.nextT+=s,this.step=(this.step+1)%(c.length*16)}playStep(e,t){let n=this.level,r=Math.floor(e/16),[i,a]=c[r],o=e%8,f=e%16,p=a?4:3,m=s*16;if(f===0){for(let e of[12,12+p,19,24])this.pad(d(i+e),t,m,.018+n*.01,650+n*900);if(this.bass(d(i-12),t,m,.11),n>.55){let e=(n-.55)*.09;this.brass(d(i+12),t,m,e),this.brass(d(i+19),t,m,e*.8)}}let h=n>.2?.025+n*.035:r%2==1&&n>.05?.012:0;if(h>0){let e=l[o],r=e===`third`?p+12:e;this.cello(d(i+12+r),t,s*.95,h*(o===0?1.25:1),500+n*1100)}let g=u[o];n>.35&&g>0?this.taiko(t,g*(.2+n*.3),o===0?52:62):e%16==0&&this.taiko(t,.16,48),n>.75&&f>=14&&this.snare(t,(n-.75)*.5)}pad(e,t,n,r,i){let a=this.ctx,o=a.createGain();o.gain.setValueAtTime(1e-4,t),o.gain.linearRampToValueAtTime(r,t+1.6),o.gain.setValueAtTime(r,t+n-.4),o.gain.exponentialRampToValueAtTime(1e-4,t+n+2);let s=a.createBiquadFilter();s.type=`lowpass`,s.frequency.value=i,s.Q.value=.4,s.connect(o),o.connect(this.dry),o.connect(this.wet);for(let r of[-7,6]){let i=a.createOscillator();i.type=`sawtooth`,i.frequency.value=e,i.detune.value=r,i.connect(s),i.start(t),i.stop(t+n+2.1)}}bass(e,t,n,r){let i=this.ctx,a=i.createGain();a.gain.setValueAtTime(1e-4,t),a.gain.linearRampToValueAtTime(r,t+.9),a.gain.setValueAtTime(r,t+n-.3),a.gain.exponentialRampToValueAtTime(1e-4,t+n+1),a.connect(this.dry);for(let[r,o,s]of[[1,`sine`,1],[2,`triangle`,.25]]){let c=i.createOscillator();c.type=o,c.frequency.value=e*r;let l=i.createGain();l.gain.value=s,c.connect(l).connect(a),c.start(t),c.stop(t+n+1.1)}}cello(e,t,n,r,i){let a=this.ctx,o=a.createOscillator();o.type=`sawtooth`,o.frequency.value=e;let s=a.createBiquadFilter();s.type=`lowpass`,s.frequency.setValueAtTime(i*1.6,t),s.frequency.exponentialRampToValueAtTime(i,t+n),s.Q.value=1.2;let c=a.createGain();c.gain.setValueAtTime(1e-4,t),c.gain.linearRampToValueAtTime(r,t+.025),c.gain.exponentialRampToValueAtTime(r*.35,t+n*.8),c.gain.exponentialRampToValueAtTime(1e-4,t+n+.12),o.connect(s).connect(c),c.connect(this.dry);let l=a.createGain();l.gain.value=.4,c.connect(l).connect(this.wet),o.start(t),o.stop(t+n+.15)}brass(e,t,n,r){let i=this.ctx,a=i.createGain();a.gain.setValueAtTime(1e-4,t),a.gain.linearRampToValueAtTime(r,t+n*.45),a.gain.exponentialRampToValueAtTime(1e-4,t+n+.6);let o=i.createBiquadFilter();o.type=`lowpass`,o.frequency.setValueAtTime(300,t),o.frequency.linearRampToValueAtTime(1500,t+n*.5),o.frequency.linearRampToValueAtTime(500,t+n),o.Q.value=2,o.connect(a),a.connect(this.dry),a.connect(this.wet);for(let r of[-5,4]){let a=i.createOscillator();a.type=`sawtooth`,a.frequency.value=e,a.detune.value=r,a.connect(o),a.start(t),a.stop(t+n+.7)}}taiko(e,t,n){let r=this.ctx,i=r.createOscillator();i.type=`sine`,i.frequency.setValueAtTime(n*2.4,e),i.frequency.exponentialRampToValueAtTime(n,e+.18);let a=r.createGain();a.gain.setValueAtTime(t,e),a.gain.exponentialRampToValueAtTime(1e-4,e+.9),i.connect(a),a.connect(this.dry);let o=r.createGain();o.gain.value=.35,a.connect(o).connect(this.wet),i.start(e),i.stop(e+.95);let s=r.createBufferSource();s.buffer=this.noise;let c=r.createBiquadFilter();c.type=`lowpass`,c.frequency.value=380;let l=r.createGain();l.gain.setValueAtTime(t*.9,e),l.gain.exponentialRampToValueAtTime(1e-4,e+.16),s.connect(c).connect(l).connect(this.dry),s.start(e),s.stop(e+.2)}snare(e,t){let n=this.ctx;for(let r=0;r<2;r++){let i=e+r*s*.5,a=n.createBufferSource();a.buffer=this.noise;let o=n.createBiquadFilter();o.type=`bandpass`,o.frequency.value=1800,o.Q.value=.8;let c=n.createGain();c.gain.setValueAtTime(t*(.6+r*.4),i),c.gain.exponentialRampToValueAtTime(1e-4,i+.12),a.connect(o).connect(c).connect(this.wet),a.start(i),a.stop(i+.14)}}},p={beach:{wind:.5,surf:1,birds:.35,leaves:0,hum:0,front:9},village:{wind:.35,surf:0,birds:1,leaves:.2,hum:0,front:12},forest:{wind:.3,surf:0,birds:1.2,leaves:.8,hum:0,front:16},industry:{wind:.45,surf:0,birds:.15,leaves:0,hum:.8,front:10},town:{wind:.55,surf:0,birds:.2,leaves:0,hum:0,front:6},fortress:{wind:1,surf:0,birds:.3,leaves:.3,hum:0,front:8}},m={wind:.3,surf:0,birds:.4,leaves:0,hum:0,front:0},h=new class{ctx=null;out=null;noise=null;loops={wind:null,leaves:null,surf:null,hum:null};windFilter=null;scene=m;sceneId=``;nextGust=0;nextWave=0;nextBird=0;nextBoom=0;combat=0;duck=1;attach(e){if(this.ctx)return;this.ctx=e,this.out=e.createGain(),this.out.gain.value=0,this.out.connect(e.destination);let t=Math.floor(e.sampleRate*4),n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0),i=0;for(let e=0;e<t;e++)i=i*.96+(Math.random()*2-1)*.2,r[e]=i*2.5;this.noise=n;let a=(t,r,i)=>{let a=e.createBufferSource();a.buffer=n,a.loop=!0,a.playbackRate.value=.9+Math.random()*.2;let o=e.createBiquadFilter();o.type=t,o.frequency.value=r,o.Q.value=i;let s=e.createGain();return s.gain.value=0,a.connect(o).connect(s).connect(this.out),a.start(),[s,o]},[o,s]=a(`bandpass`,380,.6);this.loops.wind=o,this.windFilter=s,this.loops.leaves=a(`highpass`,2400,.4)[0],this.loops.surf=a(`lowpass`,700,.3)[0];let c=e.createGain();c.gain.value=0,c.connect(this.out);for(let t of[50,100.6,151]){let n=e.createOscillator();n.type=t===50?`sawtooth`:`sine`,n.frequency.value=t;let r=e.createBiquadFilter();r.type=`lowpass`,r.frequency.value=220;let i=e.createGain();i.gain.value=t===50?.25:.5,n.connect(r).connect(i).connect(c),n.start()}this.loops.hum=c,this.applyVolume()}applyVolume(){let e=this.ctx;e&&this.out&&this.out.gain.setTargetAtTime(i.volume*.5*this.duck,e.currentTime,.4)}update(e,t,n){let r=this.ctx;if(!r||r.state!==`running`)return;let i=r.currentTime;this.combat=t;let a=n?.4:e?1:.6;if(a!==this.duck&&(this.duck=a,this.applyVolume()),e!==this.sceneId){this.sceneId=e,this.scene=e&&p[e]||m;let t=this.scene;this.loops.leaves.gain.setTargetAtTime(t.leaves*.05,i,1.5),this.loops.hum.gain.setTargetAtTime(t.hum*.05,i,1.5),t.surf||this.loops.surf.gain.setTargetAtTime(0,i,1.5),this.nextBoom=i+3+Math.random()*6}let o=this.scene;if(i>=this.nextGust){let e=.35+Math.random()*.65;this.loops.wind.gain.setTargetAtTime(o.wind*.09*e,i,1.2),this.windFilter.frequency.setTargetAtTime(250+e*350,i,1.5),this.nextGust=i+2+Math.random()*4}if(o.surf>0&&i>=this.nextWave){let e=this.loops.surf.gain,t=o.surf*(.1+Math.random()*.06);e.cancelScheduledValues(i),e.setTargetAtTime(t,i,.9),e.setTargetAtTime(t*.2,i+2.6,1.4),this.nextWave=i+5.5+Math.random()*3}o.birds>0&&i>=this.nextBird&&(this.combat<.45&&this.bird(i,o.birds),this.nextBird=i+(1.2+Math.random()*5)/Math.max(.3,o.birds)),o.front>0&&i>=this.nextBoom&&(this.boom(i),this.nextBoom=i+o.front*(.5+Math.random()))}bird(e,t){let n=this.ctx,r=n.createStereoPanner?.(),i=n.createGain();i.gain.value=.04*Math.min(1,t)*(.5+Math.random()*.5),r?(r.pan.value=Math.random()*1.6-.8,i.connect(r).connect(this.out)):i.connect(this.out);let a=2200+Math.random()*1800,o=2+Math.floor(Math.random()*4),s=Math.random();for(let t=0;t<o;t++){let r=e+t*(.09+Math.random()*.05),o=n.createOscillator();o.type=`sine`;let c=a*(s<.5?1+t*.06:1.15-t*.04);o.frequency.setValueAtTime(c,r),o.frequency.exponentialRampToValueAtTime(c*(s<.5?1.35:.8),r+.06);let l=n.createGain();l.gain.setValueAtTime(1e-4,r),l.gain.linearRampToValueAtTime(1,r+.01),l.gain.exponentialRampToValueAtTime(1e-4,r+.07),o.connect(l).connect(i),o.start(r),o.stop(r+.08)}}boom(e){let t=this.ctx,n=t.createBufferSource();n.buffer=this.noise,n.playbackRate.value=.5+Math.random()*.2;let r=t.createBiquadFilter();r.type=`lowpass`,r.frequency.value=90+Math.random()*60;let i=t.createGain(),a=.15+Math.random()*.2;i.gain.setValueAtTime(1e-4,e),i.gain.linearRampToValueAtTime(a,e+.05),i.gain.exponentialRampToValueAtTime(1e-4,e+2.2),n.connect(r).connect(i).connect(this.out),n.start(e,Math.random()*2),n.stop(e+2.3),Math.random()<.35&&this.boomEcho(e+.5+Math.random()*.8,a*.6)}boomEcho(e,t){let n=this.ctx,r=n.createBufferSource();r.buffer=this.noise,r.playbackRate.value=.6;let i=n.createBiquadFilter();i.type=`lowpass`,i.frequency.value=110;let a=n.createGain();a.gain.setValueAtTime(t,e),a.gain.exponentialRampToValueAtTime(1e-4,e+1.6),r.connect(i).connect(a).connect(this.out),r.start(e,Math.random()*2),r.stop(e+1.7)}},g=1e3,_=1001,v=1002,y=1003,b=1004,x=1005,S=1006,C=1007,w=1008,T=1009,E=1010,D=1011,ee=1012,O=1013,k=1014,A=1015,te=1016,ne=1017,re=1018,ie=1020,ae=35902,oe=35899,se=1021,ce=1022,le=1023,j=1026,ue=1027,de=1028,fe=1029,pe=1030,me=1031,he=1033,ge=33776,_e=33777,ve=33778,ye=33779,be=35840,xe=35841,Se=35842,Ce=35843,we=36196,Te=37492,Ee=37496,De=37488,Oe=37489,ke=37490,Ae=37491,je=37808,Me=37809,Ne=37810,Pe=37811,Fe=37812,Ie=37813,Le=37814,M=37815,Re=37816,ze=37817,Be=37818,N=37819,Ve=37820,P=37821,F=36492,He=36494,Ue=36495,We=36283,Ge=36284,Ke=36285,qe=36286,Je=2300,Ye=2301,Xe=2302,Ze=2303,Qe=2400,$e=2401,et=2402,tt=3200,nt=`srgb`,rt=`srgb-linear`,it=`linear`,at=`srgb`,ot=7680,st=7681,ct=35044,lt=2e3;function ut(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function dt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function ft(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function pt(){let e=ft(`canvas`);return e.style.display=`block`,e}var mt={};function ht(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function gt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function I(...e){e=gt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function L(...e){e=gt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function _t(...e){let t=e.join(` `);t in mt||(mt[t]=!0,I(...e))}function vt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var yt={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3},bt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},xt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),St=Math.PI/180,Ct=180/Math.PI;function wt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(xt[e&255]+xt[e>>8&255]+xt[e>>16&255]+xt[e>>24&255]+`-`+xt[t&255]+xt[t>>8&255]+`-`+xt[t>>16&15|64]+xt[t>>24&255]+`-`+xt[n&63|128]+xt[n>>8&255]+`-`+xt[n>>16&255]+xt[n>>24&255]+xt[r&255]+xt[r>>8&255]+xt[r>>16&255]+xt[r>>24&255]).toLowerCase()}function Tt(e,t,n){return Math.max(t,Math.min(n,e))}function Et(e,t){return(e%t+t)%t}function Dt(e,t,n){return(1-n)*e+n*t}function Ot(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function kt(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function At(e,t){if(t.constructor===Float32Array)return e;let n=kt(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.max(e/n,-1)}function jt(e,t){if(t.constructor===Float32Array)return e;let n=kt(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.round(e*n)}var R=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Tt(this.x,e.x,t.x),this.y=Tt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Tt(this.x,e,t),this.y=Tt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Mt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:I(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Tt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},z=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Pt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Pt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Tt(this.x,e.x,t.x),this.y=Tt(this.y,e.y,t.y),this.z=Tt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Tt(this.x,e,t),this.y=Tt(this.y,e,t),this.z=Tt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Nt.copy(this).projectOnVector(e),this.sub(Nt)}reflect(e){return this.sub(Nt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Nt=new z,Pt=new Mt,B=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return _t(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Ft.makeScale(e,t)),this}rotate(e){return _t(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Ft.makeRotation(-e)),this}translate(e,t){return _t(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Ft.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ft=new B,It=new B().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Lt=new B().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Rt(){let e={enabled:!0,workingColorSpace:rt,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Bt(e.r),e.g=Bt(e.g),e.b=Bt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Vt(e.r),e.g=Vt(e.g),e.b=Vt(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?it:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[n].fromXYZ).multiply(this.spaces[t].toXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[rt]:{primaries:t,whitePoint:r,transfer:it,toXYZ:It,fromXYZ:Lt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:nt},outputColorSpaceConfig:{drawingBufferColorSpace:nt}},[nt]:{primaries:t,whitePoint:r,transfer:at,toXYZ:It,fromXYZ:Lt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:nt}}}),e}var zt=Rt();function Bt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Vt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Ht,Ut=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ht===void 0&&(Ht=ft(`canvas`)),Ht.width=e.width,Ht.height=e.height;let t=Ht.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Ht}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=ft(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Bt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Bt(t[e]/255)*255):t[e]=Bt(t[e]);return{data:t,width:e.width,height:e.height}}return I(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Wt=0,Gt=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Wt++}),this.uuid=wt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width||0,t.height||0,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Kt(r[t].image)):e.push(Kt(r[t]))}else e=Kt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Kt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Ut.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(I(`Texture: Unable to serialize Texture.`),{})}var qt=0,Jt=new z,Yt=class e extends bt{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=_,i=_,a=S,o=w,s=le,c=T,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qt++}),this.uuid=wt(),this.name=``,this.source=new Gt(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new R(0,0),this.repeat=new R(1,1),this.center=new R(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new B,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Jt).x}get height(){return this.source.getSize(Jt).y}get depth(){return this.source.getSize(Jt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){I(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?I(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case g:e.x-=Math.floor(e.x);break;case _:e.x=e.x<0?0:1;break;case v:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case g:e.y-=Math.floor(e.y);break;case _:e.y=e.y<0?0:1;break;case v:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Yt.DEFAULT_IMAGE=null,Yt.DEFAULT_MAPPING=300,Yt.DEFAULT_ANISOTROPY=1;var Xt=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Tt(this.x,e.x,t.x),this.y=Tt(this.y,e.y,t.y),this.z=Tt(this.z,e.z,t.z),this.w=Tt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Tt(this.x,e,t),this.y=Tt(this.y,e,t),this.z=Tt(this.z,e,t),this.w=Tt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Zt=class extends bt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:S,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Xt(0,0,e,t),this.scissorTest=!1,this.viewport=new Xt(0,0,e,t),this.textures=[];let r=n.count;for(let i=0;i<r;i++)this.textures[i]=new Yt({width:e,height:t,depth:n.depth}),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:S,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Gt(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Qt=class extends Zt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},$t=class extends Yt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=y,this.minFilter=y,this.wrapR=_,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},en=class extends Yt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=y,this.minFilter=y,this.wrapR=_,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},tn=class e{static{this.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/nn.setFromMatrixColumn(e,0).length(),i=1/nn.setFromMatrixColumn(e,1).length(),a=1/nn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(an,e,on)}lookAt(e,t,n){let r=this.elements;return ln.subVectors(e,t),ln.lengthSq()===0&&(ln.z=1),ln.normalize(),sn.crossVectors(n,ln),sn.lengthSq()===0&&(Math.abs(n.z)===1?ln.x+=1e-4:ln.z+=1e-4,ln.normalize(),sn.crossVectors(n,ln)),sn.normalize(),cn.crossVectors(ln,sn),r[0]=sn.x,r[4]=cn.x,r[8]=ln.x,r[1]=sn.y,r[5]=cn.y,r[9]=ln.y,r[2]=sn.z,r[6]=cn.z,r[10]=ln.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],ee=r[13],O=r[2],k=r[6],A=r[10],te=r[14],ne=r[3],re=r[7],ie=r[11],ae=r[15];return i[0]=a*x+o*T+s*O+c*ne,i[4]=a*S+o*E+s*k+c*re,i[8]=a*C+o*D+s*A+c*ie,i[12]=a*w+o*ee+s*te+c*ae,i[1]=l*x+u*T+d*O+f*ne,i[5]=l*S+u*E+d*k+f*re,i[9]=l*C+u*D+d*A+f*ie,i[13]=l*w+u*ee+d*te+f*ae,i[2]=p*x+m*T+h*O+g*ne,i[6]=p*S+m*E+h*k+g*re,i[10]=p*C+m*D+h*A+g*ie,i[14]=p*w+m*ee+h*te+g*ae,i[3]=_*x+v*T+y*O+b*ne,i[7]=_*S+v*E+y*k+b*re,i[11]=_*C+v*D+y*A+b*ie,i[15]=_*w+v*ee+y*te+b*ae,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,ee=d*g-f*h,O=_*ee-v*D+y*E+b*T-x*w+S*C;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/O;return e[0]=(o*ee-s*D+c*E)*k,e[1]=(r*D-n*ee-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*ee-c*w)*k,e[5]=(t*ee-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=nn.set(r[0],r[1],r[2]).length(),o=nn.set(r[4],r[5],r[6]).length(),s=nn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),rn.copy(this);let c=1/a,l=1/o,u=1/s;return rn.elements[0]*=c,rn.elements[1]*=c,rn.elements[2]*=c,rn.elements[4]*=l,rn.elements[5]*=l,rn.elements[6]*=l,rn.elements[8]*=u,rn.elements[9]*=u,rn.elements[10]*=u,t.setFromRotationMatrix(rn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=lt,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=lt,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},nn=new z,rn=new tn,an=new z(0,0,0),on=new z(1,1,1),sn=new z,cn=new z,ln=new z,un=new tn,dn=new Mt,fn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(Tt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-Tt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(Tt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-Tt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(Tt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-Tt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:I(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return un.makeRotationFromQuaternion(e),this.setFromRotationMatrix(un,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return dn.setFromEuler(this),this.setFromQuaternion(dn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};fn.DEFAULT_ORDER=`XYZ`;var pn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},mn=0,hn=new z,gn=new Mt,_n=new tn,vn=new z,yn=new z,bn=new z,xn=new Mt,Sn=new z(1,0,0),Cn=new z(0,1,0),wn=new z(0,0,1),Tn={type:`added`},En={type:`removed`},Dn={type:`childadded`,child:null},On={type:`childremoved`,child:null},kn=class e extends bt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mn++}),this.uuid=wt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new z,n=new fn,r=new Mt,i=new z(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new tn},normalMatrix:{value:new B}}),this.matrix=new tn,this.matrixWorld=new tn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gn.setFromAxisAngle(e,t),this.quaternion.multiply(gn),this}rotateOnWorldAxis(e,t){return gn.setFromAxisAngle(e,t),this.quaternion.premultiply(gn),this}rotateX(e){return this.rotateOnAxis(Sn,e)}rotateY(e){return this.rotateOnAxis(Cn,e)}rotateZ(e){return this.rotateOnAxis(wn,e)}translateOnAxis(e,t){return hn.copy(e).applyQuaternion(this.quaternion),this.position.add(hn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Sn,e)}translateY(e){return this.translateOnAxis(Cn,e)}translateZ(e){return this.translateOnAxis(wn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_n.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?vn.copy(e):vn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),yn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_n.lookAt(yn,vn,this.up):_n.lookAt(vn,yn,this.up),this.quaternion.setFromRotationMatrix(_n),r&&(_n.extractRotation(r.matrixWorld),gn.setFromRotationMatrix(_n),this.quaternion.premultiply(gn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(L(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Tn),Dn.child=e,this.dispatchEvent(Dn),Dn.child=null):L(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(En),On.child=e,this.dispatchEvent(On),On.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_n.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_n.multiply(e.parent.matrixWorld)),e.applyMatrix4(_n),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Tn),Dn.child=e,this.dispatchEvent(Dn),Dn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(yn,e,bn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(yn,xn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};kn.DEFAULT_UP=new z(0,1,0),kn.DEFAULT_MATRIX_AUTO_UPDATE=!0,kn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var An=class extends kn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},jn={type:`move`},Mn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new An,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new An,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new An,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.quaternion,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(jn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new An;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Nn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pn={h:0,s:0,l:0},Fn={h:0,s:0,l:0};function In(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var V=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,zt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=zt.workingColorSpace){return this.r=e,this.g=t,this.b=n,zt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=zt.workingColorSpace){if(e=Et(e,1),t=Tt(t,0,1),n=Tt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=In(i,r,e+1/3),this.g=In(i,r,e),this.b=In(i,r,e-1/3)}return zt.colorSpaceToWorking(this,r),this}setStyle(e,t=nt){function n(t){t!==void 0&&parseFloat(t)<1&&I(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseFloat(i[1]))/100,Math.min(100,parseFloat(i[2]))/100,Math.min(100,parseFloat(i[3]))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:I(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);I(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=nt){let n=Nn[e.toLowerCase()];return n===void 0?I(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Bt(e.r),this.g=Bt(e.g),this.b=Bt(e.b),this}copyLinearToSRGB(e){return this.r=Vt(e.r),this.g=Vt(e.g),this.b=Vt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nt){return zt.workingToColorSpace(Ln.copy(this),e),Math.round(Tt(Ln.r*255,0,255))*65536+Math.round(Tt(Ln.g*255,0,255))*256+Math.round(Tt(Ln.b*255,0,255))}getHexString(e=nt){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=zt.workingColorSpace){zt.workingToColorSpace(Ln.copy(this),t);let n=Ln.r,r=Ln.g,i=Ln.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=zt.workingColorSpace){return zt.workingToColorSpace(Ln.copy(this),t),e.r=Ln.r,e.g=Ln.g,e.b=Ln.b,e}getStyle(e=nt){zt.workingToColorSpace(Ln.copy(this),e);let t=Ln.r,n=Ln.g,r=Ln.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Pn),this.setHSL(Pn.h+e,Pn.s+t,Pn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pn),e.getHSL(Fn);let n=Dt(Pn.h,Fn.h,t),r=Dt(Pn.s,Fn.s,t),i=Dt(Pn.l,Fn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ln=new V;V.NAMES=Nn;var Rn=class extends kn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fn,this.environmentIntensity=1,this.environmentRotation=new fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background===null?null:e.background.clone(),this.environment=e.environment===null?null:e.environment.clone(),this.fog=e.fog===null?null:e.fog.clone(),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial===null?null:e.overrideMaterial.clone(),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},zn=new z,Bn=new z,Vn=new z,Hn=new z,Un=new z,Wn=new z,Gn=new z,Kn=new z,qn=new z,Jn=new z,Yn=new Xt,Xn=new Xt,Zn=new Xt,Qn=class e{constructor(e=new z,t=new z,n=new z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),zn.subVectors(e,t),r.cross(zn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){zn.subVectors(r,t),Bn.subVectors(n,t),Vn.subVectors(e,t);let a=zn.dot(zn),o=zn.dot(Bn),s=zn.dot(Vn),c=Bn.dot(Bn),l=Bn.dot(Vn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Hn)!==null&&Hn.x>=0&&Hn.y>=0&&Hn.x+Hn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Hn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Hn.x),s.addScaledVector(a,Hn.y),s.addScaledVector(o,Hn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Yn.setScalar(0),Xn.setScalar(0),Zn.setScalar(0),Yn.fromBufferAttribute(e,t),Xn.fromBufferAttribute(e,n),Zn.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Yn,i.x),a.addScaledVector(Xn,i.y),a.addScaledVector(Zn,i.z),a}static isFrontFacing(e,t,n,r){return zn.subVectors(n,t),Bn.subVectors(e,t),zn.cross(Bn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),Bn.subVectors(this.a,this.b),zn.cross(Bn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Un.subVectors(r,n),Wn.subVectors(i,n),Kn.subVectors(e,n);let s=Un.dot(Kn),c=Wn.dot(Kn);if(s<=0&&c<=0)return t.copy(n);qn.subVectors(e,r);let l=Un.dot(qn),u=Wn.dot(qn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0&&s-l>0)return a=s/(s-l),t.copy(n).addScaledVector(Un,a);Jn.subVectors(e,i);let f=Un.dot(Jn),p=Wn.dot(Jn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Wn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Gn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Gn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Un,a).addScaledVector(Wn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},$n=class{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(tr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(tr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=tr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,tr):tr.fromBufferAttribute(r,t),tr.applyMatrix4(e.matrixWorld),this.expandByPoint(tr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),nr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),nr.copy(e.boundingBox)),nr.applyMatrix4(e.matrixWorld),this.union(nr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,tr),tr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(lr),ur.subVectors(this.max,lr),rr.subVectors(e.a,lr),ir.subVectors(e.b,lr),ar.subVectors(e.c,lr),or.subVectors(ir,rr),sr.subVectors(ar,ir),cr.subVectors(rr,ar);let t=[0,-or.z,or.y,0,-sr.z,sr.y,0,-cr.z,cr.y,or.z,0,-or.x,sr.z,0,-sr.x,cr.z,0,-cr.x,-or.y,or.x,0,-sr.y,sr.x,0,-cr.y,cr.x,0];return!pr(t,rr,ir,ar,ur)||(t=[1,0,0,0,1,0,0,0,1],!pr(t,rr,ir,ar,ur))?!1:(dr.crossVectors(or,sr),t=[dr.x,dr.y,dr.z],pr(t,rr,ir,ar,ur))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,tr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(tr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(er[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),er[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),er[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),er[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),er[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),er[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),er[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),er[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(er)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},er=[new z,new z,new z,new z,new z,new z,new z,new z],tr=new z,nr=new $n,rr=new z,ir=new z,ar=new z,or=new z,sr=new z,cr=new z,lr=new z,ur=new z,dr=new z,fr=new z;function pr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){fr.fromArray(e,a);let o=i.x*Math.abs(fr.x)+i.y*Math.abs(fr.y)+i.z*Math.abs(fr.z),s=t.dot(fr),c=n.dot(fr),l=r.dot(fr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var mr=new z,hr=new R,gr=0,_r=class extends bt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:gr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=ct,this.updateRanges=[],this.gpuType=A,this.version=0,this._normalizationScale=e===void 0?void 0:kt(e)}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)hr.fromBufferAttribute(this,t),hr.applyMatrix3(e),this.setXY(t,hr.x,hr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)mr.fromBufferAttribute(this,t),mr.applyMatrix3(e),this.setXYZ(t,mr.x,mr.y,mr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)mr.fromBufferAttribute(this,t),mr.applyMatrix4(e),this.setXYZ(t,mr.x,mr.y,mr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)mr.fromBufferAttribute(this,t),mr.applyNormalMatrix(e),this.setXYZ(t,mr.x,mr.y,mr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)mr.fromBufferAttribute(this,t),mr.transformDirection(e),this.setXYZ(t,mr.x,mr.y,mr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}_denormalize(e){let t=this._normalizationScale;return t===void 0?At(e,this.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?jt(e,this.array):Math.round(e*t)}},vr=class extends _r{constructor(e,t,n){super(new Uint16Array(e),t,n)}},yr=class extends _r{constructor(e,t,n){super(new Uint32Array(e),t,n)}},br=class extends _r{constructor(e,t,n){super(new Float32Array(e),t,n)}},xr=new $n,Sr=new z,Cr=new z,wr=class{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?xr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Sr.subVectors(e,this.center);let t=Sr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Sr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Cr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Sr.copy(e.center).add(Cr)),this.expandByPoint(Sr.copy(e.center).sub(Cr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Tr=0,Er=new tn,Dr=new kn,Or=new z,kr=new $n,Ar=new $n,jr=new z,Mr=class e extends bt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tr++}),this.uuid=wt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(ut(e)?yr:vr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new B().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Er.makeRotationFromQuaternion(e),this.applyMatrix4(Er),this}rotateX(e){return Er.makeRotationX(e),this.applyMatrix4(Er),this}rotateY(e){return Er.makeRotationY(e),this.applyMatrix4(Er),this}rotateZ(e){return Er.makeRotationZ(e),this.applyMatrix4(Er),this}translate(e,t,n){return Er.makeTranslation(e,t,n),this.applyMatrix4(Er),this}scale(e,t,n){return Er.makeScale(e,t,n),this.applyMatrix4(Er),this}lookAt(e){return Dr.lookAt(e),Dr.updateMatrix(),this.applyMatrix4(Dr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Or).negate(),this.translate(Or.x,Or.y,Or.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new br(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&I(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $n);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)L(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];kr.setFromBufferAttribute(n),this.morphTargetsRelative?(jr.addVectors(this.boundingBox.min,kr.min),this.boundingBox.expandByPoint(jr),jr.addVectors(this.boundingBox.max,kr.max),this.boundingBox.expandByPoint(jr)):(this.boundingBox.expandByPoint(kr.min),this.boundingBox.expandByPoint(kr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&L(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)L(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new z,1/0);else if(e){let n=this.boundingSphere.center;if(kr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Ar.setFromBufferAttribute(n),this.morphTargetsRelative?(jr.addVectors(kr.min,Ar.min),kr.expandByPoint(jr),jr.addVectors(kr.max,Ar.max),kr.expandByPoint(jr)):(kr.expandByPoint(Ar.min),kr.expandByPoint(Ar.max))}kr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)jr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(jr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)jr.fromBufferAttribute(a,t),o&&(Or.fromBufferAttribute(e,t),jr.add(Or)),r=Math.max(r,n.distanceToSquared(jr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&L(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){L(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new _r(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[],c=new Uint8Array(n.count);for(let e=0;e<n.count;e++)o[e]=new z,s[e]=new z;let l=new z,u=new z,d=new z,f=new R,p=new R,m=new R,h=new z,g=new z;function _(e,t,r){c[e]=c[t]=c[r]=1,l.fromBufferAttribute(n,e),u.fromBufferAttribute(n,t),d.fromBufferAttribute(n,r),f.fromBufferAttribute(i,e),p.fromBufferAttribute(i,t),m.fromBufferAttribute(i,r),u.sub(l),d.sub(l),p.sub(f),m.sub(f);let a=1/(p.x*m.y-m.x*p.y);isFinite(a)&&(h.copy(u).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(a),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(a),o[e].add(h),o[t].add(h),o[r].add(h),s[e].add(g),s[t].add(g),s[r].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let t=0,n=v.length;t<n;++t){let n=v[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)_(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let y=new z,b=new z,x=new z,S=new z;function C(e){x.fromBufferAttribute(r,e),S.copy(x);let t=o[e];y.copy(t),y.sub(x.multiplyScalar(x.dot(t))).normalize(),b.crossVectors(S,t);let n=b.dot(s[e])<0?-1:1;a.setXYZW(e,y.x,y.y,y.z,n)}for(let e=0,t=n.count;e<t;++e)c[e]&&C(e);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new _r(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new z,i=new z,a=new z,o=new z,s=new z,c=new z,l=new z,u=new z;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jr.fromBufferAttribute(e,t),jr.normalize(),e.setXYZ(t,jr.x,jr.y,jr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new _r(a,r,i)}if(this.index===null)return I(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Nr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=ct,this.updateRanges=[],this.version=0,this.uuid=wt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Pr(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),r=new this.constructor(n,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Pr(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function Pr(e){return e.buffer._uuid===void 0&&(e.buffer._uuid=wt()),e.byteOffset===0&&e.byteLength===e.buffer.byteLength?e.buffer._uuid:e.buffer._uuid+`:`+e.byteOffset+`:`+e.byteLength}var Fr=new z,Ir=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r,this._normalizationScale=e===void 0?void 0:kt(e.array)}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Fr.fromBufferAttribute(this,t),Fr.applyMatrix4(e),this.setXYZ(t,Fr.x,Fr.y,Fr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Fr.fromBufferAttribute(this,t),Fr.applyNormalMatrix(e),this.setXYZ(t,Fr.x,Fr.y,Fr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Fr.fromBufferAttribute(this,t),Fr.transformDirection(e),this.setXYZ(t,Fr.x,Fr.y,Fr.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){ht(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new _r(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ht(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t===void 0?At(e,this.data.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?jt(e,this.data.array):Math.round(e*t)}},Lr=new z,Rr=new z,zr=new B,Br=class{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Lr.subVectors(n,t).cross(Rr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Lr),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||zr.getNormalMatrix(e),r=this.coplanarPoint(Lr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Vr=0,Hr=class extends bt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vr++}),this.uuid=wt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new V(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ot,this.stencilZFail=ot,this.stencilZPass=ot,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){I(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?I(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new V().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Br().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new R().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new R().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Ur=class extends Hr{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new V(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Wr,Gr=new z,Kr=new z,qr=new z,Jr=new R,Yr=new R,Xr=new tn,Zr=new z,Qr=new z,$r=new z,ei=new R,ti=new R,ni=new R,ri=class extends kn{constructor(e=new Ur){if(super(),this.isSprite=!0,this.type=`Sprite`,Wr===void 0){Wr=new Mr;let e=new Nr(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);Wr.setIndex([0,1,2,0,2,3]),Wr.setAttribute(`position`,new Ir(e,3,0,!1)),Wr.setAttribute(`uv`,new Ir(e,2,3,!1))}this.geometry=Wr,this.material=e,this.center=new R(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&L(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),Kr.setFromMatrixScale(this.matrixWorld),Xr.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),qr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Kr.multiplyScalar(-qr.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;ii(Zr.set(-.5,-.5,0),qr,a,Kr,r,i),ii(Qr.set(.5,-.5,0),qr,a,Kr,r,i),ii($r.set(.5,.5,0),qr,a,Kr,r,i),ei.set(0,0),ti.set(1,0),ni.set(1,1);let o=e.ray.intersectTriangle(Zr,Qr,$r,!1,Gr);if(o===null&&(ii(Qr.set(-.5,.5,0),qr,a,Kr,r,i),ti.set(0,1),o=e.ray.intersectTriangle(Zr,$r,Qr,!1,Gr),o===null))return;let s=e.ray.origin.distanceTo(Gr);s<e.near||s>e.far||t.push({distance:s,point:Gr.clone(),uv:Qn.getInterpolation(Gr,Zr,Qr,$r,ei,ti,ni,new R),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function ii(e,t,n,r,i,a){Jr.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?Yr.copy(Jr):(Yr.x=a*Jr.x-i*Jr.y,Yr.y=i*Jr.x+a*Jr.y),e.copy(t),e.x+=Yr.x,e.y+=Yr.y,e.applyMatrix4(Xr)}var ai=new z,oi=new z,si=new z,ci=new z,li=class{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ai.copy(this.origin).addScaledVector(this.direction,t),ai.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){oi.copy(e).add(t).multiplyScalar(.5),si.copy(t).sub(e).normalize(),ci.copy(this.origin).sub(oi);let i=e.distanceTo(t)*.5,a=-this.direction.dot(si),o=ci.dot(this.direction),s=-ci.dot(si),c=ci.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(oi).addScaledVector(si,d),f}intersectSphere(e,t){if(e.radius<0)return null;ai.subVectors(e.center,this.origin);let n=ai.dot(this.direction),r=ai.dot(ai)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,ai)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,ee,O,k,A,te,ne;if(y>=b&&y>=x?(w=s,D=u,k=p,ne=g,s>=0?(S=c,C=l,T=d,E=f,ee=m,O=h,A=_,te=v):(S=l,C=c,T=f,E=d,ee=h,O=m,A=v,te=_)):b>=x?(w=c,D=d,k=m,ne=_,c>=0?(S=l,C=s,T=f,E=u,ee=h,O=p,A=v,te=g):(S=s,C=l,T=u,E=f,ee=p,O=h,A=g,te=v)):(w=l,D=f,k=h,ne=v,l>=0?(S=s,C=c,T=u,E=d,ee=p,O=m,A=g,te=_):(S=c,C=s,T=d,E=u,ee=m,O=p,A=_,te=g)),w===0)return null;let re=S/w,ie=C/w,ae=1/w,oe=T-re*D,se=E-ie*D,ce=ee-re*k,le=O-ie*k,j=A-re*ne,ue=te-ie*ne,de=j*le-ue*ce,fe=oe*ue-se*j,pe=ce*se-le*oe;if(r){if(de<0||fe<0||pe<0)return null}else if((de<0||fe<0||pe<0)&&(de>0||fe>0||pe>0))return null;let me=de+fe+pe;if(me===0)return null;let he=ae*(de*D+fe*k+pe*ne);return(me>0?he<0:he>0)?null:this.at(he/me,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ui=class extends Hr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new V(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},di=new tn,fi=new li,pi=new wr,mi=new z,hi=new z,gi=new z,_i=new z,vi=new z,yi=new z,bi=new z,xi=new z,H=class extends kn{constructor(e=new Mr,t=new ui){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){yi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(vi.fromBufferAttribute(s,e),a?yi.addScaledVector(vi,r):yi.addScaledVector(vi.sub(t),r))}t.add(yi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),pi.copy(n.boundingSphere),pi.applyMatrix4(i),fi.copy(e.ray).recast(e.near),pi.containsPoint(fi.origin)===!1&&(fi.intersectSphere(pi,mi)===null||fi.origin.distanceToSquared(mi)>(e.far-e.near)**2)||(di.copy(i).invert(),fi.copy(e.ray).applyMatrix4(di),(n.boundingBox===null||fi.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,fi)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Ci(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Ci(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Ci(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Ci(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Si(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;xi.copy(s),xi.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(xi);return l<n.near||l>n.far?null:{distance:l,point:xi.clone(),object:e}}function Ci(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,hi),e.getVertexPosition(c,gi),e.getVertexPosition(l,_i);let u=Si(e,t,n,r,hi,gi,_i,bi);if(u){let e=new z;Qn.getBarycoord(bi,hi,gi,_i,e),i&&(u.uv=Qn.getInterpolatedAttribute(i,s,c,l,e,new R)),a&&(u.uv1=Qn.getInterpolatedAttribute(a,s,c,l,e,new R)),o&&(u.normal=Qn.getInterpolatedAttribute(o,s,c,l,e,new z),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new z,materialIndex:0};Qn.getNormal(hi,gi,_i,t.normal),u.face=t,u.barycoord=e}return u}var wi=class extends Yt{constructor(e=null,t=1,n=1,r,i,a,o,s,c=y,l=y,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ti=class extends _r{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ei=new tn,Di=new tn,Oi=[],ki=new $n,Ai=new tn,ji=new H,Mi=new wr,Ni=class extends H{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ti(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Ai)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new $n),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ei),ki.copy(e.boundingBox).applyMatrix4(Ei),this.boundingBox.union(ki)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new wr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ei),Mi.copy(e.boundingSphere).applyMatrix4(Ei),this.boundingSphere.union(Mi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture===null?null:e.morphTexture.clone(),this.instanceColor=e.instanceColor===null?null:e.instanceColor.clone(),this.count=e.count,this.boundingBox=e.boundingBox===null?null:e.boundingBox.clone(),this.boundingSphere=e.boundingSphere===null?null:e.boundingSphere.clone(),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(ji.geometry=this.geometry,ji.material=this.material,ji.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Mi.copy(this.boundingSphere),Mi.applyMatrix4(n),e.ray.intersectsSphere(Mi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Ei),Di.multiplyMatrices(n,Ei),ji.matrixWorld=Di,ji.raycast(e,Oi);for(let e=0,n=Oi.length;e<n;e++){let n=Oi[e];n.instanceId=i,n.object=this,t.push(n)}Oi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ti(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new wi(new Float32Array(r*this.count),r,this.count,de,A));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Pi=new wr,Fi=new R(.5,.5),Ii=new z,Li=class{constructor(e=new Br,t=new Br,n=new Br,r=new Br,i=new Br,a=new Br){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=lt,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pi)}intersectsSprite(e){return Pi.center.set(0,0,0),Pi.radius=.7071067811865476+Fi.distanceTo(e.center),Pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ii.x=r.normal.x>0?e.max.x:e.min.x,Ii.y=r.normal.y>0?e.max.y:e.min.y,Ii.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ii)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Ri=new tn,zi=class e{constructor(){this.coordinateSystem=lt,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];Ri.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new Li),n[e].setFromProjectionMatrix(Ri,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new Li),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},Bi=class extends Hr{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new V(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Vi=new tn,Hi=new li,Ui=new wr,Wi=new z,Gi=class extends kn{constructor(e=new Mr,t=new Bi){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ui.copy(n.boundingSphere),Ui.applyMatrix4(r),Ui.radius+=i,e.ray.intersectsSphere(Ui)===!1)return;Vi.copy(r).invert(),Hi.copy(e.ray).applyMatrix4(Vi);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Wi.fromBufferAttribute(l,n),Ki(Wi,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Wi.fromBufferAttribute(l,a),Ki(Wi,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Ki(e,t,n,r,i,a,o){let s=Hi.distanceSqToPoint(e);if(s<n){let n=new z;Hi.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var qi=class extends Yt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ji=class extends Yt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Yi=class extends Yt{constructor(e,t,n=k,r,i,a,o=y,s=y,c,l=j,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Gt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Xi=class extends Yi{constructor(e,t=k,n=301,r,i,a=y,o=y,s,c=j){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Zi=class extends Yt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},U=class e extends Mr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new br(c,3)),this.setAttribute(`normal`,new br(l,3)),this.setAttribute(`uv`,new br(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new z;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Qi=class e extends Mr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new br(u,3)),this.setAttribute(`normal`,new br(d,3)),this.setAttribute(`uv`,new br(f,2));function _(){let a=new z,_=new z,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new R,m=new z,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},$i=class e extends Qi{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ea=class e extends Mr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new br(i,3)),this.setAttribute(`normal`,new br(i.slice(),3)),this.setAttribute(`uv`,new br(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new z,r=new z,i=new z;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new z;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new z;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new z,t=new z,n=new z,r=new z,o=new R,s=new R,c=new R;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},ta=class e extends ea{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},na=class e extends Mr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new br(p,3)),this.setAttribute(`normal`,new br(m,3)),this.setAttribute(`uv`,new br(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},ra=class e extends Mr{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new z,p=new R;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new br(s,3)),this.setAttribute(`normal`,new br(c,3)),this.setAttribute(`uv`,new br(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},ia=class e extends Mr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new z,d=new z,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new br(p,3)),this.setAttribute(`normal`,new br(m,3)),this.setAttribute(`uv`,new br(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},aa=class e extends Mr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new z,f=new z,p=new z;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new br(c,3)),this.setAttribute(`normal`,new br(l,3)),this.setAttribute(`uv`,new br(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function oa(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(ca(i))i.isRenderTargetTexture?(I(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(ca(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function sa(e){let t={};for(let n=0;n<e.length;n++){let r=oa(e[n]);for(let e in r)t[e]=r[e]}return t}function ca(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function la(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function ua(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:zt.workingColorSpace}var da={clone:oa,merge:sa},fa=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pa=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ma=class extends Hr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fa,this.fragmentShader=pa,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=oa(e.uniforms),this.uniformsGroups=la(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new V().setHex(r.value);break;case`v2`:this.uniforms[n].value=new R().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new z().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Xt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new B().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new tn().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},ha=class extends ma{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},W=class extends Hr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new V(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new V(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new R(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ga=class extends Hr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=tt,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},_a=class extends Hr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function va(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function ya(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var ba=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},xa=class extends ba{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Qe,endingEnd:Qe}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case $e:i=e,o=2*t-n;break;case et:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case $e:a=e,s=2*n-t;break;case et:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Sa=class extends ba{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Ca=class extends ba{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},wa=class extends ba{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Da(n,t,g,y,r);i[p]=Ta(x,o,_,b,m)}return i}};function Ta(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Ea(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Da(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Ta(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Ea(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Oa=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=va(t,this.TimeBufferType),this.values=va(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:va(e.times,Array),values:va(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),ya(e.settings)&&(n.settings={inTangents:va(e.settings.inTangents,Array),outTangents:va(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ca(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Sa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new xa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new wa(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Je:t=this.InterpolantFactoryMethodDiscrete;break;case Ye:t=this.InterpolantFactoryMethodLinear;break;case Xe:t=this.InterpolantFactoryMethodSmooth;break;case Ze:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return I(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Je;case this.InterpolantFactoryMethodLinear:return Ye;case this.InterpolantFactoryMethodSmooth:return Xe;case this.InterpolantFactoryMethodBezier:return Ze}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e;ya(this.settings)&&(ka(this.settings.inTangents,e),ka(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;ya(this.settings)&&(Aa(this.settings.inTangents,e),Aa(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(L(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(L(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){L(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){L(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&dt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){L(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Xe,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,ya(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function ka(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]+=t}function Aa(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Oa.prototype.ValueTypeName=``,Oa.prototype.TimeBufferType=Float32Array,Oa.prototype.ValueBufferType=Float32Array,Oa.prototype.DefaultInterpolation=Ye;var ja=class extends Oa{constructor(e,t,n){super(e,t,n)}};ja.prototype.ValueTypeName=`bool`,ja.prototype.ValueBufferType=Array,ja.prototype.DefaultInterpolation=Je,ja.prototype.InterpolantFactoryMethodLinear=void 0,ja.prototype.InterpolantFactoryMethodSmooth=void 0;var Ma=class extends Oa{constructor(e,t,n,r){super(e,t,n,r)}};Ma.prototype.ValueTypeName=`color`;var Na=class extends Oa{constructor(e,t,n,r){super(e,t,n,r)}};Na.prototype.ValueTypeName=`number`;var Pa=class extends ba{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Mt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Fa=class extends Oa{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Pa(this.times,this.values,this.getValueSize(),e)}};Fa.prototype.ValueTypeName=`quaternion`,Fa.prototype.InterpolantFactoryMethodSmooth=void 0;var Ia=class extends Oa{constructor(e,t,n){super(e,t,n)}};Ia.prototype.ValueTypeName=`string`,Ia.prototype.ValueBufferType=Array,Ia.prototype.DefaultInterpolation=Je,Ia.prototype.InterpolantFactoryMethodLinear=void 0,Ia.prototype.InterpolantFactoryMethodSmooth=void 0;var La=class extends Oa{constructor(e,t,n,r){super(e,t,n,r)}};La.prototype.ValueTypeName=`vector`;var Ra=class extends kn{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new V(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},za=class extends Ra{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(kn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new V(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Ba=new tn,Va=new z,Ha=new z,Ua=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new R(512,512),this.mapType=T,this.map=null,this.mapPass=null,this.matrix=new tn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Li,this._frameExtents=new R(1,1),this._viewportCount=1,this._viewports=[new Xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Va.setFromMatrixPosition(e.matrixWorld),t.position.copy(Va),Ha.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ha),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Ba.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Ba,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ba)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Wa=new z,Ga=new Mt,Ka=new z,qa=class extends kn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new tn,this.projectionMatrix=new tn,this.projectionMatrixInverse=new tn,this.coordinateSystem=lt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Wa,Ga,Ka),Ka.x===1&&Ka.y===1&&Ka.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Wa,Ga,Ka.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Wa,Ga,Ka),Ka.x===1&&Ka.y===1&&Ka.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Wa,Ga,Ka.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ja=new z,Ya=new R,Xa=new R,Za=class extends qa{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ct*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(St*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ct*2*Math.atan(Math.tan(St*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ja.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ja.x,Ja.y).multiplyScalar(-e/Ja.z),Ja.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ja.x,Ja.y).multiplyScalar(-e/Ja.z)}getViewSize(e,t){return this.getViewBounds(e,Ya,Xa),t.subVectors(Xa,Ya)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(St*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Qa=class extends Ua{constructor(){super(new Za(90,1,.5,500)),this.isPointLightShadow=!0}},$a=class extends Ra{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new Qa}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},eo=class extends qa{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},to=class extends Ua{constructor(){super(new eo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},no=class extends Ra{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(kn.DEFAULT_UP),this.updateMatrix(),this.target=new kn,this.shadow=new to}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ro=-90,io=1,ao=class extends kn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Za(ro,io,e,t);r.layers=this.layers,this.add(r);let i=new Za(ro,io,e,t);i.layers=this.layers,this.add(i);let a=new Za(ro,io,e,t);a.layers=this.layers,this.add(a);let o=new Za(ro,io,e,t);o.layers=this.layers,this.add(o);let s=new Za(ro,io,e,t);s.layers=this.layers,this.add(s);let c=new Za(ro,io,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},oo=class extends Za{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},so=`\\[\\]\\.:\\/`,co=RegExp(`[\\[\\]\\.:\\/]`,`g`),lo=`[^\\[\\]\\.:\\/]`,uo=`[^`+so.replace(`\\.`,``)+`]`,fo=`((?:WC+[\\/:])*)`.replace(`WC`,lo),po=`(WCOD+)?`.replace(`WCOD`,uo),mo=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,lo),ho=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,lo),go=RegExp(`^`+fo+po+mo+ho+`$`),_o=[`material`,`materials`,`bones`,`map`],vo=class{constructor(e,t,n){let r=n||yo.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},yo=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(co,``)}static parseTrackName(e){let t=go.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);_o.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){I(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){L(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){L(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){L(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){L(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){L(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){L(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){L(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;L(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){L(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){L(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};yo.Composite=vo,yo.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},yo.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},yo.prototype.GetterByBindingType=[yo.prototype._getValue_direct,yo.prototype._getValue_array,yo.prototype._getValue_arrayElement,yo.prototype._getValue_toArray],yo.prototype.SetterByBindingTypeAndVersioning=[[yo.prototype._setValue_direct,yo.prototype._setValue_direct_setNeedsUpdate,yo.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[yo.prototype._setValue_array,yo.prototype._setValue_array_setNeedsUpdate,yo.prototype._setValue_array_setMatrixWorldNeedsUpdate],[yo.prototype._setValue_arrayElement,yo.prototype._setValue_arrayElement_setNeedsUpdate,yo.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[yo.prototype._setValue_fromArray,yo.prototype._setValue_fromArray_setNeedsUpdate,yo.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var bo=new tn,xo=class{constructor(e,t,n=0,r=1/0){this.ray=new li(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new pn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):L(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return bo.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(bo),this}intersectObject(e,t=!0,n=[]){return Co(e,this,n,t),n.sort(So),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Co(e[r],this,n,t);return n.sort(So),n}};function So(e,t){return e.distance-t.distance}function Co(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Co(r[e],t,n,!0)}}(class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});function wo(e,t,n,r){let i=To(r);switch(n){case se:return e*t;case de:return e*t/i.components*i.byteLength;case fe:return e*t/i.components*i.byteLength;case pe:return e*t*2/i.components*i.byteLength;case me:return e*t*2/i.components*i.byteLength;case ce:return e*t*3/i.components*i.byteLength;case le:return e*t*4/i.components*i.byteLength;case he:return e*t*4/i.components*i.byteLength;case ge:case _e:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ve:case ye:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case xe:case Ce:return Math.max(e,16)*Math.max(t,8)/4;case be:case Se:return Math.max(e,8)*Math.max(t,8)/2;case we:case Te:case De:case Oe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Ee:case ke:case Ae:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case je:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Me:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Ne:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Pe:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Fe:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Ie:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Le:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case M:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Re:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case ze:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Be:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case N:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ve:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case P:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case F:case He:case Ue:return Math.ceil(e/4)*Math.ceil(t/4)*16;case We:case Ge:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Ke:case qe:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function To(e){switch(e){case T:case E:return{byteLength:1,components:1};case ee:case D:case te:return{byteLength:2,components:1};case ne:case re:return{byteLength:2,components:4};case k:case O:case A:return{byteLength:4,components:1};case ae:case oe:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`187`}})),typeof window<`u`&&(window.__THREE__?I(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`187`);function Eo(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Do(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var G={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},K={common:{diffuse:{value:new V(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new B},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new B}},envmap:{envMap:{value:null},envMapRotation:{value:new B},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new B}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new B}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new B},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new B},normalScale:{value:new R(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new B},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new B}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new B}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new B}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new V(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new V(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0},uvTransform:{value:new B}},sprite:{diffuse:{value:new V(16777215)},opacity:{value:1},center:{value:new R(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new B},alphaMap:{value:null},alphaMapTransform:{value:new B},alphaTest:{value:0}}},Oo={basic:{uniforms:sa([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.fog]),vertexShader:G.meshbasic_vert,fragmentShader:G.meshbasic_frag},lambert:{uniforms:sa([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new V(0)},envMapIntensity:{value:1}}]),vertexShader:G.meshlambert_vert,fragmentShader:G.meshlambert_frag},phong:{uniforms:sa([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new V(0)},specular:{value:new V(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:G.meshphong_vert,fragmentShader:G.meshphong_frag},standard:{uniforms:sa([K.common,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.roughnessmap,K.metalnessmap,K.fog,K.lights,{emissive:{value:new V(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:G.meshphysical_vert,fragmentShader:G.meshphysical_frag},toon:{uniforms:sa([K.common,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.gradientmap,K.fog,K.lights,{emissive:{value:new V(0)}}]),vertexShader:G.meshtoon_vert,fragmentShader:G.meshtoon_frag},matcap:{uniforms:sa([K.common,K.bumpmap,K.normalmap,K.displacementmap,K.fog,{matcap:{value:null}}]),vertexShader:G.meshmatcap_vert,fragmentShader:G.meshmatcap_frag},points:{uniforms:sa([K.points,K.fog]),vertexShader:G.points_vert,fragmentShader:G.points_frag},dashed:{uniforms:sa([K.common,K.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:G.linedashed_vert,fragmentShader:G.linedashed_frag},depth:{uniforms:sa([K.common,K.displacementmap]),vertexShader:G.depth_vert,fragmentShader:G.depth_frag},normal:{uniforms:sa([K.common,K.bumpmap,K.normalmap,K.displacementmap,{opacity:{value:1}}]),vertexShader:G.meshnormal_vert,fragmentShader:G.meshnormal_frag},sprite:{uniforms:sa([K.sprite,K.fog]),vertexShader:G.sprite_vert,fragmentShader:G.sprite_frag},background:{uniforms:{uvTransform:{value:new B},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:G.background_vert,fragmentShader:G.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new B}},vertexShader:G.backgroundCube_vert,fragmentShader:G.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:G.cube_vert,fragmentShader:G.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:G.equirect_vert,fragmentShader:G.equirect_frag},distance:{uniforms:sa([K.common,K.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:G.distance_vert,fragmentShader:G.distance_frag},shadow:{uniforms:sa([K.lights,K.fog,{color:{value:new V(0)},opacity:{value:1}}]),vertexShader:G.shadow_vert,fragmentShader:G.shadow_frag}};Oo.physical={uniforms:sa([Oo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new B},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new B},clearcoatNormalScale:{value:new R(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new B},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new B},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new B},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new B},sheen:{value:0},sheenColor:{value:new V(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new B},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new B},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new B},transmissionSamplerSize:{value:new R},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new B},attenuationDistance:{value:0},attenuationColor:{value:new V(0)},specularColor:{value:new V(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new B},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new B},anisotropyVector:{value:new R},anisotropyMap:{value:null},anisotropyMapTransform:{value:new B}}]),vertexShader:G.meshphysical_vert,fragmentShader:G.meshphysical_frag};var ko={r:0,b:0,g:0},Ao=new tn,jo=new B;jo.set(-1,0,0,0,1,0,0,0,1);function Mo(e,t,n,r,i,a){let o=new V(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&i.isCubeTexture?(l===void 0&&(l=new H(new U(1,1,1),new ma({name:`BackgroundCubeMaterial`,uniforms:oa(Oo.backgroundCube.uniforms),vertexShader:Oo.backgroundCube.vertexShader,fragmentShader:Oo.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Ao.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(jo),l.material.toneMapped=zt.getTransfer(i.colorSpace)!==at,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new H(new na(2,2),new ma({name:`BackgroundMaterial`,uniforms:oa(Oo.background.uniforms),vertexShader:Oo.background.vertexShader,fragmentShader:Oo.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=zt.getTransfer(i.colorSpace)!==at,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(ko,ua(e)),n.buffers.color.setClear(ko.r,ko.g,ko.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function No(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Po(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Fo(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(I(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&I(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&I(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Io(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Br,s=new B,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Lo=class extends Qt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new qi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new U(5,5,5),i=new ma({name:`CubemapFromEquirect`,uniforms:oa(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new H(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=S),new ao(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},Ro=256,zo=3,Bo=20,Vo=256,Ho=16,Uo=3,Wo=new z,Go=new V,Ko=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new ao(1,10,null),this._boxMesh=new H(new U(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Wo}=i,s=this._renderer;this._setSize(a);let c=this._allocateTarget(),l=this._getSourceTarget(!0);t>0&&(l.texture.mipmapsAutoUpdate=!1);let u=s.autoClear,d=s.autoClearColor,f=s.autoClearDepth,p=s.autoClearStencil,m=e.background;s.autoClear=!0,s.autoClearColor=!0,s.autoClearDepth=!0,s.autoClearStencil=!0,m===null&&(e.background=s.getClearColor(Go));let h=new ao(n,r,l);return h.position.copy(o),h.update(s,e),s.autoClear=u,s.autoClearColor=d,s.autoClearDepth=f,s.autoClearStencil=p,e.background=m,t>0&&(l.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$o(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Ro,Ot(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?Ro:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=qo(e,!1,!1),n=Math.log2(e)-zo;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=qo(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=$o()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Qo()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Yo(),this._integrationMaterial=Xo());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/Ho);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-Uo)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(Vo*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Zo());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function qo(e,t,n){return new Lo(e,{minFilter:w,generateMipmaps:t,type:te,colorSpace:rt,depthBuffer:n})}function Jo(e,t,n){return new ma({name:e,uniforms:t,vertexShader:G.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function Yo(){return Jo(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Vo}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Xo(){return Jo(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Ho}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Zo(){return Jo(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Bo}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Qo(){return Jo(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function $o(){return Jo(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function es(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Lo(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Ko(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Ko(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function ts(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&_t(`WebGLRenderer: `+e+` extension not supported.`),t}}}function ns(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?yr:vr)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function rs(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function is(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:L(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function as(e,t,n){let r=new WeakMap,i=new Xt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new $t(h,p,m,u);g.type=A,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new R(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function os(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var ss={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function cs(e,t,n,r,i,a){let o=new Qt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=null,u=new Mr;u.setAttribute(`position`,new br([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new br([0,2,0,0,2,0],2));let d=new ha({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new H(u,d),p=new eo(-1,1,1,-1,0,1),m=null,h=null,g=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new Qt(t,n,{type:te,depthBuffer:!1,stencilBuffer:!1}),c=new Qt(t,n,{type:te,depthBuffer:!1,stencilBuffer:!1}));let r=i===!0&&y.some(e=>e.needsDepthTexture===!0);r!==(o.depthTexture!==null)&&(r===!0&&l===null&&(l=new Yi(t,n),a===!0&&(l.format=ue,l.type=ie)),o.dispose(),o.depthTexture=r?l:null,o.resolveDepthBuffer=r,o.storeMultisampledDepthBuffer=r);for(let e=0;e<y.length;e++){let i=y[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(l)}},this.begin=function(e,t){if(g||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,g=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},zt.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=ss[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(f,p),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var ls=new Yt,us=new Yi(1,1),ds=new Xi(1),fs=new $t,ps=new en,ms=new qi,hs=[],gs=[],_s=new Float32Array(16),vs=new Float32Array(9),ys=new Float32Array(4);function bs(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=hs[i];if(a===void 0&&(a=new Float32Array(i),hs[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function xs(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Ss(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Cs(e,t){let n=gs[t];n===void 0&&(n=new Int32Array(t),gs[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function ws(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Ts(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(xs(n,t))return;e.uniform2fv(this.addr,t),Ss(n,t)}}function Es(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(xs(n,t))return;e.uniform3fv(this.addr,t),Ss(n,t)}}function Ds(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(xs(n,t))return;e.uniform4fv(this.addr,t),Ss(n,t)}}function Os(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(xs(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ss(n,t)}else{if(xs(n,r))return;ys.set(r),e.uniformMatrix2fv(this.addr,!1,ys),Ss(n,r)}}function ks(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(xs(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ss(n,t)}else{if(xs(n,r))return;vs.set(r),e.uniformMatrix3fv(this.addr,!1,vs),Ss(n,r)}}function As(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(xs(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ss(n,t)}else{if(xs(n,r))return;_s.set(r),e.uniformMatrix4fv(this.addr,!1,_s),Ss(n,r)}}function js(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Ms(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(xs(n,t))return;e.uniform2iv(this.addr,t),Ss(n,t)}}function Ns(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(xs(n,t))return;e.uniform3iv(this.addr,t),Ss(n,t)}}function Ps(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(xs(n,t))return;e.uniform4iv(this.addr,t),Ss(n,t)}}function Fs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Is(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(xs(n,t))return;e.uniform2uiv(this.addr,t),Ss(n,t)}}function Ls(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(xs(n,t))return;e.uniform3uiv(this.addr,t),Ss(n,t)}}function Rs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(xs(n,t))return;e.uniform4uiv(this.addr,t),Ss(n,t)}}function zs(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function Bs(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?zs(us):ls,n.setTexture2D(t||a,i)}function Vs(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||ps,i)}function Hs(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?zs(ds):ms,n.setTextureCube(t||a,i)}function Us(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||fs,i)}function Ws(e){switch(e){case 5126:return ws;case 35664:return Ts;case 35665:return Es;case 35666:return Ds;case 35674:return Os;case 35675:return ks;case 35676:return As;case 5124:case 35670:return js;case 35667:case 35671:return Ms;case 35668:case 35672:return Ns;case 35669:case 35673:return Ps;case 5125:return Fs;case 36294:return Is;case 36295:return Ls;case 36296:return Rs;case 35678:case 36198:case 36298:case 36306:case 35682:return Bs;case 35679:case 36299:case 36307:return Vs;case 35680:case 36300:case 36308:case 36293:return Hs;case 36289:case 36303:case 36311:case 36292:return Us}}function Gs(e,t){e.uniform1fv(this.addr,t)}function Ks(e,t){let n=bs(t,this.size,2);e.uniform2fv(this.addr,n)}function qs(e,t){let n=bs(t,this.size,3);e.uniform3fv(this.addr,n)}function Js(e,t){let n=bs(t,this.size,4);e.uniform4fv(this.addr,n)}function Ys(e,t){let n=bs(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Xs(e,t){let n=bs(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Zs(e,t){let n=bs(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Qs(e,t){e.uniform1iv(this.addr,t)}function $s(e,t){e.uniform2iv(this.addr,t)}function ec(e,t){e.uniform3iv(this.addr,t)}function tc(e,t){e.uniform4iv(this.addr,t)}function nc(e,t){e.uniform1uiv(this.addr,t)}function rc(e,t){e.uniform2uiv(this.addr,t)}function ic(e,t){e.uniform3uiv(this.addr,t)}function ac(e,t){e.uniform4uiv(this.addr,t)}function oc(e,t,n){let r=this.cache,i=t.length,a=Cs(n,i);xs(r,a)||(e.uniform1iv(this.addr,a),Ss(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?zs(us):ls;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function sc(e,t,n){let r=this.cache,i=t.length,a=Cs(n,i);xs(r,a)||(e.uniform1iv(this.addr,a),Ss(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||ps,a[e])}function cc(e,t,n){let r=this.cache,i=t.length,a=Cs(n,i);xs(r,a)||(e.uniform1iv(this.addr,a),Ss(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?zs(ds):ms;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function lc(e,t,n){let r=this.cache,i=t.length,a=Cs(n,i);xs(r,a)||(e.uniform1iv(this.addr,a),Ss(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||fs,a[e])}function uc(e){switch(e){case 5126:return Gs;case 35664:return Ks;case 35665:return qs;case 35666:return Js;case 35674:return Ys;case 35675:return Xs;case 35676:return Zs;case 5124:case 35670:return Qs;case 35667:case 35671:return $s;case 35668:case 35672:return ec;case 35669:case 35673:return tc;case 5125:return nc;case 36294:return rc;case 36295:return ic;case 36296:return ac;case 35678:case 36198:case 36298:case 36306:case 35682:return oc;case 35679:case 36299:case 36307:return sc;case 35680:case 36300:case 36308:case 36293:return cc;case 36289:case 36303:case 36311:case 36292:return lc}}var dc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ws(t.type)}},fc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=uc(t.type)}},pc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},mc=/(\w+)(\])?(\[|\.)?/g;function hc(e,t){e.seq.push(t),e.map[t.id]=t}function gc(e,t,n){let r=e.name,i=r.length;for(mc.lastIndex=0;;){let a=mc.exec(r),o=mc.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){hc(n,l===void 0?new dc(s,e,t):new fc(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new pc(s),hc(n,e)),n=e}}}var _c=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);gc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function vc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var yc=37297,bc=0;function xc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Sc=new B;function Cc(e){zt._getMatrix(Sc,zt.workingColorSpace,e);let t=`mat3( ${Sc.elements.map(e=>e.toFixed(4))} )`;switch(zt.getTransfer(e)){case it:return[t,`LinearTransferOETF`];case at:return[t,`sRGBTransferOETF`];default:return I(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function wc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+xc(e.getShaderSource(t),r)}return i}function Tc(e,t){let n=Cc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var Ec={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Dc(e,t){let n=Ec[t];return n===void 0?(I(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Oc=new z;function kc(){return zt.getLuminanceCoefficients(Oc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Oc.x.toFixed(4)}, ${Oc.y.toFixed(4)}, ${Oc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Ac(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Nc).join(`
`)}function jc(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Mc(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Nc(e){return e!==``}function Pc(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Fc(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Ic=/^[ \t]*#include +<([\w\d./]+)>/gm;function Lc(e){return e.replace(Ic,Rc)}function Rc(e,t){let n=G[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return Lc(n)}var zc=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bc(e){return e.replace(zc,Vc)}function Vc(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Hc(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Uc={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Wc(e){return Uc[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Gc={302:`ENVMAP_MODE_REFRACTION`};function Kc(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Gc[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var qc={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Jc(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:qc[e.combine]||`ENVMAP_BLENDING_NONE`}function Yc(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Wc(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=Kc(n),d=Jc(n),f=Ac(n),p=jc(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(Nc).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(Nc).join(`
`),g.length>0&&(g+=`
`)):(h=[Hc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Nc).join(`
`),g=[Hc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:G.tonemapping_pars_fragment,n.toneMapping===0?``:Dc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,G.colorspace_pars_fragment,Tc(`linearToOutputTexel`,n.outputColorSpace),kc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Nc).join(`
`)),o=Lc(o),o=Pc(o,n),o=Fc(o,n),s=Lc(s),s=Pc(s,n),s=Fc(s,n),o=Bc(o),s=Bc(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=vc(i,i.VERTEX_SHADER,v),x=vc(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=wc(i,b,`vertex`),n=wc(i,x,`fragment`);L(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):I(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new _c(i,m),w=Mc(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,yc)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=bc++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var Xc=0,Zc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Qc(e),t.set(e,n)),n}},Qc=class{constructor(e){this.id=Xc++,this.code=e,this.usedTimes=0}};function $c(e){return e===1030||e===37490||e===36285}function el(e,t,n,r,i,a){let o=new pn,s=new Zc,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&I(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,ee,O;if(x){let e=Oo[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),ee=e.id,O=t.id}let k=e.getRenderTarget(),A=e.state.buffers.depth.getReversed(),te=m.isInstancedMesh===!0,ne=m.isBatchedMesh===!0,re=!!i.map,ie=!!i.matcap,ae=!!b,oe=ae&&b.isPMREMTexture===!0,se=!!i.aoMap,ce=!!i.lightMap,le=!!i.bumpMap&&i.wireframe===!1,j=!!i.normalMap,ue=!!i.displacementMap,de=!!i.emissiveMap,fe=!!i.metalnessMap,pe=!!i.roughnessMap,me=i.anisotropy>0,he=i.clearcoat>0,ge=i.diffuseRoughness>0,_e=i.dispersion>0,ve=i.retroreflectivity>0,ye=i.iridescence>0,be=i.sheen>0,xe=i.transmission>0,Se=me&&!!i.anisotropyMap,Ce=he&&!!i.clearcoatMap,we=he&&!!i.clearcoatNormalMap,Te=he&&!!i.clearcoatRoughnessMap,Ee=ge&&!!i.diffuseRoughnessMap,De=ye&&!!i.iridescenceMap,Oe=ye&&!!i.iridescenceThicknessMap,ke=be&&!!i.sheenColorMap,Ae=be&&!!i.sheenRoughnessMap,je=!!i.specularMap,Me=!!i.specularColorMap,Ne=!!i.specularIntensityMap,Pe=xe&&!!i.transmissionMap,Fe=xe&&!!i.thicknessMap,Ie=!!i.gradientMap,Le=!!i.alphaMap,M=i.alphaTest>0,Re=!!i.alphaHash,ze=!!i.extensions,Be=0;i.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(Be=e.toneMapping);let N=oe?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,Ve={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:ee,customFragmentShaderID:O,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:ne,batchingColor:ne&&m._colorsTexture!==null,instancing:te,instancingColor:te&&m.instanceColor!==null,instancingMorph:te&&m.morphTexture!==null,outputColorSpace:k===null?e.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:zt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:re,matcap:ie,envMap:ae,envMapMode:ae&&b.mapping,envMapPMREM:oe,envMapMaxLod:oe?N.length-1:null,envMapSize:oe?N[0].width:null,aoMap:se,lightMap:ce,bumpMap:le,normalMap:j,displacementMap:ue,emissiveMap:de,normalMapObjectSpace:j&&i.normalMapType===1,normalMapTangentSpace:j&&i.normalMapType===0,packedNormalMap:j&&i.normalMapType===0&&$c(i.normalMap.format),metalnessMap:fe,roughnessMap:pe,anisotropy:me,anisotropyMap:Se,clearcoat:he,clearcoatMap:Ce,clearcoatNormalMap:we,clearcoatRoughnessMap:Te,diffuseRoughness:ge,diffuseRoughnessMap:Ee,dispersion:_e,retroreflection:ve,iridescence:ye,iridescenceMap:De,iridescenceThicknessMap:Oe,sheen:be,sheenColorMap:ke,sheenRoughnessMap:Ae,specularMap:je,specularColorMap:Me,specularIntensityMap:Ne,transmission:xe,transmissionMap:Pe,thicknessMap:Fe,gradientMap:Ie,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Le,alphaTest:M,alphaHash:Re,combine:i.combine,mapUv:re&&p(i.map.channel),aoMapUv:se&&p(i.aoMap.channel),lightMapUv:ce&&p(i.lightMap.channel),bumpMapUv:le&&p(i.bumpMap.channel),normalMapUv:j&&p(i.normalMap.channel),displacementMapUv:ue&&p(i.displacementMap.channel),emissiveMapUv:de&&p(i.emissiveMap.channel),metalnessMapUv:fe&&p(i.metalnessMap.channel),roughnessMapUv:pe&&p(i.roughnessMap.channel),anisotropyMapUv:Se&&p(i.anisotropyMap.channel),clearcoatMapUv:Ce&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:we&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:Ee&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:De&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:Oe&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:ke&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&p(i.sheenRoughnessMap.channel),specularMapUv:je&&p(i.specularMap.channel),specularColorMapUv:Me&&p(i.specularColorMap.channel),specularIntensityMapUv:Ne&&p(i.specularIntensityMap.channel),transmissionMapUv:Pe&&p(i.transmissionMap.channel),thicknessMapUv:Fe&&p(i.thicknessMap.channel),alphaMapUv:Le&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(j||me),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(re||Le),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&j===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:A,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Be,decodeVideoTexture:re&&i.map.isVideoTexture===!0&&zt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:de&&i.emissiveMap.isVideoTexture===!0&&zt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:ze&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(ze&&i.extensions.multiDraw===!0||ne)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ve.vertexUv1s=c.has(1),Ve.vertexUv2s=c.has(2),Ve.vertexUv3s=c.has(3),c.clear(),Ve}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=Oo[t];n=da.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new Yc(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function tl(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function nl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function rl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function il(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||nl),r.length>1&&r.sort(t||rl),i.length>1&&i.sort(t||rl)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function al(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new il,e.set(t,[i])):n>=r.length?(i=new il,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function ol(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new z,color:new V};break;case`SpotLight`:n={position:new z,direction:new z,color:new V,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new z,color:new V,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new z,skyColor:new V,groundColor:new V};break;case`RectAreaLight`:n={color:new V,position:new z,halfWidth:new z,halfHeight:new z}}return e[t.id]=n,n}}}function sl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new R,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var cl=0;function ll(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function ul(e){let t=new ol,n=sl(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new z);let i=new z,a=new tn,o=new tn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(ll);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=K.LTC_FLOAT_1,r.rectAreaLTC2=K.LTC_FLOAT_2):(r.rectAreaLTC1=K.LTC_HALF_1,r.rectAreaLTC2=K.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=cl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function dl(e){let t=new ul(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function fl(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new dl(e),t.set(n,[a])):r>=i.length?(a=new dl(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var pl=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ml=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,hl=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],gl=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],_l=new tn,vl=new z,yl=new z;function bl(e,t,n){let r=new Li,i=new R,a=new R,o=new Xt,s=new ga,c=new _a,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new ma({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new R},radius:{value:4}},vertexShader:pl,fragmentShader:ml}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Mr;m.setAttribute(`position`,new _r(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new H(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(I(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){I(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){I(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Qt(i.x,i.y,{format:pe,type:te,minFilter:S,magFilter:S,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Yi(i.x,i.y,A),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=j,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=y,d.map.depthTexture.magFilter=y}else l.isPointLight?(d.map=new Lo(i.x),d.map.depthTexture=new Xi(i.x,k)):(d.map=new Qt(i.x,i.y),d.map.depthTexture=new Yi(i.x,i.y,k)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=j,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=S,d.map.depthTexture.magFilter=S):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=y,d.map.depthTexture.magFilter=y);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);let _=d.camera.layers.mask&4294967294?d.camera.layers:s.layers;for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),vl.setFromMatrixPosition(l.matrixWorld),e.position.copy(vl),yl.copy(e.position),yl.add(hl[t]),e.up.copy(gl[t]),e.lookAt(yl),e.updateMatrixWorld(),n.makeTranslation(-vl.x,-vl.y,-vl.z),_l.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(_l,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),x(n,s,i,l,_,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new Qt(i.x,i.y,{format:pe,type:te}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function b(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,C)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function x(n,i,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),s=n.material;if(Array.isArray(s)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=b(n,d,o,c);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(s.visible){let t=b(n,s,o,c);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)x(l[e],i,a,o,s,c)}function C(e){e.target.removeEventListener(`dispose`,C);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function xl(e,t){function n(){let t=!1,n=new Xt,r=null,i=new Xt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?fe(e.DEPTH_TEST):pe(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=yt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?fe(e.STENCIL_TEST):pe(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new V(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,A=null,te=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ne=!1,re=0,ie=e.getParameter(e.VERSION);ie.indexOf(`WebGL`)===-1?ie.indexOf(`OpenGL ES`)!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),ne=re>=2):(re=parseFloat(/^WebGL (\d)/.exec(ie)[1]),ne=re>=1);let ae=null,oe={},se=e.getParameter(e.SCISSOR_BOX),ce=e.getParameter(e.VIEWPORT),le=new Xt().fromArray(se),j=new Xt().fromArray(ce);function ue(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let de={};de[e.TEXTURE_2D]=ue(e.TEXTURE_2D,e.TEXTURE_2D,1),de[e.TEXTURE_CUBE_MAP]=ue(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),de[e.TEXTURE_2D_ARRAY]=ue(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),de[e.TEXTURE_3D]=ue(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),fe(e.DEPTH_TEST),o.setFunc(3),xe(!1),Se(1),fe(e.CULL_FACE),ye(0);function fe(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function pe(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function me(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function he(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function ge(t){return h!==t&&(e.useProgram(t),h=t,!0)}let _e={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};_e[103]=e.MIN,_e[104]=e.MAX;let ve={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ye(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(pe(e.BLEND),g=!1);else if(g===!1&&(fe(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:L(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:L(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:L(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:L(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(_e[n],_e[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ve[r],ve[i],ve[o],ve[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function be(t,n){t.side===2?pe(e.CULL_FACE):fe(e.CULL_FACE);let r=t.side===1;n&&(r=!r),xe(r),t.blending===1&&t.transparent===!1?ye(0):ye(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),we(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?fe(e.SAMPLE_ALPHA_TO_COVERAGE):pe(e.SAMPLE_ALPHA_TO_COVERAGE)}function xe(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function Se(t){t===0?pe(e.CULL_FACE):(fe(e.CULL_FACE),t!==ee&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),ee=t}function Ce(t){t!==O&&(ne&&e.lineWidth(t),O=t)}function we(t,n,r){t?(fe(e.POLYGON_OFFSET_FILL),(k!==n||A!==r)&&(k=n,A=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):pe(e.POLYGON_OFFSET_FILL)}function Te(t){t?fe(e.SCISSOR_TEST):pe(e.SCISSOR_TEST)}function Ee(t){t===void 0&&(t=e.TEXTURE0+te-1),ae!==t&&(e.activeTexture(t),ae=t)}function De(t,n,r){r===void 0&&(r=ae===null?e.TEXTURE0+te-1:ae);let i=oe[r];i===void 0&&(i={type:void 0,texture:void 0},oe[r]=i),(i.type!==t||i.texture!==n)&&(ae!==r&&(e.activeTexture(r),ae=r),e.bindTexture(t,n||de[t]),i.type=t,i.texture=n)}function Oe(){let t=oe[ae];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function ke(){try{e.compressedTexImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Ae(){try{e.compressedTexImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function je(){try{e.texSubImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Me(){try{e.texSubImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Ne(){try{e.compressedTexSubImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Pe(){try{e.compressedTexSubImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Fe(){try{e.texStorage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Ie(){try{e.texStorage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Le(){try{e.texImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function M(){try{e.texImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Re(t){return d[t]===void 0?e.getParameter(t):d[t]}function ze(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Be(t){le.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),le.copy(t))}function N(t){j.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),j.copy(t))}function Ve(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function P(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function F(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},ae=null,oe={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new V(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,A=null,le.set(0,0,e.canvas.width,e.canvas.height),j.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:fe,disable:pe,bindFramebuffer:me,drawBuffers:he,useProgram:ge,setBlending:ye,setMaterial:be,setFlipSided:xe,setCullFace:Se,setLineWidth:Ce,setPolygonOffset:we,setScissorTest:Te,activeTexture:Ee,bindTexture:De,unbindTexture:Oe,compressedTexImage2D:ke,compressedTexImage3D:Ae,texImage2D:Le,texImage3D:M,pixelStorei:ze,getParameter:Re,updateUBOMapping:Ve,uniformBlockBinding:P,texStorage2D:Fe,texStorage3D:Ie,texSubImage2D:je,texSubImage3D:Me,compressedTexSubImage2D:Ne,compressedTexSubImage3D:Pe,scissor:Be,viewport:N,reset:F}}function Sl(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new R,u=new WeakMap,d=new Set,f,p=new WeakMap,m=new Set,h=new FinalizationRegistry(e=>m.delete(e)),T=!1;try{T=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function E(e,t){return T?new OffscreenCanvas(e,t):ft(`canvas`)}function D(e,t,n){let r=1,i=F(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=E(n,a));let o=t?E(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),I(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&I(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function ee(e){return e.generateMipmaps}function O(t){e.generateMipmap(t)}function k(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function A(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];I(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||I(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?it:zt.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function te(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,I(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function ne(e,t){return ee(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function re(e){let t=new WeakRef(e);r.get(e).__ref=t,m.add(t),h.register(e,t,t)}function ie(e){let t=r.get(e).__ref;t!==void 0&&(m.delete(t),h.unregister(t))}function ae(e){se(e.target)}function oe(e){ce(e.target)}function se(e){e.removeEventListener(`dispose`,ae),ie(e),j(e),e.isVideoTexture&&u.delete(e),e.isHTMLTexture&&d.delete(e)}function ce(e){e.removeEventListener(`dispose`,oe),ie(e),fe(e)}function le(){for(let e of m){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?ce(t):se(t))}m.clear(),d.clear()}function j(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&de(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function de(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function fe(t){let n=r.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();let i=t.depthTexture;if(i&&i.renderTarget===t&&se(i),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let a=t.textures;for(let t=0,n=a.length;t<n;t++){let n=r.get(a[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(a[t])}r.remove(t)}let pe=0;function me(){pe=0}function he(){return pe}function ge(e){pe=e}function _e(){let e=pe;return e>=i.maxTextures&&I(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),pe+=1,e}function ve(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ye(t,i){let a=r.get(t);if(t.isVideoTexture&&Ve(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)I(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)I(`WebGLRenderer: Texture marked for update but image is incomplete`);else{Ae(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function be(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?Ae(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function xe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?Ae(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function Se(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?je(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let Ce={[g]:e.REPEAT,[_]:e.CLAMP_TO_EDGE,[v]:e.MIRRORED_REPEAT},we={[y]:e.NEAREST,[b]:e.NEAREST_MIPMAP_NEAREST,[x]:e.NEAREST_MIPMAP_LINEAR,[S]:e.LINEAR,[C]:e.LINEAR_MIPMAP_NEAREST,[w]:e.LINEAR_MIPMAP_LINEAR},Te={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function Ee(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&I(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,Ce[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,Ce[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,Ce[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,we[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,we[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,Te[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function De(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,ae),re(n));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=ve(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&de(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function Oe(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ke(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=Oe(n.start,r.width,4),c=Oe(t.start,r.width,4);n.start<=i+1&&a===c&&Oe(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function Ae(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=De(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=zt.getPrimaries(zt.workingColorSpace),r=o.colorSpace===``?null:zt.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=D(o.image,!1,i.maxTextureSize);t=P(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=A(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);Ee(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,v=f.__version===void 0||l===!0,y=u.dataReady,b=ne(o,t);if(o.isDepthTexture)m=te(o.format===ue,o.type),v&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&v&&n.texStorage2D(e.TEXTURE_2D,b,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?y&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(v&&n.texStorage2D(e.TEXTURE_2D,b,m,t.width,t.height),y&&ke(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&v&&n.texStorage3D(e.TEXTURE_2D_ARRAY,b,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(y){if(o.layerUpdates.size>0){let t=wo(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else I(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?y&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&v&&n.texStorage2D(e.TEXTURE_2D,b,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?y&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?I(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?y&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(v&&n.texStorage3D(e.TEXTURE_2D_ARRAY,b,m,t.width,t.height,t.depth),y){if(o.layerUpdates.size>0){let i=wo(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(v&&n.texStorage3D(e.TEXTURE_3D,b,m,t.width,t.height,t.depth),y&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(v){if(_)n.texStorage2D(e.TEXTURE_2D,b,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<b;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&v){let t=F(g[0]);n.texStorage2D(e.TEXTURE_2D,b,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?y&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(v){let r=F(t);n.texStorage2D(e.TEXTURE_2D,b,m,r.width,r.height)}y&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);ee(o)&&o.mipmapsAutoUpdate===!0&&O(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function je(t,o,s){if(o.image.length!==6)return;let c=De(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=zt.getPrimaries(zt.workingColorSpace),r=o.colorSpace===``?null:zt.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=D(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=P(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),v=A(o.internalFormat,g,_,o.normalized,o.colorSpace),y=o.isVideoTexture!==!0,b=u.__version===void 0||c===!0,x=l.dataReady,S=ne(o,h);Ee(e.TEXTURE_CUBE_MAP,o);let C;if(o.isDepthTexture){if(v=te(o.format===ue,o.type),b){if(y)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,v,h.width,h.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,h.width,h.height,0,g,_,null)}}else if(f){y&&b&&n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=m[t].mipmaps;for(let r=0;r<C.length;r++){let i=C[r];o.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?I(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(C=o.mipmaps,y&&b){C.length>0&&S++;let t=F(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(p){y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<C.length;r++){let i=C[r].image[t].image;y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,m[t]);for(let r=0;r<C.length;r++){let i=C[r];y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}ee(o)&&o.mipmapsAutoUpdate===!0&&O(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Me(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=A(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),N(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Be(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ne(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=te(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;N(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Be(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Be(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=A(o.internalFormat,c,l,o.normalized,o.colorSpace);N(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Be(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Be(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Pe(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);c.__renderTarget=i;let l=o?i.depthTexture.image[0]:i.depthTexture.image;c.__webglTexture&&l.width===i.width&&l.height===i.height||(l.width=i.width,l.height=i.height,i.depthTexture.needsUpdate=!0),o?Se(i.depthTexture,0):ye(i.depthTexture,0);let u=c.__webglTexture,d=Be(i),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)N(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)N(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Fe(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)Pe(i.__webglFramebuffer[e],t,e);else t.texture.mipmaps.length>0?Pe(i.__webglFramebuffer[0],t,0):Pe(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),Ne(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else if(t.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),Ne(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ie(t,n,i){let a=r.get(t);n!==void 0&&Me(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&Fe(t)}function Le(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,oe),re(t);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&N(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=A(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Be(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),Ne(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),Ee(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)Me(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else Me(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);ee(i)?O(e.TEXTURE_CUBE_MAP):i.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),Ee(c,a),Me(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),ee(a)&&O(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),Ee(r,i),i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)Me(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else Me(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);ee(i)?O(r):i.mipmaps.length>0&&e.texParameteri(r,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&Fe(t)}function M(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(ee(a)&&a.mipmapsAutoUpdate===!0){let t=k(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),O(t),n.unbindTexture()}}}let Re=[];function ze(t){if(t.samples>0){if(N(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Re.length=0,Re.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&Re.push(l),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Re))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Be(e){return Math.min(i.maxSamples,e.samples)}function N(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function Ve(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function P(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(zt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&I(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):L(`WebGLTextures: Unsupported texture color space:`,n)),t}function F(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=_e,this.resetTextureUnits=me,this.getTextureUnits=he,this.setTextureUnits=ge,this.setTexture2D=ye,this.setTexture2DArray=be,this.setTexture3D=xe,this.setTextureCube=Se,this.rebindTextures=Ie,this.setupRenderTarget=Le,this.updateRenderTargetMipmap=M,this.updateMultisampleRenderTarget=ze,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=N,this.dispose=le}function Cl(e,t){function n(n,r=``){let i,a=zt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var wl=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Tl=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,El=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Zi(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ma({vertexShader:wl,fragmentShader:Tl,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new H(new na(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Dl=class extends bt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new El,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new R,C=null,w=null,E=new Za;E.viewport=new Xt;let D=new Za;D.viewport=new Xt;let ee=[E,D],O=new oo,A=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Mn,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Mn,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Mn,b[e]=t),t.getHandSpace()};function ne(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function re(){r.removeEventListener(`select`,ne),r.removeEventListener(`selectstart`,ne),r.removeEventListener(`selectend`,ne),r.removeEventListener(`squeeze`,ne),r.removeEventListener(`squeezestart`,ne),r.removeEventListener(`squeezeend`,ne),r.removeEventListener(`end`,re),r.removeEventListener(`inputsourceschange`,ae);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}A=null,te=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,fe.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&I(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&I(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,ne),r.addEventListener(`selectstart`,ne),r.addEventListener(`selectend`,ne),r.addEventListener(`squeeze`,ne),r.addEventListener(`squeezestart`,ne),r.addEventListener(`squeezeend`,ne),r.addEventListener(`end`,re),r.addEventListener(`inputsourceschange`,ae),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?ue:j,a=_.stencil?ie:k);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Qt(d.textureWidth,d.textureHeight,{format:le,type:T,depthTexture:new Yi(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Qt(f.framebufferWidth,f.framebufferHeight,{format:le,type:T,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),fe.setContext(r),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function ae(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}function oe(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=D.near=E.near=t,O.far=D.far=E.far=n,(A!==O.near||te!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),A=O.near,te=O.far),O.layers.mask=e.layers.mask|6,E.layers.mask=O.layers.mask&-5,D.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;oe(O,i);for(let e=0;e<a.length;e++)oe(a[e],i);O.projectionMatrix.copy(E.projectionMatrix),O.projectionMatrixInverse.copy(E.projectionMatrixInverse),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),se(e,O,i)};function se(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Ct*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let ce=null;function de(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=ee[n];o===void 0&&(o=new Za,o.layers.enable(n),o.viewport=new Xt,ee[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Zi,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ce&&ce(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let fe=new Eo;fe.setAnimationLoop(de),this.setAnimationLoop=function(e){ce=e},this.dispose=function(){}}},Ol=new tn,kl=new B;kl.set(-1,0,0,0,1,0,0,0,1);function Al(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,ua(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Ol.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(kl),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function jl(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?I(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):I(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var Ml=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Nl=null;function Pl(){return Nl===null&&(Nl=new wi(Ml,16,16,pe,te),Nl.name=`DFG_LUT`,Nl.minFilter=S,Nl.magFilter=S,Nl.wrapS=_,Nl.wrapT=_,Nl.generateMipmaps=!1,Nl.needsUpdate=!0),Nl}var Fl=class{constructor(e={}){let{canvas:t=pt(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=T}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([he,me,fe]),g=new Set([T,k,ee,ie,ne,re]),_=new Uint32Array(4),v=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},b=null,x=null,S=[],C=[],E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let D=this,O=!1,A=null,ae=null,oe=null,se=null;this._outputColorSpace=nt;let ce=0,le=0,j=null,ue=-1,de=null,pe=new Xt,ge=new Xt,_e=null,ve=new V(0),ye=0,be=t.width,xe=t.height,Se=1,Ce=null,we=null,Te=new Xt(0,0,be,xe),Ee=new Xt(0,0,be,xe),De=!1,Oe=new Li,ke=new zi,Ae=!1,je=!1,Me=new tn,Ne=new z,Pe=new Xt,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ie=!1;function Le(){return j===null?Se:1}let M=n;function Re(e,n){return t.getContext(e,n)}let ze,Be,N,Ve,P,F,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,rt,it,at;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,ct,!1),t.addEventListener(`webglcontextrestored`,ut,!1),t.addEventListener(`webglcontextcreationerror`,dt,!1),M===null){let t=`webgl2`;if(M=Re(t,e),M===null)throw Re(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}ot()}catch(e){throw t.removeEventListener(`webglcontextlost`,ct,!1),t.removeEventListener(`webglcontextrestored`,ut,!1),t.removeEventListener(`webglcontextcreationerror`,dt,!1),L(`WebGLRenderer: `+e.message),e}function ot(){ze=new ts(M),ze.init(),rt=new Cl(M,ze),Be=new Fo(M,ze,e,rt),N=new xl(M,ze),Be.reversedDepthBuffer&&d&&N.buffers.depth.setReversed(!0),ae=M.createFramebuffer(),oe=M.createFramebuffer(),se=M.createFramebuffer(),Ve=new is(M),P=new tl,F=new Sl(M,ze,N,P,Be,rt,Ve),He=new es(D),Ue=new Do(M),it=new No(M,Ue),We=new ns(M,Ue,Ve,it),Ge=new os(M,We,Ue,it,Ve),$e=new as(M,Be,F),Xe=new Io(P),Ke=new el(D,He,ze,Be,it,Xe),qe=new Al(D,P),Je=new al,Ye=new fl(ze),Qe=new Mo(D,He,N,Ge,p,s),Ze=new bl(D,Ge,Be),at=new jl(M,Ve,Be,N),et=new Po(M,ze,Ve),tt=new rs(M,ze,Ve),Ve.programs=Ke.programs,D.capabilities=Be,D.extensions=ze,D.properties=P,D.renderLists=Je,D.shadowMap=Ze,D.state=N,D.info=Ve}m!==1009&&(E=new cs(m,t.width,t.height,o,r,i));let st=new Dl(D,M);this.xr=st,this.getContext=function(){return M},this.getContextAttributes=function(){return M.getContextAttributes()},this.forceContextLoss=function(){let e=ze.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=ze.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return Se},this.setPixelRatio=function(e){e!==void 0&&(Se=e,this.setSize(be,xe,!1))},this.getSize=function(e){return e.set(be,xe)},this.setSize=function(e,n,r=!0){st.isPresenting?I(`WebGLRenderer: Can't change size while VR device is presenting.`):(be=e,xe=n,t.width=Math.floor(e*Se),t.height=Math.floor(n*Se),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(be*Se,xe*Se).floor()},this.setDrawingBufferSize=function(e,n,r){be=e,xe=n,Se=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)L(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){I(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}E.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(pe)},this.getViewport=function(e){return e.copy(Te)},this.setViewport=function(e,t,n,r){e.isVector4?Te.set(e.x,e.y,e.z,e.w):Te.set(e,t,n,r),N.viewport(pe.copy(Te).multiplyScalar(Le()).round())},this.getScissor=function(e){return e.copy(Ee)},this.setScissor=function(e,t,n,r){e.isVector4?Ee.set(e.x,e.y,e.z,e.w):Ee.set(e,t,n,r),N.scissor(ge.copy(Ee).multiplyScalar(Le()).round())},this.getScissorTest=function(){return De},this.setScissorTest=function(e){N.setScissorTest(De=e)},this.setOpaqueSort=function(e){Ce=e},this.setTransparentSort=function(e){we=e},this.getClearColor=function(e){return e.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor(...arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(j!==null){let t=j.texture.format;e=h.has(t)}if(e){let e=j.texture.type,t=g.has(e),n=Qe.getClearColor(),r=Qe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,M.clearBufferuiv(M.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,M.clearBufferiv(M.COLOR,0,v))}else r|=M.COLOR_BUFFER_BIT}t&&(r|=M.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=M.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&M.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),A=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,ct,!1),t.removeEventListener(`webglcontextrestored`,ut,!1),t.removeEventListener(`webglcontextcreationerror`,dt,!1),Qe.dispose(),Je.dispose(),Ye.dispose(),F.dispose(),P.dispose(),He.dispose(),Ge.dispose(),We.dispose(),it.dispose(),at.dispose(),Ke.dispose(),st.dispose(),st.removeEventListener(`sessionstart`,xt),st.removeEventListener(`sessionend`,St),Ct.stop()};function ct(e){e.preventDefault(),ht(`WebGLRenderer: Context Lost.`),O=!0}function ut(){ht(`WebGLRenderer: Context Restored.`),O=!1;let e=Ve.autoReset,t=Ze.enabled,n=Ze.autoUpdate,r=Ze.needsUpdate,i=Ze.type;ot(),Ve.autoReset=e,Ze.enabled=t,Ze.autoUpdate=n,Ze.needsUpdate=r,Ze.type=i}function dt(e){L(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ft(e){let t=e.target;t.removeEventListener(`dispose`,ft),mt(t)}function mt(e){gt(e),P.remove(e)}function gt(e){let t=P.get(e).programs;t!==void 0&&(t.forEach(function(e){Ke.releaseProgram(e)}),e.isShaderMaterial&&Ke.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Fe);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Nt(e,t,n,r,i);N.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=We.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;it.setup(i,r,s,n,c);let h,g=et;if(c!==null&&(h=Ue.get(c),g=tt,g.setIndex(h)),i.isMesh)r.wireframe===!0?(N.setLineWidth(r.wireframeLinewidth*Le()),g.setMode(M.LINES)):g.setMode(M.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),N.setLineWidth(e*Le()),i.isLineSegments?g.setMode(M.LINES):i.isLineLoop?g.setMode(M.LINE_LOOP):g.setMode(M.LINE_STRIP)}else i.isPoints?g.setMode(M.POINTS):i.isSprite&&g.setMode(M.TRIANGLES);if(i.isBatchedMesh){if(ze.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ue.get(c).bytesPerElement:1,o=P.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(M,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function _t(e,t,n,r){A!==null&&e.isNodeMaterial&&A.setObject(r,e),Ae===!0&&Xe.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,At(e,t,r),e.side=0,e.needsUpdate=!0,At(e,t,r),e.side=2):At(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),A!==null&&A.renderStart(e,t,n),x=Ye.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),A!==null&&A.updateLights(x.state.lightsArray),je=this.localClippingEnabled,Ae=Xe.init(this.clippingPlanes,je),Ae===!0&&Xe.setGlobalState(this.clippingPlanes,t),A!==null&&Ze.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];_t(o,n,t,e),r.add(o)}else _t(i,n,t,e),r.add(i)}}),x=C.pop(),A!==null&&A.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=P.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}ze.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let yt=null;function bt(e){yt&&yt(e)}function xt(){Ct.stop()}function St(){Ct.start()}let Ct=new Eo;Ct.setAnimationLoop(bt),typeof self<`u`&&Ct.setContext(self),this.setAnimationLoop=function(e){yt=e,st.setAnimationLoop(e),e===null?Ct.stop():Ct.start()},st.addEventListener(`sessionstart`,xt),st.addEventListener(`sessionend`,St),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){L(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(O===!0)return;A!==null&&A.renderStart(e,t);let n=st.enabled===!0&&st.isPresenting===!0,r=E!==null&&(j===null||n)&&E.begin(D,j);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),st.enabled===!0&&st.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(st.cameraAutoUpdate===!0&&st.updateCamera(t),t=st.getCamera()),e.isScene===!0&&e.onBeforeRender(D,e,t,j),x=Ye.get(e,C.length),x.init(t),x.state.textureUnits=F.getTextureUnits(),C.push(x),Me.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?ke.setFromArrayCamera(t):Oe.setFromProjectionMatrix(Me,lt,t.reversedDepth),je=this.localClippingEnabled,Ae=Xe.init(this.clippingPlanes,je),b=Je.get(e,S.length),b.init(),S.push(b),this.info.render.frame++,st.enabled===!0&&st.isPresenting===!0){let e=D.xr.getDepthSensingMesh();e!==null&&wt(e,t,-1/0,D.sortObjects)}wt(e,t,0,D.sortObjects),b.finish(),A!==null&&A.updateLights(x.state.lightsArray),D.sortObjects===!0&&b.sort(Ce,we),Ie=st.enabled===!1||st.isPresenting===!1||st.hasDepthSensing()===!1,Ie&&Qe.addToRenderList(b,e),this.info.autoReset===!0&&this.info.reset(),Ae===!0&&Xe.beginShadows();let i=x.state.shadowsArray;if(Ze.render(i,e,t),Ae===!0&&Xe.endShadows(),(r&&E.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Et(n,r,e,a)}Ie&&Qe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];Tt(b,e,n,n.viewport)}}else r.length>0&&Et(n,r,e,t),Ie&&Qe.render(e),Tt(b,e,t)}j!==null&&le===0&&(F.updateMultisampleRenderTarget(j),F.updateRenderTargetMipmap(j)),r&&E.end(D),e.isScene===!0&&e.onAfterRender(D,e,t),it.resetDefaultState(),ue=-1,de=null,C.pop(),C.length>0?(x=C[C.length-1],F.setTextureUnits(x.state.textureUnits),Ae===!0&&Xe.setGlobalState(D.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,A!==null&&A.renderEnd()};function wt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?ke:Oe;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&Pe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Me);let i=Ge.update(e),a=e.material;a.visible&&b.push(e,i,a,n,Pe.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?ke:Oe;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=Ge.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Pe.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Pe.copy(e.boundingSphere.center)),Pe.applyMatrix4(e.matrixWorld).applyMatrix4(Me)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,Pe.z,s,t)}}else a.visible&&b.push(e,i,a,n,Pe.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)wt(i[e],t,n,r)}function Tt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),Ae===!0&&Xe.setGlobalState(D.clippingPlanes,n),r&&N.viewport(pe.copy(r)),i.length>0&&Dt(i,t,n),a.length>0&&Dt(a,t,n),o.length>0&&Dt(o,t,n),N.buffers.depth.setTest(!0),N.buffers.depth.setMask(!0),N.buffers.color.setMask(!0),N.setPolygonOffset(!1)}function Et(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=ze.has(`EXT_color_buffer_half_float`)||ze.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Qt(1,1,{generateMipmaps:!0,type:e?te:T,minFilter:w,samples:Math.max(4,Be.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:zt.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||pe;a.setSize(o.z*D.transmissionResolutionScale,o.w*D.transmissionResolutionScale);let s=D.getRenderTarget(),c=D.getActiveCubeFace(),l=D.getActiveMipmapLevel();D.setRenderTarget(a),D.getClearColor(ve),ye=D.getClearAlpha(),ye<1&&D.setClearColor(16777215,.5),D.clear(),Ie&&Qe.render(n);let u=D.toneMapping;D.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),Ae===!0&&Xe.setGlobalState(D.clippingPlanes,r),Dt(e,n,r),F.updateMultisampleRenderTarget(a),F.updateRenderTargetMipmap(a),ze.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Ot(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(F.updateMultisampleRenderTarget(a),F.updateRenderTargetMipmap(a))}D.setRenderTarget(s,c,l),D.setClearColor(ve,ye),d!==void 0&&(r.viewport=d),D.toneMapping=u}function Dt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Ot(o,t,n,s,l,c)}}function Ot(e,t,n,r,i,a){A!==null&&i.isNodeMaterial&&A.setObject(e,i),e.onBeforeRender(D,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(D,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,D.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,D.renderBufferDirect(n,t,r,i,e,a),i.side=2):D.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(D,t,n,r,i,a)}function kt(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function At(e,t,n){t.isScene!==!0&&(t=Fe);let r=P.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Ke.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Ke.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=He.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ft),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Mt(e,s),d}else s.uniforms=Ke.getUniforms(e),A!==null&&e.isNodeMaterial&&A.build(e,n,s),e.onBeforeCompile(s,D),d=Ke.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Xe.uniform),Mt(e,s),r.needsLights=B(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=kt(x.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function jt(e,t,n,r,i){let a=P.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=At(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function R(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=_c.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Mt(e,t){let n=P.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Nt(e,t,n,r,i){t.isScene!==!0&&(t=Fe),F.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=j===null?D.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:zt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=He.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(h=D.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=P.get(r),b=x.state.lights;if(Ae===!0&&(je===!0||e!==de)){let t=e===de&&r.id===ue;Xe.setState(r,e,t)}let S=!1,C=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==b.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?S=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Xe.numPlanes||v.numIntersection!==Xe.numIntersection)?S=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===kt(x.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(C=!0):S=!0:S=!0:(S=!0,v.__version=r.version);let w=v.currentProgram;(S===!0||C===!0)&&(w=C===!0?jt(r,t,i,s,h):At(r,t,i),A&&r.isNodeMaterial&&A.onUpdateProgram(r,w,v));let T=!1,E=!1,ee=!1,O=w.getUniforms(),k=v.uniforms;if(N.useProgram(w.program)&&(T=!0,E=!0,ee=!0),r.id!==ue&&(ue=r.id,E=!0),T||de!==e){N.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(M,`projectionMatrix`,e.projectionMatrix),O.setValue(M,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(M,Ne.setFromMatrixPosition(e.matrixWorld)),Be.logarithmicDepthBuffer&&O.setValue(M,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(M,`isOrthographic`,e.isOrthographicCamera===!0),de!==e&&(de=e,E=!0,ee=!0)}if(v.needsLights&&(b.state.sunShadowMap.length>0&&O.setValue(M,`sunShadowMap`,b.state.sunShadowMap,F),b.state.directionalShadowMap.length>0&&O.setValue(M,`directionalShadowMap`,b.state.directionalShadowMap,F),b.state.spotShadowMap.length>0&&O.setValue(M,`spotShadowMap`,b.state.spotShadowMap,F),b.state.pointShadowMap.length>0&&O.setValue(M,`pointShadowMap`,b.state.pointShadowMap,F)),i.isSkinnedMesh){O.setOptional(M,i,`bindMatrix`),O.setOptional(M,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(M,`boneTexture`,e.boneTexture,F))}i.isBatchedMesh&&(O.setOptional(M,i,`batchingTexture`),O.setValue(M,`batchingTexture`,i._matricesTexture,F),O.setOptional(M,i,`batchingIdTexture`),O.setValue(M,`batchingIdTexture`,i._indirectTexture,F),O.setOptional(M,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(M,`batchingColorTexture`,i._colorsTexture,F));let te=n.morphAttributes;if((te.position!==void 0||te.normal!==void 0||te.color!==void 0)&&$e.update(i,n,w),(E||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(M,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=Pl()),E){if(O.setValue(M,`toneMappingExposure`,D.toneMappingExposure),v.needsLights&&Pt(k,ee),a&&r.fog===!0&&qe.refreshFogUniforms(k,a),qe.refreshMaterialUniforms(k,r,Se,xe,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=y,t=0;for(let n of x.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;k.probesSH.value=e.textures,k.probesMin.value=e.min,k.probesMax.value=e.max,k.probesResolution.value=e.resolution}_c.upload(M,R(v),k,F)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(_c.upload(M,R(v),k,F),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(M,`center`,i.center),O.setValue(M,`modelViewMatrix`,i.modelViewMatrix),O.setValue(M,`normalMatrix`,i.normalMatrix),O.setValue(M,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];at.update(n,w),at.bind(n,w)}}return w}function Pt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function B(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ce},this.getActiveMipmapLevel=function(){return le},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(e,t,n){let r=P.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),P.get(e.texture).__webglTexture=t,P.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=P.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){j=e,ce=t,le=n;let r=null,i=!1,a=!1;if(e){let o=P.get(e);if(o.__useDefaultFramebuffer!==void 0){N.bindFramebuffer(M.FRAMEBUFFER,o.__webglFramebuffer),pe.copy(e.viewport),ge.copy(e.scissor),_e=e.scissorTest,N.viewport(pe),N.scissor(ge),N.setScissorTest(_e),ue=-1;return}if(o.__webglFramebuffer===void 0)F.setupRenderTarget(e);else if(o.__hasExternalTextures)F.rebindTextures(e,P.get(e.texture).__webglTexture,P.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&P.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);F.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=P.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&F.useMultisampledRTT(e)===!1?P.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,pe.copy(e.viewport),ge.copy(e.scissor),_e=e.scissorTest}else pe.copy(Te).multiplyScalar(Se).floor(),ge.copy(Ee).multiplyScalar(Se).floor(),_e=De;if(n!==0&&(r=ae),N.bindFramebuffer(M.FRAMEBUFFER,r)&&N.drawBuffers(e,r),N.viewport(pe),N.scissor(ge),N.setScissorTest(_e),i){let r=P.get(e.texture);M.framebufferTexture2D(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=P.get(e.textures[t]);M.framebufferTextureLayer(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=P.get(e.texture);M.framebufferTexture2D(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_2D,t.__webglTexture,n)}ue=-1};function Ft(e){let t=P.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Be.textureFormatReadable(e.format),t.__typeReadable=Be.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){L(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=P.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){N.bindFramebuffer(M.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&M.readBuffer(M.COLOR_ATTACHMENT0+s);let u=Ft(o);if(u.__formatReadable===!1){L(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){L(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&M.readPixels(t,n,r,i,rt.convert(c),rt.convert(l),a)}finally{let e=j===null?null:P.get(j).__webglFramebuffer;N.bindFramebuffer(M.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=P.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){N.bindFramebuffer(M.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&M.readBuffer(M.COLOR_ATTACHMENT0+s);let d=Ft(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=M.createBuffer();M.bindBuffer(M.PIXEL_PACK_BUFFER,f),M.bufferData(M.PIXEL_PACK_BUFFER,a.byteLength,M.STREAM_READ),M.readPixels(t,n,r,i,rt.convert(l),rt.convert(u),0),M.bindBuffer(M.PIXEL_PACK_BUFFER,null);let p=j===null?null:P.get(j).__webglFramebuffer;N.bindFramebuffer(M.FRAMEBUFFER,p);let m=M.fenceSync(M.SYNC_GPU_COMMANDS_COMPLETE,0);return M.flush(),await vt(M,m,4),M.bindBuffer(M.PIXEL_PACK_BUFFER,f),M.getBufferSubData(M.PIXEL_PACK_BUFFER,0,a),M.bindBuffer(M.PIXEL_PACK_BUFFER,null),M.deleteBuffer(f),M.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;F.setTexture2D(e,0),M.copyTexSubImage2D(M.TEXTURE_2D,n,0,0,o,s,i,a),N.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=rt.convert(t.format),_=rt.convert(t.type),v;t.isData3DTexture?(F.setTexture3D(t,0),v=M.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(F.setTexture2DArray(t,0),v=M.TEXTURE_2D_ARRAY):(F.setTexture2D(t,0),v=M.TEXTURE_2D),N.activeTexture(M.TEXTURE0),N.pixelStorei(M.UNPACK_FLIP_Y_WEBGL,t.flipY),N.pixelStorei(M.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),N.pixelStorei(M.UNPACK_ALIGNMENT,t.unpackAlignment);let y=N.getParameter(M.UNPACK_ROW_LENGTH),b=N.getParameter(M.UNPACK_IMAGE_HEIGHT),x=N.getParameter(M.UNPACK_SKIP_PIXELS),S=N.getParameter(M.UNPACK_SKIP_ROWS),C=N.getParameter(M.UNPACK_SKIP_IMAGES);N.pixelStorei(M.UNPACK_ROW_LENGTH,h.width),N.pixelStorei(M.UNPACK_IMAGE_HEIGHT,h.height),N.pixelStorei(M.UNPACK_SKIP_PIXELS,l),N.pixelStorei(M.UNPACK_SKIP_ROWS,u),N.pixelStorei(M.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=P.get(e),r=P.get(t),h=P.get(n.__renderTarget),g=P.get(r.__renderTarget);N.bindFramebuffer(M.READ_FRAMEBUFFER,h.__webglFramebuffer),N.bindFramebuffer(M.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(M.framebufferTextureLayer(M.READ_FRAMEBUFFER,M.COLOR_ATTACHMENT0,P.get(e).__webglTexture,i,d+n),M.framebufferTextureLayer(M.DRAW_FRAMEBUFFER,M.COLOR_ATTACHMENT0,P.get(t).__webglTexture,a,m+n)),M.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,M.DEPTH_BUFFER_BIT,M.NEAREST);N.bindFramebuffer(M.READ_FRAMEBUFFER,null),N.bindFramebuffer(M.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||P.has(e)){let n=P.get(e),r=P.get(t);N.bindFramebuffer(M.READ_FRAMEBUFFER,oe),N.bindFramebuffer(M.DRAW_FRAMEBUFFER,se);for(let e=0;e<c;e++)w?M.framebufferTextureLayer(M.READ_FRAMEBUFFER,M.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):M.framebufferTexture2D(M.READ_FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_2D,n.__webglTexture,i),T?M.framebufferTextureLayer(M.DRAW_FRAMEBUFFER,M.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):M.framebufferTexture2D(M.DRAW_FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_2D,r.__webglTexture,a),i===0?T?M.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):M.copyTexSubImage2D(v,a,f,p,l,u,o,s):M.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,M.COLOR_BUFFER_BIT,M.NEAREST);N.bindFramebuffer(M.READ_FRAMEBUFFER,null),N.bindFramebuffer(M.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?M.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?M.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):M.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?M.texSubImage2D(M.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?M.compressedTexSubImage2D(M.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):M.texSubImage2D(M.TEXTURE_2D,a,f,p,o,s,g,_,h);N.pixelStorei(M.UNPACK_ROW_LENGTH,y),N.pixelStorei(M.UNPACK_IMAGE_HEIGHT,b),N.pixelStorei(M.UNPACK_SKIP_PIXELS,x),N.pixelStorei(M.UNPACK_SKIP_ROWS,S),N.pixelStorei(M.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&M.generateMipmap(v),N.unbindTexture()},this.initRenderTarget=function(e){P.get(e).__webglFramebuffer===void 0&&F.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?F.setTextureCube(e,0):e.isData3DTexture?F.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?F.setTexture2DArray(e,0):F.setTexture2D(e,0),N.unbindTexture()},this.resetState=function(){ce=0,le=0,j=null,N.reset(),it.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return lt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=zt._getDrawingBufferColorSpace(e),t.unpackColorSpace=zt._getUnpackColorSpace()}},Il=typeof matchMedia==`function`&&matchMedia(`(pointer: coarse)`).matches,Ll={coarsePointer:Il,touchCapable:Il||typeof navigator<`u`&&navigator.maxTouchPoints>0,mobile:Il&&Math.min(screen.width,screen.height)<1e3};async function Rl(){let e=document.documentElement;try{!document.fullscreenElement&&e.requestFullscreen&&await e.requestFullscreen({navigationUI:`hide`})}catch{}try{await screen.orientation.lock?.(`landscape`)}catch{}}function zl(e){if(i.vibration&&typeof navigator.vibrate==`function`&&(!navigator.userActivation||navigator.userActivation.hasBeenActive))try{navigator.vibrate(e)}catch{}}var Bl={KeyR:`reload`,KeyE:`interact`,KeyC:`crouch`,ControlLeft:`crouch`,KeyG:`grenade`,KeyF:`gadget`,Escape:`pause`,KeyP:`pause`,KeyQ:`weaponNext`,Digit1:`slot1`,Digit2:`slot2`,Digit3:`slot3`,Digit4:`slot4`,KeyM:`map`,Tab:`map`},Vl=new Set([`KeyW`,`KeyA`,`KeyS`,`KeyD`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`Space`,`ShiftLeft`,`ShiftRight`,`Tab`,`ControlLeft`]),Hl=[[0,`interact`],[1,`crouch`],[2,`reload`],[3,`weaponNext`],[4,`grenade`],[5,`gadget`],[8,`map`],[9,`pause`]],Ul=class{device=Ll.coarsePointer?`touch`:`kbm`;deviceListeners=[];keys=new Set;edges=new Set;mouseX=0;mouseY=0;hasMouse=!1;mouseFire=!1;mouseAim=!1;mouseOnCanvas=!1;applyButtons(e,t){let n=!!(e&1),r=!!(e&2);n&&!this.mouseFire&&t?(this.mouseFire=!0,this.edges.add(`fire`)):n||(this.mouseFire=!1),r&&t?this.mouseAim=!0:r||(this.mouseAim=!1),e===0&&(this.mouseOnCanvas=!1)}touch={move:{x:0,y:0},sprint:!1,aim:{x:0,y:0},aimActive:!1,fire:!1,grenadeHeld:!1,grenadeDrag:{x:0,y:0}};pad={move:{x:0,y:0},aim:{x:0,y:1},aimActive:!1,fire:!1,sprint:!1,precise:!1,grenadeHeld:!1,prev:[]};fireWasDown=!1;state={move:{x:0,y:0},moveMag:0,sprint:!1,fire:!1,firePressed:!1,precise:!1,aim:`none`,aimDir:{x:0,y:1},grenadeHeld:!1};constructor(e){window.addEventListener(`keydown`,e=>{if(Vl.has(e.code)&&e.preventDefault(),e.repeat)return;this.keys.add(e.code),this.setDevice(`kbm`);let t=Bl[e.code];t&&this.edges.add(t)}),window.addEventListener(`keyup`,e=>{this.keys.delete(e.code),e.code===`KeyG`&&this.edges.add(`grenadeRelease`)}),window.addEventListener(`blur`,()=>this.releaseAll()),window.addEventListener(`pointermove`,e=>{e.pointerType===`mouse`&&(this.mouseX=e.clientX,this.mouseY=e.clientY,this.hasMouse=!0,this.device!==`kbm`&&Math.abs(e.movementX)+Math.abs(e.movementY)>3&&this.setDevice(`kbm`),this.mouseOnCanvas&&this.applyButtons(e.buttons,!0))}),e.addEventListener(`pointerdown`,e=>{e.pointerType===`mouse`?(this.setDevice(`kbm`),this.mouseX=e.clientX,this.mouseY=e.clientY,this.hasMouse=!0,this.mouseOnCanvas=!0,this.applyButtons(e.buttons,!0)):this.setDevice(`touch`)}),window.addEventListener(`pointerup`,e=>{e.pointerType===`mouse`&&this.applyButtons(e.buttons,!1)}),e.addEventListener(`contextmenu`,e=>e.preventDefault()),e.addEventListener(`wheel`,e=>{e.preventDefault(),Math.abs(e.deltaY)>1&&this.edges.add(e.deltaY>0?`weaponNext`:`weaponPrev`)},{passive:!1})}onDeviceChange(e){this.deviceListeners.push(e)}setDevice(e){if(this.device!==e){this.device=e;for(let t of this.deviceListeners)t(e)}}press(e){this.edges.add(e)}wasPressed(e){return this.edges.has(e)}consume(e){let t=this.edges.has(e);return this.edges.delete(e),t}update(){this.pollPad();let e=this.state,t=this.keys,n=(t.has(`KeyD`)||t.has(`ArrowRight`)?1:0)-(t.has(`KeyA`)||t.has(`ArrowLeft`)?1:0),r=(t.has(`KeyW`)||t.has(`ArrowUp`)?1:0)-(t.has(`KeyS`)||t.has(`ArrowDown`)?1:0);if(n!==0||r!==0){let t=Math.hypot(n,r);e.move.x=n/t,e.move.y=r/t}else this.device===`gamepad`?(e.move.x=this.pad.move.x,e.move.y=this.pad.move.y):this.device===`touch`?(e.move.x=this.touch.move.x,e.move.y=this.touch.move.y):(e.move.x=0,e.move.y=0);e.moveMag=Math.min(1,Math.hypot(e.move.x,e.move.y));let i=this.device===`touch`,a=this.device===`gamepad`;e.sprint=t.has(`ShiftLeft`)||t.has(`ShiftRight`)||i&&this.touch.sprint||a&&this.pad.sprint,e.fire=this.mouseFire||i&&this.touch.fire||a&&this.pad.fire,e.firePressed=this.edges.has(`fire`)||e.fire&&!this.fireWasDown,this.fireWasDown=e.fire,e.precise=this.mouseAim||a&&this.pad.precise,e.grenadeHeld=this.keys.has(`KeyG`)||i&&this.touch.grenadeHeld||a&&this.pad.grenadeHeld,this.device===`kbm`?e.aim=this.hasMouse?`point`:`none`:i?(e.aim=this.touch.aimActive?`dir`:`none`,this.touch.aimActive&&(e.aimDir.x=this.touch.aim.x,e.aimDir.y=this.touch.aim.y)):(e.aim=this.pad.aimActive?`dir`:`none`,this.pad.aimActive&&(e.aimDir.x=this.pad.aim.x,e.aimDir.y=this.pad.aim.y))}endTick(){this.edges.clear()}poll(){this.pollPad()}releaseAll(){this.touch.grenadeHeld=!1,this.keys.clear(),this.mouseFire=!1,this.mouseAim=!1,this.mouseOnCanvas=!1,this.fireWasDown=!1,this.edges.clear()}pollPad(){let e=typeof navigator.getGamepads==`function`?navigator.getGamepads():null;if(!e)return;let t=null;for(let n of e)if(n&&n.connected){t=n;break}if(!t)return;let n=e=>e===void 0||Math.abs(e)<.2?0:e,r=n(t.axes[0]),i=n(t.axes[1]),a=n(t.axes[2]),o=n(t.axes[3]),s=e=>!!t.buttons[e]?.pressed,c=e=>t.buttons[e]?.value??0,l=Math.hypot(r,i),u=l>1?1/l:1;this.pad.move.x=r*u,this.pad.move.y=-i*u;let d=Math.hypot(a,o);this.pad.aimActive=d>.3,this.pad.aimActive&&(this.pad.aim.x=a/d,this.pad.aim.y=-o/d),this.pad.fire=c(7)>.4,this.pad.precise=c(6)>.4,this.pad.sprint=s(10);let f=s(4);this.pad.grenadeHeld&&!f&&this.edges.add(`grenadeRelease`),this.pad.grenadeHeld=f;let p=l>0||this.pad.aimActive||this.pad.fire;for(let[e,t]of Hl){let n=s(e);n&&!this.pad.prev[e]&&(this.edges.add(t),p=!0),this.pad.prev[e]=n}p&&this.setDevice(`gamepad`)}},Wl={low:{name:`low`,pixelRatioMax:1,antialias:!1,shadows:!1,shadowMapSize:512,particleScale:.5,dynamicLights:!1,detail:.3},medium:{name:`medium`,pixelRatioMax:1.5,antialias:!1,shadows:!0,shadowMapSize:1024,particleScale:.8,dynamicLights:!0,detail:.65},high:{name:`high`,pixelRatioMax:2,antialias:!0,shadows:!0,shadowMapSize:2048,particleScale:1,dynamicLights:!0,detail:1}};function Gl(e){return e===`auto`?Ll.mobile?Wl.medium:Wl.high:Wl[e]}function Kl(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var ql=(e,t,n)=>e<t?t:e>n?n:e,Jl=(e,t,n)=>e+(t-e)*n;function Yl(e,t,n){let r=t-e;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;return Math.abs(r)<=n?t:e+Math.sign(r)*n}var Xl=56*Math.PI/180,Zl=36,Ql=class{cam=new Za(Zl,1,1,220);focus=new z;look={x:0,z:0};shake=0;dist=24;resize(e,t){let n=e/Math.max(1,t);this.cam.aspect=n,this.cam.updateProjectionMatrix();let r=Math.tan(Zl/2*Math.PI/180),i=15/(2*r),a=(n<1?11:25)/(2*r*n);this.dist=ql(Math.max(i,a),18,40)}pxPerMeter(e){return e/(2*this.dist*Math.tan(Zl/2*Math.PI/180))}addShake(e){i.screenShake&&(this.shake=Math.min(.5,this.shake+e))}snap(e,t){this.focus.set(e,0,t),this.look.x=0,this.look.z=0,this.apply()}update(e,t,n,r,i){let a=1-Math.exp(-5*e);this.look.x+=(r-this.look.x)*a,this.look.z+=(i-this.look.z)*a;let o=1-Math.exp(-14*e);this.focus.x+=(t+this.look.x-this.focus.x)*o,this.focus.z+=(n+this.look.z-this.focus.z)*o,this.shake*=Math.exp(-12*e),this.apply()}apply(){let e=this.shake,t=e>.002?(Math.random()-.5)*e:0,n=e>.002?(Math.random()-.5)*e:0;this.cam.position.set(this.focus.x+t,this.dist*Math.sin(Xl),this.focus.z+this.dist*Math.cos(Xl)+n),this.cam.lookAt(this.focus.x+t,0,this.focus.z+n)}},q={Floor:0,Wall:1,Crate:2,Water:3,Sandbag:4,Bush:5,Tree:6,PropLow:7,PropHigh:8,PropPost:9},$l=[{solid:!1,blocksShots:!1,blocksSight:!1,height:0},{solid:!0,blocksShots:!0,blocksSight:!0,height:2.6},{solid:!0,blocksShots:!0,blocksSight:!1,height:.95},{solid:!0,blocksShots:!1,blocksSight:!1,height:0},{solid:!0,blocksShots:!0,blocksSight:!1,height:.8},{solid:!1,blocksShots:!1,blocksSight:!1,height:0},{solid:!0,blocksShots:!0,blocksSight:!0,height:99},{solid:!0,blocksShots:!0,blocksSight:!1,height:.95},{solid:!0,blocksShots:!0,blocksSight:!0,height:99},{solid:!0,blocksShots:!1,blocksSight:!1,height:0}],J={Concrete:0,Brick:1,Plaster:2,Wood:3,Stone:4,Rock:5,Metal:6,Bunker:7},Y={Grass:0,Sand:1,Dirt:2,Concrete:3,Planks:4},eu=class{w;h;name;id;tiles;ground=null;spawn={x:2.5,z:2.5};entities=[];mission=null;wallStyle=null;borderStyle=J.Concrete;roofs=[];windows=new Map;wallHeight=new Map;ruins=[];props=[];constructor(e,t,n,r=n){this.w=e,this.h=t,this.name=n,this.id=r,this.tiles=new Uint8Array(e*t)}wallStyleAt(e,t){return!this.wallStyle||!this.inBounds(e,t)?J.Concrete:this.wallStyle[t*this.w+e]}groundAt(e,t){return!this.ground||!this.inBounds(e,t)?Y.Grass:this.ground[t*this.w+e]}inBounds(e,t){return e>=0&&t>=0&&e<this.w&&t<this.h}get(e,t){return this.inBounds(e,t)?this.tiles[t*this.w+e]:q.Wall}set(e,t,n){this.inBounds(e,t)&&(this.tiles[t*this.w+e]=n)}solid=(e,t)=>$l[this.get(e,t)].solid;blocksShot=(e,t)=>$l[this.get(e,t)].blocksShots;blocksSight=(e,t)=>$l[this.get(e,t)].blocksSight;bush=(e,t)=>this.get(e,t)===q.Bush},tu=class{map;wall=J.Concrete;constructor(e,t,n,r){this.map=new eu(e,t,n,r??n)}ground(e,t,n,r,i){let a=this.map;a.ground??=new Uint8Array(a.w*a.h);for(let o=t;o<t+r;o++)for(let t=e;t<e+n;t++)a.inBounds(t,o)&&(a.ground[o*a.w+t]=i);return this}destructible(e,t,n,r=``){return this.map.entities.push({kind:`destructible`,type:e,x:t+.5,z:n+.5,tag:r}),this}tank(e,t,n,r,i=``){return this.map.entities.push({kind:`tank`,x:e+.5,z:t+.5,yaw:n,route:r.map(([e,t])=>({x:e+.5,z:t+.5})),tag:i}),this}jeep(e,t,n,r,i=``){this.tank(e,t,n,r,i);let a=this.map.entities[this.map.entities.length-1];return a.kind===`tank`&&(a.vehicle=`jeep`),this}mission(e){return this.map.mission=e,this}fill(e,t,n,r,i){let a=this.map;for(let o=t;o<t+r;o++)for(let t=e;t<e+n;t++)a.set(t,o,i),i===q.Wall&&a.inBounds(t,o)&&(this.wall!==J.Concrete&&(a.wallStyle??=new Uint8Array(a.w*a.h)),a.wallStyle&&(a.wallStyle[o*a.w+t]=this.wall));return this}style(e){return this.wall=e,this}roof(e,t,n,r,i=`gable`,a=10111538){return this.map.roofs.push({x:e,z:t,w:n,h:r,kind:i,color:a}),this}prop(e,t,n,r=0,i){let a=this.map;a.props.push({type:e,x:t,z:n,rot:r,color:i});let o=nu[e],[s,c]=r%2?[o.d,o.w]:[o.w,o.d];if(o.tile!==null)for(let e=n;e<n+c;e++)for(let n=t;n<t+s;n++){let t=a.get(n,e);(t===q.Floor||t===q.Bush)&&a.set(n,e,o.tile)}return this}room(e,t,n,r){return this.fill(e,t,n,1,q.Wall),this.fill(e,t+r-1,n,1,q.Wall),this.fill(e,t,1,r,q.Wall),this.fill(e+n-1,t,1,r,q.Wall),this}hwall(e,t,n){return this.fill(e,t,n,1,q.Wall)}vwall(e,t,n){return this.fill(e,t,1,n,q.Wall)}crates(e,t,n=1,r=1){return this.fill(e,t,n,r,q.Crate)}clear(e,t,n=1,r=1){return this.fill(e,t,n,r,q.Floor)}spawn(e,t){return this.map.spawn={x:e+.5,z:t+.5},this}dummy(e,t,n=0){return this.map.entities.push({kind:`dummy`,x:e+.5,z:t+.5,yaw:n}),this}checkpoint(e,t){return this.map.entities.push({kind:`checkpoint`,x:e+.5,z:t+.5}),this}item(e,t,n){return this.map.entities.push({kind:`item`,item:e,x:t+.5,z:n+.5}),this}house(e,t,n,r,i){return this.style(i.style).room(e,t,n,r),this.doors(e,t,n,r,i.doors??[]),i.windows!==!1&&this.windowsIn(e,t,n,r),i.roof!==null&&this.roof(e,t,n,r,i.roof??`gable`,i.color),i.windows!==!1&&this.furnish(e,t,n,r),this}furnish(e,t,n,r,i){let a=this.map,o=i??(()=>!0),s=this.wall,c=s===J.Stone||s===J.Metal||s===J.Bunker||s===J.Concrete?Y.Concrete:Y.Planks;for(let i=t;i<t+r;i++)for(let t=e;t<e+n;t++)o(t,i)&&a.inBounds(t,i)&&this.ground(t,i,1,1,c);let l=Kl(e*7919+t*104729+n*31+r),u=(e,t)=>a.get(e,t)===q.Wall||a.windows.has(t*a.w+e),d=(e,t)=>a.inBounds(e,t)&&a.get(e,t)===q.Floor,f=new Set;for(let i=t;i<t+r;i++)for(let o=e;o<e+n;o++)if(d(o,i)){if((u(o-1,i)||u(o+1,i))&&!u(o,i-1)&&!u(o,i+1)&&(o===e||o===e+n-1||i===t||i===t+r-1))for(let e=-2;e<=2;e++)for(let t=-2;t<=2;t++)f.add((i+e)*a.w+o+t);if((u(o,i-1)||u(o,i+1))&&!u(o-1,i)&&!u(o+1,i)&&(o===e||o===e+n-1||i===t||i===t+r-1))for(let e=-2;e<=2;e++)for(let t=-2;t<=2;t++)f.add((i+e)*a.w+o+t)}let p=new Set,m=(i,s)=>i>e&&s>t&&i<e+n-1&&s<t+r-1&&o(i,s)&&d(i,s)&&!f.has(s*a.w+i)&&!p.has(s*a.w+i),h=(e,t)=>{p.add(t*a.w+e)},g=(n-2)*(r-2),_=Math.max(1,Math.round(g/9)),v=[];for(let i=t+1;i<t+r-1;i++)for(let t=e+1;t<e+n-1;t++)m(t,i)&&(u(t,i-1)?v.push([t,i,0]):u(t-1,i)?v.push([t,i,1]):u(t,i+1)?v.push([t,i,2]):u(t+1,i)&&v.push([t,i,3]));for(let e=v.length-1;e>0;e--){let t=Math.floor(l()*(e+1));[v[e],v[t]]=[v[t],v[e]]}for(let[e,t,n]of v){if(_<=0)break;if(!m(e,t))continue;let r=l();if(r<.35){let[r,i,a,o]=n===0?[e,t,e,t+1]:n===2?[e,t-1,e,t-1]:n===1?[e,t,e+1,t]:[e-1,t,e-1,t];if(!m(a,o))continue;this.map.props.push({type:`bed`,x:r,z:i,rot:n,color:void 0}),h(e,t),h(a,o)}else this.map.props.push({type:r<.75?`shelf`:`stove`,x:e,z:t,rot:n,color:void 0}),h(e,t);_--}let y=Math.floor(e+n/2),b=Math.floor(t+r/2);return g>=12&&m(y,b)&&(g>=20&&m(y-1,b-1)&&m(y,b-1)&&m(y-1,b)&&this.map.props.push({type:`rug`,x:y-1,z:b-1,rot:0,color:void 0}),this.map.props.push({type:`table`,x:y,z:b,rot:Math.floor(l()*4),color:void 0}),h(y,b)),this}windowsIn(e,t,n,r,i=3){let a=this.map,o=(e,t)=>a.get(e,t)===q.Wall,s=(e,t)=>a.inBounds(e,t)&&!$l[a.get(e,t)].solid,c=(e,t)=>a.inBounds(e,t)&&a.get(e,t)!==q.Wall,l=[];for(let a=t;a<t+r;a++)for(let r=e;r<e+n;r++){if(!o(r,a))continue;let n=o(r-1,a)&&o(r+1,a)&&c(r,a-1)&&c(r,a+1)&&(s(r,a-1)||s(r,a+1));n!==(o(r,a-1)&&o(r,a+1)&&c(r-1,a)&&c(r+1,a)&&(s(r-1,a)||s(r+1,a)))&&(n?r-e:a-t)%i===1&&l.push([r,a,n])}for(let[e,t,n]of l)a.set(e,t,q.PropPost),a.windows.set(t*a.w+e,n);return this}doors(e,t,n,r,i){for(let[a,o,s=2]of i)a===`n`?this.clear(e+o,t,s,1):a===`s`?this.clear(e+o,t+r-1,s,1):a===`w`?this.clear(e,t+o,1,s):this.clear(e+n-1,t+o,1,s);return this}lhouse(e,t,n,r,i,a,o,s){let c=i[0]===`n`,l=i[1]===`e`,u=l?e+n-a:e,d=c?t:t+r-o,f=(i,s)=>i>=e&&i<e+n&&s>=t&&s<t+r&&!(i>=u&&i<u+a&&s>=d&&s<d+o);this.style(s.style);for(let i=t;i<t+r;i++)for(let t=e;t<e+n;t++){if(!f(t,i))continue;let e=!1;for(let n=-1;n<=1&&!e;n++)for(let r=-1;r<=1;r++)f(t+r,i+n)||(e=!0);this.fill(t,i,1,1,e?q.Wall:q.Floor)}this.doors(e,t,n,r,s.doors??[]),s.windows!==!1&&this.windowsIn(e,t,n,r),s.windows!==!1&&this.furnish(e,t,n,r,f);let p=s.roof??`gable`,m=l?e:e+a;return c?this.roof(e,t+o,n,r-o,p,s.color).roof(m,t,n-a,o,p,s.color):this.roof(e,t,n,r-o,p,s.color).roof(m,t+r-o,n-a,o,p,s.color),this}compound(e,t){let n=(t,n)=>e.some(([e,r,i,a])=>t>=e&&t<e+i&&n>=r&&n<r+a),r=1e9,i=1e9,a=-1e9,o=-1e9;for(let[t,n,s,c]of e)r=Math.min(r,t),i=Math.min(i,n),a=Math.max(a,t+s),o=Math.max(o,n+c);this.style(t.style);for(let e=i;e<o;e++)for(let t=r;t<a;t++){if(!n(t,e))continue;let r=!1;for(let i=-1;i<=1&&!r;i++)for(let a=-1;a<=1;a++)n(t+a,e+i)||(r=!0);this.fill(t,e,1,1,r?q.Wall:q.Floor)}for(let[e,n,r=2,i=!0]of t.doors??[])this.clear(e,n,i?r:1,i?1:r);if(t.windows!==!1&&this.windowsIn(r,i,a-r,o-i),t.roof!==null)for(let[n,r,i,a]of e)this.roof(n,r,i,a,t.roof??`gable`,t.color);if(t.windows!==!1)for(let[t,n,r,i]of e)this.furnish(t,n,r,i);return this}stream(e,t,n,r=Y.Dirt){let i=this.map,a=Kl(n),o=new Set;for(let n=0;n<e.length-1;n++){let[s,c]=e[n],[l,u]=e[n+1],d=Math.ceil(Math.hypot(l-s,u-c)*2);for(let e=0;e<=d;e++){let n=s+(l-s)*e/d,f=c+(u-c)*e/d,p=t/2+(a()-.5)*.6;for(let e=Math.floor(f-p-1.3);e<=Math.ceil(f+p+1.3);e++)for(let t=Math.floor(n-p-1.3);t<=Math.ceil(n+p+1.3);t++){if(!i.inBounds(t,e))continue;let a=Math.hypot(t+.5-n,e+.5-f);a<=p?o.add(e*i.w+t):a<=p+1.3&&!this.pathTiles.has(e*i.w+t)&&i.get(t,e)===q.Floor&&this.ground(t,e,1,1,r)}}}let s=new Set;for(let e of o){let t=e%i.w,n=Math.floor(e/i.w);this.pathTiles.has(e)?s.add(e):this.wildOk(t,n,[],!1)&&i.set(t,n,q.Water)}for(let e of s){let t=e%i.w,n=Math.floor(e/i.w);this.ground(t,n,1,1,Y.Dirt)}return this}lowWallRing(e,t,n,r,i=[]){let a=new Set,o=Math.ceil((n+r)*4);for(let s=0;s<o;s++){let c=s/o*Math.PI*2;if(i.some(e=>Math.abs(Math.atan2(Math.sin(c-e),Math.cos(c-e)))<.22))continue;let l=Math.floor(e+Math.cos(c)*n),u=Math.floor(t+Math.sin(c)*r),d=u*this.map.w+l;if(a.has(d)||this.map.get(l,u)!==q.Floor)continue;a.add(d);let f=Math.abs(Math.sin(c))>.7;this.prop(`lowwall`,l,u,+!f)}return this}ruin(e,t,n,r,i,a){let o=Kl(i);this.style(a.style).room(e,t,n,r),this.map.ruins.push({x:e,z:t,w:n,h:r,seed:i,style:a.style});let s=[];for(let r=e;r<e+n;r++)s.push([r,t]);for(let i=t+1;i<t+r;i++)s.push([e+n-1,i]);for(let i=e+n-2;i>=e;i--)s.push([i,t+r-1]);for(let n=t+r-2;n>t;n--)s.push([e,n]);let c=(i,a)=>(i===e||i===e+n-1)&&(a===t||a===t+r-1),l=a.keep??.6;for(let e=0;e<s.length;){let[t,n]=s[e];if(!c(t,n)&&o()<(1-l)*.6){let t=1+Math.floor(o()*3);for(let n=0;n<t&&e<s.length;n++,e++){let[t,n]=s[e];c(t,n)||this.clear(t,n)}e+=1+Math.floor(o()*2)}else e++}for(let[e,t]of s)this.map.get(e,t)===q.Wall&&this.map.wallHeight.set(t*this.map.w+e,c(e,t)?.85+o()*.15:.5+o()*.45);if(this.ground(e,t,n,r,Y.Dirt),a.rubble!==!1&&n>=5&&r>=5){let i=o()<.5?e+1:e+n-3,a=o()<.5?t+1:t+r-3;this.prop(`rubble`,i,a)}return this}lowWall(e,t,n,r,i=[]){for(let a=0;a<n;a++){if(i.includes(a))continue;let n=r===`h`?e+a:e,o=r===`h`?t:t+a;this.map.get(n,o)===q.Floor&&this.prop(`lowwall`,n,o,r===`h`?0:1)}return this}hedge(e,t,n,r,i){let a=Kl(i),o=0;for(let i=0;i<n;i++){a()<.25&&(o=Math.max(-1,Math.min(1,o+(a()<.5?-1:1))));let n=r===`h`?e+i:e+o,s=r===`h`?t+o:t+i;a()<.12||this.map.get(n,s)===q.Floor&&!this.nearEntity(n,s,0)&&this.map.set(n,s,q.Bush)}return this}grove(e,t,n,r,i,a=.45){let o=Kl(i),s=e+n/2,c=t+r/2;for(let i=t;i<t+r;i++)for(let t=e;t<e+n;t++){let e=(t+.5-s)/(n/2),l=(i+.5-c)/(r/2),u=e*e+l*l+(o()-.5)*.5;if(u>1||this.map.get(t,i)!==q.Floor||this.nearEntity(t,i,1))continue;let d=o();d<a*(1.2-u)?this.map.set(t,i,q.Tree):d<a*1.6&&this.map.set(t,i,q.Bush)}return this}path(e,t,n,r){let i=Kl(r),a=this.map;for(let r=0;r<e.length-1;r++){let[o,s]=e[r],[c,l]=e[r+1],u=Math.ceil(Math.hypot(c-o,l-s)*2);for(let e=0;e<=u;e++){let r=o+(c-o)*e/u,d=s+(l-s)*e/u,f=t/2+(i()-.5)*.9;for(let e=Math.floor(d-f);e<=Math.ceil(d+f);e++)for(let t=Math.floor(r-f);t<=Math.ceil(r+f);t++)Math.hypot(t+.5-r,e+.5-d)<=f&&a.inBounds(t,e)&&(this.ground(t,e,1,1,n),this.pathTiles.add(e*a.w+t))}}return this}pathTiles=new Set;isPath(e,t){return this.pathTiles.has(t*this.map.w+e)}noise(e,t,n,r){let i=e/n,a=t/n,o=Math.floor(i),s=Math.floor(a),c=(e,t)=>Kl((e*73856093^t*19349663^r*83492791)>>>0)(),l=e=>e*e*(3-2*e),u=l(i-o),d=l(a-s),f=c(o,s)+(c(o+1,s)-c(o,s))*u;return f+(c(o,s+1)+(c(o+1,s+1)-c(o,s+1))*u-f)*d}wildOk(e,t,n,r=!1){let i=this.map;if(!i.inBounds(e,t)||i.get(e,t)!==q.Floor||!r&&this.pathTiles.has(t*i.w+e)||this.nearEntity(e,t,1))return!1;for(let[r,i,a]of n)if(Math.hypot(e+.5-r,t+.5-i)<a)return!1;for(let n of i.entities){if(n.kind!==`tank`)continue;let r=[{x:n.x,z:n.z},...n.route,n.route[0]??{x:n.x,z:n.z}];for(let n=0;n<r.length-1;n++){let i=r[n],a=r[n+1],o=a.x-i.x,s=a.z-i.z,c=o*o+s*s||1,l=Math.max(0,Math.min(1,((e+.5-i.x)*o+(t+.5-i.z)*s)/c));if(Math.hypot(i.x+o*l-e-.5,i.z+s*l-t-.5)<2.8)return!1}}if(i.mission){for(let n of i.mission.main)if(n.kind===`reach`&&Math.hypot(e+.5-n.x,t+.5-n.z)<n.r+2.5)return!1}return!0}wildEdge(e,t){let n=this.map,r=Kl(e),i=t.sides??`nesw`,a=t.keep??[];t.kind===`rock`&&this.style(J.Rock);for(let o=0;o<n.h;o++)for(let s=0;s<n.w;s++){let c=1e9,l=0;i.includes(`n`)&&o<c&&([c,l]=[o,s]),i.includes(`s`)&&n.h-1-o<c&&([c,l]=[n.h-1-o,s+1e3]),i.includes(`w`)&&s<c&&([c,l]=[s,o+2e3]),i.includes(`e`)&&n.w-1-s<c&&([c,l]=[n.w-1-s,o+3e3]);let u=t.min+(t.max-t.min)*this.noise(l,0,7,e);if(c>=u||!this.wildOk(s,o,a))continue;let d=c/Math.max(1,u),f=r();t.kind===`rock`?f<.9-d*.5?this.fill(s,o,1,1,q.Wall):f<.95&&n.set(s,o,q.Bush):t.kind===`forest`?f<.75-d*.35?n.set(s,o,q.Tree):f<.95&&n.set(s,o,q.Bush):f<.35-d*.2?n.set(s,o,q.Tree):f<.8-d*.3&&n.set(s,o,q.Bush)}return t.kind===`rock`&&this.style(J.Concrete),this}blob(e,t,n,r,i,a){for(let o=Math.floor(t-r*1.4);o<=Math.ceil(t+r*1.4);o++)for(let s=Math.floor(e-n*1.4);s<=Math.ceil(e+n*1.4);s++){let c=(s+.5-e)/n,l=(o+.5-t)/r,u=Math.atan2(l,c),d=.75+.5*this.noise(Math.cos(u)*3+5,Math.sin(u)*3+5,1.3,i),f=Math.hypot(c,l)/d;f<=1&&a(s,o,f)}}groundBlob(e,t,n,r,i,a){return this.blob(e,t,n,r,a,(e,t)=>{this.map.inBounds(e,t)&&this.ground(e,t,1,1,i)}),this}pond(e,t,n,r,i,a=Y.Dirt){return this.blob(e,t,n+1.2,r+1.2,i,(e,t)=>{this.map.inBounds(e,t)&&!this.pathTiles.has(t*this.map.w+e)&&this.ground(e,t,1,1,a)}),this.blob(e,t,n,r,i,(e,t)=>{this.wildOk(e,t,[])&&this.map.set(e,t,q.Water)}),this}outcrop(e,t,n,r,i){let a=Kl(i);return this.style(J.Rock),this.blob(e,t,n,r,i,(e,t,n)=>{this.wildOk(e,t,[])&&(n<.75?this.fill(e,t,1,1,q.Wall):a()<.5&&this.map.set(e,t,q.Bush))}),this.style(J.Concrete),this}patches(e,t,n,r,i){let a=this.map;for(let o=0;o<a.h;o++)for(let s=0;s<a.w;s++)a.groundAt(s,o)!==t||this.pathTiles.has(o*a.w+s)||this.noise(s,o,r,i)*.75+this.noise(s,o,r/3,i+7)*.25>n&&this.ground(s,o,1,1,e);return this}nearEntity(e,t,n){let r=(r,i)=>Math.abs(Math.floor(r)-e)<=n&&Math.abs(Math.floor(i)-t)<=n;return r(this.map.spawn.x,this.map.spawn.z)?!0:this.map.entities.some(e=>r(e.x,e.z))}enemy(e,t,n,r=0,i=[]){return this.map.entities.push({kind:`enemy`,type:e,x:t+.5,z:n+.5,yaw:r,patrol:i.map(([e,t])=>({x:e+.5,z:t+.5}))}),this}},nu={truck:{w:2,d:4,tile:q.PropLow},jeep:{w:2,d:3,tile:q.PropLow},wreck:{w:3,d:3,tile:q.PropLow},hedgehog:{w:1,d:1,tile:q.PropPost},wire:{w:3,d:1,tile:q.PropPost},tent:{w:3,d:3,tile:q.PropHigh},tower:{w:2,d:2,tile:q.PropPost},lamp:{w:1,d:1,tile:q.PropPost},fence:{w:3,d:1,tile:q.PropPost},well:{w:2,d:2,tile:q.PropLow},cart:{w:2,d:3,tile:q.PropLow},hay:{w:1,d:1,tile:q.PropLow},bench:{w:2,d:1,tile:null},rock:{w:2,d:2,tile:q.PropLow},logs:{w:3,d:1,tile:q.PropLow},container:{w:2,d:5,tile:q.PropHigh},pipes:{w:1,d:6,tile:q.PropPost},silo:{w:3,d:3,tile:q.PropHigh},chimney:{w:2,d:2,tile:q.PropHigh},rails:{w:2,d:8,tile:null},boat:{w:3,d:6,tile:q.PropLow},radar:{w:2,d:2,tile:q.PropLow},antenna:{w:1,d:1,tile:q.PropPost},crater:{w:3,d:3,tile:null},rubble:{w:2,d:2,tile:q.PropLow},flag:{w:1,d:1,tile:q.PropPost},grave:{w:1,d:1,tile:q.PropPost},fountain:{w:3,d:3,tile:q.PropLow},steeple:{w:3,d:3,tile:q.PropHigh},wagon:{w:2,d:6,tile:q.PropHigh},barrels:{w:2,d:2,tile:q.PropLow},generator:{w:2,d:1,tile:q.PropLow},railing:{w:3,d:1,tile:q.PropPost},lowwall:{w:1,d:1,tile:q.PropLow},woodpile:{w:2,d:1,tile:q.PropLow},garden:{w:2,d:3,tile:null},laundry:{w:3,d:1,tile:null},stump:{w:1,d:1,tile:q.PropPost},table:{w:1,d:1,tile:null},bed:{w:1,d:2,tile:null},shelf:{w:1,d:1,tile:null},stove:{w:1,d:1,tile:null},rug:{w:2,d:2,tile:null}},ru={[Y.Grass]:`#4f6136`,[Y.Sand]:`#b8a573`,[Y.Dirt]:`#6e5a3e`,[Y.Concrete]:`#77756d`,[Y.Planks]:`#6e5234`},iu={[q.Wall]:`#d4d0c4`,[q.Crate]:`#9a7444`,[q.Water]:`#2f6f8f`,[q.Sandbag]:`#b4a477`,[q.Bush]:`#3c6a30`,[q.Tree]:`#23401f`,[q.PropLow]:`#8f8a76`,[q.PropHigh]:`#a8a292`,[q.PropPost]:`#5d6050`};function au(e,t){return t.kind===`reach`?[{x:t.x,z:t.z}]:t.kind===`destroy`?e.entities.filter(e=>(e.kind===`destructible`||e.kind===`tank`)&&e.tag===t.tag).map(e=>({x:e.x,z:e.z})):[]}function ou(e,t){let n=Math.min(2,window.devicePixelRatio||1),r=Math.round(Math.max(4,Math.min(8,Math.floor(560/Math.max(t.w,t.h))))*n);e.width=t.w*r,e.height=t.h*r,e.style.aspectRatio=`${t.w} / ${t.h}`;let i=e.getContext(`2d`);for(let e=0;e<t.h;e++)for(let n=0;n<t.w;n++){let a=t.windows.has(e*t.w+n)?q.Wall:t.get(n,e);i.fillStyle=a===q.Wall&&t.wallHeight.has(e*t.w+n)?`#9a8f7c`:iu[a]??ru[t.groundAt(n,e)]??ru[Y.Grass],i.fillRect(n*r,e*r,r,r)}i.fillStyle=`rgba(120,50,35,0.35)`;for(let e of t.roofs)i.fillRect(e.x*r,e.z*r,e.w*r,e.h*r);let a=(e,t,n,a,o=`rgba(0,0,0,0.75)`)=>{i.beginPath(),i.arc(e*r,t*r,n,0,Math.PI*2),i.fillStyle=a,i.fill(),i.lineWidth=2,i.strokeStyle=o,i.stroke()},o=(e,t,n,a=`#1b1408`)=>{i.fillStyle=a,i.font=`bold ${Math.round(r*1.6)}px system-ui, sans-serif`,i.textAlign=`center`,i.textBaseline=`middle`,i.fillText(n,e*r,t*r+.5)},s=r*1.4;for(let e of t.entities)e.kind===`checkpoint`&&(i.fillStyle=`#3d8be0`,i.fillRect(e.x*r-1,e.z*r-s,2,s*1.6),i.beginPath(),i.moveTo(e.x*r+1,e.z*r-s),i.lineTo(e.x*r+s,e.z*r-s*.65),i.lineTo(e.x*r+1,e.z*r-s*.3),i.fill());let c=t.mission;if(c){for(let e of c.side)for(let n of au(t,e))a(n.x,n.z,s*.8,`#ff8a3b`);c.main.forEach((e,n)=>{for(let r of au(t,e))a(r.x,r.z,s,`#ffd04a`),o(r.x,r.z,String(n+1))})}let l=t.spawn;i.beginPath(),i.moveTo(l.x*r,l.z*r-s*1.2),i.lineTo(l.x*r+s,l.z*r+s*.8),i.lineTo(l.x*r-s,l.z*r+s*.8),i.closePath(),i.fillStyle=`#5adf6a`,i.fill(),i.lineWidth=2,i.strokeStyle=`rgba(0,0,0,0.75)`,i.stroke()}var X=new class{ctx=null;master=null;noise=null;unlock(){if(!this.ctx){let e=window.AudioContext??window.webkitAudioContext;if(!e)return;let t=new e;this.ctx=t,this.master=t.createGain(),this.master.gain.value=i.volume,this.master.connect(t.destination);let n=Math.floor(t.sampleRate*.6),r=t.createBuffer(1,n,t.sampleRate),a=r.getChannelData(0);for(let e=0;e<n;e++)a[e]=Math.random()*2-1;this.noise=r,f.attach(t),h.attach(t)}this.ctx.state===`suspended`&&this.ctx.resume()}setVolume(e){this.master&&(this.master.gain.value=e)}suspend(){this.ctx?.state===`running`&&this.ctx.suspend()}resume(){this.ctx?.state===`suspended`&&this.ctx.resume()}out(e,t){let n=this.ctx;if(!n||!this.master||n.state!==`running`||e<.01)return null;let r=n.createGain();if(r.gain.value=e,t!==0&&typeof n.createStereoPanner==`function`){let e=n.createStereoPanner();e.pan.value=Math.max(-1,Math.min(1,t)),r.connect(e).connect(this.master)}else r.connect(this.master);return r}burst(e,t,n,r,i,a,o=`bandpass`){let s=this.ctx,c=s.createBufferSource();c.buffer=this.noise,c.playbackRate.value=.85+Math.random()*.3;let l=s.createBiquadFilter();l.type=o,l.frequency.value=r,l.Q.value=i;let u=s.createGain();u.gain.setValueAtTime(a,t),u.gain.exponentialRampToValueAtTime(.001,t+n),c.connect(l).connect(u).connect(e),c.start(t,Math.random()*.4,n+.05)}tone(e,t,n,r,i,a,o=`sine`){let s=this.ctx,c=s.createOscillator();c.type=o,c.frequency.setValueAtTime(r,t),c.frequency.exponentialRampToValueAtTime(Math.max(1,i),t+n);let l=s.createGain();l.gain.setValueAtTime(a,t),l.gain.exponentialRampToValueAtTime(.001,t+n),c.connect(l).connect(e),c.start(t),c.stop(t+n+.02)}shot(e=1,t=0,n=`pistol`){let r=this.out(e,t);if(!r)return;let i=this.ctx.currentTime;n===`shotgun`?(this.burst(r,i,.38,700,.6,1.1),this.burst(r,i,.08,3e3,.4,.7,`highpass`),this.tone(r,i,.22,110,32,1.1)):n===`dmr`?(this.burst(r,i,.45,900,.6,1),this.burst(r,i,.04,6e3,.4,.8,`highpass`),this.tone(r,i,.25,150,30,1.1)):n===`launcher`?(this.burst(r,i,.5,500,.5,.9,`lowpass`),this.burst(r,i,.6,1800,2,.5),this.tone(r,i,.3,90,40,.8)):n===`flamer`?(this.burst(r,i,.16,900,.4,.45,`lowpass`),this.burst(r,i,.12,2500,.6,.2)):n===`silenced`?(this.burst(r,i,.06,1200,1.5,.45),this.tone(r,i,.05,320,140,.3)):n===`rifle`?(this.burst(r,i,.28,1050,.7,1),this.burst(r,i,.05,3800,.4,.5,`highpass`),this.tone(r,i,.16,130,38,1)):n===`smg`?(this.burst(r,i,.13,1900,.9,.8),this.burst(r,i,.04,5200,.4,.5,`highpass`),this.tone(r,i,.08,200,60,.7)):(this.burst(r,i,.2,1500,.8,.9),this.burst(r,i,.05,4500,.4,.6,`highpass`),this.tone(r,i,.12,170,45,.9))}hurt(){let e=this.out(.7,0);if(!e)return;let t=this.ctx.currentTime;this.tone(e,t,.18,110,55,.9,`triangle`),this.burst(e,t,.08,700,1,.6,`lowpass`)}whiz(e){let t=this.out(.25,e);if(!t)return;let n=this.ctx.currentTime;this.burst(t,n,.09,3500,4,.6)}alert(e,t){let n=this.out(e*.35,t);if(!n)return;let r=this.ctx.currentTime;this.tone(n,r,.09,880,880,.4,`square`),this.tone(n,r+.1,.12,1180,1180,.4,`square`)}explosion(e,t){let n=this.out(Math.min(1.4,e*1.3),t);if(!n)return;let r=this.ctx.currentTime;this.burst(n,r,1.1,300,.4,1.2,`lowpass`),this.burst(n,r,.35,1400,.5,.8),this.tone(n,r,.6,70,22,1.3)}equip(){let e=this.out(.4,0);if(!e)return;let t=this.ctx.currentTime;this.burst(e,t,.05,1600,3,.6),this.burst(e,t+.12,.04,2600,3,.5)}clink(e,t){let n=this.out(e*.4,t);n&&this.tone(n,this.ctx.currentTime,.06,2400,1800,.4,`triangle`)}flashbang(e,t){let n=this.out(Math.min(1.3,e*1.2),t);if(!n)return;let r=this.ctx.currentTime;this.burst(n,r,.25,2500,.5,1.1,`highpass`),this.tone(n,r,1.4,3200,3e3,.25,`sine`)}radio(){let e=this.out(.5,0);if(!e)return;let t=this.ctx.currentTime;this.tone(e,t,.08,1320,1320,.35,`square`),this.tone(e,t+.12,.08,1760,1760,.35,`square`),this.tone(e,t+.24,.16,2200,2200,.3,`square`),this.burst(e,t+.45,.3,2e3,.6,.15)}pickup(){let e=this.out(.5,0);if(!e)return;let t=this.ctx.currentTime;this.tone(e,t,.08,660,660,.4,`triangle`),this.tone(e,t+.08,.08,880,880,.4,`triangle`),this.tone(e,t+.16,.14,1320,1320,.35,`triangle`)}death(){let e=this.out(.8,0);if(!e)return;let t=this.ctx.currentTime;this.tone(e,t,.9,220,55,.7,`sawtooth`),this.burst(e,t,.4,400,.8,.6,`lowpass`)}dryClick(){let e=this.out(.6,0);if(!e)return;let t=this.ctx.currentTime;this.burst(e,t,.03,3200,2,.6)}reload(){let e=this.out(.5,0);if(!e)return;let t=this.ctx.currentTime;this.burst(e,t,.04,2400,3,.7),this.burst(e,t+.32,.05,1800,3,.8),this.tone(e,t+.33,.05,900,600,.15,`square`)}hit(e){let t=this.out(.35,0);if(!t)return;let n=this.ctx.currentTime;e?this.tone(t,n,.12,700,1400,.5,`triangle`):this.tone(t,n,.05,1500,1100,.4,`triangle`)}impact(e,t){let n=this.out(e*.5,t);if(!n)return;let r=this.ctx.currentTime;this.burst(n,r,.06,2800+Math.random()*1500,1.5,.7)}ui(){let e=this.out(.25,0);e&&this.tone(e,this.ctx.currentTime,.04,900,1200,.3,`triangle`)}};function su(e,t){let n=document.createElement(`canvas`);n.width=n.height=e,t(n.getContext(`2d`),e);let r=new Ji(n);return r.colorSpace=nt,r.wrapS=r.wrapT=g,r.anisotropy=4,r}function cu(e,t,n,r,i,a){for(let o=0;o<r;o++){e.fillStyle=i[Math.floor(n()*i.length)];let r=.5+n()*a;e.globalAlpha=.25+n()*.5,e.fillRect(n()*t,n()*t,r,r)}e.globalAlpha=1}function lu(){return su(512,(e,t)=>{let n=Kl(11);e.fillStyle=`#56643a`,e.fillRect(0,0,t,t);for(let r=0;r<26;r++){let r=n()*t,i=n()*t,a=20+n()*70,o=e.createRadialGradient(r,i,0,r,i,a),s=n()<.55?`107,90,60`:`78,96,48`;o.addColorStop(0,`rgba(${s},0.55)`),o.addColorStop(1,`rgba(${s},0)`),e.fillStyle=o;for(let n of[-t,0,t])for(let o of[-t,0,t])e.fillRect(r-a+n,i-a+o,a*2,a*2)}cu(e,t,n,9e3,[`#3f4b2a`,`#6d7a46`,`#7b6a4a`,`#4a5a32`,`#8a8a5a`],2.2)})}function uu(){return su(128,(e,t)=>{let n=Kl(5);e.fillStyle=`#8d8a80`,e.fillRect(0,0,t,t),cu(e,t,n,1400,[`#77746b`,`#a09d92`,`#6c6a62`],1.6),e.fillStyle=`rgba(40,38,34,0.45)`;for(let n=0;n<4;n++){let r=n*t/4;e.fillRect(0,r,t,2);let i=n%2==0?0:t/2;e.fillRect(i,r,2,t/4),e.fillRect((i+t/2)%t,r,2,t/4)}})}function du(){return su(64,(e,t)=>{let n=Kl(6);e.fillStyle=`#5f5d57`,e.fillRect(0,0,t,t),cu(e,t,n,300,[`#4e4c47`,`#6c6a63`],1.5),e.strokeStyle=`rgba(30,30,28,0.6)`,e.lineWidth=3,e.strokeRect(0,0,t,t)})}function fu(){return su(128,(e,t)=>{let n=Kl(9);e.fillStyle=`#8b6535`,e.fillRect(0,0,t,t);for(let n=0;n<4;n++)e.fillStyle=n%2?`#80592d`:`#91693a`,e.fillRect(0,n*t/4+2,t,t/4-4);cu(e,t,n,500,[`#6d4a22`,`#a07a48`],1.5),e.strokeStyle=`#4f3618`,e.lineWidth=12,e.strokeRect(6,6,t-12,t-12),e.lineWidth=9,e.beginPath(),e.moveTo(10,10),e.lineTo(t-10,t-10),e.stroke()})}function pu(e,t){let n=su(64,(n,r)=>{n.clearRect(0,0,r,r),n.font=`bold 52px system-ui, sans-serif`,n.textAlign=`center`,n.textBaseline=`middle`,n.lineWidth=8,n.strokeStyle=`rgba(0,0,0,0.85)`,n.strokeText(e,r/2,r/2+3),n.fillStyle=t,n.fillText(e,r/2,r/2+3)});return n.wrapS=n.wrapT=_,n}function mu(){let e=su(64,(e,t)=>{e.clearRect(0,0,t,t);let n=t/2,r=e.createRadialGradient(n,n,0,n,n,n);r.addColorStop(0,`rgba(255,255,255,0.9)`),r.addColorStop(.5,`rgba(255,255,255,0.45)`),r.addColorStop(1,`rgba(255,255,255,0)`),e.fillStyle=r,e.fillRect(0,0,t,t)});return e.wrapS=e.wrapT=_,e}function hu(){let e=su(64,(e,t)=>{let n=t/2,r=e.createRadialGradient(n,n,0,n,n,n);r.addColorStop(0,`rgba(255,250,220,1)`),r.addColorStop(.25,`rgba(255,200,90,0.9)`),r.addColorStop(1,`rgba(255,120,20,0)`),e.fillStyle=r,e.beginPath();for(let t=0;t<16;t++){let r=t/16*Math.PI*2,i=t%2==0?n:n*.35;e.lineTo(n+Math.cos(r)*i,n+Math.sin(r)*i)}e.closePath(),e.fill()});return e.wrapS=e.wrapT=_,e}function gu(){return su(64,(e,t)=>{let n=Kl(21);e.fillStyle=`#8f8160`,e.fillRect(0,0,t,t);for(let n=0;n<3;n++){let r=n*t/3,i=n%2?t/4:0;for(let a=-1;a<3;a++){let o=i+a*t/2;e.fillStyle=n%2?`#a09070`:`#b1a17e`,e.beginPath(),e.ellipse(o+t/4,r+t/3/2,t/4-1,t/3/2-1,0,0,Math.PI*2),e.fill()}}cu(e,t,n,160,[`#6f6348`,`#c2b38f`],1.2)})}function _u(e,t,n){let r=document.createElement(`canvas`);r.width=e,r.height=t,n(r.getContext(`2d`),e,t);let i=new Ji(r);return i.colorSpace=nt,i.wrapS=i.wrapT=g,i.anisotropy=4,i}function vu(e,t,n,r,i,a,o){for(let s=0;s<i;s++){e.fillStyle=a[Math.floor(r()*a.length)];let i=.5+r()*o;e.globalAlpha=.25+r()*.5,e.fillRect(r()*t,r()*n,i,i)}e.globalAlpha=1}function yu(e,t,n){return _u(32,32,(r,i,a)=>{let o=Kl(n);r.fillStyle=e,r.fillRect(0,0,i,a),vu(r,i,a,o,120,[`rgba(0,0,0,0.5)`,`rgba(255,255,255,0.3)`],1.2),r.strokeStyle=t,r.lineWidth=2,r.strokeRect(0,0,i,a)})}var bu=new Map;function xu(e){let t=bu.get(e);return t||(t=Su(e),bu.set(e,t),t)}function Su(e){switch(e){case 1:return{side:_u(64,166,(e,t,n)=>{let r=Kl(31);e.fillStyle=`#7b6a5c`,e.fillRect(0,0,t,n);for(let i=0;i*9<n;i++){let n=i%2?-16:0;for(let a=n;a<t;a+=32){let t=120+Math.floor(r()*40);e.fillStyle=`rgb(${t+30},${Math.floor(t*.45)},${Math.floor(t*.32)})`,e.fillRect(a+1,i*9+1,30,7)}}vu(e,t,n,r,500,[`#5a2a1c`,`#c07050`],1.2),e.fillStyle=`rgba(40,30,25,0.35)`,e.fillRect(0,n-12,t,12)}),top:yu(`#6b4a3a`,`rgba(30,20,15,0.6)`,32)};case 2:return{side:_u(64,166,(e,t,n)=>{let r=Kl(33);e.fillStyle=`#d9cfb8`,e.fillRect(0,0,t,n),vu(e,t,n,r,700,[`#c4b89c`,`#e8e0cc`,`#b8ab8c`],1.6),e.fillStyle=`#4a3322`,e.fillRect(0,0,t,7),e.fillRect(0,n/2-3,t,6),e.fillRect(0,n-10,t,10),e.fillRect(0,0,5,n),e.strokeStyle=`#4a3322`,e.lineWidth=5,e.beginPath(),e.moveTo(0,n/2),e.lineTo(t,6),e.stroke(),e.fillStyle=`#2c3a44`,e.fillRect(20,n/2+18,24,26),e.fillStyle=`#4a3322`,e.fillRect(31,n/2+18,3,26)}),top:yu(`#7a5a40`,`rgba(40,25,15,0.7)`,34)};case 3:return{side:_u(64,166,(e,t,n)=>{let r=Kl(35);for(let i=0;i<t;i+=16){let t=95+Math.floor(r()*30);e.fillStyle=`rgb(${t},${Math.floor(t*.72)},${Math.floor(t*.45)})`,e.fillRect(i,0,16,n),e.fillStyle=`rgba(30,18,8,0.6)`,e.fillRect(i,0,2,n)}vu(e,t,n,r,400,[`#4a3218`,`#9a7a4a`],1.4),e.fillStyle=`rgba(30,18,8,0.5)`,e.fillRect(0,22,t,3),e.fillRect(0,n-26,t,3)}),top:yu(`#6a4c2c`,`rgba(30,18,8,0.7)`,36)};case 4:case 5:return{side:_u(64,166,(t,n,r)=>{let i=Kl(e===4?37:39);if(t.fillStyle=e===4?`#6e6a60`:`#6a6458`,t.fillRect(0,0,n,r),e===4)for(let e=0;e<r;e+=18){let r=-Math.floor(i()*20);for(;r<n;){let n=18+Math.floor(i()*20),a=110+Math.floor(i()*45);t.fillStyle=`rgb(${a},${a-4},${a-14})`,t.fillRect(r+1,e+1,n-2,16),r+=n}}vu(t,n,r,i,900,[`#4a463e`,`#8c877a`,`#5c574c`,`#7a8060`],2)}),top:yu(e===4?`#5a574f`:`#625c50`,`rgba(25,25,20,0.5)`,38)};case 6:return{side:_u(64,166,(e,t,n)=>{let r=Kl(41);for(let r=0;r<t;r+=8){let t=e.createLinearGradient(r,0,r+8,0);t.addColorStop(0,`#4c5a62`),t.addColorStop(.5,`#7d8c94`),t.addColorStop(1,`#4c5a62`),e.fillStyle=t,e.fillRect(r,0,8,n)}for(let i=0;i<8;i++)e.fillStyle=`rgba(${130+r()*40},${70+r()*20},40,0.35)`,e.fillRect(r()*t,r()*n,4+r()*10,6+r()*26);e.fillStyle=`rgba(20,25,28,0.5)`,e.fillRect(0,n-8,t,8)}),top:yu(`#55636a`,`rgba(20,25,28,0.7)`,42)};case 7:return{side:_u(64,166,(e,t,n)=>{let r=Kl(43);e.fillStyle=`#7a7a68`,e.fillRect(0,0,t,n);for(let i=0;i<9;i++)e.fillStyle=r()<.5?`rgba(80,90,60,0.55)`:`rgba(120,105,75,0.5)`,e.beginPath(),e.ellipse(r()*t,r()*n,8+r()*16,10+r()*24,r()*3,0,Math.PI*2),e.fill();vu(e,t,n,r,600,[`#55574a`,`#9a9a86`],1.6),e.fillStyle=`rgba(30,30,25,0.35)`;for(let r=30;r<n;r+=34)e.fillRect(0,r,t,2)}),top:yu(`#5c5d50`,`rgba(25,25,20,0.6)`,44)};default:return{side:uu(),top:du()}}}function Cu(){return _u(64,64,(e,t)=>{let n=Kl(51);e.fillStyle=`#ffffff`,e.fillRect(0,0,t,t);for(let r=0;r<8;r++){let i=r%2?4:0;for(let a=-8+i;a<t;a+=8){let t=200+Math.floor(n()*55);e.fillStyle=`rgb(${t},${t},${t})`,e.fillRect(a+1,r*8,6,7),e.fillStyle=`rgba(0,0,0,0.35)`,e.fillRect(a,r*8+6,8,2)}}})}function wu(e){return _u(64,64,(t,n)=>{let r=Kl(e?52:53);if(t.fillStyle=`#d8d8d8`,t.fillRect(0,0,n,n),e)for(let e=0;e<n;e+=8)t.fillStyle=`rgba(0,0,0,0.25)`,t.fillRect(e,0,2,n),t.fillStyle=`rgba(255,255,255,0.4)`,t.fillRect(e+4,0,2,n);vu(t,n,n,r,260,[`rgba(0,0,0,0.4)`,`rgba(255,255,255,0.4)`],1.5)})}function Tu(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Mr;c.morphTargetsRelative=s;let l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0,p=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let t in d.morphAttributes){if(!i.has(t))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;if(d.morphAttributes[t].length!==e[0].morphAttributes[t].length)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have the same number of morph targets for the "`+t+`" morph attribute.`),null;o[t]===void 0&&(o[t]=[]),o[t].push(d.morphAttributes[t]),p++}if(p!==i.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of morph attributes.`),null;if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=Eu(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=Eu(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function Eu(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new _r(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var Du=.5,Ou=60*Math.PI/180,ku=18*Math.PI/180,Au=.36,ju={uFogTex:{value:null},uFogRect:{value:new Xt(0,0,1,1)},uFogOn:{value:1}};function Z(e){if(e.userData.fog)return e;e.userData.fog=!0;let t=e.onBeforeCompile;e.onBeforeCompile=(n,r)=>{t.call(e,n,r),n.uniforms.uFogTex=ju.uFogTex,n.uniforms.uFogRect=ju.uFogRect,n.uniforms.uFogOn=ju.uFogOn,n.vertexShader=n.vertexShader.replace(`#include <common>`,`#include <common>
varying vec2 vFogXZ;`).replace(`#include <project_vertex>`,`#include <project_vertex>
        vec4 fogWp = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          fogWp = instanceMatrix * fogWp;
        #endif
        fogWp = modelMatrix * fogWp;
        vFogXZ = fogWp.xz;`),n.fragmentShader=n.fragmentShader.replace(`#include <common>`,`#include <common>
        varying vec2 vFogXZ;
        uniform sampler2D uFogTex;
        uniform vec4 uFogRect;
        uniform float uFogOn;`).replace(`#include <dithering_fragment>`,`vec2 fuv = ( vFogXZ - uFogRect.xy ) * uFogRect.zw;
        float fogK = 0.0;
        if ( fuv.x >= 0.0 && fuv.y >= 0.0 && fuv.x <= 1.0 && fuv.y <= 1.0 ) {
          vec4 fs = texture2D( uFogTex, fuv );
          fogK = max( fs.r, fs.g * ${Au.toFixed(2)} );
        }
        gl_FragColor.rgb *= mix( 1.0, fogK, uFogOn );
        #include <dithering_fragment>`)};let n=e.customProgramCacheKey.bind(e);return e.customProgramCacheKey=()=>`${n()}|fog`,e.needsUpdate=!0,e}var Mu=class e{map;gw;gh;ox=-1;oz=-1;target;vis;explored;tex;texture;enabled=!0;rays=540;version=0;constructor(e){this.map=e,this.gw=Math.round((e.w+2)/Du),this.gh=Math.round((e.h+2)/Du);let t=this.gw*this.gh;this.target=new Float32Array(t),this.vis=new Float32Array(t),this.explored=new Uint8Array(t),this.tex=new Uint8Array(t*4),this.texture=new wi(this.tex,this.gw,this.gh,le,T),this.texture.magFilter=S,this.texture.minFilter=S,this.texture.needsUpdate=!0}bind(){ju.uFogTex.value=this.texture,ju.uFogRect.value.set(this.ox,this.oz,1/(this.gw*Du),1/(this.gh*Du)),ju.uFogOn.value=+!!this.enabled}reset(){this.target.fill(0),this.vis.fill(0),this.explored.fill(0),this.version++}cellIndex(e,t){let n=Math.floor((e-this.ox)/Du),r=Math.floor((t-this.oz)/Du);return n<0||r<0||n>=this.gw||r>=this.gh?-1:r*this.gw+n}visibleAt(e,t){if(!this.enabled)return 1;let n=this.cellIndex(e,t);return n<0?0:this.vis[n]}seenNow(e,t){if(!this.enabled)return!0;let n=this.cellIndex(e,t);return n>=0&&this.target[n]>.3}exploredAt(e,t){if(!this.enabled)return!0;let n=this.cellIndex(e,t);return n>=0&&this.explored[n]===1}smoke=[];reveals=[];smokeMask=null;static SMOKE_SEE=1.2/Du;static BUSH_SEE=2.5/Du;compute(e,t,n,r=18){this.target.fill(0),this.buildSmokeMask();let i=this.rays,a=!1;for(let o=0;o<i;o++){let s=o/i*Math.PI*2-Math.PI,c=Math.abs(s),l=c<=Ou?1:c>=Ou+ku?0:1-(c-Ou)/ku,u=6+(r-6)*l;this.castRay(e,t,n+s,u)&&(a=!0)}for(let e of this.reveals){let t=Math.max(90,Math.round(e.r*24));for(let n=0;n<t;n++)this.castRay(e.x,e.z,n/t*Math.PI*2,e.r)&&(a=!0)}a&&this.version++}buildSmokeMask(){if(this.smoke.length===0){this.smokeMask=null;return}let e=this.smokeMask??new Uint8Array(this.gw*this.gh);e.fill(0);for(let t of this.smoke){let n=Math.floor((t.x-t.r-this.ox)/Du),r=Math.floor((t.x+t.r-this.ox)/Du),i=Math.floor((t.z-t.r-this.oz)/Du),a=Math.floor((t.z+t.r-this.oz)/Du);for(let o=Math.max(0,i);o<=Math.min(this.gh-1,a);o++)for(let i=Math.max(0,n);i<=Math.min(this.gw-1,r);i++){let n=this.ox+(i+.5)*Du,r=this.oz+(o+.5)*Du;(n-t.x)**2+(r-t.z)**2<=t.r*t.r&&(e[o*this.gw+i]=1)}}this.smokeMask=e}castRay(t,n,r,i){let a=this.target,o=this.gw,s=this.gh,c=(t-this.ox)/Du,l=(n-this.oz)/Du,u=i/Du,d=2/Du,f=this.smokeMask,p=!1,m=0,h=0,g=Math.sin(r),_=Math.cos(r),v=Math.floor(c),y=Math.floor(l),b=g>0?1:-1,x=_>0?1:-1,S=g===0?1/0:Math.abs(1/g),C=_===0?1/0:Math.abs(1/_),w=g===0?1/0:(g>0?v+1-c:c-v)*S,T=_===0?1/0:(_>0?y+1-l:l-y)*C,E=0;for(;E<=u&&!(v<0||y<0||v>=o||y>=s);){let t=y*o+v,n=E>u-d?(u-E)/d:1;n>a[t]&&(a[t]=n),this.explored[t]===0&&n>.15&&(this.explored[t]=1,p=!0);let r=Math.floor(v*Du+this.ox),i=Math.floor(y*Du+this.oz);if(this.map.blocksSight(r,i)){this.markTile(r,i,n)&&(p=!0);break}if(f&&f[t]&&(m++,m>e.SMOKE_SEE)||this.map.bush(r,i)&&(h++,h>e.BUSH_SEE))break;w<T?(E=w,w+=S,v+=b):(E=T,T+=C,y+=x)}return p}markTile(e,t,n){let r=Math.round(1/Du),i=Math.round((e-this.ox)/Du),a=Math.round((t-this.oz)/Du),o=!1;for(let e=0;e<r;e++)for(let t=0;t<r;t++){let r=i+t,s=a+e;if(r<0||s<0||r>=this.gw||s>=this.gh)continue;let c=s*this.gw+r;n>this.target[c]&&(this.target[c]=n),this.explored[c]===0&&n>.15&&(this.explored[c]=1,o=!0)}return o}smooth(e){ju.uFogOn.value=+!!this.enabled;let t=1-Math.exp(-e*10),n=this.vis.length,r=this.tex;for(let e=0;e<n;e++){let n=this.vis[e]+(this.target[e]-this.vis[e])*t;this.vis[e]=n;let i=e*4;r[i]=n*255|0,r[i+1]=this.explored[e]*255}this.texture.needsUpdate=!0}snap(){this.vis.set(this.target),this.smooth(0)}},Nu=class{parts=[];m=new tn;q=new Mt;e=new fn;add(e,t,n,r=[0,0,0],i=[1,1,1]){let a=e.index?e.toNonIndexed():e.clone();a.deleteAttribute(`uv`),this.e.set(r[0],r[1],r[2]),this.q.setFromEuler(this.e),this.m.compose(new z(...n),this.q,new z(...i)),a.applyMatrix4(this.m);let o=new V(t),s=a.getAttribute(`position`).count,c=new Float32Array(s*3);for(let e=0;e<s;e++)c[e*3]=o.r,c[e*3+1]=o.g,c[e*3+2]=o.b;return a.setAttribute(`color`,new br(c,3)),this.parts.push(a),this}box(e,t,n,r,i,a,o,s=[0,0,0]){return this.add(new U(e,t,n),r,[i,a,o],s)}cyl(e,t,n,r,i,a,o,s=[0,0,0],c=10){return this.add(new Qi(e,t,n,c),r,[i,a,o],s)}wheel(e,t,n,r,i,a){return this.cyl(e,e,t,n,r,i,a,[0,0,Math.PI/2],12)}ico(e,t,n,r,i,a=[1,1,1],o=[0,0,0]){return this.add(new ta(e,0),t,[n,r,i],o,a)}cone(e,t,n,r,i,a,o,s=[0,0,0]){return this.add(new $i(e,t,n),r,[i,a,o],s)}torus(e,t,n,r,i,a,o=[0,0,0]){return this.add(new aa(e,t,4,12),n,[r,i,a],o)}build(){return Tu(this.parts)}},Pu=5660735,Fu=4410161,Iu=7304272,Lu=2236962,Ru=5593436,zu=9080980,Bu=8017202,Vu=5913634,Hu=9209722,Uu=6973020,Wu=13216078,Gu=2762274,Ku=15132384,qu=2898500,Ju=Math.PI/2,Yu={truck(e){e.box(1.7,.35,3.7,Gu,0,.55,0);for(let t of[-1.3,-.6,1.25])for(let n of[-.82,.82])e.wheel(.38,.3,Lu,n,.38,t);e.box(1.7,1,1.05,Pu,0,1.2,1.3),e.box(1.5,.45,.06,qu,0,1.45,1.84),e.box(1.72,.12,1.1,Fu,0,1.76,1.3),e.box(1.8,.5,2.5,Fu,0,.95,-.55),e.box(1.8,.9,2.5,Iu,0,1.65,-.55),e.cyl(.9,.9,2.5,Iu,0,2.05,-.55,[Ju,0,0],8),e.box(.5,.1,.3,14205040,-.55,.85,1.86),e.box(.5,.1,.3,14205040,.55,.85,1.86)},jeep(e){e.box(1.5,.5,2.6,Pu,0,.7,0),e.box(1.5,.25,.9,Fu,0,.98,.8);for(let t of[-.85,.85])for(let n of[-.72,.72])e.wheel(.34,.26,Lu,n,.34,t);e.box(1.4,.5,.05,Ru,0,1.25,.32),e.box(.5,.35,.5,Iu,-.35,1.05,-.2),e.box(.5,.35,.5,Iu,.35,1.05,-.2),e.wheel(.3,.2,Lu,0,.9,-1.38),e.cyl(.015,.015,1.6,Ru,.6,1.6,-1.1)},wreck(e){e.box(2.1,.75,2.8,Gu,0,.5,0,[0,.25,.06]),e.box(.5,.55,3,1710102,-1,.3,.1,[0,.25,0]),e.box(.5,.55,3,1710102,1.05,.25,-.15,[0,.25,.12]),e.cyl(.7,.85,.5,3354154,.5,.95,-.6,[.25,0,.3]),e.cyl(.08,.1,1.9,1710102,.9,.7,.6,[1.2,.3,0]),e.ico(.3,3814446,-.8,.15,1.3,[1,.5,1]),e.ico(.25,3814446,1.1,.12,-1.3,[1,.5,1])},hedgehog(e){let t=4864560;e.box(.14,.14,1.35,t,0,.5,0,[.6,0,0]),e.box(.14,.14,1.35,t,0,.5,0,[.6,2.1,0]),e.box(.14,.14,1.35,t,0,.5,0,[.6,-2.1,0])},wire(e){for(let t of[-1.3,0,1.3])e.cyl(.04,.05,1,Vu,t,.5,0,[0,0,0],5);for(let t=-1.35;t<=1.36;t+=.27)e.torus(.32,.018,6974054,t,.4,0,[0,Ju,0])},tent(e){e.box(1.75,.06,2.9,Iu,-.62,.95,0,[0,0,.82]),e.box(1.75,.06,2.9,Iu,.62,.95,0,[0,0,-.82]),e.cyl(.04,.04,3.1,Vu,0,1.68,0,[Ju,0,0],5),e.box(1,1,.05,Gu,0,.55,1.42,[0,0,Ju/2]),e.box(.12,.6,.12,Vu,1.35,.3,1.35),e.box(.12,.6,.12,Vu,-1.35,.3,-1.35)},tower(e){for(let t of[-.75,.75])for(let n of[-.75,.75])e.cyl(.08,.1,3.6,Vu,t,1.8,n,[0,0,0],6);e.box(1.6,.08,.08,Vu,0,1.2,.75,[0,0,.9]),e.box(1.6,.08,.08,Vu,0,1.2,-.75,[0,0,-.9]),e.box(2,.15,2,Bu,0,3.4,0);for(let[t,n,r,i]of[[0,.95,2,.08],[0,-.95,2,.08],[.95,0,.08,2],[-.95,0,.08,2]])e.box(r,.8,i,Bu,t,3.85,n);for(let t of[-.9,.9])for(let n of[-.9,.9])e.box(.08,1.3,.08,Vu,t,4.4,n);e.cone(1.55,.8,4,4866096,0,5.4,0,[0,Math.PI/4,0]),e.box(.5,3.4,.05,Vu,0,1.7,1.05,[.15,0,0])},lamp(e){e.cyl(.12,.16,.3,Ru,0,.15,0),e.cyl(.05,.06,3.2,3356216,0,1.6,0,[0,0,0],6),e.box(.06,.06,.7,3356216,0,3.15,.3),e.box(.3,.12,.3,3356216,0,3.1,.62),e.box(.22,.04,.22,16771232,0,3.03,.62)},fence(e){e.box(3,.07,.05,Bu,0,.35,0),e.box(3,.07,.05,Bu,0,.75,0);for(let t=-1.42;t<=1.43;t+=.24)e.box(.09,.95+Math.abs(t*7)%.1,.04,t%.48?Bu:Vu,t,.48,.04)},well(e){e.cyl(.85,.9,.8,Hu,0,.4,0,[0,0,0],12),e.cyl(.65,.65,.05,1843750,0,.8,0,[0,0,0],12),e.box(.12,1.5,.12,Vu,-.8,1.3,0),e.box(.12,1.5,.12,Vu,.8,1.3,0),e.cyl(.07,.07,1.7,Bu,0,1.8,0,[0,0,Ju],6),e.box(1,.06,1.9,9062960,0,2.2,-.3,[.55,0,0]).box(1,.06,1.9,9062960,0,2.2,.3,[-.55,0,0]),e.cyl(.14,.12,.25,Ru,.1,1.35,0)},cart(e){e.box(1.6,.15,2.4,Bu,0,.75,.1);for(let t of[-.8,.8])e.box(.06,.4,2.4,Vu,t,.95,.1);e.wheel(.55,.1,Vu,-.9,.55,.1).wheel(.55,.1,Vu,.9,.55,.1),e.ico(.9,Wu,0,1.2,.2,[.95,.6,1.35]),e.box(.07,.07,1.4,Vu,-.35,.65,-1.6,[.15,0,0]).box(.07,.07,1.4,Vu,.35,.65,-1.6,[.15,0,0])},hay(e){e.cyl(.46,.46,.9,Wu,0,.46,0,[0,0,Ju],12),e.cyl(.47,.47,.06,11045434,.2,.46,0,[0,0,Ju],12)},bench(e){e.box(1.6,.06,.4,Bu,0,.45,0),e.box(1.6,.35,.05,Bu,0,.7,-.2,[-.15,0,0]);for(let t of[-.7,.7])e.box(.06,.45,.4,3356216,t,.22,0)},rock(e){e.ico(.8,8025450,-.2,.45,.1,[1.1,.75,1],[.3,.5,.2]),e.ico(.55,6973020,.55,.3,-.35,[1,.8,1.1],[.1,1.5,.4]),e.ico(.35,8748914,.4,.2,.6,[1,.7,1],[.6,.2,0])},logs(e){[[-.42,0,.21],[0,0,.21],[.42,0,.21],[-.21,0,.57],[.21,0,.57],[0,0,.93]].forEach(([t,,n],r)=>e.cyl(.2,.2,2.7,r%2?Bu:9069632,0,n,t*.9,[0,0,Ju],8)),e.cyl(.21,.21,.02,13148272,1.36,.21,-.38,[0,0,Ju],8)},container(e){let t=12105912;e.box(1.9,2.3,4.8,14737632,0,1.2,0);for(let n=-2.2;n<=2.21;n+=.4)e.box(.06,2.1,.12,t,.97,1.2,n),e.box(.06,2.1,.12,t,-.97,1.2,n);e.box(1.94,.12,4.84,10132122,0,.06,0),e.box(1.94,.12,4.84,10132122,0,2.36,0),e.box(.04,2.1,.04,7368816,0,1.2,2.42),e.box(.04,2,.04,7368816,-.4,1.2,2.42).box(.04,2,.04,7368816,.4,1.2,2.42)},pipes(e){for(let t=-2.5;t<=2.51;t+=2.5)e.box(.1,1.8,.1,Ru,-.35,.9,t).box(.1,1.8,.1,Ru,.35,.9,t),e.box(.8,.1,.12,Ru,0,1,t).box(.8,.1,.12,Ru,0,1.75,t);e.cyl(.2,.2,6,10127962,-.1,1.2,0,[Ju,0,0],10),e.cyl(.13,.13,6,zu,.2,1.9,0,[Ju,0,0],8),e.torus(.18,.03,11549226,-.1,1.55,1.2,[Ju,0,0]),e.cyl(.24,.24,.12,6969914,-.1,1.2,-1.25,[Ju,0,0],10)},silo(e){e.cyl(1.35,1.35,3.2,13159624,0,1.6,0,[0,0,0],16),e.cyl(1.38,1.38,.12,9080980,0,1,0,[0,0,0],16),e.cyl(1.38,1.38,.12,9080980,0,2.2,0,[0,0,0],16),e.cone(1.4,.6,16,11580592,0,3.5,0),e.box(.4,3.4,.08,Ru,1,1.7,1,[0,Math.PI/4,0]),e.box(.6,.6,.06,14200880,0,1.6,1.36),e.cyl(.08,.08,1.2,Ru,-1,.4,-1.4,[Ju,0,0],6)},chimney(e){e.box(1.9,1,1.9,6965818,0,.5,0),e.cyl(.55,.8,7,9062964,0,4.4,0,[0,0,0],12),e.cyl(.62,.62,.35,3811874,0,7.8,0,[0,0,0],12),e.cyl(.6,.6,.15,14211280,0,6.6,0,[0,0,0],12),e.cyl(.66,.66,.15,12073514,0,6.3,0,[0,0,0],12)},rails(e){for(let t=-3.8;t<=3.81;t+=.6)e.box(2,.08,.24,Vu,0,.04,t);e.box(.08,.12,8,zu,-.72,.12,0).box(.08,.12,8,zu,.72,.12,0)},boat(e){let t=5595210;e.box(2.8,.4,5.2,4147002,0,.25,-.2),e.box(.15,1.4,5.2,t,-1.35,.8,-.2).box(.15,1.4,5.2,t,1.35,.8,-.2),e.box(2.8,1.6,.6,t,0,.9,-2.6),e.box(1,.7,.8,4871232,.6,1.95,-2.4),e.box(2.6,.1,1.6,t,0,.35,2.9,[-.25,0,0]),e.box(2.5,.05,4.5,3027752,0,.47,0)},radar(e){e.box(1.6,.6,1.6,Fu,0,.3,0),e.cyl(.1,.14,1.6,Ru,0,1.4,0,[0,0,0],8),e.cyl(1.1,.25,.35,13159624,0,2.3,.1,[-.9,0,0],14),e.cyl(.03,.03,.9,Ru,0,2.6,.5,[-.9,0,0],4),e.box(.5,.4,.4,Ru,.55,.8,.4)},antenna(e){e.box(.5,.2,.5,Uu,0,.1,0),e.cyl(.05,.1,6,6975088,0,3,0,[0,0,0],4);for(let t=1;t<6;t+=1.2)e.box(.7-t*.07,.04,.04,6975088,0,t,0);e.cyl(.08,.08,.2,13642266,0,6.05,0,[0,0,0],6),e.cyl(.01,.01,4.2,2236962,.9,2.1,0,[0,0,.22],3)},crater(e){e.cyl(1.35,1.45,.04,3025442,0,.025,0,[0,0,0],14),e.cyl(.8,.9,.04,1973014,0,.04,0,[0,0,0],12);let t=Kl(3);for(let n=0;n<9;n++){let r=n/9*Math.PI*2;e.ico(.18+t()*.1,4866612,Math.cos(r)*1.35,.06,Math.sin(r)*1.35,[1.2,.5,1])}},rubble(e){let t=Kl(17),n=[Hu,Uu,9062964,10130568,Gu];for(let r=0;r<14;r++){let i=.2+t()*.5;e.box(i,.15+t()*.3,.2+t()*.4,n[r%n.length],(t()-.5)*1.5,.1+t()*.35,(t()-.5)*1.5,[t(),t()*3,t()])}e.box(1.2,.08,.1,Vu,.1,.5,-.2,[.3,.7,.4])},flag(e){e.box(.4,.2,.4,Uu,0,.1,0),e.cyl(.035,.045,4.2,zu,0,2.1,0,[0,0,0],6),e.box(.04,.6,1,9051678,0,3.75,.52),e.box(.05,.12,1,1710618,0,3.75,.52)},grave(e){e.box(.12,.9,.1,Hu,0,.45,0),e.box(.5,.1,.1,Hu,0,.68,0),e.box(.5,.08,.9,4872754,0,.04,.4)},fountain(e){e.cyl(1.4,1.5,.55,Hu,0,.27,0,[0,0,0],16),e.cyl(1.2,1.2,.04,4161439,0,.5,0,[0,0,0],16),e.cyl(.18,.25,1.4,Uu,0,.9,0,[0,0,0],8),e.cyl(.55,.2,.25,Hu,0,1.6,0,[0,0,0],10),e.cyl(.42,.42,.03,4161439,0,1.72,0,[0,0,0],10),e.ico(.16,12103840,0,1.9,0)},steeple(e){e.box(2.8,7,2.8,9209722,0,3.5,0),e.box(2.9,.2,2.9,6973020,0,2.6,0);for(let[t,n,r,i]of[[0,1.41,.7,.05],[0,-1.41,.7,.05],[1.41,0,.05,.7],[-1.41,0,.05,.7]])e.box(r,1.3,i,1842204,t,5.9,n);e.box(3,.25,3,6973020,0,7.1,0),e.cone(2.1,3.6,4,4082258,0,9,0,[0,Math.PI/4,0]),e.box(.08,.8,.08,13150272,0,11.2,0).box(.45,.08,.08,13150272,0,11.3,0),e.cyl(.45,.45,.05,15261896,0,4.4,1.41,[Ju,0,0],12)},wagon(e){e.box(1.9,2,5.6,14737632,0,1.6,0);for(let t=-2.4;t<=2.41;t+=.8)e.box(.06,2,.08,11579568,.96,1.6,t),e.box(.06,2,.08,11579568,-.96,1.6,t);e.cyl(1.05,1.05,5.7,10132122,0,2.15,0,[Ju,0,0],12),e.box(1.7,.35,5.8,Gu,0,.5,0);for(let t of[-1.9,-1.2,1.2,1.9])e.wheel(.38,1.5,3355443,0,.38,t);e.box(.8,1.6,.05,9079434,0,1.5,0)},barrels(e){let t=[3103354,3824170,3103354];[[-.4,-.4],[.35,-.45],[-.4,.3]].forEach(([n,r],i)=>{e.cyl(.3,.3,.9,t[i],n,.45,r,[0,0,0],12),e.cyl(.31,.31,.05,2236962,n,.7,r,[0,0,0],12)}),e.cyl(.3,.3,.9,6962468,.45,.3,.45,[0,.6,Ju],12)},generator(e){e.box(1.6,.9,.8,Pu,0,.6,0),e.box(1.4,.1,.85,Fu,0,1.08,0),e.cyl(.06,.06,.6,3355443,.6,1.35,-.2,[0,0,0],6),e.box(.4,.3,.05,1842204,-.3,.75,.41),e.box(.08,.08,.04,3858266,-.4,.8,.43),e.wheel(.18,.12,Lu,-.75,.18,0).wheel(.18,.12,Lu,.75,.18,0)},railing(e){for(let t=-1.4;t<=1.41;t+=.7)e.box(.08,1,.08,Ru,t,.5,0);e.box(3,.08,.1,zu,0,1,0).box(3,.05,.05,Ru,0,.55,0)},lowwall(e){e.box(1.02,.78,.5,Uu,0,.39,0);let t=Kl(41),n=[Hu,10130566,8288364,Uu];for(let r=0;r<3;r++)for(let i=0;i<3;i++){let a=-.36+i*.36+r%2*.12+(t()-.5)*.06;for(let o of[-1,1])e.box(.3+t()*.08,.22,.08,n[(i+r+ +(o>0))%n.length],Math.min(.42,a),.14+r*.24,o*.25,[0,0,(t()-.5)*.15])}e.box(1.04,.1,.6,9407100,0,.83,0),e.box(.26,.03,.22,5925438,(t()-.5)*.5,.885,.08)},woodpile(e){e.box(1.9,.08,.9,Vu,0,.04,0);for(let t=0;t<3;t++)for(let n=0;n<4-t;n++)e.cyl(.13,.13,.85,n%2?Bu:9069632,-.6+n*.32+t*.16,.2+t*.24,0,[Ju,0,0],7);e.box(.06,.06,.9,Vu,.75,.2,0),e.box(.5,.06,.7,4864552,.2,.92,0,[0,0,.12])},garden(e){e.box(1.9,.08,2.9,4864552,0,.04,0);for(let t of[-.95,.95])e.box(.06,.16,2.9,Vu,t,.08,0);let t=Kl(7);for(let n=0;n<3;n++)for(let r=0;r<6;r++)e.ico(.12+t()*.06,n===1?6982202:5208622,-.55+n*.55,.17,-1.2+r*.48,[1,.8,1]);for(let t=0;t<3;t++)e.cone(.07,.12,5,12607536,.55,.12,-.9+t*.9,[Ju*2,0,0])},laundry(e){for(let t of[-1.4,1.4])e.box(.07,1.7,.07,Vu,t,.85,0);e.box(2.8,.02,.02,13619136,0,1.6,0),[Ku,9083568,11553338,Ku,6978122].forEach((t,n)=>e.box(.32+n%2*.12,.45+n%3*.12,.03,t,-1.05+n*.52,1.35-n%3*.06,0))},table(e){e.box(.8,.05,.6,Bu,0,.74,0);for(let[t,n]of[[-.34,-.24],[.34,-.24],[-.34,.24],[.34,.24]])e.box(.05,.72,.05,Vu,t,.36,n);for(let t of[-.42,.42]){e.box(.36,.04,.34,Vu,0,.44,t),e.box(.36,.42,.04,Vu,0,.64,t+Math.sign(t)*.16);for(let n of[-.15,.15])e.box(.04,.44,.04,Vu,n,.22,t)}e.cyl(.05,.04,.1,14209216,.15,.82,.05,[0,0,0],8),e.box(.2,.02,.14,15261896,-.15,.775,-.05)},bed(e){e.box(.86,.3,1.9,Vu,0,.25,0),e.box(.8,.14,1.84,14210248,0,.45,.02),e.box(.8,.12,1.2,5925448,0,.5,.3),e.box(.5,.1,.3,15526108,0,.54,-.7),e.box(.9,.7,.06,Vu,0,.45,-.95)},shelf(e){e.box(.9,1.8,.35,Vu,0,.9,-.3);for(let t of[.4,.8,1.2,1.6])e.box(.84,.03,.33,Bu,0,t,-.28);let t=[9058858,3824250,13152368,4876858,6965866];for(let n=0;n<9;n++)e.box(.07,.24,.2,t[n%t.length],-.35+n%4*.2+(n>3?.08:0),.53+Math.floor(n/4)*.4,-.27);e.cyl(.07,.06,.16,12103840,.3,1.29,-.27,[0,0,0],8)},stove(e){e.box(.75,.8,.6,2894890,0,.4,-.15),e.box(.78,.04,.62,4868678,0,.82,-.15),e.box(.3,.25,.02,1314828,-.12,.35,.16),e.box(.28,.22,.01,13656096,-.12,.35,.165),e.cyl(.08,.08,1.7,3815992,.22,1.65,-.35,[0,0,0],8),e.cyl(.13,.1,.16,5921366,-.15,.92,-.2,[0,0,0],10)},rug(e){e.box(1.6,.02,1.2,8006178,0,.012,0),e.box(1.4,.022,1,11035690,0,.013,0),e.box(1,.024,.6,5909020,0,.014,0)},stump(e){e.cyl(.26,.32,.4,Vu,0,.2,0,[0,0,0],8),e.cyl(.24,.24,.02,11569754,0,.41,0,[0,0,0],8),e.box(.12,.1,.5,Vu,.22,.05,.15,[0,.6,0])}},Xu={container:10502192,wagon:8010282},Zu=new Map;function Qu(e){let t=Zu.get(e);if(!t){let n=new Nu;Yu[e](n),t=n.build(),Zu.set(e,t)}return t}function $u(e){let t=new An;t.name=`props`;let n=new Map;for(let t of e.props){let e=n.get(t.type);e||n.set(t.type,e=[]),e.push(t)}let r=new tn,i=new Mt,a=new z(0,1,0),o=new z(1,1,1),s=new z,c=new V;for(let[e,l]of n){let n=new Ni(Qu(e),Z(new W({vertexColors:!0,flatShading:!0})),l.length),u=nu[e];l.forEach((t,l)=>{let[d,f]=t.rot%2?[u.d,u.w]:[u.w,u.d];s.set(t.x+d/2,0,t.z+f/2),i.setFromAxisAngle(a,t.rot*Math.PI/2),r.compose(s,i,o),n.setMatrixAt(l,r),n.setColorAt(l,c.set(t.color??Xu[e]??16777215))}),n.castShadow=e!==`crater`&&e!==`rails`,n.receiveShadow=!0,n.name=`prop-${e}`,t.add(n)}return t}var ed=$l[q.Wall].height,td=.25,nd=.15;function rd(e,t){let n=new Mr;return n.setAttribute(`position`,new br(e,3)),n.setAttribute(`uv`,new br(t,2)),n.computeVertexNormals(),n}function id(e,t){let n=e.w>=e.h,r=(n?e.w:e.h)+td*2,i=(n?e.h:e.w)/2+td,a=ed-.05,o=ed+t,s=Math.hypot(i,t),c=[],l=[],u=(t,r,i)=>{let a=e.x+e.w/2,o=e.z+e.h/2;return n?[a+t,r,o+i]:[a+i,r,o+t]},d=(e,t)=>{for(let n of[0,1,2,0,2,3])c.push(...e[n]),l.push(...t[n])},f=r/2,p=r/2,m=s/2;d([u(-f,a,-i),u(f,a,-i),u(f,o,0),u(-f,o,0)],[[0,0],[p,0],[p,m],[0,m]]),d([u(f,a,i),u(-f,a,i),u(-f,o,0),u(f,o,0)],[[0,0],[p,0],[p,m],[0,m]]);let h=rd(c,l),g=[],_=[];for(let e of[-f+td+.25,f-td-.25]){let n=i-td-.25;for(let r of[u(e,ed,-n),u(e,ed,n),u(e,ed+n/i*t,0)])g.push(...r);_.push(0,0,1,0,.5,.5)}let v=rd(g,_);return h.userData.gable=v,h}function ad(e){let t=[],n=e.x+e.w/2,r=e.z+e.h/2,i=new U(e.w+.2,.2,e.h+.2);i.translate(n,ed+.1,r),t.push(i);for(let[i,a,o,s]of[[e.w+.2,.15,n,e.z-.02],[e.w+.2,.15,n,e.z+e.h+.02],[.15,e.h+.2,e.x-.02,r],[.15,e.h+.2,e.x+e.w+.02,r]]){let e=new U(i,.3,a);e.translate(o,ed+.3,s),t.push(e)}let a=Math.max(1,Math.floor(e.w*e.h/40));for(let n=0;n<a;n++){let i=new U(.8,.45,.8);i.translate(e.x+(n+1)*e.w/(a+1),ed+.42,r+(n%2?.8:-.8)),t.push(i)}return Tu(t.map(e=>e.toNonIndexed()))}var od=null,sd=null,cd=null;function ld(e){od??=Cu(),sd??=wu(!0),cd??=wu(!1);let t=new An;t.name=`roofs`;let n=[];for(let r of e.roofs){let e=[],i=[],a=(e,t)=>{let n=Z(new W({map:e,color:t,transparent:!0,side:2}));return i.push(n),n};if(r.kind===`flat`)e.push(new H(ad(r),a(cd,r.color)));else{let t=Math.min(r.w,r.h),n=r.kind===`metal`?Math.min(.7,t*.12):Math.min(2,t*.32),i=id(r,n);e.push(new H(i,a(r.kind===`metal`?sd:od,r.color))),e.push(new H(i.userData.gable,a(cd,r.kind===`metal`?8227472:14208176)));{let t=r.w>=r.h,n=(t?r.w:r.h)+td*2,i=(t?r.h:r.w)/2+td,o=r.x+r.w/2,s=r.z+r.h/2,c=[];for(let e of[-1,1]){let r=new U(t?n:.12,.1,t?.12:n).toNonIndexed();r.translate(t?o:o+e*(i+.04),ed-.1,t?s+e*(i+.04):s),c.push(r);let a=e<0?-1:1,l=t?o+a*(n/2-td-.1):o+e*(i-td+.05),u=t?s+e*(i-td+.05):s+a*(n/2-td-.1);c.push(new U(.08,ed,.08).translate(l,ed/2-.1,u).toNonIndexed())}e.push(new H(Tu(c),a(cd,5922400)))}if(r.kind===`gable`&&Math.max(r.w,r.h)>=9&&Math.min(r.w,r.h)>=6){let t=r.w>=r.h,i=(t?r.h:r.w)/2;Math.atan2(n,i+td);let o=(r.x+r.z)%2?1:-1,s=[],c=[];for(let e of[-1,1]){if(Math.max(r.w,r.h)<12&&e>0)continue;let a=Math.max(r.w,r.h)<12?0:e*(Math.max(r.w,r.h)*.22),l=o*i*.45,u=ed+n*(1-Math.abs(l)/(i+td))-.05,[d,f]=t?[r.x+r.w/2+a,r.z+r.h/2+l]:[r.x+r.w/2+l,r.z+r.h/2+a],p=new U(t?.9:.8,.75,t?.8:.9).toNonIndexed();p.translate(d,u+.3,f),s.push(p);for(let e of[-1,1]){let n=new U(t?.62:1,.05,t?1:.62).toNonIndexed();t?n.rotateZ(e*.6):n.rotateX(e*.6),n.translate(d+(t?e*.24:0),u+.82,f+(t?0:e*.24)),s.push(n)}let m=new U(t?.5:.04,.38,t?.04:.5).toNonIndexed();m.translate(d+(t?0:o*.41),u+.32,f+(t?o*.41:0)),c.push(m)}s.length&&(e.push(new H(Tu(s),a(od,r.color))),e.push(new H(Tu(c),a(cd,2898500))))}if(r.kind===`gable`&&r.w*r.h>=24){let t=r.w>=r.h,i=(r.x*3+r.z)%2?.25:.75,o=t?r.x+r.w*i:r.x+r.w/2+.35,s=t?r.z+r.h/2+.35:r.z+r.h*i,c=ed+n+.6,l=[new U(.55,c-ed+.3,.55).translate(o,(c+ed)/2-.15,s).toNonIndexed(),new U(.68,.12,.68).translate(o,c,s).toNonIndexed()];e.push(new H(Tu(l),a(cd,9062970)))}}for(let n of e)n.castShadow=!0,n.receiveShadow=!0,t.add(n);n.push({spec:r,meshes:e,mats:i,alpha:1})}return{group:t,update(e,t,r){for(let i of n){let n=i.spec,a=e>n.x-nd&&e<n.x+n.w+nd&&t>n.z-nd&&t<n.z+n.h+nd?0:1;if(i.alpha!==a){i.alpha=a>i.alpha?Math.min(1,i.alpha+r*4):Math.max(0,i.alpha-r*5);for(let e of i.mats)e.opacity=i.alpha,e.depthWrite=i.alpha>.95;for(let e of i.meshes)e.visible=i.alpha>.01,e.castShadow=i.alpha>.95}}}}}var ud=Math.PI/2,dd={leafy(e){e.cyl(.12,.19,1.8,5914918,0,.9,0,[0,0,0],7),e.cyl(.05,.07,.7,5914918,.25,1.6,0,[0,0,-.8],5),e.ico(.78,3366700,0,2.15,0),e.ico(.56,4025394,.42,2.55,.18),e.ico(.5,2773542,-.36,2.45,-.28),e.ico(.42,4618808,.05,2.85,-.1)},pine(e){e.cyl(.1,.16,1.2,4862496,0,.6,0,[0,0,0],6),e.cone(1,1.4,7,2377002,0,1.45,0),e.cone(.78,1.15,7,2773040,0,2.15,0,[0,.4,0]),e.cone(.52,.95,7,3168820,0,2.8,0,[0,.8,0])},birch(e){e.cyl(.09,.13,2.2,14210246,0,1.1,0,[0,0,0],7);for(let t of[.5,.9,1.4,1.8])e.box(.2,.05,.2,2763304,0,t,0,[0,t*3,0]);e.ico(.55,7313988,.1,2.4,0,[1,1.2,1]),e.ico(.45,8366158,-.3,2.1,.2),e.ico(.4,6261308,.3,2,-.25)},bush(e){e.ico(.45,4880950,0,.36,0,[1,.85,1]),e.ico(.34,4156462,.3,.3,.16),e.ico(.3,5604924,-.26,.28,-.2)},berry(e){dd.bush(e);for(let[t,n,r]of[[.2,.62,.25],[-.25,.5,.3],[.4,.45,-.1],[-.1,.7,-.2],[.05,.55,.4]])e.ico(.055,11545130,t,n,r)},tuft(e){let t=new $i(.035,.34,3);for(let n=0;n<5;n++){let r=n/5*Math.PI*2;e.add(t,n%2?6982210:5600308,[Math.cos(r)*.05,.15,Math.sin(r)*.05],[Math.sin(r)*.35,0,Math.cos(r)*.35])}},dryTuft(e){let t=new $i(.03,.3,3);for(let n=0;n<4;n++){let r=n/4*Math.PI*2+.3;e.add(t,n%2?12100714:10127960,[Math.cos(r)*.04,.13,Math.sin(r)*.04],[Math.sin(r)*.4,0,Math.cos(r)*.4])}},flowersY(e){dd.tuft(e);for(let[t,n]of[[.08,.02],[-.06,.07],[.01,-.09]])e.ico(.05,15781952,t,.32,n)},flowersW(e){dd.tuft(e);for(let[t,n]of[[.07,-.04],[-.08,.02],[.02,.09]])e.ico(.05,15921386,t,.3,n)},flowersP(e){dd.tuft(e);for(let[t,n]of[[.05,.06],[-.07,-.05]])e.ico(.055,10115784,t,.31,n)},pebbles(e){e.ico(.08,8025450,0,.03,0,[1,.6,1.2]),e.ico(.06,9077880,.14,.02,.06,[1.2,.6,1]),e.ico(.05,6249040,-.08,.02,.12,[1,.7,1])},shells(e){e.ico(.06,15786704,0,.015,0,[1.3,.35,1]),e.ico(.045,15251624,.15,.012,-.05,[1.2,.35,1]),e.cyl(.02,.02,.45,9073752,-.1,.02,.12,[0,.6,ud],4)},debris(e){e.box(.12,.05,.08,9078654,0,.025,0,[0,.5,0]),e.box(.08,.04,.1,6973278,.14,.02,.08,[0,1.2,0]),e.box(.15,.01,.1,14210248,-.12,.006,-.06,[0,.3,0])}},fd=new Map;function pd(e){let t=fd.get(e);if(!t){let n=new Nu;dd[e](n),t=n.build(),fd.set(e,t)}return t}function md(e,t){let n=new An;n.name=`vegetation`;let r=Kl(e.w*7+e.h*13),i=new Map,a=(e,t)=>{let n=i.get(e);n||i.set(e,n=[]),n.push(t)},o=e=>.82+r()*e,s=e.id===`fortress`?.6:e.id===`forest`?.42:.25;for(let n=0;n<e.h;n++)for(let i=0;i<e.w;i++){let c=e.get(i,n);if(c===q.Tree){let e=r(),t=e<s?`pine`:e<s+.15?`birch`:`leafy`,c=.85+r()*.4;a(t,{x:i+.5+(r()-.5)*.25,z:n+.5+(r()-.5)*.25,rot:r()*6.3,s:c,sy:c*(.9+r()*.35),tint:o(.3)});continue}if(c===q.Bush){let e=.95+r()*.35;a(r()<.2?`berry`:`bush`,{x:i+.5+(r()-.5)*.2,z:n+.5+(r()-.5)*.2,rot:r()*6.3,s:e,sy:e*.85,tint:o(.3)});continue}if(c!==q.Floor||t<=0)continue;let l=e.ground?e.groundAt(i,n):Y.Grass;for(let e=0;e<2;e++){let e=r(),s=i+.1+r()*.8,c=n+.1+r()*.8,u=.7+r()*.6,d={x:s,z:c,rot:r()*6.3,s:u,sy:u*(.8+r()*.5),tint:o(.35)},f=``;l===Y.Grass?e<.42*t?f=`tuft`:e<.47*t?f=[`flowersY`,`flowersW`,`flowersP`][Math.floor(r()*3)]:e<.51*t&&(f=`pebbles`):l===Y.Sand?e<.05*t?f=`shells`:e<.11*t?f=`dryTuft`:e<.14*t&&(f=`pebbles`):l===Y.Dirt?e<.12*t?f=`pebbles`:e<.2*t?f=`dryTuft`:e<.26*t&&(f=`tuft`):l===Y.Concrete?e<.05*t?f=`debris`:e<.07*t&&(f=`dryTuft`):l===Y.Planks&&e<.03*t&&(f=`debris`),f&&a(f,d)}}let c=new tn,l=new Mt,u=new fn,d=new z,f=new z,p=new V,m=new Set([`leafy`,`pine`,`birch`,`bush`,`berry`]);for(let[e,t]of i){let r=new Ni(pd(e),Z(new W({vertexColors:!0,flatShading:!0})),t.length);t.forEach((e,t)=>{u.set(0,e.rot,0),l.setFromEuler(u),d.set(e.x,0,e.z),f.set(e.s,e.sy,e.s),c.compose(d,l,f),r.setMatrixAt(t,c),r.setColorAt(t,p.setRGB(e.tint,e.tint*(.95+(e.tint-.82)*.2),e.tint*.9))}),r.castShadow=m.has(e),r.receiveShadow=!0,r.name=`veg-${e}`,n.add(r)}return n}var hd={[Y.Grass]:{base:[86,100,58],spots:[`#3f4b2a`,`#6d7a46`,`#7b6a4a`,`#4a5a32`]},[Y.Sand]:{base:[196,178,128],spots:[`#b39c68`,`#d8c792`,`#a68d5a`,`#e2d3a2`]},[Y.Dirt]:{base:[112,92,64],spots:[`#5e4a32`,`#8a7350`,`#6b5a3c`,`#9a8460`]},[Y.Concrete]:{base:[128,126,118],spots:[`#6f6d66`,`#9a978e`,`#85827a`]},[Y.Planks]:{base:[116,82,52],spots:[`#5e4028`,`#8a6440`,`#6e4c30`]}},gd=16;function _d(e,t){let n=e.w+t*2,r=e.h+t*2,i=document.createElement(`canvas`);i.width=n,i.height=r;let a=i.getContext(`2d`),o=a.createImageData(n,r);for(let i=0;i<r;i++)for(let r=0;r<n;r++){let a=Math.min(e.w-1,Math.max(0,r-t)),s=Math.min(e.h-1,Math.max(0,i-t)),c=hd[e.groundAt(a,s)].base,l=(i*n+r)*4;o.data[l]=c[0],o.data[l+1]=c[1],o.data[l+2]=c[2],o.data[l+3]=255}a.putImageData(o,0,0);let s=document.createElement(`canvas`);s.width=n*gd,s.height=r*gd;let c=s.getContext(`2d`);c.imageSmoothingEnabled=!0,c.imageSmoothingQuality=`high`,c.filter=`blur(${gd*.45}px)`,c.drawImage(i,0,0,s.width,s.height),c.filter=`none`;let l=Kl(e.w*131+e.h),u=Math.round(n*r*9);for(let n=0;n<u;n++){let n=l()*s.width,r=l()*s.height,i=Math.min(e.w-1,Math.max(0,Math.floor(n/gd)-t)),a=Math.min(e.h-1,Math.max(0,Math.floor(r/gd)-t)),o=hd[e.groundAt(i,a)].spots;c.fillStyle=o[Math.floor(l()*o.length)],c.globalAlpha=.25+l()*.45;let u=1+l()*2.4;c.fillRect(n,r,u,u)}c.globalAlpha=1;let d=(n,r)=>{let i=Math.min(e.w-1,Math.max(0,Math.floor(n/gd)-t)),a=Math.min(e.h-1,Math.max(0,Math.floor(r/gd)-t));return e.groundAt(i,a)},f=Math.round(n*r*14);c.lineCap=`round`;for(let e=0;e<f;e++){let t=l()*s.width,n=l()*s.height,r=d(t,n);if(r===Y.Grass)c.strokeStyle=l()<.5?`rgba(130,150,80,0.55)`:`rgba(46,62,30,0.5)`,c.lineWidth=1,c.beginPath(),c.moveTo(t,n),c.lineTo(t+(l()-.5)*3,n-2-l()*4),c.stroke();else if(r===Y.Sand&&e%6==0)c.strokeStyle=l()<.5?`rgba(160,138,90,0.35)`:`rgba(236,224,180,0.35)`,c.lineWidth=1.2,c.beginPath(),c.moveTo(t,n),c.quadraticCurveTo(t+6,n-2,t+14,n+(l()-.5)*2),c.stroke();else if(r===Y.Dirt&&e%4==0){let e=.8+l()*1.6;c.fillStyle=`rgba(60,48,34,0.6)`,c.beginPath(),c.arc(t,n,e,0,Math.PI*2),c.fill(),c.fillStyle=`rgba(190,170,130,0.45)`,c.fillRect(t-e*.5,n-e*.6,e*.7,e*.5)}}for(let n=0;n<e.h;n++)for(let r=0;r<e.w;r++){if(e.groundAt(r,n)!==Y.Planks)continue;let i=(r+t)*gd,a=(n+t)*gd;for(let e=0;e<4;e++){let t=a+gd/4*e;c.fillStyle=e%2?`rgba(140,100,64,0.35)`:`rgba(90,62,38,0.25)`,c.fillRect(i,t,gd,gd/4),c.fillStyle=`rgba(40,26,16,0.6)`,c.fillRect(i,t,gd,1),(r+e*3+n)%3==0&&c.fillRect(i+e*5%gd,t,1,gd/4)}l()<.15&&(c.fillStyle=`rgba(50,32,20,0.6)`,c.fillRect(i+l()*gd,a+l()*gd,2,1.5))}for(let n=0;n<e.h;n++)for(let r=0;r<e.w;r++){if(e.groundAt(r,n)!==Y.Concrete)continue;let i=(r+t)*gd,a=(n+t)*gd;if(c.fillStyle=`rgba(70,68,62,0.55)`,r%2==0&&c.fillRect(i,a,1,gd),n%2==0&&c.fillRect(i,a,gd,1),l()<.08){c.strokeStyle=`rgba(60,58,52,0.6)`,c.lineWidth=1,c.beginPath();let e=i+l()*gd,t=a+l()*gd;c.moveTo(e,t);for(let n=0;n<4;n++)e+=(l()-.5)*10,t+=(l()-.5)*10,c.lineTo(e,t);c.stroke()}if(l()<.025){let e=c.createRadialGradient(i+gd/2,a+gd/2,0,i+gd/2,a+gd/2,gd*.8);e.addColorStop(0,`rgba(30,28,26,0.45)`),e.addColorStop(1,`rgba(30,28,26,0)`),c.fillStyle=e,c.fillRect(i-gd,a-gd,48,48)}}let p=document.createElement(`canvas`);p.width=n,p.height=r;let m=p.getContext(`2d`);for(let n=0;n<e.h;n++)for(let r=0;r<e.w;r++){let i=e.get(r,n),a=i===q.Wall||i===q.PropHigh?.75:i===q.Crate||i===q.Sandbag||i===q.PropLow?.4:i===q.Tree?.35:0;a<=0||(m.fillStyle=`rgba(0,0,0,${a})`,m.fillRect(r+t,n+t,1,1))}m.fillStyle=`rgba(0,0,0,0.75)`,m.fillRect(t-1,t-1,e.w+2,1),m.fillRect(t-1,t+e.h,e.w+2,1),m.fillRect(t-1,t-1,1,e.h+2),m.fillRect(t+e.w,t-1,1,e.h+2),c.globalAlpha=.5,c.filter=`blur(${gd*.5}px)`,c.imageSmoothingEnabled=!0,c.drawImage(p,0,0,s.width,s.height),c.filter=`none`,c.globalAlpha=1;let h=new Ji(s);return h.colorSpace=nt,h.anisotropy=4,h}function vd(e,t,n,r,i,a,o){let s=new U(e,t,n).toNonIndexed();s.translate(r,i,a);let c=s.getAttribute(`position`),l=s.getAttribute(`normal`),u=new Float32Array(c.count*2);for(let e=0;e<c.count;e++){let t=Math.abs(l.getX(e)),n=Math.abs(l.getY(e)),r=n>.5?c.getX(e)+.5:t>.5?c.getZ(e)+.5:c.getX(e)+.5,i=n>.5?c.getZ(e)+.5:c.getY(e)/o;u[e*2]=r,u[e*2+1]=i}return s.setAttribute(`uv`,new br(u,2)),s}var yd=.4;function bd(e){let t=yd;return Tu([vd(1,.9,t,0,.45,0,e),vd(1,e-1.95,t,0,(e+1.95)/2,0,e),vd(.16,1.05,t,-.42,1.425,0,e),vd(.16,1.05,t,.42,1.425,0,e)])}function xd(e,t,n,r,i,a,o,s){let c=yd,l=.5-c/2,u=.35,d=e+.5,f=t+.5,p=[],m=(e,t,r,i)=>{let a=vd(e,n,t,r,n/2,i,s);a.translate(d,0,f),p.push(a)},h=!r&&!i&&!a&&!o;return m(h?.7:c,h?.7:c,0,0),r&&m(c,l,0,-.35),a&&m(c,l,0,u),o&&m(l,c,-.35,0),i&&m(l,c,u,0),p}function Sd(e,t,n,r,i,a,o,s,c){let l=yd+i,u=e+.5,d=t+.5,f=!a&&!o&&!s&&!c,p=[],m=(e,t,i,a)=>{p.push(new U(e,r,t).translate(u+i,n,d+a).toNonIndexed())};m(f?.78:l,f?.78:l,0,0);let h=.5-l/2,g=l/2+h/2;return a&&m(l,h,0,-g),s&&m(l,h,0,g),c&&m(h,l,-g,0),o&&m(h,l,g,0),p}function Cd(){let e=document.createElement(`canvas`);e.width=e.height=128;let t=e.getContext(`2d`);t.fillStyle=`#2f6f8f`,t.fillRect(0,0,128,128);let n=Kl(77);for(let e=0;e<70;e++){let e=n()*128,r=n()*128,i=6+n()*16;t.strokeStyle=n()<.5?`rgba(160,210,230,0.35)`:`rgba(20,60,80,0.35)`,t.lineWidth=1+n()*1.5,t.beginPath();for(let n of[-128,0,128])t.moveTo(e+n,r),t.quadraticCurveTo(e+n+i/2,r-2,e+n+i,r);t.stroke()}let r=new Ji(e);return r.colorSpace=nt,r.wrapS=r.wrapT=g,r}function wd(e,t=1){let n=new An;n.name=`map`;let r=e.w+20,i=e.h+20,a;e.ground?a=_d(e,10):(a=lu(),a.repeat.set(r/8,i/8));let o=new H(new na(r,i),Z(new W({map:a})));o.rotation.x=-Math.PI/2,o.position.set(e.w/2,0,e.h/2),o.receiveShadow=!0,n.add(o);let s=[],c=[],l=[],u=[],d=[];for(let t=0;t<e.h;t++)for(let n=0;n<e.w;n++){let r=e.get(n,t);r===q.Wall?s.push([n,t]):e.windows.has(t*e.w+n)?u.push([n,t]):r===q.Crate?c.push([n,t]):r===q.Water?l.push([n,t]):r===q.Sandbag&&d.push([n,t])}let f=new tn;if(l.length){let e=new na(1,1);e.rotateX(-Math.PI/2);let t=Cd();t.repeat.set(.25,.25),n.water=t;let r=Z(new W({map:t,emissive:731706,transparent:!0,opacity:.9}));r.onBeforeCompile=(e=>(t,n)=>{e(t,n),t.vertexShader=t.vertexShader.replace(`#include <uv_vertex>`,`#include <uv_vertex>
        #ifdef USE_MAP
          vec4 wWorld = instanceMatrix * vec4( position, 1.0 );
          vMapUv = ( mapTransform * vec3( wWorld.xz, 1.0 ) ).xy;
        #endif`)})(r.onBeforeCompile);let i=new Ni(e,r,l.length);l.forEach(([e,t],n)=>{f.makeTranslation(e+.5,.03,t+.5),i.setMatrixAt(n,f)}),i.receiveShadow=!0,i.name=`water`,n.add(i)}if(n.add(md(e,t)),d.length){let e=$l[q.Sandbag].height,t=new U(.98,e,.98);t.translate(0,e/2,0);let r=new Ni(t,Z(new W({map:gu()})),d.length);d.forEach(([e,t],n)=>{f.makeTranslation(e+.5,0,t+.5),r.setMatrixAt(n,f)}),r.castShadow=!0,r.receiveShadow=!0,n.add(r)}let p=Td(e),m=new Set;for(let t of p)for(let n=0;n<t.len;n++)m.add((t.horiz?t.z:t.z+n)*e.w+(t.horiz?t.x+n:t.x));let h=new Map,g=(e,t,n)=>{let r=h.get(e);r||h.set(e,r=[]),r.push([t,n])};for(let[t,n]of s)g(e.wallStyleAt(t,n),t,n);for(let t=-1;t<=e.w;t++)g(e.borderStyle,t,-1),g(e.borderStyle,t,e.h);for(let t=0;t<e.h;t++)g(e.borderStyle,-1,t),g(e.borderStyle,e.w,t);let _=$l[q.Wall].height,v=new tn;for(let[t,r]of h){let i=xu(t);if(t===J.Rock){let e=Kl(99),t=new Ni(new ta(.78,0),Z(new W({map:i.side,color:12103840,flatShading:!0})),r.length),a=new Mt,o=new fn,s=new z,c=new z;r.forEach(([n,r],i)=>{o.set(e()*.6,e()*6,e()*.6),a.setFromEuler(o);let l=1+e()*.3,u=1.6+e()*1.6;s.set(l,u,l),c.set(n+.5+(e()-.5)*.2,u*.45,r+.5+(e()-.5)*.2),v.compose(c,a,s),t.setMatrixAt(i,v)}),t.castShadow=!0,t.receiveShadow=!0,n.add(t);continue}let a=Z(new W({map:i.side})),o=Z(new W({map:i.top})),s=(t,n)=>e.inBounds(t,n)?e.wallHeight.get(n*e.w+t)??1:1,c=r.filter(([t,n])=>!e.inBounds(t,n));if(c.length){let e=new U(1,_,1);e.translate(0,_/2,0);let t=new Ni(e,[a,a,o,o,a,a],c.length);c.forEach(([e,n],r)=>{v.makeTranslation(e+.5,0,n+.5),t.setMatrixAt(r,v)}),t.castShadow=!0,t.receiveShadow=!0,n.add(t)}let l=r.filter(([t,n])=>e.inBounds(t,n));if(l.length){let r=(t,n)=>e.inBounds(t,n)&&(e.get(t,n)===q.Wall||e.windows.has(n*e.w+t)||m.has(n*e.w+t)),o=[],c=[],u=[];for(let[e,t]of l){let n=r(e,t-1),i=r(e+1,t),a=r(e,t+1),l=r(e-1,t),d=_*s(e,t);o.push(...xd(e,t,d,n,i,a,l,_)),c.push(...Sd(e,t,d+.04,.1,.08,n,i,a,l)),u.push(...Sd(e,t,.11,.22,.06,n,i,a,l))}let d=new H(Tu(o),a);d.castShadow=!0,d.receiveShadow=!0,n.add(d);let f=t===J.Wood||t===J.Metal,p=Z(new W({map:i.top,color:f?6969928:13683908})),h=new H(Tu(c),p);if(h.receiveShadow=!0,n.add(h),!f){let e=new H(Tu(u),Z(new W({map:i.top,color:9078400})));e.receiveShadow=!0,n.add(e)}}}if(u.length){let t=new Map;for(let[n,r]of u){let i=e.wallStyleAt(n,r),a=t.get(i);a||t.set(i,a=[]),a.push([n,r])}let r=bd(_),i=.44,a=new Ni(Tu([new U(.7,.07,i).translate(0,.93,0).toNonIndexed(),new U(.7,.07,i).translate(0,1.92,0).toNonIndexed(),new U(.05,1,.42).translate(0,1.42,0).toNonIndexed(),new U(.7,.04,.42).translate(0,1.45,0).toNonIndexed(),new U(.86,.05,.14).translate(0,.9,.27).toNonIndexed(),new U(.86,.05,.14).translate(0,.9,-.44/2-.05).toNonIndexed(),new U(.3,.95,.03).translate(-.58,1.42,.24).toNonIndexed(),new U(.3,.95,.03).translate(.58,1.42,.24).toNonIndexed()]),Z(new W({color:3811868})),u.length),o=0,s=new tn;for(let[i,c]of t){let t=xu(i),l=new Ni(r,Z(new W({map:t.side})),c.length);if(c.forEach(([t,n],r)=>{let i=e.windows.get(n*e.w+t);s.makeRotationY(i?0:Math.PI/2).setPosition(t+.5,0,n+.5),l.setMatrixAt(r,s),a.setMatrixAt(o++,s)}),l.castShadow=!0,l.receiveShadow=!0,n.add(l),i!==J.Wood&&i!==J.Metal){let r=new Ni(new U(1,.1,.48000000000000004).translate(0,_+.04,0),Z(new W({map:t.top,color:13683908})),c.length);c.forEach(([t,n],i)=>{let a=e.windows.get(n*e.w+t);s.makeRotationY(a?0:Math.PI/2).setPosition(t+.5,0,n+.5),r.setMatrixAt(i,s)}),r.receiveShadow=!0,n.add(r)}}a.castShadow=!0,n.add(a)}if(p.length&&n.add(Ed(e,p,_)),e.ruins.length&&n.add(Dd(e,_)),n.add($u(e)),e.roofs.length){let t=ld(e);n.add(t.group),n.roofs=t}if(c.length){let e=$l[q.Crate].height,t=new U(.94,e,.94);t.translate(0,e/2,0);let r=new Ni(t,Z(new W({map:fu()})),c.length),i=Kl(3),a=new Mt,o=new fn,s=new z(1,1,1),l=new z;c.forEach(([e,t],n)=>{o.set(0,(i()-.5)*.12,0),a.setFromEuler(o),l.set(e+.5,0,t+.5),v.compose(l,a,s),r.setMatrixAt(n,v)}),r.castShadow=!0,r.receiveShadow=!0,n.add(r)}return n}function Td(e){let t=(t,n)=>e.get(t,n)===q.Wall||e.windows.has(n*e.w+t),n=(t,n)=>e.inBounds(t,n)&&!$l[e.get(t,n)].solid,r=(t,n)=>e.roofs.some(e=>t>=e.x&&t<e.x+e.w&&n>=e.z&&n<e.z+e.h),i=new Set,a=[];for(let o=0;o<e.h;o++)for(let s=0;s<e.w;s++)if(!i.has(o*e.w+s)&&n(s,o)&&r(s,o))for(let c of[!0,!1]){let l=+!!c,u=+!c;if(!t(s-l,o-u))continue;let d=0;for(;d<4&&n(s+l*d,o+u*d);)d++;if(d<1||d>3||!t(s+l*d,o+u*d)||!t(s-l*2,o-u*2)&&!t(s+l*(d+1),o+u*(d+1)))continue;let f=+!c,p=+!!c;if(!n(s-f,o-p)||!n(s+f,o+p))continue;let m=r(s+f*1,o+p*1)&&!r(s-f,o-p);a.push({x:s,z:o,len:d,horiz:c,inside:m?1:r(s-f,o-p)&&!r(s+f,o+p)?-1:1});for(let t=0;t<d;t++)i.add((o+u*t)*e.w+s+l*t);break}return a}function Ed(e,t,n){let r=new An;r.name=`doors`;let i=new Map,a=[],o=[],s=[],c=[],l=[],u=[],d=yd,f=2.15;for(let r of t){let t=e.wallStyleAt(r.horiz?r.x-1:r.x,r.horiz?r.z:r.z-1),p=i.get(t);p||i.set(t,p=[]);let m=+!!r.horiz,h=+!r.horiz,g=+!r.horiz,_=+!!r.horiz,v=r.x+.5*_,y=r.z+.5*g,b=r.len,x=(e,t)=>[v+m*e+g*t,y+h*e+_*t],S=(e,t,n,i,a,o)=>{let[s,c]=x(i,o);return new U(r.horiz?e:n,t,r.horiz?n:e).translate(s,a,c).toNonIndexed()},C=vd(r.horiz?b:d,n-f,r.horiz?d:b,0,(n+f)/2,0,n),[w,T]=x(b/2,0);C.translate(w,0,T),p.push(C),a.push(S(.09,f,.46,.045,f/2,0)),a.push(S(.09,f,.46,b-.045,f/2,0)),a.push(S(b,.1,.46,b/2,2.17,0)),a.push(S(b-.1,.04,.5,b/2,.02,0));let E=Math.min(1,b)-.12,[D,ee]=x(.1,.24000000000000002*r.inside),O=new U(.05,2.07,E).toNonIndexed();O.translate(0,2.07/2,E/2*r.inside),r.horiz||O.rotateY(Math.PI/2),O.rotateY(r.horiz?.25*r.inside:-.25*r.inside),O.translate(D,0,ee),o.push(O);let k=new U(.04,.04,.04).toNonIndexed();k.translate(0,1,E*.85*r.inside),r.horiz||k.rotateY(Math.PI/2),k.rotateY(r.horiz?.25*r.inside:-.25*r.inside),k.translate(D+(r.horiz?.04:0),0,ee+(r.horiz?0:.04)),a.push(k);let A=-r.inside,te=(r.x*73+r.z*37)%11,ne=t===J.Metal||t===J.Bunker;if(s.push(S(b+.3,.12,.45,b/2,.06,.42000000000000004*A)),!ne&&te%3!=0){let e=new U(r.horiz?b+.5:.7,.06,r.horiz?.7:b+.5).toNonIndexed();e.rotateX(r.horiz?-.22*A:0),e.rotateZ(r.horiz?0:.22*A);let[t,n]=x(b/2,.53*A);e.translate(t,2.4699999999999998,n),c.push(e);for(let e of[-.15,b+.15])a.push(S(.06,.06,.55,e,2.31,.45*A))}let re=te%2?-.3:b+.3;if(a.push(S(.05,.05,.22,re,2.1999999999999997,.30000000000000004*A)),l.push(S(.12,.16,.12,re,2.1,.4*A)),!ne&&te===5){let e=S(Math.min(1.4,b+.4),.32,.05,b/2,2.77,.24000000000000002*A);u.push(e)}}for(let[e,t]of i){let n=xu(e),i=new H(Tu(t),Z(new W({map:n.side})));i.castShadow=!0,i.receiveShadow=!0,r.add(i)}let p=new H(Tu(a),Z(new W({color:3811868})));p.castShadow=!0,r.add(p);let m=new H(Tu(o),Z(new W({color:6965804})));m.castShadow=!0,m.receiveShadow=!0,r.add(m);let h=[[s,9078396,!1],[c,8010282,!0],[l,16769184,!1],[u,5913122,!0]];for(let[e,t,n]of h){if(!e.length)continue;let i=new H(Tu(e),Z(new W({color:t,emissive:t===16769184?4864536:0})));i.castShadow=n,i.receiveShadow=!0,r.add(i)}return r}function Dd(e,t){let n=new An;n.name=`ruin-detail`;let r=[],i=[],a=[],o=[];for(let n of e.ruins){let e=Kl(n.seed*31+7),s=n.x+n.w/2,c=n.z+n.h/2,l=3+Math.floor(e()*3);for(let t=0;t<l;t++){let t=1.6+e()*Math.min(3,Math.max(n.w,n.h)*.5),i=new U(.14,.14,t).toNonIndexed(),a=.35+e()*.45;i.translate(0,0,t/2),i.rotateX(a),i.rotateY(e()*Math.PI*2);let o=n.x+1+e()*Math.max(1,n.w-2),s=n.z+1+e()*Math.max(1,n.h-2);i.translate(o,.05,s),r.push(i)}if(n.w*n.h>=30){let a=Math.max(2,n.w*.45),o=Math.max(1.6,n.h*.4),l=new U(a,.08,o).toNonIndexed(),u=l.getAttribute(`uv`);for(let e=0;e<u.count;e++)u.setXY(e,u.getX(e)*a*.5,u.getY(e)*o*.5);let d=e()<.5?-1:1;l.rotateX(d*(.7+e()*.25)),l.rotateZ((e()-.5)*.4),l.translate(s+(e()-.5)*1.5,t*.38,c+d*(n.h/2-o/2-.6)),i.push(l);for(let i=0;i<3;i++){let l=new U(.1,.1,o+.4).toNonIndexed();l.rotateX(d*(.45+e()*.1)),l.translate(s-a/2+.3+i*((a-.6)/2),t*.38-.09,c+d*(n.h/2-o/2-.6)),r.push(l)}}let u=Math.round(n.w*n.h*.35);for(let t=0;t<u;t++){let t=new U(.1+e()*.2,.07+e()*.12,.08+e()*.16).toNonIndexed();t.rotateY(e()*3),t.rotateX((e()-.5)*.6);let r=e()<.7,i=r?e()<.5?n.x+.8+e()*.6:n.x+n.w-.8-e()*.6:n.x+1+e()*(n.w-2),o=r&&e()<.5?n.z+1+e()*(n.h-2):e()<.5?n.z+.8+e()*.5:n.z+n.h-.8-e()*.5;t.translate(i,.06,o),a.push(t)}let d=new U(Math.max(1,n.w-2.5),.01,Math.max(1,n.h-2.5)).toNonIndexed();d.translate(s+(e()-.5),.012,c+(e()-.5)),o.push(d)}let s=(e,t,r)=>{if(!e.length)return;let i=new H(Tu(e),Z(t));i.castShadow=r,i.receiveShadow=!0,n.add(i)};return s(r,new W({color:3024416}),!0),s(i,new W({map:Cu(),color:10115652}),!0),s(a,new W({color:7696479}),!0),s(o,new W({color:1972758,transparent:!0,opacity:.45,depthWrite:!1}),!1),n}var Od=(e,t,n)=>e<t?t:e>n?n:e;function kd(e,t,n){let r=Math.floor(t.x-n),i=Math.floor(t.x+n),a=Math.floor(t.z-n),o=Math.floor(t.z+n);for(let s=a;s<=o;s++)for(let a=r;a<=i;a++){if(!e(a,s))continue;let r=Od(t.x,a,a+1),i=Od(t.z,s,s+1),o=t.x-r,c=t.z-i;if(o!==0&&c!==0){let t=e(a,s+(c>0?1:-1)),n=e(a+(o>0?1:-1),s);t&&!n?c=0:n&&!t&&(o=0)}let l=o*o+c*c;if(!(l>=n*n)){if(l>1e-12){let e=Math.sqrt(l),r=(n-e)/e;t.x+=o*r,t.z+=c*r}else{let e=t.x-a,r=a+1-t.x,i=t.z-s,o=s+1-t.z,c=Math.min(e,r,i,o);c===e?t.x=a-n:c===r?t.x=a+1+n:t.z=c===i?s-n:s+1+n}}}}function Ad(e,t,n,r,i){let a=Math.max(1,Math.ceil(Math.hypot(r,i)/(n*.5))),o=r/a,s=i/a;for(let r=0;r<a;r++)t.x+=o,kd(e,t,n),t.z+=s,kd(e,t,n)}function jd(e,t,n,r,i){let a=e.x-n,o=e.z-r,s=t+i,c=a*a+o*o;if(c>=s*s)return!1;let l=Math.sqrt(c);if(l<1e-6)return e.x+=s,!0;let u=(s-l)/l;return e.x+=a*u,e.z+=o*u,!0}function Md(e,t,n,r,i){let a=r-t,o=i-n,s=Math.floor(t),c=Math.floor(n);if(e(s,c))return{t:0,x:t,z:n,nx:0,nz:0,tx:s,tz:c};let l=a>0?1:-1,u=o>0?1:-1,d=a===0?1/0:Math.abs(1/a),f=o===0?1/0:Math.abs(1/o),p=a===0?1/0:(a>0?s+1-t:t-s)*d,m=o===0?1/0:(o>0?c+1-n:n-c)*f;for(let r=0;r<4096;r++){let r,i=0,h=0;if(p<m?(r=p,p+=d,s+=l,i=-l):(r=m,m+=f,c+=u,h=-u),r>1)return null;if(e(s,c))return{t:r,x:t+a*r,z:n+o*r,nx:i,nz:h,tx:s,tz:c}}return null}function Nd(e,t,n,r,i,a,o){let s=n-e,c=r-t,l=e-i,u=t-a,d=l*l+u*u-o*o;if(d<=0)return 0;let f=s*s+c*c;if(f<1e-12)return-1;let p=2*(l*s+u*c),m=p*p-4*f*d;if(m<0)return-1;let h=(-p-Math.sqrt(m))/(2*f);return h>=0&&h<=1?h:-1}var Pd=Math.SQRT2,Fd=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,Pd],[1,-1,Pd],[-1,1,Pd],[-1,-1,Pd]],Id=class{f;items=[];constructor(e){this.f=e}get size(){return this.items.length}clear(){this.items.length=0}push(e){let t=this.items;t.push(e);let n=t.length-1;for(;n>0;){let e=n-1>>1;if(this.f[t[e]]<=this.f[t[n]])break;[t[e],t[n]]=[t[n],t[e]],n=e}}pop(){let e=this.items,t=e[0],n=e.pop();if(e.length>0){e[0]=n;let t=0;for(;;){let n=t*2+1,r=n+1,i=t;if(n<e.length&&this.f[e[n]]<this.f[e[i]]&&(i=n),r<e.length&&this.f[e[r]]<this.f[e[i]]&&(i=r),i===t)break;[e[i],e[t]]=[e[t],e[i]],t=i}}return t}},Ld=class{w;h;solid;g;f;from;seen;closed;run=0;heap;constructor(e,t,n){this.w=e,this.h=t,this.solid=n;let r=e*t;this.g=new Float32Array(r),this.f=new Float32Array(r),this.from=new Int32Array(r),this.seen=new Uint32Array(r),this.closed=new Uint32Array(r),this.heap=new Id(this.f)}free(e,t){return e>=0&&t>=0&&e<this.w&&t<this.h&&!this.solid(e,t)}nearestFree(e,t){if(this.free(e,t))return[e,t];for(let n=1;n<=3;n++)for(let r=-n;r<=n;r++)for(let i=-n;i<=n;i++)if(Math.max(Math.abs(i),Math.abs(r))===n&&this.free(e+i,t+r))return[e+i,t+r];return null}find(e,t,n=4e3){let r=this.nearestFree(Math.floor(e.x),Math.floor(e.z)),i=this.nearestFree(Math.floor(t.x),Math.floor(t.z));if(!r||!i)return null;let a=this.w,o=r[1]*a+r[0],s=i[1]*a+i[0],c=this.free(Math.floor(t.x),Math.floor(t.z));if(o===s)return[c?{x:t.x,z:t.z}:{x:i[0]+.5,z:i[1]+.5}];this.run++,this.run===4294967295&&(this.seen.fill(0),this.closed.fill(0),this.run=1);let l=this.run,u=this.heap;u.clear();let d=i[0],f=i[1],p=(e,t)=>{let n=Math.abs(e-d),r=Math.abs(t-f);return n+r+(Pd-2)*Math.min(n,r)};this.g[o]=0,this.f[o]=p(r[0],r[1]),this.from[o]=-1,this.seen[o]=l,u.push(o);let m=0,h=!1;for(;u.size>0;){let e=u.pop();if(this.closed[e]===l)continue;if(this.closed[e]=l,e===s){h=!0;break}if(++m>n)break;let t=e%a,r=(e-t)/a;for(let[n,i,o]of Fd){let s=t+n,c=r+i;if(!this.free(s,c)||n!==0&&i!==0&&(!this.free(t+n,r)||!this.free(t,r+i)))continue;let d=c*a+s;if(this.closed[d]===l)continue;let f=this.g[e]+o;this.seen[d]===l&&f>=this.g[d]||(this.seen[d]=l,this.g[d]=f,this.f[d]=f+p(s,c),this.from[d]=e,u.push(d))}}if(!h)return null;let g=[];for(let e=s;e!==-1;e=this.from[e]){let t=e%a;g.push({x:t+.5,z:(e-t)/a+.5})}return g.reverse(),c&&(g[g.length-1]={x:t.x,z:t.z}),zd(this.solid,{x:e.x,z:e.z},g,.36)}};function Rd(e,t,n,r){let i=n.x-t.x,a=n.z-t.z,o=Math.max(1,Math.ceil(Math.hypot(i,a)/.2));for(let n=0;n<=o;n++){let s=t.x+i*n/o,c=t.z+a*n/o;if(e(Math.floor(s-r),Math.floor(c-r))||e(Math.floor(s+r),Math.floor(c-r))||e(Math.floor(s-r),Math.floor(c+r))||e(Math.floor(s+r),Math.floor(c+r)))return!1}return!0}function zd(e,t,n,r){let i=[],a=t,o=0;for(;o<n.length;){let t=n.length-1;for(;t>o&&!Rd(e,a,n[t],r);)t--;i.push(n[t]),a=n[t],o=t+1}return i}var Bd=class{pf;perTick;queue=[];constructor(e,t=3){this.pf=e,this.perTick=t}request(e,t,n,r){let i=this.queue.findIndex(t=>t.id===e),a={id:e,a:{x:t.x,z:t.z},b:{x:n.x,z:n.z},done:r};i>=0?this.queue[i]=a:this.queue.push(a)}pending(e){return this.queue.some(t=>t.id===e)}cancel(e){let t=this.queue.findIndex(t=>t.id===e);t>=0&&this.queue.splice(t,1)}clear(){this.queue.length=0}process(){for(let e=0;e<this.perTick&&this.queue.length>0;e++){let e=this.queue.shift();e.done(this.pf.find(e.a,e.b))}}},Vd={id:``,name:``,short:``,cls:`pistol`,ammo:null,projectile:`bullet`,damage:10,fireRate:5,auto:!1,magSize:10,reloadTime:1.5,spread:.04,spreadAim:.015,recoil:.02,maxBloom:.08,recovery:.3,bulletSpeed:75,range:30,falloffStart:15,minDamage:.6,pellets:1,pierce:0,explosion:0,loudness:24,shake:.05,moveMul:1,viewBonus:0,gunLength:.36,attachments:[]},Hd=e=>({...Vd,...e}),Ud={pistol:Hd({id:`pistol`,name:`P9 Dienstpistole`,short:`Pistole`,cls:`pistol`,damage:24,fireRate:5.5,magSize:12,reloadTime:1.15,spread:.035,spreadAim:.01,recoil:.03,maxBloom:.09,recovery:.22,range:32,falloffStart:14,minDamage:.55,loudness:22,shake:.07,gunLength:.36,attachments:[`silencer`,`extmag`]}),smg:Hd({id:`smg`,name:`Maschinenpistole`,short:`MP`,cls:`smg`,ammo:`light`,damage:14,fireRate:11,auto:!0,magSize:30,reloadTime:1.7,spread:.06,spreadAim:.03,recoil:.012,maxBloom:.1,recovery:.35,bulletSpeed:70,range:22,falloffStart:10,minDamage:.5,loudness:20,shake:.04,gunLength:.52,attachments:[`scope`,`silencer`,`extmag`,`grip`]}),rifle:Hd({id:`rifle`,name:`Sturmgewehr`,short:`Gewehr`,cls:`rifle`,ammo:`rifle`,damage:21,fireRate:8,auto:!0,magSize:30,reloadTime:2,spread:.04,spreadAim:.012,recoil:.014,maxBloom:.08,recovery:.3,bulletSpeed:85,range:32,falloffStart:18,minDamage:.6,loudness:26,shake:.05,gunLength:.76,attachments:[`scope`,`silencer`,`extmag`,`grip`]}),shotgun:Hd({id:`shotgun`,name:`Schrotflinte`,short:`Schrot`,cls:`shotgun`,ammo:`shells`,damage:13,pellets:8,fireRate:1.4,magSize:6,reloadTime:2.4,spread:.15,spreadAim:.11,recoil:.04,maxBloom:.06,recovery:.4,bulletSpeed:60,range:14,falloffStart:5,minDamage:.25,loudness:28,shake:.14,gunLength:.7,attachments:[`extmag`,`grip`]}),dmr:Hd({id:`dmr`,name:`Präzisionsgewehr`,short:`Präzision`,cls:`dmr`,ammo:`rifle`,damage:62,fireRate:2.2,magSize:10,reloadTime:2.4,spread:.014,spreadAim:.003,recoil:.06,maxBloom:.12,recovery:.25,bulletSpeed:125,range:42,falloffStart:32,minDamage:.8,pierce:1,loudness:32,shake:.12,gunLength:.92,attachments:[`scope`,`silencer`,`extmag`]}),lmg:Hd({id:`lmg`,name:`Leichtes MG`,short:`MG`,cls:`lmg`,ammo:`rifle`,damage:18,fireRate:10,auto:!0,magSize:80,reloadTime:3.6,spread:.065,spreadAim:.03,recoil:.01,maxBloom:.12,recovery:.25,bulletSpeed:80,range:30,falloffStart:16,minDamage:.6,loudness:30,shake:.06,moveMul:.85,gunLength:.86,attachments:[`scope`,`extmag`,`grip`]}),launcher:Hd({id:`launcher`,name:`Raketenwerfer`,short:`Rakete`,cls:`launcher`,ammo:`rockets`,projectile:`rocket`,damage:130,explosion:3.6,fireRate:.8,magSize:1,reloadTime:2.6,spread:.012,spreadAim:.004,recoil:.05,bulletSpeed:24,range:40,falloffStart:40,minDamage:1,loudness:36,shake:.2,moveMul:.85,gunLength:1,attachments:[]}),flamer:Hd({id:`flamer`,name:`Flammenwerfer`,short:`Flamme`,cls:`flamer`,ammo:`fuel`,projectile:`flame`,damage:2.6,pellets:2,fireRate:18,auto:!0,magSize:100,reloadTime:2.4,spread:.16,spreadAim:.12,recoil:0,maxBloom:0,bulletSpeed:15,range:7.5,falloffStart:7.5,minDamage:1,pierce:99,loudness:16,shake:.015,moveMul:.9,gunLength:.8,attachments:[`extmag`]}),enemyRifle:Hd({id:`enemyRifle`,name:`Sturmgewehr`,short:`Gewehr`,cls:`rifle`,ammo:`rifle`,damage:6,fireRate:6,auto:!0,magSize:24,reloadTime:2.2,spread:.07,spreadAim:.02,recoil:.015,bulletSpeed:62,range:26,falloffStart:16,loudness:26,gunLength:.76}),enemySmg:Hd({id:`enemySmg`,name:`Maschinenpistole`,short:`MP`,cls:`smg`,ammo:`light`,damage:4,fireRate:9,auto:!0,magSize:30,reloadTime:1.8,spread:.11,spreadAim:.04,recoil:.012,maxBloom:.1,recovery:.35,bulletSpeed:55,range:16,falloffStart:8,minDamage:.45,loudness:20,gunLength:.52})};Ud.enemySniper=Hd({id:`enemySniper`,name:`Scharfschützengewehr`,short:`Präzision`,cls:`dmr`,ammo:`rifle`,damage:30,fireRate:.6,magSize:5,reloadTime:3,spread:.006,spreadAim:.004,bulletSpeed:140,range:40,falloffStart:40,minDamage:1,loudness:34,gunLength:.92}),Ud.enemyMg=Hd({id:`enemyMg`,name:`Maschinengewehr`,short:`MG`,cls:`lmg`,ammo:`rifle`,damage:5,fireRate:11,auto:!0,magSize:60,reloadTime:3.2,spread:.09,spreadAim:.05,bulletSpeed:70,range:24,falloffStart:14,loudness:30,gunLength:.86});var Wd={light:{name:`Pistolen-/MP-Munition`,max:210,box:45,color:14268490},rifle:{name:`Gewehrmunition`,max:240,box:60,color:6130236},shells:{name:`Schrotpatronen`,max:36,box:8,color:12597547},rockets:{name:`Raketen`,max:6,box:2,color:8225416},fuel:{name:`Brennstoff`,max:300,box:100,color:15105570}},Gd={standard:{name:`Standard`,color:`#d8d8d0`,damage:1,spread:1,reload:1,mag:1},improved:{name:`Verbessert`,color:`#4aa3e8`,damage:1.1,spread:.88,reload:.9,mag:1},elite:{name:`Elite`,color:`#e8b34a`,damage:1.22,spread:.75,reload:.82,mag:1.2}},Kd={scope:{name:`Zielfernrohr`,icon:`◎`,desc:`+6 m Sichtweite, genauer beim Zielen`},silencer:{name:`Schalldämpfer`,icon:`≋`,desc:`viel leiser, −5 % Schaden`},extmag:{name:`Großes Magazin`,icon:`▮`,desc:`+50 % Magazin`},grip:{name:`Griff`,icon:`⟂`,desc:`−20 % Streuung, weniger Rückstoß`}};function qd(e,t,n){let r=Gd[t],i={...e};return i.damage*=r.damage,i.spread*=r.spread,i.spreadAim*=r.spread,i.reloadTime*=r.reload,i.magSize=Math.max(1,Math.round(e.magSize*r.mag)),n.has(`scope`)&&(i.spreadAim*=.6,i.viewBonus+=6,i.range*=1.15),n.has(`silencer`)&&(i.loudness*=.35,i.damage*=.95),n.has(`extmag`)&&(i.magSize=Math.round(i.magSize*1.5)),n.has(`grip`)&&(i.spread*=.8,i.spreadAim*=.85,i.recoil*=.7),i}function Jd(e,t=!1){if(t)return`silenced`;switch(e.cls){case`rifle`:case`lmg`:return`rifle`;case`smg`:return`smg`;case`shotgun`:return`shotgun`;case`dmr`:return`dmr`;case`launcher`:return`launcher`;case`flamer`:return`flamer`;default:return`pistol`}}var Yd=class{def;rarity;attachments=new Set;stats;mag;cooldown=0;reloadT=0;bloom=0;constructor(e,t=`standard`,n){this.def=e,this.rarity=t,this.stats=qd(e,t,this.attachments),this.mag=n??this.stats.magSize}get reloading(){return this.reloadT>0}get silenced(){return this.attachments.has(`silencer`)}attach(e){return!this.def.attachments.includes(e)||this.attachments.has(e)?!1:(this.attachments.add(e),this.stats=qd(this.def,this.rarity,this.attachments),!0)}},Xd=e=>({damageMul:1,armor:0,speedMul:1,noiseMul:1,color:5595194,...e}),Zd={helmetLight:Xd({id:`helmetLight`,slot:`helmet`,name:`Leichter Helm`,icon:`⛑`,desc:`−10 % Schaden`,damageMul:.9}),helmetCombat:Xd({id:`helmetCombat`,slot:`helmet`,name:`Gefechtshelm`,icon:`⛑`,desc:`−20 % Schaden, etwas langsamer`,damageMul:.8,speedMul:.97,color:3949608}),vestLight:Xd({id:`vestLight`,slot:`vest`,name:`Leichte Weste`,icon:`▣`,desc:`50 Rüstung`,armor:50}),vestHeavy:Xd({id:`vestHeavy`,slot:`vest`,name:`Schwere Weste`,icon:`▣`,desc:`100 Rüstung, langsamer`,armor:100,speedMul:.93,color:3093796}),bootsRun:Xd({id:`bootsRun`,slot:`boots`,name:`Laufschuhe`,icon:`⟫`,desc:`+8 % Tempo`,speedMul:1.08,color:6967858}),bootsQuiet:Xd({id:`bootsQuiet`,slot:`boots`,name:`Leise Sohlen`,icon:`⟫`,desc:`Schritte kaum hörbar`,noiseMul:.35,color:3815994})},Qd={helmet:`Helm`,vest:`Weste`,boots:`Stiefel`},$d={medkit:{name:`Sanitätstasche`,plural:`Sanitätstaschen`,icon:`✚`,max:3,desc:`heilt sofort 40 Leben`,color:4030422},smoke:{name:`Rauchgranate`,plural:`Rauchgranaten`,icon:`☁`,max:3,desc:`Rauchwolke, blockiert 10 s die Sicht – auch für Gegner`,color:9080724},flash:{name:`Blendgranate`,plural:`Blendgranaten`,icon:`✶`,max:3,desc:`betäubt Gegner im Umkreis von 7 m für ~3,5 s`,color:14212578},mine:{name:`Mine`,plural:`Minen`,icon:`⊗`,max:3,desc:`vor die Füße legen, explodiert bei Gegnern`,color:3817267},drone:{name:`Aufklärungsdrohne`,plural:`Aufklärungsdrohnen`,icon:`✈`,max:2,desc:`fliegt zum Ziel und deckt 9 m im Umkreis 8 s lang auf`,color:10134445}};function ef(e){return{id:e.def.id,rarity:e.rarity,atts:[...e.attachments],mag:e.mag}}function tf(e){let t=new Yd(Ud[e.id]??Ud.pistol,e.rarity);for(let n of e.atts)t.attach(n);return t.mag=Math.min(e.mag,t.stats.magSize),t}var nf=class{primaries=[null,null];pistol=new Yd(Ud.pistol);active=2;lastPrimary=0;ammo={light:0,rifle:0,shells:0,rockets:0,fuel:0};grenades=2;ammoMul=1;maxGrenades=4;gear={helmet:null,vest:null,boots:null};gadget=null;reset(){this.gear={helmet:null,vest:null,boots:null},this.gadget=null,this.primaries=[null,null],this.pistol=new Yd(Ud.pistol),this.active=2,this.lastPrimary=0,this.ammo={light:0,rifle:0,shells:0,rockets:0,fuel:0},this.grenades=2}get(e){return e===2?this.pistol:this.primaries[e]}get current(){return this.get(this.active)??this.pistol}select(e){return e===this.active||!this.get(e)?!1:(this.active=e,e!==2&&(this.lastPrimary=e),!0)}cycle(e){for(let t=1;t<=3;t++){let n=((this.active+e*t)%3+3)%3;if(this.get(n))return this.select(n)}return!1}reserve(e){return e.def.ammo?this.ammo[e.def.ammo]:1/0}ammoMax(e){return Math.round(Wd[e].max*this.ammoMul)}ammoFull(e){return this.ammo[e]>=this.ammoMax(e)}addAmmo(e,t){let n=Math.max(0,Math.min(t,this.ammoMax(e)-this.ammo[e]));return this.ammo[e]+=n,n}canReload(e){return!e.reloading&&e.mag<e.stats.magSize&&this.reserve(e)>0}finishReload(e){let t=e.def.ammo,n=e.stats.magSize-e.mag,r=t?Math.min(n,this.ammo[t]):n;e.mag+=r,t&&(this.ammo[t]-=r),e.reloadT=0}takeWeapon(e){let t=this.primaries.findIndex(e=>e===null);if(t>=0)return this.primaries[t]=e,this.select(t),null;let n=this.active===2?this.lastPrimary:this.active,r=this.primaries[n];return r.reloadT=0,this.primaries[n]=e,this.active=n,this.lastPrimary=n,r}attach(e){let t=[this.current,...this.primaries,this.pistol];for(let n of t)if(n&&n.attach(e))return n;return null}addGrenades(e){let t=Math.max(0,Math.min(e,this.maxGrenades-this.grenades));return this.grenades+=t,t}slots(){return[0,1,2].map(e=>({slot:e,w:this.get(e),active:e===this.active}))}equip(e){let t=this.gear[e.slot];return this.gear[e.slot]=e,t}gearMul(e){let t=1;for(let n of Object.values(this.gear))n&&(t*=n[e]);return t}get damageMul(){return this.gearMul(`damageMul`)}get speedMul(){return this.gearMul(`speedMul`)}get noiseMul(){return this.gearMul(`noiseMul`)}get maxArmor(){return this.gear.vest?.armor??0}takeGadget(e,t){let n=$d[e].max;if(this.gadget&&this.gadget.id===e){let e=Math.max(0,Math.min(t,n-this.gadget.count));return this.gadget.count+=e,{took:e,dropped:null}}let r=this.gadget&&this.gadget.count>0?{...this.gadget}:null,i=Math.min(t,n);return this.gadget={id:e,count:i},{took:i,dropped:r}}useGadget(){if(!this.gadget||this.gadget.count<=0)return null;this.gadget.count--;let e=this.gadget.id;return this.gadget.count<=0&&(this.gadget=null),e}save(){return{primaries:this.primaries.map(e=>e?ef(e):null),pistol:ef(this.pistol),active:this.active,lastPrimary:this.lastPrimary,ammo:{...this.ammo},grenades:this.grenades,gear:{helmet:this.gear.helmet?.id??null,vest:this.gear.vest?.id??null,boots:this.gear.boots?.id??null},gadget:this.gadget?{...this.gadget}:null}}load(e){this.primaries=e.primaries.map(e=>e?tf(e):null),this.pistol=tf(e.pistol),this.active=this.get(e.active)?e.active:2,this.lastPrimary=e.lastPrimary,this.ammo={...this.ammo,...e.ammo};for(let e of Object.keys(this.ammo))this.ammo[e]=Math.min(this.ammo[e],this.ammoMax(e));this.grenades=Math.min(this.maxGrenades,e.grenades),this.gear={helmet:e.gear.helmet&&Zd[e.gear.helmet]||null,vest:e.gear.vest&&Zd[e.gear.vest]||null,boots:e.gear.boots&&Zd[e.gear.boots]||null},this.gadget=e.gadget&&$d[e.gadget.id]?{...e.gadget}:null}},rf=1.24,af=.38,of=.07,sf=.3,cf=.84,lf=.46,uf=.9,df=1.42,ff=1.3,pf=.37999999999999995,mf=lf;function hf(e,t){let n=Math.min(255,Math.round((e>>16&255)*t)),r=Math.min(255,Math.round((e>>8&255)*t)),i=Math.min(255,Math.round((e&255)*t));return n<<16|r<<8|i}var gf=new Map;function _f(e,t){let n=e.build();return n.translate(0,-t,0),n}function vf(e){let t=`${e.uniform},${e.vest},${e.helmet},${e.skin}`,n=gf.get(t);if(n)return n;let r=hf(e.vest,.7),i=hf(e.vest,.82),a=hf(e.uniform,.82),o=3025442,s=3816762,c=new Nu;c.box(.42,.18,.25,a,0,.87,0),c.box(.46,.06,.28,o,0,.93,0),c.box(.06,.05,.02,9075280,0,.93,.145),c.cyl(.055,.055,.15,4870710,.25,.88,-.05,[0,0,0],8),c.cyl(.058,.058,.03,2763298,.25,.97,-.05,[0,0,0],8),c.box(.2,.12,.08,i,0,.88,-.16),c.box(.07,.15,.1,o,-.25,.86,.02);let l=new Nu;l.box(.44,.5,.26,e.uniform,0,1.18,0),l.box(.48,.34,.3,e.vest,0,1.15,0),l.box(.46,.06,.31,hf(e.vest,.9),0,1.31,0);for(let e of[-.15,-.05,.05,.15])l.box(.09,.12,.06,i,e,1.06,.17),l.box(.09,.03,.065,r,e,1.12,.17);l.box(.14,.09,.05,i,-.12,1.23,.165),l.cyl(.04,.04,.07,4082220,.2,1.22,.13,[0,0,0],7),l.cyl(.04,.04,.07,4082220,.23,1.12,.1,[0,0,0],7),l.box(.01,.03,.01,s,.2,1.27,.13),l.box(.06,.04,.34,r,-.15,1.36,0),l.box(.06,.04,.34,r,.15,1.36,0),l.box(.06,.38,.02,r,0,1.17,-.16,[0,0,.6]),l.box(.06,.38,.02,r,0,1.17,-.16,[0,0,-.6]),l.box(.26,.07,.22,a,0,1.43,0),l.box(.12,.1,.24,e.uniform,-.25,1.37,.01),l.box(.12,.1,.24,e.uniform,.25,1.37,.01),l.box(.34,.4,.16,hf(e.vest,.85),0,1.16,-.23),l.box(.35,.1,.17,hf(e.vest,.75),0,1.33,-.235),l.box(.07,.2,.12,i,-.21,1.1,-.22),l.box(.07,.2,.12,i,.21,1.1,-.22),l.cyl(.07,.07,.4,5918784,0,1.42,-.25,[0,0,Math.PI/2],8),l.box(.04,.3,.02,5913634,.12,1.05,-.32),l.box(.1,.1,.02,s,.12,.89,-.32),l.cyl(.006,.006,.45,1842204,-.12,1.55,-.28,[.15,0,0],4);let u=new Nu;u.cyl(.07,.08,.1,e.skin,0,1.46,0,[0,0,0],8),u.add(new ia(.13,12,9),e.skin,[0,1.56,.01]),u.box(.035,.05,.04,hf(e.skin,.9),0,1.55,.135),u.box(.03,.018,.01,1709586,-.05,1.585,.125),u.box(.03,.018,.01,1709586,.05,1.585,.125),u.box(.05,.012,.01,hf(e.skin,.7),0,1.51,.128),u.box(.03,.06,.04,hf(e.skin,.92),-.13,1.56,0),u.box(.03,.06,.04,hf(e.skin,.92),.13,1.56,0),u.add(new ia(.168,14,8,0,Math.PI*2,0,Math.PI/2),e.helmet,[0,1.585,0]),u.cyl(.19,.19,.03,hf(e.helmet,.8),0,1.585,0,[0,0,0],16),u.cyl(.172,.176,.035,hf(e.helmet,.62),0,1.64,0,[0,0,0],16),u.box(.05,.035,.012,9079408,.1,1.64,.14,[0,.6,0]),u.box(.2,.05,.04,3813926,0,1.66,.13,[-.3,0,0]),u.box(.07,.035,.02,6982298,-.05,1.665,.15,[-.3,0,0]),u.box(.07,.035,.02,6982298,.05,1.665,.15,[-.3,0,0]),u.box(.02,.13,.02,o,.115,1.5,.05),u.box(.02,.13,.02,o,-.115,1.5,.05);let d=new Nu;d.box(.12,.12,.24,e.uniform,.24,1.3,.06,[.35,-.35,0]),d.box(.11,.11,.26,a,.19,1.25,.27,[0,-.25,0]),d.box(.12,.05,.1,hf(e.uniform,.7),.215,1.27,.17,[0,-.25,0]),d.box(.12,.12,.24,e.uniform,-.22,1.3,.07,[.35,.5,0]),d.box(.11,.11,.28,a,-.1,1.25,.3,[0,.55,0]),d.box(.12,.05,.1,hf(e.uniform,.7),-.155,1.27,.2,[0,.55,0]),d.box(.1,.1,.1,3814442,.135,1.24,.41),d.box(.1,.1,.1,3814442,0,1.24,.45);let f=new Nu;f.box(.18,.41999999999999993,.21,e.uniform,0,cf-pf/2,0),f.box(.06,.16,.13,i,.11,.6399999999999999,.02),f.box(.19,.03,.22,r,0,.59,0);let p=new Nu;return p.box(.16,.34,.19,e.uniform,0,lf-.34/2,0),p.box(.17,.1,.07,r,0,.4,.09),p.box(.17,.12,.2,hf(e.uniform,.7),0,.2,0),p.box(.19,.18,.28,2761758,0,.09,.03),p.box(.2,.035,.3,1380878,0,.0175,.03),p.box(.12,.02,.02,4864554,0,.17,.17),n={hips:_f(c,cf),torso:_f(l,uf),head:_f(u,df),arms:_f(d,ff),thigh:_f(f,cf),shin:_f(p,lf)},gf.set(t,n),n}var yf=new Map;function bf(e,t){let n=`${e}:${t.toFixed(2)}`,r=yf.get(n);if(r)return r;let i=new Nu,a=2763822,o=1842462,s=5913634,c=4870710,l=Math.PI/2,u=(e,t,n,r=a)=>{i.cyl(e,e,n-t,r,0,.01,(t+n)/2,[l,0,0],8)};switch(e){case`pistol`:i.box(.05,.07,t,a,0,.01,t/2),i.box(.045,.12,.06,o,0,-.07,.03,[.25,0,0]),i.box(.02,.02,.02,o,0,.055,t-.03);break;case`smg`:i.box(.06,.09,t*.55,a,0,0,t*.3),u(.017,t*.55,t),i.box(.04,.16,.05,o,0,-.12,t*.35,[.15,0,0]),i.box(.045,.1,.05,o,0,-.08,t*.12,[.3,0,0]),i.box(.02,.03,.18,o,0,.02,-.08),i.box(.03,.04,.03,o,0,.065,t*.25);break;case`rifle`:case`dmr`:i.box(.065,.1,t*.42,a,0,0,t*.22),i.box(.07,.08,t*.3,e===`dmr`?s:c,0,-.005,t*.55),u(.016,t*.7,t),i.box(.05,.11,.25,e===`dmr`?s:o,0,-.02,-.1),i.box(.045,.15,.06,o,0,-.11,t*.3,[.25,0,0]),i.box(.04,.09,.05,o,0,-.08,t*.08,[.35,0,0]),e===`dmr`?(i.cyl(.03,.03,.26,o,0,.09,t*.25,[l,0,0],8),i.cyl(.04,.04,.05,o,0,.09,t*.25+.15,[l,0,0],8),i.box(.02,.04,.02,o,0,.06,t*.25)):(i.box(.03,.05,.03,o,0,.07,t*.1),i.box(.02,.05,.02,o,0,.055,t*.85)),i.cyl(.024,.024,.05,o,0,.01,t-.02,[l,0,0],8);break;case`shotgun`:i.box(.065,.09,t*.32,a,0,0,t*.18),u(.022,t*.3,t),i.cyl(.02,.02,t*.55,o,0,-.045,t*.6,[l,0,0],8),i.box(.06,.07,t*.22,s,0,-.045,t*.5),i.box(.05,.12,.26,s,0,-.03,-.11),i.box(.04,.08,.05,o,0,-.07,t*.08,[.35,0,0]);break;case`lmg`:i.box(.08,.12,t*.4,a,0,0,t*.2),u(.022,t*.4,t),i.cyl(.035,.035,t*.35,o,0,.01,t*.6,[l,0,0],10),i.box(.12,.13,.13,c,-.08,-.12,t*.22),i.box(.06,.12,.25,o,0,-.02,-.1),i.box(.012,.18,.012,o,-.04,-.12,t*.85,[0,0,.35]),i.box(.012,.18,.012,o,.04,-.12,t*.85,[0,0,-.35]),i.box(.04,.05,.08,o,0,.08,t*.15);break;case`launcher`:i.cyl(.075,.075,t,c,0,.02,t/2,[l,0,0],12),i.cyl(.085,.085,.06,o,0,.02,t-.03,[l,0,0],12),i.cyl(.085,.085,.06,o,0,.02,.03,[l,0,0],12),i.box(.04,.12,.05,o,0,-.1,t*.3,[.2,0,0]),i.box(.05,.08,.12,o,-.08,.08,t*.35);break;case`flamer`:i.box(.07,.09,t*.6,a,0,0,t*.3),u(.025,t*.55,t,3815994),i.cyl(.045,.045,t*.4,8006170,0,-.08,t*.35,[l,0,0],10),i.box(.04,.13,.05,o,0,-.1,t*.15,[.25,0,0]),i.cyl(.03,.03,.05,13656096,0,.01,t,[l,0,0],8)}return r=i.build(),yf.set(n,r),r}function xf(e,t,n,r=0,i=0,a=0){let o=new H(e,t);return o.position.set(r,i,a),o.castShadow=!0,n.add(o),o}function Sf(e,t,n,r=0){let i=new An;return i.position.set(t,n,r),e.add(i),i}function Cf(e){let t=vf(e),n=new W({vertexColors:!0}),r=new An,i=Sf(r,0,cf);xf(t.hips,n,i);let a=Sf(i,0,.06000000000000005);xf(t.torso,n,a);let o=Sf(a,0,.5199999999999999);xf(t.head,n,o);let s=Sf(a,0,.4);xf(t.arms,n,s);let c=xf(bf(`pistol`,.36),n,s,of,-.08000000000000007,sf),l=[],u=[];for(let e of[-.11,.11]){let i=Sf(r,e,cf);xf(t.thigh,n,i);let a=Sf(i,0,-.37999999999999995);xf(t.shin,n,a),l.push(i),u.push(a)}e.silhouette!==void 0&&Ef(r,e.silhouette);let d={root:r,body:i,torso:a,head:o,legL:l[0],legR:l[1],shinL:u[0],shinR:u[1],arms:s,gun:c,seed:Math.random()*100};return Tf(d,{gunLength:.36,cls:`pistol`}),d}function wf(e){return sf+e}function Tf(e,t){let n=bf(t.cls,t.gunLength);e.gun.geometry=n;for(let t of e.gun.children)t instanceof H&&(t.geometry=n);e.gun.scale.set(1,1,1),e.gun.position.z=sf}function Ef(e,t){let n=new ui({color:t,transparent:!0,opacity:.42,depthFunc:6,depthWrite:!1,stencilWrite:!0,stencilRef:1,stencilFunc:517,stencilZPass:st}),r=[];e.traverse(e=>{e instanceof H&&r.push(e)});let i=new Set;for(let e of r){e.renderOrder=5;let t=e.material;i.has(t)||(i.add(t),t.stencilWrite=!0,t.stencilRef=1,t.stencilFunc=519,t.stencilZPass=st)}for(let e of r){let t=new H(e.geometry,n);t.renderOrder=10,t.castShadow=!1,e.add(t)}}function Df(e,t,n,r,i,a={}){let o=Math.min(1,n),s=performance.now()/1e3+e.seed,c=a.hit??0,l=a.reload??0,u=a.dead??0,d=Math.sin(t)*.6*o,f=o*(.12+.85*Math.max(0,-Math.cos(t))),p=o*(.12+.85*Math.max(0,Math.cos(t))),m=-1.2*r,h=2*r;e.legL.rotation.x=d*(1-r*.7)+m+u*-.3,e.legR.rotation.x=-d*(1-r*.7)+m*.85+u*-.5,e.shinL.rotation.x=f*(1-r)+h+u*.9,e.shinR.rotation.x=p*(1-r)+h*.85+u*1.2;let g=(e,t)=>pf*Math.cos(e)+mf*Math.cos(e+t),_=Math.min(g(e.legL.rotation.x,e.shinL.rotation.x),g(e.legR.rotation.x,e.shinR.rotation.x)),v=Math.abs(Math.cos(t))*.035*o,y=Math.min(cf,_+.005)+v;e.body.position.y=y,e.legL.position.y=y,e.legR.position.y=y,e.body.rotation.z=Math.sin(t)*.04*o;let b=Math.sin(s*1.7)*(1-o)*(1-u);e.torso.rotation.x=.07*o+r*.18-i*.1-c*.28+u*.3,e.torso.rotation.y=-Math.sin(t)*.09*o+Math.sin(s*.6)*.03*(1-o),e.torso.rotation.z=c*Math.sin(s*40)*.08,e.torso.scale.set(1,1+b*.012,1+b*.02),e.head.rotation.y=-e.torso.rotation.y*.8+Math.sin(s*.37)*.12*(1-o)*(1-u),e.head.rotation.x=Math.cos(t*2)*.03*o-c*.15+u*.4,e.arms.position.z=-.07*i,e.arms.position.y=.4+Math.sin(t*2)*.012*o-l*.06,e.arms.rotation.x=-.18*i+l*.35+u*.9+b*.01,e.arms.rotation.z=l*.5,e.arms.rotation.y=Math.sin(t)*.05*o}var Of=.34,kf=4.3,Af=6.6,jf=2.3,Mf=class{pos={x:0,z:0};prev={x:0,z:0};vel={x:0,z:0};facing=Math.PI;aim={x:0,z:-1};aiming=!1;hp=100;maxHp=100;armor=0;maxArmor=100;crouched=!1;sprinting=!1;dead=!1;deadT=0;radius=Of;inv=new nf;switchT=0;walkPhase=0;reloadAnim=0;hitAnim=0;crouchAnim=0;recoilAnim=0;model;shownGun=null;constructor(){this.model=Cf({uniform:5991230,vest:4147756,helmet:5003572,skin:14067578,silhouette:8377343}),this.reset(0,0)}reset(e,t){this.pos.x=this.prev.x=e,this.pos.z=this.prev.z=t,this.vel.x=this.vel.z=0,this.facing=Math.PI,this.aim.x=0,this.aim.z=-1,this.hp=this.maxHp,this.armor=0,this.crouched=!1,this.sprinting=!1,this.dead=!1,this.deadT=0,this.switchT=0,this.inv.reset()}get weapon(){return this.inv.current}get speed(){return Math.hypot(this.vel.x,this.vel.z)}muzzle(e){let t=wf(this.weapon.def.gunLength),n=Math.sin(e),r=Math.cos(e),i=Math.cos(e),a=-Math.sin(e);return{x:this.pos.x+n*t+i*of,y:rf-af*+!!this.crouched,z:this.pos.z+r*t+a*of}}render(e,t){this.shownGun!==this.weapon&&(this.shownGun=this.weapon,Tf(this.model,this.weapon.def));let n=Jl(this.prev.x,this.pos.x,e),r=Jl(this.prev.z,this.pos.z,e),i=this.speed,a=Math.min(1,i/kf);this.walkPhase+=t*i*2.6,this.crouchAnim+=(+!!this.crouched-this.crouchAnim)*Math.min(1,t*14),this.recoilAnim=Math.max(0,this.recoilAnim-t*9);let o=this.model.root;if(o.rotation.order=`YXZ`,o.rotation.y=this.facing,this.dead){let e=Math.min(1,this.deadT*3.5);o.position.set(n,e*.15,r),o.rotation.x=-e*1.5,Df(this.model,0,0,0,0,{dead:e});return}o.position.set(n,0,r),o.rotation.x=0;let s=this.switchT>0?Math.min(1,this.switchT*5):0;this.reloadAnim+=(+!!this.weapon.reloading-this.reloadAnim)*Math.min(1,t*10),this.hitAnim=Math.max(0,this.hitAnim-t*6),Df(this.model,this.walkPhase,a,this.crouchAnim,Math.max(this.recoilAnim,s),{reload:this.reloadAnim,hit:this.hitAnim})}},Nf={base:new U(.5,.08,.5),post:new Qi(.05,.05,.95,6),torso:new U(.46,.6,.24),head:new ia(.14,10,8),disc:new Qi(.14,.14,.03,16),dot:new Qi(.05,.05,.035,12)},Pf=Z(new W({color:5192226})),Ff=Z(new W({color:12071466})),If=Z(new W({color:15327951})),Lf=4,Rf=new V(.9,.85,.75),zf=new z,Bf=class{x;z;radius=.36;maxHp=80;hp=80;respawnT=0;group=new An;pivot=new An;straw;flash=0;fall=0;wobble=0;hitDir={x:0,z:1};constructor(e,t,n){this.x=e,this.z=t,this.straw=Z(new W({color:13218168})),this.group.position.set(e,0,t);let r=new H(Nf.base,Pf);r.position.y=.04,r.receiveShadow=!0,this.group.add(r),this.group.add(this.pivot);let i=new An;i.rotation.y=n,this.pivot.add(i);let a=(e,t,n,r)=>(e.position.set(t,n,r),e.castShadow=!0,i.add(e),e);a(new H(Nf.post,Pf),0,.55,0),a(new H(Nf.torso,this.straw),0,1.15,0),a(new H(Nf.head,this.straw),0,1.6,0);let o=a(new H(Nf.disc,If),0,1.18,.125);o.rotation.x=Math.PI/2;let s=a(new H(Nf.dot,Ff),0,1.18,.128);s.rotation.x=Math.PI/2}get alive(){return this.hp>0}damage(e,t,n){return this.alive?(this.hp-=e,this.flash=1,this.wobble=1,this.hitDir.x=t,this.hitDir.z=n,this.hp<=0&&(this.hp=0,this.respawnT=Lf,!0)):!1}tick(e){this.alive||(this.respawnT-=e,this.respawnT<=0&&(this.hp=this.maxHp))}render(e){this.flash=Math.max(0,this.flash-e*10),this.wobble=Math.max(0,this.wobble-e*3);let t=+!this.alive;this.fall+=(t-this.fall)*Math.min(1,e*(this.alive?3:7)),this.straw.emissive.copy(Rf).multiplyScalar(this.flash*.6);let n=this.fall*1.45+Math.sin(this.wobble*14)*this.wobble*.2;zf.set(this.hitDir.z,0,-this.hitDir.x).normalize(),this.pivot.quaternion.setFromAxisAngle(zf,n)}},Vf={rifleman:{type:`rifleman`,cover:!0,flanker:!0,name:`Schütze`,hp:70,weapon:Ud.enemyRifle,speedPatrol:1.7,speedMove:3.4,viewRange:16,fov:115*Math.PI/180,preferredDist:11,reaction:.8,burst:[3,5],burstPause:[.9,1.6],rusher:!1,medkitChance:.3,dropWeapon:`rifle`,colors:{uniform:7040888,vest:4277581,helmet:3422271,skin:13212272}},assault:{type:`assault`,flanker:!0,name:`Sturmsoldat`,hp:85,weapon:Ud.enemySmg,speedPatrol:1.9,speedMove:4.3,viewRange:14,fov:125*Math.PI/180,preferredDist:4,reaction:.65,burst:[4,7],burstPause:[.8,1.3],rusher:!0,medkitChance:.35,dropWeapon:`smg`,colors:{uniform:7300441,vest:8010286,helmet:5910053,skin:12159842}},sniper:{type:`sniper`,cover:!0,name:`Scharfschütze`,hp:60,weapon:Ud.enemySniper,speedPatrol:1.5,speedMove:3,viewRange:24,fov:80*Math.PI/180,preferredDist:20,reaction:1.4,burst:[1,1],burstPause:[1.8,2.6],rusher:!1,medkitChance:.25,dropWeapon:`dmr`,laser:!0,colors:{uniform:5925456,vest:3819058,helmet:3029032,skin:12884080}},mg:{type:`mg`,name:`MG-Stellung`,hp:150,weapon:Ud.enemyMg,speedPatrol:0,speedMove:0,viewRange:18,fov:150*Math.PI/180,preferredDist:12,reaction:1,burst:[10,16],burstPause:[1.3,2],rusher:!1,medkitChance:.3,dropWeapon:`lmg`,stationary:!0,colors:{uniform:6053734,vest:3093047,helmet:2763824,skin:12753524}},grenadier:{type:`grenadier`,cover:!0,name:`Granatwerfer`,hp:75,weapon:Ud.enemySmg,speedPatrol:1.7,speedMove:3.2,viewRange:16,fov:120*Math.PI/180,preferredDist:10,reaction:.9,burst:[3,5],burstPause:[1.2,1.8],rusher:!1,medkitChance:.3,dropWeapon:`smg`,grenades:!0,colors:{uniform:6972488,vest:9075242,helmet:5196332,skin:12095334}},heavy:{type:`heavy`,name:`Schwerer`,hp:240,weapon:Ud.enemyMg,speedPatrol:1.3,speedMove:2.4,viewRange:15,fov:110*Math.PI/180,preferredDist:7,reaction:1,burst:[8,12],burstPause:[1.2,1.8],rusher:!1,medkitChance:.6,dropWeapon:`lmg`,scale:1.18,damageTaken:.8,colors:{uniform:3816512,vest:2237738,helmet:1842722,skin:11569766}}},Hf=null;function Uf(){return Hf||={q:new Ur({map:pu(`?`,`#ffd04a`),depthWrite:!1,toneMapped:!1}),x:new Ur({map:pu(`!`,`#ff4a3a`),depthWrite:!1,toneMapped:!1}),s:new Ur({map:pu(`✶`,`#ffffff`),depthWrite:!1,toneMapped:!1})},Hf}var Wf=new Ur({color:1118481,depthWrite:!1,toneMapped:!1,opacity:.75,transparent:!0}),Gf=new Ur({color:14697786,depthWrite:!1,toneMapped:!1}),Kf=new V(1,.9,.8),qf=class{spawnIndex;def;radius=.36;pos={x:0,z:0};prev={x:0,z:0};vel={x:0,z:0};facing;hp;state=`patrol`;stateT=0;awareness=0;lastKnown={x:0,z:0};seeing=!1;sightTime=0;sinceSeen=99;path=null;pathIdx=0;pathGoal={x:NaN,z:NaN};pathFailed=!1;repathT=0;patrol;patrolIdx=0;waitT=0;home;reactionT=0;burstLeft=0;burstPauseT=0;fireCd=0;mag;reloadT=0;searchLeft=0;lastSearch=null;strafeDir=1;strafeT=0;wantYaw;group=new An;model;mats=[];icon;hpBg;hpFill;flash=0;fall=0;walkPhase=0;recoilAnim=0;alertShowT=0;hpShowT=0;deadT=0;inSight=!0;stunT=0;grenadeCd=2;laserOn=!1;cover=null;coverPhase=`none`;coverT=0;coverCheckT=0;peekAt=null;peekShots=0;offScreenT=0;role=`normal`;flankTo=null;flankT=0;laser=null;constructor(e,t=-1){if(this.spawnIndex=t,this.def=Vf[e.type],this.hp=this.def.hp,this.mag=this.def.weapon.magSize,this.pos.x=this.prev.x=e.x,this.pos.z=this.prev.z=e.z,this.facing=this.wantYaw=e.yaw,this.home={x:e.x,z:e.z,yaw:e.yaw},this.patrol=e.patrol.length>0?[{x:e.x,z:e.z},...e.patrol]:[],this.model=Cf(this.def.colors),Tf(this.model,this.def.weapon),this.def.scale&&this.model.root.scale.setScalar(this.def.scale),this.def.laser){let e=new na(.035,1);e.rotateX(-Math.PI/2),e.translate(0,0,.5),this.laser=new H(e,new ui({color:16722458,transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1})),this.laser.visible=!1,this.group.add(this.laser)}this.model.root.rotation.order=`YXZ`,this.model.root.traverse(e=>{if(e instanceof H){let t=e.material;this.mats.includes(t)||this.mats.push(Z(t))}}),this.group.add(this.model.root),this.icon=new ri(Uf().q),this.icon.scale.set(.7,.7,.7),this.icon.position.y=2.35,this.icon.visible=!1,this.group.add(this.icon),this.hpBg=new ri(Wf),this.hpBg.scale.set(.9,.11,1),this.hpBg.position.y=2,this.hpFill=new ri(Gf),this.hpFill.center.set(0,.5),this.hpFill.scale.set(.86,.07,1),this.hpFill.position.set(-.43,2,0),this.hpBg.visible=this.hpFill.visible=!1,this.hpBg.renderOrder=20,this.hpFill.renderOrder=21,this.group.add(this.hpBg,this.hpFill)}get alive(){return this.state!==`dead`}get speed(){return Math.hypot(this.vel.x,this.vel.z)}muzzle(e){let t=wf(this.def.weapon.gunLength),n=Math.sin(e),r=Math.cos(e);return{x:this.pos.x+n*t+Math.cos(e)*of,y:rf,z:this.pos.z+r*t-Math.sin(e)*of}}damage(e){return this.alive?(this.hp-=e*(this.def.damageTaken??1),this.flash=1,this.hpShowT=3,this.hp<=0&&(this.hp=0,this.state=`dead`,this.stateT=0,this.vel.x=this.vel.z=0,this.path=null,!0)):!1}render(e,t){let n=Jl(this.prev.x,this.pos.x,e),r=Jl(this.prev.z,this.pos.z,e);this.group.position.set(n,0,r);let i=this.speed;this.walkPhase+=t*i*2.6,this.recoilAnim=Math.max(0,this.recoilAnim-t*9),this.flash=Math.max(0,this.flash-t*8);for(let e of this.mats)e.emissive.copy(Kf).multiplyScalar(this.flash*.7);let a=this.model.root;if(a.rotation.y=this.facing,!this.alive){this.laser&&(this.laser.visible=!1),this.model.root.visible=!0,this.deadT+=t,this.fall=Math.min(1,this.fall+t*3.5),a.rotation.x=-this.fall*1.5,a.position.y=this.fall*.15,this.deadT>10&&(a.position.y=.15-Math.min(1.2,(this.deadT-10)*.25)),this.group.visible=this.deadT<15,this.icon.visible=this.hpBg.visible=this.hpFill.visible=!1,Df(this.model,0,0,0,0,{dead:this.fall});return}if(this.group.visible=this.inSight||this.laserOn&&!!this.laser,this.model.root.visible=this.inSight,this.laser&&(this.laser.visible=this.laserOn,this.laserOn)){let e=this.lastKnown.x-n,t=this.lastKnown.z-r,i=Math.max(.5,Math.hypot(e,t)-.3);this.laser.position.set(Math.sin(this.facing)*.5,1.22,Math.cos(this.facing)*.5),this.laser.rotation.y=Math.atan2(e,t),this.laser.scale.z=i,this.laser.material.opacity=.35+Math.sin(this.stateT*18)*.15}a.rotation.x=0,a.position.y=0,Df(this.model,this.walkPhase,Math.min(1,i/3.5),0,this.recoilAnim,{hit:this.flash}),this.alertShowT=Math.max(0,this.alertShowT-t);let o=Uf();this.stunT>0?(this.icon.material=o.s,this.icon.visible=!0):this.alertShowT>0?(this.icon.material=o.x,this.icon.visible=!0):this.state===`suspicious`||this.state===`investigate`||this.state===`search`?(this.icon.material=o.q,this.icon.visible=!0):this.icon.visible=!1,this.hpShowT=Math.max(0,this.hpShowT-t);let s=this.hpShowT>0;this.hpBg.visible=this.hpFill.visible=s,s&&(this.hpFill.scale.x=.86*(this.hp/this.def.hp))}},Jf=new z(0,1,0),Yf=new V(16766858),Xf=new V(16747114),Zf=new V(4014406),Qf=new V(16769152),$f=new V(16734746),ep=new V,tp=class{list=[];mesh;m=new tn;q=new Mt;p=new z;s=new z;constructor(e,t=320){for(let e=0;e<t;e++)this.list.push({active:!1,owner:`player`,kind:`bullet`,x:0,z:0,px:0,pz:0,y:0,vx:0,vz:0,speed:0,traveled:0,range:0,damage:0,falloffStart:0,minDamage:1,pierce:0,explosion:0,hits:[],whizzed:!1});let n=Z(new ui({color:16777215,toneMapped:!1}));this.mesh=new Ni(new U(1,1,1),n,t);for(let e=0;e<t;e++)this.mesh.setColorAt(e,Yf);this.mesh.frustumCulled=!1,this.mesh.count=0,e.add(this.mesh)}spawn(e){for(let t of this.list)if(!t.active)return t.kind=`bullet`,t.pierce=0,t.explosion=0,Object.assign(t,e),t.active=!0,t.whizzed=!1,t.hits.length=0,t.px=t.x,t.pz=t.z,t.traveled=0,t.speed=Math.hypot(t.vx,t.vz),t;return null}clear(){for(let e of this.list)e.active=!1}static damageAt(e,t){if(t<=e.falloffStart)return e.damage;let n=Math.min(1,(t-e.falloffStart)/Math.max(.001,e.range-e.falloffStart));return e.damage*(1-n*(1-e.minDamage))}render(e){let t=0;for(let n of this.list){if(!n.active)continue;let r=n.px+(n.x-n.px)*e,i=n.pz+(n.z-n.pz)*e,a=n.vx/n.speed,o=n.vz/n.speed;if(this.q.setFromAxisAngle(Jf,Math.atan2(a,o)),n.kind===`flame`){let e=Math.min(1,n.traveled/n.range),a=.16+e*.7;this.p.set(r,n.y-e*.3,i),this.s.set(a,a*.8,a),this.mesh.setColorAt(t,ep.copy(Qf).lerp($f,e))}else if(n.kind===`rocket`)this.p.set(r-a*.3,n.y,i-o*.3),this.s.set(.13,.13,.6),this.mesh.setColorAt(t,Zf);else{let e=Math.min(1.8,n.traveled+.3);this.p.set(r-a*e/2,n.y,i-o*e/2),this.s.set(.05,.05,e),this.mesh.setColorAt(t,n.owner===`player`?Yf:Xf)}this.m.compose(this.p,this.q,this.s),this.mesh.setMatrixAt(t++,this.m)}this.mesh.count=t,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}},np=1.3,rp={medkit:new U(.42,.22,.32),crossA:new U(.22,.02,.07),crossB:new U(.07,.02,.22),ammo:new U(.34,.2,.24),band:new U(.35,.05,.25),gun:new U(1,1,1),att:new U(.2,.14,.2),grenade:new ia(.11,10,8),ring:new ra(.42,.52,28),helmet:new ia(.2,12,8,0,Math.PI*2,0,Math.PI/2),vest:new U(.42,.32,.2),boot:new U(.12,.12,.26),can:new Qi(.08,.08,.26,10),disc:new Qi(.2,.22,.06,14),plate:new U(.36,.05,.28),beam:new Qi(.04,.04,2.2,6,1,!0)},ip=new Map;function ap(e,t=0){let n=e*7+t,r=ip.get(n);return r||ip.set(n,r=Z(new W({color:e,emissive:t}))),r}var op=new Map;function sp(e,t=.55){let n=e*101+Math.round(t*100),r=op.get(n);return r||(r=Z(new ui({color:e,transparent:!0,opacity:t,blending:2,depthWrite:!1,toneMapped:!1})),op.set(n,r)),r}var cp=Z(new ui({color:14035488})),lp=e=>parseInt(e.slice(1),16),up=class{payload;x;z;life;group=new An;item=new An;ring;age=0;taken=!1;mapIndex=-1;constructor(e,t,n,r){this.payload=e,this.x=t,this.z=n,this.life=r,this.group.position.set(t,0,n);let i=6750088,a=e;if(a.kind===`medkit`){this.addMesh(rp.medkit,ap(15921386,3157032));let e=this.addMesh(rp.crossA,cp),t=this.addMesh(rp.crossB,cp);e.position.y=t.position.y=.115}else if(a.kind===`ammo`){let e=Wd[a.ammo].color;i=e,this.addMesh(rp.ammo,ap(e)),this.addMesh(rp.band,ap(2829096))}else if(a.kind===`weapon`){let e=a.weapon.def;i=lp(Gd[a.weapon.rarity].color);let t=e.cls===`launcher`?1.9:e.cls===`lmg`||e.cls===`flamer`?1.35:1;this.addMesh(rp.gun,ap(3093046)).scale.set(.09*t,.1*t,e.gunLength+.25);let n=this.addMesh(rp.gun,ap(5916208));if(n.scale.set(.08,.13,.22),n.position.z=-(e.gunLength+.25)/2-.08,this.item.rotation.z=.15,a.weapon.rarity!==`standard`){let e=new H(rp.beam,sp(i,.35));e.position.y=1.1,this.group.add(e)}}else if(a.kind===`attachment`)i=5953791,this.addMesh(rp.att,ap(3820117,663600));else if(a.kind===`gear`){i=11587839;let e=ap(a.gear.color);if(a.gear.slot===`helmet`)this.addMesh(rp.helmet,e);else if(a.gear.slot===`vest`)this.addMesh(rp.vest,e);else{let t=this.addMesh(rp.boot,e),n=this.addMesh(rp.boot,e);t.position.x=-.08,n.position.x=.08}}else if(a.kind===`gadget`){i=16765002;let e=ap($d[a.gadget].color);if(a.gadget===`mine`)this.addMesh(rp.disc,e);else if(a.gadget===`drone`){this.addMesh(rp.plate,e).scale.set(.8,2,.8);for(let[e,t]of[[-.18,-.14],[.18,-.14],[-.18,.14],[.18,.14]]){let n=this.addMesh(rp.disc,ap(2237994));n.scale.set(.4,.4,.4),n.position.set(e,.05,t)}}else if(a.gadget===`medkit`){this.addMesh(rp.medkit,e);let t=this.addMesh(rp.crossA,ap(16777215)),n=this.addMesh(rp.crossB,ap(16777215));t.position.y=n.position.y=.115}else this.addMesh(rp.can,e)}else if(a.kind===`armor`)i=4891624,this.addMesh(rp.plate,ap(4871520));else{i=13162592;let e=this.addMesh(rp.grenade,ap(5200428));e.scale.y=1.25}this.group.add(this.item),this.ring=new H(rp.ring,sp(i)),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=.03,a.kind===`weapon`&&this.ring.scale.setScalar(1.25),this.group.add(this.ring)}addMesh(e,t){let n=new H(e,t);return n.castShadow=!0,this.item.add(n),n}get expired(){return this.taken||this.age>=this.life}get manual(){return this.payload.kind===`weapon`||this.payload.kind===`gear`}get label(){let e=this.payload;switch(e.kind){case`medkit`:return`Medipack`;case`ammo`:return Wd[e.ammo].name;case`weapon`:return`${e.weapon.def.name}${e.weapon.rarity===`standard`?``:` (${Gd[e.weapon.rarity].name})`}`;case`attachment`:return Kd[e.att].name;case`grenade`:return e.count>1?`${e.count} Granaten`:`Granate`;case`gear`:return e.gear.name;case`gadget`:return e.count>1?`${e.count} ${$d[e.gadget].plural}`:$d[e.gadget].name;case`armor`:return`Panzerplatte`}}render(e){this.age+=e;let t=this.age,n=this.payload.kind===`weapon`||this.payload.kind===`gear`;this.item.position.y=(n?.25:.32)+Math.sin(t*3)*.05,this.item.rotation.y=t*(n?.8:1.6);let r=(n?1.25:1)*(1+Math.sin(t*4)*.08);this.ring.scale.set(r,r,r);let i=this.life-t;this.group.visible=i>5||Math.floor(t*6)%2==0}},dp=class{scene;list=[];constructor(e){this.scene=e}spawn(e,t,n,r=60){let i=new up(e,t,n,r);return this.list.push(i),this.scene.add(i.group),i}prune(){if(this.list.some(e=>e.expired)){for(let e of this.list)e.expired&&this.scene.remove(e.group);this.list=this.list.filter(e=>!e.expired)}}clear(){for(let e of this.list)this.scene.remove(e.group);this.list=[]}render(e){for(let t of this.list)t.render(e)}};function fp(e,t,n,r,i=1.7){let a=Md(e.blocksShot,n,r,t.x,t.z);return a?Math.hypot(a.x-t.x,a.z-t.z)<i:!1}function pp(e,t,n,r){let i=null,a=1/0;for(let[o,s]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){let c=t.x+o,l=t.z+s,u=Math.floor(c),d=Math.floor(l);if(e.solid(u,d)||o!==0&&s!==0&&(e.solid(Math.floor(t.x+o),Math.floor(t.z))||e.solid(Math.floor(t.x),Math.floor(t.z+s)))||Md(e.blocksShot,c,l,n,r))continue;let f=Math.abs(o)+Math.abs(s);f<a&&(a=f,i={x:c,z:l})}return i}var mp=class{map;spots=[];constructor(e){this.map=e;for(let t=0;t<e.h;t++)for(let n=0;n<e.w;n++)e.solid(n,t)||(e.blocksShot(n+1,t)||e.blocksShot(n-1,t)||e.blocksShot(n,t+1)||e.blocksShot(n,t-1))&&n!==0&&t!==0&&n!==e.w-1&&t!==e.h-1&&this.spots.push({x:n+.5,z:t+.5,owner:null})}reset(){for(let e of this.spots)e.owner=null}find(e,t,n,r,i,a,o,s=9){let c=null,l=1/0;for(let u of this.spots){let d=Math.hypot(u.x-e,u.z-t);if(d>s||u.owner&&u.owner!==o&&u.owner.alive)continue;let f=Math.hypot(u.x-n,u.z-r);if(f<4||f>a)continue;let p=d+Math.abs(f-i)*.4;p>=l||fp(this.map,u,n,r)&&pp(this.map,u,n,r)&&(c=u,l=p)}return c}},hp=2.2,gp=2,_p=3,vp=3,yp=1.6,bp=(e,t)=>e+Math.random()*(t-e),xp=(e,t)=>Math.hypot(e.x-t.x,e.z-t.z);function Sp(e,t){let n=e-t;for(;n>Math.PI;)n-=Math.PI*2;for(;n<-Math.PI;)n+=Math.PI*2;return n}function Cp(e){e.cover&&e.cover.owner===e&&(e.cover.owner=null),e.cover=null,e.coverPhase=`none`,e.peekAt=null,e.role=`normal`,e.flankTo=null}function wp(e,t){e.state!==t&&(t!==`attack`&&Cp(e),e.state=t,e.stateT=0,e.path=null,e.pathFailed=!1,e.pathGoal.x=NaN,e.lastSearch=null,e.waitT=0)}function Tp(e,t){let n=t.player;if(n.dead)return!1;let r=n.pos.x-e.pos.x,i=n.pos.z-e.pos.z,a=Math.hypot(r,i),o=e.state===`attack`||e.state===`search`;if(a>e.def.viewRange*(o?1.4:1))return!1;if(a>hp){let t=o?Math.PI*.8:e.def.fov/2;if(Math.abs(Sp(Math.atan2(r,i),e.facing))>t)return!1}return Md(n.crouched?t.map.blocksShot:t.map.blocksSight,e.pos.x,e.pos.z,n.pos.x,n.pos.z)||n.crouched&&a>3&&t.map.bush(Math.floor(n.pos.x),Math.floor(n.pos.z))?!1:a<1.6||!t.smokeBlocks(e.pos.x,e.pos.z,n.pos.x,n.pos.z)}function Ep(e,t,n){let r=e.state;if(e.awareness=1,r!==`attack`&&(wp(e,`attack`),e.sinceSeen=0,e.reactionT=e.def.reaction*bp(.8,1.3)*a().reaction,e.burstLeft=0,e.burstPauseT=0,e.alertShowT=1.3,t.enemyAlerted(e),Fp(e,t)),n)for(let n of t.enemies)n!==e&&n.alive&&n.state!==`attack`&&(xp(n.pos,e.pos)>a().radio||(n.lastKnown.x=e.lastKnown.x,n.lastKnown.z=e.lastKnown.z,Ep(n,t,!1)))}function Dp(e,t,n,r,i){e.alive&&(Math.hypot(e.pos.x-n,e.pos.z-r)>i*a().hear||(e.state===`attack`?e.seeing||(e.lastKnown.x=n,e.lastKnown.z=r):(e.lastKnown.x=n+bp(-1.5,1.5),e.lastKnown.z=r+bp(-1.5,1.5),e.awareness=Math.max(e.awareness,.5),e.state!==`investigate`&&(wp(e,`suspicious`),e.stateT=.6))))}function Op(e,t){e.alive&&(e.stunT=Math.max(e.stunT,t),e.burstLeft=0,e.path=null)}function kp(e,t,n,r){e.alive&&(e.lastKnown.x=n,e.lastKnown.z=r,e.coverPhase===`peek`&&(e.coverPhase=`hide`,e.coverT=bp(1,1.8)),Ep(e,t,!0))}function Ap(e,t,n,r,i){if(i.x=0,i.z=0,xp(e.pos,n)<.35)return e.path=null,!0;let a=!(Math.abs(e.pathGoal.x-n.x)<1&&Math.abs(e.pathGoal.z-n.z)<1);if((e.path===null&&!e.pathFailed||a&&e.repathT<=0)&&(t.paths.pending(e)||(e.pathGoal.x=n.x,e.pathGoal.z=n.z,e.repathT=.5,t.paths.request(e,e.pos,n,t=>{e.path=t,e.pathIdx=0,e.pathFailed=t===null}))),e.pathFailed&&e.path===null)return!0;if(!e.path)return!1;let o=e.path[e.pathIdx];for(;o&&xp(e.pos,o)<.3;)e.pathIdx++,o=e.path[e.pathIdx];if(!o)return e.path=null,xp(e.pos,n)<1.2;let s=o.x-e.pos.x,c=o.z-e.pos.z,l=Math.hypot(s,c);return i.x=s/l*r,i.z=c/l*r,!1}function jp(e,t){for(let n=0;n<12;n++){let n=Math.random()*Math.PI*2,r=bp(2,6),i=e.lastKnown.x+Math.cos(n)*r,a=e.lastKnown.z+Math.sin(n)*r;if(!t.map.solid(Math.floor(i),Math.floor(a)))return{x:i,z:a}}return{x:e.lastKnown.x,z:e.lastKnown.z}}var Q={x:0,z:0};function Mp(e,t,n){if(e.prev.x=e.pos.x,e.prev.z=e.pos.z,!e.alive)return;e.stateT+=n,e.repathT-=n;let r=t.player;if(e.stunT>0){e.stunT-=n,e.seeing=!1,e.sightTime=0,e.facing+=Math.sin(e.stateT*5)*n*2.5,e.vel.x*=.85,e.vel.z*=.85,Ad(t.map.solid,e.pos,e.radius,e.vel.x*n,e.vel.z*n),e.stunT<=0&&(e.lastKnown.x=r.pos.x,e.lastKnown.z=r.pos.z,Ep(e,t,!1),e.reactionT=e.def.reaction*1.5);return}let i=Tp(e,t);e.seeing=i;let a=xp(e.pos,r.pos);if(i?(e.sightTime+=n,e.sinceSeen=0,e.lastKnown.x=r.pos.x,e.lastKnown.z=r.pos.z):(e.sightTime=0,e.sinceSeen+=n),e.state!==`attack`){if(i){let i=1.8-ql((a-3)/Math.max(1,e.def.viewRange-3),0,1)*1.45;r.crouched&&(i*=.55),t.map.bush(Math.floor(r.pos.x),Math.floor(r.pos.z))&&(i*=.5),r.sprinting&&(i*=1.4),e.state!==`patrol`&&e.state!==`return`&&(i*=2),e.awareness=Math.min(1,e.awareness+i*n),a<hp&&(e.awareness=1),e.awareness>=1?Ep(e,t,!0):e.awareness>=.3&&(e.state===`patrol`||e.state===`return`)&&wp(e,`suspicious`)}else e.state===`patrol`&&(e.awareness=Math.max(0,e.awareness-.15*n))}Q.x=0,Q.z=0;let o=4,s=e.def;switch(e.state){case`patrol`:e.patrol.length>1?(e.waitT>0?e.waitT-=n:Ap(e,t,e.patrol[e.patrolIdx],s.speedPatrol,Q)&&(e.patrolIdx=(e.patrolIdx+1)%e.patrol.length,e.waitT=bp(1,2.2),e.path=null,e.pathFailed=!1),(Q.x!==0||Q.z!==0)&&(e.wantYaw=Math.atan2(Q.x,Q.z))):(xp(e.pos,e.home)>.5&&Ap(e,t,e.home,s.speedPatrol,Q),e.wantYaw=e.home.yaw+Math.sin(e.stateT*.6)*.7),o=2.5;break;case`suspicious`:e.wantYaw=Math.atan2(e.lastKnown.x-e.pos.x,e.lastKnown.z-e.pos.z),!i&&e.stateT>1.2?wp(e,`investigate`):!i&&e.awareness<=0&&wp(e,`return`);break;case`investigate`:Ap(e,t,e.lastKnown,s.speedMove*.7,Q)&&(wp(e,`search`),e.searchLeft=2),(Q.x!==0||Q.z!==0)&&(e.wantYaw=Math.atan2(Q.x,Q.z));break;case`attack`:if(o=7,Lp(e,t,n,i,a))break;if(i){e.wantYaw=Math.atan2(r.pos.x-e.pos.x,r.pos.z-e.pos.z);let i=a<=s.weapon.range*.9&&t.onScreen(e.pos.x,e.pos.z),o=!Md(t.map.blocksShot,e.pos.x,e.pos.z,r.pos.x,r.pos.z);if(o&&i){if(s.rusher&&a>s.preferredDist)Ap(e,t,r.pos,s.speedMove,Q);else{e.strafeT-=n,e.strafeT<=0&&(e.strafeT=bp(1.2,2.4),e.strafeDir=Math.random()<.5?-1:1);let t=Math.cos(e.wantYaw)*e.strafeDir,r=-Math.sin(e.wantYaw)*e.strafeDir,i=a<s.preferredDist*.6?.6:1.3;Q.x=t*i,Q.z=r*i,!s.rusher&&a<s.preferredDist*.5&&(Q.x-=Math.sin(e.wantYaw)*1.5,Q.z-=Math.cos(e.wantYaw)*1.5)}Rp(e,t,n)}else Ap(e,t,r.pos,s.speedMove,Q),i&&o&&Rp(e,t,n)}else{let n=Ap(e,t,e.lastKnown,s.speedMove,Q);(Q.x!==0||Q.z!==0)&&(e.wantYaw=Math.atan2(Q.x,Q.z)),(n||e.sinceSeen>9)&&(wp(e,`search`),e.searchLeft=3,e.awareness=.8)}break;case`search`:e.lastSearch||=jp(e,t),e.waitT>0?(e.waitT-=n,e.wantYaw+=n*1.6):(Ap(e,t,e.lastSearch,s.speedMove*.6,Q)&&(e.searchLeft--,e.waitT=bp(.8,1.6),e.path=null,e.pathFailed=!1,e.lastSearch=jp(e,t),e.searchLeft<=0&&wp(e,`return`)),(Q.x!==0||Q.z!==0)&&(e.wantYaw=Math.atan2(Q.x,Q.z)));break;case`return`:Ap(e,t,e.patrol.length>1?e.patrol[e.patrolIdx]:e.home,s.speedPatrol*1.2,Q)&&(wp(e,`patrol`),e.awareness=0),(Q.x!==0||Q.z!==0)&&(e.wantYaw=Math.atan2(Q.x,Q.z));break;case`dead`:return}if(e.laserOn=!!s.laser&&e.state===`attack`&&i&&e.reloadT<=0&&t.onScreen(e.pos.x,e.pos.z),s.grenades&&e.state===`attack`){e.grenadeCd-=n;let r=e.lastKnown.x,i=e.lastKnown.z,a=Math.hypot(r-e.pos.x,i-e.pos.z);e.grenadeCd<=0&&e.sinceSeen<4&&a>4&&a<14&&t.onScreen(e.pos.x,e.pos.z)&&(t.enemyGrenade(e,r,i),e.grenadeCd=bp(5,8))}s.stationary&&(Q.x=0,Q.z=0,(e.state===`search`||e.state===`investigate`||e.state===`return`)&&e.stateT>6&&wp(e,`patrol`)),e.facing=Yl(e.facing,e.wantYaw,o*n);let c=Math.min(1,n*10);e.vel.x+=(Q.x-e.vel.x)*c,e.vel.z+=(Q.z-e.vel.z)*c,Ad(t.map.solid,e.pos,e.radius,e.vel.x*n,e.vel.z*n);for(let n of t.enemies)n!==e&&n.alive&&jd(e.pos,e.radius,n.pos.x,n.pos.z,n.radius);r.dead||jd(e.pos,e.radius,r.pos.x,r.pos.z,r.radius),e.vel.x=(e.pos.x-e.prev.x)/n,e.vel.z=(e.pos.z-e.prev.z)/n}var Np=7,Pp=3.5;function Fp(e,t){if(!e.def.flanker||!a().flank||e.def.stationary)return;let n=t.player,r=t.enemies.filter(t=>t!==e&&t.alive&&t.state===`attack`&&xp(t.pos,n.pos)<22);if(r.length<1||r.some(e=>e.role===`flank`)||Math.random()>.65)return;let i=0,o=0;for(let e of r)i+=e.pos.x,o+=e.pos.z;i/=r.length,o/=r.length;let s=n.pos.x-i,c=n.pos.z-o,l=Math.hypot(s,c)||1;s/=l,c/=l;let u=(e,t)=>({x:n.pos.x-c*e*t+s*1.5,z:n.pos.z+s*e*t+c*1.5}),d=[1,-1].sort((t,n)=>xp(u(t,Np),e.pos)-xp(u(n,Np),e.pos));for(let n of d)for(let r of[Np,5.5,4]){let i=u(n,r);if(!t.map.solid(Math.floor(i.x),Math.floor(i.z))){e.role=`flank`,e.flankTo=i,e.flankT=0;return}}}function Ip(e,t){e.reloadT>0&&(e.reloadT-=t,e.reloadT<=0&&(e.mag=e.def.weapon.magSize))}function Lp(e,t,n,r,i){let a=t.player,o=e.def;if(e.role===`flank`&&e.flankTo){e.flankT+=n;let s=Ap(e,t,e.flankTo,o.speedMove*1.1,Q);return(Q.x!==0||Q.z!==0)&&(e.wantYaw=Math.atan2(Q.x,Q.z)),r&&i<6&&(e.wantYaw=Math.atan2(a.pos.x-e.pos.x,a.pos.z-e.pos.z),t.onScreen(e.pos.x,e.pos.z)&&!Md(t.map.blocksShot,e.pos.x,e.pos.z,a.pos.x,a.pos.z)&&Rp(e,t,n)),(s||e.flankT>8||xp(a.pos,e.flankTo)>10)&&(e.role=`normal`,e.flankTo=null),!0}if(!o.cover||o.stationary)return!1;if(i<Pp||e.sinceSeen>5)return e.cover&&Cp(e),!1;e.coverCheckT-=n;let s=e.lastKnown.x,c=e.lastKnown.z;if(e.coverCheckT<=0&&(e.coverCheckT=bp(.5,.8),e.cover&&!fp(t.map,e.cover,s,c)&&Cp(e),!e.cover)){let n=t.cover.find(e.pos.x,e.pos.z,s,c,o.preferredDist,o.weapon.range*.85,e);n&&(n.owner=e,e.cover=n,e.coverPhase=`move`,e.path=null,e.pathFailed=!1)}let l=e.cover;if(!l)return!1;let u=t.onScreen(e.pos.x,e.pos.z);if(e.offScreenT=u?0:e.offScreenT+n,e.offScreenT>2.5)return Cp(e),e.coverCheckT=2.5,!1;let d=r&&!Md(t.map.blocksShot,e.pos.x,e.pos.z,a.pos.x,a.pos.z),f=()=>{d&&u&&i<=o.weapon.range*.9?Rp(e,t,n):Ip(e,n)},p=()=>{e.wantYaw=Math.atan2(s-e.pos.x,c-e.pos.z)};switch(e.coverPhase){case`move`:{let n=Ap(e,t,l,o.speedMove,Q);r?p():(Q.x!==0||Q.z!==0)&&(e.wantYaw=Math.atan2(Q.x,Q.z)),f(),(n||xp(e.pos,l)<.4)&&(e.coverPhase=`hide`,e.coverT=bp(.5,1));break}case`hide`:if(Ap(e,t,l,o.speedMove*.8,Q),p(),Ip(e,n),e.coverT-=n,e.coverT<=0&&e.reloadT<=0){if(e.peekAt=pp(t.map,l,s,c),!e.peekAt)return Cp(e),e.coverCheckT=0,!1;e.coverPhase=`peek`,e.coverT=bp(1.8,2.8),e.peekShots=0,e.burstPauseT=0}break;case`peek`:{Ap(e,t,e.peekAt??l,o.speedMove*.9,Q),p();let r=e.mag;f(),e.mag<r&&e.peekShots++,e.coverT-=n;let i=e.peekShots>0&&e.burstLeft<=0;(e.coverT<=0||i||e.reloadT>0)&&(e.coverPhase=`hide`,e.coverT=bp(.6,1.2),e.peekShots=0);break}default:return!1}return!0}function Rp(e,t,n){let r=e.def,i=r.weapon;if(e.fireCd-=n,e.reloadT>0){e.reloadT-=n,e.reloadT<=0&&(e.mag=i.magSize);return}if(e.reactionT>0){e.reactionT-=n;return}if(e.burstLeft<=0){if(e.burstPauseT-=n,e.burstPauseT>0)return;let i=0;for(let n of t.enemies)n!==e&&n.alive&&n.burstLeft>0&&i++;if(i>=a().shooters){e.burstPauseT=bp(.3,.8);return}e.burstLeft=Math.round(bp(r.burst[0],r.burst[1]))}if(e.fireCd>0)return;let o=t.player,s=Math.atan2(o.pos.x-e.pos.x,o.pos.z-e.pos.z);if(Math.abs(Sp(e.facing,s))>.3)return;let c=ql(e.sightTime/vp,0,1),l=i.spread*gp*(_p-1.65*c);e.speed>1&&(l*=1.35),Math.hypot(o.vel.x,o.vel.z)>2&&(l*=yp),t.touchMode&&(l*=1.3),t.enemyFire(e,s+(Math.random()+Math.random()-1)*l),e.mag--,e.burstLeft--,e.fireCd=1/i.fireRate,e.recoilAnim=1,e.burstLeft<=0&&(e.burstPauseT=bp(r.burstPause[0],r.burstPause[1])),e.mag<=0&&(e.reloadT=i.reloadTime,e.burstLeft=0)}var zp=4.2,Bp=46,Vp=.9,Hp=2.5,Up=class{pool=[];tex=mu();constructor(e,t=4){for(let n=0;n<t;n++){let t=new Float32Array(138),n=new Mr,r=new _r(new Float32Array(138),3);n.setAttribute(`position`,r);let i=new Bi({map:this.tex,color:12172737,size:3.4,sizeAttenuation:!0,transparent:!0,opacity:0,depthWrite:!1}),a=new Gi(n,i);a.frustumCulled=!1,a.visible=!1,a.renderOrder=8,e.add(a),this.pool.push({active:!1,x:0,z:0,t:0,points:a,mat:i,base:t,pos:r})}}spawn(e,t){let n=this.pool.find(e=>!e.active)??this.pool.reduce((e,t)=>e.t>t.t?e:t);n.active=!0,n.x=e,n.z=t,n.t=0;for(let e=0;e<Bp;e++){let t=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*zp*.85;n.base[e*3]=Math.cos(t)*r,n.base[e*3+1]=.4+Math.random()*2.2,n.base[e*3+2]=Math.sin(t)*r}n.points.position.set(e,0,t),n.points.visible=!0}clear(){for(let e of this.pool)e.active=!1,e.points.visible=!1}areas(){let e=[];for(let t of this.pool)!t.active||t.t>11-Hp*.6||e.push({x:t.x,z:t.z,r:zp*Math.min(1,t.t/Vp)});return e}update(e){for(let t of this.pool){if(!t.active)continue;if(t.t+=e,t.t>=11){t.active=!1,t.points.visible=!1;continue}let n=Math.min(1,t.t/Vp),r=Math.min(1,(11-t.t)/Hp);t.mat.opacity=.55*Math.min(n*1.5,r);let i=t.pos.array;for(let e=0;e<Bp;e++){let r=.35+.65*n+t.t*.015;i[e*3]=t.base[e*3]*r,i[e*3+1]=t.base[e*3+1]*(.5+.5*n)+t.t*.04,i[e*3+2]=t.base[e*3+2]*r}t.pos.needsUpdate=!0}}},Wp={mine:new Qi(.22,.25,.07,14),led:new Qi(.04,.04,.03,8),body:new U(.36,.09,.36),arm:new U(.62,.03,.05),rotor:new Qi(.14,.14,.01,12),crate:new U(.62,.42,.46),radio:new U(.34,.24,.2),antenna:new Qi(.012,.012,1.3,5),pole:new Qi(.025,.025,2.3,6),flag:new na(.62,.38,6,1),ring:new ra(.85,1,36)},Gp=(e,t=.6)=>new ui({color:e,transparent:!0,opacity:t,blending:2,depthWrite:!1,toneMapped:!1}),Kp=3.6,qp=Z(new W({color:3817267})),Jp=new ui({color:16722458,toneMapped:!1}),Yp=new ui({color:4198416}),Xp=class{x;z;group=new An;led;t=0;done=!1;constructor(e,t){this.x=e,this.z=t;let n=new H(Wp.mine,qp);n.position.y=.035,n.receiveShadow=!0,this.group.add(n),this.led=new H(Wp.led,Yp),this.led.position.y=.08,this.group.add(this.led),this.group.position.set(e,0,t)}get armed(){return this.t>=1}update(e){this.t+=e;let t=this.armed?Math.floor(this.t*2.5)%2==0:Math.floor(this.t*8)%2==0;this.led.material=t?Jp:Yp}},Zp=14,Qp=3.2,$p=new W({color:10134445}),em=new W({color:2237994}),tm=class{tx;tz;group=new An;rotors=[];light;ring;x;z;y=1.5;phase=`fly`;t=0;constructor(e,t,n,r){this.tx=n,this.tz=r,this.x=e,this.z=t,this.group.add(new H(Wp.body,$p));for(let e of[.785,-.785]){let t=new H(Wp.arm,$p);t.rotation.y=e,this.group.add(t)}for(let[e,t]of[[.22,.22],[-.22,.22],[.22,-.22],[-.22,-.22]]){let n=new H(Wp.rotor,em);n.position.set(e,.05,t),this.rotors.push(n),this.group.add(n)}this.light=new H(Wp.led,Jp),this.light.position.y=-.06,this.group.add(this.light),this.ring=new H(Wp.ring,Gp(5953791,.35)),this.ring.rotation.x=-Math.PI/2,this.ring.visible=!1}get marker(){return this.ring}get revealing(){return this.phase===`hover`}update(e){if(this.t+=e,this.phase===`fly`){this.y+=(Qp-this.y)*Math.min(1,e*3);let t=this.tx-this.x,n=this.tz-this.z,r=Math.hypot(t,n),i=Zp*e;r<=i?(this.x=this.tx,this.z=this.tz,this.phase=`hover`,this.t=0):(this.x+=t/r*i,this.z+=n/r*i)}else this.phase===`hover`?(this.y=Qp+Math.sin(this.t*2)*.12,this.t>=8&&(this.phase=`leave`,this.t=0)):this.phase===`leave`&&(this.y+=e*6,this.t>1.2&&(this.phase=`done`));this.group.position.set(this.x,this.y,this.z);for(let t of this.rotors)t.rotation.y+=e*40;this.light.visible=Math.floor(this.t*3)%2==0,this.ring.visible=this.phase===`hover`,this.ring.visible&&(this.ring.position.set(this.x,.06,this.z),this.ring.scale.setScalar(9))}},nm=1.6,rm=Z(new W({color:5595194})),im=Z(new W({color:2830122})),am=Z(new W({color:10132112})),om=class{index;x;z;group=new An;flag;flagMat;ring;ringMat;active=!1;t=Math.random()*10;constructor(e,t,n){this.index=e,this.x=t,this.z=n;let r=new H(Wp.crate,rm);r.position.y=.21,r.castShadow=!0;let i=new H(Wp.radio,im);i.position.set(-.08,.54,0),i.castShadow=!0;let a=new H(Wp.antenna,am);a.position.set(-.18,1.3,0);let o=new H(Wp.pole,am);o.position.set(.24,1.15,0),o.castShadow=!0,this.flagMat=Z(new W({color:9079428,side:2})),this.flag=new H(Wp.flag,this.flagMat),this.flag.position.set(.56,2.1,0),this.ringMat=Gp(16777215,.25),this.ring=new H(Wp.ring,this.ringMat),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=.04,this.ring.scale.setScalar(nm*.8),this.group.add(r,i,a,o,this.flag,this.ring),this.group.position.set(t,0,n)}setActive(e){this.active=e,this.flagMat.color.setHex(e?4181850:9079428),this.ringMat.color.setHex(e?4194154:16777215),this.ringMat.opacity=e?.55:.25}render(e){this.t+=e,this.flag.rotation.y=Math.sin(this.t*2.2)*.25;let t=nm*.8*(1+Math.sin(this.t*3)*(this.active?.05:.02));this.ring.scale.setScalar(t)}},sm=`frontline.save.v1`;function cm(e){try{return localStorage.setItem(sm,JSON.stringify(e)),!0}catch{return!1}}function lm(){try{let e=localStorage.getItem(sm);if(!e)return null;let t=JSON.parse(e);return t.version===1?t:null}catch{return null}}function um(){try{localStorage.removeItem(sm)}catch{}}function dm(e){let t=new Uint8Array(Math.ceil(e.length/8));for(let n=0;n<e.length;n++)e[n]&&(t[n>>3]|=1<<(n&7));let n=``;for(let e=0;e<t.length;e++)n+=String.fromCharCode(t[e]);return btoa(n)}function fm(e,t){t.fill(0);let n=``;try{n=atob(e)}catch{return}for(let e=0;e<t.length;e++)n.charCodeAt(e>>3)&1<<(e&7)&&(t[e]=1)}var pm={hp:{name:`Zähigkeit`,icon:`♥`,desc:e=>`Max. Leben ${100+e*15}`,cost:[120,200,300]},ammo:{name:`Patronengurt`,icon:`▤`,desc:e=>`+${e*25} % Munitionsvorrat`,cost:[100,180,260]},reload:{name:`Schnellladen`,icon:`↻`,desc:e=>`−${e*10} % Nachladezeit`,cost:[100,180,260]},grenades:{name:`Granatentasche`,icon:`◉`,desc:e=>`${4+e} Granatenplätze`,cost:[80,140,200]}};function mm(e){return{maxHp:100+e.hp*15,ammoMul:1+e.ammo*.25,reloadMul:1-e.reload*.1,maxGrenades:4+e.grenades}}function hm(){return{version:1,next:0,credits:0,upgrades:{hp:0,ammo:0,reload:0,grenades:0},loadout:null,best:{}}}function gm(e){let t=[[`Mission erfüllt`,150],[`Abschüsse (${e.kills} × 10)`,e.kills*10]];return e.sideDone>0&&t.push([`Nebenziele (${e.sideDone} × 75)`,e.sideDone*75]),e.time<480&&t.push([`Zeitbonus (unter 8 Min.)`,60]),{total:t.reduce((e,[,t])=>e+t,0),parts:t}}function _m(e,t){let n=e.upgrades[t];if(n>=3)return!1;let r=pm[t].cost[n];return e.credits<r?!1:(e.credits-=r,e.upgrades[t]=n+1,!0)}var vm=`frontline.campaign.v1`;function ym(){try{let e=localStorage.getItem(vm);if(!e)return null;let t=JSON.parse(e);return t.version===1?{...hm(),...t,upgrades:{...hm().upgrades,...t.upgrades}}:null}catch{return null}}function bm(e){try{localStorage.setItem(vm,JSON.stringify(e))}catch{}}function xm(){try{localStorage.removeItem(vm)}catch{}}var Sm=1.9,Cm={frag:Sm,smoke:1.1,flash:1.3},wm={frag:5200428,smoke:9080724,flash:14212578},Tm=4.5,Em=.12,Dm=40*Math.PI/180,Om=1/60;function km(e,t,n){let r=Math.sqrt(Math.max(.5,Math.max(2,Math.min(16,n))-1)*22/Math.sin(2*Dm)),i=Math.hypot(e,t)||1;return{vx:e/i*r*Math.cos(Dm),vy:r*Math.sin(Dm),vz:t/i*r*Math.cos(Dm)}}function Am(e,t,n){let r=!1;e.vy-=22*t;let i=e.x+e.vx*t,a=e.z+e.vz*t,o=e.y+e.vy*t,s=n(Math.floor(i),Math.floor(e.z)),c=n(Math.floor(e.x),Math.floor(a)),l=i,u=a;s>e.y-Em&&(e.vx=-e.vx*.45,l=e.x,r=!0),c>e.y-Em&&(e.vz=-e.vz*.45,u=e.z,r=!0),!r&&n(Math.floor(l),Math.floor(u))>e.y-Em&&(e.vx=-e.vx*.45,e.vz=-e.vz*.45,l=e.x,u=e.z,r=!0),e.x=l,e.z=u;let d=n(Math.floor(e.x),Math.floor(e.z));if(o<d+Em&&(o=d+Em,e.vy<0&&(e.vy<-2&&(r=!0),e.vy=-e.vy*.35,e.vx*=.45,e.vz*=.45,Math.abs(e.vy)<1.2&&(e.vy=0))),e.y=o,e.y<=d+Em+.001){let n=Math.max(0,1-t*7);e.vx*=n,e.vz*=n}return r}function jm(e,t,n=Sm){let r={...e},i=[],a=Math.round(n/Om);for(let e=0;e<a;e++)Am(r,Om,t),e%3==0&&i.push({...r});return{points:i,end:r}}var Mm=40,Nm=class{pool=[];dots;landing;m=new tn;v=new z;constructor(e){let t=new ia(.11,10,8),n=Z(new W({color:wm.frag}));for(let r=0;r<8;r++){let i=new H(t,r===0?n:Z(new W({color:wm.frag})));i.scale.y=1.25,i.castShadow=!0,i.visible=!1,e.add(i);let a=new H(new ra(.9,1,32),new ui({color:16722458,transparent:!0,opacity:.55,depthWrite:!1,toneMapped:!1}));a.rotation.x=-Math.PI/2,a.visible=!1,e.add(a),this.pool.push({danger:a,active:!1,kind:`frag`,t:0,owner:`player`,x:0,y:0,z:0,vx:0,vy:0,vz:0,px:0,py:0,pz:0,mesh:i})}this.dots=new Ni(new ia(.06,6,4),new ui({color:16773552,transparent:!0,opacity:.85,depthWrite:!1,toneMapped:!1}),Mm),this.dots.count=0,this.dots.frustumCulled=!1,e.add(this.dots),this.landing=new H(new ra(.92,1,40),new ui({color:16742970,transparent:!0,opacity:.7,blending:2,depthWrite:!1,toneMapped:!1})),this.landing.rotation.x=-Math.PI/2,this.landing.visible=!1,e.add(this.landing)}get active(){return this.pool.filter(e=>e.active)}throw(e,t,n=`frag`,r=null){let i=this.pool.find(e=>!e.active);return i?(Object.assign(i,e),i.danger&&(i.danger.visible=!!r,r&&(i.danger.position.set(r.x,.07,r.z),i.danger.scale.setScalar(Tm))),i.kind=n,i.mesh.material.color.setHex(wm[n]),i.px=i.x,i.py=i.y,i.pz=i.z,i.t=0,i.owner=t,i.active=!0,i.mesh.visible=!0,!0):!1}clear(){for(let e of this.pool)e.active=!1,e.mesh.visible=!1,e.danger&&(e.danger.visible=!1);this.showPreview(null)}step(e,t,n,r){for(let i of this.pool)i.active&&(i.px=i.x,i.py=i.y,i.pz=i.z,Am(i,e,t)&&n(i),i.t+=e,i.t>=Cm[i.kind]&&(i.active=!1,i.mesh.visible=!1,i.danger&&(i.danger.visible=!1),r(i,i.owner,i.kind)))}render(e,t){for(let n of this.pool){if(!n.active)continue;n.mesh.position.set(n.px+(n.x-n.px)*e,n.py+(n.y-n.py)*e,n.pz+(n.z-n.pz)*e),n.mesh.rotation.x+=.2;let r=n.kind!==`frag`||n.t<1.2999999999999998||Math.floor(t*16)%2==0;n.mesh.visible=r}}showPreview(e,t=Tm){if(!e){this.dots.count=0,this.landing.visible=!1;return}let n=Math.min(Mm,e.points.length);for(let t=0;t<n;t++){let n=e.points[t];this.v.set(n.x,n.y,n.z),this.m.makeTranslation(this.v),this.dots.setMatrixAt(t,this.m)}this.dots.count=n,this.dots.instanceMatrix.needsUpdate=!0,this.landing.visible=!0,this.landing.position.set(e.end.x,.05,e.end.z),this.landing.scale.setScalar(t)}},Pm=class{max;mesh;px;py;pz;vx;vy;vz;life;maxLife;size;grav;colors;cursor=0;scale=1;m=new tn;q=new Mt;p=new z;s=new z;c=new V;constructor(e,t=600){this.max=t,this.px=new Float32Array(t),this.py=new Float32Array(t),this.pz=new Float32Array(t),this.vx=new Float32Array(t),this.vy=new Float32Array(t),this.vz=new Float32Array(t),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.size=new Float32Array(t),this.grav=new Float32Array(t),this.colors=new Uint32Array(t),this.mesh=new Ni(new U(1,1,1),Z(new ui({color:16777215})),t),this.mesh.frustumCulled=!1,this.mesh.count=0;for(let e=0;e<t;e++)this.mesh.setColorAt(e,this.c.set(16777215));e.add(this.mesh)}burst(e,t,n,r){let i=Math.max(1,Math.round(r.count*this.scale)),a=r.dirX??0,o=r.dirZ??0;for(let s=0;s<i;s++){let i=this.cursor;this.cursor=(this.cursor+1)%this.max;let s=Math.random()*Math.PI*2,c=r.speed*(.4+Math.random()*.6);this.px[i]=e,this.py[i]=t,this.pz[i]=n,this.vx[i]=Math.cos(s)*c*.6+a*c,this.vz[i]=Math.sin(s)*c*.6+o*c,this.vy[i]=(r.up??1)*(.5+Math.random()),this.life[i]=this.maxLife[i]=r.life*(.6+Math.random()*.6),this.size[i]=r.size*(.6+Math.random()*.8),this.grav[i]=r.gravity??14,this.colors[i]=r.color}}clear(){this.life.fill(0)}update(e){let t=0;for(let n=0;n<this.max;n++){if(this.life[n]<=0||(this.life[n]-=e,this.life[n]<=0))continue;this.vy[n]-=this.grav[n]*e,this.px[n]+=this.vx[n]*e,this.py[n]+=this.vy[n]*e,this.pz[n]+=this.vz[n]*e,this.py[n]<.02&&(this.py[n]=.02,this.vy[n]=0,this.vx[n]*=.6,this.vz[n]*=.6);let r=this.life[n]/this.maxLife[n],i=this.size[n]*(.3+.7*r);this.p.set(this.px[n],this.py[n],this.pz[n]),this.s.set(i,i,i),this.m.compose(this.p,this.q,this.s),this.mesh.setMatrixAt(t,this.m),this.mesh.setColorAt(t,this.c.set(this.colors[n])),t++}this.mesh.count=t,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}},Fm=class{sprite;light;t=0;constructor(e,t){this.sprite=new ri(new Ur({map:hu(),blending:2,depthWrite:!1,transparent:!0,toneMapped:!1})),this.sprite.visible=!1,e.add(this.sprite),this.light=t?new $a(16758880,0,8,2):null,this.light&&e.add(this.light)}fire(e,t,n){this.t=.055,this.sprite.position.set(e,t,n),this.sprite.material.rotation=Math.random()*Math.PI;let r=.55+Math.random()*.25;this.sprite.scale.set(r,r,r),this.light?.position.set(e,t+.2,n)}update(e){this.t-=e;let t=this.t>0;this.sprite.visible=t,this.light&&(this.light.intensity=t?30:0)}},Im=1.1,Lm=class{hpFill;hpText;armorBar;armorFill;wName;wSlots;wGren;wGadget;gearEl;flashEl;objMain;objSide;objArrow;boss;introEl;introKicker;introText;bossName;bossFill;flashT=0;wMag;wRes;wReload;wReloadFill;weaponPanel;cross;hit;fps;toastEl;hint;vignette;dirs;dirsRoot;healEl;marks=[];dirNext=0;dmgFlash=0;lowPulse=0;cache=new Map;toastTimer=0;hitTimer=0;constructor(e,t){e.innerHTML=`
      <div class="dmg-vignette"></div>
      <div class="flashbang"></div>
      <div class="heal-vignette"></div>
      <div class="dmg-dirs"><i></i><i></i><i></i><i></i></div>
      <div class="hud-vitals">
        <div class="bar hp"><i></i><span></span></div>
        <div class="bar armor"><i></i></div>
        <div class="gear"></div>
      </div>
      <div class="hud-weapon">
        <div class="w-slots"></div>
        <div class="w-name"></div>
        <div class="w-ammo"><b></b><span></span></div>
        <div class="w-reload"><i></i></div>
        <div class="w-gren"></div>
        <div class="w-gadget"></div>
      </div>
      <div class="crosshair"><i class="c-t"></i><i class="c-b"></i><i class="c-l"></i><i class="c-r"></i><i class="c-dot"></i></div>
      <div class="hitmarker"></div>
      <div class="fps"></div>
      <div class="toast"></div>
      <div class="objective"><b></b><span></span></div>
      <div class="bossbar"><b></b><i><s></s></i></div>
      <div class="intro"><div class="intro-bar top"></div><div class="intro-bar bottom"><p class="intro-kicker"></p><p class="intro-text"></p><small>Tippen oder beliebige Taste zum Überspringen</small></div></div>
      <div class="obj-arrow"></div>
      <div class="hint"></div>`;let n=t=>e.querySelector(t);this.hpFill=n(`.bar.hp i`),this.hpText=n(`.bar.hp span`),this.armorBar=n(`.bar.armor`),this.armorFill=n(`.bar.armor i`),this.wName=n(`.w-name`),this.wSlots=n(`.w-slots`),this.wGren=n(`.w-gren`),this.wGadget=n(`.w-gadget`),this.gearEl=n(`.gear`),this.flashEl=n(`.flashbang`),this.objMain=n(`.objective b`),this.objSide=n(`.objective span`),this.objArrow=n(`.obj-arrow`),this.introEl=n(`.intro`),this.introKicker=n(`.intro-kicker`),this.introText=n(`.intro-text`),this.boss=n(`.bossbar`),this.bossName=n(`.bossbar b`),this.bossFill=n(`.bossbar s`),this.wMag=n(`.w-ammo b`),this.wRes=n(`.w-ammo span`),this.wReload=n(`.w-reload`),this.wReloadFill=n(`.w-reload i`),this.weaponPanel=n(`.hud-weapon`),this.cross=n(`.crosshair`),this.hit=n(`.hitmarker`),this.fps=n(`.fps`),this.toastEl=n(`.toast`),this.hint=n(`.hint`),this.vignette=n(`.dmg-vignette`),this.dirsRoot=n(`.dmg-dirs`),this.healEl=n(`.heal-vignette`);let r=document.createElement(`div`);r.className=`shot-marks`,e.appendChild(r);for(let e=0;e<6;e++){let e=document.createElement(`i`);r.appendChild(e),this.marks.push({el:e,x:-999,y:-999,t:0})}this.dirs=Array.from(e.querySelectorAll(`.dmg-dirs i`)),this.weaponPanel.addEventListener(`pointerdown`,e=>{e.pointerType!==`mouse`&&(e.preventDefault(),t.press(`weaponNext`))})}set(e,t,n){this.cache.get(e)!==t&&(this.cache.set(e,t),n(t))}update(e,t){let n=Math.max(0,e.hp/e.maxHp)*100;this.set(`hp`,n.toFixed(1),e=>this.hpFill.style.width=`${e}%`),this.set(`hpT`,String(Math.ceil(e.hp)),e=>this.hpText.textContent=e),this.set(`hpLow`,String(n<30),e=>this.hpFill.parentElement.classList.toggle(`low`,e===`true`)),this.set(`ar`,e.maxArmor>0?(e.armor/e.maxArmor*100).toFixed(1):`none`,e=>{this.armorBar.classList.toggle(`none`,e===`none`),this.armorBar.classList.toggle(`empty`,e===`0.0`),e!==`none`&&(this.armorFill.style.width=`${e}%`)}),this.set(`gear`,e.gear.map(e=>e.title).join(`|`),()=>{this.gearEl.innerHTML=e.gear.map(e=>`<i title="${e.title}">${e.icon}</i>`).join(``)}),this.set(`gadget`,e.gadget?`${e.gadget.icon}${e.gadget.count}${e.gadget.name}`:``,()=>{this.wGadget.textContent=e.gadget?`${e.gadget.icon} ${e.gadget.name} ×${e.gadget.count}  [F]`:``}),this.set(`wn`,`${e.weaponName}|${e.attIcons}|${e.rarityColor}`,()=>{if(this.wName.textContent=e.weaponName,this.wName.style.color=e.rarityColor,e.attIcons){let t=document.createElement(`span`);t.className=`w-att`,t.textContent=e.attIcons,this.wName.appendChild(t)}}),this.set(`slots`,e.slots.map(e=>`${e.label}${e.active?`*`:``}${e.color}`).join(`|`),()=>{this.wSlots.innerHTML=e.slots.map((e,t)=>`<i class="${e.active?`on`:``}${e.label?``:` empty`}" style="--c:${e.color}"><b>${t+1}</b>${e.label||`–`}</i>`).join(``)}),this.set(`gren`,String(e.grenades),e=>this.wGren.textContent=`◉ ${e}`),this.set(`mag`,String(e.mag),e=>this.wMag.textContent=e),this.set(`magLow`,String(e.mag<=Math.ceil(e.magSize*.25)),e=>this.wMag.classList.toggle(`low`,e===`true`)),this.set(`res`,e.reserve===1/0?`∞`:String(e.reserve),e=>this.wRes.textContent=`/ ${e}`),this.set(`rl`,e.reload>=0?e.reload.toFixed(2):`-`,e=>{this.wReload.classList.toggle(`on`,e!==`-`),e!==`-`&&(this.wReloadFill.style.width=`${Number(e)*100}%`)}),this.set(`fps`,e.showFps?String(Math.round(e.fps))+(e.res!==void 0&&e.res<1?` · ${Math.round(e.res*100)} %`:``):``,e=>{this.fps.textContent=e?`${e} FPS`:``}),this.dmgFlash=Math.max(0,this.dmgFlash-t*1.8),this.lowPulse+=t*4;let r=e.hp>0&&e.hp/e.maxHp<.3?.35+Math.sin(this.lowPulse)*.15:0,i=Math.min(1,Math.max(this.dmgFlash,r));this.set(`vig`,i.toFixed(2),e=>this.vignette.style.opacity=e),this.flashT>0&&(this.flashT=Math.max(0,this.flashT-t),this.flashEl.style.opacity=Math.min(1,this.flashT/1.2).toFixed(2));for(let e of this.marks)e.t<=0||(e.t-=t,this.drawMark(e));this.toastTimer>0&&(this.toastTimer-=t,this.toastTimer<=0&&this.toastEl.classList.remove(`show`)),this.hitTimer>0&&(this.hitTimer-=t,this.hitTimer<=0&&this.hit.classList.remove(`show`,`kill`))}crosshair(e,t,n,r){this.cross.style.display=r?``:`none`,r&&(this.cross.style.transform=`translate(${e}px, ${t}px)`,this.cross.style.setProperty(`--gap`,`${Math.min(80,n).toFixed(1)}px`))}hitmarker(e){this.hit.classList.remove(`show`,`kill`),this.hit.offsetWidth,this.hit.classList.add(`show`),e&&this.hit.classList.add(`kill`),this.hitTimer=e?.35:.18}damageFrom(e,t){this.dmgFlash=Math.min(.9,this.dmgFlash+.25+t/60);let n=this.dirs[this.dirNext];this.dirNext=(this.dirNext+1)%this.dirs.length,n.style.transform=`rotate(${e}rad)`,n.classList.remove(`show`),n.offsetWidth,n.classList.add(`show`)}shotMarker(e,t,n){for(let n of this.marks)if(n.t>0&&Math.hypot(n.x-e,n.y-t)<30){n.t=Im;return}let r=this.marks.reduce((e,t)=>e.t<=t.t?e:t);r.x=e,r.y=t,r.t=Im,r.el.classList.toggle(`edge`,n),this.drawMark(r)}drawMark(e){let t=Math.max(0,e.t/Im),n=.6+(1-t)*.9;e.el.style.opacity=Math.min(1,t*1.6).toFixed(2),e.el.style.transform=`translate(${Math.round(e.x)}px, ${Math.round(e.y)}px) scale(${n.toFixed(2)})`}setObjective(e,t){this.set(`objM`,e,e=>{this.objMain.textContent=e,this.objMain.parentElement.classList.toggle(`show`,e!==``)}),this.set(`objS`,t,e=>this.objSide.textContent=e)}intro(e,t=``){this.set(`introK`,e??`\0`,e=>{let t=e!==`\0`;this.introEl.classList.toggle(`show`,t),document.body.classList.toggle(`intro-on`,t),t&&(this.introKicker.textContent=e)}),this.set(`introT`,t,e=>{this.introText.textContent=e,this.introText.classList.remove(`fade`),this.introText.offsetWidth,this.introText.classList.add(`fade`)})}bossBar(e,t){this.set(`bossN`,e,e=>{this.bossName.textContent=e,this.boss.classList.toggle(`show`,e!==``)}),this.set(`bossF`,e?(Math.max(0,t)*100).toFixed(1):`0`,e=>this.bossFill.style.width=`${e}%`)}objectiveArrow(e,t,n,r){this.set(`objA`,r?`${Math.round(e)},${Math.round(t)},${n.toFixed(2)}`:`-`,r=>{this.objArrow.style.display=r===`-`?`none`:``,r!==`-`&&(this.objArrow.style.transform=`translate(${Math.round(e)}px, ${Math.round(t)}px) rotate(${n}rad)`)})}flashBang(e){this.flashT=Math.max(this.flashT,.4+e*2.2),this.flashEl.style.opacity=`1`}healFlash(){let e=this.healEl;e.classList.remove(`show`),e.offsetWidth,e.classList.add(`show`)}setPlayerScreen(e,t){this.set(`pscr`,`${Math.round(e)},${Math.round(t)}`,()=>{this.dirsRoot.style.left=`${Math.round(e)}px`,this.dirsRoot.style.top=`${Math.round(t)}px`})}resetDamage(){this.dmgFlash=0,this.flashT=0,this.flashEl.style.opacity=`0`;for(let e of this.dirs)e.classList.remove(`show`)}toast(e,t=3){this.toastEl.textContent=e,this.toastEl.classList.add(`show`),this.toastTimer=t}setHint(e){this.hint.textContent=e,this.hint.classList.toggle(`show`,e!==``)}},Rm=.62,zm=.22,Bm=1.3;function Vm(e,t,n){let r=document.createElement(e);return r.className=t,n?.appendChild(r),r}var Hm=class{root;input;move;aim;interactBtn;reloadBtn;grenadeBtn;gadgetBtn;gadgetKey=``;grenadeId=null;grenadeOrigin={x:0,y:0};grenadeCount=-1;reloadState=``;constructor(e,t){this.root=e,this.input=t,e.innerHTML=``,this.move=this.makeStick(`left`),this.aim=this.makeStick(`right`),this.reloadBtn=this.addButton(e,`reload`,`↻`,`Laden`),this.reloadBtn.classList.add(`t-reload`);let n=Vm(`div`,`t-buttons`,e);this.addButton(n,`crouch`,`⤓`,`Ducken`),this.grenadeBtn=this.makeGrenadeButton(n),this.gadgetBtn=this.addButton(n,`gadget`,`✚`,`Gadget`,!0),this.gadgetBtn.classList.add(`t-grenade`),this.gadgetBtn.insertAdjacentHTML(`beforeend`,`<span class="cnt"></span>`),this.interactBtn=this.addButton(e,`interact`,`E`,`Nehmen`),this.interactBtn.classList.add(`t-interact`),this.interactBtn.hidden=!0;let r=this.addButton(e,`pause`,`❚❚`,``);r.classList.add(`t-pause`),r.setAttribute(`aria-label`,`Pause`),e.addEventListener(`pointerdown`,this.onDown),e.addEventListener(`pointermove`,this.onMove),e.addEventListener(`pointerup`,this.onUp),e.addEventListener(`pointercancel`,this.onUp),e.addEventListener(`contextmenu`,e=>e.preventDefault()),window.addEventListener(`resize`,()=>this.layout()),this.layout()}radius(){return ql(Math.min(window.innerWidth,window.innerHeight)*.13,44,76)*i.touchSize}makeStick(e){let t=Vm(`div`,`t-stick t-stick-${e}`,this.root),n=Vm(`div`,`t-knob`,t);return e===`right`&&Vm(`div`,`t-firering`,t),{side:e,id:null,ox:0,oy:0,base:t,knob:n}}addButton(e,t,n,r,i=!1){let a=Vm(`button`,`t-btn`,e);a.type=`button`,a.innerHTML=`<span class="i">${n}</span>${r?`<span class="l">${r}</span>`:``}`,i&&a.classList.add(`disabled`),a.addEventListener(`pointerdown`,e=>{e.stopPropagation(),e.preventDefault(),a.classList.contains(`disabled`)||(this.input.setDevice(`touch`),this.input.press(t),a.classList.add(`down`),zl(8))});let o=()=>a.classList.remove(`down`);return a.addEventListener(`pointerup`,o),a.addEventListener(`pointercancel`,o),a.addEventListener(`pointerleave`,o),a}onDown=e=>{if(e.pointerType===`mouse`)return;e.preventDefault(),this.input.setDevice(`touch`);let t=e.clientX<window.innerWidth*.45?this.move:this.aim;if(t.id!==null)return;t.id=e.pointerId;let n=this.radius()+10;t.ox=ql(e.clientX,n,window.innerWidth-n),t.oy=ql(e.clientY,n,window.innerHeight-n);try{this.root.setPointerCapture(e.pointerId)}catch{}t.base.classList.add(`active`),this.place(t),this.drag(t,e.clientX,e.clientY)};onMove=e=>{this.move.id===e.pointerId?this.drag(this.move,e.clientX,e.clientY):this.aim.id===e.pointerId&&this.drag(this.aim,e.clientX,e.clientY)};onUp=e=>{for(let t of[this.move,this.aim])t.id===e.pointerId&&(t.id=null,this.release(t))};drag(e,t,n){let r=this.radius(),i=(t-e.ox)/r,a=(n-e.oy)/r,o=Math.hypot(i,a),s=Math.min(1,o),c=o>1e-6?i/o:0,l=o>1e-6?a/o:0;e.knob.style.transform=`translate(${c*s*r}px, ${l*s*r}px)`;let u=this.input.touch;e.side===`left`?(u.move.x=c*s,u.move.y=-l*s,u.sprint=o>Bm,e.base.classList.toggle(`sprint`,u.sprint)):(u.aimActive=o>zm,u.aimActive&&(u.aim.x=c,u.aim.y=-l),u.fire=o>Rm,e.base.classList.toggle(`firing`,u.fire))}release(e){let t=this.input.touch;e.side===`left`?(t.move.x=0,t.move.y=0,t.sprint=!1):(t.aimActive=!1,t.fire=!1),e.base.classList.remove(`active`,`sprint`,`firing`),e.knob.style.transform=``,this.layout()}layout(){let e=this.radius(),t=window.innerWidth,n=window.innerHeight,r=Math.max(24,Math.min(t,n)*.05);for(let i of[this.move,this.aim])i.base.style.width=i.base.style.height=`${e*2}px`,i.id===null&&(i.ox=i.side===`left`?r+e:t-r-e-Math.min(90,t*.08),i.oy=n-r-e,this.place(i));let a=Math.round(ql(Math.min(t,n)*.11,46,64)*i.touchSize);this.root.style.setProperty(`--tbtn`,`${a}px`);let o=Math.round(a*1.15),s=t-r-e-Math.min(90,t*.08),c=n-r-e,l=ql(s-e*.95-o/2,8,t-o-8),u=ql(c-e*1.55-o/2,8,n-o-8);this.reloadBtn.style.width=this.reloadBtn.style.height=`${o}px`,this.reloadBtn.style.transform=`translate(${l}px, ${u}px)`}setReloadState(e,t){let n=`${e}|${t}`;n!==this.reloadState&&(this.reloadState=n,this.reloadBtn.classList.toggle(`low`,e&&!t),this.reloadBtn.classList.toggle(`busy`,t))}place(e){let t=this.radius();e.base.style.transform=`translate(${e.ox-t}px, ${e.oy-t}px)`}setInteract(e,t=`Nehmen`){this.interactBtn.hidden=!e;let n=this.interactBtn.querySelector(`.l`);n&&(n.textContent=t)}makeGrenadeButton(e){let t=Vm(`button`,`t-btn t-grenade`,e);t.type=`button`,t.innerHTML=`<span class="i">◉</span><span class="l">Granate</span><span class="cnt"></span>`;let n=this.input.touch;t.addEventListener(`pointerdown`,e=>{if(e.stopPropagation(),e.preventDefault(),!(this.grenadeId!==null||t.classList.contains(`disabled`))){this.input.setDevice(`touch`),this.grenadeId=e.pointerId,this.grenadeOrigin={x:e.clientX,y:e.clientY};try{t.setPointerCapture(e.pointerId)}catch{}n.grenadeHeld=!0,n.grenadeDrag.x=n.grenadeDrag.y=0,t.classList.add(`down`),zl(8)}}),t.addEventListener(`pointermove`,e=>{if(e.pointerId!==this.grenadeId)return;let t=this.radius()*1.2;n.grenadeDrag.x=(e.clientX-this.grenadeOrigin.x)/t,n.grenadeDrag.y=(e.clientY-this.grenadeOrigin.y)/t});let r=e=>{e.pointerId===this.grenadeId&&(this.grenadeId=null,n.grenadeHeld=!1,t.classList.remove(`down`),this.input.press(`grenadeRelease`))};return t.addEventListener(`pointerup`,r),t.addEventListener(`pointercancel`,r),t}setGadget(e,t){let n=`${e}|${t}`;if(n===this.gadgetKey)return;this.gadgetKey=n;let r=this.gadgetBtn.querySelector(`.i`),i=this.gadgetBtn.querySelector(`.cnt`);r&&(r.textContent=e||`✚`),i&&(i.textContent=t>0?String(t):``),this.gadgetBtn.classList.toggle(`disabled`,t<=0)}setGrenades(e){if(e===this.grenadeCount)return;this.grenadeCount=e;let t=this.grenadeBtn.querySelector(`.cnt`);t&&(t.textContent=String(e)),this.grenadeBtn.classList.toggle(`disabled`,e<=0)}releaseAll(){this.grenadeId=null,this.grenadeBtn.classList.remove(`down`);for(let e of[this.move,this.aim])e.id=null,this.release(e)}},Um={[q.Floor]:[[52,62,42],[92,110,74]],[q.Wall]:[[130,130,124],[200,200,192]],[q.Water]:[[28,60,80],[47,111,143]],[q.Sandbag]:[[110,100,72],[170,155,115]],[q.Bush]:[[40,70,34],[64,110,52]],[q.Tree]:[[26,48,26],[40,78,38]],[q.Crate]:[[110,82,46],[170,128,72]],[q.PropLow]:[[92,88,70],[150,142,112]],[q.PropHigh]:[[118,112,100],[182,174,156]],[q.PropPost]:[[70,72,60],[112,116,96]]},Wm=44,Gm=8,Km=class{wrap;canvas;ctx;layer=document.createElement(`canvas`);layerCtx;img=null;map=null;fog=null;t=0;big=!1;constructor(e,t){this.wrap=document.createElement(`div`),this.wrap.className=`minimap`,this.canvas=document.createElement(`canvas`),this.wrap.appendChild(this.canvas);let n=document.createElement(`span`);n.className=`mm-hint`,this.wrap.appendChild(n),e.appendChild(this.wrap),this.ctx=this.canvas.getContext(`2d`),this.layerCtx=this.layer.getContext(`2d`),this.wrap.addEventListener(`pointerdown`,e=>{e.preventDefault(),e.stopPropagation(),t.press(`map`)})}setMap(e,t){this.map=e,this.fog=t,this.layer.width=t.gw,this.layer.height=t.gh,this.img=this.layerCtx.createImageData(t.gw,t.gh),this.t=0}toggle(){this.big=!this.big,this.wrap.classList.toggle(`big`,this.big),this.t=0}update(e,t,n,r,i=null){if(this.t-=e,this.t>0||!this.map||!this.fog||!this.img)return;this.t=1/Gm;let a=this.fog,o=this.map,s=this.wrap.getBoundingClientRect(),c=Math.min(2,window.devicePixelRatio||1),l=Math.max(1,Math.round(s.width*c)),u=Math.max(1,Math.round(s.height*c));(this.canvas.width!==l||this.canvas.height!==u)&&(this.canvas.width=l,this.canvas.height=u);let d=this.img.data,f=a.gw;for(let e=0;e<a.gh;e++)for(let t=0;t<f;t++){let n=e*f+t,r=n*4;if(a.enabled&&a.explored[n]===0){d[r+3]=0;continue}let i=Math.floor(t*Du+a.ox),s=Math.floor(e*Du+a.oz),c=(Um[o.windows.has(s*o.w+i)&&o.inBounds(i,s)?q.Wall:o.get(i,s)]??Um[q.Floor])[+(!a.enabled||a.vis[n]>.4)];d[r]=c[0],d[r+1]=c[1],d[r+2]=c[2],d[r+3]=255}this.layerCtx.putImageData(this.img,0,0);let p=this.ctx;p.setTransform(1,0,0,1,0,0),p.clearRect(0,0,l,u);let m,h,g;if(this.big){let e=o.w+2,t=o.h+2;m=Math.min(l/e,u/t),h=-1-(l/m-e)/2,g=-1-(u/m-t)/2}else m=Math.min(l,u)/Wm,h=t.pos.x-l/m/2,g=t.pos.z-u/m/2;let _=e=>(e-h)*m,v=e=>(e-g)*m;p.imageSmoothingEnabled=!1,p.drawImage(this.layer,_(a.ox),v(a.oz),a.gw*Du*m,a.gh*Du*m),p.fillStyle=`#6dff8e`;for(let e of r)!e.expired&&a.exploredAt(e.x,e.z)&&p.fillRect(_(e.x)-2.5*c,v(e.z)-2.5*c,5*c,5*c);p.fillStyle=`#ff4a3a`;for(let e of n)e.alive&&e.inSight&&(p.beginPath(),p.arc(_(e.pos.x),v(e.pos.z),3*c,0,Math.PI*2),p.fill());if(i){let e=_(i.x),t=v(i.z),n=6*c;p.beginPath();for(let r=0;r<10;r++){let i=r/10*Math.PI*2-Math.PI/2,a=r%2?n*.45:n;p.lineTo(e+Math.cos(i)*a,t+Math.sin(i)*a)}p.closePath(),p.fillStyle=`#ffd04a`,p.strokeStyle=`#000`,p.lineWidth=1.5*c,p.stroke(),p.fill()}p.save(),p.translate(_(t.pos.x),v(t.pos.z)),p.rotate(-t.facing+Math.PI);let y=5*c;p.beginPath(),p.moveTo(0,-y*1.3),p.lineTo(y*.9,y),p.lineTo(0,y*.45),p.lineTo(-y*.9,y),p.closePath(),p.fillStyle=`#ffe08a`,p.strokeStyle=`#000`,p.lineWidth=1.5*c,p.stroke(),p.fill(),p.restore()}},qm=-Math.PI/2,Jm=Math.PI/2;function Ym(){let e=new tu(64,44,`Testgelände`,`test`);return e.room(6,6,16,11).clear(12,16,3,1).clear(21,10,1,3),e.vwall(14,7,5),e.crates(8,7,2,1).crates(19,14,2,2),e.enemy(`rifleman`,10,11,0),e.enemy(`assault`,18,9,qm),e.room(40,4,18,14).clear(40,9,1,3).clear(47,17,3,1),e.crates(43,7,2,2).crates(51,7,2,2).crates(47,11,2,3).crates(54,14,2,1),e.enemy(`rifleman`,43,14,Jm,[[54,12]]),e.enemy(`rifleman`,53,5,0),e.enemy(`assault`,45,10,0),e.crates(28,12,2,2).crates(33,21,3,1).crates(25,25,1,3).crates(30,30,2,2),e.hwall(26,18,6).vwall(36,24,6),e.enemy(`rifleman`,25,14,Jm,[[35,14],[35,22],[25,22]]),e.enemy(`assault`,31,26,0),e.hwall(3,23,6).vwall(3,23,4).hwall(14,28,4).vwall(20,30,5),e.crates(10,31,1,2).crates(16,24,2,1),e.enemy(`rifleman`,11,20,Jm,[[23,20]]),e.room(40,26,22,15).clear(40,29,1,9),e.crates(47,28,1,2).crates(47,33,1,1).crates(47,37,1,2),e.dummy(53,29,qm).dummy(56,31,qm).dummy(58,34,qm).dummy(55,37,qm).dummy(59,28,qm),e.item({type:`weapon`,id:`smg`},11,37).item({type:`ammo`,ammo:`light`},12,38),e.item({type:`grenade`,count:2},6,36),e.item({type:`weapon`,id:`shotgun`,rarity:`improved`},5,26).item({type:`ammo`,ammo:`shells`},6,27),e.item({type:`attachment`,att:`grip`},18,33),e.item({type:`medkit`},19,26),e.item({type:`attachment`,att:`extmag`},9,8).item({type:`grenade`,count:2},17,13),e.item({type:`ammo`,ammo:`light`,amount:60},12,13),e.item({type:`weapon`,id:`rifle`},33,23).item({type:`ammo`,ammo:`rifle`},34,23),e.item({type:`attachment`,att:`silencer`},29,9),e.item({type:`weapon`,id:`dmr`,rarity:`elite`},55,16).item({type:`attachment`,att:`scope`},52,5),e.item({type:`weapon`,id:`launcher`},42,15).item({type:`ammo`,ammo:`rockets`},43,16),e.item({type:`weapon`,id:`lmg`},56,9).item({type:`ammo`,ammo:`rifle`,amount:90},56,10),e.checkpoint(16,21).checkpoint(38,20).checkpoint(46,21),e.item({type:`gear`,id:`vestLight`},7,30).item({type:`gear`,id:`helmetLight`},19,8),e.item({type:`gear`,id:`bootsQuiet`},24,16).item({type:`gear`,id:`bootsRun`},30,37),e.item({type:`gear`,id:`vestHeavy`},49,6).item({type:`gear`,id:`helmetCombat`},45,13),e.item({type:`armor`},13,30).item({type:`armor`},35,9).item({type:`armor`},52,12),e.item({type:`gadget`,id:`smoke`,count:2},4,40).item({type:`gadget`,id:`flash`,count:2},16,8),e.item({type:`gadget`,id:`mine`,count:3},38,12).item({type:`gadget`,id:`medkit`,count:2},25,37),e.item({type:`gadget`,id:`drone`,count:2},45,29),[[`smg`,`light`],[`rifle`,`rifle`],[`shotgun`,`shells`],[`dmr`,`rifle`],[`lmg`,`rifle`],[`launcher`,`rockets`],[`flamer`,`fuel`]].forEach(([t,n],r)=>{e.item({type:`weapon`,id:t},42,27+r*2),n&&e.item({type:`ammo`,ammo:n},43,27+r*2)}),e.item({type:`grenade`,count:4},44,38),e.spawn(8,38),e.map}var Xm=-Math.PI/2,Zm=Math.PI/2;function Qm(){let e=new tu(64,52,`Küstenlandung`,`beach`);e.ground(0,0,64,52,Y.Grass),e.ground(0,34,64,18,Y.Sand),e.ground(0,27,64,7,Y.Dirt),e.path([[32,34],[31,27],[33,21],[31.5,13],[32,5]],3.5,Y.Dirt,5),e.path([[6,26],[12,22],[18,20],[26,19]],2,Y.Dirt,6).path([[38,19],[46,20],[52,23],[58,26]],2,Y.Dirt,7),e.ground(26,0,12,6,Y.Concrete),e.fill(0,48,64,4,q.Water),e.fill(0,47,20,1,q.Water).fill(40,47,24,1,q.Water),e.fill(6,41,3,1,q.Sandbag).fill(16,39,1,3,q.Sandbag).fill(24,42,3,1,q.Sandbag),e.fill(38,41,3,1,q.Sandbag).fill(46,39,1,3,q.Sandbag).fill(54,42,3,1,q.Sandbag),e.crates(12,44).crates(30,38,2,1).crates(50,44).crates(35,44),e.destructible(`barrel`,22,37).destructible(`barrel`,42,37).destructible(`barrel`,27,31);for(let[t,n]of[[0,6],[15,7],[25,4],[35,4],[42,7],[58,6]])e.fill(t,33,n,1,q.Sandbag);e.style(J.Bunker),e.room(7,28,8,6).clear(10,33,2,1).clear(10,28,2,1),e.room(28,27,8,7).clear(31,33,2,1).clear(31,27,2,1),e.room(50,28,8,6).clear(53,33,2,1).clear(53,28,2,1),e.roof(7,28,8,6,`flat`,9079416).roof(28,27,8,7,`flat`,9079416).roof(50,28,8,6,`flat`,9079416),e.destructible(`flak`,21,30,`flak`).destructible(`flak`,44,30,`flak`),e.style(J.Brick),e.room(25,9,14,11).clear(30,19,4,1).clear(25,13,1,2),e.destructible(`depot`,31,13,`depot`),e.crates(27,11,2,1).crates(35,16,2,2).crates(27,17),e.destructible(`barrel`,36,11).destructible(`barrel`,28,15),e.compound([[6,9,12,7],[8,6,5,3]],{style:J.Wood,roof:`metal`,color:7306588,doors:[[11,15,2],[17,11,2,!1]],windows:!1}),e.compound([[46,9,12,7],[51,6,5,3]],{style:J.Wood,roof:`metal`,color:7306588,doors:[[51,15,2],[46,11,2,!1]],windows:!1}),e.vwall(13,10,3).vwall(53,10,3),e.style(J.Concrete),e.ruin(17,19,6,5,51,{style:J.Stone,keep:.45,rubble:!1}),e.ruin(40,19,6,5,52,{style:J.Plaster,keep:.45,rubble:!1}),e.lowWall(3,18,6,`v`,[2]).lowWall(60,18,6,`v`,[3]),e.house(58,37,5,4,{style:J.Wood,roof:`metal`,color:6969928,doors:[[`w`,1,1]]}),e.house(0,38,4,4,{style:J.Wood,roof:`metal`,color:8018496,doors:[[`e`,1,1]]}),e.style(J.Concrete),e.crates(14,22,2,1).crates(48,21,2,1).fill(29,24,2,1,q.Sandbag).fill(33,24,2,1,q.Sandbag),e.fill(25,6,5,1,q.Sandbag).fill(34,6,5,1,q.Sandbag),e.prop(`boat`,2,46,2).prop(`boat`,15,46,2).prop(`boat`,45,46,2);for(let[t,n]of[[4,43],[19,45],[23,45],[28,44],[37,45],[41,44],[52,45],[58,43],[61,45]])e.prop(`hedgehog`,t,n);return e.prop(`wire`,2,36).prop(`wire`,19,35).prop(`wire`,40,35).prop(`wire`,57,36),e.prop(`crater`,13,36).prop(`crater`,36,36).prop(`crater`,47,34).prop(`crater`,5,38),e.prop(`wreck`,50,37),e.prop(`tent`,20,14).prop(`tent`,42,13,1),e.prop(`truck`,40,16,1).prop(`generator`,5,26).prop(`barrels`,55,17),e.prop(`antenna`,23,9).prop(`flag`,24,7),e.prop(`rock`,0,20).prop(`rock`,60,3).prop(`rock`,12,2),e.prop(`truck`,19,1).prop(`jeep`,40,1).prop(`radar`,43,2),e.enemy(`rifleman`,20,40,0,[[28,40]]),e.enemy(`rifleman`,44,41,0,[[36,41]]),e.enemy(`rifleman`,10,30,0),e.enemy(`rifleman`,31,29,0),e.enemy(`mg`,33,30,0),e.enemy(`sniper`,54,30,0),e.enemy(`grenadier`,22,28,0,[[42,28]]),e.enemy(`rifleman`,30,22,0,[[36,22]]),e.enemy(`heavy`,29,13,Zm),e.enemy(`rifleman`,36,14,Xm),e.enemy(`rifleman`,9,11,0),e.enemy(`assault`,15,12,Xm),e.enemy(`rifleman`,54,11,0),e.enemy(`assault`,49,13,Zm),e.enemy(`sniper`,28,3,0),e.enemy(`rifleman`,36,3,0),e.item({type:`weapon`,id:`smg`},12,42).item({type:`ammo`,ammo:`light`},13,42),e.item({type:`grenade`,count:2},8,43).item({type:`gear`,id:`helmetLight`},9,45),e.item({type:`weapon`,id:`shotgun`},26,41).item({type:`ammo`,ammo:`shells`},27,41),e.item({type:`gadget`,id:`smoke`,count:2},33,40).item({type:`medkit`},48,43),e.item({type:`weapon`,id:`rifle`},30,30).item({type:`ammo`,ammo:`rifle`},34,31),e.item({type:`gear`,id:`vestLight`},9,31).item({type:`armor`},55,31),e.item({type:`medkit`},12,30).item({type:`grenade`,count:2},52,30),e.item({type:`weapon`,id:`dmr`,rarity:`improved`},8,13).item({type:`attachment`,att:`scope`},16,11),e.item({type:`ammo`,ammo:`rifle`},56,13).item({type:`gadget`,id:`flash`,count:2},50,11),e.item({type:`ammo`,ammo:`rifle`,amount:60},37,18).item({type:`medkit`},21,20),e.item({type:`armor`},42,20).item({type:`ammo`,ammo:`light`},19,22),e.checkpoint(31,36).checkpoint(32,25),e.spawn(10,45),e.hedge(0,35,14,`h`,61).hedge(22,36,8,`h`,62).hedge(44,35,12,`h`,63),e.hedge(2,24,10,`h`,64).hedge(48,24,12,`h`,65),e.grove(0,0,9,7,66,.5).grove(54,4,10,4,67,.4).grove(0,17,3,9,68,.5).grove(61,10,3,8,69,.5),e.grove(19,2,6,4,70,.35).grove(40,6,5,3,71,.35),e.prop(`woodpile`,56,41).prop(`logs`,1,43),e.mission({intro:`Landung am Strand. Durchbrich die Bunkerlinie, sprenge das Munitionslager im Außenposten und erreiche den Landeplatz.`,main:[{kind:`reach`,text:`Erreiche den mittleren Bunker`,x:32,z:30.5,r:2.5},{kind:`destroy`,text:`Zerstöre das Munitionslager`,tag:`depot`},{kind:`reach`,text:`Erreiche den Landeplatz`,x:32,z:2.5,r:3}],side:[{kind:`destroy`,text:`Zerstöre beide Flak-Stellungen`,tag:`flak`},{kind:`eliminate`,text:`Schalte alle Gegner aus`}]}),e.patches(Y.Sand,Y.Grass,.7,7,72).patches(Y.Dirt,Y.Grass,.72,10,73),e.outcrop(61,41,1.8,1.4,74).outcrop(1,30,1.5,2,75),e.pond(57,2,2.5,1.6,76),e.wildEdge(77,{min:1,max:6,kind:`forest`,sides:`n`}),e.wildEdge(78,{min:0,max:3,kind:`scrub`,sides:`we`}),e.map}var $m=Math.PI,eh=-Math.PI/2,th=Math.PI/2;function nh(){let e=new tu(72,56,`Dorf`,`village`);e.ground(0,0,72,56,Y.Grass),e.path([[0,28],[7,29.6],[15,27.2],[23,28.8],[30,28],[44,28.6],[50,26.8],[57,29.4],[65,27.2],[72,28]],5,Y.Dirt,11),e.path([[36,0],[35.5,6],[36,14]],3,Y.Dirt,12),e.path([[36,37],[35,43],[37,49],[36,56]],3,Y.Dirt,13),e.path([[10,23],[8,12],[7,9]],2.2,Y.Dirt,14),e.path([[63,23],[60,14],[52,8]],2.2,Y.Dirt,15),e.groundBlob(36,28.5,9.5,8.5,Y.Concrete,16),e.groundBlob(36,10,8,7.5,Y.Concrete,17),e.patches(Y.Dirt,Y.Grass,.66,9,18),e.lhouse(5,15,10,9,`nw`,4,3,{style:J.Plaster,color:10111538,doors:[[`s`,4],[`n`,6,1]]}),e.hwall(6,20,3).clear(7,20),e.lhouse(17,13,9,11,`ne`,3,4,{style:J.Brick,color:5918792,doors:[[`s`,3],[`e`,6,1]]}),e.ruin(46,13,10,11,21,{style:J.Plaster,keep:.4}),e.lhouse(58,13,10,9,`ne`,3,3,{style:J.Wood,color:10508346,doors:[[`s`,4],[`w`,3,1]]}),e.lhouse(5,33,10,9,`sw`,3,3,{style:J.Wood,color:10508346,doors:[[`n`,4],[`e`,5,1]]}),e.lhouse(17,34,10,8,`ne`,3,2,{style:J.Plaster,color:8010282,doors:[[`n`,4],[`s`,2,1]]}),e.lhouse(45,35,10,8,`se`,3,3,{style:J.Brick,color:5918792,doors:[[`n`,4],[`w`,4,1]]}),e.compound([[60,35,10,5],[60,40,3,3],[67,40,3,3]],{style:J.Plaster,color:10111538,doors:[[64,35,2],[64,39,2],[61,42,1]]}),e.vwall(66,36,3),e.house(2,1,10,7,{style:J.Wood,roof:`metal`,color:8010282,doors:[[`s`,4,3],[`e`,2,2]]}),e.lowWall(2,9,10,`h`,[4,5]),e.lowWall(13,1,8,`v`,[3]),e.compound([[45,1,10,5],[48,6,4,3]],{style:J.Plaster,color:9062962,doors:[[49,8,2],[54,2,2,!1]]}),e.style(J.Stone),e.room(29,3,14,14).clear(34,16,4,1),e.fill(32,7,1,1,q.Wall).fill(39,7,1,1,q.Wall).fill(32,11,1,1,q.Wall).fill(39,11,1,1,q.Wall),e.crates(31,5,2,1).crates(40,14),e.roof(29,3,14,14,`gable`,4870746),e.prop(`steeple`,34,0);for(let t of[24,26])for(let n of[5,7,9,11])e.prop(`grave`,t,n);e.lowWallRing(25.5,8.5,4,5.6,[Math.PI,Math.PI/2]),e.style(J.Concrete),e.destructible(`depot`,35,7,`radio`),e.crates(34,23,4,1).crates(34,33,4,1).crates(30,27,1,3).crates(41,27,1,3),e.fill(28,21,3,1,q.Sandbag).fill(41,21,3,1,q.Sandbag),e.fill(28,35,3,1,q.Sandbag).fill(41,35,3,1,q.Sandbag),e.destructible(`barrel`,33,22).destructible(`barrel`,38,34).destructible(`barrel`,44,26),e.fill(14,25,1,2,q.Sandbag).fill(14,30,1,2,q.Sandbag),e.crates(24,26).crates(25,30).crates(50,27).crates(54,30,1,1),e.fill(57,25,1,2,q.Sandbag).fill(57,30,1,2,q.Sandbag),e.destructible(`barrel`,16,28).destructible(`barrel`,55,28),e.lowWall(2,49,12,`h`,[5,6]).lowWall(1,44,5,`v`),e.house(19,49,6,5,{style:J.Wood,roof:`metal`,color:6969928,doors:[[`n`,2]]}),e.lowWall(60,49,10,`h`,[4]).lowWall(59,45,4,`v`),e.lowWall(27,43,5,`v`),e.style(J.Concrete),e.crates(10,52).crates(30,50,2,1).crates(52,52),e.prop(`fountain`,35,27).prop(`bench`,31,36).prop(`bench`,39,19);for(let[t,n]of[[8,31],[20,25],[51,25],[64,31]])e.prop(`lamp`,t,n);return e.prop(`cart`,31,44).prop(`hay`,33,46).prop(`hay`,34,46).prop(`hay`,16,51).prop(`hay`,17,51),e.prop(`fence`,29,40).prop(`fence`,40,40),e.prop(`truck`,2,34).prop(`jeep`,64,44).prop(`well`,51,9).prop(`barrels`,12,25),e.prop(`rubble`,68,52).prop(`rubble`,6,52).prop(`flag`,32,17),e.prop(`garden`,1,15).prop(`garden`,19,44).prop(`garden`,23,44).prop(`garden`,61,51).prop(`garden`,65,51),e.prop(`woodpile`,12,13).prop(`woodpile`,15,31).prop(`woodpile`,60,12).prop(`woodpile`,56,32),e.prop(`laundry`,7,11).prop(`laundry`,18,32).prop(`laundry`,47,9),e.prop(`hay`,5,10).prop(`hay`,9,10).prop(`cart`,14,4),e.prop(`stump`,24,1).prop(`stump`,68,13).prop(`stump`,3,41),e.destructible(`flak`,12,46,`flak`).destructible(`flak`,60,7,`flak`),e.jeep(37,44,th,[[57,44],[57,54],[37,54],[37,44]]),e.enemy(`rifleman`,12,22,0),e.enemy(`assault`,20,18,0),e.enemy(`rifleman`,10,37,$m),e.enemy(`grenadier`,22,37,$m),e.enemy(`mg`,35,21,0),e.enemy(`rifleman`,29,32,th,[[29,24]]),e.enemy(`assault`,42,31,eh,[[42,23]]),e.enemy(`heavy`,37,30,eh),e.enemy(`sniper`,33,14,0),e.enemy(`rifleman`,37,5,0),e.enemy(`assault`,40,9,eh),e.enemy(`rifleman`,50,18,0),e.enemy(`grenadier`,51,37,$m),e.enemy(`sniper`,66,28,eh),e.enemy(`mg`,62,20,0),e.enemy(`heavy`,64,37,$m),e.enemy(`rifleman`,15,45,th,[[22,45]]),e.enemy(`rifleman`,56,9,eh,[[56,4]]),e.item({type:`ammo`,ammo:`light`},3,25).item({type:`medkit`},3,31),e.item({type:`weapon`,id:`rifle`},8,19).item({type:`ammo`,ammo:`rifle`},11,19),e.item({type:`gear`,id:`helmetLight`},23,20).item({type:`grenade`,count:2},19,21),e.item({type:`gadget`,id:`flash`,count:2},9,37).item({type:`armor`},21,39),e.item({type:`weapon`,id:`launcher`},24,39).item({type:`ammo`,ammo:`rockets`},25,39),e.item({type:`ammo`,ammo:`shells`},30,25).item({type:`medkit`},40,32),e.item({type:`weapon`,id:`lmg`,rarity:`improved`},48,16).item({type:`ammo`,ammo:`rifle`,amount:90},53,16),e.item({type:`gear`,id:`vestHeavy`},54,21).item({type:`gadget`,id:`drone`,count:1},48,39),e.item({type:`armor`},31,13).item({type:`medkit`},41,5).item({type:`grenade`,count:2},61,41),e.item({type:`attachment`,att:`grip`},64,19).item({type:`ammo`,ammo:`light`},3,50),e.checkpoint(16,28).checkpoint(45,28).checkpoint(36,18),e.spawn(2,28),e.pond(65,3,3.5,2.2,19),e.stream([[0,11.5],[5,12.2],[10,11],[15,11.8],[19.5,11.2]],1.8,22),e.pond(20.5,10.8,1.8,1.4,23),e.hedge(0,24,4,`h`,31).hedge(0,32,4,`h`,32),e.hedge(15,43,10,`h`,33).hedge(46,43,10,`h`,34),e.hedge(59,43,11,`h`,35).hedge(27,1,1,`v`,36),e.grove(57,0,15,7,41,.5),e.grove(0,50,7,6,42,.5).grove(25,51,10,5,43,.4),e.grove(41,47,14,5,44,.25),e.grove(58,52,14,4,45,.45),e.grove(13,2,9,7,46,.3).grove(23,15,3,4,47,.5),e.grove(0,9,3,6,48,.5).grove(69,9,3,6,49,.5),e.mission({intro:`Das Dorf ist besetzt. Kämpf dich zum Dorfplatz vor, zerstöre die Funkstation in der Kirche und verlasse das Dorf im Osten.`,main:[{kind:`reach`,text:`Erreiche den Dorfplatz`,x:36,z:28.5,r:3},{kind:`destroy`,text:`Zerstöre die Funkstation in der Kirche`,tag:`radio`},{kind:`reach`,text:`Verlasse das Dorf im Osten`,x:70,z:28.5,r:2.5}],side:[{kind:`destroy`,text:`Zerstöre beide Flugabwehrgeschütze`,tag:`flak`},{kind:`eliminate`,text:`Schalte alle Gegner aus`}]}),e.outcrop(3,46,2,1.5,20),e.wildEdge(21,{min:1,max:7,kind:`forest`,keep:[[36,1,3]]}),e.map}var rh=-Math.PI/2,ih=Math.PI/2;function ah(){let e=new tu(70,60,`Wald`,`forest`),t=e.map,n=Kl(4242);e.ground(0,0,70,60,Y.Grass);for(let e=0;e<60;e++)for(let r=0;r<70;r++){let i=n();i<.2?t.set(r,e,q.Tree):i<.34&&t.set(r,e,q.Bush)}let r=(n,r,i)=>{t.inBounds(n,r)&&t.get(n,r)!==q.Water&&(t.set(n,r,q.Floor),i!==void 0&&e.ground(n,r,1,1,i))},i=(e,t,i,a,o)=>{let s=e+i/2,c=t+a/2;for(let l=t-1;l<t+a+1;l++)for(let t=e-1;t<e+i+1;t++){let e=Math.abs(t+.5-s)/(i/2+.6),u=Math.abs(l+.5-c)/(a/2+.6);(e**4+u**4)**.25<.86+n()*.26&&r(t,l,o)}},a=(e,t,i,a)=>{let o=(e+i)/2,s=(t+a)/2,c=o+(i-o)*.75,l=s+(t-s)*.75,u=Math.ceil((Math.abs(i-e)+Math.abs(a-t))*2)+1,d=0;for(let o=0;o<=u;o++){let s=o/u,f=(1-s)*(1-s)*e+2*(1-s)*s*c+s*s*i+.5,p=(1-s)*(1-s)*t+2*(1-s)*s*l+s*s*a+.5;d=Math.max(-.5,Math.min(.6,d+(n()-.5)*.25));let m=1.5+d;for(let e=Math.floor(p-m);e<=Math.floor(p+m);e++)for(let t=Math.floor(f-m);t<=Math.floor(f+m);t++)Math.hypot(t+.5-f,e+.5-p)<=m&&r(t,e,Y.Dirt)}},o=(e,r,i,a,o)=>{for(let s=r;s<r+a;s++)for(let r=e;r<e+i;r++)n()<o&&t.set(r,s,q.Bush)};e.fill(0,12,70,3,q.Water),e.ground(0,11,70,5,Y.Dirt),i(0,11,70,1),e.clear(0,15,70,1),e.clear(59,12,3,3),e.ground(59,12,3,3,Y.Concrete),i(3,50,10,8,Y.Dirt),i(14,37,14,11),i(37,21,17,13),i(56,3,13,8,Y.Dirt),i(8,20,10,9),i(52,38,12,10),a(7,54,20,42),a(20,42,34,39),a(34,39,45,27),a(45,27,60,18),a(60,18,60,8),a(20,42,13,24),a(45,27,57,43),a(13,24,28,18),a(28,18,40,27),e.fill(9,22,3,2,q.Water).fill(14,25,2,2,q.Water).fill(10,26,2,1,q.Water),e.ground(8,20,10,9,Y.Dirt),o(14,37,14,11,.12),o(52,38,12,10,.15),e.fill(16,39,2,1,q.Crate).fill(24,45,1,2,q.Crate),e.style(J.Wood),e.room(38,22,6,5).clear(40,26,2,1),e.room(48,28,5,5).clear(48,30,1,1),e.style(J.Concrete),e.roof(38,22,6,5,`gable`,5917238).roof(48,28,5,5,`gable`,5200442),e.fill(41,31,3,1,q.Sandbag).fill(50,23,3,1,q.Sandbag),e.destructible(`depot`,46,26,`depot`),e.destructible(`barrel`,44,24).destructible(`barrel`,47,31).destructible(`barrel`,22,41),e.destructible(`flak`,39,30,`flak`).destructible(`flak`,64,6,`flak`),e.fill(57,16,2,1,q.Sandbag).fill(62,16,2,1,q.Sandbag).fill(57,10,2,1,q.Sandbag).fill(62,10,2,1,q.Sandbag),e.prop(`tent`,23,37).prop(`logs`,14,37).prop(`logs`,14,20),e.prop(`generator`,44,22).prop(`antenna`,37,27),e.prop(`railing`,58,12,1).prop(`railing`,62,12,1),e.prop(`rock`,52,44).prop(`tower`,62,38),e.prop(`jeep`,3,50).prop(`truck`,57,4,1).prop(`tent`,65,8),e.enemy(`rifleman`,18,40,0,[[25,40]]),e.enemy(`assault`,24,44,rh),e.enemy(`sniper`,27,38,0),e.enemy(`rifleman`,33,39,rh,[[33,32]]),e.enemy(`grenadier`,12,23,0),e.enemy(`rifleman`,16,21,ih,[[25,18]]),e.enemy(`mg`,45,29,0),e.enemy(`heavy`,42,25,0),e.enemy(`rifleman`,51,24,rh),e.enemy(`assault`,50,31,rh,[[53,22]]),e.enemy(`sniper`,37,22,ih),e.enemy(`rifleman`,55,42,rh,[[61,46]]),e.enemy(`grenadier`,60,40,0),e.enemy(`rifleman`,59,19,0,[[61,23]]),e.enemy(`mg`,60,10,0),e.enemy(`sniper`,66,5,rh),e.enemy(`heavy`,58,6,0),e.enemy(`assault`,63,8,rh),e.item({type:`grenade`,count:2},5,52).item({type:`medkit`},10,55),e.item({type:`gear`,id:`bootsQuiet`},15,46).item({type:`gadget`,id:`smoke`,count:2},26,47),e.item({type:`weapon`,id:`dmr`,rarity:`elite`},19,47).item({type:`ammo`,ammo:`rifle`},20,47),e.item({type:`attachment`,att:`silencer`},11,27).item({type:`armor`},17,26),e.item({type:`weapon`,id:`flamer`},39,24).item({type:`ammo`,ammo:`fuel`},40,24),e.item({type:`medkit`},50,30).item({type:`ammo`,ammo:`shells`},37,32),e.item({type:`gadget`,id:`mine`,count:2},62,44).item({type:`armor`},55,46),e.item({type:`ammo`,ammo:`light`},31,38).item({type:`grenade`,count:2},58,20),e.item({type:`medkit`},61,17),e.checkpoint(21,43).checkpoint(46,34).checkpoint(60,21),e.spawn(6,55);for(let e of t.entities){let n=Math.floor(e.x),r=Math.floor(e.z);for(let e=-1;e<=1;e++)for(let i=-1;i<=1;i++){let a=t.get(n+i,r+e);(a===q.Tree||i===0&&e===0&&a===q.Bush)&&t.set(n+i,r+e,q.Floor)}}return e.mission({intro:`Feindliche Späher im Wald. Büsche verbergen dich, wenn du dich duckst. Zerstöre das Versorgungslager und überquere den Fluss.`,main:[{kind:`reach`,text:`Erreiche das Späherlager`,x:21,z:42,r:3},{kind:`destroy`,text:`Zerstöre das Versorgungslager`,tag:`depot`},{kind:`reach`,text:`Überquere die Brücke im Norden`,x:60.5,z:7,r:3}],side:[{kind:`destroy`,text:`Zerstöre beide Flugabwehrgeschütze`,tag:`flak`},{kind:`eliminate`,text:`Schalte alle Gegner aus`}]}),e.patches(Y.Dirt,Y.Grass,.7,6,4301),e.outcrop(66,30,2,3,4302).outcrop(3,34,2,2,4303).outcrop(30,57,2.5,1.5,4304),t}var oh=Math.PI,sh=-Math.PI/2,ch=Math.PI/2;function lh(){let e=new tu(76,56,`Industriegebiet`,`industry`);e.ground(0,0,76,56,Y.Concrete),e.ground(0,46,22,10,Y.Dirt),e.ground(60,0,16,14,Y.Dirt),e.ground(0,0,8,20,Y.Grass),e.style(J.Brick);for(let[t,n,r]of[[0,9,45],[9,21,44],[21,30,45],[34,47,44],[47,58,45],[58,66,44],[66,76,45]])e.hwall(t,r,n-t);for(let t of[9,21,47,58,66])e.fill(t,44,1,2,q.Wall);e.fill(30,43,1,1,q.Sandbag).fill(33,43,1,1,q.Sandbag),e.compound([[4,24,20,14],[8,21,8,3]],{style:J.Metal,roof:`metal`,color:5925490,doors:[[12,37,3],[23,29,3,!1],[4,30,2,!1],[11,21,2]],windows:!1}),e.style(J.Metal),e.vwall(13,25,6).hwall(14,31,5),e.crates(6,26,2,2).crates(17,34,3,1).crates(20,26,2,1),e.destructible(`barrel`,9,33).destructible(`barrel`,10,33).destructible(`barrel`,19,28),e.compound([[29,20,18,16],[47,24,4,5]],{style:J.Metal,roof:`metal`,color:8022616,doors:[[36,35,4],[29,26,3,!1],[36,20,4],[50,25,2,!1]],windows:!1}),e.style(J.Metal),e.fill(33,24,1,8,q.Sandbag).fill(42,24,1,8,q.Sandbag),e.destructible(`depot`,37,27,`fuel`),e.destructible(`barrel`,35,23).destructible(`barrel`,40,31).destructible(`barrel`,44,22),e.style(J.Brick),e.room(54,26,16,12).clear(54,30,1,3).clear(60,37,3,1),e.roof(54,26,16,12,`metal`,6967880),e.crates(57,28,2,1).crates(65,34,2,2),e.destructible(`depot`,62,31,`fuel`),e.destructible(`barrel`,58,33).destructible(`barrel`,59,33).destructible(`barrel`,66,28),e.style(J.Concrete),e.roof(10,6,14,12,`flat`,9079424),e.room(10,6,14,12).clear(16,17,3,1).clear(23,10,1,3),e.fill(14,9,2,2,q.Wall).fill(18,12,2,2,q.Wall),e.destructible(`depot`,13,13,`fuel`),e.destructible(`barrel`,20,8).destructible(`barrel`,21,15);for(let t of[28,32,36,40,44])e.crates(t,39,2,2);for(let t of[6,10,14])e.crates(30,t,3,1).crates(40,t,3,1);return e.fill(48,40,6,1,q.Sandbag).fill(50,16,1,6,q.Sandbag),e.destructible(`barrel`,34,41).destructible(`barrel`,42,41).destructible(`barrel`,36,12),e.prop(`rails`,60,4,1).prop(`rails`,68,4,1).prop(`rails`,60,9,1).prop(`rails`,68,9,1),e.prop(`wagon`,60,4,1).prop(`wagon`,67,4,1,3824250).prop(`wagon`,62,9,1,5925434).prop(`wagon`,69,9,1),e.crates(56,3,2,2).crates(58,11,1,2),e.destructible(`flak`,52,8,`flak`).destructible(`flak`,26,48,`flak`),e.house(1,2,6,5,{style:J.Brick,roof:`flat`,color:8022618,doors:[[`s`,2]]}),e.lhouse(12,0,10,5,`sw`,3,2,{style:J.Brick,roof:`flat`,color:6974050,doors:[[`s`,5],[`e`,1,1]]}),e.house(44,0,10,5,{style:J.Metal,roof:`metal`,color:5204594,doors:[[`s`,3,3]]}),e.lhouse(40,48,12,7,`ne`,4,3,{style:J.Brick,roof:`metal`,color:6969930,doors:[[`n`,2,3],[`w`,4,2]]}),e.ruin(1,46,8,6,81,{style:J.Brick,keep:.45}),e.ruin(14,47,6,4,82,{style:J.Plaster,keep:.4,rubble:!1}),e.style(J.Concrete),e.path([[0,51],[9,52],[20,50],[31,47],[32,44]],3,Y.Dirt,83),e.prop(`container`,60,46,1).prop(`container`,60,50,1,3103370).prop(`container`,66,48,0,3828282),e.prop(`silo`,58,18).prop(`silo`,62,18).prop(`silo`,66,18),e.prop(`chimney`,71,40).prop(`chimney`,4,12),e.prop(`pipes`,26,18).prop(`pipes`,44,17,1),e.prop(`lamp`,27,47).prop(`lamp`,36,47).prop(`generator`,56,22).prop(`barrels`,64,23),e.prop(`truck`,10,48,1).prop(`wreck`,14,52),e.jeep(36,42,ch,[[68,42],[36,42]]),e.enemy(`rifleman`,26,41,0,[[45,41]]),e.enemy(`mg`,32,46,0),e.enemy(`grenadier`,38,46,0),e.enemy(`rifleman`,10,28,0),e.enemy(`assault`,18,33,sh,[[18,27]]),e.enemy(`heavy`,8,34,oh),e.enemy(`sniper`,36,33,0),e.enemy(`mg`,38,22,0),e.enemy(`assault`,44,29,sh),e.enemy(`rifleman`,31,30,ch),e.enemy(`grenadier`,58,30,sh),e.enemy(`heavy`,64,35,oh),e.enemy(`rifleman`,67,30,sh,[[67,35]]),e.enemy(`rifleman`,16,15,0),e.enemy(`assault`,21,9,sh),e.enemy(`sniper`,42,8,0),e.enemy(`mg`,58,7,sh),e.enemy(`heavy`,66,7,0),e.enemy(`assault`,70,12,sh,[[60,13]]),e.enemy(`rifleman`,49,30,sh,[[49,23]]),e.item({type:`ammo`,ammo:`rifle`},4,50).item({type:`grenade`,count:2},6,52).item({type:`medkit`},12,50),e.item({type:`weapon`,id:`launcher`,rarity:`improved`},16,49).item({type:`ammo`,ammo:`rockets`},17,49),e.item({type:`gadget`,id:`drone`,count:2},20,47).item({type:`armor`},9,27),e.item({type:`weapon`,id:`shotgun`,rarity:`elite`},21,33).item({type:`ammo`,ammo:`shells`},15,26),e.item({type:`medkit`},31,33).item({type:`ammo`,ammo:`rifle`,amount:90},45,33),e.item({type:`gear`,id:`helmetCombat`},56,35).item({type:`gadget`,id:`smoke`,count:2},50,36),e.item({type:`armor`},68,33).item({type:`medkit`},12,8).item({type:`grenade`,count:2},26,12),e.item({type:`ammo`,ammo:`light`},46,10).item({type:`medkit`},55,14),e.checkpoint(31,48).checkpoint(26,32).checkpoint(50,26),e.spawn(3,53),e.grove(0,12,6,8,84,.5).grove(9,52,8,4,85,.3).grove(22,51,10,5,86,.35),e.hedge(54,45,5,`v`,87).hedge(69,46,7,`v`,88).hedge(0,21,4,`h`,89),e.prop(`woodpile`,4,8).prop(`stump`,24,54),e.mission({intro:`Das Industriegebiet versorgt die Front mit Treibstoff. Brich durchs Werkstor, sprenge die drei Tanks und erreiche den Güterbahnhof. Vorsicht mit den Fässern!`,main:[{kind:`reach`,text:`Brich durch das Werkstor`,x:31.5,z:42,r:2.5},{kind:`destroy`,text:`Sprenge die Treibstofftanks`,tag:`fuel`},{kind:`reach`,text:`Erreiche den Güterbahnhof`,x:68,z:7,r:2.5}],side:[{kind:`destroy`,text:`Zerstöre beide Flugabwehrgeschütze`,tag:`flak`},{kind:`eliminate`,text:`Schalte alle Gegner aus`}]}),e.patches(Y.Dirt,Y.Concrete,.72,8,90).patches(Y.Grass,Y.Dirt,.6,6,91),e.pond(70,52,2.5,1.8,92),e.wildEdge(93,{min:0,max:3,kind:`scrub`,sides:`ws`}),e.map}var uh=-Math.PI/2,dh=Math.PI/2;function fh(){let e=new tu(72,64,`Bergfestung`,`fortress`),t=e.map,n=Kl(5150);t.borderStyle=J.Rock,e.ground(0,0,72,64,Y.Grass),e.ground(2,53,67,3,Y.Dirt),e.ground(62,44,6,12,Y.Dirt),e.ground(2,44,66,3,Y.Dirt),e.ground(1,36,5,11,Y.Dirt),e.ground(1,36,40,3,Y.Dirt),e.ground(32,33,8,3,Y.Concrete),e.ground(9,2,54,30,Y.Concrete);let r=(e,r)=>{for(let i=0;i<72;i++)n()<r&&t.set(i,e,q.Tree)},i=(e,r,i,a,o)=>{for(let s=r;s<r+a;s++)for(let r=e;r<e+i;r++)t.get(r,s)===q.Floor&&n()<o&&t.set(r,s,q.Bush)};for(let e of[50,62,63])r(e,.4);r(61,.15);for(let e of[42,48])r(e,.35);for(let e of[33,40])r(e,.3);i(0,57,72,5,.06),i(0,47,72,1,.12),i(0,39,72,1,.12),e.style(J.Rock);let a=(t,n,r,i,a=1.6)=>{let o=Kl(i),s=0,c=0;for(let l=t;l<t+n;l++){let t=c;o()<.3&&(s=Math.max(-1,Math.min(1,s+(o()<.5?-1:1)))),c=Math.round(a*Math.sin(l*.12+i)+s*.8);for(let n=Math.min(t,c);n<=Math.max(t,c);n++)e.fill(l,r+n,1,1,q.Wall);o()<.12&&Math.abs(c)<2&&e.fill(l,r+c+(o()<.5?-1:1),1,1,q.Wall)}};a(0,62,49,91),e.hwall(68,49,4),a(6,66,41,92),e.clear(62,47,6,5).clear(0,39,6,5),e.fill(0,0,8,33,q.Tree).fill(64,0,8,33,q.Tree).fill(8,0,56,1,q.Tree),e.style(J.Stone);{let n=(e,t)=>Math.min(e-8,63-e)+Math.min(t-1,32-t),r=(e,t)=>e>=8&&e<64&&t>=1&&t<33&&n(e,t)>=4;for(let n=1;n<33;n++)for(let i=8;i<64;i++){if(!r(i,n)){i>=8&&i<64&&n>=1&&n<33&&t.set(i,n,q.Tree);continue}let a=!1;for(let e=-1;e<=1&&!a;e++)for(let t=-1;t<=1;t++)r(i+t,n+e)||(a=!0);e.fill(i,n,1,1,a?q.Wall:q.Floor)}}e.clear(34,32,4,1),e.clear(32,33,8,1),e.room(28,2,16,8).clear(34,9,4,1),e.crates(30,4,2,1).crates(40,4,2,1),e.roof(28,2,16,8,`flat`,6973020),e.style(J.Bunker),e.room(10,3,10,8).clear(14,10,2,1),e.roof(10,3,10,8,`flat`,8026728).roof(52,3,10,8,`flat`,8026728),e.destructible(`depot`,14,6,`ammo`),e.crates(11,4,1,2).crates(18,8,1,2),e.room(52,3,10,8).clear(56,10,2,1),e.crates(53,4,2,1).crates(60,8,1,2),e.style(J.Concrete),e.crates(23,19,3,2).crates(31,21,2,2).crates(44,19,2,3),e.fill(38,18,1,4,q.Sandbag).fill(27,23,4,1,q.Sandbag).fill(48,23,3,1,q.Sandbag),e.fill(12,31,6,1,q.Sandbag).fill(54,31,6,1,q.Sandbag),e.fill(10,18,2,1,q.Sandbag).fill(60,18,2,1,q.Sandbag),e.destructible(`barrel`,22,11).destructible(`barrel`,49,11).destructible(`barrel`,12,24).destructible(`barrel`,59,22),e.tank(36,27,dh,[[56,27],[56,14],[16,14],[16,27]],`boss`),e.fill(54,52,1,3,q.Sandbag),e.fill(36,44,1,3,q.Sandbag),e.fill(38,36,1,3,q.Sandbag),e.crates(26,52,2,1).crates(46,55,1,2).crates(18,44,1,2).crates(50,46,2,1).crates(24,38,2,1),e.destructible(`flak`,40,47,`flak`).destructible(`flak`,14,45,`flak`),e.destructible(`barrel`,33,45).destructible(`barrel`,45,37),e.prop(`truck`,10,12).prop(`radar`,22,4).prop(`antenna`,60,12),e.prop(`barrels`,60,24).prop(`generator`,21,30),e.prop(`flag`,33,33).prop(`flag`,38,33),e.prop(`tower`,60,58).prop(`wreck`,30,58),e.prop(`crater`,48,57).prop(`crater`,12,44),e.prop(`rock`,12,58).prop(`rock`,44,57).prop(`rock`,14,38),e.prop(`hedgehog`,26,34).prop(`hedgehog`,43,34).prop(`hedgehog`,48,34),e.prop(`wire`,56,34).prop(`wire`,8,34),e.jeep(41,36,dh,[[69,36],[41,36]]),e.enemy(`rifleman`,20,55,uh,[[30,55]]),e.enemy(`rifleman`,36,57,uh),e.enemy(`assault`,44,52,uh),e.enemy(`mg`,56,53,uh),e.enemy(`sniper`,66,51,uh),e.enemy(`heavy`,44,44,dh),e.enemy(`mg`,34,45,dh),e.enemy(`grenadier`,28,47,dh),e.enemy(`assault`,20,43,dh,[[12,43]]),e.enemy(`sniper`,6,45,dh),e.enemy(`assault`,22,35,uh),e.enemy(`heavy`,28,38,uh),e.enemy(`mg`,40,37,uh),e.enemy(`rifleman`,50,36,uh,[[60,36]]),e.enemy(`grenadier`,58,38,uh),e.enemy(`rifleman`,13,29,dh),e.enemy(`assault`,36,22,0),e.enemy(`mg`,36,11,0),e.enemy(`sniper`,57,6,0),e.enemy(`heavy`,36,6,0),e.enemy(`rifleman`,16,8,0),e.item({type:`ammo`,ammo:`rifle`},8,57).item({type:`medkit`},24,58).item({type:`grenade`,count:2},40,56),e.item({type:`armor`},50,55).item({type:`medkit`},60,44).item({type:`ammo`,ammo:`light`},46,46),e.item({type:`gear`,id:`helmetCombat`},22,45).item({type:`gadget`,id:`smoke`,count:2},30,44),e.item({type:`weapon`,id:`launcher`,rarity:`improved`},4,38).item({type:`ammo`,ammo:`rockets`},5,37),e.item({type:`ammo`,ammo:`rockets`},8,36).item({type:`medkit`},20,37).item({type:`grenade`,count:2},32,35),e.item({type:`armor`},44,38).item({type:`ammo`,ammo:`rifle`},52,38),e.item({type:`ammo`,ammo:`rockets`},13,28).item({type:`ammo`,ammo:`rockets`},58,28),e.item({type:`grenade`,count:2},12,27).item({type:`gadget`,id:`mine`,count:3},59,27),e.item({type:`medkit`},24,30).item({type:`medkit`},48,30),e.item({type:`ammo`,ammo:`rockets`},59,8).item({type:`medkit`},32,6),e.checkpoint(64,46).checkpoint(2,37).checkpoint(30,34),e.spawn(3,59);for(let e of t.entities){let n=e.kind===`tank`?2:+(e.kind===`destructible`);for(let r=-n;r<=n;r++)for(let i=-n;i<=n;i++){let n=Math.floor(e.x)+i,a=Math.floor(e.z)+r,o=t.get(n,a);(o===q.Tree||o===q.Bush)&&t.set(n,a,q.Floor)}}for(let e=-1;e<=1;e++)for(let n=-1;n<=1;n++)t.get(3+n,59+e)===q.Tree&&t.set(3+n,59+e,q.Floor);return e.mission({intro:`Die Bergfestung ist das letzte Bollwerk des Feindes. Kämpf dich die Serpentinen hinauf, schalte den Panzer im Festungshof aus und nimm den Kommandostand ein. Am Fuß der Festung liegt ein Raketenwerfer bereit.`,main:[{kind:`reach`,text:`Erreiche das Festungstor`,x:36,z:34.5,r:2.5},{kind:`destroy`,text:`Zerstöre den Panzer`,tag:`boss`},{kind:`reach`,text:`Nimm den Kommandostand ein`,x:36,z:5.5,r:2}],side:[{kind:`destroy`,text:`Sprenge das Munitionslager`,tag:`ammo`},{kind:`destroy`,text:`Zerstöre beide Flugabwehrgeschütze`,tag:`flak`},{kind:`eliminate`,text:`Schalte alle Gegner aus`}]}),e.patches(Y.Dirt,Y.Grass,.68,7,94).patches(Y.Dirt,Y.Concrete,.66,8,97),e.wildEdge(95,{min:0,max:3,kind:`rock`,sides:`we`,keep:[[3,40,4],[65,48,4]]}),e.wildEdge(96,{min:0,max:3,kind:`forest`,sides:`s`}),e.map}var ph=Math.PI,mh=-Math.PI/2,hh=Math.PI/2;function gh(){let e=new tu(76,60,`Ruinenstadt`,`town`),t=e.map;e.ground(0,0,76,60,Y.Dirt),e.patches(Y.Grass,Y.Dirt,.6,7,501),e.groundBlob(7,53,9,7,Y.Grass,502),e.groundBlob(68,54,9,6,Y.Grass,503);let n=[[[[4,53],[11,48],[17,42],[23,37],[30,33],[38,30],[46,26],[52,20],[56,13],[58,6],[58.5,0]],4],[[[0,23],[8,21.5],[16,24],[24,26.5],[31,28.5]],3.2],[[[44,33],[51,37],[58,41],[66,43],[76,44]],4],[[[18,0],[19.5,7],[23,14],[28,20],[33,25]],3],[[[38,36],[39.5,43],[36,50],[33,56],[33.5,60]],3],[[[53,18],[61,21],[68,20],[76,21]],3],[[[16,24],[13,31],[12,38],[17,42]],2.4]];for(let[t,[r,i]]of n.entries())e.path(r,i,Y.Concrete,510+t);e.groundBlob(38,29.5,8.5,6.5,Y.Concrete,520);let r=new Uint8Array(4560),i=(e,t,n,i,a=1)=>{for(let o=t-a;o<t+i+a;o++)for(let t=e-a;t<e+n+a;t++)t>=0&&o>=0&&t<76&&o<60&&(r[o*76+t]=1)},a=(n,i,a,o)=>{if(n<1||i<1||n+a>75||i+o>59)return!1;for(let s=i-1;s<=i+o;s++)for(let c=n-1;c<=n+a;c++){let l=c>=n&&c<n+a&&s>=i&&s<i+o;if(e.isPath(c,s)||l&&(r[s*76+c]||t.get(c,s)!==q.Floor))return!1}return!0};i(29,23,18,13,0),i(0,46,15,14,0),i(60,49,16,11,0),e.compound([[34,15,10,7],[31,17,3,5],[44,17,3,5]],{style:J.Stone,color:4870746,doors:[[36,21,2],[40,21,2],[31,19,2,!1],[46,19,2,!1]]}),e.vwall(39,16,5).clear(39,18,1,2),e.destructible(`depot`,36,18,`ammo`),i(30,14,18,9),e.compound([[59,26,10,8],[62,34,5,3]],{style:J.Metal,roof:`metal`,color:5204594,doors:[[63,36,2],[59,28,2,!1],[63,26,3]]}),e.destructible(`depot`,64,30,`ammo`),e.crates(60,27,2,1).crates(66,32,2,1),i(58,25,12,13),e.ruin(20,46,12,9,530,{style:J.Stone,keep:.55}),e.fill(24,49,1,1,q.Wall).fill(28,49,1,1,q.Wall),i(19,45,14,11);let o=[J.Plaster,J.Plaster,J.Brick,J.Brick,J.Stone,J.Wood],s=[10111538,8010282,9062962,5918792,6969930,4870746],c=[];for(let[t,[r,l]]of n.entries()){let n=Kl(600+t);for(let t=0;t<r.length-1;t++){let[u,d]=r[t],[f,p]=r[t+1],m=Math.hypot(f-u,p-d),h=(f-u)/m,g=(p-d)/m;for(let t=0;t<m;t+=1+n()*1.5){let r=u+h*t,f=d+g*t;for(let t of[-1,1]){if(n()<.1)continue;let u=-g*t,d=h*t,p=5+Math.floor(n()*5),m=5+Math.floor(n()*4),_=l/2+.8+n()*.8,v=0,y=0,b=0,x=0,S=!1;for(let[e,t]of[[p,m],[p-2,m],[p,m-2],[5,5]]){let n=Math.abs(u)>Math.abs(d)?e/2:t/2,i=r+u*(_+n),o=f+d*(_+n);if(v=Math.round(i-e/2),y=Math.round(o-t/2),b=e,x=t,e>=5&&t>=5&&a(v,y,b,x)){S=!0;break}}if(!S)continue;let C=Math.abs(u)>Math.abs(d)?u>0?`w`:`e`:d>0?`n`:`s`,w=C===`n`?`s`:C===`s`?`n`:C===`w`?`e`:`w`,T=C===`n`||C===`s`?b:x,E=[[C,1+Math.floor(n()*(T-3)),2]];n()<.6&&E.push([w,1+Math.floor(n()*(T-3)),1]);let D=o[Math.floor(n()*o.length)],ee=s[Math.floor(n()*s.length)],O=n();if(O<.3&&b>=6&&x>=6)e.ruin(v,y,b,x,700+c.length,{style:D,keep:.4+n()*.2}),c.push({x:v,z:y,w:b,h:x,ruin:!0});else if(O<.55&&b>=7&&x>=6){let t=C===`n`?`s`:C===`s`||n()<.5?`n`:`s`,r=C===`w`?`e`:C===`e`?`w`:n()<.5?`e`:`w`;e.lhouse(v,y,b,x,t+r,2+Math.floor(n()*2),2+Math.floor(n()*2),{style:D,color:ee,doors:[E[0]]}),c.push({x:v,z:y,w:b,h:x,ruin:!1})}else e.house(v,y,b,x,{style:D,color:ee,roof:D===J.Wood?`metal`:`gable`,doors:E}),c.push({x:v,z:y,w:b,h:x,ruin:!1});i(v,y,b,x,0)}}}}{let n=Kl(690);for(let l=2;l<53;l+=2)for(let u=2;u<69;u+=2){let d=5+Math.floor(n()*4),f=5+Math.floor(n()*3);if(!a(u,l,d,f))continue;let p=0;for(let e=l-2;e<l+f+2;e++)for(let n=u-2;n<u+d+2;n++)t.inBounds(n,e)&&!r[e*76+n]&&p++;if(p<(d+4)*(f+4)*.7||n()<.15)continue;let m=o[Math.floor(n()*o.length)];if(n()<.55)e.ruin(u,l,d,f,800+c.length,{style:m,keep:.35+n()*.2}),c.push({x:u,z:l,w:d,h:f,ruin:!0});else{let t=[`n`,`s`,`w`,`e`];e.house(u,l,d,f,{style:m,color:s[Math.floor(n()*s.length)],doors:[[t[Math.floor(n()*2)],1+Math.floor(n()*(d-3)),2],[t[2+Math.floor(n()*2)],1+Math.floor(n()*(f-3)),1]]}),c.push({x:u,z:l,w:d,h:f,ruin:!1})}i(u,l,d,f,1)}}e.style(J.Concrete);let l=new Uint8Array(4560);{let e=[4260];for(l[e[0]]=1;e.length;){let n=e.pop(),r=n%76,i=(n-r)/76;for(let[n,a]of[[1,0],[-1,0],[0,1],[0,-1]]){let o=r+n,s=i+a;!t.inBounds(o,s)||l[s*76+o]||t.solid(o,s)||(l[s*76+o]=1,e.push(s*76+o))}}}let u=e=>{let n=Math.floor(e.x+e.w/2),r=Math.floor(e.z+e.h/2);for(let i=0;i<4;i++)for(let a=r-i;a<=r+i;a++)for(let r=n-i;r<=n+i;r++)if(r>e.x&&a>e.z&&r<e.x+e.w-1&&a<e.z+e.h-1&&t.get(r,a)===q.Floor&&l[a*76+r]){if(t.entities.some(e=>Math.floor(e.x)===r&&Math.floor(e.z)===a))continue;return[r,a]}return null};e.fill(33,33,3,1,q.Sandbag).fill(41,25,3,1,q.Sandbag).fill(31,27,1,2,q.Sandbag).fill(45,30,1,2,q.Sandbag),e.crates(35,26,1,1).crates(42,33,2,1),e.prop(`fountain`,37,28),e.destructible(`barrel`,34,31).destructible(`barrel`,43,27).destructible(`barrel`,20,25).destructible(`barrel`,55,15),e.fill(56,7,1,2,q.Sandbag).fill(61,7,1,2,q.Sandbag);let d=[4,56];e.enemy(`mg`,38,24,0),e.enemy(`heavy`,40,33,0),e.enemy(`grenadier`,44,28,mh),e.enemy(`rifleman`,32,30,hh,[[36,34]]),e.enemy(`sniper`,32,19,0),e.enemy(`assault`,42,19,mh),e.enemy(`rifleman`,61,31,mh),e.enemy(`grenadier`,66,28,0),e.enemy(`mg`,58,9,0),e.enemy(`rifleman`,21,51,hh),e.enemy(`sniper`,25,53,ph);let f=[`rifleman`,`assault`,`sniper`,`rifleman`,`heavy`,`assault`,`rifleman`,`grenadier`,`rifleman`,`assault`,`rifleman`,`mg`],p=c.filter(e=>Math.hypot(e.x+e.w/2-d[0],e.z+e.h/2-d[1])>16).sort((e,t)=>(e.x*7+e.z*13)%17-(t.x*7+t.z*13)%17),m=0;for(let t of p){if(m>=f.length)break;let n=f[m];if(n===`sniper`&&t.ruin)continue;let r=u(t);if(!r)continue;let i=Math.atan2(d[0]-r[0],d[1]-r[1]);e.enemy(n,r[0],r[1],i),m++}e.jeep(48,35,hh,[[56,40],[65,42],[72,43],[56,40],[48,35]]),e.item({type:`medkit`},2,52).item({type:`ammo`,ammo:`light`},5,50).item({type:`grenade`,count:2},8,57),e.item({type:`weapon`,id:`launcher`,rarity:`improved`},35,17).item({type:`ammo`,ammo:`rockets`},37,20),e.item({type:`weapon`,id:`lmg`,rarity:`improved`},45,19).item({type:`ammo`,ammo:`rifle`,amount:90},41,17),e.item({type:`ammo`,ammo:`rockets`},67,29).item({type:`medkit`},63,35);let h=[{type:`armor`},{type:`gear`,id:`vestHeavy`},{type:`medkit`},{type:`gear`,id:`helmetCombat`},{type:`gadget`,id:`smoke`,count:2},{type:`weapon`,id:`dmr`,rarity:`elite`},{type:`attachment`,att:`scope`},{type:`grenade`,count:2},{type:`medkit`},{type:`gadget`,id:`drone`,count:2},{type:`armor`},{type:`ammo`,ammo:`rockets`}],g=[...c].sort((e,t)=>Math.hypot(e.x-d[0],e.z-d[1])-Math.hypot(t.x-d[0],t.z-d[1])),_=0;for(let t=0;t<g.length&&_<h.length;t+=2){let n=u(g[t]);n&&e.item(h[_++],n[0],n[1])}e.destructible(`flak`,70,54,`flak`).destructible(`flak`,6,22,`flak`),e.checkpoint(18,41).checkpoint(39,35).checkpoint(53,17),e.prop(`rubble`,26,30).prop(`crater`,48,30).prop(`crater`,14,33).prop(`wreck`,9,44),e.prop(`lamp`,30,25).prop(`lamp`,46,34).prop(`flag`,38,22).prop(`bench`,2,47).prop(`bench`,66,57);for(let[t,n]of[[23,52],[25,52],[27,52]])e.prop(`grave`,t,n);return e.prop(`garden`,72,56).prop(`woodpile`,12,56),e.spawn(d[0],d[1]),e.mission({intro:`Die Altstadt ist ein Trümmerfeld aus engen, verwinkelten Gassen. Kämpf dich zum Marktplatz durch, sprenge die beiden Munitionslager (Rathaus, Lagerhaus im Osten) und erreiche das Stadttor im Norden. Vorsicht vor Scharfschützen hinter den Fenstern!`,main:[{kind:`reach`,text:`Erreiche den Marktplatz`,x:38.5,z:30.5,r:3},{kind:`destroy`,text:`Sprenge die Munitionslager (Rathaus, Lagerhaus Ost)`,tag:`ammo`},{kind:`reach`,text:`Erreiche das Stadttor im Norden`,x:58.5,z:1.5,r:2.5}],side:[{kind:`destroy`,text:`Zerstöre beide Flak-Stellungen`,tag:`flak`},{kind:`eliminate`,text:`Schalte alle Gegner aus`}]}),e.grove(0,46,14,14,540,.3).grove(60,49,16,11,541,.35),e.wildEdge(542,{min:0,max:2,kind:`scrub`}),t}var _h={test:{name:`Testgelände`,build:Ym},beach:{name:`Küstenlandung`,build:Qm},village:{name:`Dorf`,build:nh},forest:{name:`Wald`,build:ah},industry:{name:`Industriegebiet`,build:lh},town:{name:`Ruinenstadt`,build:gh},fortress:{name:`Bergfestung`,build:fh}},vh=[`beach`,`village`,`forest`,`industry`,`town`,`fortress`];function yh(e){return(_h[e]??_h.test).build()}var bh={barrel:{name:`Explosivfass`,hp:30,radius:.36,blast:3.2,damage:90},depot:{name:`Munitionslager`,hp:240,radius:.95,blast:4.6,damage:120},flak:{name:`Flak-Stellung`,hp:280,radius:.95,blast:3.8,damage:110}},xh={barrel:new Qi(.3,.3,.9,12),band:new Qi(.31,.31,.08,12),crate:new U(.85,.6,.6),tarp:new U(1.9,.12,1.5),bag:new U(.5,.45,.32),gun:new Qi(.07,.09,1.6,8),base:new Qi(.3,.38,.5,10),rubble:new U(.3,.15,.25)},Sh=new V(1,.85,.7),Ch=class{type;x;z;tag;index;def;group=new An;mats=[];hp;flash=0;constructor(e,t,n,r,i){this.type=e,this.x=t,this.z=n,this.tag=r,this.index=i,this.def=bh[e],this.hp=this.def.hp;let a=e=>{let t=Z(new W({color:e}));return this.mats.push(t),t},o=(e,t,n,r,i)=>{let a=new H(e,t);return a.position.set(n,r,i),a.castShadow=!0,a.receiveShadow=!0,this.group.add(a),a};if(e===`barrel`)o(xh.barrel,a(11744799),0,.45,0),o(xh.band,a(14729280),0,.62,0),o(xh.band,a(14729280),0,.28,0);else if(e===`depot`){let e=a(6122300);for(let[t,n]of[[-.45,-.32],[.45,-.32],[-.45,.32],[.45,.32]])o(xh.crate,e,t,.3,n);o(xh.crate,a(5003314),0,.9,0),o(xh.tarp,a(4082218),0,1.25,0)}else{let e=a(11049071);for(let t=0;t<8;t++){let n=t/8*Math.PI*2,r=o(xh.bag,e,Math.cos(n)*.82,.22,Math.sin(n)*.82);r.rotation.y=-n}o(xh.base,a(3948872),0,.25,0);let t=o(xh.gun,a(2764081),0,.85,.35);t.rotation.x=.9;let n=o(xh.gun,a(2764081),.18,.85,.35);n.rotation.x=.9}this.group.position.set(t,0,n)}get alive(){return this.hp>0}damage(e){return this.alive?(this.hp-=e,this.flash=1,this.hp<=0&&(this.hp=0,this.wreck(),!0)):!1}wreck(){this.hp=0,this.group.clear();let e=Z(new W({color:2762274})),t=this.type===`barrel`?3:8;for(let n=0;n<t;n++){let t=new H(xh.rubble,e),n=Math.random()*Math.PI*2,r=Math.random()*this.def.radius;t.position.set(Math.cos(n)*r,.07,Math.sin(n)*r),t.rotation.set(Math.random(),Math.random()*3,Math.random()),this.group.add(t)}}render(e){if(!(this.flash<=0)){this.flash=Math.max(0,this.flash-e*8);for(let e of this.mats)e.emissive.copy(Sh).multiplyScalar(this.flash*.6)}}},wh={boss:!0,cannon:!0,mgY:1.7,name:`Leichter Panzer`,hp:1e3,radius:1.45,speed:1.5,hullTurn:.9,turretTurn:.7,sight:26,aimTime:1.1,cannonReload:4.2,cannonDamage:75,cannonRadius:3.2,shellSpeed:17,cannonRange:28,mgRange:15,mgBurst:7,mgRate:9,mgPause:1.4,mgDamage:6,bulletMul:.08,flameMul:.2,blastMul:1,wreckBlast:5,wreckDamage:120},Th={name:`Jeep`,boss:!1,cannon:!1,mgY:1.55,hp:260,radius:1.15,speed:4.2,hullTurn:1.9,turretTurn:2.6,sight:22,aimTime:0,cannonReload:0,cannonDamage:0,cannonRadius:0,shellSpeed:0,cannonRange:0,mgRange:17,mgBurst:6,mgRate:9,mgPause:1.3,mgDamage:5,bulletMul:.3,flameMul:.6,blastMul:1.4,wreckBlast:3.5,wreckDamage:70},Eh={tank:wh,jeep:Th},Dh={hull:new U(2.1,.7,3.1),hullTop:new U(1.7,.25,2.3),track:new U(.5,.6,3.3),wheel:new Qi(.25,.25,.52,10),turret:new Qi(.75,.9,.55,12),hatch:new Qi(.26,.26,.12,10),barrel:new Qi(.09,.11,2.1,8),brake:new Qi(.15,.15,.28,8),mg:new Qi(.035,.035,.6,6),rubble:new U(.35,.2,.3)},Oh={body:new U(1.5,.45,2.9),hood:new U(1.42,.18,1),grille:new U(1.2,.35,.08),fender:new U(.34,.1,.75),wheel:new Qi(.36,.36,.28,12),hub:new Qi(.14,.14,.3,8),screen:new U(1.36,.42,.05),seat:new U(.5,.18,.5),seatBack:new U(.5,.42,.12),spare:new Qi(.33,.33,.22,12),can:new U(.2,.36,.3),post:new Qi(.05,.06,.55,6),mgBody:new U(.16,.18,.55),mgBarrel:new Qi(.035,.035,.75,6),shield:new U(.6,.38,.04),ammo:new U(.16,.14,.24),light:new Qi(.09,.09,.06,8),head:new U(.26,.24,.26),helmet:new Qi(.18,.2,.12,8),torso:new U(.42,.42,.26)},kh=new V(1,.8,.6),Ah=1.35,jh=2.6,Mh=class{route;tag;index;kind;group=new An;turret=new An;barrel=null;laser;mats=[];radius;hp;x;z;prevX;prevZ;yaw;turretYaw;prevYaw;prevTurret;wp=0;alerted=!1;sinceSeen=99;lastKnown={x:0,z:0};cannonCd=2;aimT=0;aimAt={x:0,z:0};mgLeft=0;mgCd=0;flash=0;recoil=0;inSight=!1;hintShown=!1;def;constructor(e,t,n,r,i,a,o=`tank`){this.route=r,this.tag=i,this.index=a,this.kind=o,this.def=Eh[o],this.radius=this.def.radius,this.hp=this.def.hp,this.def.cannon||(this.cannonCd=1/0),this.x=this.prevX=e,this.z=this.prevZ=t,this.yaw=this.prevYaw=this.turretYaw=this.prevTurret=n;let s=e=>{let t=Z(new W({color:e}));return this.mats.push(t),t},c=(e,t,n,r,i,a)=>{let o=new H(t,n);return o.position.set(r,i,a),o.castShadow=!0,o.receiveShadow=!0,e.add(o),o};if(o===`jeep`)this.buildJeep(s,c);else{let e=s(5660735),t=s(2829866),n=new An;c(n,Dh.hull,e,0,.6,0),c(n,Dh.hullTop,s(4936759),0,1.05,-.2);for(let e of[-1,1]){c(n,Dh.track,t,e*1.1,.32,0);for(let t=0;t<5;t++){let r=c(n,Dh.wheel,s(3816758),e*1.12,.3,-1.25+t*.62);r.rotation.z=Math.PI/2}}this.group.add(n),c(this.turret,Dh.turret,e,0,Ah,-.1),c(this.turret,Dh.hatch,t,.25,1.6700000000000002,-.35);let r=c(this.turret,Dh.mg,t,-.45,1.73,.35);r.rotation.x=Math.PI/2;let i=new An;i.position.set(0,Ah,.55),this.barrel=c(i,Dh.barrel,t,0,0,1.05),this.barrel.rotation.x=Math.PI/2;let a=c(i,Dh.brake,t,0,0,2.1);a.rotation.x=Math.PI/2,this.turret.add(i),this.group.add(this.turret)}let l=new na(.07,1);l.rotateX(-Math.PI/2),l.translate(0,0,.5),this.laser=new H(l,new ui({color:16722458,transparent:!0,opacity:.7,depthWrite:!1,toneMapped:!1})),this.laser.visible=!1,this.group.add(this.laser),this.group.position.set(e,0,t)}buildJeep(e,t){let n=Oh,r=e(6121538),i=e(2500644),a=e(1907995),o=e(4540735),s=e(6974020),c=e(13212274),l=new An;t(l,n.body,r,0,.62,0),t(l,n.hood,r,0,.92,.85),t(l,n.grille,i,0,.66,1.46);for(let i of[-1,1]){let s=t(l,n.light,e(15262400),i*.45,.72,1.5);s.rotation.x=Math.PI/2;for(let e of[-.95,.95]){t(l,n.fender,r,i*.8,.88,e);let s=t(l,n.wheel,a,i*.78,.36,e);s.rotation.z=Math.PI/2;let c=t(l,n.hub,o,i*.78,.36,e);c.rotation.z=Math.PI/2}}let u=t(l,n.screen,o,0,1.06,.3);u.rotation.x=-.25;for(let e of[-1,1])t(l,n.seat,i,e*.36,.92,-.05),t(l,n.seatBack,i,e*.36,1.1,-.32);let d=t(l,n.spare,a,0,.78,-1.55);d.rotation.x=Math.PI/2,t(l,n.can,e(4082220),.55,.85,-1.38),t(l,n.torso,s,-.36,1.25,-.08),t(l,n.head,c,-.36,1.58,-.05),t(l,n.helmet,r,-.36,1.72,-.05),this.group.add(l),this.turret.position.set(0,0,-.75),t(this.turret,n.post,o,0,1.12,0),t(this.turret,n.torso,s,0,1.3,-.45),t(this.turret,n.head,c,0,1.64,-.42),t(this.turret,n.helmet,r,0,1.78,-.42),t(this.turret,n.mgBody,i,0,Th.mgY,.05),t(this.turret,n.shield,o,0,Th.mgY+.05,.36),t(this.turret,n.ammo,o,.15,Th.mgY-.08,0);let f=t(this.turret,n.mgBarrel,i,0,Th.mgY,.62);f.rotation.x=Math.PI/2,this.group.add(this.turret)}get alive(){return this.hp>0}muzzle(){return{x:this.x+Math.sin(this.turretYaw)*jh,y:Ah,z:this.z+Math.cos(this.turretYaw)*jh}}damage(e){return this.alive?(this.hp-=e,this.flash=1,this.alerted=!0,this.hp<=0&&(this.hp=0,this.wreck(),!0)):!1}wreck(){this.hp=0,this.aimT=0,this.laser.visible=!1;for(let e of this.mats)e.color.multiplyScalar(.35),e.emissive.setRGB(0,0,0);this.turret.position.set(.3,-.12,-.2),this.turret.rotation.z=.12,this.barrel&&(this.barrel.parent.rotation.x=.18),this.kind===`jeep`&&(this.group.children[0].rotation.z=.12,this.turret.visible=!1);let e=Z(new W({color:2367259}));for(let t=0;t<6;t++){let t=new H(Dh.rubble,e),n=Math.random()*Math.PI*2,r=1.6+Math.random()*.6;t.position.set(Math.cos(n)*r,.1,Math.sin(n)*r),t.rotation.set(Math.random(),Math.random()*3,Math.random()),this.group.add(t)}}alert(e,t){this.alerted=!0,this.lastKnown.x=e,this.lastKnown.z=t}update(e,t){let n=this.def;if(this.prevX=this.x,this.prevZ=this.z,this.prevYaw=this.yaw,this.prevTurret=this.turretYaw,!this.alive)return;let r=t.player,i=Math.hypot(r.x-this.x,r.z-this.z),a=!r.dead&&i<n.sight&&t.canSee(this.x,this.z,r.x,r.z);if(a?(this.alerted=!0,this.sinceSeen=0,this.lastKnown.x=r.x,this.lastKnown.z=r.z):this.sinceSeen+=e,this.route.length>0&&this.aimT<=0){let t=this.route[this.wp],o=t.x-this.x,s=t.z-this.z,c=Math.hypot(o,s);if(c<.6)this.wp=(this.wp+1)%this.route.length;else{let t=Math.atan2(o,s);this.yaw=Yl(this.yaw,t,n.hullTurn*e);let l=Math.abs(t-this.yaw)%(Math.PI*2);l>Math.PI&&(l=Math.PI*2-l);let u={x:this.x+Math.sin(this.yaw)*(n.radius+.75),z:this.z+Math.cos(this.yaw)*(n.radius+.75)},d=!r.dead&&Math.hypot(r.x-u.x,r.z-u.z)<1.4;if(l<.35&&!d){let t=n.speed*(this.alerted?1:.7)*(a&&!n.cannon&&i<n.mgRange?.35:1)*e;this.x+=Math.sin(this.yaw)*Math.min(t,c),this.z+=Math.cos(this.yaw)*Math.min(t,c)}}}if(this.alerted){let t=this.aimT>0?this.aimAt.x:this.lastKnown.x,r=this.aimT>0?this.aimAt.z:this.lastKnown.z,i=Math.atan2(t-this.x,r-this.z);(this.aimT<=0||this.aimT>.35)&&(this.turretYaw=Yl(this.turretYaw,i,n.turretTurn*e))}else this.turretYaw=Yl(this.turretYaw,this.yaw,n.turretTurn*e);if(this.cannonCd=Math.max(0,this.cannonCd-e),this.aimT>0){if(a&&this.aimT>.35&&(this.aimAt.x=r.x,this.aimAt.z=r.z),this.aimT-=e,this.aimT<=0){this.aimT=0;let e=this.muzzle();t.fireCannon(this,e.x,e.z,this.turretYaw,this.aimAt.x,this.aimAt.z),this.cannonCd=n.cannonReload,this.recoil=1}}else if(a&&this.cannonCd<=0&&i>3.5&&i<n.cannonRange&&t.onScreen(this.x,this.z)){let e=Math.atan2(r.x-this.x,r.z-this.z),t=Math.abs(e-this.turretYaw)%(Math.PI*2);t>Math.PI&&(t=Math.PI*2-t),t<.5&&(this.aimT=n.aimTime,this.aimAt.x=r.x,this.aimAt.z=r.z)}if(this.mgCd=Math.max(0,this.mgCd-e),a&&i<n.mgRange&&t.onScreen(this.x,this.z)){let e=Math.atan2(r.x-this.x,r.z-this.z),i=Math.abs(e-this.turretYaw)%(Math.PI*2);if(i>Math.PI&&(i=Math.PI*2-i),this.mgCd<=0&&i<.6){this.mgLeft<=0&&(this.mgLeft=n.mgBurst);let r=this.kind===`jeep`?this.x-Math.sin(this.yaw)*.75+Math.sin(this.turretYaw)*1:this.x+Math.sin(this.turretYaw)*.9-Math.cos(this.turretYaw)*.45,i=this.kind===`jeep`?this.z-Math.cos(this.yaw)*.75+Math.cos(this.turretYaw)*1:this.z+Math.cos(this.turretYaw)*.9+Math.sin(this.turretYaw)*.45;t.fireMg(this,r,i,e),this.mgLeft--,this.mgCd=this.mgLeft>0?1/n.mgRate:n.mgPause}}else this.mgLeft=0}render(e,t){let n=this.prevX+(this.x-this.prevX)*e,r=this.prevZ+(this.z-this.prevZ)*e;this.group.position.set(n,0,r),this.group.rotation.y=Nh(this.prevYaw,this.yaw,e),this.turret.rotation.y=Nh(this.prevTurret,this.turretYaw,e)-this.group.rotation.y,this.recoil=Math.max(0,this.recoil-t*3),this.alive&&this.barrel&&(this.barrel.position.z=1.05-this.recoil*.35);let i=this.aimT>0&&this.alive;if(this.laser.visible=i,i){let e=Math.hypot(this.aimAt.x-n,this.aimAt.z-r);this.laser.position.set(0,Ah,0),this.laser.rotation.y=this.turret.rotation.y,this.laser.scale.z=Math.max(.1,e),this.laser.material.opacity=.35+.45*Math.abs(Math.sin(this.aimT*18))}if(this.group.visible=this.inSight||i,this.flash>0&&(this.flash=Math.max(0,this.flash-t*8),this.alive))for(let e of this.mats)e.emissive.copy(kh).multiplyScalar(this.flash*.5)}};function Nh(e,t,n){let r=(t-e)%(Math.PI*2);return r>Math.PI&&(r-=Math.PI*2),r<-Math.PI&&(r+=Math.PI*2),e+r*n}var Ph=class e{mission;main=0;sideDone;onDone=null;constructor(e){this.mission=e,this.sideDone=e?e.side.map(()=>!1):[]}get complete(){return!!this.mission&&this.main>=this.mission.main.length}get current(){return this.mission?.main[this.main]??null}progress(e,t,n){if(e.kind===`destroy`){let r=n.get(e.tag)??0;if(r>1)return`${r-t.aliveWithTag(e.tag)}/${r}`}return e.kind===`eliminate`?`noch ${t.enemiesLeft}`:``}static done(e,t){switch(e.kind){case`reach`:return Math.hypot(t.player.x-e.x,t.player.z-e.z)<=e.r;case`destroy`:return t.aliveWithTag(e.tag)===0;case`eliminate`:return t.enemiesLeft===0}}static target(e,t){return e.kind===`reach`?{x:e.x,z:e.z}:e.kind===`destroy`?t.positionOfTag(e.tag):null}update(t){let n=this.mission;if(n){for(;this.main<n.main.length&&e.done(n.main[this.main],t);)this.onDone?.(n.main[this.main],!1),this.main++;n.side.forEach((n,r)=>{!this.sideDone[r]&&e.done(n,t)&&(this.sideDone[r]=!0,this.onDone?.(n,!0))})}}},Fh=20,Ih=.35,Lh=.2,Rh=22,zh=6,Bh=38,Vh=.35,Hh=.6,Uh=7,Wh=6,Gh=3,Kh=40;function qh(e){return(t,n)=>{let r=e.get(t,n);return r===q.Wall||r===q.Tree||r===q.PropHigh?99:$l[r].solid?$l[r].height:0}}function Jh(){let e=Math.random();return e<.05?`elite`:e<.25?`improved`:`standard`}var Yh=class e{canvas;renderer;scene=new Rn;camera=new Ql;input;hud;touch;player=new Mf;bullets;particles;muzzle;pickups;grenades;minimap;smoke;mines=[];drones=[];checkpoints=[];destructibles=[];tanks=[];objectives=new Ph(null);stats={time:0,shots:0,hits:0,kills:0};reloadMul=1;missionLoadout=null;onMissionComplete=null;missionDone=!1;destroyedIdx=new Set;beacon=new An;save=null;takenItems=new Set;map;dummies=[];enemies=[];paths;cover;fog;fps=0;onPlayerDied=null;heightAt;fogT=0;sprintNoiseT=0;flameSoundT=0;time=0;quality;mapView=null;sun;boomLight;boomT=0;aimLine;raycaster=new xo;aimPlane=new Br(new z(0,1,0),-rf);ndc=new R;tmp=new z;spreadNow=0;aimDist=8;nearPickup=null;nearCheckpoint=null;interactKey=``;gadgetHintT=0;grenadeThrow=null;attachHintT=0;emptyHintT=0;constructor(e,t,n){this.canvas=e,this.quality=Gl(i.quality),this.renderer=new Fl({canvas:e,antialias:this.quality.antialias,stencil:!0,powerPreference:`high-performance`}),this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.05,this.renderer.shadowMap.type=2,this.input=new Ul(e),this.hud=new Lm(t,this.input),this.touch=new Hm(n,this.input),this.minimap=new Km(t,this.input),this.scene.background=new V(197635),this.scene.add(new za(14674431,4932144,1.6)),this.sun=new no(16773336,2.4),this.sun.shadow.camera.left=-24,this.sun.shadow.camera.right=24,this.sun.shadow.camera.top=24,this.sun.shadow.camera.bottom=-24,this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=60,this.sun.shadow.bias=-8e-4,this.sun.shadow.normalBias=.03,this.scene.add(this.sun,this.sun.target),this.scene.add(this.player.model.root),this.bullets=new tp(this.scene),this.particles=new Pm(this.scene),this.pickups=new dp(this.scene),this.grenades=new Nm(this.scene),this.smoke=new Up(this.scene),this.muzzle=new Fm(this.scene,this.quality.dynamicLights),this.boomLight=this.quality.dynamicLights?new $a(16751168,0,16,2):null,this.boomLight&&this.scene.add(this.boomLight);let r=new na(.05,1);r.rotateX(-Math.PI/2),r.translate(0,0,.5),this.aimLine=new H(r,new ui({color:16730682,transparent:!0,opacity:.45,depthWrite:!1,toneMapped:!1})),this.aimLine.visible=!1,this.scene.add(this.aimLine);let a=new ui({color:16765002,transparent:!0,opacity:.5,blending:2,depthWrite:!1,toneMapped:!1}),o=new H(new ra(1.1,1.35,40),a);o.rotation.x=-Math.PI/2,o.position.y=.06;let s=new H(new Qi(.08,.08,6,8,1,!0),a.clone());s.material.opacity=.28,s.position.y=3,this.beacon.add(o,s),this.beacon.visible=!1,this.scene.add(this.beacon),this.applySettings(),this.loadMap(yh(`test`)),this.resize()}applyUpgrades(e){let t=mm(e??{hp:0,ammo:0,reload:0,grenades:0}),n=this.player;n.maxHp=t.maxHp,n.inv.ammoMul=t.ammoMul,n.inv.maxGrenades=t.maxGrenades,this.reloadMul=t.reloadMul}startMission(e,t,n){this.applyUpgrades(t),this.missionLoadout=n,this.loadMapId(e),this.startIntro()}intro=null;introSkip=!1;static INTRO_MOVE=1.1;static INTRO_HOLD=1.9;startIntro(){let e=this.map.mission;if(!e)return;let t=[],n=this.player;t.push({x:n.pos.x,z:n.pos.z,kicker:`Einsatz: ${this.map.name}`,text:e.intro.split(/(?<=[.!?])\s/)[0]??e.intro}),e.main.forEach((n,r)=>{let i=au(this.map,n);if(!i.length)return;let a=i.reduce((e,t)=>e+t.x,0)/i.length,o=i.reduce((e,t)=>e+t.z,0)/i.length;t.push({x:a,z:o,kicker:`Ziel ${r+1} von ${e.main.length}`,text:n.text})}),t.push({x:n.pos.x,z:n.pos.z,kicker:`Funk`,text:`Viel Glück da draußen. Ende.`}),this.intro={t:0,shots:t,fog:this.fog.enabled},this.introSkip=!1,this.fog.enabled=!1,this.introListener||(this.introListener=()=>{this.intro&&(this.introSkip=!0)},window.addEventListener(`pointerdown`,this.introListener),window.addEventListener(`keydown`,this.introListener))}introListener=null;updateIntro(t){let n=this.intro;if(!n)return!1;n.t+=t;let r=e.INTRO_MOVE+e.INTRO_HOLD;return this.introSkip||n.t>=r*n.shots.length?(this.endIntro(),!1):!0}endIntro(){if(!this.intro)return;this.fog.enabled=this.intro.fog,this.intro=null,this.hud.intro(null);let e=this.player;this.camera.snap(e.pos.x,e.pos.z),this.input.releaseAll();let t=this.map.mission?.main[0];t&&this.hud.toast(`Ziel 1: ${t.text}`,4)}renderIntro(){let t=this.intro;if(!t)return!1;let n=e.INTRO_MOVE+e.INTRO_HOLD,r=Math.min(t.shots.length-1,Math.floor(t.t/n)),i=t.t-r*n,a=t.shots[r],o=t.shots[Math.max(0,r-1)],s=Math.min(1,i/e.INTRO_MOVE),c=s*s*(3-2*s);return this.camera.snap(o.x+(a.x-o.x)*c,o.z+(a.z-o.z)*c),this.hud.intro(a.kicker,a.text),!0}applyLoadout(){let e=this.missionLoadout;if(!e)return;let t=this.player;t.inv.load(e),t.inv.grenades=Math.max(t.inv.grenades,Math.min(2,t.inv.maxGrenades)),t.maxArmor=t.inv.maxArmor,t.armor=t.maxArmor,t.hp=t.maxHp}loadMapId(e){this.loadMap(yh(e))}loadMap(e){this.mapView&&(this.scene.remove(this.mapView),this.mapView.traverse(e=>{if(e instanceof H){e.geometry.dispose();let t=Array.isArray(e.material)?e.material:[e.material];for(let e of t)e.dispose()}}));for(let e of this.dummies)this.scene.remove(e.group);for(let e of this.checkpoints)this.scene.remove(e.group);this.map=e,this.heightAt=qh(e),this.mapView=wd(e,this.quality.detail),this.scene.add(this.mapView),this.paths=new Bd(new Ld(e.w,e.h,e.solid)),this.cover=new mp(e);let t=!this.fog||this.fog.enabled;this.fog?.texture.dispose(),this.fog=new Mu(e),this.fog.enabled=t,this.fog.rays=this.quality.name===`low`?360:540,this.fog.bind(),this.minimap.setMap(e,this.fog),this.dummies=[];for(let t of e.entities)t.kind===`dummy`&&this.dummies.push(new Bf(t.x,t.z,t.yaw));for(let e of this.dummies)this.scene.add(e.group);this.checkpoints=[],e.entities.forEach((e,t)=>{e.kind===`checkpoint`&&this.checkpoints.push(new om(t,e.x,e.z))});for(let e of this.checkpoints)this.scene.add(e.group);this.restart()}spawnEnemies(){for(let e of this.enemies)this.scene.remove(e.group);this.enemies=[],this.map.entities.forEach((e,t)=>{e.kind===`enemy`&&this.enemies.push(new qf(e,t))});for(let e of this.enemies)this.scene.add(e.group)}spawnItems(){this.map.entities.forEach((e,t)=>{e.kind!==`item`||this.takenItems.has(t)||(this.pickups.spawn(this.payloadOf(e.item),e.x,e.z,1/0).mapIndex=t)})}payloadOf(e){switch(e.type){case`weapon`:{let t=new Yd(Ud[e.id],e.rarity??`standard`);for(let n of e.atts??[])t.attach(n);return t.mag=t.stats.magSize,{kind:`weapon`,weapon:t}}case`ammo`:return{kind:`ammo`,ammo:e.ammo,amount:e.amount??Wd[e.ammo].box};case`attachment`:return{kind:`attachment`,att:e.att};case`medkit`:return{kind:`medkit`,heal:35};case`grenade`:return{kind:`grenade`,count:e.count??1};case`gear`:return{kind:`gear`,gear:Zd[e.id]};case`gadget`:return{kind:`gadget`,gadget:e.id,count:e.count??1};case`armor`:return{kind:`armor`,amount:25}}}get touchMode(){return this.input.device===`touch`}restart(){this.save=null,this.takenItems.clear(),this.destroyedIdx.clear(),this.resetMission();for(let e of this.checkpoints)e.setActive(!1);this.resetWorld(),this.player.reset(this.map.spawn.x,this.map.spawn.z),this.player.maxArmor=0,this.applyLoadout(),this.afterPlace();let e=this.map.mission?.main[0];this.hud.toast(e?`${this.map.name} – Ziel 1: ${e.text}`:`${this.map.name} – schalte alle ${this.enemies.length} Gegner aus`,4)}resetMission(){this.objectives=new Ph(this.map.mission),this.objectives.onDone=(e,t)=>this.objectiveDone(e,t),this.missionDone=!1,this.stats.time=this.stats.shots=this.stats.hits=this.stats.kills=0}objectiveDone(e,t){X.radio(),this.hud.toast(`${t?`Nebenziel`:`Ziel`} erfüllt: ${e.text}`,3)}resetWorld(){for(let e of this.destructibles)this.scene.remove(e.group);this.destructibles=[],this.map.entities.forEach((e,t)=>{if(e.kind!==`destructible`)return;let n=new Ch(e.type,e.x,e.z,e.tag,t);this.destroyedIdx.has(t)&&n.wreck(),this.destructibles.push(n),this.scene.add(n.group)});for(let e of this.tanks)this.scene.remove(e.group);this.tanks=[],this.map.entities.forEach((e,t)=>{if(e.kind!==`tank`)return;let n=new Mh(e.x,e.z,e.yaw,e.route,e.tag,t,e.vehicle??`tank`);this.destroyedIdx.has(t)&&n.wreck(),this.tanks.push(n),this.scene.add(n.group)});for(let e of this.dummies)e.hp=e.maxHp,e.respawnT=0;this.paths.clear(),this.cover.reset(),this.spawnEnemies(),this.pickups.clear(),this.spawnItems(),this.grenades.clear(),this.smoke.clear();for(let e of this.mines)this.scene.remove(e.group);this.mines=[];for(let e of this.drones)this.scene.remove(e.group,e.marker);this.drones=[],this.grenadeThrow=null,this.nearPickup=null,this.nearCheckpoint=null,this.interactKey=``,this.hud.resetDamage(),this.hud.setHint(``),this.touch.setInteract(!1),this.bullets.clear(),this.particles.clear(),this.fog.reset()}afterPlace(){let e=this.player;this.camera.snap(e.pos.x,e.pos.z),this.fog.smoke=[],this.fog.reveals=[],this.fog.compute(e.pos.x,e.pos.z,e.facing),this.fog.snap(),this.fogT=0}snapshot(e){let t=this.player;return{version:1,map:this.map.id,checkpoint:e.index,activated:this.checkpoints.filter(e=>e.active).map(e=>e.index),x:t.pos.x,z:t.pos.z,hp:t.hp,armor:t.armor,inv:t.inv.save(),deadEnemies:this.enemies.filter(e=>!e.alive).map(e=>e.spawnIndex),takenItems:[...this.takenItems],explored:dm(this.fog.explored),savedAt:Date.now(),objMain:this.objectives.main,objSide:[...this.objectives.sideDone],destroyed:[...this.destroyedIdx]}}activateCheckpoint(e){let t=this.player,n=!e.active;e.setActive(!0),t.hp=Math.min(t.maxHp,t.hp+Kh),this.save=this.snapshot(e);let r=cm(this.save);X.radio(),this.hud.healFlash(),this.hud.toast(r?n?`Checkpoint aktiviert – gespeichert`:`Erneut gespeichert`:`Checkpoint aktiviert (Speichern nicht möglich)`,2.4),this.interactKey=``}loadSnapshot(e){if(e.map!==this.map.id){if(!_h[e.map]){this.restart();return}this.loadMap(yh(e.map))}this.takenItems=new Set(e.takenItems),this.destroyedIdx=new Set(e.destroyed??[]),this.resetMission(),this.objectives.main=e.objMain??0,e.objSide&&(this.objectives.sideDone=this.objectives.sideDone.map((t,n)=>!!e.objSide[n])),this.resetWorld();let t=new Set(e.deadEnemies);for(let e of this.enemies)t.has(e.spawnIndex)&&this.scene.remove(e.group);this.enemies=this.enemies.filter(e=>!t.has(e.spawnIndex));let n=new Set(e.activated);for(let e of this.checkpoints)e.setActive(n.has(e.index));let r=this.player;r.reset(e.x,e.z),r.inv.load(e.inv),r.maxArmor=r.inv.maxArmor,r.hp=Math.min(r.maxHp,e.hp),r.armor=Math.min(r.maxArmor,e.armor),fm(e.explored,this.fog.explored),this.save=e,this.afterPlace(),this.hud.toast(`Weiter am Checkpoint – noch ${this.enemies.length} Gegner`,3)}respawn(){this.save?this.loadSnapshot(this.save):this.restart()}autosave(){this.save&&cm(this.save)}applySettings(){let e=Gl(i.quality),t=e.shadows!==this.renderer.shadowMap.enabled;this.quality=e,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,e.pixelRatioMax)),this.renderer.shadowMap.enabled=e.shadows,this.sun.castShadow=e.shadows,this.sun.shadow.mapSize.x!==e.shadowMapSize&&(this.sun.shadow.mapSize.set(e.shadowMapSize,e.shadowMapSize),this.sun.shadow.map?.dispose(),this.sun.shadow.map=null),t&&this.scene.traverse(e=>{if(e instanceof H){let t=Array.isArray(e.material)?e.material:[e.material];for(let e of t)e.needsUpdate=!0}}),this.particles.scale=e.particleScale,this.fog&&(this.fog.rays=e.name===`low`?360:540),X.setVolume(i.volume),f.applyVolume(),h.applyVolume(),this.touch.layout(),this.resize()}resScale=1;frameAvg=1/60;slowT=0;fastT=0;resCooldown=0;adaptResolution(e,t){if(i.quality!==`auto`||!t||e>.1||e<=0){i.quality!==`auto`&&this.resScale!==1&&(this.resScale=1,this.resize());return}if(this.frameAvg+=(e-this.frameAvg)*.05,this.resCooldown=Math.max(0,this.resCooldown-e),this.frameAvg>1/48?(this.slowT+=e,this.fastT=0):this.frameAvg<1/57?(this.fastT+=e,this.slowT=0):this.slowT=this.fastT=0,this.resCooldown>0)return;let n=this.resScale;this.slowT>1.5&&this.resScale>.55?n=Math.max(.55,this.resScale-.1):this.fastT>6&&this.resScale<1&&(n=Math.min(1,this.resScale+.05)),n!==this.resScale&&(this.resScale=n,this.slowT=this.fastT=0,this.resCooldown=2,this.resize())}resize(){let e=window.innerWidth,t=window.innerHeight,n=Math.max(.5,Math.min(window.devicePixelRatio||1,this.quality.pixelRatioMax)*this.resScale);this.renderer.getPixelRatio()!==n&&this.renderer.setPixelRatio(n),this.renderer.setSize(e,t,!1),this.camera.resize(e,t)}tick(e){if(this.input.update(),this.updateIntro(e))return;this.time+=e;let t=this.player;t.prev.x=t.pos.x,t.prev.z=t.pos.z,t.dead?(t.deadT+=e,t.vel.x=t.vel.z=0,this.grenadeThrow=null):(this.updateMovement(e),this.updateAim(),this.updateSwitch(e),this.updateWeapon(e),this.updateGrenade(),this.input.wasPressed(`gadget`)&&this.useGadget(),this.collectPickups(e),this.updateInteract()),this.updateDevices(e),this.input.wasPressed(`map`)&&this.minimap.toggle(),this.fogT+=e,this.fogT>=1/Fh&&(this.fogT=0,this.fog.smoke=this.smoke.areas(),this.fog.reveals=this.drones.filter(e=>e.revealing).map(e=>({x:e.x,z:e.z,r:9})),this.fog.compute(t.pos.x,t.pos.z,t.facing,18+t.weapon.stats.viewBonus)),this.paths.process();for(let t of this.enemies)if(Mp(t,this,e),t.alive){for(let e of this.destructibles)e.alive&&jd(t.pos,t.radius,e.x,e.z,e.def.radius);for(let e of this.tanks)jd(t.pos,t.radius,e.x,e.z,e.radius)}this.tankWorld.player.x=t.pos.x,this.tankWorld.player.z=t.pos.z,this.tankWorld.player.dead=t.dead;for(let n of this.tanks)n.update(e,this.tankWorld),!t.dead&&n.alive&&(jd(t.pos,t.radius,n.x,n.z,n.radius),Ad(this.map.solid,t.pos,t.radius,0,0));this.stepBullets(e),this.grenades.step(e,this.heightAt,e=>this.grenadeBounce(e),(e,t,n)=>{n===`smoke`?this.smokeBurst(e.x,e.z):n===`flash`?this.flashbang(e.x,e.z):this.explode(e.x,e.z,Tm,t===`enemy`?70*a().damage:115,t)});for(let t of this.dummies)t.tick(e);t.dead||(this.stats.time+=e),this.objectives.update(this.objectiveWorld()),this.objectives.complete&&!this.missionDone&&!t.dead&&(this.missionDone=!0,this.onMissionComplete?.()),this.input.endTick()}onScreen(e,t){return this.tmp.set(e,1,t).project(this.camera.cam),Math.abs(this.tmp.x)<.9&&Math.abs(this.tmp.y)<.86&&this.tmp.z<1}enemyGrenade(e,t,n){let r=t-e.pos.x,i=n-e.pos.z,a=.8+Math.hypot(r,i)*.08,o=t+(Math.random()-.5)*a*2,s=n+(Math.random()-.5)*a*2,c=o-e.pos.x,l=s-e.pos.z,u=km(c,l,Math.hypot(c,l)),d=Math.hypot(c,l)||1,f={x:e.pos.x+c/d*.4,y:1.5,z:e.pos.z+l/d*.4,...u},p=jm(f,this.heightAt).end;this.grenades.throw(f,`enemy`,`frag`,{x:p.x,z:p.z}),e.facing=Math.atan2(c,l),e.recoilAnim=1;let m=this.soundAt(e.pos.x,e.pos.z);X.clink(m.vol,m.pan)}smokeBlocks(e,t,n,r){for(let i of this.smoke.areas()){let a=i.r*.85;if(Nd(e,t,n,r,i.x,i.z,a)>=0||(n-i.x)**2+(r-i.z)**2<a*a)return!0}return!1}noise(e,t,n){for(let r of this.enemies)Dp(r,this,e,t,n);for(let r of this.tanks)r.alive&&Math.hypot(r.x-e,r.z-t)<n&&r.alert(e,t)}soundAt(e,t,n=10){let r=this.player;return{vol:1/(1+Math.hypot(e-r.pos.x,t-r.pos.z)/n),pan:ql((e-r.pos.x)/15,-1,1)}}enemyAlerted(e){let t=this.soundAt(e.pos.x,e.pos.z);X.alert(t.vol,t.pan)}enemyFire(e,t){let n=e.def.weapon,r=e.muzzle(t);e.facing=t;let i=this.soundAt(r.x,r.z,6);X.shot(Math.min(1,i.vol*1.6),i.pan,Jd(n)),this.fog.seenNow(e.pos.x,e.pos.z)?this.muzzle.fire(r.x,r.y,r.z):this.shotMarker(e.pos.x,e.pos.z),Md(this.map.blocksShot,e.pos.x,e.pos.z,r.x,r.z)||this.bullets.spawn({owner:`enemy`,x:r.x,z:r.z,y:r.y,vx:Math.sin(t)*n.bulletSpeed,vz:Math.cos(t)*n.bulletSpeed,range:n.range,damage:n.damage*a().damage,falloffStart:n.falloffStart,minDamage:n.minDamage})}shotMarker(e,t){this.tmp.set(e,1.2,t).project(this.camera.cam);let n=window.innerWidth,r=window.innerHeight,i=(this.tmp.x+1)/2*n,a=(1-this.tmp.y)/2*r,o=i<28||a<28||i>n-28||a>r-28||this.tmp.z>1;i=ql(i,28,n-28),a=ql(a,28,r-28),this.hud.shotMarker(i,a,o)}damagePlayer(e,t,n){let r=this.player;if(r.dead)return;r.hitAnim=Math.min(1,r.hitAnim+.6);let i=e*r.inv.damageMul;if(r.armor>0){let e=Math.min(r.armor,i*.66);r.armor-=e,i-=e}r.hp-=i,this.hud.damageFrom(Math.atan2(t-r.pos.x,-(n-r.pos.z)),i),this.camera.addShake(.12),X.hurt(),this.input.device===`touch`&&zl(30),r.hp<=0&&(r.hp=0,r.dead=!0,r.deadT=0,r.crouched=!1,this.grenades.showPreview(null),X.death(),zl([60,40,120]),this.onPlayerDied?.())}updateMovement(e){let t=this.player,n=this.input.state;this.input.wasPressed(`crouch`)&&(t.crouched=!t.crouched);let r=n.moveMag>.1;t.sprinting=n.sprint&&r&&!n.fire,t.sprinting&&(t.crouched=!1);let i=(t.crouched?jf:t.sprinting?Af:kf)*t.weapon.stats.moveMul*t.inv.speedMul,a=n.move.x*i,o=-n.move.y*i,s=Math.min(1,e*(r?16:20));t.vel.x+=(a-t.vel.x)*s,t.vel.z+=(o-t.vel.z)*s,Ad(this.map.solid,t.pos,t.radius,t.vel.x*e,t.vel.z*e);for(let e of this.dummies)e.alive&&jd(t.pos,t.radius,e.x,e.z,e.radius);for(let e of this.enemies)e.alive&&jd(t.pos,t.radius,e.pos.x,e.pos.z,e.radius);for(let e of this.destructibles)e.alive&&jd(t.pos,t.radius,e.x,e.z,e.def.radius);for(let e of this.tanks)jd(t.pos,t.radius,e.x,e.z,e.radius);t.sprinting&&(this.sprintNoiseT-=e,this.sprintNoiseT<=0&&(this.sprintNoiseT=.35,this.noise(t.pos.x,t.pos.z,zh*t.inv.noiseMul))),t.vel.x=(t.pos.x-t.prev.x)/e,t.vel.z=(t.pos.z-t.prev.z)/e}mouseOnPlane(e){return this.ndc.set(this.input.mouseX/window.innerWidth*2-1,-(this.input.mouseY/window.innerHeight)*2+1),this.raycaster.setFromCamera(this.ndc,this.camera.cam),this.aimPlane.constant=-e,this.raycaster.ray.intersectPlane(this.aimPlane,this.tmp)}updateAim(){let e=this.player,t=this.input.state,n=!1,r=0,a=0;if(t.aim===`point`){let t=this.mouseOnPlane(rf-(e.crouched?.38:0));if(t){r=t.x-e.pos.x,a=t.z-e.pos.z;let i=Math.hypot(r,a);i>.5&&(n=!0,r/=i,a/=i,this.aimDist=i)}}else if(t.aim===`dir`&&(r=t.aimDir.x,a=-t.aimDir.y,n=!0,this.aimDist=8,i.aimAssist)){let e=this.assist(r,a);r=e.x,a=e.z}e.aiming=n,n&&(e.aim.x=r,e.aim.z=a);let o=e.facing;n?o=Math.atan2(e.aim.x,e.aim.z):e.speed>.5&&(o=Math.atan2(e.vel.x,e.vel.z)),e.facing=Yl(e.facing,o,1/60*16),!n&&e.speed>.5&&(e.aim.x=Math.sin(e.facing),e.aim.z=Math.cos(e.facing))}assist(e,t){let n=this.player,r=null,i=Lh,a=(a,o)=>{let s=a-n.pos.x,c=o-n.pos.z,l=Math.hypot(s,c);if(l>Rh||l<.5)return;let u=Math.acos(ql((s*e+c*t)/l,-1,1));u>=i||Md(this.map.blocksShot,n.pos.x,n.pos.z,a,o)||(r={x:a,z:o},i=u)};for(let e of this.dummies)e.alive&&a(e.x,e.z);for(let e of this.enemies)e.alive&&e.inSight&&a(e.pos.x,e.pos.z);for(let e of this.tanks)e.alive&&e.inSight&&a(e.x,e.z);if(!r)return{x:e,z:t};r=r;let o=r.x-n.pos.x,s=r.z-n.pos.z,c=Math.hypot(o,s);return{x:o/c,z:s/c}}updateSwitch(e){let t=this.player,n=t.inv,r=n.current,i=this.input,a=!1;i.wasPressed(`slot1`)?a=n.select(0):i.wasPressed(`slot2`)?a=n.select(1):i.wasPressed(`slot3`)?a=n.select(2):i.wasPressed(`weaponNext`)?a=n.cycle(1):i.wasPressed(`weaponPrev`)&&(a=n.cycle(-1)),a&&this.onSwitched(r),t.switchT=Math.max(0,t.switchT-e)}onSwitched(e){e.reloadT=0,this.player.switchT=Vh,X.equip()}updateWeapon(e){let t=this.player,n=t.inv,r=t.weapon,i=r.stats,a=this.input.state;r.cooldown=Math.max(0,r.cooldown-e),r.bloom=Math.max(0,r.bloom-i.recovery*e),r.reloading&&(r.reloadT-=e,r.reloadT<=0&&n.finishReload(r)),this.input.wasPressed(`reload`)&&this.startReload(),this.emptyHintT=Math.max(0,this.emptyHintT-e);let o=(a.precise?i.spreadAim:i.spread)+r.bloom;if(t.crouched&&(o*=.7),t.speed>1&&(o*=t.sprinting?2:1.35),this.spreadNow=o,!(!(i.auto||this.input.device!==`kbm`?a.fire:a.firePressed)||r.cooldown>0||r.reloading||t.switchT>0)){if(r.mag<=0){if(n.reserve(r)>0)a.firePressed&&X.dryClick(),this.startReload();else{X.dryClick(),this.emptyHintT<=0&&(this.hud.toast(`Keine ${Wd[r.def.ammo].name} mehr`,1.8),this.emptyHintT=2);let e=n.current;n.select(2)&&this.onSwitched(e)}r.cooldown=.25}else this.fire(o)}}startReload(){let e=this.player,t=e.weapon;e.inv.canReload(t)&&(t.reloadT=t.stats.reloadTime*this.reloadMul,X.reload())}fire(e){let t=this.player,n=t.weapon,r=n.stats;n.mag--,n.cooldown=1/r.fireRate,n.bloom=Math.min(r.maxBloom,n.bloom+r.recoil),t.sprinting=!1;let i=Math.atan2(t.aim.x,t.aim.z);t.facing=i,t.recoilAnim=1,this.stats.shots++;let a=t.muzzle(i),o=Md(this.map.blocksShot,t.pos.x,t.pos.z,a.x,a.z);for(let t=0;t<r.pellets;t++){let t=i+(r.pellets>1?Math.random()*2-1:Math.random()+Math.random()-1)*e,n=Math.sin(t),s=Math.cos(t);o?r.projectile===`rocket`?this.explode(o.x-n*.3,o.z-s*.3,r.explosion,r.damage,`player`):r.projectile===`bullet`&&this.wallImpact(o.x,a.y,o.z,o.nx,o.nz):this.bullets.spawn({owner:`player`,kind:r.projectile,x:a.x,z:a.z,y:a.y,vx:n*r.bulletSpeed*(r.projectile===`flame`?.85+Math.random()*.3:1),vz:s*r.bulletSpeed*(r.projectile===`flame`?.85+Math.random()*.3:1),range:r.range,damage:r.damage,falloffStart:r.falloffStart,minDamage:r.minDamage,pierce:r.pierce,explosion:r.explosion})}r.projectile===`flame`?(this.flameSoundT-=1/r.fireRate,this.flameSoundT<=0&&(this.flameSoundT=.11,X.shot(.8,0,`flamer`)),this.particles.burst(a.x,a.y,a.z,{count:1,color:16762976,speed:1.5,up:.5,life:.15,size:.12,gravity:-2})):(this.muzzle.fire(a.x,a.y,a.z),X.shot(1,0,Jd(r,n.silenced))),r.projectile===`rocket`&&this.particles.burst(t.pos.x-Math.sin(i)*.6,a.y,t.pos.z-Math.cos(i)*.6,{count:8,color:10130570,speed:2,up:.6,life:.7,size:.22,dirX:-Math.sin(i),dirZ:-Math.cos(i),gravity:-1}),this.noise(t.pos.x,t.pos.z,r.loudness),this.camera.addShake(r.shake),this.input.device===`touch`&&r.projectile!==`flame`&&zl(r.pellets>1||r.explosion>0?25:12)}updateGrenade(){let e=this.player,t=e.inv;if(this.input.state.grenadeHeld&&t.grenades>0){let t=Math.sin(e.facing),n=Math.cos(e.facing),r=8;if(this.input.device===`kbm`&&this.input.hasMouse){let i=this.mouseOnPlane(0);i&&(t=i.x-e.pos.x,n=i.z-e.pos.z,r=Math.hypot(t,n))}else if(this.input.device===`touch`){let e=this.input.touch.grenadeDrag,i=Math.hypot(e.x,e.y);i>.18&&(t=e.x,n=e.y,r=3+Math.min(1,i)*13)}else r=9;r=ql(r,2,16);let i=Math.hypot(t,n)||1;t/=i,n/=i,e.facing=Yl(e.facing,Math.atan2(t,n),.3);let a=km(t,n,r),o={x:e.pos.x+t*.4,y:1.5,z:e.pos.z+n*.4,...a};this.grenadeThrow=o,this.grenades.showPreview(jm(o,this.heightAt))}else this.grenadeThrow&&this.grenades.showPreview(null);this.input.wasPressed(`grenadeRelease`)&&(t.grenades<=0?this.hud.toast(`Keine Granaten`,1.4):this.grenadeThrow&&(this.grenades.throw(this.grenadeThrow,`player`),t.grenades--,e.recoilAnim=1,X.equip()),this.grenadeThrow=null,this.grenades.showPreview(null))}grenadeBounce(e){let t=this.soundAt(e.x,e.z);X.clink(t.vol,t.pan)}stepBullets(e){let t=this.map,n=this.player;for(let r of this.bullets.list){if(!r.active)continue;r.px=r.x,r.pz=r.z;let i=r.x+r.vx*e,a=r.z+r.vz*e,o=r.vx/r.speed,s=r.vz/r.speed;r.kind===`rocket`&&Math.random()<.7&&this.particles.burst(r.x-o*.5,r.y,r.z-s*.5,{count:1,color:11051674,speed:.4,up:.3,life:.8,size:.2,gravity:-1.2});let c=2,l=null,u=null,d=!1,f=null,p=null,m=Md(t.blocksShot,r.x,r.z,i,a);m&&(c=m.t);for(let e of this.tanks){if(r.hits.includes(e))continue;let t=Nd(r.x,r.z,i,a,e.x,e.z,e.radius);t>=0&&t<c&&(c=t,p=e)}for(let e of this.destructibles){if(!e.alive||r.hits.includes(e))continue;let t=Nd(r.x,r.z,i,a,e.x,e.z,e.def.radius);t>=0&&t<c&&(c=t,f=e,p=null)}if(r.owner===`player`){for(let e of this.dummies){if(!e.alive||r.hits.includes(e))continue;let t=Nd(r.x,r.z,i,a,e.x,e.z,e.radius);t>=0&&t<c&&(c=t,l=e,f=null,p=null)}for(let e of this.enemies){if(!e.alive||r.hits.includes(e))continue;let t=e.radius+(r.kind===`flame`?.25:0),n=Nd(r.x,r.z,i,a,e.pos.x,e.pos.z,t);n>=0&&n<c&&(c=n,l=null,f=null,p=null,u=e)}}else if(!n.dead){let e=Nd(r.x,r.z,i,a,n.pos.x,n.pos.z,n.radius);e>=0&&e<c?(c=e,f=null,p=null,d=!0):!r.whizzed&&Nd(r.x,r.z,i,a,n.pos.x,n.pos.z,1.3)>=0&&(r.whizzed=!0,X.whiz(ql((r.x-n.pos.x)/3,-1,1)))}if(c<=1){let t=r.x+(i-r.x)*c,n=r.z+(a-r.z)*c;if(r.traveled+=r.speed*e*c,r.x=t,r.z=n,r.kind===`rocket`){r.active=!1,this.explode(t-o*.3,n-s*.3,r.explosion,r.damage,r.owner);continue}if(p){if(r.active=!1,r.kind!==`flame`){this.particles.burst(t,r.y,n,{count:5,color:16765562,speed:5,up:1.5,life:.18,size:.04,dirX:-o,dirZ:-s,gravity:4});let e=this.soundAt(t,n);X.impact(e.vol,e.pan)}r.owner===`player`&&(this.damageTank(p,tp.damageAt(r,r.traveled)*(r.kind===`flame`?p.def.flameMul:p.def.bulletMul)),p.alive&&!p.hintShown&&r.kind===`bullet`&&(p.hintShown=!0,this.hud.toast(p.def.boss?`Kugeln prallen an der Panzerung ab – nimm Raketen, Granaten oder Minen!`:`Der Jeep ist leicht gepanzert – Granaten und Raketen wirken viel besser!`,3.5)));continue}if(f){r.active=!1,r.kind!==`flame`&&this.particles.burst(t,r.y,n,{count:5,color:9076848,speed:2.5,up:1.5,life:.4,size:.07,dirX:-o,dirZ:-s}),this.damageObject(f,tp.damageAt(r,r.traveled)*(r.kind===`flame`?3:1));continue}let h=l??u;if(h){u&&r.owner===`player`&&this.stats.hits++;let e=tp.damageAt(r,r.traveled);if(l?this.hurtDummy(l,e,o,s,t,r.y,n,r.kind):this.hurtEnemy(u,e,o,s,t,r.y,n,r.kind),r.hits.push(h),r.pierce>0){r.pierce--;continue}r.active=!1;continue}r.active=!1,d?this.playerHit(r,t,n):m&&(r.kind===`flame`?this.particles.burst(t,r.y,n,{count:2,color:16747056,speed:1,up:1,life:.3,size:.2,gravity:-2}):this.wallImpact(t,r.y,n,m.nx,m.nz))}else r.x=i,r.z=a,r.traveled+=r.speed*e,r.traveled>=r.range&&(r.active=!1,r.kind===`rocket`&&this.explode(r.x,r.z,r.explosion,r.damage,r.owner))}}hurtDummy(e,t,n,r,i,a,o,s){let c=e.damage(t,n,r);s!==`flame`&&this.particles.burst(i,a,o,{count:7,color:14205834,speed:3,up:2,life:.5,size:.07,dirX:-n,dirZ:-r}),this.hud.hitmarker(c),(s!==`flame`||c)&&X.hit(c)}hurtEnemy(e,t,n,r,i,a,o,s){let c=e.damage(t);s===`flame`?this.particles.burst(i,a,o,{count:1,color:16742954,speed:1,up:1.5,life:.4,size:.14,gravity:-2}):this.particles.burst(i,a,o,{count:8,color:9051930,speed:3,up:1.5,life:.5,size:.07,dirX:n,dirZ:r}),this.hud.hitmarker(c),(s!==`flame`||c)&&X.hit(c),c?this.enemyKilled(e):kp(e,this,this.player.pos.x,this.player.pos.z)}playerHit(e,t,n){let r=tp.damageAt(e,e.traveled),i=e.vx/e.speed,a=e.vz/e.speed;this.particles.burst(t,e.y,n,{count:6,color:9051930,speed:2.5,up:1.5,life:.4,size:.06,dirX:i,dirZ:a}),this.damagePlayer(r,t-i*e.traveled,n-a*e.traveled)}wallImpact(e,t,n,r,i){this.particles.burst(e,t,n,{count:6,color:11117204,speed:2.5,up:1.6,life:.45,size:.07,dirX:r,dirZ:i}),this.particles.burst(e,t,n,{count:3,color:16765562,speed:6,up:1,life:.14,size:.035,dirX:r,dirZ:i,gravity:4});let a=this.soundAt(e,n);X.impact(a.vol,a.pan)}explode(e,t,n,r,i){let a=(n,r)=>Md(this.map.blocksShot,e,t,n,r)!==null,o=e=>r*(1-(e/n)**1.5);for(let r of this.enemies){if(!r.alive)continue;let i=Math.hypot(r.pos.x-e,r.pos.z-t);if(i>=n||a(r.pos.x,r.pos.z))continue;let s=i||1;this.hurtEnemy(r,o(i),(r.pos.x-e)/s,(r.pos.z-t)/s,r.pos.x,1,r.pos.z,`blast`)}for(let r of this.dummies){if(!r.alive)continue;let i=Math.hypot(r.x-e,r.z-t);if(i>=n||a(r.x,r.z))continue;let s=i||1;this.hurtDummy(r,o(i),(r.x-e)/s,(r.z-t)/s,r.x,1,r.z,`blast`)}for(let r of this.destructibles){if(!r.alive)continue;let i=Math.max(0,Math.hypot(r.x-e,r.z-t)-r.def.radius*.5);i>=n||a(r.x,r.z)||this.chain.push([r,o(i)*1.5])}if(i===`player`)for(let r of this.tanks){if(!r.alive)continue;let i=Math.max(0,Math.hypot(r.x-e,r.z-t)-r.radius*.6);i>=n||a(r.x,r.z)||this.chain.push([r,o(i)*r.def.blastMul])}let s=this.player,c=Math.hypot(s.pos.x-e,s.pos.z-t);!s.dead&&c<n&&!a(s.pos.x,s.pos.z)&&this.damagePlayer(o(c)*(i===`player`?Hh:1),e,t);let l=this.fog.seenNow(e,t)||this.fog.visibleAt(e,t)>.2,u=this.particles;u.burst(e,.6,t,{count:26,color:16752688,speed:7,up:4,life:.45,size:.2,gravity:6}),u.burst(e,.5,t,{count:12,color:16769152,speed:4,up:3,life:.3,size:.16,gravity:4}),u.burst(e,.6,t,{count:18,color:5196613,speed:2.2,up:2.2,life:1.5,size:.38,gravity:-1.4}),u.burst(e,.3,t,{count:10,color:4011048,speed:6,up:6,life:1,size:.08}),this.boomLight&&(this.boomLight.position.set(e,1.6,t),this.boomT=.28),l||this.shotMarker(e,t);let d=this.soundAt(e,t,14);if(X.explosion(d.vol,d.pan),this.camera.addShake(ql(.6*(1-c/22),0,.6)),c<10&&this.input.device===`touch`&&zl(60),this.noise(e,t,Bh),!this.chaining){for(this.chaining=!0;this.chain.length;){let[e,t]=this.chain.shift();e instanceof Mh?this.damageTank(e,t):this.damageObject(e,t)}this.chaining=!1}}chain=[];chaining=!1;damageObject(e,t){e.damage(t)&&(this.destroyedIdx.add(e.index),this.explode(e.x,e.z,e.def.blast,e.def.damage,`player`),!e.tag||this.destructibles.some(t=>t.alive&&t.tag===e.tag))}damageTank(e,t){t>=20&&this.hud.hitmarker(!1);let n=e.damage(t);e.alert(this.player.pos.x,this.player.pos.z),n&&(this.destroyedIdx.add(e.index),this.stats.kills++,this.hud.hitmarker(!0),this.explode(e.x,e.z,e.def.wreckBlast,e.def.wreckDamage,`player`),this.particles.burst(e.x,1.2,e.z,{count:e.def.boss?30:16,color:3025446,speed:2,up:4,life:2.4,size:.5,gravity:-1.2}),this.camera.addShake(e.def.boss?.8:.4),this.hud.toast(`${e.def.name} zerstört!`,e.def.boss?3:2))}tankWorld={player:{x:0,z:0,dead:!1},canSee:(e,t,n,r)=>!Md(this.map.blocksSight,e,t,n,r)&&!this.smokeBlocks(e,t,n,r),fireCannon:(e,t,n,r,i,a)=>this.tankCannon(e,t,n,r,i,a),fireMg:(e,t,n,r)=>this.tankMg(e,t,n,r),onScreen:(e,t)=>this.onScreen(e,t)};tankCannon(e,t,n,r,i,o){let s=Math.max(2,Math.hypot(i-e.x,o-e.z)-2.6),c=this.soundAt(t,n,10);X.shot(Math.min(1,c.vol*1.8),c.pan,`launcher`),this.fog.seenNow(t,n)?this.muzzle.fire(t,1.35,n):this.shotMarker(t,n),this.particles.burst(t,1.35,n,{count:10,color:9407104,speed:2.5,up:.8,life:.9,size:.3,dirX:Math.sin(r),dirZ:Math.cos(r),gravity:-1}),this.camera.addShake(.15),Md(this.map.blocksShot,e.x,e.z,t,n)||this.bullets.spawn({owner:`enemy`,kind:`rocket`,x:t,z:n,y:1.35,vx:Math.sin(r)*wh.shellSpeed,vz:Math.cos(r)*wh.shellSpeed,range:s,damage:wh.cannonDamage*a().damage,falloffStart:999,minDamage:1,explosion:wh.cannonRadius})?.hits.push(e)}tankMg(e,t,n,r){let i=this.soundAt(t,n,6);X.shot(Math.min(1,i.vol*1.4),i.pan,`rifle`),this.fog.seenNow(t,n)?this.muzzle.fire(t,e.def.mgY,n):this.shotMarker(t,n);let o=r+(Math.random()+Math.random()-1)*(this.touchMode?.11:.08);this.bullets.spawn({owner:`enemy`,x:t,z:n,y:e.def.mgY-.1,vx:Math.sin(o)*70,vz:Math.cos(o)*70,range:e.def.mgRange+6,damage:e.def.mgDamage*a().damage,falloffStart:e.def.mgRange,minDamage:.6})?.hits.push(e)}combatLevel(){if(this.player.dead)return .1;let e=0,t=!1;for(let n of this.enemies)n.alive&&(n.state===`attack`?e++:(n.state===`search`||n.state===`investigate`)&&(t=!0));return this.tanks.some(e=>e.alive&&e.alerted&&e.def.boss)?1:e>0?Math.min(1,.55+e*.12):this.tanks.some(e=>e.alive&&e.alerted)?.6:t?.4:.12}objectiveWorld(){let e=this.player;return{player:{x:e.pos.x,z:e.pos.z},enemiesLeft:this.enemies.filter(e=>e.alive).length,aliveWithTag:e=>this.destructibles.filter(t=>t.alive&&t.tag===e).length+this.tanks.filter(t=>t.alive&&t.tag===e).length,positionOfTag:e=>{let t=this.destructibles.find(t=>t.alive&&t.tag===e)??this.tanks.find(t=>t.alive&&t.tag===e);return t?{x:t.x,z:t.z}:null}}}tagTotals(){let e=new Map;for(let t of[...this.destructibles,...this.tanks])t.tag&&e.set(t.tag,(e.get(t.tag)??0)+1);return e}gadgetConflict(e){let t=this.player.inv.gadget;return e.payload.kind===`gadget`&&t!==null&&t.id!==e.payload.gadget}markTaken(e){e.taken=!0,e.mapIndex>=0&&this.takenItems.add(e.mapIndex)}collectPickups(e){let t=this.player,n=t.inv;this.attachHintT=Math.max(0,this.attachHintT-e);for(let e of this.pickups.list){if(e.expired||e.manual||this.gadgetConflict(e)||Math.hypot(e.x-t.pos.x,e.z-t.pos.z)>.75)continue;let r=e.payload,i=!1;if(r.kind===`medkit`){if(t.hp>=t.maxHp)continue;let e=Math.min(r.heal,t.maxHp-t.hp);t.hp+=e,this.hud.toast(`Medipack +${Math.round(e)}`,1.6),this.hud.healFlash(),i=!0}else if(r.kind===`ammo`){let e=n.addAmmo(r.ammo,r.amount);if(e<=0)continue;if(r.amount-=e,this.hud.toast(`+${e} ${Wd[r.ammo].name}`,1.4),i=r.amount<=0,!i){X.pickup();continue}}else if(r.kind===`grenade`){let e=n.addGrenades(r.count);if(e<=0)continue;if(r.count-=e,this.hud.toast(e>1?`+${e} Granaten`:`+1 Granate`,1.4),i=r.count<=0,!i){X.pickup();continue}}else if(r.kind===`attachment`){let e=n.attach(r.att);if(!e){this.attachHintT<=0&&(this.hud.toast(`${Kd[r.att].name} passt an keine deiner Waffen`,2),this.attachHintT=3);continue}this.hud.toast(`${Kd[r.att].name} → ${e.def.name}`,2),i=!0}else if(r.kind===`armor`){if(t.maxArmor<=0){this.attachHintT<=0&&(this.hud.toast(`Panzerplatte: erst eine Weste anlegen`,2),this.attachHintT=3);continue}if(t.armor>=t.maxArmor)continue;let e=Math.min(r.amount,t.maxArmor-t.armor);t.armor+=e,this.hud.toast(`Rüstung +${Math.round(e)}`,1.4),i=!0}else if(r.kind===`gadget`){let e=n.takeGadget(r.gadget,r.count);if(e.took<=0)continue;r.count-=e.took;let t=$d[r.gadget];if(this.hud.toast(e.took>1?`+${e.took} ${t.plural}`:`+1 ${t.name}`,1.6),i=r.count<=0,!i){X.pickup();continue}}i&&(this.markTaken(e),X.pickup(),this.particles.burst(e.x,.4,e.z,{count:10,color:8257434,speed:2,up:3,life:.5,size:.06,gravity:4}))}this.pickups.prune()}updateInteract(){let e=this.player,t=e.inv,n=null,r=np;for(let t of this.pickups.list){if(t.expired||!(t.manual||this.gadgetConflict(t)))continue;let i=Math.hypot(t.x-e.pos.x,t.z-e.pos.z);i<r&&(r=i,n=t)}let i=null;for(let t of this.checkpoints)Math.hypot(t.x-e.pos.x,t.z-e.pos.z)<1.6&&(i=t);this.nearPickup=n,this.nearCheckpoint=i;let a=this.input.device===`kbm`?`[E] `:this.input.device===`gamepad`?`[A] `:``,o=``,s=``;if(n){let e=n.payload,r=``;if(e.kind===`weapon`){let e=t.primaries.every(e=>e!==null),n=t.active===2?t.lastPrimary:t.active;e&&(r=` (ersetzt ${t.primaries[n].def.short})`)}else if(e.kind===`gear`){let n=t.gear[e.gear.slot];r=n?` (ersetzt ${n.name})`:` – ${e.gear.desc}`}else e.kind===`gadget`&&t.gadget&&(r=` (ersetzt ${$d[t.gadget.id].name})`);o=`${a}${n.label} aufheben${r}`,s=`Nehmen`}else i&&(o=i.active?`${a}Am Checkpoint erneut speichern`:`${a}Checkpoint aktivieren (speichert)`,s=`Funken`);let c=`${o}|${s}`;c!==this.interactKey&&(this.interactKey=c,this.hud.setHint(o),this.touch.setInteract(s!==``,s)),this.input.wasPressed(`interact`)&&(n?this.takeItem(n):i&&this.activateCheckpoint(i))}takeItem(e){let t=this.player,n=t.inv,r=e.payload;if(r.kind===`weapon`){let t=r.weapon,i=n.current,a=n.takeWeapon(t),o=t.def.ammo;o&&n.ammo[o]===0&&n.addAmmo(o,Wd[o].box),a&&this.pickups.spawn({kind:`weapon`,weapon:a},e.x,e.z,1/0),this.onSwitched(i);let s=Gd[t.rarity];this.hud.toast(`${t.def.name}${t.rarity===`standard`?``:` · ${s.name}`}`,1.8)}else if(r.kind===`gear`){let i=n.equip(r.gear);i&&this.pickups.spawn({kind:`gear`,gear:i},e.x,e.z,1/0),r.gear.slot===`vest`&&(t.maxArmor=n.maxArmor,t.armor=t.maxArmor),this.hud.toast(`${Qd[r.gear.slot]}: ${r.gear.name} – ${r.gear.desc}`,2.2),X.equip()}else if(r.kind===`gadget`){let t=n.takeGadget(r.gadget,r.count);t.dropped&&this.pickups.spawn({kind:`gadget`,gadget:t.dropped.id,count:t.dropped.count},e.x,e.z,1/0),this.hud.toast(`${$d[r.gadget].name} ×${n.gadget?.count??0}`,1.8)}else return;this.markTaken(e),X.pickup(),this.nearPickup=null,this.interactKey=``,this.pickups.prune()}gadgetTarget(e,t){let n=this.player,r=Math.sin(n.facing),i=Math.cos(n.facing),a=t;if(this.input.device===`kbm`&&this.input.hasMouse){let e=this.mouseOnPlane(0);if(e){r=e.x-n.pos.x,i=e.z-n.pos.z,a=Math.hypot(r,i);let t=a||1;r/=t,i/=t}}return a=ql(a,1.5,e),{x:n.pos.x+r*a,z:n.pos.z+i*a,dx:r,dz:i,dist:a}}useGadget(){let e=this.player,t=e.inv,n=t.gadget;if(!n)this.gadgetHintT<=0&&this.hud.toast(`Kein Gadget`,1.2),this.gadgetHintT=1;else switch(n.id){case`medkit`:if(e.hp>=e.maxHp){this.hud.toast(`Leben ist schon voll`,1.2);return}t.useGadget(),e.hp=Math.min(e.maxHp,e.hp+40),this.hud.healFlash(),X.pickup();break;case`smoke`:case`flash`:{t.useGadget();let r=this.gadgetTarget(16,9),i=km(r.dx,r.dz,r.dist);this.grenades.throw({x:e.pos.x+r.dx*.4,y:1.5,z:e.pos.z+r.dz*.4,...i},`player`,n.id),e.facing=Math.atan2(r.dx,r.dz),e.recoilAnim=1,X.equip();break}case`mine`:{t.useGadget(),this.mines.length>=Gh&&this.scene.remove(this.mines.shift().group);let n=new Xp(e.pos.x,e.pos.z);this.mines.push(n),this.scene.add(n.group),X.equip(),this.hud.toast(`Mine gelegt – scharf in 1 s`,1.4);break}case`drone`:{t.useGadget();let n=this.gadgetTarget(22,14),r=ql(n.x,.5,this.map.w-.5),i=ql(n.z,.5,this.map.h-.5),a=new tm(e.pos.x,e.pos.z,r,i);this.drones.push(a),this.scene.add(a.group,a.marker),X.equip();break}}}smokeBurst(e,t){this.smoke.spawn(e,t);let n=this.soundAt(e,t);X.impact(n.vol,n.pan),this.particles.burst(e,.3,t,{count:8,color:13159632,speed:2.5,up:1.5,life:.8,size:.25,gravity:-1})}flashbang(e,t){let n=(n,r)=>Md(this.map.blocksSight,e,t,n,r)!==null;for(let r of this.enemies){if(!r.alive)continue;let i=Math.hypot(r.pos.x-e,r.pos.z-t);i>=Uh||n(r.pos.x,r.pos.z)||Op(r,3.5*(1-i/Uh*.45))}let r=this.player,i=Math.hypot(r.pos.x-e,r.pos.z-t);!r.dead&&i<Wh&&!n(r.pos.x,r.pos.z)&&this.hud.flashBang(1-i/Wh),this.particles.burst(e,.5,t,{count:18,color:16777215,speed:6,up:3,life:.25,size:.12,gravity:2}),this.boomLight&&(this.boomLight.position.set(e,1.6,t),this.boomT=.2);let a=this.soundAt(e,t,14);X.flashbang(a.vol,a.pan),this.noise(e,t,26)}updateDevices(e){this.gadgetHintT=Math.max(0,this.gadgetHintT-e);for(let t of this.mines)if(t.update(e),t.armed&&!t.done){for(let e of this.enemies)if(e.alive&&Math.hypot(e.pos.x-t.x,e.pos.z-t.z)<1.3){t.done=!0;break}for(let e of this.tanks)e.alive&&Math.hypot(e.x-t.x,e.z-t.z)<1.3+e.radius&&(t.done=!0);t.done&&this.explode(t.x,t.z,Kp,150,`player`)}if(this.mines.some(e=>e.done)){for(let e of this.mines)e.done&&this.scene.remove(e.group);this.mines=this.mines.filter(e=>!e.done)}for(let t of this.drones)t.update(e);if(this.drones.some(e=>e.phase===`done`)){for(let e of this.drones)e.phase===`done`&&this.scene.remove(e.group,e.marker);this.drones=this.drones.filter(e=>e.phase!==`done`)}}enemyKilled(e){this.stats.kills++;let t=this.player,n=t.inv,r=[];if(Math.random()<Math.min(.7,e.def.medkitChance*(t.hp<t.maxHp*.4?1.6:1))&&r.push({kind:`medkit`,heal:35}),Math.random()<.22){let t=new Yd(Ud[e.def.dropWeapon],Jh());t.mag=Math.max(1,Math.round(t.stats.magSize*(.4+Math.random()*.6))),r.push({kind:`weapon`,weapon:t})}if(Math.random()<.5){let t=n.primaries.map(e=>e?.def.ammo).filter(e=>!!e),i=t.length?t[Math.floor(Math.random()*t.length)]:Ud[e.def.dropWeapon].ammo??`light`;r.push({kind:`ammo`,ammo:i,amount:Math.max(1,Math.round(Wd[i].box*(.5+Math.random()*.5)))})}Math.random()<.1&&r.push({kind:`grenade`,count:1}),r.forEach((t,n)=>{let i=n/Math.max(1,r.length)*Math.PI*2+Math.random(),a=e.pos.x+Math.cos(i)*.55*Math.min(1,n),o=e.pos.z+Math.sin(i)*.55*Math.min(1,n);this.map.solid(Math.floor(a),Math.floor(o))&&(a=e.pos.x,o=e.pos.z),this.pickups.spawn(t,a,o,t.kind===`weapon`?90:60)});let i=this.enemies.filter(e=>e.alive).length;i===0?this.hud.toast(`Alle Gegner ausgeschaltet!`,4):this.hud.toast(`Gegner ausgeschaltet – noch ${i}`,1.6)}render(e,t){let n=this.player;n.render(e,t);let r=n.model.root.position.x,i=n.model.root.position.z,a=n.weapon.stats.viewBonus,o=0,s=0;if(n.aiming){let e=this.input.state.aim===`point`?Math.min(4+a*.4,this.aimDist*.3):3+a*.3;o=n.aim.x*e,s=n.aim.z*e}else n.speed>.5&&(o=n.vel.x/Af*1.5,s=n.vel.z/Af*1.5);this.renderIntro()||this.camera.update(t,r,i,o,s),this.sun.position.set(r+9,18,i+6),this.sun.target.position.set(r,0,i),this.boomLight&&(this.boomT=Math.max(0,this.boomT-t),this.boomLight.intensity=this.boomT>0?120*(this.boomT/.28):0),this.fog.smooth(t),this.mapView?.roofs?.update(r,i,t>0?t:1);let c=this.mapView?.water;c&&c.offset.set(this.time*.012,Math.sin(this.time*.6)*.03);for(let e of this.dummies)e.render(t);for(let n of this.enemies)n.inSight=this.fog.visibleAt(n.pos.x,n.pos.z)>Ih,n.render(e,t);this.pickups.render(t);for(let e of this.checkpoints)e.render(t);for(let e of this.destructibles)e.render(t);let l=null;for(let n of this.tanks)n.inSight=this.fog.visibleAt(n.x,n.z)>Ih,n.render(e,t),n.alive&&n.alerted&&n.def.boss&&(l=n);this.hud.bossBar(l?l.def.name:``,l?l.hp/l.def.hp:0),this.updateObjectiveView(t),this.smoke.update(t),this.grenades.render(e,this.time),this.minimap.update(t,n,this.enemies,this.pickups.list,this.objTarget),this.bullets.render(e),this.particles.update(t),this.muzzle.update(t),this.updateAimLine(r,i),this.updateHud(t),this.renderer.render(this.scene,this.camera.cam)}updateObjectiveView(e){let t=this.objectives,n=this.map.mission,r=this.objectiveWorld(),i=t.current,a=``;if(n&&i){let e=t.progress(i,r,this.tagTotals());a=`▶ ${i.text}${e?` (${e})`:``}`}else n&&t.complete&&(a=`✔ Alle Hauptziele erfüllt`);let o=t.sideDone.filter(Boolean).length,s=n&&n.side.length?`Nebenziele ${o}/${n.side.length}`:``;this.hud.setObjective(a,s);let c=i?Ph.target(i,r):null;if(this.objTarget=c,this.beacon.visible=!!c,c){this.beacon.position.set(c.x,0,c.z),this.beacon.rotation.y+=e*.8;let t=1+Math.sin(this.time*4)*.06;if(this.beacon.children[0].scale.setScalar(t),this.tmp.set(c.x,.5,c.z).project(this.camera.cam),Math.abs(this.tmp.x)<.95&&Math.abs(this.tmp.y)<.95&&this.tmp.z<1)this.hud.objectiveArrow(0,0,0,!1);else{let e=window.innerWidth,t=window.innerHeight,n=this.tmp.x,r=-this.tmp.y;this.tmp.z>1&&(n=-n,r=-r);let i=Math.max(Math.abs(n)/.88,Math.abs(r)/.82,.001),a=(n/i+1)/2*e,o=(r/i+1)/2*t;this.hud.objectiveArrow(a,o,Math.atan2(n*e,-r*t),!0)}}else this.hud.objectiveArrow(0,0,0,!1)}objTarget=null;updateAimLine(e,t){let n=this.player,r=this.input.device!==`kbm`&&n.aiming&&!n.dead&&!this.grenadeThrow;if(this.aimLine.visible=r,!r)return;let i=n.muzzle(n.facing),a=i.x-n.pos.x+e,o=i.z-n.pos.z+t,s=Math.min(14,n.weapon.stats.range),c=Md(this.map.blocksShot,a,o,a+Math.sin(n.facing)*s,o+Math.cos(n.facing)*s);this.aimLine.position.set(a,i.y,o),this.aimLine.rotation.y=n.facing,this.aimLine.scale.z=c?Math.max(.05,c.t*s):s}updateHud(e){let t=this.player,n=t.inv,r=t.weapon,a=r.stats;if(this.hud.update({hp:t.hp,maxHp:t.maxHp,armor:t.armor,maxArmor:t.maxArmor,weaponName:r.def.name,rarityColor:Gd[r.rarity].color,attIcons:[...r.attachments].map(e=>Kd[e].icon).join(``),slots:n.slots().map(e=>({label:e.w?e.w.def.short:``,active:e.active,color:e.w?Gd[e.w.rarity].color:``})),grenades:n.grenades,gear:[`helmet`,`vest`,`boots`].map(e=>n.gear[e]).filter(e=>e!==null).map(e=>({icon:e.icon,title:`${e.name}: ${e.desc}`})),gadget:n.gadget?{icon:$d[n.gadget.id].icon,name:$d[n.gadget.id].name,count:n.gadget.count}:null,mag:r.mag,magSize:a.magSize,reserve:n.reserve(r),reload:r.reloading?1-r.reloadT/(a.reloadTime*this.reloadMul):-1,fps:this.fps,showFps:i.showFps,res:this.resScale},e),this.tmp.set(t.model.root.position.x,1,t.model.root.position.z).project(this.camera.cam),this.hud.setPlayerScreen((this.tmp.x+1)/2*window.innerWidth,(1-this.tmp.y)/2*window.innerHeight),this.touch.setReloadState(r.mag<=Math.ceil(a.magSize*.25),r.reloading),this.touch.setGrenades(n.grenades),this.touch.setGadget(n.gadget?$d[n.gadget.id].icon:``,n.gadget?.count??0),this.input.device===`kbm`){let e=4+Math.tan(this.spreadNow)*this.aimDist*this.camera.pxPerMeter(window.innerHeight);this.hud.crosshair(this.input.mouseX,this.input.mouseY,e,this.input.hasMouse&&!this.grenadeThrow)}else this.hud.crosshair(0,0,0,!1)}},Xh=`
  <h4>Tastatur &amp; Maus</h4>
  <table>
    <tr><td><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></td><td>Bewegen</td></tr>
    <tr><td>Maus</td><td>Zielen</td></tr>
    <tr><td>Linke Maustaste</td><td>Schießen</td></tr>
    <tr><td>Rechte Maustaste</td><td>Genau zielen (weniger Streuung)</td></tr>
    <tr><td><kbd>R</kbd></td><td>Nachladen</td></tr>
    <tr><td><kbd>Shift</kbd></td><td>Sprinten (gedrückt halten)</td></tr>
    <tr><td><kbd>C</kbd> / <kbd>Strg</kbd></td><td>Ducken an/aus</td></tr>
    <tr><td><kbd>E</kbd></td><td>Waffe/Ausrüstung aufheben, Checkpoint aktivieren</td></tr>
    <tr><td><kbd>F</kbd></td><td>Gadget benutzen (Würfe und Drohne zielen auf den Mauszeiger)</td></tr>
    <tr><td><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>, Mausrad, <kbd>Q</kbd></td><td>Waffe wechseln (1 und 2 = Hauptwaffen, 3 = Pistole)</td></tr>
    <tr><td><kbd>G</kbd> halten</td><td>Granate zielen (Wurfbahn folgt der Maus), loslassen = werfen</td></tr>
    <tr><td><kbd>M</kbd> / <kbd>Tab</kbd></td><td>Große Karte an/aus</td></tr>
    <tr><td><kbd>Esc</kbd> / <kbd>P</kbd></td><td>Pause</td></tr>
  </table>`,Zh=`
  <h4>Touch</h4>
  <table>
    <tr><td>Linke Bildschirmhälfte</td><td>Bewegen: Daumen auflegen, der Stick erscheint dort.</td></tr>
    <tr><td>Linken Stick weit über den Rand ziehen</td><td>Sprinten (der Ring wird gelb)</td></tr>
    <tr><td>Rechte Bildschirmhälfte</td><td>Zielen. Ab dem roten Ring wird automatisch geschossen.</td></tr>
    <tr><td>↻ (über dem rechten Stick)</td><td>Nachladen – geht jederzeit, auch bei halbvollem Magazin. Pulsiert rot, wenn das Magazin fast leer ist.</td></tr>
    <tr><td>⤓</td><td>Ducken an/aus</td></tr>
    <tr><td>Waffenanzeige antippen</td><td>Waffe wechseln</td></tr>
    <tr><td>E „Nehmen“ / „Funken“</td><td>erscheint neben Waffe/Ausrüstung bzw. an einem Checkpoint</td></tr>
    <tr><td>Gadget-Button (unter der Granate)</td><td>Gadget benutzen: wirft/fliegt geradeaus in Blickrichtung</td></tr>
    <tr><td>◉ Granate</td><td>gedrückt halten und in Wurfrichtung ziehen (weiter ziehen = weiter werfen), loslassen = werfen. Ohne Ziehen fliegt sie 8 m nach vorn.</td></tr>
    <tr><td>Minimap oben links antippen</td><td>Große Karte an/aus</td></tr>
    <tr><td>❚❚</td><td>Pause</td></tr>
  </table>
  <p>Größe der Sticks und Buttons stellst du in den Optionen ein.</p>`,Qh=`
  <h4>Gamepad</h4>
  <table>
    <tr><td>Linker Stick</td><td>Bewegen (Stick drücken = Sprinten)</td></tr>
    <tr><td>Rechter Stick</td><td>Zielen</td></tr>
    <tr><td>RT</td><td>Schießen</td></tr>
    <tr><td>LT</td><td>Genau zielen</td></tr>
    <tr><td>X</td><td>Nachladen</td></tr>
    <tr><td>B</td><td>Ducken an/aus</td></tr>
    <tr><td>A</td><td>Aufheben, Checkpoint aktivieren</td></tr>
    <tr><td>RB</td><td>Gadget benutzen</td></tr>
    <tr><td>Y</td><td>Waffe wechseln</td></tr>
    <tr><td>LB halten</td><td>Granate zielen (9 m in Blickrichtung), loslassen = werfen</td></tr>
    <tr><td>Back / Select</td><td>Große Karte an/aus</td></tr>
    <tr><td>Start</td><td>Pause</td></tr>
  </table>`,$h=[{id:`controls`,title:`Steuerung`,html:e=>`<p>Das Spiel erkennt automatisch, womit du spielst, und passt die Anzeige an.</p>${(e===`touch`?[Zh,Xh,Qh]:e===`gamepad`?[Qh,Xh,Zh]:[Xh,Zh,Qh]).join(``)}`},{id:`movement`,title:`Bewegen`,html:()=>`
      <p><b>Gehen</b> ist der Normalfall: du kannst dabei frei zielen und schießen.</p>
      <p><b>Sprinten</b> ist schneller, aber Schießen bricht den Sprint ab.</p>
      <p><b>Ducken</b> macht dich langsamer, dafür streut deine Waffe weniger und Gegner bemerken dich
        langsamer. <b>Geduckt hinter Kisten</b> sieht dich niemand. Sprinten beendet das Ducken.</p>
      <p><b>Sprintschritte</b> sind in der Nähe zu hören (etwa 6 m).</p>
      <p>Bist du hinter einer Wand verdeckt, siehst du deine Figur als <span class="cyan">blaue Silhouette</span>.</p>
      <p><b>Kisten</b> sind halbhohe Deckung: Man kann nicht hindurchlaufen, und sie halten Kugeln auf.</p>`},{id:`shooting`,title:`Schießen`,html:()=>`
      <p>Kugeln fliegen sichtbar als Leuchtspur und werden von Wänden und Kisten gestoppt.</p>
      <p><b>Streuung:</b> Jeder Schuss vergrößert sie kurz. Am Fadenkreuz siehst du, wie weit sie gerade ist.
        Im Laufen streut die Waffe stärker, beim Ducken und genauen Zielen weniger.</p>
      <p><b>Reichweite:</b> Auf große Entfernung sinkt der Schaden.</p>
      <p><b>Halbautomatik:</b> Mit der Maus feuert die Pistole einen Schuss pro Klick. Auf dem Handy und
        mit dem Gamepad schießt sie automatisch weiter, solange du zielst.</p>
      <p><b>Nachladen:</b> Ist das Magazin leer, lädt die Waffe beim nächsten Abzug selbst nach.
        Die Pistole hat unbegrenzte Reservemunition. Ist eine Waffe ganz leer, wechselst du automatisch zur Pistole.</p>
      <p><b>Zielhilfe</b> (Touch &amp; Gamepad, abschaltbar): Liegt ein Ziel knapp neben deiner Zielrichtung,
        richtet sich die Waffe darauf aus.</p>`},{id:`weapons`,title:`Waffen`,html:()=>`
      <p>Du trägst <b>zwei Hauptwaffen und die Pistole</b>. Hebst du eine Waffe auf, ersetzt sie die Hauptwaffe in
        deiner Hand (bzw. die zuletzt benutzte); die alte bleibt am Boden liegen. Nach einem Wechsel kannst du
        kurz nicht schießen.</p>
      <table>
        <tr><td>Pistole</td><td>unbegrenzte Munition, ein Schuss pro Klick</td></tr>
        <tr><td>Maschinenpistole</td><td>sehr schnell, kurze Reichweite</td></tr>
        <tr><td>Sturmgewehr</td><td>Allrounder, genau und kräftig</td></tr>
        <tr><td>Schrotflinte</td><td>8 Schrotkugeln pro Schuss, verheerend aus der Nähe, auf Distanz schwach</td></tr>
        <tr><td>Präzisionsgewehr</td><td>sehr starker Einzelschuss, <b>durchschlägt einen Gegner</b>, ideal mit genauem Zielen</td></tr>
        <tr><td>Leichtes MG</td><td>großes Magazin, langes Nachladen, macht dich etwas langsamer</td></tr>
        <tr><td>Raketenwerfer</td><td>explodiert beim Einschlag (Flächenschaden), auch <b>du</b> nimmst Schaden, wenn du zu nah bist</td></tr>
        <tr><td>Flammenwerfer</td><td>nur wenige Meter Reichweite, trifft alle Gegner im Strahl</td></tr>
      </table>
      <p><b>Seltenheit:</b> Waffen gibt es in <b>Standard</b>, <b style="color:#4aa3e8">Verbessert</b> und
        <b style="color:#e8b34a">Elite</b> – mehr Schaden, weniger Streuung, schnelleres Nachladen
        (Elite auch größeres Magazin). Verbesserte und Elite-Waffen leuchten mit einem Lichtstrahl.</p>
      <p>Im Testgelände steht am Eingang des Schießstands ein <b>Waffenständer</b> mit jeder Waffe.</p>`},{id:`items`,title:`Ausrüstung`,html:()=>`
      <p>Alles außer Waffen wird <b>automatisch</b> aufgesammelt, wenn du darüberläufst.</p>
      <h4>Munition</h4>
      <p>Fünf Sorten, erkennbar an der Farbe der Kiste: <span style="color:#d9b84a">Pistolen-/MP-Munition</span>,
        <span style="color:#7fb85a">Gewehrmunition</span> (Sturmgewehr, Präzisionsgewehr, MG),
        <span style="color:#e05a4b">Schrotpatronen</span>, Raketen und <span style="color:#e67e22">Brennstoff</span>.
        Jede Sorte hat einen Höchstvorrat; volle Sorten bleiben liegen. Hebst du eine Waffe auf, für die du noch
        nichts hast, bekommst du eine Kiste dazu.</p>
      <h4>Aufsätze</h4>
      <table>
        <tr><td>◎ Zielfernrohr</td><td>+6 m Sichtweite im Fog, genauer beim Zielen</td></tr>
        <tr><td>≋ Schalldämpfer</td><td>Gegner hören deine Schüsse kaum noch</td></tr>
        <tr><td>▮ Großes Magazin</td><td>+50 % Schuss pro Magazin</td></tr>
        <tr><td>⟂ Griff</td><td>weniger Streuung und Rückstoß</td></tr>
      </table>
      <p>Ein Aufsatz kommt an die Waffe in deiner Hand, sonst an eine andere passende. Passt er an keine, bleibt er liegen.
        Montierte Aufsätze siehst du als Symbole neben dem Waffennamen.</p>
      <h4>Granaten</h4>
      <p>Höchstens 4. Beim Zielen zeigt eine Punktlinie die Flugbahn und ein oranger Kreis den Explosionsradius.
        Granaten prallen von Wänden ab, fliegen über Kisten und explodieren knapp 2 Sekunden nach dem Wurf.
        Auch du nimmst Schaden, wenn du zu nah stehst. Wände schützen vor der Explosion.</p>
      <h4>Schutzausrüstung</h4>
      <p>Drei Plätze; ein neues Teil ersetzt das alte (es bleibt liegen). Aufheben mit <kbd>E</kbd> / „Nehmen“.
        Angelegte Teile siehst du als Symbole unter der Lebensleiste.</p>
      <table>
        <tr><td>⛑ Leichter Helm / Gefechtshelm</td><td>−10 % / −20 % Schaden (Gefechtshelm etwas langsamer)</td></tr>
        <tr><td>▣ Leichte / Schwere Weste</td><td>50 / 100 Rüstung (schwere Weste langsamer). Rüstung fängt zwei Drittel jedes Treffers ab, bis sie aufgebraucht ist.</td></tr>
        <tr><td>⟫ Laufschuhe / Leise Sohlen</td><td>+8 % Tempo / Sprintschritte kaum hörbar</td></tr>
        <tr><td>Panzerplatte</td><td>+25 Rüstung (nur mit Weste)</td></tr>
      </table>
      <h4>Gadgets</h4>
      <p>Du trägst eine Sorte Gadgets mit mehreren Ladungen. Gleiche Sorte wird automatisch aufgefüllt;
        eine andere Sorte tauschst du mit <kbd>E</kbd>. Benutzen mit <kbd>F</kbd> bzw. dem Gadget-Button.</p>
      <table>
        <tr><td>✚ Sanitätstasche</td><td>heilt sofort 40 Leben (max. 3)</td></tr>
        <tr><td>☁ Rauchgranate</td><td>Rauchwolke für ~10 s: weder du noch Gegner sehen hindurch</td></tr>
        <tr><td>✶ Blendgranate</td><td>betäubt Gegner in 7 m für ~3 s (sie sehen und schießen nicht). Nicht selbst hineinschauen!</td></tr>
        <tr><td>⊗ Mine</td><td>wird vor deine Füße gelegt, nach 1 s scharf, explodiert bei Gegnern (max. 3 gleichzeitig)</td></tr>
        <tr><td>✈ Aufklärungsdrohne</td><td>fliegt bis 22 m zum Ziel und deckt dort 8 s lang 9 m im Umkreis auf</td></tr>
      </table>
      <h4>Beute</h4>
      <p>Gefallene Gegner lassen manchmal Medipacks, Munition (meist für deine Waffen), Granaten oder ihre Waffe fallen.
        Beute verschwindet nach einiger Zeit (blinkt vorher).</p>`},{id:`campaign`,title:`Kampagne & Ziele`,html:()=>`
      <p>Im Titelmenü startest du die <b>Kampagne</b> (Mission 1: Küstenlandung, 2: Dorf, 3: Wald, 4: Industriegebiet, 5: Ruinenstadt, 6: Bergfestung – das Finale mit Panzer) oder das <b>Testgelände</b> zum Ausprobieren.</p>
      <p>Vor jeder Kampagnenmission gibt es eine <b>Einsatzbesprechung</b>: Lage, Haupt- und Nebenziele, Anzahl der Feinde
        und eine Übersichtskarte mit Start (grün), Hauptzielen (gelb, nummeriert), Nebenzielen (orange) und Checkpoints (blau).</p>
      <p>Beim Start der Mission folgt ein kurzes <b>Einsatz-Intro</b>: Die Kamera fliegt mit Funkspruch über alle Hauptziele
        und zurück zu dir. Tippen oder eine beliebige Taste überspringt es. Beim Neustart vom Checkpoint gibt es kein Intro.</p>
      <p><b>Hauptziele</b> stehen oben in der Mitte und werden nacheinander erledigt. Ein gelber Leuchtring markiert das Ziel,
        ein gelber Pfeil am Bildrand zeigt die Richtung, auf der Minimap ist es ein gelber Stern.</p>
      <p><b>Nebenziele</b> (z. B. Flak-Stellungen zerstören, alle Gegner ausschalten) sind freiwillig und erscheinen in der Auswertung.</p>
      <p><b>Zerstörbare Objekte:</b> Rote <b>Explosivfässer</b> gehen nach wenigen Treffern hoch – auch neben Gegnern und als
        Kettenreaktion. Munitionslager und Flak-Stellungen halten mehr aus; Raketen und Granaten wirken am besten.</p>
      <p><b>Wasser</b> kann man nicht betreten, aber darüber schießen und sehen. <b>Sandsäcke</b> sind niedrige Deckung wie Kisten.</p>
      <p><b>Bäume</b> blockieren alles wie Wände (auch Granaten). <b>Büsche</b> kann man durchqueren und durchschießen, man sieht aber
        nur etwa 2,5 m hinein. Im Busch wirst du langsamer entdeckt – und <b>geduckt im Busch</b> sieht dich niemand, der nicht
        direkt neben dir steht.</p>
      <p>Sind alle Hauptziele erfüllt, folgt die Auswertung mit Zeit, Abschüssen, Treffsicherheit und Nebenzielen.
        Nach der Bergfestung ist die Kampagne abgeschlossen – im Lager kannst du jede Mission wiederholen.</p>
      <h4>Lager</h4>
      <p>Nach jeder Kampagnenmission gibt es <b>Credits</b>: 150 für die Mission, 10 je Abschuss, 75 je Nebenziel und 60 Zeitbonus
        unter 8 Minuten. Im Lager kaufst du dafür dauerhafte <b>Upgrades</b> (je 3 Stufen):</p>
      <table>
        <tr><td>♥ Zähigkeit</td><td>+15 max. Leben pro Stufe</td></tr>
        <tr><td>▤ Patronengurt</td><td>+25 % Munitionsvorrat pro Stufe</td></tr>
        <tr><td>↻ Schnellladen</td><td>−10 % Nachladezeit pro Stufe</td></tr>
        <tr><td>◉ Granatentasche</td><td>+1 Granatenplatz pro Stufe</td></tr>
      </table>
      <p>Deine <b>Waffen, Munition, Schutzausrüstung und Gadgets</b> nimmst du in die nächste Mission mit; die Weste wird
        aufgefüllt, du startest mit vollem Leben und mindestens 2 Granaten. Geschaffte Missionen kannst du im Lager wiederholen
        (Bestzeit wird gespeichert). Das Testgelände nutzt keine Upgrades.</p>`},{id:`checkpoints`,title:`Checkpoints`,html:()=>`
      <p><b>Funkgeräte mit Fahne</b> sind Checkpoints. Stell dich daneben und drück <kbd>E</kbd> bzw. „Funken“.</p>
      <p>Dabei wird gespeichert: deine Waffen, Munition, Ausrüstung und Gadgets, ausgeschaltete Gegner,
        aufgesammelte Gegenstände und die erforschte Karte. Außerdem bekommst du 40 Leben zurück.</p>
      <p>Aktive Checkpoints haben eine <span class="grn">grüne Fahne</span>. Du kannst sie später erneut benutzen,
        um den Stand zu aktualisieren.</p>
      <p><b>Nach dem Tod</b> geht es am letzten Checkpoint weiter – mit der Ausrüstung von dort. Gegner, die du
        erst danach ausgeschaltet hast, sind wieder da.</p>
      <p>Der Stand bleibt im Browser gespeichert: Im Titelmenü kannst du mit <b>Fortsetzen</b> weiterspielen.
        „Neues Spiel“ bzw. „Karte neu starten“ verwirft ihn.</p>`},{id:`sight`,title:`Sicht & Karte`,html:()=>`
      <p><b>Fog of War:</b> Du siehst nur, was deine Figur wirklich sehen kann.</p>
      <table>
        <tr><td>Hell</td><td>gerade sichtbar: Gelände, Gegner, Gegenstände</td></tr>
        <tr><td>Abgedunkelt</td><td>schon erforscht: Gelände ja, aber <b>keine Gegner</b></td></tr>
        <tr><td>Schwarz</td><td>noch unerforscht</td></tr>
      </table>
      <p><b>Blickkegel:</b> In Zielrichtung siehst du etwa 18 m weit, rundum (auch nach hinten) etwa 6 m.
        Wände blockieren die Sicht, über Kisten kannst du hinwegsehen, durch Rauch nicht.
        Ein <b>Zielfernrohr</b> verlängert die Sicht, eine <b>Drohne</b> deckt ein Gebiet zusätzlich auf.</p>
      <p><b>Dächer</b> blenden aus, sobald du ein Gebäude betrittst – dann siehst du hinein. Fahrzeuge, Container,
        Zelte und Silos sind Hindernisse: niedrige (Fahrzeuge, Heuballen) geben Deckung wie Kisten, hohe (Container, Zelte, Silos)
        blockieren auch die Sicht. Durch Zäune, Stacheldraht und Panzersperren kommst du nicht hindurch, kannst aber darüber schießen.</p>
      <p><b>Niedrige Bruchsteinmauern</b> um Gärten, Weiden und Friedhöfe geben Deckung wie Sandsäcke – du (und die Gegner)
        könnt darüber schießen und hinübersehen. <b>Ruinen</b> zerschossener Häuser haben kein Dach und viele Lücken in den Wänden.
        <b>Hecken</b> und Büsche kann man durchqueren, sie verdecken aber die Sicht.</p>
      <p><b>Fenster</b> in den Häusern: Hindurchgehen geht nicht, aber du kannst hinaus- und hineinschießen und hindurchsehen –
        das gilt auch für Gegner im Haus. Fenster sind also keine Deckung!</p>
      <p><b>Schussmarker:</b> Schießt ein Gegner, den du nicht siehst, erscheint ein <span class="ora">oranger Ring</span>
        dort, woher der Schuss kam (oder am Bildrand in dieser Richtung).</p>
      <p><b>Minimap</b> oben links: zeigt erforschte Bereiche, dich als Pfeil, sichtbare Gegner als
        <span class="red">rote Punkte</span> und Gegenstände als <span class="grn">grüne Punkte</span>.
        Mit <kbd>M</kbd> oder durch Antippen öffnest du die große Karte mit dem ganzen Gelände.</p>`},{id:`enemies`,title:`Gegner`,html:()=>`
      <p><b>Schütze</b> (grau): hält Abstand, schießt in kurzen Feuerstößen mit dem Sturmgewehr, weicht seitlich aus.</p>
      <p><b>Sturmsoldat</b> (rote Weste): rennt mit der Maschinenpistole direkt auf dich zu. Weniger genau, aber gefährlich aus der Nähe.</p>
      <p><b>Scharfschütze</b> (grüne Tarnung): sieht sehr weit und trifft hart. Solange er auf dich zielt, warnt eine
        <span class="red">rote Laserlinie</span> – raus aus der Linie oder in Deckung!</p>
      <p><b>MG-Stellung</b>: bewegt sich nicht, feuert lange Salven. Von der Seite oder mit Granaten angehen.</p>
      <p><b>Granatwerfer</b> (gelbe Weste): wirft Granaten – auch hinter Deckung an die Stelle, wo er dich zuletzt gesehen hat.
        Ein <span class="red">roter Kreis</span> zeigt, wo sie explodiert.</p>
      <p><b>Schwerer</b> (groß, dunkel): sehr viel Leben, nimmt weniger Schaden, langsam, mit MG. Lässt oft ein Medipack fallen.</p>
      <h4>Jeep mit MG</h4>
      <p>Fährt im Dorf, im Industriegebiet und in der Bergfestung Streife. Der Schütze hinten <b>schwenkt sein MG schnell</b>
        in jede Richtung – Umrunden hilft hier nicht. Sieht er dich, wird der Jeep langsamer und feuert Salven.
        Er ist leicht gepanzert: <b>Kugeln wirken</b> (rund anderthalb Magazine Sturmgewehr), aber <b>zwei Granaten oder eine Rakete</b>
        erledigen ihn viel schneller. Minen zünden unter ihm, das Wrack explodiert kurz. Hinter Wänden bist du sicher.</p>
      <h4>Boss: Leichter Panzer</h4>
      <p>Fährt eine feste Runde ab. Sobald er dich bemerkt, erscheint oben seine <span class="red">Lebensleiste</span>.
        <b>Kugeln prallen fast wirkungslos ab</b>, Flammen machen wenig Schaden – nur <b>Raketen, Granaten, Minen</b> und
        explodierende Fässer richten wirklich etwas aus. Minen zünden, wenn er darüberfährt.</p>
      <p><b>Kanone:</b> Bevor er schießt, bleibt er stehen und eine <span class="red">rote Laserlinie</span> zeigt auf dich.
        Kurz vor dem Schuss bleibt der Zielpunkt fest – lauf seitlich weg, die Granate explodiert dort, wo du eben noch standest.
        Hinter Wänden und Kisten bist du geschützt.</p>
      <p><b>MG:</b> Auf kurze Distanz feuert er Salven in Turmrichtung. Der <b>Turm dreht sich langsam</b> – wer ihn
        umrundet, bekommt Zeit zum Nachladen.</p>
      <h4>Was Gegner wahrnehmen</h4>
      <p><b>Sehen:</b> Gegner sehen in einem Kegel nach vorn, nicht durch Wände. Wer dich nur kurz sieht, wird
        misstrauisch <span class="yel">?</span>. Siehst du ihn länger oder näher, entdeckt er dich <span class="red">!</span>.
        Ganz nah bemerkt dich jeder sofort.</p>
      <p><b>Hören:</b> Schüsse sind weit zu hören. Gegner laufen zum Geräusch und suchen dort.</p>
      <p><b>Funk:</b> Entdeckt dich ein Gegner, alarmiert er Kameraden in der Nähe.</p>
      <p><b>Getroffen:</b> Wer angeschossen wird, weiß sofort, woher der Schuss kam.</p>
      <h4>Kampfverhalten</h4>
      <p><b>Fair:</b> Gegner schießen nur, wenn sie selbst auf deinem Bildschirm zu sehen sind.
        Sehen sie dich von weiter weg, rücken sie erst näher.</p>
      <p>Gegner brauchen einen Moment, bis sie zum ersten Mal schießen, und treffen genauer, je länger sie dich sehen.
        Verlieren sie dich aus den Augen, laufen sie zur letzten bekannten Position, suchen die Umgebung ab
        und kehren danach auf ihren Posten zurück.</p>
      <p><b>Deckung:</b> Schützen, Scharfschützen und Granatwerfer suchen sich im Gefecht einen Platz hinter Kisten,
        Sandsäcken, Mauern oder Fahrzeugen. Dort laden sie nach, lehnen sich für eine Salve heraus und ziehen sich wieder zurück –
        wer dabei getroffen wird, verschwindet sofort. Tipp: Ziel auf die Stelle halten, an der er wieder auftaucht, eine Granate
        hinter die Deckung werfen oder ihn von der Seite angehen.</p>
      <p><b>Flankieren:</b> Sind mehrere Gegner im Kampf, schlägt sich einer (Schütze oder Sturmsoldat) seitlich durch und greift
        von der Flanke an. Behalte die Seiten im Blick! (Nicht auf „Leicht“.)</p>
      <p>Getroffene Gegner zeigen kurz einen Lebensbalken.</p>
      <h4>Grafik (Optionen)</h4>
      <p>Bei <b>„Automatisch“</b> passt das Spiel die Auflösung selbst an: Ruckelt es, wird das Bild in Stufen bis auf 55 %
        heruntergerechnet, läuft es wieder flüssig, steigt die Auflösung langsam zurück. Mit „FPS anzeigen“ siehst du den
        aktuellen Wert (z. B. „58 FPS · 80 %“). Bei Niedrig/Mittel/Hoch bleibt die Auflösung fest.</p>
      <h4>Musik (Optionen)</h4>
      <p>Leise Hintergrundmusik in d-Moll: ruhige Streicher beim Erkunden; sobald Gegner dich suchen oder angreifen,
        kommen Cello, Trommeln und Bläser dazu. Im Pausenmenü wird sie leiser. Die Lautstärke stellst du unter
        Optionen → Musik ein (0 = aus).</p>
      <p><b>Umgebungsgeräusche</b> je Karte: Wind, Brandung am Strand, Vögel (sie verstummen im Gefecht), Blätterrauschen im Wald,
        Maschinenbrummen im Industriegebiet und fernes Geschützfeuer von der Front. Sie folgen der Gesamtlautstärke.</p>
      <h4>Schwierigkeit (Optionen)</h4>
      <table>
        <tr><td>Leicht</td><td>Gegner hören Schüsse nur in knapp halber Entfernung, Funk erreicht 6 m, höchstens 2 feuern gleichzeitig, 60 % Schaden, kein Flankieren</td></tr>
        <tr><td>Normal</td><td>Hörweite 60 %, Funk 9 m, höchstens 3 feuern gleichzeitig, 80 % Schaden</td></tr>
        <tr><td>Schwer</td><td>volle Hörweite, Funk 14 m, alle feuern gleichzeitig, voller Schaden</td></tr>
      </table>`},{id:`damage`,title:`Schaden & Tod`,html:()=>`
      <p>Wirst du getroffen, zeigt ein <b>roter Bogen</b> um die Bildmitte die Richtung des Schützen.
        Der Bildrand färbt sich rot und pulsiert, wenn du unter 30 % Leben hast.</p>
      <p>Eine Kugel, die knapp vorbeifliegt, hörst du zischen.</p>
      <p>Leben regeneriert sich <b>nicht</b> von selbst.</p>
      <p><b>Medipacks</b> (weiße Box mit rotem Kreuz und grünem Ring): Gefallene Gegner lassen manchmal eins fallen,
        bei wenig Leben etwas häufiger. Drüberlaufen hebt es automatisch auf und heilt bis zu 35 Leben.
        Bei vollem Leben bleibt es liegen. Nach einer Minute verschwindet es (blinkt vorher).</p>
      <p><b>Rüstung</b> (blaue Leiste unter dem Leben) gibt es mit einer Weste; sie fängt zwei Drittel jedes Treffers ab. Ein Helm verringert jeden Schaden.</p>
      <p>Fällst du, geht es am letzten aktivierten <b>Checkpoint</b> weiter – ohne Checkpoint startet die Karte neu.</p>`},{id:`range`,title:`Testgelände`,html:()=>`
      <p>Du startest im Südwesten. Ziel: alle Gegner ausschalten. Oben wird angezeigt, wie viele noch übrig sind.</p>
      <p>Eine Wache patrouilliert vor der Kaserne, weitere Gegner sind in der Kaserne, im Hof und in der Lagerhalle.</p>
      <p>Im Südosten liegt ein <b>Schießstand</b> mit Übungspuppen zum Einschießen. Sie stehen nach vier Sekunden wieder auf.
        Am Eingang steht ein <b>Waffenständer</b> mit jeder Waffe und passender Munition.</p>
      <p>Gleich neben dem Start liegt eine Maschinenpistole. Im Gelände verteilt findest du weitere Waffen,
        Aufsätze, Granaten und Munition – die schweren Waffen liegen in der Lagerhalle.</p>
      <p>Ein Treffer zeigt kurz ein <b>Trefferkreuz</b> an. Rot heißt: Ziel ausgeschaltet.</p>`}],eg=vh.length,tg=e=>{let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${n(t.getDate())}.${n(t.getMonth()+1)}. ${n(t.getHours())}:${n(t.getMinutes())}`},ng=class{root;input;cb;screen=`none`;back=`pause`;helpPage=0;constructor(e,t,n){this.root=e,this.input=t,this.cb=n,e.addEventListener(`click`,e=>{let t=e.target.closest(`[data-act]`);t&&(X.ui(),this.act(t.dataset.act,t.dataset.arg))}),e.addEventListener(`input`,e=>this.onOption(e.target)),e.addEventListener(`change`,e=>this.onOption(e.target))}get isOpen(){return this.screen!==`none`}get current(){return this.screen}act(e,t){switch(e){case`start`:this.cb.start(t??`beach`);break;case`title`:this.cb.toTitle();break;case`camp`:this.cb.openCamp();break;case`newcampaign`:this.cb.newCampaign();break;case`mission`:this.cb.startMission(Number(t??0));break;case`launch`:this.cb.launchMission(Number(t??0));break;case`buy`:this.cb.buy(t);break;case`resume`:this.cb.resume();break;case`restart`:this.cb.saveInfo().checkpoint&&t!==`yes`?this.showConfirm():this.cb.restart();break;case`respawn`:this.cb.respawn();break;case`continue`:this.cb.continueGame();break;case`help`:this.showHelp(t?Number(t):0);break;case`options`:this.showOptions();break;case`back`:this.back===`title`?this.showTitle():this.back===`death`?this.showDeath():(this.back,this.showPause())}}open(e,t){this.root.innerHTML=`<div class="panel ${t}">${e}</div>`,this.root.classList.add(`open`)}hide(){this.screen=`none`,this.root.classList.remove(`open`),this.root.innerHTML=``}showTitle(){this.screen=`title`,this.back=`title`;let e=this.cb.saveInfo().stored,t=this.cb.campaignInfo(),n=``;e&&(n+=`<button class="primary" data-act="continue">Fortsetzen<small>Checkpoint vom ${tg(e)}</small></button>`),t.exists?n+=`<button class="${e?``:`primary`}" data-act="camp">Lager<small>Kampagne fortsetzen · Upgrades</small></button>
         <button data-act="newcampaign">Neue Kampagne<small>verwirft Fortschritt und Upgrades</small></button>`:n+=`<button class="${e?``:`primary`}" data-act="newcampaign">Kampagne<small>Mission 1: Küstenlandung</small></button>`,this.open(`<h1>TOPDOWN <span>BATTLEFIELD</span></h1>
       <p class="sub">Meilenstein 7 · Feinschliff</p>
       <div class="btns">
         ${n}
         <button data-act="start" data-arg="test">Testgelände<small>alle Waffen und Gadgets ausprobieren</small></button>
         <button data-act="help">Hilfe</button>
         <button data-act="options">Optionen</button>
       </div>
       <p class="rot-hint">Tipp: Im Querformat spielt es sich am besten.</p>`,`title`)}showPause(){this.screen=`pause`,this.back=`pause`,this.open(`<h2>Pause</h2>
       <div class="btns">
         <button class="primary" data-act="resume">Weiter</button>
         <button data-act="help">Hilfe</button>
         <button data-act="options">Optionen</button>
         ${this.cb.saveInfo().checkpoint?`<button data-act="respawn">Zum letzten Checkpoint</button>`:``}
         <button data-act="restart">Karte neu starten</button>
       </div>`,`pause`)}showMissionComplete(e){this.screen=`done`,this.back=`done`;let t=Math.floor(e.time/60),n=Math.floor(e.time%60),r=e.shots>0?Math.round(e.hits/e.shots*100):0,i=e.sideTexts.map(e=>`<tr><td>${e.done?`✔`:`✘`}</td><td>${e.text}</td></tr>`).join(``),a=e.campaignEnd,o=a?`${Math.floor(a.totalTime/60)}:${String(Math.floor(a.totalTime%60)).padStart(2,`0`)}`:``;this.open(`${a?`<h2 class="win">Kampagne abgeschlossen!</h2>
       <p class="sub">Der Panzer ist zerstört, die Bergfestung gefallen – die Front ist durchbrochen. Großartige Arbeit, Soldat!</p>
       <p class="sub">Alle ${eg} Missionen geschafft · Summe der Bestzeiten ${o} · ${a.credits} ¢ auf dem Konto.
         Im Lager kannst du jede Mission wiederholen und deine Bestzeiten verbessern.</p>
       <h4 class="reward">Letzte Mission: ${e.map}</h4>`:`<h2 class="win">Mission erfüllt</h2>
       <p class="sub">${e.map}</p>`}
       <div class="help-body"><table>
         <tr><td>Zeit</td><td>${t}:${String(n).padStart(2,`0`)}</td></tr>
         <tr><td>Abschüsse</td><td>${e.kills}</td></tr>
         <tr><td>Treffsicherheit</td><td>${r} % (${e.hits} von ${e.shots} Schüssen)</td></tr>
         <tr><td>Nebenziele</td><td>${e.sideDone} von ${e.sideTotal}</td></tr>
         ${i}
       </table></div>
       ${e.reward?`<h4 class="reward">Belohnung: ${e.reward.total} Credits</h4><div class="help-body"><table>${e.reward.parts.map(([e,t])=>`<tr><td>${e}</td><td>+${t}</td></tr>`).join(``)}</table></div>`:``}
       <div class="btns">
         ${e.reward?`<button class="primary" data-act="camp">Weiter zum Lager</button>`:`<button class="primary" data-act="title">Zum Titelmenü</button>`}
         <button data-act="restart" data-arg="yes">Mission wiederholen</button>
       </div>`,`pause`)}showBriefing(t){this.screen=`briefing`,this.back=`camp`;let n=t.map.mission,r=t.map.entities.filter(e=>e.kind===`enemy`).length,a=t.map.entities.filter(e=>e.kind===`tank`&&(e.vehicle??`tank`)===`tank`).length,o=t.map.entities.filter(e=>e.kind===`tank`&&e.vehicle===`jeep`).length,s=t.map.entities.filter(e=>e.kind===`checkpoint`).length,c=n.main.map((e,t)=>`<li><b class="num">${t+1}</b>${e.text}</li>`).join(``),l=n.side.map(e=>`<li><b class="side">◆</b>${e.text}</li>`).join(``),u=t.best===null?``:` · Bestzeit ${Math.floor(t.best/60)}:${String(Math.floor(t.best%60)).padStart(2,`0`)}`;this.open(`<p class="brief-kicker">Einsatzbesprechung · Mission ${t.index+1} von ${t.total}${u}</p>
       <h2>${t.map.name}</h2>
       <div class="brief">
         <div class="brief-map">
           <canvas></canvas>
           <p class="brief-legend"><i class="lg-start"></i>Start <i class="lg-main"></i>Hauptziel <i class="lg-side"></i>Nebenziel <i class="lg-cp"></i>Checkpoint</p>
         </div>
         <div class="brief-text">
           <p>${n.intro}</p>
           <h4 class="reward">Hauptziele</h4>
           <ol class="brief-list">${c}</ol>
           ${l?`<h4 class="reward">Nebenziele</h4><ul class="brief-list">${l}</ul>`:``}
           <h4 class="reward">Aufklärung</h4>
           <p class="brief-intel">Etwa ${r} Feinde${o?` · ${o} ${o===1?`Jeep`:`Jeeps`} mit MG`:``}${a?` · <b class="red">Boss: ${wh.name}</b>`:``} · ${s} Checkpoints<br>
             Schwierigkeit: ${e[i.difficulty]?.name??`Normal`} <small>(in den Optionen änderbar)</small></p>
         </div>
       </div>
       <div class="btns row">
         <button data-act="camp">Zurück zum Lager</button>
         <button class="primary" data-act="launch" data-arg="${t.index}">Einsatz starten</button>
       </div>`,`briefing`);let d=this.root.querySelector(`.brief-map canvas`);d&&ou(d,t.map)}showCamp(e,t){this.screen=`camp`,this.back=`camp`;let n=Object.keys(pm).map(t=>{let n=pm[t],r=e.upgrades[t],i=r>=3,a=i?0:n.cost[r],o=Array.from({length:3},(e,t)=>`<i class="${t<r?`on`:``}"></i>`).join(``);return`<div class="upg">
          <div class="upg-ico">${n.icon}</div>
          <div class="upg-txt"><b>${n.name}</b><small>${n.desc(r)}${i?``:` → ${n.desc(r+1)}`}</small><span class="pips">${o}</span></div>
          <button data-act="buy" data-arg="${t}" ${i||e.credits<a?`disabled`:``}>${i?`Max.`:`${a} ¢`}</button>
        </div>`}).join(``),r=t.findIndex((t,n)=>t.unlocked&&n>=e.next),i=t.map((t,n)=>{let i=t.best===null?``:` · Bestzeit ${Math.floor(t.best/60)}:${String(Math.floor(t.best%60)).padStart(2,`0`)}`;return t.unlocked?`<button class="${n===r?`primary`:``}" data-act="mission" data-arg="${n}">Mission ${n+1}: ${t.name}<small>${n<e.next?`geschafft`+i:`als Nächstes`}</small></button>`:`<button disabled>Mission ${n+1}: ${t.name}<small>noch gesperrt</small></button>`}).join(``),a=e.next>=t.length?`<p class="sub">★ Kampagne abgeschlossen! Wiederhole Missionen, um Credits zu sammeln und Bestzeiten zu verbessern.</p>`:``;this.open(`<h2>Lager</h2>
       <p class="credits">${e.credits} ¢ <small>Credits</small></p>
       <p class="sub">Deine Waffen, Munition, Ausrüstung und Gadgets nimmst du in die nächste Mission mit.</p>
       <div class="upgs">${n}</div>
       <h4 class="reward">Missionen</h4>
       ${a}
       <div class="btns">${i}<button data-act="title">Zum Titelmenü</button></div>`,`camp`)}showConfirm(){this.screen=`confirm`,this.back=`confirm`,this.open(`<h2>Karte neu starten?</h2>
       <p class="sub">Deine Checkpoints und der gespeicherte Stand gehen verloren.</p>
       <div class="btns">
         <button class="primary" data-act="back">Abbrechen</button>
         <button data-act="restart" data-arg="yes">Ja, neu starten</button>
       </div>`,`pause`)}showDeath(){this.screen=`death`,this.back=`death`,this.open(this.cb.saveInfo().checkpoint?`<h2 class="dead">Gefallen</h2>
       <p class="sub">Es geht am letzten Checkpoint weiter – mit der Ausrüstung von dort.</p>
       <div class="btns">
         <button class="primary" data-act="respawn">Am Checkpoint weiter</button>
         <button data-act="restart">Karte neu starten</button>
         <button data-act="help">Hilfe</button>
       </div>`:`<h2 class="dead">Gefallen</h2>
       <p class="sub">Noch kein Checkpoint aktiviert – die Karte startet neu.<br>Tipp: Funkgeräte mit E aktivieren.</p>
       <div class="btns">
         <button class="primary" data-act="restart" data-arg="yes">Neu starten</button>
         <button data-act="help">Hilfe</button>
       </div>`,`pause`)}showHelp(e=this.helpPage){this.screen=`help`,this.helpPage=Math.max(0,Math.min($h.length-1,e));let t=$h.map((e,t)=>`<button class="tab${t===this.helpPage?` on`:``}" data-act="help" data-arg="${t}">${e.title}</button>`).join(``),n=$h[this.helpPage];this.open(`<h2>Hilfe</h2>
       <nav class="tabs">${t}</nav>
       <div class="help-body">${n.html(this.input.device)}</div>
       <div class="btns row"><button data-act="back">Zurück</button></div>`,`help`)}showOptions(){this.screen=`options`;let t=(e,t,n=``)=>`<label class="opt"><span>${t}${n?`<small>${n}</small>`:``}</span>
         <input type="checkbox" data-opt="${e}" ${i[e]?`checked`:``}></label>`,n=(e,t)=>`<option value="${e}" ${i.quality===e?`selected`:``}>${t}</option>`;this.open(`<h2>Optionen</h2>
       <div class="opts">
         <label class="opt"><span>Lautstärke</span>
           <input type="range" min="0" max="1" step="0.05" data-opt="volume" value="${i.volume}"></label>
         <label class="opt"><span>Musik<small>leise Hintergrundmusik, wird im Gefecht intensiver</small></span>
           <input type="range" min="0" max="1" step="0.05" data-opt="music" value="${i.music}"></label>
         <label class="opt"><span>Grafik<small>„Automatisch“ senkt bei Ruckeln die Auflösung; Kantenglättung wirkt erst nach Neuladen</small></span>
           <select data-opt="quality">${n(`auto`,`Automatisch`)}${n(`low`,`Niedrig`)}${n(`medium`,`Mittel`)}${n(`high`,`Hoch`)}</select></label>
         <label class="opt"><span>Schwierigkeit<small>Leicht/Normal: Gegner hören weniger weit, alarmieren weniger Kameraden, feuern nicht alle gleichzeitig und treffen schwächer</small></span>
           <select data-opt="difficulty">${[`easy`,`normal`,`hard`].map(t=>`<option value="${t}" ${i.difficulty===t?`selected`:``}>${e[t].name}</option>`).join(``)}</select></label>
         ${t(`aimAssist`,`Zielhilfe`,`Touch und Gamepad`)}
         ${t(`vibration`,`Vibration`,`nur Handy`)}
         ${t(`screenShake`,`Bildschirmwackeln`)}
         ${t(`showFps`,`FPS anzeigen`)}
         <label class="opt"><span>Größe Touch-Steuerung</span>
           <input type="range" min="0.8" max="1.4" step="0.05" data-opt="touchSize" value="${i.touchSize}"></label>
       </div>
       <div class="btns row"><button data-act="back">Zurück</button></div>`,`options`)}onOption(e){let t=e.dataset.opt;if(!t)return;let n=i;n[t]=e instanceof HTMLInputElement&&e.type===`checkbox`?e.checked:e instanceof HTMLInputElement&&e.type===`range`?Number(e.value):e.value,o(),this.cb.settingsChanged()}},rg=1/60,ig=.1,$=new Yh(document.getElementById(`game`),document.getElementById(`hud`),document.getElementById(`touch`)),ag=`title`;function og(e){ag=e,document.body.classList.toggle(`playing`,e===`playing`),document.body.classList.toggle(`paused`,e===`paused`||e===`dead`||e===`done`),e!==`playing`&&($.touch.releaseAll(),$.input.releaseAll())}function sg(e){document.body.classList.remove(`dev-kbm`,`dev-touch`,`dev-gamepad`),document.body.classList.add(`dev-${e}`)}sg($.input.device),$.input.onDeviceChange(e=>{sg(e),cg.current===`help`&&cg.showHelp()});var cg=new ng(document.getElementById(`overlay`),$.input,{start(e){X.unlock(),$.input.device===`touch`&&Rl(),um(),$.startMission(e,null,null),cg.hide(),og(`playing`)},continueGame(){X.unlock(),$.input.device===`touch`&&Rl();let e=lm();$.applyUpgrades(e&&vh.includes(e.map)?ym()?.upgrades??null:null),e?$.loadSnapshot(e):$.restart(),cg.hide(),og(`playing`)},toTitle(){cg.showTitle(),og(`title`)},openCamp(){ug()},newCampaign(){um(),xm(),lg=hm(),bm(lg),dg(0)},startMission(e){dg(e)},launchMission(e){fg(e)},buy(e){let t=lg??hm();_m(t,e)&&(X.pickup(),bm(t)),lg=t,ug()},campaignInfo(){let e=ym();return{exists:!!e,next:e?.next??0}},respawn(){$.respawn(),cg.hide(),og(`playing`)},saveInfo(){return{stored:lm()?.savedAt??null,checkpoint:$.save!==null}},resume(){X.unlock(),cg.hide(),og(`playing`)},restart(){um(),$.restart(),cg.hide(),og(`playing`)},settingsChanged(){$.applySettings()}}),lg=ym();function ug(){lg??=ym()??hm(),og(`title`),cg.showCamp(lg,vh.map((e,t)=>({name:_h[e].name,unlocked:t<=lg.next,best:lg.best[e]??null})))}function dg(e){lg??=ym()??hm();let t=Math.min(e,vh.length-1),n=vh[t];og(`title`),cg.showBriefing({index:t,total:vh.length,map:yh(n),best:lg.best[n]??null})}function fg(e){X.unlock(),$.input.device===`touch`&&Rl(),lg??=ym()??hm();let t=vh[Math.min(e,vh.length-1)];um(),$.startMission(t,lg.upgrades,lg.loadout),cg.hide(),og(`playing`)}$.onMissionComplete=()=>{let e=$.objectives,t=$.map.mission;setTimeout(()=>{if(ag!==`playing`)return;um(),$.save=null,og(`done`);let n=e.sideDone.filter(Boolean).length,r=vh.indexOf($.map.id),i=null,a=null;if(r>=0){lg??=ym()??hm(),i=gm({kills:$.stats.kills,sideDone:n,time:$.stats.time}),lg.credits+=i.total,lg.next=Math.max(lg.next,r+1),lg.loadout=$.player.inv.save();let e=lg.best[$.map.id];if((e===void 0||$.stats.time<e)&&(lg.best[$.map.id]=$.stats.time),bm(lg),r===vh.length-1){let e=lg;a={totalTime:vh.reduce((t,n)=>t+(e.best[n]??0),0),credits:e.credits}}}cg.showMissionComplete({reward:i,campaignEnd:a,map:$.map.name,time:$.stats.time,shots:$.stats.shots,hits:$.stats.hits,kills:$.stats.kills,sideDone:e.sideDone.filter(Boolean).length,sideTotal:t.side.length,sideTexts:t.side.map((t,n)=>({text:t.text,done:e.sideDone[n]}))})},1200)};function pg(){ag===`playing`&&(og(`paused`),cg.showPause())}cg.showTitle(),og(`title`),document.addEventListener(`visibilitychange`,()=>{document.hidden?(pg(),$.autosave(),X.suspend()):X.resume()}),window.addEventListener(`resize`,()=>$.resize()),window.visualViewport?.addEventListener(`resize`,()=>$.resize());var mg=performance.now(),hg=0,gg=0,_g=0,vg=window.devicePixelRatio;function yg(e){let t=Math.min(ig,(e-mg)/1e3);mg=e,gg++,_g+=t,_g>=.5&&($.fps=gg/_g,gg=0,_g=0),$.adaptResolution(t,ag===`playing`);let n=ag===`playing`?$.combatLevel():0;if(f.update(t,n,ag===`paused`?.55:1),h.update(ag===`playing`||ag===`paused`||ag===`dead`?$.map.id:null,n,ag!==`playing`),ag===`playing`&&$.player.dead&&$.player.deadT>1.6&&(og(`dead`),cg.showDeath()),ag===`playing`){if($.input.consume(`pause`))pg();else for(hg+=t;hg>=rg;)$.tick(rg),hg-=rg}else $.input.poll(),ag===`paused`&&$.input.consume(`pause`)&&(cg.current===`pause`?(cg.hide(),og(`playing`)):cg.showPause()),$.input.endTick(),hg=0;window.devicePixelRatio!==vg&&(vg=window.devicePixelRatio,$.resize()),$.render(ag===`playing`?hg/rg:1,ag===`playing`?t:0),requestAnimationFrame(yg)}requestAnimationFrame(yg),window.game=$;for(let e of[`pointerdown`,`keydown`])window.addEventListener(e,()=>X.unlock(),{once:!0,capture:!0});