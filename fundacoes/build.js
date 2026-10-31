const pptxgen = require('pptxgenjs');
const { applyTheme } = require("/root/.claude/skills/synced/e742b812-0cc9-40f0-ab0c-3a8d09290b97_d5b90541-8fca-467d-8ebd-c421c8d11c08/pptx/scripts/apply_theme.js");
const THEME={name:"Solo",headFontFace:"Cambria",bodyFontFace:"Calibri",colors:{dk1:"1F2A2E",lt1:"FFFFFF",dk2:"3B2F26",lt2:"EEF1F2",accent1:"B5651D",accent2:"4A6670",accent3:"C9A66B",accent4:"7A8B6F",accent5:"8C2F2F",accent6:"5C5C5C",hlink:"B5651D",folHlink:"4A6670"}};
const pres=new pptxgen(); pres.layout="LAYOUT_16x9"; pres.theme={headFontFace:"Cambria",bodyFontFace:"Calibri"};
const C=pres.SchemeColor;
pres.defineSlideMaster({title:"DARK",background:{color:C.text2},objects:[
 {placeholder:{options:{name:"title",type:"title",x:0.6,y:1.5,w:8.8,h:1.4,fontSize:38,bold:true,color:C.background1,valign:"bottom"},text:""}},
 {placeholder:{options:{name:"body",type:"body",x:0.6,y:3.0,w:8.8,h:1.8,fontSize:16,color:"C9A66B",valign:"top"},text:""}}]});
pres.defineSlideMaster({title:"CONTENT",background:{color:C.background1},slideNumber:{x:9.2,y:5.2,w:0.5,h:0.3,fontSize:10,color:C.accent6},objects:[
 {placeholder:{options:{name:"title",type:"title",x:0.5,y:0.3,w:9,h:0.8,fontSize:30,bold:true,color:C.text2,valign:"middle"},text:""}}]});
let sec=null; function S(m,t){const s=pres.addSlide({masterName:m,sectionTitle:sec}); s.addText(t,{placeholder:"title"}); return s;}
function card(s,x,y,w,h,head,body,n){
 s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w,h,rectRadius:0.08,fill:{color:C.background2},line:{color:C.background2},objectName:"card"});
 s.addShape(pres.shapes.OVAL,{x:x+0.2,y:y+0.2,w:0.5,h:0.5,fill:{color:C.accent1},line:{color:C.accent1}});
 s.addText(String(n),{x:x+0.2,y:y+0.2,w:0.5,h:0.5,align:"center",valign:"middle",bold:true,fontSize:16,color:C.background1,isTextBox:true,margin:0});
 s.addText(head,{x:x+0.85,y:y+0.15,w:w-1,h:0.6,bold:true,fontSize:15,color:C.text2,valign:"middle",isTextBox:true,margin:0});
 s.addText(body,{x:x+0.2,y:y+0.85,w:w-0.4,h:h-1,fontSize:13,color:C.text1,valign:"top",isTextBox:true,margin:0});}
function bullets(s,items,x,y,w,h,fs=15){s.addText(items.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<items.length-1,paraSpaceAfter:8}})),{x,y,w,h,fontSize:fs,color:C.text1,valign:"top",isTextBox:true});}

sec="Abertura"; pres.addSection({title:sec});
let s=S("DARK","Os prédios inclinados de Santos (SP)");
s.addText("Estudo de caso: falhas em fundações por recalque diferencial\nFundações · Engenharia Civil · 6º período\nProf. Me. Luiz Gustavo Pimenta de Pádua\nAluno: ______________________",{placeholder:"body"});

sec="O caso"; pres.addSection({title:sec});
s=S("CONTENT","A obra: orla de Santos, décadas de 1950–60");
bullets(s,["Boom imobiliário na orla santista (Gonzaga, Aparecida, Embaré, Ponta da Praia)","Edifícios residenciais de ~10 a 17 pavimentos, em concreto armado","Lotes estreitos: prédios muito próximos uns dos outros","Hoje, mais de uma centena de edifícios apresenta inclinação visível"],0.5,1.3,5.3,3.8);
[["~100+","prédios com desaprumo"],["10–17","pavimentos típicos"],["1950–60","período de construção"]].forEach((k,i)=>{
 s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:6.2,y:1.3+i*1.3,w:3.3,h:1.1,rectRadius:0.08,fill:{color:C.text2},line:{color:C.text2}});
 s.addText([{text:k[0],options:{fontSize:28,bold:true,color:"C9A66B",breakLine:true}},{text:k[1],options:{fontSize:12,color:C.background1}}],{x:6.3,y:1.35+i*1.3,w:3.1,h:1.0,valign:"middle",isTextBox:true});});

s=S("CONTENT","O subsolo: areia sobre argila mole marinha");
const L=[["Areia fina compacta a medianamente compacta (~0 a 10–12 m)","C9A66B"],["Argila marinha mole, saturada, muito compressível (camadas de dezenas de metros)","4A6670"],["Areia / solo mais resistente em profundidade","7A8B6F"]];
L.forEach((l,i)=>{const h=[1.0,1.8,0.8][i],y=[1.3,2.3,4.1][i];
 s.addShape(pres.shapes.RECTANGLE,{x:0.5,y,w:4.2,h,fill:{color:l[1]},line:{color:"FFFFFF"}});
 s.addText(l[0],{x:0.6,y,w:4.0,h,fontSize:13,bold:true,color:"FFFFFF",valign:"middle",isTextBox:true});});
