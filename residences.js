/* Small, locally rendered architectural models. No remote assets or tracking. */
(()=>{
 'use strict';
 const TAU=Math.PI*2;
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const mix=(a,b,t)=>a+(b-a)*t;
 const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
 const rgb=hex=>{const n=parseInt(hex.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
 const blend=(a,b,t)=>a.map((v,i)=>mix(v,b[i],t));
 const color=(a,brightness=1)=>'rgb('+a.map(v=>Math.round(clamp(v*brightness,0,255))).join(',')+')';
 const hash=(a,b=0)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n);};
 const P=(x,y,z)=>[x,y,z];
 function surface(points,normal,paint,details=[],kind='building'){
  return {points,normal,paint:rgb(paint),details,kind,center:points.reduce((sum,p)=>sum.map((v,i)=>v+p[i]/points.length),[0,0,0])};
 }
 function quad(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3){return[P(x0,y0,z0),P(x1,y1,z1),P(x2,y2,z2),P(x3,y3,z3)];}
 function box(out,x,y,z,w,d,h,paints,options={}){
  const a=x-w/2,b=x+w/2,c=y-d/2,e=y+d/2,t=z+h;
  const front=paints.front||paints.wall,side=paints.side||paints.wall;
  const faces=[
   surface(quad(a,e,z,b,e,z,b,e,t,a,e,t),P(0,1,0),front,options.front||[],options.kind),
   surface(quad(b,e,z,b,c,z,b,c,t,b,e,t),P(1,0,0),side,options.right||[],options.kind),
   surface(quad(b,c,z,a,c,z,a,c,t,b,c,t),P(0,-1,0),side,[],options.kind),
   surface(quad(a,c,z,a,e,z,a,e,t,a,c,t),P(-1,0,0),front,[],options.kind)
  ];
  if(options.top!==false)faces.push(surface(quad(a,c,t,b,c,t,b,e,t,a,e,t),P(0,0,1),paints.roof||'#e2eaf1',options.roof||[],options.kind));
  out.push(...faces);return{a,b,c,e,t};
 }
 function patch(points,paint,type='',seed=0){return{points,paint:rgb(paint),type,seed};}
 function frontPatch(x,y,z,w,h,paint,type='',seed=0){return patch(quad(x-w/2,y,z,x+w/2,y,z,x+w/2,y,z+h,x-w/2,y,z+h),paint,type,seed);}
 function sidePatch(x,y,z,w,h,paint,type='',seed=0){return patch(quad(x,y-w/2,z,x,y+w/2,z,x,y+w/2,z+h,x,y-w/2,z+h),paint,type,seed);}
 function topPatch(x,y,z,w,d,paint,type=''){return patch(quad(x-w/2,y-d/2,z,x+w/2,y-d/2,z,x+w/2,y+d/2,z,x-w/2,y+d/2,z),paint,type);}
 function airConditioner(out,x,y,z,side=false,scale=1,floorNumber=0){
  const pieces=[],front=[],fan=[];
  for(let i=0;i<16;i++){const a=TAU*i/16;fan.push(P(-.9+Math.cos(a)*1.03,1.21,1.45+Math.sin(a)*1.03));}
  front.push(patch(fan,'#8da1b5'));
  for(let i=0;i<4;i++)front.push(frontPatch(-.9,1.23,.6+i*.48,2.2,.16,'#b8c7d7'));
  for(let i=0;i<4;i++)front.push(frontPatch(1.9,1.23,.7+i*.45,1,.12,'#a1b3c7'));
  box(pieces,0,0,0,6,2.3,2.9,{front:'#f5f7f8',side:'#cbd6e2',roof:'#ffffff'},{front,kind:'air-conditioning'});
  for(const bx of[-2,2])box(pieces,bx,-.1,-.6,.45,2.4,.6,{wall:'#a3b4c7',roof:'#b9c7d8'},{kind:'air-conditioning'});
  const point=p=>side?P(x+p[1]*scale,y-p[0]*scale,z+p[2]*scale):P(x+p[0]*scale,y+p[1]*scale,z+p[2]*scale);
  const normal=n=>side?P(n[1],-n[0],n[2]):n;
  out.push(...pieces.map(f=>({...f,points:f.points.map(point),center:point(f.center),normal:normal(f.normal),floorNumber,details:f.details.map(d=>({...d,points:d.points.map(point)}))})));
 }
 function rooftopShuttle(out,x,y,z){
  const point=p=>P(x+p[0],y+p[1],z+p[2]);
  function face(points,paint){
   const world=points.map(point),plane=polygonPlane(world);
   if(plane)out.push(surface(world,plane.normal,paint,[],'roof-macquette'));
  }
  function horizontalPrism(outline,bottom,height,paint){
   const top=outline.map(p=>P(p[0],p[1],bottom+height));
   face(top,paint);face([...outline].reverse().map(p=>P(p[0],p[1],bottom)),'#34475d');
   for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];face([P(a[0],a[1],bottom),P(b[0],b[1],bottom),P(b[0],b[1],bottom+height),P(a[0],a[1],bottom+height)],'#a5b6c9');}
  }
  box(out,x,y,z,20,20,.65,{wall:'#6382a2',roof:'#829bb6'},{kind:'roof-macquette'});
  for(const sy of[-6,7])box(out,x,y+sy,z+.65,2.2,3,3.8,{wall:'#879db4',roof:'#a7b8c9'},{kind:'roof-macquette'});
  horizontalPrism([[-3,6],[-15,-10],[-5,-12],[5,-12],[15,-10],[3,6]],4.9,.65,'#eff4fa');
  // A deliberately simplified display model: delta wings, fuselage and fin.
  const sections=[[-13,3.3,2.45],[-5,4.05,3.1],[8,2.8,2.4],[15,.55,.55]],rings=sections.map(([sy,rx,rz])=>Array.from({length:8},(_,i)=>{const a=TAU*i/8;return P(Math.sin(a)*rx,sy,7+Math.cos(a)*rz);}));
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<8;i++){
   const next=(i+1)%8,paint=j===2?'#34485e':Math.cos(TAU*(i+.5)/8)<-.35?'#354a62':'#f3f7fb';
   face([rings[j][i],rings[j][next],rings[j+1][next]],paint);face([rings[j][i],rings[j+1][next],rings[j+1][i]],paint);
  }
  face([...rings[0]].reverse(),'#566d87');face(rings[rings.length-1],'#263b52');
  const fin=[[-13,7],[-13,14],[-9,14],[-4,7]];
  face([...fin].reverse().map(p=>P(.55,p[0],p[1])),'#edf3fb');face(fin.map(p=>P(-.55,p[0],p[1])),'#c4d2e3');
  for(let i=0;i<fin.length;i++){const a=fin[i],b=fin[(i+1)%fin.length];face([P(-.55,a[0],a[1]),P(.55,a[0],a[1]),P(.55,b[0],b[1]),P(-.55,b[0],b[1])],'#344b64');}
  face([P(-1.9,4.7,9.8),P(1.9,4.7,9.8),P(1.5,8,9.45),P(-1.5,8,9.45)],'#28435f');
 }
 function tree(out,x,y,size){
  box(out,x,y,4,1.5,1.5,size*.65,{wall:'#738591',roof:'#a5b4b7'},{kind:'landscape'});
  const z=4+size*.45,s=size*.55,tip=P(x,y,z+size*.95);
  for(const [p,q,n] of [[P(x-s,y-s,z),P(x+s,y-s,z),P(0,-1,.35)],[P(x+s,y-s,z),P(x+s,y+s,z),P(1,0,.35)],[P(x+s,y+s,z),P(x-s,y+s,z),P(0,1,.35)],[P(x-s,y+s,z),P(x-s,y-s,z),P(-1,0,.35)]])out.push(surface([p,q,tip],n,'#5d9894',[],'landscape'));
 }
 function grounds(out,pyramid){
  const w=pyramid?222:196,d=pyramid?132:118;
  const roof=[topPatch(0,d/2-21,4.06,w-16,17,'#d7e1ed'),topPatch(0,d/2-21,4.08,w-16,1.1,'#b1c5df'),topPatch(0,-d/2+6,4.08,w-15,1,'#c8d8eb')];
  box(out,0,0,0,w,d,4,{front:'#cad8e8',side:'#9eafc6',roof:'#edf3fa'},{roof,kind:'platform'});
  box(out,0,d/2-.1,3.1,w-1,.5,.55,{wall:'#5b91dd',roof:'#86baf3'},{kind:'platform'});
  box(out,w/2-.1,0,3.1,.5,d-1,.55,{wall:'#5b91dd',roof:'#86baf3'},{kind:'platform'});
  tree(out,-w/2+17,d/2-18,14);tree(out,w/2-16,-d/2+14,12);
  for(const x of[-w/2+25,w/2-26]){
   box(out,x,d/2-23,4,1.4,1.4,9,{wall:'#7f91a8',roof:'#9eb0c5'},{kind:'landscape'});
   const q=box(out,x,d/2-23,13.2,4.5,4.5,.8,{wall:'#dce9fa',roof:'#eff7ff'},{kind:'lamp'});
   out.push(surface(quad(q.a,q.e,13.1,q.b,q.e,13.1,q.b,q.e,13.7,q.a,q.e,13.7),P(0,1,0),'#f1d7a0',[],'lamp-glow'));
  }
 }
 function dorm(){
  const out=[];grounds(out,false);
  const width=140,depth=54,floor=15.5,base=4;
  for(let row=0;row<5;row++){
   const z=base+row*floor,front=[],right=[];
   for(let col=0;col<10;col++){
    const x=-width/2+10+col*(width-20)/9;
    if(row===0&&Math.abs(x)<13)continue;
    front.push(frontPatch(x,depth/2+.05,z+4,7.3,8,'#456282','window',row*19+col));
    front.push(frontPatch(x+.1,depth/2+.08,z+4,0.45,8,'#bdcddd','mullion'));
    front.push(frontPatch(x,depth/2+.08,z+3.2,8.7,.7,'#c5cfdb'));
   }
   for(let col=0;col<3;col++){
    const y=-depth/2+10+col*17;
    right.push(sidePatch(width/2+.06,y,z+4,6.5,8,'#425d7c','window',row*13+col+90));
    right.push(sidePatch(width/2+.09,y+.1,z+4,.4,8,'#b2c4d6','mullion'));
   }
   front.push(frontPatch(0,depth/2+.1,z+.45,width,1.2,'#c7d5e5'));
   right.push(sidePatch(width/2+.1,0,z+.45,depth,1.2,'#b9c9df'));
   box(out,0,0,z,width,depth,floor,{front:row%2?'#edf0ef':'#e6eaf0',side:'#d2dce7',roof:'#dbe5ee'},{front,right,top:row===4});
   if(row>=3){
    for(const col of[0,3,6,9])airConditioner(out,-width/2+10+col*(width-20)/9,depth/2+1.2,z+.8,false,1,row+1);
    for(const wy of[-17,17])airConditioner(out,width/2+1.2,wy,z+.8,true,1,row+1);
   }
  }
  // An enclosed entrance, roof parapet and rooftop service blocks.
  const top=base+floor*5;
  box(out,0,0,top,143,57,2.7,{wall:'#aabbd0',roof:'#e2ecf7'});
  box(out,0,0,top+2.7,135,49,.8,{wall:'#718aa7',roof:'#91a6bf'});
  for(const x of[-44,20,43])box(out,x,-10,top+3.5,8,8,4,{wall:'#b9c9d9',roof:'#e2eaf2'});
  box(out,0,depth/2+3,base,18,7,13,{wall:'#275b91',roof:'#487bb1'},{front:[frontPatch(-3.6,depth/2+6.55,base+.5,5.8,10.5,'#618daf','door'),frontPatch(3.6,depth/2+6.55,base+.5,5.8,10.5,'#618daf','door')]});
  box(out,0,depth/2+5,base+13,23,12,1.8,{wall:'#3c7cca',roof:'#84b9ef'});
  box(out,0,depth/2+8,base,25,12,1.2,{wall:'#b5c7dc',roof:'#d7e4f1'},{kind:'landscape'});
  box(out,0,depth/2+10,base,29,13,.6,{wall:'#acbfd5',roof:'#dce7f3'},{kind:'landscape'});
  return{faces:out,yaw:.57,platformWidth:196,pyramid:false};
 }
 function pyramid(){
  const out=[];grounds(out,true);
  const base=4,floor=5.4,depth=67;
  for(let row=0;row<18;row++){
   const width=153-row*6.4,d=depth-row*.9,x=-13+row*1.15,y=-8-row*.12,z=base+row*floor,front=[],right=[];
   const count=Math.max(3,Math.floor((width-7)/8.7));
   for(let col=0;col<count;col++){
    const wx=x-width/2+6+col*(width-12)/(count-1);
    front.push(frontPatch(wx,y+d/2+.05,z+1.15,3.3,2.9,'#344b63','window',row*17+col));
   }
   for(let col=0;col<6;col++){
    const wy=y-d/2+5+col*(d-10)/5;
    right.push(sidePatch(x+width/2+.06,wy,z+1.15,3.1,2.9,'#34475f','window',row*13+col+210));
   }
   if(row===8||row===9){front.length=0;front.push(frontPatch(x,y+d/2+.08,z+.55,width-1,4.2,'#55758c','glass',row));for(let j=0;j<count;j++)front.push(frontPatch(x-width/2+5+j*(width-10)/(count-1),y+d/2+.1,z+.55,.35,4.2,'#a7b8c5','mullion'));}
   front.push(frontPatch(x,y+d/2+.1,z+floor-.5,width,.45,'#e6e0d2'));
   const dark=[0,6,12,17].includes(row);
   box(out,x,y,z,width,d,floor,{front:dark?'#7b7773':'#c9c6b9',side:dark?'#6b6c6c':'#b4b5ae',roof:'#e5e0d3'},{front,right});
   if(row>=12){
    for(const col of[0,count-1])airConditioner(out,x-width/2+6+col*(width-12)/(count-1),y+d/2+.62,z+.1,false,.46,row+1);
    airConditioner(out,x+width/2+.62,y,z+.1,true,.46,row+1);
   }
   // Thin terrace lips preserve the characteristic stepped silhouette.
   if(row<17&&row%2===0)box(out,x-width/2+.45,y,z+floor,1,Math.max(12,d-4),1.4,{wall:'#bdc3c5',roof:'#e2e6e3'});
  }
  const top=base+18*floor;
  box(out,7,-11,top,40,49,4,{wall:'#3b4658',roof:'#6c819b'});
  rooftopShuttle(out,7,-11,top+4);
  // The lower side wing seen beside the main stepped building.
  for(let row=0;row<9;row++){
   const z=base+row*5.4,front=[],right=[];
   for(let c=0;c<3;c++)front.push(frontPatch(63+c*7,21.04,z+1.2,3.1,2.9,'#3f5268','window',row*12+c+410));
   for(let c=0;c<4;c++)right.push(sidePatch(87.04,-16+c*10,z+1.2,3.1,2.9,'#3b4e64','window',row*11+c+510));
   box(out,74,-2,z,26,46,5.4,{front:row===8?'#686c71':'#cbc7b8',side:'#b0b4b1',roof:'#dce0dc'},{front,right,top:row===8});
  }
  box(out,35,31,base,20,12,13,{wall:'#406684',roof:'#7d9bb6'},{front:[frontPatch(31,37.05,base+.7,6,10,'#6491ad','door'),frontPatch(39,37.05,base+.7,6,10,'#6491ad','door')]});
  box(out,35,32,base+13,25,17,1.3,{wall:'#6c8aa4',roof:'#b6d1e2'});
  return{faces:out,yaw:.57,platformWidth:222,pyramid:true};
 }
 function camera(yaw,pitch){
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  return{eye:[sy*cp,cy*cp,sp],project:p=>[p[0]*cy-p[1]*sy,(p[0]*sy+p[1]*cy)*sp-p[2]*cp],depth:p=>(p[0]*sy+p[1]*cy)*cp+p[2]*sp};
 }
 // Partition intersecting polygons once, then paint from back to front for
 // the current eye position. Centroid sorting cannot resolve a large wall
 // against a small step or tree, even though both meshes are valid.
 const PLANE_EPSILON=.00001;
 const dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 function polygonPlane(points){
  const a=points[0],u=points[1].map((v,i)=>v-a[i]);
  for(let j=2;j<points.length;j++){
   const v=points[j].map((n,i)=>n-a[i]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],length=Math.hypot(...n);
   if(length>PLANE_EPSILON){const normal=n.map(x=>x/length);return{normal,w:dot3(normal,a)};}
  }
  return null;
 }
 function classifyPolygon(face,plane){
  let type=0;
  for(const p of face.points){const d=dot3(plane.normal,p)-plane.w;type|=d>PLANE_EPSILON?1:d<-PLANE_EPSILON?2:0;}
  return type;
 }
 function splitPolygon(face,plane,front,back){
  const distances=face.points.map(p=>dot3(plane.normal,p)-plane.w),types=distances.map(d=>d>PLANE_EPSILON?1:d<-PLANE_EPSILON?2:0),f=[],b=[];
  for(let i=0;i<face.points.length;i++){
   const j=(i+1)%face.points.length,p=face.points[i],q=face.points[j],type=types[i];
   if(type!==2)f.push(p);if(type!==1)b.push(p);
   if((type|types[j])===3){const t=distances[i]/(distances[i]-distances[j]),intersection=p.map((v,k)=>mix(v,q[k],t));f.push(intersection);b.push(intersection);}
  }
  for(const [points,target] of[[f,front],[b,back]])if(points.length>=3&&polygonPlane(points))target.push({...face,points,clipped:true});
 }
 function choosePartition(faces){
  let best=faces[0].plane,score=Infinity;
  const stride=Math.max(1,Math.floor(faces.length/22));
  for(let i=0;i<faces.length;i+=stride){
   const plane=faces[i].plane;let front=0,back=0,splits=0;
   for(const face of faces){const type=classifyPolygon(face,plane);if(type===1)front++;else if(type===2)back++;else if(type===3)splits++;}
   const cost=splits*5+Math.abs(front-back)*.45;
   if(cost<score){score=cost;best=plane;}if(cost===0)break;
  }
  return best;
 }
 function buildPartition(faces){
  if(!faces.length)return null;
  const plane=choosePartition(faces),coplanar=[],front=[],back=[];
  for(const face of faces){const type=classifyPolygon(face,plane);if(type===0)coplanar.push(face);else if(type===1)front.push(face);else if(type===2)back.push(face);else splitPolygon(face,plane,front,back);}
  return{plane,faces:coplanar,front:buildPartition(front),back:buildPartition(back)};
 }
 function orderedFaces(model,eye){
  if(!model.partition)model.partition=buildPartition(model.faces.map((face,sourceIndex)=>({...face,sourceIndex,outline:face.points,plane:polygonPlane(face.points)})).filter(face=>face.plane));
  const result=[],viewpoint=eye.map(v=>v*100000);
  function visit(node){
   if(!node)return;
   const front=dot3(node.plane.normal,viewpoint)>=node.plane.w;
   visit(front?node.back:node.front);
   for(const face of node.faces)if(dot3(face.normal,eye)>.001)result.push(face);
   visit(front?node.front:node.back);
  }
  visit(model.partition);return result;
 }
 function paintModel(ctx,model,view){
  const {width,height,yaw,pitch,night,dark,accent}=view;
  const cam=camera(yaw,pitch),dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const baseCam=camera(model.yaw,.42);
  const reference=model.faces.flatMap(face=>face.points.map(baseCam.project));
  const bounds=reference.reduce((b,p)=>[Math.min(b[0],p[0]),Math.min(b[1],p[1]),Math.max(b[2],p[0]),Math.max(b[3],p[1])],[Infinity,Infinity,-Infinity,-Infinity]);
  const scale=Math.min((width-26)/(bounds[2]-bounds[0]),(height-37)/(bounds[3]-bounds[1]));
  const cx=width/2-(bounds[0]+bounds[2])/2*scale,cy=(height-19)/2-(bounds[1]+bounds[3])/2*scale;
  const project=p=>{const v=cam.project(p);return[cx+v[0]*scale,cy+v[1]*scale];};
  const path=points=>{ctx.beginPath();points.forEach((p,i)=>{const v=project(p);if(i)ctx.lineTo(...v);else ctx.moveTo(...v);});ctx.closePath();};
  ctx.clearRect(0,0,width,height);
  const ground=project([0,0,0]);
  // Grounding shadow and a restrained pool of reflected light.
  ctx.save();ctx.translate(ground[0]+5,ground[1]+7);ctx.scale(1,.35);const shadow=ctx.createRadialGradient(0,0,8,0,0,model.platformWidth*scale*.55);shadow.addColorStop(0,dark?'rgba(0,0,0,.42)':'rgba(40,67,105,.21)');shadow.addColorStop(1,'rgba(20,40,65,0)');ctx.fillStyle=shadow;ctx.beginPath();ctx.arc(0,0,model.platformWidth*scale*.55,0,TAU);ctx.fill();ctx.restore();
  if(night>.02){ctx.save();ctx.globalAlpha=night*.16;ctx.translate(ground[0],ground[1]+1);ctx.scale(1,.32);const glow=ctx.createRadialGradient(0,0,3,0,0,model.platformWidth*scale*.57);glow.addColorStop(0,color(accent));glow.addColorStop(1,'rgba(40,120,230,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,model.platformWidth*scale*.57,0,TAU);ctx.fill();ctx.restore();}
  const light=[-.25+view.pointerX*.1,.55,.8];
  const faces=orderedFaces(model,cam.eye);
  for(const face of faces){
   if(face.clipped){ctx.save();path(face.points);ctx.clip();}
   const illumination=.78+Math.max(0,dot(face.normal,light))*.24;
   const nightPaint=blend(face.paint,[51,76,112],face.kind==='roof-macquette'?(dark?.32:.18):(dark?.63:.31));
   let fill=blend(face.paint,nightPaint,night);
   if(face.kind==='platform')fill=blend(fill,dark?[45,66,96]:[206,220,237],night*.65);
   if(face.kind==='lamp-glow')fill=blend(fill,[255,215,143],night);
   path(face.points);ctx.fillStyle=color(fill,illumination);ctx.fill();
   path(face.outline||face.points);ctx.strokeStyle=dark?'rgba(130,168,211,.075)':'rgba(43,68,103,.08)';ctx.lineWidth=.45;ctx.stroke();
   for(const detail of face.details){
    let tone=detail.paint;
    if(detail.type==='window'||detail.type==='glass'){
     const lit=hash(detail.seed,model.pyramid?7:2)>.51;
     const delay=hash(detail.seed,3)*.56;
     const amount=smooth((night-delay)/(1-delay));
     tone=blend(detail.paint,lit?[255,211+hash(detail.seed)*18,145]:[36,60,91],amount);
    }else if(detail.type==='door')tone=blend(detail.paint,[255,220,157],night*.8);
    else tone=blend(detail.paint,dark?[57,86,125]:[138,157,181],night*(detail.type==='mullion'?.65:.35));
    path(detail.points);ctx.fillStyle=color(tone,detail.type==='window'?1:illumination);ctx.fill();
    if(detail.type==='glass'){
     ctx.save();path(detail.points);ctx.clip();ctx.globalAlpha=.12*(1-night);ctx.strokeStyle='#e2f5ff';ctx.lineWidth=3;
     const p=project(detail.points[0]);ctx.beginPath();ctx.moveTo(p[0]+5,p[1]+12);ctx.lineTo(p[0]+85,p[1]-38);ctx.moveTo(p[0]+42,p[1]+12);ctx.lineTo(p[0]+122,p[1]-38);ctx.stroke();ctx.restore();
    }
   }
   if(face.clipped)ctx.restore();
  }
 }
 // Reuse exactly the same geometry and renderer for static visual checks.
 if(typeof document==='undefined'){if(typeof module!=='undefined')module.exports={dorm,pyramid,paintModel,rgb,camera,orderedFaces};return;}
 const cards=[...document.querySelectorAll('.residence-card')];if(!cards.length)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
 const names={kallisto:'Каллисто',ganimed:'Ганимед',piramida:'Пирамида'};
 const scenes=[];
 for(const card of cards){
  const button=card.querySelector('.residence-model'),canvas=card.querySelector('canvas'),ctx=canvas.getContext('2d');
  if(!ctx){button.hidden=true;continue;}
  const key=card.dataset.residence,model=key==='piramida'?pyramid():dorm();if(key==='ganimed')model.yaw=.7;
  const accent=rgb(key==='ganimed'?'#36aee1':key==='piramida'?'#8680ef':'#448eef');
  let width=0,height=0,dpr=1,visible=false,frame=0,previous=0,px=0,py=0,tx=0,ty=0,night=0,targetNight=0,manual=null,themeDark=false,kick=0;
  function syncLabel(){
   const on=targetNight===1;card.classList.toggle('is-night',on);button.setAttribute('aria-pressed',String(on));
   button.setAttribute('aria-label',(on?'Выключить':'Включить')+' вечернюю подсветку: '+names[key]);
   button.title=on?'Выключить вечернюю подсветку':'Включить вечернюю подсветку';
   card.querySelector('[data-residence-light]').textContent=on?'Вечер':'День';
   card.querySelector('[data-residence-hint]').textContent=on?'Нажми — выключить свет':'Нажми — включить свет';
  }
  function draw(){if(!width||!height)return;ctx.setTransform(dpr,0,0,dpr,0,0);paintModel(ctx,model,{width,height,yaw:model.yaw+px*.13+kick*.035,pitch:.42+py*.055,night,dark:themeDark,accent,pointerX:px});}
  function tick(now){
   frame=0;if(!visible||document.hidden)return;
   const dt=previous?Math.min(48,now-previous):16;previous=now;
   const easing=1-Math.exp(-dt/110),lightEasing=1-Math.exp(-dt/230);
   px=mix(px,tx,easing);py=mix(py,ty,easing);night=mix(night,targetNight,lightEasing);kick*=Math.exp(-dt/240);
   if(Math.abs(px-tx)<.001)px=tx;if(Math.abs(py-ty)<.001)py=ty;if(Math.abs(night-targetNight)<.001)night=targetNight;if(Math.abs(kick)<.001)kick=0;
   draw();if(px!==tx||py!==ty||night!==targetNight||kick!==0)frame=requestAnimationFrame(tick);
  }
  function request(){if(reduced.matches){px=tx=0;py=ty=0;night=targetNight;kick=0;draw();return;}if(visible&&!document.hidden&&!frame){previous=0;frame=requestAnimationFrame(tick);}}
  function setTheme(){themeDark=document.documentElement.dataset.theme==='dark';targetNight=manual===null?(themeDark?1:0):manual;syncLabel();request();if(!visible){night=targetNight;draw();}}
  function resize(){const r=button.getBoundingClientRect();width=r.width;height=r.height;dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.max(1,Math.round(height*dpr));draw();}
  button.addEventListener('pointermove',event=>{
   if(reduced.matches||!fine.matches||event.pointerType==='touch')return;
   const r=button.getBoundingClientRect();tx=clamp((event.clientX-r.left)/r.width*2-1,-1,1);ty=clamp((event.clientY-r.top)/r.height*2-1,-1,1);
   card.style.setProperty('--light-x',((tx+1)*50).toFixed(1)+'%');card.style.setProperty('--light-y',((ty+1)*35).toFixed(1)+'%');request();
  });
  button.addEventListener('pointerleave',()=>{tx=ty=0;card.style.removeProperty('--light-x');card.style.removeProperty('--light-y');request();});
  button.addEventListener('blur',()=>{tx=ty=0;request();});
  button.addEventListener('click',()=>{manual=targetNight?0:1;targetNight=manual;kick=reduced.matches?0:1;syncLabel();request();});
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(button);else window.addEventListener('resize',resize,{passive:true});
  const scene={card,setTheme,request,setVisible(value){visible=value;if(value){card.classList.add('is-visible');request();}else if(frame){cancelAnimationFrame(frame);frame=0;}}};
  scenes.push(scene);setTheme();resize();
 }
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)scenes.find(s=>s.card===entry.target)?.setVisible(entry.isIntersecting);},{rootMargin:'70px',threshold:0});scenes.forEach(s=>observer.observe(s.card));}else scenes.forEach(s=>s.setVisible(true));
 new MutationObserver(()=>scenes.forEach(s=>s.setTheme())).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 reduced.addEventListener('change',()=>scenes.forEach(s=>s.request()));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)scenes.forEach(s=>s.request());});
})();
