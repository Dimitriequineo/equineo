import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from '@supabase/supabase-js';

const G = {
  gold:"#c4a050",goldLight:"#e8c870",dark:"#080808",
  card:"#0e0e0e",card2:"#111",
  border:"rgba(196,160,80,0.2)",borderSub:"rgba(255,255,255,0.06)",
  text:"#e5e5e5",blue:"#4a90d9",green:"#50a050",red:"#d07070",
  fontDisplay:"'Playfair Display', Georgia, serif",
  fontUI:"'Montserrat', sans-serif",
  fontBody:"'Cormorant Garamond', Georgia, serif",
};
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const PLANS={
  free:{id:"free",label:"Gratuit",price:0,annonces:1,badge:false,color:"#555"},
  particulier:{id:"particulier",label:"Particulier",price:19,annonces:3,badge:false,color:"#8a9ab0"},
  pro:{id:"pro",label:"Professionnel",price:49,annonces:999,badge:true,color:G.gold},
};

const SELLERS={
  s1:{id:"s1",name:"Écurie Beaumont",email:"contact@beaumont.fr",location:"Normandie, FR",address:"14000 Caen",phone:"+33 6 12 34 56 78",bio:"Écurie familiale depuis 1987, spécialisée dans le CSO.",avatar:"EB",joined:"Mars 2022",role:"seller",plan:"pro",
    reviews:[
      {id:"r1",buyerId:"b1",buyerName:"Sophie M.",rating:5,text:"Vendeur sérieux, cheval conforme à l'annonce. Transaction parfaite !",date:"15/03/2025"},
      {id:"r2",buyerId:"b2",buyerName:"Thomas L.",rating:4,text:"Très bon contact, réactif. Le cheval était exactement comme décrit.",date:"02/01/2025"},
    ]
  },
  s2:{id:"s2",name:"Haras du Ponant",email:"info@haras-ponant.fr",location:"Bretagne, FR",address:"29000 Quimper",phone:"+33 6 98 76 54 32",bio:"Haras breton dédié au dressage. 30 ans d'expérience.",avatar:"HP",joined:"Juin 2023",role:"seller",plan:"particulier",
    reviews:[
      {id:"r3",buyerId:"b1",buyerName:"Sophie M.",rating:5,text:"Haras de qualité, chevaux bien préparés. Je recommande vivement.",date:"10/02/2025"},
    ]
  },
};
const BUYERS={
  b1:{id:"b1",name:"Sophie Marchand",email:"sophie@mail.fr",avatar:"SM",role:"buyer",
    favorites:["h1","h4"],
    savedSearches:[
      {id:"ss1",label:"CSO Normandie",filters:{discipline:"CSO",location:"Normandie",budgetMax:100000},active:true,createdAt:"10/03/2025"},
    ]
  },
  b2:{id:"b2",name:"Thomas Leroy",email:"thomas@mail.fr",avatar:"TL",role:"buyer",favorites:[],savedSearches:[]},
};
const CARRIERS={
  t1:{id:"t1",name:"EquiTransport Pro",email:"contact@equitransport.fr",avatar:"ET",role:"carrier",phone:"+33 6 11 22 33 44",zones:["Normandie","Bretagne","Île-de-France","Pays de la Loire"],vehicules:"2 vans 2 places, 1 camion 4 places",tarif:"À partir de 2,50€/km",bio:"Spécialiste du transport équestre depuis 2010.",rating:4.9,reviews:127,joined:"Janvier 2020",commission:10},
};
const ALL_USERS={...SELLERS,...BUYERS,...CARRIERS};

const mkDoc=(n,s,d)=>({name:n,size:s,date:d});
const INIT_HORSES=[
  {id:"h1",sellerId:"s1",name:"Valentino de Lux",breed:"KWPN",age:7,gender:"Hongre",height:"168 cm",discipline:"CSO",level:"1m40",price:85000,color:"Bai",location:"Normandie, FR",address:"14000 Caen, Normandie",description:"Hongre d'exception, excellent technique, mental irréprochable. Plusieurs Grand Prix régionaux à son actif.",image:"https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800&q=80",docs:{veto:mkDoc("Rapport_veto.pdf","1.2 MB","12/01/2025"),radio:mkDoc("Radiographies.pdf","4.8 MB","10/01/2025"),concours:mkDoc("Resultats.pdf","0.8 MB","05/02/2025")},status:"published",featured:true},
  {id:"h2",sellerId:"s2",name:"Duchess de Beauval",breed:"Selle Français",age:5,gender:"Jument",height:"162 cm",discipline:"Dressage",level:"Intermédiaire I",price:42000,color:"Alezan",location:"Bretagne, FR",address:"29000 Quimper, Bretagne",description:"Jument de 5 ans au modèle fantastique. Mouvement exceptionnel, très bonne récupération.",image:"https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",docs:{veto:mkDoc("Veto.pdf","0.9 MB","08/03/2025"),radio:mkDoc("Radio.pdf","3.2 MB","08/03/2025"),concours:null},status:"published",featured:false},
  {id:"h3",sellerId:"s1",name:"Shadow du Bois",breed:"Frison",age:6,gender:"Hongre",height:"165 cm",discipline:"Dressage",level:"Amateur",price:28000,color:"Noir",location:"Normandie, FR",address:"76000 Rouen, Normandie",description:"Magnifique frison noir de jais. Très bon caractère, facile à vivre.",image:"https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=800&q=80",docs:{veto:mkDoc("Veto_shadow.pdf","1.1 MB","15/02/2025"),radio:null,concours:null},status:"published",featured:false},
  {id:"h4",sellerId:"s2",name:"Marquis d'Or",breed:"Lusitanien",age:11,gender:"Étalon",height:"158 cm",discipline:"Équitation de Travail",level:"Haute École",price:67000,color:"Gris pommelé",location:"Bretagne, FR",address:"35000 Rennes, Bretagne",description:"Étalon lusitanien d'une élégance rare. Piaffer, passage, pirouettes maîtrisés.",image:"https://images.unsplash.com/photo-1449854277604-1bcd8b99ded5?w=800&q=80",docs:{veto:mkDoc("Veto_marquis.pdf","1.4 MB","01/01/2025"),radio:mkDoc("Radio_marquis.pdf","5.1 MB","01/01/2025"),concours:mkDoc("Concours_marquis.pdf","2.0 MB","20/12/2024")},status:"published",featured:true},
  {id:"h5",sellerId:"s1",name:"Élégance du Bois",breed:"Selle Français",age:8,gender:"Jument",height:"164 cm",discipline:"CSO",level:"1m30",price:38000,color:"Bai brun",location:"Normandie, FR",address:"14000 Caen, Normandie",description:"Jument expérimentée, régulière en concours. Idéale pour cavalier amateur confirmé souhaitant progresser.",image:"https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80",docs:{veto:mkDoc("Veto_elegance.pdf","1.0 MB","20/03/2025"),radio:null,concours:mkDoc("Concours_elegance.pdf","0.6 MB","01/03/2025")},status:"published",featured:false},
  {id:"h6",sellerId:"s2",name:"Rio des Landes",breed:"Anglo-Arabe",age:9,gender:"Hongre",height:"160 cm",discipline:"Loisir / Balade",level:"Confirmé",price:12000,color:"Alezan brûlé",location:"Bretagne, FR",address:"56000 Vannes, Bretagne",description:"Hongre calme et fiable, parfait pour toute la famille. Bon à maréchaussée et vétérinaire.",image:"https://images.unsplash.com/photo-1567270671170-f7e24821f4b1?w=800&q=80",docs:{veto:mkDoc("Veto_rio.pdf","0.8 MB","05/04/2025"),radio:null,concours:null},status:"published",featured:false},
];
const INIT_CONVS=[
  {id:"c1",type:"horse",horseId:"h1",horseName:"Valentino de Lux",horseImage:"https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800&q=80",participants:["s1","b1"],lastAt:Date.now()-3600000,messages:[
    {id:"m1",from:"b1",text:"Bonjour, je suis très intéressée par Valentino. Est-il disponible pour une visite ?",at:Date.now()-7200000,read:true},
    {id:"m2",from:"s1",text:"Bonjour Sophie ! Oui, Valentino est disponible. Quel jour vous conviendrait ?",at:Date.now()-5400000,read:true},
    {id:"m3",from:"b1",text:"Mercredi ou jeudi matin de préférence.",at:Date.now()-3600000,read:false},
  ]},
];

// ─── UTILS ───────────────────────────────────────────────────────────────────────
const fmt=p=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(p);
const fmtDec=p=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2,maximumFractionDigits:2}).format(p);
const timeAgo=ts=>{const d=Date.now()-ts,m=60000,h=3600000,day=86400000;if(d<m)return"À l'instant";if(d<h)return`Il y a ${Math.floor(d/m)} min`;if(d<day)return`Il y a ${Math.floor(d/h)}h`;return`Il y a ${Math.floor(d/day)}j`;};
const fmtTime=ts=>new Date(ts).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
const fmtDate=ts=>new Date(ts).toLocaleDateString("fr-FR",{day:"numeric",month:"long"});
const avgRating=reviews=>reviews.length?Math.round((reviews.reduce((s,r)=>s+r.rating,0)/reviews.length)*10)/10:null;
function calcMonthly(p,r,n){if(r===0)return p/n;const mr=r/100/12;return p*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1);}
function buildAmort(p,r,n){const mr=r/100/12,m=calcMonthly(p,r,n);let bal=p;return Array.from({length:n},(_,i)=>{const int=bal*mr,cap=m-int;bal=Math.max(0,bal-cap);return{month:i+1,monthly:m,interest:int,capital:cap,balance:bal};});}

// ─── UI PRIMITIVES ───────────────────────────────────────────────────────────────
function Btn({children,variant="gold",onClick,small,full,style:sx={}}){
  const[hov,setHov]=useState(false);
  const base={border:"none",cursor:"pointer",borderRadius:2,fontFamily:G.fontUI,letterSpacing:"0.09em",fontWeight:700,transition:"all 0.2s",padding:small?"7px 15px":"12px 26px",fontSize:small?10:12,width:full?"100%":undefined};
  const v={
    gold:{background:hov?G.goldLight:`linear-gradient(135deg,${G.gold},${G.goldLight})`,color:"#000"},
    outline:{background:"transparent",border:`1px solid ${hov?G.gold:"rgba(196,160,80,0.4)"}`,color:hov?G.gold:"#888"},
    ghost:{background:hov?"rgba(255,255,255,0.05)":"transparent",border:"1px solid rgba(255,255,255,0.08)",color:"#aaa"},
    danger:{background:hov?"#6b1515":"rgba(139,26,26,0.25)",border:"1px solid rgba(200,50,50,0.35)",color:"#d07070"},
    green:{background:hov?"#1a5c1a":"rgba(50,120,50,0.25)",border:"1px solid rgba(80,160,80,0.35)",color:"#70c080"},
    blue:{background:hov?"#2a6aad":`linear-gradient(135deg,${G.blue},#6aaef5)`,color:"#fff"},
    blueOutline:{background:"transparent",border:`1px solid ${hov?G.blue:"rgba(74,144,217,0.4)"}`,color:hov?G.blue:"#7aadd9"},
    finance:{background:hov?"#3a7a3a":`linear-gradient(135deg,#50a050,#70c080)`,color:"#fff"},
    red:{background:hov?"#8b1a1a":"rgba(139,26,26,0.2)",border:"1px solid rgba(200,50,50,0.3)",color:"#e07070"},
  };
  return <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{...base,...v[variant],...sx}}>{children}</button>;
}
function DocBadge({label,active}){return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:active?"rgba(196,160,80,0.12)":"rgba(255,255,255,0.04)",color:active?G.gold:"#444",border:`1px solid ${active?"rgba(196,160,80,0.35)":"rgba(255,255,255,0.07)"}`}}>{active?"✓":"–"} {label}</span>;}
function Stars({rating,size=13}){return <span style={{color:G.gold,fontSize:size}}>{rating} ★</span>;}

