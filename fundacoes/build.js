const pptxgen = require('pptxgenjs');
const { applyTheme } = require("/root/.claude/skills/synced/e742b812-0cc9-40f0-ab0c-3a8d09290b97_d5b90541-8fca-467d-8ebd-c421c8d11c08/pptx/scripts/apply_theme.js");
const HEX={dark:"17212B",sand:"D9B26F",clay:"5B7C8D",clayD:"3E5A68",rust:"C4572B",light:"F3F5F6",grey:"6B7780",firm:"7F8F5E",white:"FFFFFF"};
const THEME={name:"Fundacoes",headFontFace:"Cambria",bodyFontFace:"Calibri",colors:{dk1:"1E262D",lt1:"FFFFFF",dk2:HEX.dark,lt2:HEX.light,accent1:HEX.rust,accent2:HEX.clay,accent3:HEX.sand,accent4:HEX.firm,accent5:"8C2F2F",accent6:HEX.grey,hlink:HEX.rust,folHlink:HEX.clay}};
const IMG=__dirname+"/img/";
const pres=new pptxgen(); pres.layout="LAYOUT_WIDE"; pres.theme={headFontFace:"Cambria",bodyFontFace:"Calibri"};
const C=pres.SchemeColor, SH=pres.shapes;
pres.defineSlideMaster({title:"DARK",background:{color:C.text2},objects:[]});
pres.defineSlideMaster({title:"CONTENT",background:{color:C.background1},slideNumber:{x:12.5,y:7.0,w:0.5,h:0.3,fontSize:10,color:C.accent6},objects:[
 {placeholder:{options:{name:"title",type:"title",x:0.6,y:0.35,w:12.1,h:0.8,fontSize:30,bold:true,color:C.text2,valign:"middle",align:"left"},text:""}},
 {placeholder:{options:{name:"body",type:"body",x:0.6,y:1.1,w:12.1,h:0.45,fontSize:15,italic:true,color:C.accent1,valign:"top",align:"left"},text:""}}]});
let sec; const S=(t,sub)=>{const s=pres.addSlide({masterName:"CONTENT",sectionTitle:sec}); s.addText(t,{placeholder:"title"}); if(sub) s.addText(sub,{placeholder:"body"}); return s;};
const T=(s,text,o)=>s.addText(text,Object.assign({isTextBox:true,margin:0,fontSize:14,color:C.text1,valign:"top"},o));
const R=(s,x,y,w,h,color,o={})=>s.addShape(o.round?SH.ROUNDED_RECTANGLE:SH.RECTANGLE,Object.assign({x,y,w,h,fill:{color,transparency:o.tr||0},line:{color:o.lc||color,width:o.lw||0.75}},o.round?{rectRadius:0.08}:{},o.rot?{rotate:o.rot}:{}));
const line=(s,x,y,w,h,color,o={})=>s.addShape(SH.LINE,{x,y,w,h,flipH:!!o.flipH,line:{color,width:o.width||1.5,dashType:o.dash||"solid",endArrowType:o.arrow||"none",beginArrowType:o.barrow||"none"}});
const num=(s,x,y,n,color=C.accent1)=>{s.addShape(SH.OVAL,{x,y,w:0.5,h:0.5,fill:{color},line:{color}});T(s,String(n),{x,y,w:0.5,h:0.5,align:"center",valign:"middle",bold:true,fontSize:16,color:C.background1});};
// building with windows, optional tilt (draw windows only if not tilted)
function bldg(s,x,base,w,h,color,rot=0){R(s,x,base-h,w,h,color,{rot});
 if(!rot){const cols=Math.max(2,Math.round(w/0.35)),rows=Math.round(h/0.4);for(let r=0;r<rows-1;r++)for(let c=0;c<cols;c++)R(s,x+0.12+c*(w-0.24)/cols,base-h+0.15+r*0.4,(w-0.24)/cols-0.08,0.2,HEX.sand,{tr:30});}}
