'use strict';
/* ===== MENU PRINCIPAL — ruinas goticas, pentagrama em chamas, demonio x anjo =====
   Usa os sprites reais do jogo (chefe demonio + peixe santo) e a paleta do jogo (NV/NV2/LV/CR/RD).
   Fundo procedural (sem imagens): parede em ruinas com pentagrama entalhado, arco com por-do-sol, rochas flutuantes. mnBuild() e PURO (so arrays) e roda uma vez; o resto sao camadas animadas.
   Substitui title() de 10-ui.js (carregar DEPOIS dele). Teclado: SETAS/W/S + ENTER/ESPACO. */
const MNW=336,MNH=196,MNM=8; /* buffer com margem de 8px (parallax/shake) */
const MN_P={
night:['#07091f','#0c1030','#1a2048','#242c5c','#2a2a58','#3a3560','#5a5080','#8878a0'],
sun:['#2a1a50','#750048','#ff0a50','#ff517b','#ff98a6','#f8dcb4'],
dem:['#0c1030','#2a1a50','#5a1030','#750048','#ff0a50','#ff517b','#ff98a6','#f8dcb4'],
ang:['#0c1030','#1a2048','#3a3560','#5a5080','#8878a0','#cec6d2','#f8dcb4','#fff6e0'],
fire:['#2a1a50','#750048','#ff0a50','#ff517b','#f8dcb4','#fff6e0']};
const MN_C={};for(const k in MN_P)MN_C[k]=MN_P[k].map(h=>{const n=parseInt(h.slice(1),16);return[n>>16&255,n>>8&255,n&255]});
const MN_B=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const mnHs=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
const mnCl=(v,a,b)=>v<a?a:v>b?b:v;
function mnRamp(r,v,x,y){const n=r.length-1;v=mnCl(v,0,n);const f=Math.floor(v);if(f>=n)return r[n];return r[f+((v-f)>(MN_B[(y&3)*4+(x&3)]+.5)/16?1:0)]}

/* ---------- fundo ---------- */
function mnSegD(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,u=mnCl(((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy),0,1);return Math.hypot(px-ax-u*dx,py-ay-u*dy)}
function mnPentaD(x,y,cx,cy,r){if(Math.abs(x-cx)>r+4||Math.abs(y-cy)>r+4)return 99;let d=Math.abs(Math.hypot(x-cx,y-cy)-r);const q=[];for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5;q.push([cx+Math.cos(a)*r*.96,cy+Math.sin(a)*r*.96])}
for(let i=0;i<5;i++){const A=q[i],B=q[(i+2)%5];d=Math.min(d,mnSegD(x,y,A[0],A[1],B[0],B[1]))}return d}
const MN_R=[[22,150,11,8],[54,172,9,6],[112,174,13,6],[24,126,6,5],[134,152,5,4],[262,172,11,6],[298,160,9,6],[96,16,5,4],[140,30,4,3]];
const MN_V=[[298,60,.5],[308,44,1.9],[314,70,1],[16,40,2.2],[30,24,.4]];
function mnFgS(x,y){
for(const q of MN_R){const e=Math.pow((x-q[0])/q[2],2)+Math.pow((y-q[1])/q[3],2);if(e<1+(mnHs(x>>1,y>>1)-.5)*.35)return .6+1.6*Math.max(0,(q[0]-x)/q[2]*.5+(q[1]-y)/q[3]*.5)+mnHs(x,y)*.4}
if(y>=164+Math.floor(mnHs(Math.floor(x/4),5)*10))return .5+mnHs(x>>1,y>>1)*.5;
if(x>=164&&x<=186&&y>=142+Math.floor(mnHs(Math.floor(x/3),6)*8))return .6+(x<172?1.1:0)+mnHs(x>>1,y>>2)*.4;
if(x<24&&y>18+Math.floor(mnHs(Math.floor(x/3),7)*8))return .4+(x/24)*.9;
if(x>=290)return .35+mnHs(x>>1,y>>3)*.4+(mnPentaD(x,y,304,92,11)<1?1.1:0);
for(const q of MN_V){const vx=q[0]+Math.sin(y*.09+q[2])*3;if(y<q[1]&&Math.abs(x-vx)<.75)return .3}
return null}
function mnBGc(x,y){const r=MN_C.night,f=mnFgS(x,y);if(f!=null)return mnRamp(r,f,x,y);
let v=2.1+(mnHs(x>>1,y>>1)-.5)*.6+.45*Math.sin(x*.09+Math.sin(y*.13)*2)+.3*Math.sin(y*.5+x*.03);
/* tijolos */const row=Math.floor(y/9);if(y%9==0||(x+(row&1)*7)%14==0)v-=.55;
v-=Math.pow(Math.abs(x-160)/190,2)*.6;
/* pentagrama entalhado na parede */const d=mnPentaD(x,y,208,52,50);if(d<1.7)v=4.1+(mnHs(x,y)-.5)*.5-(x>208?.5:0);else if(d<2.8)v=.7;
/* arco com por-do-sol */const ax=224,dx=Math.abs(x-ax),top=56+dx*2.7;
if(dx<=16&&y>=top&&y<=150){const u=(y-top)/(150-top);let w=.2+u*2.0+.35*Math.sin(x*.4+y*.9);
if(Math.abs(x-ax)<5&&y>112+Math.abs(x-ax)*2.4)w=.3;else if(Math.abs(x-ax+9)<2.5&&y>124+Math.abs(x-ax+9)*2)w=.3;else if(Math.abs(x-ax-9)<2.5&&y>126+Math.abs(x-ax-9)*2)w=.3;
return mnRamp(MN_C.sun,w,x,y)}
else if(dx<=19&&y>=top-3&&y<=150){v=Math.max(.3,v-1.4)}
return mnRamp(r,v,x,y)}