// ─── REVIEWS SECTION ─────────────────────────────────────────────────────────────
function ReviewsSection({seller,user,onSubmitReview}){
  const[showForm,setShowForm]=useState(false);
  const[hover,setHover]=useState(0);
  const[form,setForm]=useState({rating:0,text:""});
  const[submitted,setSubmitted]=useState(false);
  const avg=avgRating(seller.reviews);
  const alreadyReviewed=seller.reviews.some(r=>r.buyerId===user?.id);

  const submit=()=>{
    if(form.rating===0||!form.text.trim())return;
    onSubmitReview(seller.id,{id:`r${Date.now()}`,buyerId:user.id,buyerName:user.name.split(" ")[0]+" "+user.name.split(" ")[1]?.[0]+".",rating:form.rating,text:form.text,date:new Date().toLocaleDateString("fr-FR")});
    setSubmitted(true);setShowForm(false);
  };

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontFamily:G.fontDisplay,fontSize:32,fontWeight:900,color:G.gold}}>{avg||"—"}</div>
          <div>
            <div style={{color:G.gold,fontSize:16}}>{avg?"★".repeat(Math.round(avg)):"Aucun avis"}</div>
            <div style={{color:"#555",fontSize:11,fontFamily:G.fontUI}}>{seller.reviews.length} avis</div>
          </div>
        </div>
        {user?.role==="buyer"&&!alreadyReviewed&&!submitted&&(
          <Btn small onClick={()=>setShowForm(v=>!v)}>+ Laisser un avis</Btn>
        )}
        {(alreadyReviewed||submitted)&&<span style={{color:"#555",fontSize:11,fontFamily:G.fontUI}}>✓ Vous avez déjà donné votre avis</span>}
      </div>

      {showForm&&(
        <div style={{background:"rgba(196,160,80,0.04)",border:`1px solid rgba(196,160,80,0.2)`,borderRadius:4,padding:"16px 18px",marginBottom:16}}>
          <div style={{fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.15em",color:G.gold,marginBottom:12}}>VOTRE AVIS</div>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)} onClick={()=>setForm(f=>({...f,rating:n}))} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:26,color:(hover||form.rating)>=n?G.gold:"#333",transition:"color 0.15s"}}>★</button>
            ))}
            {form.rating>0&&<span style={{color:"#555",fontSize:12,fontFamily:G.fontUI,alignSelf:"center",marginLeft:6}}>{["","Mauvais","Passable","Bien","Très bien","Excellent"][form.rating]}</span>}
          </div>
          <textarea value={form.text} onChange={e=>setForm(f=>({...f,text:e.target.value}))} placeholder="Partagez votre expérience avec ce vendeur..." rows={3} style={{width:"100%",padding:"10px 12px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:3,color:"#fff",fontSize:13,fontFamily:G.fontBody,outline:"none",resize:"none",lineHeight:1.6,marginBottom:12}}/>
          <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
            <Btn variant="ghost" small onClick={()=>setShowForm(false)}>Annuler</Btn>
            <Btn small onClick={submit}>Publier l'avis</Btn>
          </div>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {seller.reviews.length===0?<div style={{color:"#444",fontSize:13,fontFamily:G.fontUI}}>Aucun avis pour ce vendeur.</div>
        :seller.reviews.map(r=>(
          <div key={r.id} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${G.borderSub}`,borderRadius:4,padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#aaa",fontFamily:G.fontUI}}>{r.buyerName.charAt(0)}</div>
                <div>
                  <div style={{fontFamily:G.fontUI,fontSize:11,fontWeight:700,color:"#ccc"}}>{r.buyerName}</div>
                  <div style={{color:"#444",fontSize:10}}>{r.date}</div>
                </div>
              </div>
              <div style={{color:G.gold,fontSize:14}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
            </div>
            <div style={{color:"#999",fontSize:13,lineHeight:1.65,fontFamily:G.fontBody}}>{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FINANCING SIMULATOR (compact) ───────────────────────────────────────────────
function Slider({label,value,min,max,step,onChange,format,color=G.gold}){
  const pct=((value-min)/(max-min))*100;
  return(
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:7}}>
        <label style={{fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.12em",color:"#555"}}>{label}</label>
        <span style={{fontFamily:G.fontDisplay,fontSize:17,fontWeight:700,color}}>{format(value)}</span>
      </div>
      <div style={{position:"relative",height:5}}>
        <div style={{position:"absolute",inset:0,borderRadius:3,background:"rgba(255,255,255,0.06)"}}/>
        <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,borderRadius:3,background:`linear-gradient(90deg,${color}88,${color})`}}/>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} style={{position:"absolute",inset:0,width:"100%",opacity:0,cursor:"pointer",height:"100%"}}/>
        <div style={{position:"absolute",top:"50%",left:`${pct}%`,transform:"translate(-50%,-50%)",width:15,height:15,borderRadius:"50%",background:`linear-gradient(135deg,${color},${color}cc)`,border:`2px solid ${G.dark}`,pointerEvents:"none"}}/>
      </div>
    </div>
  );
}

function FinancingSimulator({horsePrice,horseName}){
  const[apport,setApport]=useState(Math.round(horsePrice*0.2));
  const[duree,setDuree]=useState(60);
  const[taux,setTaux]=useState(4.5);
  const[showTable,setShowTable]=useState(false);
  const[showReq,setShowReq]=useState(false);
  const[sent,setSent]=useState(false);
  const[form,setForm]=useState({nom:"",email:"",tel:"",revenus:""});
  const principal=Math.max(0,horsePrice-apport);
  const monthly=calcMonthly(principal,taux,duree);
  const totalInt=monthly*duree-principal;
  const rows=buildAmort(principal,taux,duree);
  const mColor=monthly>3000?G.red:monthly>2000?G.gold:"#70c080";
  const inp={width:"100%",padding:"10px 12px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:3,color:"#fff",fontSize:12,fontFamily:G.fontBody,outline:"none"};
  const lbl={display:"block",fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.12em",color:"#555",marginBottom:6};
  const sendReq=()=>{setSent(true);setTimeout(()=>{setShowReq(false);setSent(false);},1800);};
  return(
    <div style={{background:"rgba(80,160,80,0.04)",border:"1px solid rgba(80,160,80,0.2)",borderRadius:6,overflow:"hidden"}}>
      <div style={{padding:"14px 18px",background:"rgba(80,160,80,0.06)",borderBottom:"1px solid rgba(80,160,80,0.15)",display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:16}}>💰</span>
        <div style={{fontFamily:G.fontUI,fontSize:10,fontWeight:800,color:"#70c080",letterSpacing:"0.1em"}}>SIMULATEUR DE FINANCEMENT</div>
        <div style={{marginLeft:"auto",fontFamily:G.fontDisplay,fontSize:17,color:G.gold,fontWeight:700}}>{fmt(horsePrice)}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
        <div style={{padding:"16px 18px",borderRight:"1px solid rgba(80,160,80,0.15)"}}>
          <Slider label="APPORT" value={apport} min={0} max={horsePrice} step={500} onChange={setApport} format={v=>`${fmt(v)} (${Math.round((v/horsePrice)*100)}%)`} color={G.gold}/>
          <Slider label="DURÉE" value={duree} min={12} max={84} step={12} onChange={setDuree} format={v=>`${v} mois`} color={G.blue}/>
          <Slider label="TAUX ANNUEL" value={taux} min={1} max={12} step={0.1} onChange={v=>setTaux(Math.round(v*10)/10)} format={v=>`${v.toFixed(1)}%`} color="#9a7ad9"/>
          <div style={{display:"flex",gap:5}}>
            {[24,36,48,60,72,84].map(d=>(
              <button key={d} onClick={()=>setDuree(d)} style={{background:duree===d?`linear-gradient(135deg,${G.blue},#6aaef5)`:"rgba(255,255,255,0.04)",border:`1px solid ${duree===d?"transparent":"rgba(255,255,255,0.08)"}`,color:duree===d?"#fff":"#555",padding:"4px 7px",borderRadius:2,cursor:"pointer",fontFamily:G.fontUI,fontSize:9,fontWeight:duree===d?700:400,transition:"all 0.2s"}}>{d/12}a</button>
            ))}
          </div>
        </div>
        <div style={{padding:"16px 18px"}}>
          <div style={{textAlign:"center",background:"rgba(80,160,80,0.06)",border:"1px solid rgba(80,160,80,0.2)",borderRadius:4,padding:"14px",marginBottom:10}}>
            <div style={{fontFamily:G.fontUI,fontSize:8,letterSpacing:"0.15em",color:"#555",marginBottom:5}}>MENSUALITÉ ESTIMÉE</div>
            <div style={{fontFamily:G.fontDisplay,fontSize:32,fontWeight:900,color:mColor,lineHeight:1}}>{fmtDec(monthly)}</div>
            <div style={{color:"#444",fontSize:9,marginTop:3,fontFamily:G.fontUI}}>{duree} mois · {fmt(principal)} empruntés</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
            {[[fmt(totalInt),"Coût crédit",G.red],[fmt(monthly*duree),"Total","#888"]].map(([v,l,c])=>(
              <div key={l} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:3,padding:"8px",textAlign:"center"}}>
                <div style={{fontFamily:G.fontDisplay,fontSize:14,fontWeight:700,color:c}}>{v}</div>
                <div style={{fontFamily:G.fontUI,fontSize:8,color:"#444",marginTop:2}}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden",marginBottom:6}}>
            <div style={{height:"100%",width:`${Math.min(100,(monthly/5000)*100)}%`,borderRadius:2,background:monthly>3000?"linear-gradient(90deg,#d07070,#a03030)":monthly>2000?`linear-gradient(90deg,${G.gold},${G.goldLight})`:"linear-gradient(90deg,#50a050,#70c080)",transition:"width 0.4s"}}/>
          </div>
          <div style={{color:mColor,fontSize:9,fontFamily:G.fontUI,fontWeight:600,marginBottom:10}}>
            {monthly>3000?"⚠️ Effort élevé":monthly>2000?"⚡ Effort modéré":"✅ Financement accessible"}
          </div>
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>setShowTable(v=>!v)} style={{flex:1,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",color:"#666",padding:"7px",borderRadius:2,cursor:"pointer",fontFamily:G.fontUI,fontSize:9}}>
              {showTable?"▲ Masquer":"▼ Amortissement"}
            </button>
            <button onClick={()=>setShowReq(true)} style={{flex:1,background:"linear-gradient(135deg,#50a050,#70c080)",border:"none",color:"#fff",padding:"7px",borderRadius:2,cursor:"pointer",fontFamily:G.fontUI,fontSize:9,fontWeight:800}}>
              Financement →
            </button>
          </div>
        </div>
      </div>
      {showTable&&(
        <div style={{padding:"0 18px 14px",maxHeight:200,overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:G.fontUI,fontSize:10}}>
            <thead><tr style={{background:"rgba(255,255,255,0.04)"}}>{["Mois","Mensualité","Capital","Intérêts","Restant"].map(h=><th key={h} style={{padding:"6px 10px",textAlign:"right",color:"#555",fontSize:9,borderBottom:`1px solid ${G.borderSub}`}}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((r,i)=><tr key={r.month} style={{background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
              <td style={{padding:"5px 10px",textAlign:"right",color:"#555"}}>{r.month}</td>
              <td style={{padding:"5px 10px",textAlign:"right",color:G.gold,fontWeight:600}}>{fmtDec(r.monthly)}</td>
              <td style={{padding:"5px 10px",textAlign:"right",color:"#70c080"}}>{fmtDec(r.capital)}</td>
              <td style={{padding:"5px 10px",textAlign:"right",color:"#c07070"}}>{fmtDec(r.interest)}</td>
              <td style={{padding:"5px 10px",textAlign:"right",color:"#777"}}>{fmtDec(r.balance)}</td>
            </tr>)}</tbody>
          </table>
        </div>
      )}
      <div style={{padding:"8px 18px",borderTop:"1px solid rgba(80,160,80,0.1)"}}>
        <div style={{color:"#2a2a2a",fontSize:9,fontFamily:G.fontUI}}>⚠️ Simulation indicative uniquement · Équineo n'est pas un établissement de crédit</div>
      </div>
      {showReq&&(
        <div onClick={()=>setShowReq(false)} style={{position:"fixed",inset:0,zIndex:900,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#090909",border:"1px solid rgba(80,160,80,0.3)",borderRadius:6,maxWidth:460,width:"100%",boxShadow:"0 40px 100px rgba(0,0,0,0.95)"}}>
            {sent?(<div style={{padding:"46px 36px",textAlign:"center"}}><div style={{fontSize:40,marginBottom:12}}>✅</div><div style={{fontFamily:G.fontDisplay,fontSize:20,fontWeight:700,marginBottom:6}}>Demande envoyée !</div><div style={{color:"#666",fontSize:13}}>Un conseiller vous contactera sous 48h.</div></div>)
            :(<>
              <div style={{padding:"20px 26px 16px",borderBottom:`1px solid ${G.borderSub}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontFamily:G.fontDisplay,fontSize:19,fontWeight:700}}>Demande de financement</div>
                <button onClick={()=>setShowReq(false)} style={{background:"transparent",border:"none",color:"#555",fontSize:22,cursor:"pointer"}}>×</button>
              </div>
              <div style={{padding:"18px 26px"}}>
                <div style={{background:"rgba(80,160,80,0.06)",border:"1px solid rgba(80,160,80,0.2)",borderRadius:3,padding:"10px 14px",marginBottom:14,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[[horseName.length>14?horseName.slice(0,12)+"…":horseName,"Cheval"],[fmt(principal),"Montant"],[fmtDec(monthly),"Mensualité"]].map(([v,l])=>(
                    <div key={l}><div style={{fontFamily:G.fontUI,fontSize:8,color:"#444",marginBottom:2}}>{l.toUpperCase()}</div><div style={{color:"#ccc",fontSize:11,fontWeight:600}}>{v}</div></div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={lbl}>NOM</label><input value={form.nom} onChange={e=>setForm(f=>({...f,nom:e.target.value}))} placeholder="Prénom Nom" style={inp}/></div>
                  <div><label style={lbl}>E-MAIL</label><input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="vous@email.fr" style={inp}/></div>
                  <div><label style={lbl}>TÉLÉPHONE</label><input value={form.tel} onChange={e=>setForm(f=>({...f,tel:e.target.value}))} placeholder="+33 6..." style={inp}/></div>
                  <div><label style={lbl}>REVENUS NETS</label><select value={form.revenus} onChange={e=>setForm(f=>({...f,revenus:e.target.value}))} style={{...inp,appearance:"none"}}><option value="" style={{background:"#111"}}>Sélectionner…</option>{["< 2 000€","2 000–3 500€","3 500–5 000€","5 000–8 000€","> 8 000€"].map(v=><option key={v} value={v} style={{background:"#111"}}>{v}</option>)}</select></div>
                </div>
                <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
                  <Btn variant="ghost" small onClick={()=>setShowReq(false)}>Annuler</Btn>
                  <Btn variant="finance" small onClick={sendReq}>Envoyer</Btn>
                </div>
              </div>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPARATOR ──────────────────────────────────────────────────────────────────
function ComparatorBar({compareList,horses,onOpen,onRemove,onClear}){
  if(compareList.length===0)return null;
  const items=compareList.map(id=>horses.find(h=>h.id===id)).filter(Boolean);
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:300,background:"rgba(14,14,14,0.97)",borderTop:`1px solid ${G.border}`,backdropFilter:"blur(20px)",padding:"12px 44px",display:"flex",alignItems:"center",gap:14}}>
      <div style={{fontFamily:G.fontUI,fontSize:10,letterSpacing:"0.15em",color:G.gold,flexShrink:0}}>COMPARER ({compareList.length}/3)</div>
      <div style={{display:"flex",gap:10,flex:1}}>
        {items.map(h=>(
          <div key={h.id} style={{display:"flex",alignItems:"center",gap:9,background:"rgba(255,255,255,0.04)",border:`1px solid ${G.borderSub}`,borderRadius:3,padding:"7px 12px"}}>
            <img src={h.image} alt="" style={{width:36,height:27,objectFit:"cover",borderRadius:2}}/>
            <div>
              <div style={{fontFamily:G.fontUI,fontSize:10,fontWeight:700,color:"#ccc"}}>{h.name.split(" ")[0]}</div>
              <div style={{fontFamily:G.fontDisplay,fontSize:12,color:G.gold}}>{fmt(h.price)}</div>
            </div>
            <button onClick={()=>onRemove(h.id)} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:14,lineHeight:1,marginLeft:2}}>×</button>
          </div>
        ))}
        {compareList.length<3&&Array.from({length:3-compareList.length}).map((_,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.02)",border:`1px dashed rgba(255,255,255,0.1)`,borderRadius:3,padding:"7px 24px",color:"#333",fontSize:11,fontFamily:G.fontUI}}>+ Ajouter</div>
        ))}
      </div>
      <div style={{display:"flex",gap:9,flexShrink:0}}>
        <Btn variant="ghost" small onClick={onClear}>Effacer</Btn>
        <Btn small onClick={onOpen} style={{opacity:compareList.length<2?0.4:1}}>Comparer →</Btn>
      </div>
    </div>
  );
}

function ComparatorModal({compareList,horses,sellers,onClose,onContact,user}){
  const items=compareList.map(id=>horses.find(h=>h.id===id)).filter(Boolean);
  if(items.length<2)return null;
  const rows=[
    ["Prix",h=>fmt(h.price),h=>`≈ ${fmtDec(calcMonthly(h.price*0.8,4.5,60))}/mois`],
    ["Race",h=>h.breed],
    ["Âge",h=>`${h.age} ans`],
    ["Taille",h=>h.height],
    ["Genre",h=>h.gender],
    ["Discipline",h=>h.discipline],
    ["Niveau",h=>h.level],
    ["Localisation",h=>h.location],
    ["Vendeur",h=>sellers[h.sellerId]?.name||"—"],
    ["Rapport vétérinaire",h=>h.docs.veto?"✓ Disponible":"— Non fourni"],
    ["Radiographies",h=>h.docs.radio?"✓ Disponible":"— Non fourni"],
    ["Résultats concours",h=>h.docs.concours?"✓ Disponible":"— Non fourni"],
  ];

  // Highlight best price
  const minPrice=Math.min(...items.map(h=>h.price));
  const minAge=Math.min(...items.map(h=>h.age));

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0a0a0a",border:`1px solid ${G.border}`,borderRadius:6,maxWidth:900,width:"100%",maxHeight:"92vh",overflow:"auto",boxShadow:"0 40px 100px rgba(0,0,0,0.95)"}}>
        <div style={{padding:"22px 28px 18px",borderBottom:`1px solid ${G.borderSub}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#0a0a0a",zIndex:10}}>
          <div style={{fontFamily:G.fontDisplay,fontSize:22,fontWeight:700}}>Comparateur de chevaux</div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#555",fontSize:22,cursor:"pointer"}}>×</button>
        </div>

        {/* Photos */}
        <div style={{display:"grid",gridTemplateColumns:`180px repeat(${items.length},1fr)`,borderBottom:`1px solid ${G.borderSub}`}}>
          <div style={{padding:"20px 20px",display:"flex",alignItems:"flex-end"}}><div style={{fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.15em",color:"#444"}}>CRITÈRE</div></div>
          {items.map(h=>(
            <div key={h.id} style={{borderLeft:`1px solid ${G.borderSub}`}}>
              <div style={{position:"relative",height:160,overflow:"hidden"}}>
                <img src={h.image} alt={h.name} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.8)"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(10,10,10,0.9) 0%,transparent 50%)"}}/>
                <div style={{position:"absolute",bottom:12,left:14}}>
                  <div style={{fontFamily:G.fontDisplay,fontSize:16,fontWeight:700,color:"#fff"}}>{h.name}</div>
                  <div style={{color:G.gold,fontSize:13,fontWeight:700,fontFamily:G.fontDisplay}}>{fmt(h.price)}</div>
                </div>
                {h.price===minPrice&&<div style={{position:"absolute",top:10,right:10,background:"rgba(80,160,80,0.9)",color:"#fff",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:20,fontFamily:G.fontUI}}>💚 Meilleur prix</div>}
              </div>
              <div style={{padding:"12px 14px"}}>
                <Btn small full onClick={()=>{onClose();onContact(h);}}>Contacter</Btn>
              </div>
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map(([label,getValue,getSub],ri)=>(
          <div key={label} style={{display:"grid",gridTemplateColumns:`180px repeat(${items.length},1fr)`,borderBottom:`1px solid ${G.borderSub}`,background:ri%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
            <div style={{padding:"13px 20px",display:"flex",alignItems:"center"}}>
              <div style={{fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.1em",color:"#444"}}>{label.toUpperCase()}</div>
            </div>
            {items.map(h=>{
              const val=getValue(h);
              const sub=getSub?.(h);
              const isDoc=label.includes("Rapport")||label.includes("Radio")||label.includes("Résultat");
              const docAvail=isDoc&&val.startsWith("✓");
              const isBestPrice=label==="Prix"&&h.price===minPrice;
              const isBestAge=label==="Âge"&&h.age===minAge;
              return(
                <div key={h.id} style={{padding:"13px 14px",borderLeft:`1px solid ${G.borderSub}`,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div style={{fontSize:13,color:isDoc?(docAvail?"#70c080":"#555"):isBestPrice||isBestAge?G.gold:G.text,fontWeight:isBestPrice||isBestAge?700:400,fontFamily:isDoc?G.fontUI:G.fontBody}}>
                    {val}
                    {(isBestPrice||isBestAge)&&<span style={{marginLeft:6,fontSize:10}}>⭐</span>}
                  </div>
                  {sub&&<div style={{color:"#555",fontSize:10,marginTop:2,fontFamily:G.fontUI}}>{sub}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SAVED SEARCHES ───────────────────────────────────────────────────────────────
function SavedSearchModal({user,setUser,horses,onApply,onClose}){
  const[form,setForm]=useState({label:"",discipline:"Tous",location:"",budgetMax:""});
  const[saved,setSaved]=useState(false);

  const matchingCount=horses.filter(h=>{
    if(h.status!=="published")return false;
    const mD=form.discipline==="Tous"||h.discipline===form.discipline;
    const mL=!form.location||h.location.toLowerCase().includes(form.location.toLowerCase());
    const mB=!form.budgetMax||h.price<=Number(form.budgetMax);
    return mD&&mL&&mB;
  }).length;

  const save=()=>{
    const search={id:`ss${Date.now()}`,label:form.label||`${form.discipline} ${form.location}`.trim()||"Recherche",filters:{discipline:form.discipline,location:form.location,budgetMax:form.budgetMax?Number(form.budgetMax):null},active:true,createdAt:new Date().toLocaleDateString("fr-FR")};
    setUser(u=>({...u,savedSearches:[...(u.savedSearches||[]),search]}));
    setSaved(true);
    setTimeout(()=>onClose(),1600);
  };

  const apply=()=>{onApply(form);onClose();};

  const DISCS=["Tous","CSO","Dressage","Loisir / Balade","Équitation de Travail"];
  const inp={width:"100%",padding:"10px 12px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:3,color:"#fff",fontSize:13,fontFamily:G.fontBody,outline:"none"};
  const lbl={display:"block",fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.12em",color:"#555",marginBottom:6};

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,0.9)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#090909",border:`1px solid ${G.border}`,borderRadius:6,maxWidth:480,width:"100%",boxShadow:"0 40px 100px rgba(0,0,0,0.95)"}}>
        {saved?(
          <div style={{padding:"46px 36px",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12}}>🔔</div>
            <div style={{fontFamily:G.fontDisplay,fontSize:20,fontWeight:700,marginBottom:6}}>Alerte sauvegardée !</div>
            <div style={{color:"#666",fontSize:13}}>Vous serez notifié dès qu'un cheval correspondant est publié.</div>
          </div>
        ):(
          <>
            <div style={{padding:"20px 26px 16px",borderBottom:`1px solid ${G.borderSub}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:G.fontDisplay,fontSize:20,fontWeight:700}}>Sauvegarder une recherche</div>
                <div style={{color:"#555",fontSize:11,marginTop:2,fontFamily:G.fontUI}}>Recevez une alerte à chaque nouvelle annonce correspondante</div>
              </div>
              <button onClick={onClose} style={{background:"transparent",border:"none",color:"#555",fontSize:22,cursor:"pointer"}}>×</button>
            </div>
            <div style={{padding:"20px 26px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12,marginBottom:16}}>
                <div><label style={lbl}>NOM DE L'ALERTE (optionnel)</label><input value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))} placeholder="Ex: CSO Normandie moins de 50k" style={inp}/></div>
                <div><label style={lbl}>DISCIPLINE</label>
                  <select value={form.discipline} onChange={e=>setForm(f=>({...f,discipline:e.target.value}))} style={{...inp,appearance:"none"}}>
                    {DISCS.map(d=><option key={d} value={d} style={{background:"#111"}}>{d}</option>)}
                  </select>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><label style={lbl}>RÉGION / LOCALISATION</label><input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="Ex: Normandie" style={inp}/></div>
                  <div><label style={lbl}>BUDGET MAX (€)</label><input type="number" value={form.budgetMax} onChange={e=>setForm(f=>({...f,budgetMax:e.target.value}))} placeholder="Ex: 50000" style={inp}/></div>
                </div>
              </div>

              <div style={{background:"rgba(196,160,80,0.05)",border:`1px solid rgba(196,160,80,0.15)`,borderRadius:3,padding:"12px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{color:"#777",fontSize:12,fontFamily:G.fontUI}}>Chevaux correspondants actuellement</div>
                <div style={{fontFamily:G.fontDisplay,fontSize:20,color:G.gold,fontWeight:700}}>{matchingCount}</div>
              </div>

              <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
                <Btn variant="ghost" small onClick={onClose}>Annuler</Btn>
                <Btn variant="outline" small onClick={apply}>Appliquer les filtres</Btn>
                <Btn small onClick={save}>🔔 Sauvegarder l'alerte</Btn>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── HORSE MODAL ─────────────────────────────────────────────────────────────────
function HorseModal({horse,sellers,user,setUser,onClose,onContact,onTransport,compareList,onToggleCompare,onToggleFavorite}){
  const[tab,setTab]=useState("info");
  if(!horse)return null;
  const seller=sellers[horse.sellerId];
  const isPro=seller?.plan==="pro";
  const isFav=user?.favorites?.includes(horse.id);
  const inCompare=compareList.includes(horse.id);
  const canContact=user&&user.id!==horse.sellerId;
  const isBuyer=user?.role==="buyer";

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0a0a0a",border:`1px solid ${G.border}`,borderRadius:6,maxWidth:860,width:"100%",maxHeight:"92vh",overflow:"auto",boxShadow:"0 40px 100px rgba(0,0,0,0.9)"}}>
        <div style={{position:"relative",height:250,flexShrink:0}}>
          <img src={horse.image} alt={horse.name} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.7)"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(10,10,10,1) 0%,transparent 55%)"}}/>
          <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"rgba(0,0,0,0.6)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          {/* Favorite & Compare buttons */}
          <div style={{position:"absolute",top:14,right:56,display:"flex",gap:8}}>
            {isBuyer&&(
              <>
                <button onClick={()=>onToggleFavorite(horse.id)} style={{background:isFav?"rgba(196,160,80,0.9)":"rgba(0,0,0,0.6)",border:`1px solid ${isFav?"transparent":"rgba(255,255,255,0.2)"}`,color:isFav?"#000":"#fff",padding:"6px 12px",borderRadius:3,cursor:"pointer",fontFamily:G.fontUI,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:5,transition:"all 0.2s"}}>
                  {isFav?"♥ Favori":"♡ Favoris"}
                </button>
                <button onClick={()=>onToggleCompare(horse.id)} style={{background:inCompare?"rgba(74,144,217,0.8)":"rgba(0,0,0,0.6)",border:`1px solid ${inCompare?"transparent":"rgba(255,255,255,0.2)"}`,color:"#fff",padding:"6px 12px",borderRadius:3,cursor:"pointer",fontFamily:G.fontUI,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:5,transition:"all 0.2s"}}>
                  {inCompare?"✓ Comparé":"⇄ Comparer"}
                </button>
              </>
            )}
          </div>
          <div style={{position:"absolute",bottom:18,left:24}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
              {isPro&&<span style={{background:"rgba(196,160,80,0.2)",border:`1px solid rgba(196,160,80,0.5)`,color:G.gold,fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:2,letterSpacing:"0.1em",fontFamily:G.fontUI}}>✓ VÉRIFIÉ</span>}
              {horse.featured&&<span style={{background:"rgba(196,160,80,0.9)",color:"#000",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:2,letterSpacing:"0.1em",fontFamily:G.fontUI}}>⭐ VEDETTE</span>}
            </div>
            <div style={{fontFamily:G.fontDisplay,fontSize:26,fontWeight:700,color:"#fff"}}>{horse.name}</div>
            <div style={{color:G.gold,fontSize:12,letterSpacing:"0.08em",marginTop:3}}>{horse.breed} · {horse.gender} · {horse.age} ans · {horse.height}</div>
          </div>
          <div style={{position:"absolute",bottom:18,right:24,textAlign:"right"}}>
            <div style={{fontFamily:G.fontDisplay,fontSize:26,color:G.gold,fontWeight:700}}>{fmt(horse.price)}</div>
            <div style={{color:"#555",fontSize:10,fontFamily:G.fontUI}}>≈ {fmtDec(calcMonthly(horse.price*0.8,4.5,60))}/mois*</div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{display:"flex",borderBottom:`1px solid ${G.borderSub}`,background:"rgba(255,255,255,0.01)"}}>
          {[["info","📋 Infos"],["financing","💰 Financement"],["transport","🚛 Transport"],["reviews","⭐ Avis"]].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${tab===key?(key==="financing"?"#70c080":key==="transport"?G.blue:key==="reviews"?G.gold:G.gold):"transparent"}`,color:tab===key?(key==="financing"?"#70c080":key==="transport"?G.blue:G.gold):"#555",cursor:"pointer",fontFamily:G.fontUI,fontSize:11,letterSpacing:"0.08em",padding:"12px 20px",marginBottom:-1,transition:"all 0.2s",fontWeight:tab===key?700:400}}>
              {label}
              {key==="reviews"&&seller?.reviews?.length>0&&<span style={{marginLeft:6,fontFamily:G.fontDisplay,fontSize:11,color:G.gold}}>{avgRating(seller.reviews)}★</span>}
            </button>
          ))}
        </div>

        <div style={{padding:"20px 24px 26px"}}>
          {tab==="info"&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:18}}>
                {[["Discipline",horse.discipline],["Niveau",horse.level],["Robe",horse.color],["Localisation",horse.location],["Vendeur",seller?.name||"—"],["Adresse",horse.address||horse.location]].map(([k,v])=>(
                  <div key={k}><div style={{color:"#444",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3,fontFamily:G.fontUI}}>{k}</div><div style={{color:G.text,fontSize:13}}>{v}</div></div>
                ))}
              </div>
              <div style={{borderTop:`1px solid ${G.borderSub}`,paddingTop:14,marginBottom:14}}><p style={{color:"#bbb",lineHeight:1.8,fontSize:14,margin:0}}>{horse.description}</p></div>
              <div style={{marginBottom:16}}>
                <div style={{color:"#444",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8,fontFamily:G.fontUI}}>Documents disponibles</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  <DocBadge label="Rapport vétérinaire" active={!!horse.docs.veto}/><DocBadge label="Radiographies" active={!!horse.docs.radio}/><DocBadge label="Résultats concours" active={!!horse.docs.concours}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
                <div onClick={()=>setTab("financing")} style={{background:"rgba(80,160,80,0.05)",border:"1px solid rgba(80,160,80,0.2)",borderRadius:4,padding:"11px 15px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>💰</span><div><div style={{fontFamily:G.fontUI,fontSize:10,fontWeight:700,color:"#70c080"}}>SIMULER UN FINANCEMENT</div><div style={{color:"#555",fontSize:10,marginTop:2}}>Mensualités en temps réel →</div></div>
                </div>
                <div onClick={()=>setTab("transport")} style={{background:"rgba(74,144,217,0.05)",border:"1px solid rgba(74,144,217,0.2)",borderRadius:4,padding:"11px 15px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>🚛</span><div><div style={{fontFamily:G.fontUI,fontSize:10,fontWeight:700,color:G.blue}}>ORGANISER LE TRANSPORT</div><div style={{color:"#555",fontSize:10,marginTop:2}}>Devis gratuit →</div></div>
                </div>
              </div>
              <div style={{background:"rgba(196,160,80,0.05)",border:`1px solid rgba(196,160,80,0.18)`,borderRadius:4,padding:"15px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:G.fontDisplay,fontSize:24,color:G.gold,fontWeight:700}}>{fmt(horse.price)}</div>
                  <div style={{color:"#444",fontSize:10,marginTop:3,fontFamily:G.fontUI}}>Prix net vendeur · Aucune commission Équineo</div>
                </div>
                {canContact?<Btn onClick={()=>{onClose();onContact(horse);}}>💬 Contacter le vendeur</Btn>:<Btn variant="outline" onClick={onClose}>Connexion pour contacter</Btn>}
              </div>
            </>
          )}
          {tab==="financing"&&<FinancingSimulator horsePrice={horse.price} horseName={horse.name}/>}
          {tab==="transport"&&(
            <div>
              <div style={{background:"rgba(74,144,217,0.05)",border:"1px solid rgba(74,144,217,0.2)",borderRadius:4,padding:"16px 18px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:14}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:24}}>🚛</span>
                  <div><div style={{fontFamily:G.fontUI,fontSize:10,fontWeight:700,color:G.blue,letterSpacing:"0.08em"}}>DEMANDE DE DEVIS TRANSPORT</div><div style={{color:"#555",fontSize:12,marginTop:2}}>Plusieurs transporteurs partenaires vous répondent dans la messagerie</div></div>
                </div>
                {isBuyer?<Btn variant="blue" small onClick={()=>{onClose();onTransport(horse);}}>Demander des devis</Btn>:<Btn variant="blueOutline" small onClick={onClose}>Connexion requise</Btn>}
              </div>
              <div style={{fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.1em",color:"#444",marginBottom:10}}>NOS TRANSPORTEURS PARTENAIRES</div>
              {Object.values(CARRIERS).map(c=>(
                <div key={c.id} style={{display:"flex",gap:12,alignItems:"center",padding:"11px 14px",background:"rgba(255,255,255,0.02)",border:`1px solid ${G.borderSub}`,borderRadius:3,marginBottom:8}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${G.blue},#6aaef5)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",fontFamily:G.fontUI,flexShrink:0}}>{c.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:G.fontUI,fontSize:11,fontWeight:700,color:"#ccc"}}>{c.name}</div>
                    <div style={{color:"#555",fontSize:11,marginTop:1}}>{c.zones.join(" · ")} · {c.tarif}</div>
                  </div>
                  <div style={{color:G.gold,fontSize:12}}>{c.rating} ★</div>
                </div>
              ))}
            </div>
          )}
          {tab==="reviews"&&seller&&(
            <ReviewsSection seller={seller} user={user} onSubmitReview={(sellerId,review)=>{/* handled at app level */}}/>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HORSE CARD ──────────────────────────────────────────────────────────────────
function HorseCard({horse,seller,onClick,isFav,inCompare,onToggleFavorite,onToggleCompare,isBuyer}){
  const[hov,setHov]=useState(false);
  const isPro=seller?.plan==="pro";
  return(
    <div style={{position:"relative"}}>
      <div onClick={()=>onClick(horse)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:G.card,border:`1px solid ${hov?"rgba(196,160,80,0.5)":horse.featured?"rgba(196,160,80,0.2)":G.borderSub}`,borderRadius:4,overflow:"hidden",cursor:"pointer",transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)",transform:hov?"translateY(-4px)":"translateY(0)",boxShadow:hov?"0 20px 50px rgba(0,0,0,0.6)":"0 2px 10px rgba(0,0,0,0.35)"}}>
        <div style={{position:"relative",height:210,overflow:"hidden"}}>
          <img src={horse.image} alt={horse.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.6s",transform:hov?"scale(1.06)":"scale(1)",filter:"brightness(0.82)"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.88) 0%,transparent 55%)"}}/>
          <div style={{position:"absolute",top:10,right:10,display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
            <span style={{background:"rgba(196,160,80,0.9)",color:"#000",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:2,letterSpacing:"0.1em",fontFamily:G.fontUI}}>{horse.discipline}</span>
            {isPro&&<span style={{background:"rgba(196,160,80,0.15)",border:`1px solid rgba(196,160,80,0.5)`,color:G.gold,fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:2,fontFamily:G.fontUI}}>✓ VÉRIFIÉ</span>}
          </div>
          {horse.featured&&<div style={{position:"absolute",top:10,left:10,background:"rgba(196,160,80,0.9)",color:"#000",fontSize:8,fontWeight:800,padding:"2px 7px",borderRadius:2,fontFamily:G.fontUI}}>⭐ VEDETTE</div>}
          {/* Fav & compare overlay */}
          {isBuyer&&hov&&(
            <div style={{position:"absolute",bottom:10,right:10,display:"flex",gap:5}} onClick={e=>e.stopPropagation()}>
              <button onClick={()=>onToggleFavorite(horse.id)} style={{background:isFav?"rgba(196,160,80,0.9)":"rgba(0,0,0,0.7)",border:`1px solid ${isFav?"transparent":"rgba(255,255,255,0.2)"}`,color:isFav?"#000":"#fff",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>{isFav?"♥":"♡"}</button>
              <button onClick={()=>onToggleCompare(horse.id)} style={{background:inCompare?"rgba(74,144,217,0.9)":"rgba(0,0,0,0.7)",border:`1px solid ${inCompare?"transparent":"rgba(255,255,255,0.2)"}`,color:"#fff",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>⇄</button>
            </div>
          )}
          <div style={{position:"absolute",bottom:12,left:14}}>
            <div style={{fontFamily:G.fontDisplay,fontSize:17,fontWeight:700,color:"#fff"}}>{horse.name}</div>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,marginTop:2}}>{horse.breed} · {horse.age} ans · {horse.color}</div>
          </div>
        </div>
        <div style={{padding:"13px 15px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
            <div>
              <div style={{fontFamily:G.fontDisplay,fontSize:19,color:G.gold,fontWeight:700}}>{fmt(horse.price)}</div>
              <div style={{fontSize:9,color:"#333",fontFamily:G.fontUI}}>≈ {fmtDec(calcMonthly(horse.price*0.8,4.5,60))}/mois*</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:"#ccc",fontSize:12,fontWeight:600}}>{horse.level}</div>
              <div style={{color:"#555",fontSize:10}}>{horse.location}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <DocBadge label="Véto" active={!!horse.docs.veto}/><DocBadge label="Radio" active={!!horse.docs.radio}/><DocBadge label="Concours" active={!!horse.docs.concours}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BUYER SPACE ──────────────────────────────────────────────────────────────────
function BuyerSpace({user,setUser,horses,sellers,setView,onContact,onTransport}){
  const[tab,setTab]=useState("favorites");
  const[sel,setSel]=useState(null);
  const[compareList,setCompareList]=useState([]);
  const[showCompare,setShowCompare]=useState(false);
  const favHorses=horses.filter(h=>user.favorites?.includes(h.id)&&h.status==="published");
  const searches=user.savedSearches||[];

  const toggleFav=id=>setUser(u=>({...u,favorites:u.favorites?.includes(id)?u.favorites.filter(f=>f!==id):[...(u.favorites||[]),id]}));
  const toggleCompare=id=>{if(compareList.includes(id)){setCompareList(p=>p.filter(x=>x!==id));}else if(compareList.length<3){setCompareList(p=>[...p,id]);}};
  const deleteSearch=id=>setUser(u=>({...u,savedSearches:u.savedSearches.filter(s=>s.id!==id)}));

  return(
    <div style={{maxWidth:1000,margin:"0 auto",padding:"32px 44px 120px"}}>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,padding:"18px 22px",background:G.card,border:`1px solid ${G.border}`,borderRadius:6}}>
        <div style={{width:54,height:54,borderRadius:"50%",background:`linear-gradient(135deg,${G.gold},${G.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#000",fontFamily:G.fontUI,flexShrink:0}}>{user.avatar}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:G.fontDisplay,fontSize:20,fontWeight:700}}>{user.name}</div>
          <div style={{color:"#555",fontSize:11,marginTop:2,fontFamily:G.fontUI}}>Espace acheteur</div>
        </div>
        <div style={{display:"flex",gap:20,textAlign:"center"}}>
          {[[favHorses.length,"Favoris"],[searches.length,"Alertes"]].map(([v,l])=>(
            <div key={l}><div style={{fontFamily:G.fontDisplay,fontSize:18,color:G.gold,fontWeight:700}}>{v}</div><div style={{color:"#444",fontSize:9,letterSpacing:"0.08em",fontFamily:G.fontUI,marginTop:2}}>{l.toUpperCase()}</div></div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:0,marginBottom:22,borderBottom:`1px solid ${G.borderSub}`}}>
        {[["favorites",`♥ Favoris (${favHorses.length})`],["searches",`🔔 Alertes (${searches.length})`]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{background:"transparent",border:"none",borderBottom:`2px solid ${tab===k?G.gold:"transparent"}`,color:tab===k?G.gold:"#555",cursor:"pointer",fontFamily:G.fontUI,fontSize:11,letterSpacing:"0.1em",padding:"10px 20px",marginBottom:-1,transition:"all 0.2s"}}>{l.toUpperCase()}</button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:9}}>
          {compareList.length>=2&&<Btn small onClick={()=>setShowCompare(true)}>⇄ Comparer ({compareList.length})</Btn>}
          <Btn variant="outline" small onClick={()=>setView("marketplace")}>← Retour aux chevaux</Btn>
        </div>
      </div>

      {tab==="favorites"&&(
        favHorses.length===0?(
          <div style={{textAlign:"center",padding:"56px 0"}}><div style={{fontSize:36,marginBottom:12}}>♡</div><div style={{fontFamily:G.fontDisplay,fontSize:20,color:"#444",marginBottom:12}}>Aucun favori pour le moment</div><div style={{color:"#555",fontSize:13,marginBottom:18}}>Cliquez sur ♡ sur les fiches chevaux pour les sauvegarder ici</div><Btn variant="outline" onClick={()=>setView("marketplace")}>Parcourir les chevaux</Btn></div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:16}}>
            {favHorses.map(h=>(
              <HorseCard key={h.id} horse={h} seller={sellers[h.sellerId]} onClick={setSel} isFav={true} inCompare={compareList.includes(h.id)} onToggleFavorite={toggleFav} onToggleCompare={toggleCompare} isBuyer={true}/>
            ))}
          </div>
        )
      )}

      {tab==="searches"&&(
        searches.length===0?(
          <div style={{textAlign:"center",padding:"56px 0"}}>
            <div style={{fontSize:36,marginBottom:12}}>🔔</div>
            <div style={{fontFamily:G.fontDisplay,fontSize:20,color:"#444",marginBottom:12}}>Aucune alerte sauvegardée</div>
            <div style={{color:"#555",fontSize:13,marginBottom:18}}>Sauvegardez vos critères de recherche pour être notifié des nouvelles annonces</div>
            <Btn variant="outline" onClick={()=>setView("marketplace")}>Créer une alerte depuis la marketplace</Btn>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {searches.map(s=>{
              const matching=horses.filter(h=>{
                if(h.status!=="published")return false;
                const mD=s.filters.discipline==="Tous"||!s.filters.discipline||h.discipline===s.filters.discipline;
                const mL=!s.filters.location||h.location.toLowerCase().includes(s.filters.location.toLowerCase());
                const mB=!s.filters.budgetMax||h.price<=s.filters.budgetMax;
                return mD&&mL&&mB;
              });
              return(
                <div key={s.id} style={{background:G.card,border:`1px solid ${G.borderSub}`,borderRadius:4,padding:"16px 18px",display:"flex",alignItems:"center",gap:16}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(196,160,80,0.1)",border:`1px solid ${G.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🔔</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:G.fontUI,fontSize:12,fontWeight:700,color:"#ccc",marginBottom:4}}>{s.label}</div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                      {s.filters.discipline&&s.filters.discipline!=="Tous"&&<span style={{color:"#666",fontSize:11}}>📋 {s.filters.discipline}</span>}
                      {s.filters.location&&<span style={{color:"#666",fontSize:11}}>📍 {s.filters.location}</span>}
                      {s.filters.budgetMax&&<span style={{color:"#666",fontSize:11}}>💶 Max {fmt(s.filters.budgetMax)}</span>}
                      <span style={{color:"#444",fontSize:11}}>Créée le {s.createdAt}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:G.fontDisplay,fontSize:18,color:matching.length>0?G.gold:"#444",fontWeight:700}}>{matching.length}</div>
                      <div style={{color:"#444",fontSize:9,fontFamily:G.fontUI}}>CHEVAUX</div>
                    </div>
                    <Btn variant="outline" small onClick={()=>setView("marketplace")}>Voir →</Btn>
                    <Btn variant="danger" small onClick={()=>deleteSearch(s.id)}>✕</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Modal */}
      {sel&&<HorseModal horse={sel} sellers={sellers} user={user} setUser={setUser} onClose={()=>setSel(null)} onContact={h=>{onContact(h);setSel(null);}} onTransport={h=>{onTransport(h);setSel(null);}} compareList={compareList} onToggleCompare={toggleCompare} onToggleFavorite={toggleFav}/>}
      {showCompare&&compareList.length>=2&&<ComparatorModal compareList={compareList} horses={horses} sellers={sellers} onClose={()=>setShowCompare(false)} onContact={h=>{onContact(h);setShowCompare(false);}} user={user}/>}
      <ComparatorBar compareList={compareList} horses={horses} onOpen={()=>setShowCompare(true)} onRemove={id=>setCompareList(p=>p.filter(x=>x!==id))} onClear={()=>setCompareList([])}/>
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────────
function Header({view,setView,user,setUser,unreadCount,favCount}){
  const isCarrier=user?.role==="carrier";const isSeller=user?.role==="seller";const isBuyer=user?.role==="buyer";
  return(
    <header style={{borderBottom:`1px solid ${G.border}`,padding:"0 44px",display:"flex",alignItems:"center",justifyContent:"space-between",height:68,position:"sticky",top:0,zIndex:200,background:"rgba(8,8,8,0.97)",backdropFilter:"blur(20px)"}}>
      <div onClick={()=>setView("marketplace")} style={{display:"flex",alignItems:"center",gap:11,cursor:"pointer"}}>
        <div style={{width:32,height:32,borderRadius:"50%",border:`1px solid rgba(196,160,80,0.5)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🐴</div>
        <div><div style={{fontFamily:G.fontDisplay,fontSize:19,fontWeight:900,letterSpacing:"0.14em"}}>ÉQUINEO</div><div style={{fontSize:7,letterSpacing:"0.28em",color:G.gold,fontFamily:G.fontUI,marginTop:-2}}>MARKETPLACE ÉQUESTRE</div></div>
      </div>
      <nav style={{display:"flex",gap:4}}>
        {[["marketplace","Chevaux"],["transport","Transport"],["pricing","Tarifs"],["how","Comment ça marche"]].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{background:"transparent",border:"none",cursor:"pointer",color:view===v?(v==="transport"?G.blue:G.gold):"#555",fontSize:11,letterSpacing:"0.1em",padding:"8px 14px",fontFamily:G.fontUI,transition:"color 0.2s"}}>{l}</button>
        ))}
      </nav>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {user?(
          <>
            <button onClick={()=>setView("messages")} style={{position:"relative",background:view==="messages"?"rgba(196,160,80,0.1)":"transparent",border:`1px solid ${view==="messages"?G.border:"rgba(255,255,255,0.08)"}`,color:view==="messages"?G.gold:"#777",padding:"7px 14px",borderRadius:2,cursor:"pointer",fontFamily:G.fontUI,fontSize:11,display:"flex",alignItems:"center",gap:7}}>
              💬{unreadCount>0&&<span style={{background:G.gold,color:"#000",borderRadius:"50%",width:17,height:17,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800}}>{unreadCount}</span>}
            </button>
            {isBuyer&&(
              <button onClick={()=>setView("buyer")} style={{position:"relative",background:view==="buyer"?"rgba(196,160,80,0.1)":"transparent",border:`1px solid ${view==="buyer"?G.border:"rgba(255,255,255,0.08)"}`,color:view==="buyer"?G.gold:"#777",padding:"7px 14px",borderRadius:2,cursor:"pointer",fontFamily:G.fontUI,fontSize:11,display:"flex",alignItems:"center",gap:7}}>
                ♥ Mon espace{favCount>0&&<span style={{background:"rgba(196,160,80,0.2)",color:G.gold,borderRadius:10,padding:"1px 6px",fontSize:9,fontWeight:800}}>{favCount}</span>}
              </button>
            )}
            {(isSeller||isCarrier)&&<button onClick={()=>setView("dashboard")} style={{background:view==="dashboard"?"rgba(196,160,80,0.1)":"transparent",border:`1px solid ${view==="dashboard"?G.border:"rgba(255,255,255,0.08)"}`,color:view==="dashboard"?G.gold:"#888",padding:"7px 14px",borderRadius:2,cursor:"pointer",fontFamily:G.fontUI,fontSize:11}}>Mon espace</button>}
            <div style={{display:"flex",alignItems:"center",gap:9,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",padding:"5px 12px",borderRadius:2}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:isCarrier?`linear-gradient(135deg,${G.blue},#6aaef5)`:`linear-gradient(135deg,${G.gold},${G.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:isCarrier?"#fff":"#000",fontFamily:G.fontUI}}>{user.avatar}</div>
              <span style={{color:"#ccc",fontSize:11,fontFamily:G.fontUI}}>{user.name.split(" ")[0]}</span>
              <button onClick={()=>{setUser(null);setView("marketplace");}} style={{background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:14,lineHeight:1}}>×</button>
            </div>
          </>
        ):(
          <>
            <Btn variant="outline" small onClick={()=>setView("login")}>Connexion</Btn>
            <Btn small onClick={()=>setView("pricing")}>Commencer</Btn>
          </>
        )}
      </div>
    </header>
  );
}

// ─── MARKETPLACE ─────────────────────────────────────────────────────────────────
const DISCS=["Tous","CSO","Dressage","Loisir / Balade","Équitation de Travail"];
const BUDGETS=["Tous","< 20 000 €","20 000 – 50 000 €","50 000 – 100 000 €","> 100 000 €"];

function Marketplace({horses,sellers,user,setUser,onContact,onTransport,setView,compareList,setCompareList,showCompare,setShowCompare,showSavedSearch,setShowSavedSearch,appliedFilters,setAppliedFilters}){
  const[sel,setSel]=useState(null);
  const[transHorse,setTransHorse]=useState(null);
  const[disc,setDisc]=useState(appliedFilters?.discipline||"Tous");
  const[budget,setBudget]=useState("Tous");
  const[q,setQ]=useState("");

  const isBuyer=user?.role==="buyer";
  const favIds=user?.favorites||[];
  const toggleFav=id=>{if(!user){setView("login");return;}setUser(u=>({...u,favorites:u.favorites?.includes(id)?u.favorites.filter(f=>f!==id):[...(u.favorites||[]),id]}));};
  const toggleCompare=id=>{if(compareList.includes(id)){setCompareList(p=>p.filter(x=>x!==id));}else if(compareList.length<3){setCompareList(p=>[...p,id]);}};

  const published=horses.filter(h=>h.status==="published");
  const featured=published.filter(h=>h.featured);
  const filtered=published.filter(h=>{
    const mD=disc==="Tous"||h.discipline===disc;
    const mQ=h.name.toLowerCase().includes(q.toLowerCase())||h.breed.toLowerCase().includes(q.toLowerCase());
    const mB=budget==="Tous"?true:budget==="< 20 000 €"?h.price<20000:budget==="20 000 – 50 000 €"?h.price>=20000&&h.price<=50000:budget==="50 000 – 100 000 €"?h.price>50000&&h.price<=100000:h.price>100000;
    const mLoc=!appliedFilters?.location||h.location.toLowerCase().includes(appliedFilters.location.toLowerCase());
    return mD&&mQ&&mB&&mLoc;
  });

  return(
    <>
      <div style={{padding:"60px 44px 44px",textAlign:"center",background:"radial-gradient(ellipse at 50% 0%,rgba(196,160,80,0.07) 0%,transparent 65%)",borderBottom:`1px solid ${G.borderSub}`}}>
        <div style={{fontFamily:G.fontUI,fontSize:10,letterSpacing:"0.35em",color:G.gold,marginBottom:14}}>LA RÉFÉRENCE DU MARCHÉ ÉQUESTRE</div>
        <h1 style={{fontFamily:G.fontDisplay,fontSize:"clamp(30px,5vw,58px)",fontWeight:900,lineHeight:1.06,marginBottom:14}}>Des chevaux d'exception,<br/><em style={{color:G.gold,fontStyle:"italic"}}>sélectionnés pour vous.</em></h1>
        <p style={{color:"#666",fontSize:14,maxWidth:480,margin:"0 auto 20px",lineHeight:1.75,fontWeight:300}}>Docs vétérinaires · Financement · Transport · Avis vendeurs · Comparateur</p>
        <div style={{maxWidth:430,margin:"0 auto 12px",position:"relative"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher un cheval, une race…" style={{width:"100%",padding:"13px 18px",paddingRight:44,background:"rgba(255,255,255,0.04)",border:`1px solid rgba(196,160,80,0.28)`,borderRadius:3,color:"#fff",fontSize:14,fontFamily:G.fontBody,outline:"none"}}/>
          <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:G.gold,fontSize:17}}>⌕</span>
        </div>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>setView("transport")} style={{background:"transparent",border:"none",color:G.blue,fontSize:11,fontFamily:G.fontUI,cursor:"pointer"}}>🚛 Transport →</button>
          {isBuyer&&<button onClick={()=>setShowSavedSearch(true)} style={{background:"transparent",border:"none",color:G.gold,fontSize:11,fontFamily:G.fontUI,cursor:"pointer"}}>🔔 Sauvegarder cette recherche →</button>}
          {compareList.length>=2&&<button onClick={()=>setShowCompare(true)} style={{background:"rgba(74,144,217,0.1)",border:"1px solid rgba(74,144,217,0.3)",color:G.blue,fontSize:11,fontFamily:G.fontUI,cursor:"pointer",padding:"4px 12px",borderRadius:2}}>⇄ Comparer ({compareList.length}) →</button>}
        </div>
      </div>

      {appliedFilters&&<div style={{padding:"10px 44px",background:"rgba(196,160,80,0.04)",borderBottom:`1px solid ${G.borderSub}`,display:"flex",alignItems:"center",gap:10}}>
        <div style={{fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.1em",color:G.gold}}>🔔 ALERTE ACTIVE :</div>
        {appliedFilters.discipline&&appliedFilters.discipline!=="Tous"&&<span style={{background:"rgba(196,160,80,0.1)",border:`1px solid ${G.border}`,color:G.gold,fontSize:10,padding:"2px 9px",borderRadius:20,fontFamily:G.fontUI}}>{appliedFilters.discipline}</span>}
        {appliedFilters.location&&<span style={{background:"rgba(196,160,80,0.1)",border:`1px solid ${G.border}`,color:G.gold,fontSize:10,padding:"2px 9px",borderRadius:20,fontFamily:G.fontUI}}>{appliedFilters.location}</span>}
        <button onClick={()=>setAppliedFilters(null)} style={{background:"transparent",border:"none",color:"#555",cursor:"pointer",fontSize:11,fontFamily:G.fontUI,marginLeft:"auto"}}>× Effacer l'alerte</button>
      </div>}

      {featured.length>0&&!q&&disc==="Tous"&&(
        <div style={{padding:"22px 44px",borderBottom:`1px solid ${G.borderSub}`,background:"rgba(196,160,80,0.02)"}}>
          <div style={{fontFamily:G.fontUI,fontSize:10,letterSpacing:"0.25em",color:G.gold,marginBottom:13}}>⭐ ANNONCES EN VEDETTE</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:13}}>
            {featured.map(h=><HorseCard key={h.id} horse={h} seller={sellers[h.sellerId]} onClick={setSel} isFav={favIds.includes(h.id)} inCompare={compareList.includes(h.id)} onToggleFavorite={toggleFav} onToggleCompare={toggleCompare} isBuyer={isBuyer}/>)}
          </div>
        </div>
      )}

      <div style={{padding:"14px 44px",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",borderBottom:`1px solid ${G.borderSub}`}}>
        <span style={{fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.2em",color:"#444"}}>DISCIPLINE :</span>
        {DISCS.map(d=>(
          <button key={d} onClick={()=>setDisc(d)} style={{background:disc===d?`linear-gradient(135deg,${G.gold},${G.goldLight})`:"transparent",border:`1px solid ${disc===d?"transparent":"rgba(255,255,255,0.09)"}`,color:disc===d?"#000":"#777",padding:"5px 12px",borderRadius:2,cursor:"pointer",fontFamily:G.fontUI,fontSize:10,fontWeight:disc===d?700:400,transition:"all 0.2s"}}>{d}</button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <select value={budget} onChange={e=>setBudget(e.target.value)} style={{background:"rgba(255,255,255,0.04)",border:`1px solid rgba(255,255,255,0.09)`,color:"#aaa",padding:"5px 11px",borderRadius:2,fontFamily:G.fontUI,fontSize:10,cursor:"pointer",outline:"none"}}>
            {BUDGETS.map(b=><option key={b} value={b} style={{background:"#111"}}>{b}</option>)}
          </select>
        </div>
      </div>

      <div style={{padding:"12px 44px 2px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:G.fontUI,fontSize:9,color:"#444",letterSpacing:"0.1em"}}>{filtered.length} CHEVAL{filtered.length!==1?"UX":""} DISPONIBLE{filtered.length!==1?"S":""}</div>
        <div style={{fontFamily:G.fontUI,fontSize:9,color:"#333"}}>* Estimation 80% financé · 5 ans · 4,5%</div>
      </div>

      <main style={{padding:"16px 44px 100px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:17}}>
          {filtered.map(h=><HorseCard key={h.id} horse={h} seller={sellers[h.sellerId]} onClick={setSel} isFav={favIds.includes(h.id)} inCompare={compareList.includes(h.id)} onToggleFavorite={toggleFav} onToggleCompare={toggleCompare} isBuyer={isBuyer}/>)}
        </div>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"80px 0",color:"#333",fontFamily:G.fontDisplay,fontSize:22}}>Aucun résultat.</div>}
      </main>

      <HorseModal horse={sel} sellers={sellers} user={user} setUser={setUser} onClose={()=>setSel(null)} onContact={h=>{onContact(h);setSel(null);}} onTransport={h=>{setTransHorse(h);setSel(null);}} compareList={compareList} onToggleCompare={toggleCompare} onToggleFavorite={toggleFav}/>
      {transHorse&&<div onClick={()=>setTransHorse(null)} style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div onClick={e=>e.stopPropagation()} style={{background:"#090909",border:"1px solid rgba(74,144,217,0.3)",borderRadius:6,maxWidth:480,width:"100%",padding:"24px 28px",boxShadow:"0 40px 100px rgba(0,0,0,0.95)"}}><div style={{fontFamily:G.fontDisplay,fontSize:20,fontWeight:700,marginBottom:16}}>🚛 Transport pour {transHorse.name}</div><div style={{color:"#666",fontSize:13,marginBottom:16}}>Votre demande sera transmise aux transporteurs partenaires couvrant votre trajet.</div><div style={{display:"flex",gap:9,justifyContent:"flex-end"}}><Btn variant="ghost" small onClick={()=>setTransHorse(null)}>Annuler</Btn><Btn variant="blue" small onClick={()=>{onTransport(transHorse);setTransHorse(null);}}>Confirmer la demande</Btn></div></div></div>}
      {showCompare&&compareList.length>=2&&<ComparatorModal compareList={compareList} horses={horses} sellers={sellers} onClose={()=>setShowCompare(false)} onContact={h=>{onContact(h);setShowCompare(false);}} user={user}/>}
      {showSavedSearch&&<SavedSearchModal user={user} setUser={setUser} horses={horses} onApply={filters=>setAppliedFilters(filters)} onClose={()=>setShowSavedSearch(false)}/>}
      <ComparatorBar compareList={compareList} horses={horses} onOpen={()=>setShowCompare(true)} onRemove={id=>setCompareList(p=>p.filter(x=>x!==id))} onClear={()=>setCompareList([])}/>
    </>
  );
}

// ─── MESSAGING ───────────────────────────────────────────────────────────────────
function MessagingView({user,convs,setConvs,horses,allUsers}){
  const[activeId,setActiveId]=useState(null);const[draft,setDraft]=useState("");const bottomRef=useRef();
  const myConvs=convs.filter(c=>c.participants.includes(user.id));const active=myConvs.find(c=>c.id===activeId);
  useEffect(()=>{if(!activeId)return;setConvs(prev=>prev.map(c=>c.id!==activeId?c:{...c,messages:c.messages.map(m=>({...m,read:true}))}));},[activeId]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[active?.messages?.length]);
  const sendMsg=()=>{if(!draft.trim()||!active)return;const msg={id:`m${Date.now()}`,from:user.id,text:draft.trim(),at:Date.now(),read:false};setConvs(prev=>prev.map(c=>c.id===activeId?{...c,messages:[...c.messages,msg],lastAt:Date.now()}:c));setDraft("");};
  const unreadIn=c=>c.messages.filter(m=>m.from!==user.id&&!m.read).length;const other=c=>allUsers[c.participants.find(p=>p!==user.id)];const isTrans=c=>c.type==="transport";
  return(
    <div style={{display:"flex",height:"calc(100vh - 68px)",background:G.dark}}>
      <div style={{width:290,borderRight:`1px solid ${G.borderSub}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"15px 16px 12px",borderBottom:`1px solid ${G.borderSub}`}}><div style={{fontFamily:G.fontDisplay,fontSize:17,fontWeight:700}}>Messages</div></div>
        <div style={{flex:1,overflowY:"auto"}}>
          {myConvs.length===0?(<div style={{padding:"36px 16px",textAlign:"center",color:"#444",fontSize:12}}><div style={{fontSize:26,marginBottom:10}}>💬</div>Aucune conversation</div>)
          :myConvs.sort((a,b)=>b.lastAt-a.lastAt).map(c=>{const o=other(c),unread=unreadIn(c),last=c.messages[c.messages.length-1],isActive=c.id===activeId,trans=isTrans(c);
            return(<div key={c.id} onClick={()=>setActiveId(c.id)} style={{padding:"11px 15px",borderBottom:`1px solid ${G.borderSub}`,cursor:"pointer",background:isActive?`rgba(${trans?"74,144,217":"196,160,80"},0.07)`:"transparent",borderLeft:`3px solid ${isActive?(trans?G.blue:G.gold):"transparent"}`,transition:"all 0.15s"}}>
              <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                <div style={{position:"relative"}}><img src={c.horseImage} alt="" style={{width:40,height:30,objectFit:"cover",borderRadius:2,flexShrink:0}}/>{trans&&<div style={{position:"absolute",bottom:-3,right:-3,background:G.blue,borderRadius:"50%",width:13,height:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7}}>🚛</div>}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}><div style={{fontFamily:G.fontUI,fontSize:10,fontWeight:700,color:isActive?(trans?G.blue:G.gold):"#ccc",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.horseName}</div><div style={{fontFamily:G.fontUI,fontSize:8,color:"#444",flexShrink:0,marginLeft:4}}>{timeAgo(c.lastAt)}</div></div>
                  <div style={{fontSize:10,color:"#555"}}>{o?.name||"—"}</div>
                  {last&&<div style={{fontSize:10,color:unread>0?"#aaa":"#444",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:unread>0?600:400}}>{last.from===user.id?"Vous : ":""}{last.text}</div>}
                </div>
                {unread>0&&<div style={{background:trans?G.blue:G.gold,color:"#fff",borderRadius:"50%",width:15,height:15,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,flexShrink:0}}>{unread}</div>}
              </div>
            </div>);
          })}
        </div>
      </div>
      {active?(
        <div style={{flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{padding:"11px 20px",borderBottom:`1px solid ${G.borderSub}`,display:"flex",alignItems:"center",gap:12}}>
            <img src={active.horseImage} alt="" style={{width:44,height:33,objectFit:"cover",borderRadius:2}}/>
            <div style={{flex:1}}><div style={{fontFamily:G.fontDisplay,fontSize:15,fontWeight:700}}>{active.horseName}</div><div style={{color:"#555",fontSize:11,fontFamily:G.fontUI}}>{active.participants.filter(p=>p!==user.id).map(p=>allUsers[p]?.name).join(", ")}</div></div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"18px",display:"flex",flexDirection:"column",gap:10}}>
            {active.messages.length===0&&<div style={{textAlign:"center",color:"#333",fontSize:12,marginTop:50}}><div style={{fontSize:26,marginBottom:10}}>🐴</div>Démarrez la conversation</div>}
            {active.messages.map((msg,i)=>{const isMe=msg.from===user.id,sender=allUsers[msg.from],trans=isTrans(active),showDate=i===0||fmtDate(active.messages[i-1].at)!==fmtDate(msg.at);
              return(<div key={msg.id}>{showDate&&<div style={{textAlign:"center",margin:"6px 0"}}><span style={{fontFamily:G.fontUI,fontSize:8,color:"#444",background:G.dark,padding:"3px 10px",borderRadius:20,border:`1px solid ${G.borderSub}`}}>{fmtDate(msg.at)}</span></div>}
                <div style={{display:"flex",flexDirection:isMe?"row-reverse":"row",gap:8,alignItems:"flex-end"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:isMe?(trans?`linear-gradient(135deg,${G.blue},#6aaef5)`:`linear-gradient(135deg,${G.gold},${G.goldLight})`):"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"#fff",fontFamily:G.fontUI,flexShrink:0}}>{sender?.avatar||"?"}</div>
                  <div style={{maxWidth:"68%"}}><div style={{background:isMe?(trans?`linear-gradient(135deg,${G.blue},#6aaef5)`:`linear-gradient(135deg,${G.gold},${G.goldLight})`):"rgba(255,255,255,0.06)",color:isMe?"#fff":"#ddd",padding:"10px 13px",borderRadius:isMe?"14px 14px 4px 14px":"14px 14px 14px 4px",fontSize:13,lineHeight:1.6,fontFamily:G.fontBody}}>{msg.text}</div>
                  <div style={{fontFamily:G.fontUI,fontSize:8,color:"#444",marginTop:2,textAlign:isMe?"right":"left"}}>{fmtTime(msg.at)}</div></div>
                </div></div>);
            })}
            <div ref={bottomRef}/>
          </div>
          <div style={{padding:"11px 20px",borderTop:`1px solid ${G.borderSub}`,display:"flex",gap:9,alignItems:"flex-end"}}>
            <textarea value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}}} placeholder="Écrivez votre message…" rows={1} style={{flex:1,padding:"10px 13px",background:"rgba(255,255,255,0.05)",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:3,color:"#fff",fontSize:13,fontFamily:G.fontBody,outline:"none",resize:"none",lineHeight:1.5,maxHeight:100}}/>
            <button onClick={sendMsg} style={{background:isTrans(active)?`linear-gradient(135deg,${G.blue},#6aaef5)`:`linear-gradient(135deg,${G.gold},${G.goldLight})`,border:"none",color:"#fff",width:38,height:38,borderRadius:3,cursor:"pointer",fontSize:15,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>➤</button>
          </div>
        </div>
      ):(<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",color:"#333"}}><div style={{fontSize:40,marginBottom:16}}>💬</div><div style={{fontFamily:G.fontDisplay,fontSize:18,color:"#3a3a3a",marginBottom:5}}>Vos messages</div><div style={{color:"#2a2a2a",fontSize:12}}>Chevaux · Transport · Financement</div></div>)}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────────
function Login({onLogin,setView}){
const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[name,setName]=useState("");
  const[role,setRole]=useState("buyer");
  const[isSignUp,setIsSignUp]=useState(false);
  const[err,setErr]=useState("");
  const[loading,setLoading]=useState(false);

  const handle=async()=>{
    if(!email||!password){setErr("Veuillez remplir tous les champs.");return;}
    setLoading(true);setErr("");
    try{
      if(isSignUp){
  const{data,error:signUpError}=await supabase.auth.signUp({email,password,options:{data:{name:name||email.split("@")[0],role}}});
if(signUpError)throw signUpError;
if(data.user){await supabase.from('profiles').insert({id:data.user.id,name:name||email.split("@")[0],role,plan:'free',avatar:(name||email).charAt(0).toUpperCase()});}      
        setErr("✅ Compte créé ! Vérifiez votre email pour confirmer.");
      } else {
        const{data,error}=await supabase.auth.signInWithPassword({email,password});
        if(error)throw error;
        const{data:profile}=await supabase.from('profiles').select('*').eq('id',data.user.id).single();
        if(profile)onLogin({...profile,email});
        else setErr("Profil introuvable.");
      }
    }catch(e){setErr(e.message||"Une erreur est survenue.");}
    setLoading(false);
  };

  return(
    <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:6,padding:"44px 50px",maxWidth:430,width:"100%",boxShadow:"0 24px 80px rgba(0,0,0,0.6)"}}>
        <div style={{textAlign:"center",marginBottom:26}}>
          <div style={{fontSize:24,marginBottom:10}}>🐴</div>
          <div style={{fontFamily:G.fontDisplay,fontSize:22,fontWeight:700,marginBottom:6}}>{isSignUp?"Créer un compte":"Connexion"}</div>
          <div style={{color:"#555",fontSize:12}}>Vendeurs · Acheteurs · Transporteurs</div>
        </div>
        {isSignUp&&(
          <>
            <label style={{display:"block",fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.15em",color:"#555",marginBottom:7}}>VOTRE NOM</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Prénom Nom" style={{width:"100%",padding:"11px 13px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:3,color:"#fff",fontSize:14,fontFamily:G.fontBody,outline:"none",marginBottom:12}}/>
            <label style={{display:"block",fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.15em",color:"#555",marginBottom:7}}>VOUS ÊTES</label>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {[["buyer","Acheteur"],["seller","Vendeur"],["carrier","Transporteur"]].map(([v,l])=>(
                <button key={v} onClick={()=>setRole(v)} style={{flex:1,padding:"9px",background:role===v?`linear-gradient(135deg,${G.gold},${G.goldLight})`:"rgba(255,255,255,0.04)",border:`1px solid ${role===v?"transparent":"rgba(255,255,255,0.1)"}`,borderRadius:3,color:role===v?"#000":"#888",cursor:"pointer",fontFamily:G.fontUI,fontSize:10,fontWeight:role===v?700:400}}>{l}</button>
              ))}
            </div>
          </>
        )}
        <label style={{display:"block",fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.15em",color:"#555",marginBottom:7}}>ADRESSE E-MAIL</label>
        <input value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="votre@email.fr" style={{width:"100%",padding:"11px 13px",background:"rgba(255,255,255,0.04)",border:`1px solid ${err&&!err.includes("✅")?"rgba(200,50,50,0.5)":"rgba(255,255,255,0.1)"}`,borderRadius:3,color:"#fff",fontSize:14,fontFamily:G.fontBody,outline:"none",marginBottom:12}}/>
        <label style={{display:"block",fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.15em",color:"#555",marginBottom:7}}>MOT DE PASSE</label>
        <input type="password" value={password} onChange={e=>{setPassword(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="••••••••" style={{width:"100%",padding:"11px 13px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:3,color:"#fff",fontSize:14,fontFamily:G.fontBody,outline:"none",marginBottom:6}}/>
        {err&&<div style={{color:err.includes("✅")?"#70c080":"#c06060",fontSize:11,marginBottom:10,fontFamily:G.fontUI,marginTop:6}}>{err}</div>}
        <div style={{marginBottom:14}}/>
        <Btn full onClick={handle} style={{opacity:loading?0.6:1}}>
          {loading?"Chargement...":(isSignUp?"CRÉER MON COMPTE":"CONNEXION")}
        </Btn>
        <div style={{textAlign:"center",marginTop:16}}>
          <button onClick={()=>{setIsSignUp(v=>!v);setErr("");}} style={{background:"transparent",border:"none",color:G.gold,fontSize:11,fontFamily:G.fontUI,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>
            {isSignUp?"Déjà un compte ? Se connecter":"Pas de compte ? S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
} 

// ─── SIMPLE PAGES ─────────────────────────────────────────────────────────────────
function TransportPage({setView}){return(<div style={{maxWidth:800,margin:"0 auto",padding:"60px 44px 80px",textAlign:"center"}}><div style={{fontFamily:G.fontDisplay,fontSize:36,fontWeight:700,marginBottom:16}}>🚛 Transport équestre</div><p style={{color:"#666",fontSize:15,maxWidth:450,margin:"0 auto 32px",lineHeight:1.75}}>Demandez un devis depuis la fiche d'un cheval. Nos transporteurs partenaires vous répondent directement.</p><Btn onClick={()=>setView("marketplace")}>Parcourir les chevaux</Btn></div>);}
function PricingPage({user,setUser,setView}){
  const features={free:["1 annonce","Messagerie"],particulier:["3 annonces","Documents","Support"],pro:["Annonces illimitées","Badge ✓","Mise en avant","Stats"]};
  const handleChoose=planId=>{if(!user){setView("login");return;}if(user.role!=="seller")return;setUser(u=>({...u,plan:planId}));setView("dashboard");};
  return(<div style={{maxWidth:780,margin:"0 auto",padding:"56px 44px 80px"}}><div style={{textAlign:"center",marginBottom:40}}><div style={{fontFamily:G.fontDisplay,fontSize:"clamp(26px,4vw,44px)",fontWeight:900,marginBottom:12}}>Tarifs simples,<br/><em style={{color:G.gold,fontStyle:"italic"}}>sans commission sur la vente.</em></div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
      {Object.values(PLANS).map(plan=>{const isCurrent=user?.role==="seller"&&user?.plan===plan.id;return(
        <div key={plan.id} style={{position:"relative",background:plan.highlight?"rgba(196,160,80,0.04)":G.card,border:`1.5px solid ${plan.highlight?G.border:G.borderSub}`,borderRadius:6,padding:"24px 20px",display:"flex",flexDirection:"column"}}>
          {plan.highlight&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${G.gold},${G.goldLight})`,color:"#000",fontFamily:G.fontUI,fontSize:8,fontWeight:800,letterSpacing:"0.15em",padding:"3px 12px",borderRadius:20}}>POPULAIRE</div>}
          <div style={{marginBottom:14}}><div style={{fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.2em",color:plan.color,marginBottom:5}}>{plan.label.toUpperCase()}</div><div style={{fontFamily:G.fontDisplay,fontSize:32,fontWeight:900,color:plan.price===0?"#555":plan.highlight?G.gold:"#ccc",lineHeight:1}}>{plan.price===0?"Gratuit":`${plan.price}€`}</div>{plan.price>0&&<div style={{color:"#444",fontSize:10,fontFamily:G.fontUI,marginTop:3}}>/mois</div>}</div>
          <div style={{flex:1,marginBottom:16}}>{features[plan.id].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}><span style={{color:plan.highlight?G.gold:"#555",fontSize:11}}>✓</span><span style={{color:"#888",fontSize:12}}>{f}</span></div>)}</div>
          {isCurrent?<Btn variant="ghost" full>Plan actuel</Btn>:<Btn variant={plan.highlight?"gold":"outline"} full onClick={()=>handleChoose(plan.id)}>{plan.price===0?"Commencer":"Choisir"}</Btn>}
        </div>);
      })}
    </div>
  </div>);}
function HowItWorks(){const steps=[["01","Publiez votre annonce","Créez votre fiche cheval avec photos, documents et adresse pour le transport.","🐴"],["02","Outils acheteur","Favoris, alertes personnalisées, comparateur côte à côte, simulateur de financement.","⭐"],["03","Transport organisé","Demande de devis transport depuis la fiche. Partenaires vérifiés répondent dans la messagerie.","🚛"],["04","Avis & confiance","Les acheteurs laissent des avis sur les vendeurs. Construisez votre réputation.","💬"]];
  return(<div style={{maxWidth:820,margin:"0 auto",padding:"68px 44px"}}><div style={{textAlign:"center",marginBottom:46}}><div style={{fontFamily:G.fontDisplay,fontSize:36,fontWeight:700}}>Comment ça marche</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{steps.map(([num,title,desc,icon])=><div key={num} style={{background:G.card,border:`1px solid ${G.borderSub}`,borderRadius:4,padding:"20px 22px"}}><div style={{display:"flex",gap:12,marginBottom:10}}><div style={{fontFamily:G.fontDisplay,fontSize:28,fontWeight:900,color:"rgba(196,160,80,0.18)",lineHeight:1}}>{num}</div><div style={{fontSize:22}}>{icon}</div></div><div style={{fontFamily:G.fontDisplay,fontSize:16,fontWeight:700,marginBottom:6}}>{title}</div><div style={{color:"#666",fontSize:12,lineHeight:1.72}}>{desc}</div></div>)}</div></div>);}
function SellerDashboard({seller,horses,convs,onAdd,onUpdate,onDelete,setView}){const plan=PLANS[seller.plan];const mine=horses.filter(h=>h.sellerId===seller.id);const pub=mine.filter(h=>h.status==="published");const myConvs=convs.filter(c=>c.participants.includes(seller.id));const unread=myConvs.reduce((s,c)=>s+c.messages.filter(m=>m.from!==seller.id&&!m.read).length,0);const canAdd=plan.annonces===999||mine.length<plan.annonces;
  return(<div style={{maxWidth:960,margin:"0 auto",padding:"32px 44px 80px"}}><div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22,padding:"18px 22px",background:G.card,border:`1px solid ${G.border}`,borderRadius:6}}><div style={{width:54,height:54,borderRadius:"50%",background:`linear-gradient(135deg,${G.gold},${G.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#000",fontFamily:G.fontUI,flexShrink:0}}>{seller.avatar}</div><div style={{flex:1}}><div style={{fontFamily:G.fontDisplay,fontSize:19,fontWeight:700}}>{seller.name}</div><div style={{color:"#555",fontSize:11,marginTop:2}}>Plan {plan.label}</div></div><div style={{display:"flex",gap:20,textAlign:"center"}}>{[[pub.length,"Publiées"],[mine.length-pub.length,"Brouillons"],[myConvs.length,"Messages"]].map(([v,l])=><div key={l}><div style={{fontFamily:G.fontDisplay,fontSize:17,color:G.gold,fontWeight:700}}>{v}</div><div style={{color:"#444",fontSize:9,letterSpacing:"0.08em",fontFamily:G.fontUI,marginTop:2}}>{l.toUpperCase()}</div></div>)}</div></div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.2em",color:G.gold}}>MES ANNONCES ({mine.length})</div><div style={{display:"flex",gap:9}}>{unread>0&&<button onClick={()=>setView("messages")} style={{background:"rgba(196,160,80,0.1)",border:`1px solid ${G.border}`,color:G.gold,padding:"6px 13px",borderRadius:2,cursor:"pointer",fontFamily:G.fontUI,fontSize:9,fontWeight:700}}>💬 {unread} nouveau{unread>1?"x":""}</button>}{canAdd?<Btn small onClick={()=>alert("Formulaire de création — voir version complète")}>+ Nouvelle annonce</Btn>:<Btn small variant="outline" onClick={()=>setView("pricing")}>Upgrader →</Btn>}</div></div>
  {mine.length===0?(<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:32,marginBottom:12}}>🐴</div><div style={{fontFamily:G.fontDisplay,fontSize:20,color:"#444",marginBottom:12}}>Aucune annonce</div><Btn onClick={()=>{}}>Créer ma première annonce</Btn></div>)
  :<div style={{display:"flex",flexDirection:"column",gap:9}}>{mine.map(h=>{const p=h.status==="published",dc=[h.docs.veto,h.docs.radio,h.docs.concours].filter(Boolean).length;
    return(<div key={h.id} style={{display:"flex",alignItems:"center",gap:12,background:G.card,border:`1px solid ${G.borderSub}`,borderRadius:4,padding:"11px 14px"}}><img src={h.image} alt={h.name} style={{width:60,height:44,objectFit:"cover",borderRadius:3,flexShrink:0,filter:p?"none":"grayscale(60%) brightness(0.5)"}}/><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><div style={{fontFamily:G.fontDisplay,fontSize:15,fontWeight:700,color:p?"#fff":"#666"}}>{h.name}</div><span style={{fontFamily:G.fontUI,fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:20,background:p?"rgba(80,160,80,0.15)":"rgba(255,255,255,0.05)",color:p?"#70c080":"#555",border:`1px solid ${p?"rgba(80,160,80,0.3)":"rgba(255,255,255,0.07)"}`}}>{p?"● PUBLIÉ":"○ BROUILLON"}</span></div><div style={{display:"flex",gap:12,color:"#555",fontSize:11}}><span>{h.breed} · {h.age} ans</span><span style={{color:G.gold,fontWeight:600}}>{fmt(h.price)}</span><span style={{color:dc===3?"#70c080":dc>0?"#888":"#444"}}>{dc}/3 docs</span></div></div><div style={{display:"flex",gap:6}}><Btn variant={p?"ghost":"green"} small onClick={()=>onUpdate({...h,status:p?"draft":"published"})}>{p?"Dépublier":"Publier"}</Btn><Btn variant="danger" small onClick={()=>onDelete(h.id)}>✕</Btn></div></div>);
  })}</div>}
  {/* Avis section */}
  <div style={{marginTop:32,padding:"22px 24px",background:G.card,border:`1px solid ${G.border}`,borderRadius:6}}><div style={{fontFamily:G.fontUI,fontSize:9,letterSpacing:"0.2em",color:G.gold,marginBottom:16}}>MES AVIS ({seller.reviews?.length||0})</div>{seller.reviews?.length===0?<div style={{color:"#444",fontSize:13}}>Aucun avis pour l'instant.</div>:seller.reviews?.map(r=><div key={r.id} style={{padding:"12px 14px",background:"rgba(255,255,255,0.02)",border:`1px solid ${G.borderSub}`,borderRadius:3,marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontFamily:G.fontUI,fontSize:11,fontWeight:700,color:"#ccc"}}>{r.buyerName}</div><div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{color:G.gold,fontSize:13}}>{"★".repeat(r.rating)}</div><div style={{color:"#444",fontSize:10}}>{r.date}</div></div></div><div style={{color:"#888",fontSize:12,lineHeight:1.6}}>{r.text}</div></div>)}</div>
  </div>);}

// ─── ROOT ─────────────────────────────────────────────────────────────────────────
export default function App(){
  const[view,setView]=useState("marketplace");
  const[user,setUser]=useState(null);
  const[horses,setHorses]=useState(INIT_HORSES);

useEffect(()=>{
  supabase.from('horses').select('*').eq('status','published').then(({data})=>{
    if(data&&data.length>0)setHorses(data);
  });
},[]);
  const[convs,setConvs]=useState(INIT_CONVS);
  const[sellers,setSellers]=useState(SELLERS);
  const[compareList,setCompareList]=useState([]);
  const[showCompare,setShowCompare]=useState(false);
  const[showSavedSearch,setShowSavedSearch]=useState(false);
  const[appliedFilters,setAppliedFilters]=useState(null);
  const allUsers={...sellers,...BUYERS,...CARRIERS};
  const unread=user?convs.filter(c=>c.participants.includes(user.id)).reduce((s,c)=>s+c.messages.filter(m=>m.from!==user.id&&!m.read).length,0):0;
  const favCount=user?.favorites?.length||0;

  const handleLogin=u=>{
    // merge live user data
    const liveUser=u.role==="buyer"?BUYERS[u.id]:u.role==="seller"?sellers[u.id]:CARRIERS[u.id];
    setUser({...u,...liveUser});
    setView(u.role==="seller"?"dashboard":u.role==="carrier"?"dashboard":"marketplace");
  };
  const handleContact=horse=>{if(!user){setView("login");return;}if(user.id===horse.sellerId||user.role!=="buyer")return;const exists=convs.find(c=>c.horseId===horse.id&&c.type!=="transport"&&c.participants.includes(user.id)&&c.participants.includes(horse.sellerId));if(!exists)setConvs(p=>[...p,{id:`c${Date.now()}`,type:"horse",horseId:horse.id,horseName:horse.name,horseImage:horse.image,participants:[user.id,horse.sellerId],lastAt:Date.now(),messages:[]}]);setView("messages");};
  const handleTransport=horse=>{setConvs(p=>[...p,{id:`tc${Date.now()}`,type:"transport",horseId:horse.id,horseName:horse.name,horseImage:horse.image,participants:[Object.keys(CARRIERS)[0],user.id],lastAt:Date.now(),messages:[{id:`m${Date.now()}`,from:"system",text:`Nouvelle demande de transport : ${horse.name}`,at:Date.now(),read:false}]}]);setView("messages");};
  const handleReview=(sellerId,review)=>{setSellers(prev=>({...prev,[sellerId]:{...prev[sellerId],reviews:[...(prev[sellerId].reviews||[]),review]}}));};

  return(
    <div style={{minHeight:"100vh",background:G.dark,color:"#fff",fontFamily:G.fontBody}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}input[type=range]{-webkit-appearance:none;appearance:none;background:transparent}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:1px;height:1px}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:#2a2a2a}select,input,textarea{color-scheme:dark}`}</style>
      <Header view={view} setView={setView} user={user} setUser={setUser} unreadCount={unread} favCount={favCount}/>
      {view==="marketplace"&&<Marketplace horses={horses} sellers={sellers} user={user} setUser={setUser} onContact={handleContact} onTransport={handleTransport} setView={setView} compareList={compareList} setCompareList={setCompareList} showCompare={showCompare} setShowCompare={setShowCompare} showSavedSearch={showSavedSearch} setShowSavedSearch={setShowSavedSearch} appliedFilters={appliedFilters} setAppliedFilters={setAppliedFilters}/>}
      {view==="transport"&&<TransportPage setView={setView}/>}
      {view==="pricing"&&<PricingPage user={user} setUser={setUser} setView={setView}/>}
      {view==="login"&&<Login onLogin={handleLogin} setView={setView}/>}
      {view==="how"&&<HowItWorks/>}
      {view==="dashboard"&&user?.role==="seller"&&<SellerDashboard seller={{...user,...sellers[user.id]}} horses={horses} convs={convs} onAdd={h=>setHorses(p=>[...p,h])} onUpdate={h=>setHorses(p=>p.map(x=>x.id===h.id?h:x))} onDelete={id=>setHorses(p=>p.filter(x=>x.id!==id))} setView={setView}/>}
      {view==="buyer"&&user?.role==="buyer"&&<BuyerSpace user={user} setUser={setUser} horses={horses} sellers={sellers} setView={setView} onContact={handleContact} onTransport={handleTransport}/>}
      {view==="messages"&&user&&<MessagingView user={user} convs={convs} setConvs={setConvs} horses={horses} allUsers={allUsers}/>}
      <footer style={{borderTop:`1px solid rgba(196,160,80,0.12)`,padding:"26px 44px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#050505"}}>
        <div><div style={{fontFamily:G.fontDisplay,fontSize:14,fontWeight:900,letterSpacing:"0.14em"}}>ÉQUINEO</div><div style={{color:"#2a2a2a",fontSize:9,marginTop:3,fontFamily:G.fontUI,letterSpacing:"0.2em"}}>© 2025 — MARKETPLACE ÉQUESTRE</div></div>
        <div style={{color:"#333",fontSize:10,fontFamily:G.fontUI,textAlign:"right"}}><div>Abonnements · Transport · Financement · Avis</div><div style={{color:G.gold,marginTop:3}}>Aucune commission sur les ventes</div></div>
      </footer>
    </div>
  );
}