function soil(s,x,y,w,hs,labels,fs=13){let yy=y;const cols=[HEX.sand,HEX.clay,HEX.firm];hs.forEach((h,i)=>{R(s,x,yy,w,h,cols[i]);if(labels&&labels[i])T(s,labels[i],{x:x+0.15,y:yy+0.08,w:w-0.3,h:h-0.1,fontSize:fs,bold:true,color:C.background1,valign:i==1?"middle":"top"});yy+=h;});}

/* 1 CAPA */
sec="Abertura"; pres.addSection({title:sec});
let s=pres.addSlide({masterName:"DARK",sectionTitle:sec});
s.addImage({path:IMG+"orla.png",x:6.9,y:0,w:6.43,h:7.5,sizing:{type:"cover",w:6.43,h:7.5},altText:"Ilustração de prédios inclinados na orla"});
T(s,"ESTUDO DE CASO · FALHAS EM FUNDAÇÕES",{x:0.6,y:1.2,w:6,h:0.4,fontSize:14,bold:true,color:HEX.sand,charSpacing:2});
s.addText("Os prédios inclinados de Santos",{x:0.6,y:1.7,w:5.9,h:1.9,fontFace:"Cambria",fontSize:44,bold:true,color:C.background1,isTextBox:true,margin:0,valign:"top"});
T(s,"Recalque diferencial de fundações rasas sobre argila marinha mole",{x:0.6,y:3.7,w:5.6,h:0.8,fontSize:18,color:"C9D3D8"});
T(s,"Engenharia Civil · 6º período · Fundações\nProf. Me. Luiz Gustavo Pimenta de Pádua\nAluno: Augusto Lemes Ordonhes",{x:0.6,y:5.3,w:5.6,h:1.3,fontSize:14,color:"C9D3D8"});

/* 2 A OBRA */
sec="O caso"; pres.addSection({title:sec});
s=S("A obra: a orla de Santos nas décadas de 1950–60","Dezenas de edifícios altos, construídos lado a lado, sobre o mesmo tipo de solo");
// sea + beach + skyline
s.addImage({path:IMG+"orla.png",x:0.6,y:1.75,w:7.4,h:4.16,altText:"Orla com prédios inclinados"});
T(s,"Ilustração esquemática: inclinações exageradas para visualização",{x:0.6,y:6.0,w:7.4,h:0.3,fontSize:12,italic:true,color:C.accent6});
[["100+","edifícios com inclinação visível"],["10–17","pavimentos, em concreto armado"],["~1 m","ou menos entre prédios vizinhos"]].forEach((k,i)=>{const y=1.75+i*1.65;
 R(s,8.6,y,4.1,1.45,HEX.light,{round:1});T(s,k[0],{x:8.85,y:y+0.15,w:3.7,h:0.7,fontSize:36,bold:true,color:C.accent1,fontFace:"Cambria"});T(s,k[1],{x:8.85,y:y+0.85,w:3.7,h:0.45,fontSize:15,color:C.text2});});

