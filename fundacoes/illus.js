const sharp=require('sharp');const OUT=__dirname+'/img/';
const DEFS=`<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC3DE"/><stop offset="1" stop-color="#F3E3C8"/></linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E8BA6"/><stop offset="1" stop-color="#2F6680"/></linearGradient>
<pattern id="sand" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#D8B472"/><circle cx="4" cy="5" r="1.6" fill="#B8924E"/><circle cx="13" cy="12" r="1.3" fill="#C29C58"/><circle cx="9" cy="2" r="0.9" fill="#E9CC93"/><circle cx="15" cy="4" r="1" fill="#A88346"/></pattern>
<pattern id="clay" width="40" height="16" patternUnits="userSpaceOnUse"><rect width="40" height="16" fill="#5E7E8E"/><path d="M0 8 Q10 4 20 8 T40 8" stroke="#4C6A79" stroke-width="2" fill="none"/></pattern>
<pattern id="firm" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#7F8F5E"/><path d="M0 22 L22 0" stroke="#6B7A4D" stroke-width="2"/><circle cx="6" cy="6" r="2" fill="#93A272"/></pattern>
<linearGradient id="conc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ECE7DD"/><stop offset="1" stop-color="#D4CEC2"/></linearGradient>
<linearGradient id="conc2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9DCC6"/><stop offset="1" stop-color="#CDBEA5"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5D7F93"/><stop offset="1" stop-color="#3A5566"/></linearGradient>
<radialGradient id="bulb" cx="0.5" cy="0.25" r="0.75"><stop offset="0" stop-color="#C4572B" stop-opacity="0.85"/><stop offset="1" stop-color="#C4572B" stop-opacity="0.05"/></radialGradient>
<linearGradient id="steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5B6770"/><stop offset="0.5" stop-color="#A9B4BA"/><stop offset="1" stop-color="#4A555D"/></linearGradient>
</defs>`;
function bldg(x,base,w,floors,tilt=0,fill='url(#conc)',fh=30){const h=floors*fh+40;let s=`<g transform="rotate(${tilt} ${x+w/2} ${base})">`;
 s+=`<rect x="${x+8}" y="${base-h+8}" width="${w}" height="${h}" fill="#000" opacity="0.18"/>`;
 s+=`<rect x="${x}" y="${base-h}" width="${w}" height="${h}" fill="${fill}" stroke="#9A9284" stroke-width="1.5"/>`;
 s+=`<rect x="${x+w*0.3}" y="${base-h-26}" width="${w*0.4}" height="26" fill="#CFC8BA" stroke="#9A9284"/>`;
 s+=`<rect x="${x-4}" y="${base-h-6}" width="${w+8}" height="8" fill="#B9B1A3"/>`;
 const cols=Math.max(2,Math.floor(w/34));const cw=(w-16)/cols;
 for(let f=0;f<floors;f++){const y=base-h+14+f*fh;
  for(let c=0;c<cols;c++)s+=`<rect x="${x+8+c*cw+4}" y="${y}" width="${cw-8}" height="${fh*0.55}" fill="url(#glass)"/>`;
  s+=`<rect x="${x+4}" y="${y+fh*0.6}" width="${w-8}" height="3" fill="#A79F91"/>`;}
 s+=`<rect x="${x}" y="${base-26}" width="${w}" height="26" fill="#7D776C"/>`;
 for(let c=0;c<4;c++)s+=`<rect x="${x+6+c*(w-12)/3.2}" y="${base-26}" width="6" height="26" fill="#5A554C"/>`;
 return s+'</g>';}
function palm(x,y,h=110){let s=`<path d="M${x} ${y} Q${x+8} ${y-h/2} ${x+3} ${y-h}" stroke="#7A5B3A" stroke-width="7" fill="none"/>`;
 [-150,-120,-60,-30,-90,200,-10].forEach(a=>{const r=a*Math.PI/180,ex=x+3+Math.cos(r)*55,ey=y-h+Math.sin(r)*30+18;s+=`<path d="M${x+3} ${y-h} Q${(x+3+ex)/2} ${y-h-20} ${ex} ${ey}" stroke="#3E6B3A" stroke-width="9" fill="none" stroke-linecap="round"/>`;});return s;}