bullets(s,["A camada superficial de areia “parecia” boa: alta capacidade de carga para sapatas","O problema estava abaixo: a argila mole sofre adensamento lento sob carga","Recalques continuam por décadas (adensamento primário + secundário)"],5.0,1.3,4.5,3.8,14);

s=S("CONTENT","A fundação utilizada");
card(s,0.5,1.3,2.8,3.6,"Rasa","Sapatas isoladas, corridas ou radier apoiados na areia superficial, a poucos metros de profundidade.",1);
card(s,3.6,1.3,2.8,3.6,"Projeto","Dimensionada pela capacidade de carga da areia; o recalque da argila profunda foi subestimado.",2);
card(s,6.7,1.3,2.8,3.6,"Prática","Solução comum e econômica na época, antes de normas e investigações geotécnicas mais rigorosas.",3);

sec="Análise"; pres.addSection({title:sec});
s=S("CONTENT","Causas do problema");
card(s,0.5,1.3,4.4,1.75,"Argila mole compressível","Bulbo de tensões das sapatas atinge a argila, que adensa e recalca.",1);
card(s,5.1,1.3,4.4,1.75,"Interferência entre vizinhos","Bulbos de prédios colados se sobrepõem: o lado comum recalca mais.",2);
card(s,0.5,3.25,4.4,1.75,"Carga excêntrica / heterogeneidade","Espessura variável da argila e cargas desiguais geram recalque diferencial.",3);
card(s,5.1,3.25,4.4,1.75,"Investigação insuficiente","Sondagens rasas não revelaram a argila profunda.",4);

s=S("CONTENT","Mecanismo: recalque diferencial → inclinação");
s.addShape(pres.shapes.RECTANGLE,{x:0.5,y:4.3,w:4.4,h:0.7,fill:{color:"4A6670"},line:{color:"4A6670"}});
s.addText("argila mole",{x:0.5,y:4.3,w:4.4,h:0.7,align:"center",valign:"middle",color:"FFFFFF",fontSize:13,isTextBox:true});
s.addShape(pres.shapes.RECTANGLE,{x:1.0,y:1.5,w:1.2,h:2.7,fill:{color:C.text2},line:{color:C.text2},rotate:4});
s.addShape(pres.shapes.RECTANGLE,{x:2.8,y:1.5,w:1.2,h:2.7,fill:{color:C.accent1},line:{color:C.accent1},rotate:-4});
s.addText("Prédios vizinhos “se inclinam” um contra o outro",{x:0.5,y:1.0,w:4.4,h:0.4,fontSize:12,italic:true,color:C.accent6,align:"center",isTextBox:true});
bullets(s,["Recalque total não é o maior risco; o diferencial é","Desaprumo no topo pode chegar a mais de 1–2 m","Tensões adicionais nas fundações aceleram o processo (efeito progressivo)","Inclinação aceita até certos limites; acima disso, risco de tombamento"],5.2,1.3,4.3,3.8,14);

s=S("CONTENT","Consequências");
[["Segurança","Risco estrutural e, em casos extremos, de tombamento; monitoramento constante"],["Uso","Portas e janelas emperradas, pisos inclinados, problemas de elevador e drenagem"],["Econômico","Desvalorização dos imóveis e altos custos de recuperação"],["Social e normativo","Moradores afetados; mudança na prática local de fundações"]].forEach((c,i)=>{
 const x=0.5+(i%2)*4.6,y=1.3+Math.floor(i/2)*1.95; card(s,x,y,4.4,1.75,c[0],c[1],i+1);});

sec="Solução"; pres.addSection({title:sec});
s=S("CONTENT","Medidas corretivas");
bullets(s,["Monitoramento topográfico de recalques e prumo","Reforço de fundação (underpinning) com estacas profundas até solo resistente","Reaprumo com macacos hidráulicos apoiados nas novas estacas","Alívio de cargas e controle de obras vizinhas"],0.5,1.3,5.0,3.8);
s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:5.8,y:1.3,w:3.7,h:3.6,rectRadius:0.08,fill:{color:C.text2},line:{color:C.text2}});
s.addText([{text:"Caso emblemático",options:{bold:true,fontSize:16,color:"C9A66B",breakLine:true}},{text:"Edifício Núcleo dos Andradas: reaprumado no início dos anos 2000, com estacas e macacos hidráulicos, reduzindo o desaprumo que passava de 2 m no topo.",options:{fontSize:14,color:C.background1}}],{x:6.0,y:1.5,w:3.3,h:3.2,valign:"top",isTextBox:true});

s=S("CONTENT","Prevenção: o que mudou");
card(s,0.5,1.3,2.8,3.6,"Fundação profunda","Prédios altos em Santos passaram a usar estacas que atravessam a argila mole.",1);
card(s,3.6,1.3,2.8,3.6,"Investigação","Sondagens SPT profundas e ensaios de adensamento para estimar recalques.",2);
card(s,6.7,1.3,2.8,3.6,"Projeto","Verificar recalque (ELS), não só capacidade de carga; considerar vizinhos (NBR 6122).",3);

sec="Conclusão"; pres.addSection({title:sec});
s=S("DARK","Lições aprendidas");
s.addText("Fundação boa não é só a que resiste: é a que recalca pouco e por igual. Conhecer o solo em profundidade e a interação com vizinhos evita patologias de décadas.\n\nReferências: Teixeira (1994); Massad, F. Solos Marinhos da Baixada Santista (2009); ABNT NBR 6122:2022.",{placeholder:"body"});

(async()=>{await pres.writeFile({fileName:"Fundacoes_Santos.pptx"});await applyTheme("Fundacoes_Santos.pptx",THEME);})();