/* ---------- fumaca (tile horizontal sem emenda) ---------- */
function mnFogB(col,seed){const W=320,H=44,a=new Uint8ClampedArray(W*H*4),k=2*Math.PI/W;
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const n=(Math.sin(k*2*x+seed+y*.09)+Math.sin(k*3*x+seed*2-y*.13)+Math.sin(k*5*x+seed*3+y*.05)+Math.sin(k*8*x-seed))/4,
d=(n*.5+.5)*Math.exp(-Math.pow((y-22)/11,2))*1.25;if(d>(MN_B[(y&3)*4+(x&3)]+.5)/16*.9+.12){const i=(y*W+x)*4;a[i]=col[0];a[i+1]=col[1];a[i+2]=col[2];a[i+3]=255}}
return{w:W,h:H,d:a}}

/* ---------- titulo gotico: letras altas e estreitas, pontas de espinho, veios escuros, ouro gasto ---------- */
function mnTitleB(){const W=160,H=84,m=new Uint8Array(W*H),sl=new Uint8Array(W*H),dr=[];
const fill=(x,y,w,h)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++){const px=x+i,py=y+j;if(px>=0&&py>=0&&px<W&&py<H)m[py*W+px]=1}};
const line=(s,y0)=>{const sx=5,sy=5,pitch=20,xs=Math.round((W-(s.length*pitch-5))/2);
for(let i=0;i<s.length;i++){const g=FN[s[i]];if(!g)continue;
for(let k=0;k<15;k++)if(g[k]=='1'){const c=k%3,r=(k/3)|0,x0=xs+i*pitch+c*sx,y1=y0+r*sy;fill(x0,y1,sx,sy);
if(c!=1&&r==0)for(let u=1;u<=4;u++){const w=Math.max(1,sx-u);fill(x0+((sx-w)>>1),y1-u,w,1)}
if(c!=1&&r==4)for(let u=1;u<=4;u++){const w=Math.max(1,sx-u);fill(x0+((sx-w)>>1),y1+sy-1+u,w,1)}}
for(let k=0;k<15;k++)if(g[k]=='1'){const c=k%3,r=(k/3)|0,x0=xs+i*pitch+c*sx,y1=y0+r*sy;
if(c!=1&&k>=3&&k<12&&g[k-3]=='1'&&g[k+3]=='1')for(let j=0;j<sy;j++)sl[(y1+j)*W+x0+(sx>>1)]=1;
if(c==1&&g[k-1]=='1'&&g[k+1]=='1')for(let j=0;j<sx;j++)sl[(y1+(sy>>1))*W+x0+j-sx]=sl[(y1+(sy>>1))*W+x0+j-sx]||0}}};
line('SATANIC',8);line('FISHS',46);
/* veio horizontal das barras (refaz, agora no lugar certo) */
const rgba=new Uint8ClampedArray(W*H*4),M=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&m[y*W+x];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;let c=null;
if(M(x,y)){const ly=(y-(y<44?4:42))/38;let v=5.1-ly*3.3+(mnHs(x,y)-.5)*1.1;
if(!M(x,y-1))v+=1.6;if(!M(x,y+1))v-=1.4;if(!M(x-1,y))v+=.7;if(!M(x+1,y))v-=.7;if(sl[y*W+x])v=.6;c=mnRamp(MN_C.fire,v,x,y)}
else if(M(x-1,y)||M(x+1,y)||M(x,y-1)||M(x,y+1)||M(x-1,y-1)||M(x+1,y+1)||M(x+1,y-1)||M(x-1,y+1))c=[12,16,48];
else if(M(x-2,y-2)||M(x-3,y-3)||M(x-2,y-3)||M(x-3,y-2))c=[117,0,72];
if(c){rgba[i]=c[0];rgba[i+1]=c[1];rgba[i+2]=c[2];rgba[i+3]=255}}
let lastX=-9;for(let x=4;x<W-4;x++){for(const yb of[39,77]){let y=yb;while(y>yb-6&&!M(x,y))y--;if(M(x,y)&&!M(x,y+1)&&y>yb-5&&mnHs(x,7)>.6&&x-lastX>8){dr.push([x,y+1]);lastX=x}}}
return{w:W,h:H,d:rgba,drips:dr.slice(0,12)}}