/* 3 SUBSOLO */
s=S("O subsolo: a boa areia escondia uma argila mole","Perfil típico da orla santista (espessuras aproximadas, variam ao longo da cidade)");
// depth ruler
const top=1.9, sc=0.11; // in/m
[0,10,20,30,40].forEach(d=>{line(s,1.25,top+d*sc,0.15,0,HEX.grey,{width:1});T(s,d+" m",{x:0.55,y:top+d*sc-0.13,w:0.65,h:0.26,fontSize:11,color:C.accent6,align:"right"});});
line(s,1.4,top,0,40*sc,HEX.grey,{width:1});
soil(s,1.5,top,5.6,[11*sc,22*sc,7*sc],["\nAREIA FINA (≈ 0–11 m)\nCompacta: ótima para sapatas","ARGILA MARINHA MOLE (≈ 11–33 m)\nSaturada e muito compressível","SOLO RESISTENTE (> 33 m)"]);
bldg(s,2.6,top,1.6,0.0001,HEX.dark);
R(s,2.4,top-0.05,2.0,0.18,HEX.dark);T(s,"sapata",{x:4.5,y:top-0.15,w:1,h:0.3,fontSize:11,italic:true,color:C.text2});
[["Areia superficial","Alta capacidade de carga. Sondagens rasas indicavam um solo excelente."],["Argila mole","Baixa resistência e alta compressibilidade. Sob carga, expulsa água lentamente (adensamento)."],["Resultado","Recalques que continuam por décadas, sem ruptura, mas com inclinação progressiva."]].forEach((c,i)=>{const y=1.75+i*1.65;
 R(s,7.6,y,5.1,1.45,HEX.light,{round:1});num(s,7.8,y+0.2,i+1,[HEX.sand,HEX.clay,HEX.rust][i]);T(s,c[0],{x:8.45,y:y+0.22,w:4.1,h:0.45,fontSize:17,bold:true,color:C.text2,valign:"middle"});T(s,c[1],{x:8.45,y:y+0.7,w:4.1,h:0.7,fontSize:14});});

/* 4 FUNDAÇÃO */
s=S("A fundação utilizada: sapatas rasas na areia","O projeto verificou a capacidade de carga, mas não o recalque da argila profunda");
s.addImage({path:IMG+"fundacao.png",x:0.6,y:1.75,w:6.6,h:4.67,altText:"Corte com sapatas e bulbos de tensões"});
T(s,"Bulbos de tensões ultrapassam a areia e carregam a argila",{x:0.6,y:6.55,w:6.6,h:0.35,fontSize:13,italic:true,color:C.accent1});
[["Tipo","Sapatas isoladas/corridas ou radier, a 1,5–3 m de profundidade"],["Critério de projeto","Tensão admissível da areia (capacidade de carga OK)"],["O que faltou","Estimar o recalque por adensamento da argila e a influência dos vizinhos"]].forEach((c,i)=>{const y=1.75+i*1.65;
 R(s,7.6,y,5.1,1.45,i==2?"FBE9E2":HEX.light,{round:1});T(s,c[0],{x:7.85,y:y+0.15,w:4.6,h:0.45,fontSize:17,bold:true,color:i==2?C.accent1:C.text2});T(s,c[1],{x:7.85,y:y+0.6,w:4.6,h:0.75,fontSize:15});});

/* 5 CAUSAS */
sec="Análise"; pres.addSection({title:sec});
s=S("Causa principal: bulbos de tensões sobrepostos","Entre dois prédios colados, a argila recebe carga dos dois lados e recalca mais");
s.addImage({path:IMG+"bulbos.png",x:0.6,y:1.75,w:6.73,h:5.1,altText:"Bulbos de tensões sobrepostos entre prédios vizinhos"});
[["Argila mole compressível","Camada espessa e saturada sob a areia"],["Interferência entre vizinhos","Sobreposição de bulbos no lado comum"],["Heterogeneidade do solo","Espessura de argila variável sob o mesmo prédio"],["Investigação insuficiente","Sondagens não atingiam a argila profunda"]].forEach((c,i)=>{const y=1.75+i*1.25;
 R(s,8.1,y,4.6,1.08,i==1?"FBE9E2":HEX.light,{round:1});num(s,8.3,y+0.29,i+1);T(s,c[0],{x:8.95,y:y+0.12,w:3.6,h:0.4,fontSize:16,bold:true,color:C.text2});T(s,c[1],{x:8.95,y:y+0.52,w:3.6,h:0.45,fontSize:14});});

