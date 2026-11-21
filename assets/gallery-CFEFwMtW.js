import{a as e,c as t,i as n,l as r,n as i,o as a,r as o,s,t as c}from"./three.module-CuQUf3HT.js";import{d as l,i as u,u as d}from"./scroll-DAB-fYR3.js";var f=`
  varying vec2 vUv;
  uniform float uVel;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.y += sin(uv.x * 3.14159) * uVel * 0.0009;   // le plan se courbe un peu en scroll rapide
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`,p=`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uImgR;
  uniform float uPlaneR;
  uniform vec2 uSize;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uParallax;
  uniform float uVel;

  vec2 cover(vec2 uv) {
    vec2 s = uPlaneR > uImgR ? vec2(1.0, uImgR / uPlaneR) : vec2(uPlaneR / uImgR, 1.0);
    return (uv - 0.5) * s + 0.5;
  }
  float roundedBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) / (1.12 + uHover * 0.0336) + 0.5;     // 1.12 de base, ×1.03 au survol
    p.y += uParallax * 0.045;

    vec2 d = uv - uMouse; d.x *= uPlaneR;
    float dist = length(d);
    float wave = sin(dist * 30.0 - uTime * 6.0) * exp(-dist * 4.5) * 0.014 * uHover;
    p += (d / max(dist, 1e-4)) * wave;

    float shift = 0.0045 * uHover + min(abs(uVel) * 0.00012, 0.006);
    vec2 c = cover(p);
    vec3 col = vec3(
      texture2D(uTex, cover(p + vec2(shift, 0.0))).r,
      texture2D(uTex, c).g,
      texture2D(uTex, cover(p - vec2(shift, 0.0))).b
    );
    // lignes CRT très discrètes au survol
    col *= 1.0 - uHover * 0.06 * step(0.5, fract(gl_FragCoord.y * 0.5));

    vec2 px = (uv - 0.5) * uSize;
    float a = 1.0 - smoothstep(-0.5, 0.5, roundedBox(px, uSize * 0.5, 4.0));
    gl_FragColor = vec4(col, a);
  }
`;function m(m){let h=document.querySelector(`.gl-gallery`),g=new c({canvas:h,alpha:!0,antialias:!1,powerPreference:`high-performance`});g.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),g.setClearColor(0,0);let _=new a,v=new n(-1,1,1,-1,-10,10),y=new e(1,1,24,24),b=0,x=0,S=m.map(e=>{let n=e.querySelector(`img`),a=new s({vertexShader:f,fragmentShader:p,transparent:!0,uniforms:{uTex:{value:null},uImgR:{value:1},uPlaneR:{value:1},uSize:{value:new r(1,1)},uHover:{value:0},uMouse:{value:new r(.5,.5)},uTime:{value:0},uParallax:{value:0},uVel:{value:0}}}),c=new o(y,a);c.visible=!1,_.add(c);let l={tile:e,img:n,mat:a,mesh:c,top:0,left:0,w:0,h:0,hover:0,target:0,tex:null},u=async()=>{if(!n.naturalWidth)return;let e;try{e=await createImageBitmap(n,{imageOrientation:`flipY`})}catch{return}l.tex?.image?.close?.(),l.tex?.dispose();let r=new t(e);r.flipY=!1,r.minFilter=i,r.generateMipmaps=!1,r.needsUpdate=!0,l.tex=r,a.uniforms.uTex.value=r,a.uniforms.uImgR.value=e.width/e.height};return n.complete&&u(),n.addEventListener(`load`,u),e.addEventListener(`pointerenter`,()=>{l.target=1}),e.addEventListener(`pointerleave`,()=>{l.target=0}),e.addEventListener(`pointermove`,t=>{let n=e.getBoundingClientRect();a.uniforms.uMouse.value.set((t.clientX-n.left)/n.width,1-(t.clientY-n.top)/n.height)}),l}),C=()=>{b=window.innerWidth,x=window.innerHeight,g.setSize(b,x,!1),Object.assign(v,{left:-b/2,right:b/2,top:x/2,bottom:-x/2}),v.updateProjectionMatrix();let e=window.scrollY;S.forEach(t=>{let n=t.tile.getBoundingClientRect();t.top=n.top+e,t.left=n.left,t.w=n.width,t.h=n.height,t.mesh.scale.set(n.width,n.height,1),t.mat.uniforms.uPlaneR.value=n.width/n.height,t.mat.uniforms.uSize.value.set(n.width,n.height)})};C(),d.addEventListener(`refresh`,C),window.addEventListener(`resize`,C);let w=!1,T=d.create({trigger:`.work`,start:`top bottom`,end:`bottom top`,onToggle:e=>{w=e.isActive,w||g.clear()}});w=T.isActive,document.documentElement.classList.add(`gl-on`);let E=0,D=(e,t)=>{if(!w)return;E+=t/1e3;let n=window.scrollY,r=u();S.forEach(e=>{let t=e.top-n,i=t<x+50&&t+e.h>-50;if(e.mesh.visible=i&&!!e.tex,!e.mesh.visible)return;e.hover+=(e.target-e.hover)*.08,e.mesh.position.set(e.left+e.w/2-b/2,x/2-(t+e.h/2),0);let a=e.mat.uniforms;a.uHover.value=e.hover,a.uTime.value=E,a.uVel.value=r,a.uParallax.value=l.utils.clamp(-1,1,(t+e.h/2-x/2)/x)}),g.render(_,v)};return l.ticker.add(D),function(){l.ticker.remove(D),T.kill(),d.removeEventListener(`refresh`,C),window.removeEventListener(`resize`,C),S.forEach(e=>{e.tex?.image?.close?.(),e.tex?.dispose(),e.mat.dispose()}),y.dispose(),g.dispose(),document.documentElement.classList.remove(`gl-on`)}}export{m as initGallery};