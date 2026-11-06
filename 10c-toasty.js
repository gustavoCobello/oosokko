'use strict';
/* ===== TOASTY SPAM =====
   O demonio-tamboril salta de tras da quina inferior-direita (entrada em ARCO, com overshoot e inclinacao que assenta),
   encosta na borda direita com a ALTURA INTEIRA da tela (180px), da um "pop" de impacto e recua com antecipacao.
   Curto o bastante pra nao quebrar o ritmo: ~1.5s. Ajuste em TOASTY.inT / holdT / outT (segundos).
   Juice: sombra projetada + contorno vermelho, squash/stretch pela velocidade, linhas de velocidade, faiscas/anel/selo no impacto,
   tremor + zoom-kick + lampejo, texto TOASTY! com pop. NAO pausa o jogo (sem hitstop). */
const TOASTY={age:99,queue:0,kills:10,points:100,
  inT:.5,holdT:.55,outT:.45,   // entrada, parado, saida
  peek:.03,                    // fracao da largura que fica fora da tela no "parado"
  dim:.16,                     // escurecimento leve do fundo (0 = desliga)
  rise:70,                     // de quantos px abaixo ele sobe na entrada (arco)
  tilt:.17,                    // inclinacao inicial (rad), assenta ate 0
  hit:0};