/* 6 MECANISMO */
s=S("Mecanismo: do recalque diferencial à inclinação","A diferença de recalque entre os lados da fundação gira o prédio inteiro");
[["Construção","Prédio no prumo. Recalques ainda pequenos.",0,0],["Adensamento","A argila cede mais sob o lado mais carregado.",3,0.12],["Inclinação","Carga excêntrica aumenta o recalque daquele lado: efeito progressivo.",6,0.3]].forEach((p,i)=>{const x=0.6+i*4.2;
 R(s,x,1.75,3.9,4.1,HEX.light,{round:1});num(s,x+0.2,1.95,i+1);T(s,p[0],{x:x+0.85,y:1.95,w:2.9,h:0.5,fontSize:18,bold:true,color:C.text2,valign:"middle"});
 s.addImage({path:IMG+"mec"+(i+1)+".png",x:x+0.6,y:2.55,w:2.67,h:3.2});
 T(s,p[1],{x,y:6.0,w:3.9,h:0.9,fontSize:14,align:"left"});
 if(i<2) s.addShape(SH.RIGHT_ARROW,{x:x+3.95,y:3.6,w:0.2,h:0.35,fill:{color:HEX.rust},line:{color:HEX.rust}});});

/* 7 CONSEQUÊNCIAS */
s=S("Consequências: um problema que cresce com o tempo","Recalques por adensamento seguem por décadas após a construção");
s.addChart(pres.charts.LINE,[{name:"Lado mais carregado",labels:["0","5","10","20","30","40","50"],values:[0,25,40,58,68,75,80]},{name:"Lado oposto",labels:["0","5","10","20","30","40","50"],values:[0,12,19,27,32,35,37]}],
 {x:0.6,y:1.75,w:6.8,h:4.6,chartColors:[HEX.rust,HEX.clay],lineSize:3,lineDataSymbol:"none",showLegend:true,legendPos:"b",legendFontSize:12,legendFontFace:"+mn-lt",
  valAxisTitle:"Recalque (cm)",showValAxisTitle:true,catAxisTitle:"Anos após a construção",showCatAxisTitle:true,valAxisTitleFontSize:12,catAxisTitleFontSize:12,
  catAxisLabelFontSize:12,valAxisLabelFontSize:12,catAxisLabelColor:HEX.grey,valAxisLabelColor:HEX.grey,catAxisLabelFontFace:"+mn-lt",valAxisLabelFontFace:"+mn-lt",
  valGridLine:{color:"E2E6E8",size:0.5},catGridLine:{style:"none"},valAxisMaxVal:90});
T(s,"Curvas ilustrativas: a diferença entre as duas é o recalque diferencial",{x:0.6,y:6.45,w:6.8,h:0.35,fontSize:12,italic:true,color:C.accent6});
[["Segurança","Risco estrutural; em casos extremos, tombamento. Exige monitoramento."],["Uso","Portas emperradas, pisos inclinados, elevadores e drenagem afetados."],["Economia","Imóveis desvalorizados e reforços caros."],["Normas","A prática local mudou para fundações profundas."]].forEach((c,i)=>{const y=1.75+i*1.25;
 R(s,7.9,y,4.8,1.08,HEX.light,{round:1});num(s,8.1,y+0.29,i+1,i?HEX.clay:HEX.rust);T(s,c[0],{x:8.75,y:y+0.1,w:3.8,h:0.4,fontSize:16,bold:true,color:C.text2});T(s,c[1],{x:8.75,y:y+0.5,w:3.8,h:0.5,fontSize:13});});

/* 8 CORRETIVAS */
sec="Solução"; pres.addSection({title:sec});
s=S("Medidas corretivas: reforço e reaprumo","Exemplo: Edifício Núcleo dos Andradas, reaprumado no início dos anos 2000");
s.addImage({path:IMG+"reforco.png",x:0.6,y:1.75,w:5.93,h:5.0,altText:"Reforço com estacas e macacos hidráulicos"});
T(s,"estacas novas + macacos hidráulicos",{x:0.6,y:6.8,w:5.9,h:0.3,fontSize:12,italic:true,color:C.accent1});
[["Monitorar","Topografia de prumo e recalques para entender a velocidade do movimento."],["Reforçar (underpinning)","Estacas atravessam a argila e apoiam a fundação no solo resistente."],["Reaprumar","Macacos hidráulicos sobre as estacas levantam o lado que afundou, aos poucos."],["Travar","Ligar a fundação às estacas definitivamente e acompanhar depois da obra."]].forEach((c,i)=>{const y=1.75+i*1.25;
 R(s,7.5,y,5.2,1.08,HEX.light,{round:1});num(s,7.7,y+0.29,i+1);T(s,c[0],{x:8.35,y:y+0.1,w:4.2,h:0.4,fontSize:16,bold:true,color:C.text2});T(s,c[1],{x:8.35,y:y+0.5,w:4.2,h:0.5,fontSize:13});});