function soil(x,y,w,hs,labels=[],fs=26){let s='',yy=y;['sand','clay','firm'].forEach((p,i)=>{if(!hs[i])return;s+=`<rect x="${x}" y="${yy}" width="${w}" height="${hs[i]}" fill="url(#${p})"/>`;
 if(labels[i])s+=`<text x="${x+w-20}" y="${yy+hs[i]/2+fs/3}" text-anchor="end" font-family="DejaVu Sans" font-weight="bold" font-size="${fs}" fill="#fff" stroke="#00000055" stroke-width="0.6">${labels[i]}</text>`;yy+=hs[i];});return s;}
const svg=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}${body}</svg>`;
const txt=(x,y,t,o={})=>`<text x="${x}" y="${y}" font-family="DejaVu Sans" font-size="${o.fs||24}" font-weight="${o.b?'bold':'normal'}" fill="${o.c||'#17212B'}" text-anchor="${o.a||'start'}">${t}</text>`;
const scenes={};
// ORLA
{let b=`<rect width="1600" height="900" fill="url(#sky)"/>`;
 const bs=[[40,190,14,0,'url(#conc)'],[250,200,16,-2.2,'url(#conc2)'],[470,180,13,2.6,'url(#conc)'],[670,210,17,-1.6,'url(#conc2)'],[900,190,12,0,'url(#conc)'],[1110,200,15,3.0,'url(#conc2)'],[1330,220,16,-2.4,'url(#conc)']];
 bs.forEach(q=>b+=bldg(q[0],700,q[1],q[2],q[3],q[4]));
 b+=`<rect y="700" width="1600" height="40" fill="#6E6A64"/><rect y="716" width="1600" height="4" fill="#E8E2D2" stroke-dasharray="30 20" stroke="#EEE" />`;
 b+=`<rect y="740" width="1600" height="60" fill="#5F8A4E"/>`;for(let i=0;i<9;i++)b+=palm(80+i*185,790,120+((i*37)%30));
 b+=`<rect y="800" width="1600" height="60" fill="url(#sand)"/><rect y="860" width="1600" height="40" fill="url(#sea)"/>`;
 scenes.orla=svg(1600,900,b);}
// PERFIL
{let b=soil(0,0,900,[300,600,200],['AREIA FINA','ARGILA MARINHA MOLE','SOLO RESISTENTE'],34);
 b+=`<rect x="150" y="0" width="280" height="40" fill="#2B2B2B"/>`;
 scenes.perfil=svg(900,1100,b);}
// FUNDACAO
{let b=`<rect width="1400" height="420" fill="url(#sky)"/>`+soil(0,420,1400,[190,380,0]);
 [220,690,1160].forEach(x=>b+=`<ellipse cx="${x}" cy="610" rx="190" ry="300" fill="url(#bulb)" stroke="#C4572B" stroke-dasharray="10 8" stroke-width="3"/>`);
 b+=bldg(150,380,1100,9);
 [220,690,1160].forEach(x=>b+=`<rect x="${x-18}" y="380" width="36" height="60" fill="#3A3A3A"/><rect x="${x-90}" y="440" width="180" height="34" fill="#2B2B2B"/>`);
 b+=txt(30,520,'areia',{fs:30,b:1,c:'#fff'})+txt(30,760,'argila mole',{fs:30,b:1,c:'#fff'});
 scenes.fundacao=svg(1400,990,b);}
// BULBOS
{let b=`<rect width="1400" height="460" fill="url(#sky)"/>`+soil(0,460,1400,[180,330,90]);
 b+=`<ellipse cx="360" cy="680" rx="330" ry="300" fill="url(#bulb)" stroke="#C4572B" stroke-dasharray="10 8" stroke-width="3"/><ellipse cx="1040" cy="680" rx="330" ry="300" fill="url(#bulb)" stroke="#C4572B" stroke-dasharray="10 8" stroke-width="3"/>`;
 b+=bldg(120,460,440,13,1.6)+bldg(840,460,440,13,-1.6,'url(#conc2)');
 b+=`<rect x="610" y="640" width="180" height="70" rx="12" fill="#17212B"/>`+txt(700,684,'sobreposição',{fs:24,b:1,c:'#fff',a:'middle'});
 b+=`<path d="M700 520 L700 625" stroke="#C4572B" stroke-width="8" marker-end=""/><polygon points="684,620 716,620 700,640" fill="#C4572B"/>`;
 scenes.bulbos=svg(1400,1060,b);}
// MECANISMO
[0,2.5,5.5].forEach((t,i)=>{let b=`<rect width="700" height="560" fill="url(#sky)"/>`+soil(0,560,700,[90,190,0]);
 if(i)b+=`<ellipse cx="${t>3?470:440}" cy="600" rx="160" ry="120" fill="url(#bulb)"/>`;
 b+=bldg(230,560+t*4,240,15,t,'url(#conc)',29);b+=`<line x1="350" y1="60" x2="350" y2="560" stroke="#17212B" stroke-width="3" stroke-dasharray="12 8"/>`;
 scenes['mec'+(i+1)]=svg(700,840,b);});
// REFORCO
{let b=`<rect width="1400" height="480" fill="url(#sky)"/>`+soil(0,480,1400,[170,330,200]);
 const t=2.2,ty=x=>412+(x-700)*Math.tan(t*Math.PI/180);
 [380,1020].forEach(x=>{b+=`<rect x="${x-26}" y="470" width="52" height="720" fill="url(#steel)" stroke="#3B444A"/><rect x="${x-50}" y="455" width="100" height="22" fill="#555"/>`;
  const top=ty(x)+12;b+=`<rect x="${x-30}" y="${top+14}" width="60" height="${455-top-14}" rx="6" fill="#C4572B" stroke="#7A2F12" stroke-width="3"/><rect x="${x-14}" y="${top}" width="28" height="16" fill="#888"/>`;});
 b+=`<g transform="rotate(${t} 700 400)"><rect x="260" y="400" width="880" height="24" fill="#2B2B2B"/></g>`;
 b+=bldg(300,400,800,9,t);
 b+=`<line x1="700" y1="30" x2="700" y2="400" stroke="#17212B" stroke-width="3" stroke-dasharray="12 8"/>`;
 b+=`<path d="M1110 330 L1110 230" stroke="#C4572B" stroke-width="10"/><polygon points="1090,240 1130,240 1110,205" fill="#C4572B"/>`;
 b+=txt(30,520,'areia',{fs:28,b:1,c:'#fff'})+txt(30,830,'argila mole',{fs:28,b:1,c:'#fff'})+txt(30,1100,'solo resistente',{fs:28,b:1,c:'#fff'});
 scenes.reforco=svg(1400,1180,b);}
// ANTES / DEPOIS
[0,1].forEach(i=>{let b=`<rect width="700" height="480" fill="url(#sky)"/>`+soil(0,480,700,[110,260,150]);
 if(i){[230,470].forEach(x=>b+=`<rect x="${x-14}" y="480" width="28" height="500" fill="url(#steel)" stroke="#3B444A"/>`);b+=`<rect x="170" y="472" width="360" height="26" fill="#2B2B2B"/>`;b+=bldg(200,472,300,13);}
 else{b+=`<ellipse cx="370" cy="560" rx="200" ry="200" fill="url(#bulb)"/><g transform="rotate(4 350 490)"><rect x="160" y="482" width="380" height="24" fill="#2B2B2B"/></g>`+bldg(200,488,300,13,4);}
 scenes[i?'depois':'antes']=svg(700,1000,b);});
(async()=>{for(const[k,v] of Object.entries(scenes))await sharp(Buffer.from(v),{density:96}).png().toFile(OUT+k+'.png');})();