/* ---------- peixes do menu (arte propria, nao usa os sprites do jogo) ---------- */
function mnFan(x,y,px,py,a0,a1,N,L0,La,ph,seed,rmin){const dx=x-px,dy=y-py,r=Math.hypot(dx,dy);if(r<rmin)return null;const T=Math.PI*2;let rel=((Math.atan2(dy,dx)-a0)%T+T)%T;const sp=a1-a0;if(rel>sp)return null;
const k=rel/sp*N,i=Math.min(N-1,Math.floor(k)),fr=k-i,tri=1-Math.abs(2*fr-1),L=L0+La*(.45+.55*mnHs(i,seed))*Math.pow(tri,.9)+3*Math.sin(ph+i*.9)*tri;if(r>L)return null;
if(r>L-6&&mnHs(x,y+seed)>.8+(L-r)/6*.2)return null;return{i,fr,tri,r,L,ridge:Math.exp(-Math.pow((fr-.5)/.11,2))}}
function mnHorn(P){const pts=[];for(let i=0;i<=40;i++){const k=i/40,a=(1-k)*(1-k),b=2*k*(1-k),c=k*k;pts.push([a*P[0]+b*P[2]+c*P[4],a*P[1]+b*P[3]+c*P[5],k])}
for(let i=0;i<=40;i++){const p=pts[i],q=pts[Math.min(40,i+1)],o=pts[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],l=Math.hypot(dx,dy)||1;p.push(-dy/l,dx/l,Math.max(.8,P[6]*Math.pow(1-p[2],.85)))}return pts}
function mnHornC(x,y,pts){let b=null,bq=9;for(const p of pts){const d=Math.hypot(x-p[0],y-p[1]);if(d<p[5]&&d/p[5]<bq){bq=d/p[5];b=p}}if(!b)return null;
const s=((x-b[0])*b[3]+(y-b[1])*b[4])/b[5],sg=(b[3]*-.6+b[4]*-.8)>0?1:-1;let v=3.2+s*sg*1.8+(Math.floor(b[2]*10)%2?-.7:0)+(b[2]>.9?1:0)-(bq>.85?1:0);return mnRamp(MN_C.night,v,x,y)}
const MN_HG=[mnHorn([76,46,64,16,94,10,9]),mnHorn([108,56,116,32,134,34,6])];
function mnOutline(o,W,H){const al=new Uint8Array(W*H);for(let i=0;i<W*H;i++)al[i]=o[i*4+3];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;if(al[i])continue;if(al[i-1]||al[i+1]||al[i-W]||al[i+W]){o[i*4]=7;o[i*4+1]=9;o[i*4+2]=31;o[i*4+3]=255}}}
function mnDemon(ph){const W=160,H=156,o=new Uint8ClampedArray(W*H*4),D=MN_C.dem,N=MN_C.night,ex=92,ey=58,CRm=[248,220,180];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){let c=null;
const pf=mnFan(x,y,74,100,1.55+.06*Math.sin(ph),3.5+.06*Math.sin(ph),7,46,8,ph,3,12);
const bE=Math.pow((x-80)/42,2)+Math.pow((y-80)/42,2),sE=Math.pow((x-112)/26,2)+Math.pow((y-86)/27,2);
if(pf)c=mnRamp(D,2.4+pf.ridge*2.2-(pf.r/pf.L)*1.2+(mnHs(pf.i,5)-.5)*.5,x,y);
else if(bE<1||sE<1){let nx=(x-80)/42,ny=(y-80)/42;const rr=Math.hypot(nx,ny);if(rr>.98){nx*=.98/rr;ny*=.98/rr}const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));let v=.9+(-.5*nx-.55*ny+.67*nz)*2.7;
if(rr>.8&&nx+ny<.2)v+=1.4*(Math.min(1,rr)-.8)/.2;
const row=Math.floor(y/5),sx=x+(row&1)*3,u=sx%6,w=y%5;if(w<1||(u<1&&w<4))v-=.5;else if(u>=1&&u<3&&w>=1&&w<3)v+=.4;v+=(mnHs(Math.floor(sx/6),row)-.5)*.5;
for(let i=0;i<3;i++){const ge=Math.pow((x-(68-i*4))/9,2)+Math.pow((y-86)/20,2);if(ge>.82&&ge<1&&x<70-i*4)v-=1.5}
/* sobrancelha e olho */
const ed=Math.pow((x-ex)/13,2)+Math.pow((y-ey)/11,2),by=ey-9+(x-ex)*.5;
if(x>70&&x<116&&Math.abs(y-(ey-12+(x-ex)*.55))<3.2)v=Math.min(v,1.3)+(y<ey-12+(x-ex)*.55?.7:0);
if(ed<1.35){if(ed>=1)v-=1.6;else if(y<by+4)v=1+(y<by?.6:0);else{const id=Math.pow((x-(ex+1))/8.5,2)+Math.pow((y-(ey+1))/8,2);
if(id<1){if(id<.14&&Math.abs(x-(ex+1))<2)c=[7,9,31];else v=5.6-id*2.2}else v=4.1+(mnHs(x,y)>.8?.7:0);
if(x==ex-3&&y==ey-2)c=CRm}}
/* boca */
const mx=118,my=92,me=Math.pow((x-mx)/17,2)+Math.pow((y-my)/27,2);
if(me<1.12){if(me>=1)v-=1.2;else{const ang=Math.atan2((y-my)/27,(x-mx)/17),k=((ang/(Math.PI*2)+1)*14)%1,tri=1-Math.abs(2*k-1),tl=.46*Math.pow(tri,.8)*(mnHs(Math.floor((ang+7)*14/6.283),4)>.12?1:.4);
if(me>1-tl)c=mnRamp(D,7.2-(1-tri)*3.2,x,y);
else{v=.6+(1-me)*.9;const te=Math.pow((x-mx)/12,2)+Math.pow((y-(my+14))/9,2);if(te<1)v=3.2+(1-te)*1.4-(Math.abs(x-mx)<1?.9:0)}}}
if(!c)c=mnRamp(D,v,x,y)}
else{let h=null;for(const hp of MN_HG){h=mnHornC(x,y,hp);if(h)break}
if(h)c=h;else{const df=mnFan(x,y,76,74,2.25,4.9,10,60,16,ph,1,26);if(df)c=mnRamp(D,1.8+df.ridge*2.2-(df.r/df.L)*.8+(mnHs(df.i,2)-.5)*.4,x,y)}}
if(c){const i=(y*W+x)*4;o[i]=c[0];o[i+1]=c[1];o[i+2]=c[2];o[i+3]=255}}
mnOutline(o,W,H);return o}
function mnAngel(ph){const W=100,H=96,o=new Uint8ClampedArray(W*H*4),A=MN_C.ang;
for(let y=0;y<H;y++)for(let x=0;x<W;x++){let c=null;
const pf=mnFan(x,y,52,54,.3+.05*Math.sin(ph),1.9+.05*Math.sin(ph),5,10,12,ph,7,4);
const bE=Math.pow((x-46)/24,2)+Math.pow((y-48)/22,2),sE=Math.pow((x-28)/13,2)+Math.pow((y-52)/12,2);
if(pf)c=mnRamp(A,4.2+pf.ridge*2-(pf.r/pf.L)*1,x,y);
else if(bE<1||sE<1){let nx=(x-46)/24,ny=(y-48)/22;const rr=Math.hypot(nx,ny);if(rr>.98){nx*=.98/rr;ny*=.98/rr}const nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));let v=2.5+(-.5*nx-.55*ny+.67*nz)*3.2;
if(rr>.8&&nx+ny<.2)v+=1*(Math.min(1,rr)-.8)/.2;
const row=Math.floor(y/3),sx=x+(row&1)*2,u=sx%4,w=y%3;if(u<1||w<1)v-=.7;else if(u<2&&w<2)v+=.5;v+=(mnHs(Math.floor(sx/4),row)-.5)*.5;
const ed=Math.pow((x-31)/6.5,2)+Math.pow((y-43)/5.5,2),ly=40.5+(31-x)*.4;
if(ed<1.3){if(ed>=1)v-=1.4;else if(y<ly)v=2;else{const id=Math.pow((x-30)/3.4,2)+Math.pow((y-44.5)/3.4,2);if(id<1){if(id<.2)c=[7,9,31];else v=3.6+(id>.7?-1:0)}else v=6.4;if(x==29&&y==42)c=[255,246,224]}}
const ym=59+Math.pow((x-22)/5,2)*1.8;if(x>16&&x<28&&Math.abs(y-ym)<.7)v=.6;
if(!c)c=mnRamp(A,v,x,y)}
else{let f=mnFan(x,y,62,48,-1.15,1.15,9,24,16,ph,5,12),b=3.6;if(!f){f=mnFan(x,y,50,28,-2.5,-.7,6,14,12,ph,6,4);b=3.4}if(!f){f=mnFan(x,y,52,68,.5,2.3,5,17,11,ph,8,4);b=3.2}
if(f)c=mnRamp(A,b+f.ridge*2.2-(f.r/f.L)*.9+(mnHs(f.i,9)-.5)*.5,x,y)}
if(c){const i=(y*W+x)*4;o[i]=c[0];o[i+1]=c[1];o[i+2]=c[2];o[i+3]=255}}
mnOutline(o,W,H);return o}