TOASTY.dur=()=>TOASTY.inT+TOASTY.holdT+TOASTY.outT;
TOASTY.impactAt=()=>TOASTY.inT*.4545;                 // instante em que o easeOutBack cruza a posicao final
const _tB1=1.25,_tB3=_tB1+1;
const _tOutBack=k=>{k=Math.max(0,Math.min(1,k));return 1+_tB3*Math.pow(k-1,3)+_tB1*Math.pow(k-1,2)};
const _tInBack=k=>{k=Math.max(0,Math.min(1,k));return _tB3*k*k*k-_tB1*k*k};
const _tOutC=k=>{k=Math.max(0,Math.min(1,k));return 1-Math.pow(1-k,3)};
const _tInC=k=>{k=Math.max(0,Math.min(1,k));return k*k*k};
function toastyStart(){TOASTY.age=0;TOASTY.hit=0;snd('toasty_spam',1.15,side=='s'?.94:1);fl=Math.max(fl,.08);flC=RD}
function toastyTrigger(){
  if(TOASTY.age<TOASTY.dur()){TOASTY.queue=Math.min(3,TOASTY.queue+1);return}
  toastyStart();
}
function toastyCountKill(points){
  if(!R)return;
  R.toastKills=(R.toastKills||0)+1;R.toastPoints=(R.toastPoints||0)+points;
  if(R.toastKills>=TOASTY.kills||R.toastPoints>=TOASTY.points){
    R.toastKills=0;R.toastPoints=0;toastyTrigger();
  }
}
let _toastyCv=null,_toastySil=null,_toastyRim=null;
function _toastyScaled(){
  if(_toastyCv)return _toastyCv;
  const im=toastySprite(),h=180,w=Math.round(im.width*h/im.height);
  const mk=(fill)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(im,0,0,w,h);
    if(fill){g.globalCompositeOperation='source-in';g.fillStyle=fill;g.fillRect(0,0,w,h)}return c};
  _toastySil=mk(NV);_toastyRim=mk(RD);return _toastyCv=mk(null);
}
/* posicao/pose no instante `age` -> {x,y,tilt,sx,sy} */
function _toastyPose(age,w){
  const T=TOASTY,shown=320-w*(1-T.peek),hidden=321+6,hs=T.inT+T.holdT;
  let x,y,tilt;
  if(age<T.inT){const k=age/T.inT;x=hidden+(shown-hidden)*_tOutBack(k);y=T.rise*(1-_tOutC(Math.min(1,k*1.15)));tilt=T.tilt*(1-_tOutC(k))}
  else if(age<hs){x=shown;y=0;tilt=0}
  else{const k=(age-hs)/T.outT;x=shown+(hidden-shown)*_tInBack(k);y=T.rise*.7*_tInC(k);tilt=T.tilt*.6*_tInC(k)}
  return{x,y,tilt,shown};
}
function toastyUpdate(d){
  const T=TOASTY,D=T.dur();
  if(T.age>=D)return;
  const prev=T.age;T.age+=d;
  const w=_toastyScaled().width,P=_toastyPose(T.age,w),sx=P.shown+w*.12;
  // rastro de faiscas enquanto entra/sai rapido
  const v=Math.abs(P.x-_toastyPose(Math.max(0,T.age-d),w).x)/Math.max(d,.001);
  if(v>180&&T.age<D*.98){sparkBurst(P.x+8,60+rnd()*110,1+((rnd()*2)|0),{sp:26,l:.35,a0:Math.PI*.75,aw:Math.PI*.5,c:[RD,CR],tr:.9})}
  // impacto: quando encosta no lugar
  if(!T.hit&&T.age>=T.impactAt()){
    T.hit=1;const cx=P.shown+w*.5,cy=92;
    shk=Math.max(shk,.34);zv+=1.7;fl=Math.max(fl,.16);flC=RD;
    rings.push({x:sx,y:cy,r:8,l:.38,c:RD},{x:sx,y:cy,r:0,l:.3,c:CR});
    addSigil(cx,cy,44,{l:.55,spin:3,c:RD,c2:CR,w:2});
    sparkBurst(sx,cy,26,{sp:130,l:.55,a0:Math.PI*.55,aw:Math.PI*.9,c:[RD,CR,'#ff517b'],tr:.88});
    sparkBurst(sx,cy,10,{sp:40,vy:-20,l:.7,c:[CR],kind:1,tr:.94});
    for(let i=0;i<4;i++)addGlyph(sx-6-rnd()*40,cy+(rnd()-.5)*70,{l:.6,s:3});
  }
  if(T.age>=D&&T.queue){T.queue--;toastyStart()}
}
function toastyDraw(){
  const T=TOASTY,D=T.dur();
  if(T.age>=D)return;
  const age=T.age,cv=_toastyScaled(),w=cv.width,P=_toastyPose(age,w),hs=T.inT+T.holdT;
  const vis=age<T.inT?_tOutC(age/T.inT):age<hs?1:1-_tInC((age-hs)/T.outT);
  const vx=Math.abs(P.x-_toastyPose(Math.max(0,age-.016),w).x);           // px por frame (~60fps)
  const sx=1+Math.min(.14,vx*.011),sy=1-Math.min(.06,vx*.005);          // squash & stretch pela velocidade
  ctx.save();
  if(T.dim>0){ctx.globalAlpha=T.dim*vis;ctx.fillStyle=NV;ctx.fillRect(0,0,320,180)}
  const f=Math.max(0,1-(age-T.impactAt())/.35);                          // lampejo no impacto
  if(T.hit&&f>0){ctx.globalAlpha=f*f*.16;ctx.fillStyle=RD;ctx.fillRect(0,0,320,180)}
  // linhas de velocidade atras dele
  if(vx>3){ctx.fillStyle=RD;for(let i=0;i<9;i++){const yy=((i*37+((age*60)|0)*11)%170)+4,len=Math.min(70,vx*9)*(.5+(i%3)*.3);ctx.globalAlpha=Math.min(.55,vx*.03)*(.5+(i%2)*.4);ctx.fillRect(Math.round(P.x-len+10),yy,Math.round(len),1)}}
  ctx.imageSmoothingEnabled=false;
  const pose=(ox,oy)=>{ctx.translate(Math.round(P.x+w/2+ox),Math.round(180+P.y+oy));ctx.rotate(P.tilt);ctx.scale(sx,sy);ctx.translate(-w/2,-180)};
  // sombra projetada (em espaco de tela, p/ esquerda e pra baixo) em 2 camadas
  ctx.save();pose(-14,5);ctx.globalAlpha=.22*vis;ctx.drawImage(_toastySil,0,0);ctx.restore();
  ctx.save();pose(-8,3);ctx.globalAlpha=.42*vis;ctx.drawImage(_toastySil,0,0);ctx.restore();
  // contorno vermelho de 1px (brilho do demonio) + sprite
  ctx.save();pose(0,0);ctx.globalAlpha=.7*vis;
  ctx.drawImage(_toastyRim,-1,0);ctx.drawImage(_toastyRim,1,0);ctx.drawImage(_toastyRim,0,-1);ctx.drawImage(_toastyRim,0,1);
  ctx.globalAlpha=1;ctx.drawImage(cv,0,0);ctx.restore();
  // texto TOASTY! com pop
  const ta=age-T.impactAt();
  if(T.hit&&ta<T.holdT+.12){
    const k=_tOutBack(ta/.22),out=Math.max(0,Math.min(1,(T.holdT+.12-ta)/.12)),tx0=Math.round(P.shown-36),ty0=66;
    ctx.save();ctx.globalAlpha=out;ctx.translate(tx0,ty0);ctx.rotate(-.09);ctx.scale(Math.max(.01,k),Math.max(.01,k));
    tx('TOASTY!',2,2,NV,2,1);tx('TOASTY!',1,1,RD,2,1);tx('TOASTY!',0,0,'#fff6e0',2,1);ctx.restore();
  }
  ctx.restore();ctx.globalAlpha=1;
}