/* 9 PREVENÇÃO */
s=S("Prevenção: o que se faz hoje","Comparação entre a solução da época e a prática atual para prédios altos em Santos");
[["ANTES: sapata rasa",false],["HOJE: estacas profundas",true]].forEach((p,i)=>{const x=0.6+i*3.4;
 T(s,p[0],{x,y:1.7,w:3.1,h:0.4,fontSize:16,bold:true,color:i?C.accent4:C.accent1,align:"center"});
 s.addImage({path:IMG+(i?"depois":"antes")+".png",x:x+0.01,y:2.2,w:3.08,h:4.4});
 T(s,i?"carga levada ao solo resistente":"carga fica sobre a argila",{x,y:6.7,w:3.1,h:0.35,fontSize:12,italic:true,color:C.accent6,align:"center"});});
[["Investigação","Sondagens SPT profundas e ensaios de adensamento da argila."],["Projeto","Verificar recalque (estado-limite de serviço), não só capacidade de carga — NBR 6122."],["Vizinhança","Considerar os bulbos de tensões e os recalques induzidos nos prédios ao lado."]].forEach((c,i)=>{const y=1.75+i*1.65;
 R(s,7.9,y,4.8,1.45,HEX.light,{round:1});num(s,8.1,y+0.2,i+1,HEX.firm);T(s,c[0],{x:8.75,y:y+0.22,w:3.8,h:0.45,fontSize:17,bold:true,color:C.text2,valign:"middle"});T(s,c[1],{x:8.75,y:y+0.7,w:3.8,h:0.7,fontSize:14});});

/* 10 CONCLUSÃO */
sec="Conclusão"; pres.addSection({title:sec});
s=pres.addSlide({masterName:"DARK",sectionTitle:sec});
s.addText("Lições aprendidas",{x:0.6,y:0.6,w:12,h:0.9,fontFace:"Cambria",fontSize:38,bold:true,color:C.background1,isTextBox:true,margin:0});
[["Fundação boa recalca pouco e por igual","Resistir não basta: o recalque diferencial é o que inclina o prédio."],["Conheça o solo em profundidade","A camada que falha pode estar muitos metros abaixo da fundação."],["Prédios não estão sozinhos","A interação com os vizinhos precisa entrar no projeto."]].forEach((c,i)=>{const x=0.6+i*4.15;
 R(s,x,1.9,3.85,3.0,"243241",{round:1});T(s,"0"+(i+1),{x:x+0.3,y:2.1,w:1.5,h:0.7,fontSize:32,bold:true,color:HEX.sand,fontFace:"Cambria"});
 T(s,c[0],{x:x+0.3,y:2.85,w:3.3,h:0.8,fontSize:18,bold:true,color:C.background1});T(s,c[1],{x:x+0.3,y:3.7,w:3.3,h:1.1,fontSize:14,color:"C9D3D8"});});
T(s,"Referências: MASSAD, F. Solos marinhos da Baixada Santista. Oficina de Textos, 2009. · TEIXEIRA, A. H. (1994), estudos sobre os edifícios de Santos. · ABNT NBR 6122:2022 – Projeto e execução de fundações.",{x:0.6,y:5.6,w:12.1,h:0.9,fontSize:12,color:"9FB0B9"});

(async()=>{await pres.writeFile({fileName:"Fundacoes_Santos.pptx"});await applyTheme("Fundacoes_Santos.pptx",THEME);})();