/* ---------- monta tudo ---------- */
function mnBuild(){const bg=new Uint8ClampedArray(MNW*MNH*4);
for(let by=0;by<MNH;by++)for(let bx=0;bx<MNW;bx++){const c=mnBGc(bx-MNM,by-MNM),i=(by*MNW+bx)*4;bg[i]=c[0];bg[i+1]=c[1];bg[i+2]=c[2];bg[i+3]=255}
const dem=[],ang=[];for(let i=0;i<6;i++){dem.push(mnDemon(i*Math.PI/3));ang.push(mnAngel(i*Math.PI/3+1))}
return{bg,dem,ang,title:mnTitleB(),fog1:mnFogB([90,80,128],1),fog2:mnFogB([58,53,96],4)}}

/* =====================  RUNTIME  ===================== */
const MN={ready:0,sel:0,t0:0,seen:-9,snd:0,P:[],E:[],pp:[]};
const MN_IT=[['Jogar',()=>go('side')],['Relicario',()=>go('relic')],['Config',()=>go('cfg')]];
const mnRowY=i=>112+i*17,PC=[38,58,32];
function mnMk(w,h,d){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),im=g.createImageData(w,h);im.data.set(d);g.putImageData(im,0,0);return c}
function mnPick(i){if(i<0||i>2)return;try{snd('ui_click_'+(1+(Math.random()*3|0)))}catch(e){}MN_IT[i][1]()}
function mnSel(i){if(i!=MN.sel){MN.sel=i;try{snd('ui_tap')}catch(e){}}}
function mnInit(){const B=mnBuild();MN.bg=mnMk(MNW,MNH,B.bg);MN.tt=mnMk(B.title.w,B.title.h,B.title.d);MN.drips=B.title.drips;
MN.dem=B.dem.map(d=>mnMk(160,156,d));MN.ang=B.ang.map(d=>mnMk(100,96,d));MN.f1=mnMk(B.fog1.w,B.fog1.h,B.fog1.d);MN.f2=mnMk(B.fog2.w,B.fog2.h,B.fog2.d);
MN.tmp=document.createElement('canvas');MN.tmp.width=B.title.w;MN.tmp.height=B.title.h;MN.tg=MN.tmp.getContext('2d');
/* pontos do pentagrama em chamas (anel + estrela) */
const cx=PC[0],cy=PC[1],r=PC[2],q=[];for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5;q.push([cx+Math.cos(a)*r*.94,cy+Math.sin(a)*r*.94])}
for(let a=0;a<Math.PI*2;a+=1.3/r)MN.pp.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r,Math.random()*6]);
for(let i=0;i<5;i++){const A=q[i],B2=q[(i+2)%5],n=Math.round(Math.hypot(B2[0]-A[0],B2[1]-A[1])/1.3);for(let k=0;k<n;k++)MN.pp.push([A[0]+(B2[0]-A[0])*k/n,A[1]+(B2[1]-A[1])*k/n,Math.random()*6])}
for(let i=0;i<40;i++)MN.P.push({x:Math.random()*320,y:Math.random()*180,vy:-(5+Math.random()*12),ph:Math.random()*6,k:Math.random()});
addEventListener('keydown',e=>{if(scr!='title'||TR||(typeof DEV!='undefined'&&DEV.panel))return;const k=e.key;
if(k=='ArrowUp'||k=='w'||k=='W'){e.preventDefault();mnSel((MN.sel+2)%3)}else if(k=='ArrowDown'||k=='s'||k=='S'){e.preventDefault();mnSel((MN.sel+1)%3)}
else if(k=='Enter'||k==' '){e.preventDefault();try{initAudio()}catch(x){}mnPick(MN.sel)}});
cv.addEventListener('pointermove',e=>{if(scr!='title'||TR)return;const p=pt(e);for(let i=0;i<3;i++)if(inR(p,200,mnRowY(i)-4,106,16)){mnSel(i);return}});
MN.ready=1}
function mnDFog(c,y,sp){const o=(((t*sp)%320)+320)%320;ctx.drawImage(c,-o,y);ctx.drawImage(c,320-o,y)}
function mnOut(s,x,y,c,z,al){
/* fonte gotica grande: so sombra 1px (contorno de 8 direcoes fechava os vaos entre as letras e engordava o texto) */
if(z>=2&&FT.ok&&SV.fnt!=1&&FT.sup.test(String(s))){tx(s,x+1,y+1,NV,z,al);tx(s,x,y,c,z,al);return}
for(const[a,b]of[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[1,-1],[-1,1]])tx(s,x+a,y+b,NV,z,al);tx(s,x,y,c,z,al)}
const mnGl=(x,y,r,c,l)=>{ctx.fillStyle=dp(c,l);ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()};
function mnIcon(x,y){const M={o:NV,r:RD,d:'#750048',w:CR,p:'#ff98a6'};['..o.....ooo.','.orooooorrro','owrrrrrrrdro','oprrrrrrdddo','.orrrrrdddoo','..oooooooo..'].forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]!='.'){ctx.fillStyle=M[r[i]];ctx.fillRect(x+i,y+j,1,1)}})}
function mnSpr(im,x,y,z,flip){const w=im.width*z,h=im.height*z;ctx.save();if(flip){ctx.translate(x+w,y);ctx.scale(-1,1);ctx.drawImage(im,0,0,w,h)}else ctx.drawImage(im,x,y,w,h);ctx.restore()}
title=function(){if(!MN.ready)mnInit();if(t-MN.seen>.25){MN.t0=t;MN.snd=0;MN.lf=0}MN.seen=t;const ti=t-MN.t0;
const ox=Math.round(Math.sin(t*.27)*2.6),oy=Math.round(Math.cos(t*.21)*1.4),fl1=.5+.5*Math.sin(t*13)*Math.sin(t*4.1);
ctx.drawImage(MN.bg,-MNM+ox,-MNM+oy);
/* luz doentia do arco */mnGl(224+ox,104,30,'#ff0a50',2+(Math.sin(t*2)>0?1:0));
ctx.fillStyle=dp(LV,2);for(let i=0;i<2;i++){const bx=100+i*60+Math.round(Math.sin(t*.35+i*2)*8);ctx.beginPath();ctx.moveTo(bx,-4);ctx.lineTo(bx+14,-4);ctx.lineTo(bx+66,130);ctx.lineTo(bx+26,130);ctx.fill()}
mnDFog(MN.f1,90,5);
const rs=Math.max(0,1-ti/3),fy=Math.round(rs*rs*14),px=Math.round(ox*.5);
/* pentagrama em chamas */
{const cx=PC[0]+px,cy=PC[1]+fy*.3|0;mnGl(cx,cy,PC[2]+16,'#750048',4+(fl1*2|0));mnGl(cx,cy,PC[2]+2,'#ff0a50',2+(fl1*2|0));
for(const q of MN.pp){const h=1+((Math.sin(t*9+q[2]*3)+1)*2.2|0)+(q[2]>4.6?2:0),x=Math.round(q[0]+px),y=Math.round(q[1]+fy*.3);
ctx.fillStyle='#750048';ctx.fillRect(x,y-h-1,1,2);ctx.fillStyle=RD;ctx.fillRect(x,y-h+1,1,h);ctx.fillStyle='#ff517b';ctx.fillRect(x,y-2,1,2);ctx.fillStyle=CR;ctx.fillRect(x,y,1,1);if(q[2]<1.2){ctx.fillStyle='#ff98a6';ctx.fillRect(x+1,y-1,1,1)}}
if(!SV.rf||Math.random()<.2)for(let i=0;i<2;i++){const q=MN.pp[(Math.random()*MN.pp.length)|0];MN.E.push({x:q[0],y:q[1],vx:(Math.random()-.5)*14,vy:-(14+Math.random()*26),l:.7+Math.random()*.8,c:Math.random()<.5?RD:Math.random()<.5?'#ff98a6':CR})}}
for(const e of MN.E){e.x+=e.vx*DT;e.y+=e.vy*DT;e.l-=DT;ctx.globalAlpha=Math.min(1,e.l*2);ctx.fillStyle=e.c;ctx.fillRect(e.x|0,e.y|0,1,1)}ctx.globalAlpha=1;MN.E=MN.E.filter(e=>e.l>0);if(MN.E.length>160)MN.E.splice(0,MN.E.length-160);
/* anjo: brilho calmo atras, aureola flutuando */
{const ax=112+(px*.6|0),ay=Math.round(82+Math.sin(t*1.5)*3+fy),fi=((t*9)|0)%6;mnGl(ax+44,ay+50,46,LV,2);mnGl(ax+44,ay+50,30,CR,2);ctx.drawImage(MN.ang[fi],ax,ay);
const hx=ax+31,hy=ay+22+Math.round(Math.sin(t*2.2)*1);mnGl(hx,hy,16,'#e8c860',3);ctx.strokeStyle='#e8c860';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(hx,hy,13,3.6,-.12,0,7);ctx.stroke();ctx.strokeStyle=CR;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(hx,hy-1,13,3.6,-.12,3.4,5.9);ctx.stroke();
if(((t*3)|0)%4==0){ctx.fillStyle=CR;ctx.fillRect(ax+28,ay+43,1,3);ctx.fillRect(ax+27,ay+44,3,1)}}
/* demonio: aura vermelha pulsando */
{const dx2=-22+px,dy2=Math.round(26+Math.sin(t*1.1+1)*3+fy),fi=((t*9)|0)%6;mnGl(dx2+80,dy2+82,78+(fl1*4|0),'#750048',3);mnGl(dx2+80,dy2+82,50,RD,2+(fl1*2|0));ctx.drawImage(MN.dem[fi],dx2,dy2);
if(Math.sin(t*7)>.55){ctx.fillStyle=CR;ctx.fillRect(dx2+89,dy2+55,2,2)}
for(let i=0;i<3;i++){const an=t*1.7+i*2.1,ex=dx2+80+Math.cos(an)*70,ey=dy2+90+Math.sin(an)*50-((t*20+i*30)%30);ctx.fillStyle=i%2?RD:'#ff98a6';ctx.fillRect(ex|0,ey|0,1,1)}}
mnDFog(MN.f2,146,-9);
for(const p of MN.P){p.y+=p.vy*DT;if(p.y<-4){p.y=184;p.x=Math.random()*320}const x=(p.x+Math.sin(t*.8+p.ph)*6)|0,y=p.y|0;ctx.globalAlpha=.4+.5*Math.abs(Math.sin(t*3+p.ph));ctx.fillStyle=p.k<.5?RD:p.k<.8?'#ff98a6':LV;ctx.fillRect(x,y,p.k>.93?2:1,p.k>.93?2:1)}ctx.globalAlpha=1;
for(let i=0;i<8;i++){const l=15-i*2;dth(0,i*3,320,3,'#07091f',Math.min(16,l+2));dth(0,177-i*3,320,3,'#07091f',l);dth(i*3,0,3,180,'#07091f',l);dth(317-i*3,0,3,180,'#07091f',l)}
/* painel escuro atras do menu */ctx.fillStyle=dp('#07091f',7);ctx.fillRect(208,104,112,60);
/* titulo */
const a=mnCl((ti-1.1)/.5,0,1);
if(a>0){if(!MN.snd){MN.snd=1;shk=Math.max(shk,.35);zv+=1.8;if(!SV.rf){fl=.25;flC=RD}try{snd('ritual_0')}catch(e){}}
const k=1-a,tyo=Math.round(-k*k*26),sh=a<1?Math.round((Math.random()-.5)*6*k):0,X=160+sh,Y=6+tyo;ctx.globalAlpha=a;ctx.drawImage(MN.tt,X,Y);
const ph=(ti-1.8)%5.5;if(ph>=0&&ph<1.1&&a>=1){const g=MN.tg,bx=-24+ph/1.1*200;g.clearRect(0,0,160,84);g.globalCompositeOperation='source-over';g.fillStyle='#fff6e0';g.beginPath();g.moveTo(bx,0);g.lineTo(bx+12,0);g.lineTo(bx+2,84);g.lineTo(bx-10,84);g.fill();g.globalCompositeOperation='destination-in';g.drawImage(MN.tt,0,0);g.globalCompositeOperation='source-over';ctx.globalAlpha=.85;ctx.drawImage(MN.tmp,X,Y)}
ctx.globalAlpha=1;
if(a>=1)MN.drips.forEach((q,i)=>{const p=(t*.32+i*.37)%1,x=X+q[0],y=Y+q[1];if(p<.72){const L=Math.round(p/.72*13);ctx.fillStyle='#750048';ctx.fillRect(x,y,1,L);ctx.fillStyle=RD;ctx.fillRect(x,y+L-1,1,2);ctx.fillRect(x-1,y+L,3,1)}else if(p<.95){const d=y+13+Math.round(Math.pow((p-.72)/.23,2)*40);ctx.fillStyle=RD;ctx.fillRect(x,d,1,2)}});
ctx.globalAlpha=a;mnOut('SANTOS CONTRA DEMONIOS',240,86,CR,1,1);ctx.fillStyle=dp(RD,9);ctx.fillRect(184,96,112,1);ctx.fillStyle=CR;ctx.fillRect(238,94,5,5);ctx.fillStyle=NV;ctx.fillRect(239,95,3,3);ctx.fillStyle=RD;ctx.fillRect(240,96,1,1);ctx.fillRect(179,96,5,1);ctx.fillRect(296,96,5,1);ctx.globalAlpha=1;
}
/* menu */
for(let i=0;i<3;i++){const p=mnCl((ti-1.9-i*.2)/.35,0,1);if(p<=0)continue;const s=i==MN.sel,y=mnRowY(i),xo=Math.round((1-p)*(1-p)*18),lbl=MN_IT[i][0],w=tw(lbl,2),xr=286+xo;
ctx.globalAlpha=p;
if(s){ctx.fillStyle=dp('#750048',6);ctx.fillRect(xr-w-8,y-3,w+30,15);ctx.fillStyle=dp(RD,5);ctx.fillRect(xr-w-8,y+11,w+30,1)}
mnOut(lbl,xr,y,s?(Math.sin(t*9)>0?CR:'#ff98a6'):RD,2,2);
if(s){mnIcon(xr+4,y-1+((t*4|0)&1))}
ctx.globalAlpha=1;if(p>=1)btns.push({x:200,y:y-4,w:106,h:16,fn:()=>{MN.sel=i;mnPick(i)},dis:false,k:'mn'+i})}
{const ph=(t+2)%9.3,f=ph<.1?1:ph<.2?.2:ph<.4?(1-(ph-.2)/.2)*.7:0;if(f>0&&!SV.rf&&ti>3){if(!MN.lf){MN.lf=1;shk=Math.max(shk,.12)}dth(0,0,320,180,LV,Math.ceil(f*5))}else if(ph>.5)MN.lf=0}
if(ti<2.4)dth(0,0,320,180,'#030410',Math.ceil(16*(1-ti/2.4)))}
