import{a as e,i as t,l as n,n as r,o as i,r as a,s as o,t as s,u as c}from"./three.module-CuQUf3HT.js";var l=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,u=`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform vec2 uVel;
  uniform float uAspect;
  uniform float uForce;
  void main() {
    // advection légère dans le sens du mouvement + diffusion
    vec2 uv = vUv - uVel * 0.015;
    vec2 px = vec2(1.0 / 256.0);
    float prev = texture2D(uPrev, uv).r * 0.6
      + (texture2D(uPrev, uv + vec2(px.x, 0.0)).r + texture2D(uPrev, uv - vec2(px.x, 0.0)).r
      +  texture2D(uPrev, uv + vec2(0.0, px.y)).r + texture2D(uPrev, uv - vec2(0.0, px.y)).r) * 0.1;
    vec2 d = vUv - uMouse; d.x *= uAspect;
    float splat = exp(-dot(d, d) / 0.0035) * uForce;
    float v = max(prev * 0.975 - 0.0035, 0.0) + splat;
    gl_FragColor = vec4(min(v, 1.0), 0.0, 0.0, 1.0);
  }
`,d=e=>`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uMouse;
  uniform sampler2D uTrail;
  uniform float uUseTrail;

  float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < ${e}; i++) { v += a * noise(p); p = r * p * 2.03 + 11.7; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uAspect, uv.y) * 2.4;
    float t = uTime * 0.06;
    float trail = uUseTrail > 0.5 ? texture2D(uTrail, uv).r : 0.0;

    vec2 m = vec2(uMouse.x * uAspect, uMouse.y) * 2.4;
    p += (p - m) * trail * 0.25;               // la souris écarte l'encre

    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 3.6 * q + vec2(1.7, 9.2) + t * 1.4 + trail * 1.2),
                  fbm(p + 3.6 * q + vec2(8.3, 2.8) - t * 1.1));
    float f = fbm(p + 3.8 * r);

    vec3 ink   = vec3(0.039);
    vec3 acid  = vec3(0.549, 1.0, 0.18);
    vec3 deep  = vec3(0.07, 0.16, 0.03);
    vec3 pink  = vec3(1.0, 0.18, 0.58);

    float smoke = smoothstep(0.38, 0.95, f);
    vec3 col = mix(ink, deep, smoke);
    col = mix(col, acid * 0.55, smoothstep(0.62, 1.0, f * length(r)) * 0.9);
    col += acid * pow(smoothstep(0.55, 1.0, f), 4.0) * 0.18;           // filaments lumineux
    col = mix(col, pink * 0.7, clamp(trail * smoothstep(0.3, 0.8, f) * 1.4, 0.0, 0.75));

    // vignette + bas assombri pour la lisibilité du titre et des boutons
    float vig = smoothstep(1.25, 0.25, length((uv - vec2(0.5, 0.55)) * vec2(uAspect * 0.8, 1.0)));
    col *= mix(0.45, 1.0, vig);
    col *= mix(0.55, 1.0, smoothstep(0.0, 0.45, uv.y));
    gl_FragColor = vec4(col, 1.0);
  }
`;function f(f,{lite:p=!1,still:m=!1}={}){let h=new s({canvas:f,antialias:!1,alpha:!1,powerPreference:`high-performance`}),g=Math.min(window.devicePixelRatio||1,2);h.setPixelRatio(p?Math.min(g,1)*.6:g>=2?1:.75);let _=new i,v=new t(-1,1,1,-1,0,1),y=new e(2,2),b=!p&&!m,x,S,C,w;if(b){let e={minFilter:r,magFilter:r,depthBuffer:!1};x=new c(256,256,e),S=new c(256,256,e),w=new o({vertexShader:l,fragmentShader:u,uniforms:{uPrev:{value:x.texture},uMouse:{value:new n(.5,.5)},uVel:{value:new n},uAspect:{value:1},uForce:{value:0}}}),C=new i,C.add(new a(y,w))}let T=new o({vertexShader:l,fragmentShader:d(p?3:5),uniforms:{uTime:{value:m?14:0},uAspect:{value:1},uMouse:{value:new n(.5,.5)},uTrail:{value:b?S.texture:null},uUseTrail:{value:+!!b}}});_.add(new a(y,T));let E=new n(.5,.5),D=new n(.5,.5),O=new n(.5,.5),k=e=>{let t=f.getBoundingClientRect();E.set((e.clientX-t.left)/t.width,1-(e.clientY-t.top)/t.height)};b&&window.addEventListener(`pointermove`,k,{passive:!0});let A=()=>{let e=f.clientWidth,t=f.clientHeight;h.setSize(e,t,!1),T.uniforms.uAspect.value=e/t,w&&(w.uniforms.uAspect.value=e/t),m&&h.render(_,v)},j=new ResizeObserver(A);j.observe(f),A();let M=!0,N=0,P=performance.now(),F=0,I=e=>{if(N=requestAnimationFrame(I),!M)return;let t=Math.min((e-P)/1e3,.05);if(P=e,F+=t,T.uniforms.uTime.value=F,b){D.lerp(E,.25);let e=D.clone().sub(O);O.copy(D),w.uniforms.uMouse.value.copy(D),w.uniforms.uVel.value.copy(e),w.uniforms.uForce.value=Math.min(e.length()*9,.6),w.uniforms.uPrev.value=x.texture,h.setRenderTarget(S),h.render(C,v),h.setRenderTarget(null),T.uniforms.uTrail.value=S.texture,T.uniforms.uMouse.value.copy(D),[x,S]=[S,x]}else p&&T.uniforms.uMouse.value.set(.5+Math.sin(F*.3)*.3,.5+Math.cos(F*.23)*.25);h.render(_,v)};m?h.render(_,v):N=requestAnimationFrame(I);let L=new IntersectionObserver(([e])=>{M=e.isIntersecting,P=performance.now()});L.observe(f);let R=()=>{M=!document.hidden,P=performance.now()};return document.addEventListener(`visibilitychange`,R),function(){cancelAnimationFrame(N),L.disconnect(),j.disconnect(),window.removeEventListener(`pointermove`,k),document.removeEventListener(`visibilitychange`,R),y.dispose(),T.dispose(),w?.dispose(),x?.dispose(),S?.dispose(),h.dispose()}}export{f as initHeroInk};