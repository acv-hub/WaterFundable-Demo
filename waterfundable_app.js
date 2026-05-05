// WaterFundable PBC — Technology A: Tech A | Tech B: Tech B
// Single-basin portfolio rule | (c) 2026 WaterFundable PBC
function setLogos(){
  // Nav/wiz logos are pre-embedded in HTML — just ensure display:inline-block
  ['logo-nav','logo-wiz'].forEach(id=>{
    const el=document.getElementById(id);
    if(el&&el.src&&el.src.length>100)el.style.display='inline-block';
  });
  ['wf-wm-nav','wf-wm-wiz'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.style.display='none';
  });
}
window.addEventListener('DOMContentLoaded',setLogos);
const ACCTS={'utility[at]test.com':{pw:'demo',role:'utility',nm:'Colusa County Water District'},'admin[at]test.com':{pw:'demo',role:'admin',nm:'WaterFundable Admin'},'impact[at]test.com':{pw:'demo',role:'impact_capital',nm:'Microsoft Impact Capital'}};
let CU=null,wSubs=[],pH={};

// ── PROJECT DATA: Real California SRF projects mapped to WRC priority basins ──
// Source: CA CWSRF IUP 2024-25 Fundable List + CA DWSRF 2025-26 Fundable List
// Single-basin portfolio rule: Portfolio 1 = Sacramento River Basin
// Portfolio 2 = San Joaquin Basin (pipeline), Portfolio 3 = Colorado/Other

const FP=[
  // ── PORTFOLIO 1: Sacramento River Basin ───────────────────────────────────
  // CWSRF projects
  {id:1,org:'City of Colusa',ba:'Sacramento River',bt:'mvp',portfolio:1,
   ty:'Water recycling',ti:'reuse',sc:810,st:'portfolio_queue',oc:'eligible',dt:'Mar 1, 2026',fl:{ta:false,no:false},adv:'J. Martinez',
   srf:{type:'CWSRF/WRFP',num:'8613-110',pf:false,dac:false,iup:'Fundable'},
   ts:{en:'Municipal water utility',sta:'California',ci:'Colusa, CA',po:'6,359',cs:'Within 12 months',
       co:'$33.3M',balloc:'$33.3M',cws:'~$3.3M',ds:'1.6x - 1.8x',ca:'105 days',
       cr:'Investment grade — BBB+',rv:'Confirmed',ws:'120M gal/yr',wa:'6,359',
       gh:'210 tCO2e/yr',nr:'N/A — recycled water',bi:'Water reuse. Potential WRI VWBA replenishment credit.',
       bs:'Extremely high — WRI Tier 5',cd:true,score_equiv:'A (810 pts)',
       pillar_scores:{p1:200,p2:165,p3:130,p4:125,p5:110,p6:45,p7:35}}},

  {id:2,org:'Sacramento Area Sewer District — Hood/Franklin/Old Florin Septic Conversions',ba:'Sacramento River',bt:'mvp',portfolio:1,
   ty:'Wastewater',ti:'ww',sc:752,st:'verified',oc:'eligible',dt:'Feb 15, 2026',fl:{ta:false,no:false},adv:'J. Martinez',
   srf:{type:'CWSRF/SCWW',num:'8454/8458/8457-110',pf:true,dac:true,iup:'Fundable'},
   ts:{en:'Special district',sta:'California',ci:'South Sacramento, CA',po:'1,983',cs:'Within 12 months',
       co:'$29.5M',balloc:'$29.5M',cws:'~$2.95M',ds:'1.5x - 1.7x',ca:'95 days',
       cr:'Investment grade — BBB+',rv:'Confirmed',ws:'N/A — wastewater',wa:'1,983',
       gh:'380 tCO2e/yr',nr:'N/A',bi:'DAC septic conversions. Environmental justice priority.',
       bs:'Extremely high — WRI Tier 5',cd:true,score_equiv:'BBB+ (752 pts)',
       pillar_scores:{p1:185,p2:155,p3:140,p4:115,p5:95,p6:45,p7:17}}},

  {id:3,org:'Sewerage Commission — Oroville Region (WWTP Upgrade)',ba:'Sacramento River',bt:'mvp',portfolio:1,
   ty:'Wastewater',ti:'ww',sc:741,st:'data_room_locked',oc:'eligible',dt:'Jan 20, 2026',fl:{ta:false,no:false},adv:'',
   srf:{type:'CWSRF',num:'8735-110',pf:false,dac:false,iup:'Fundable'},
   ts:{en:'Regional sanitation commission',sta:'California',ci:'Oroville, CA',po:'44,000',cs:'12-24 months',
       co:'$48.7M',balloc:'$48.7M',cws:'~$4.87M',ds:'1.5x - 1.7x',ca:'110 days',
       cr:'Investment grade — BBB+',rv:'Confirmed',ws:'N/A — wastewater',wa:'44,000',
       gh:'520 tCO2e/yr',nr:'N/A',bi:'Nutrient load reduction. Potential SDG 14 claims.',
       bs:'Extremely high — WRI Tier 5',cd:true,score_equiv:'BBB+ (741 pts)',
       pillar_scores:{p1:178,p2:160,p3:115,p4:120,p5:105,p6:43,p7:20}}},

  {id:4,org:'Olivehurst Public Utility District (Regional Wastewater)',ba:'Sacramento River',bt:'mvp',portfolio:1,
   ty:'Wastewater',ti:'ww',sc:698,st:'under_review',oc:'eligible',dt:'Jan 10, 2026',fl:{ta:false,no:false},adv:'',
   srf:{type:'CWSRF/SCWW',num:'8754-110',pf:false,dac:false,iup:'Fundable'},
   ts:{en:'Public utility district',sta:'California',ci:'Olivehurst (Yuba County), CA',po:'16,262',cs:'12-24 months',
       co:'$26.8M',balloc:'$26.8M',cws:'~$2.68M',ds:'1.2x - 1.5x',ca:'85 days',
       cr:'Investment grade — BBB (conditional)',rv:'Confirmed',ws:'N/A — wastewater',wa:'16,262',
       gh:'290 tCO2e/yr',nr:'N/A',bi:'Regional transmission — no NBS component.',
       bs:'High — WRI Tier 4',cd:true,score_equiv:'BBB (698 pts — conditional)',
       pillar_scores:{p1:165,p2:140,p3:125,p4:110,p5:95,p6:43,p7:20}}},

  // DWSRF projects in Sacramento basin
  {id:5,org:'South Tahoe Public Utility District (Pioneer Trail + Tahoe/Glenwood Waterlines)',ba:'Sacramento River',bt:'mvp',portfolio:1,
   ty:'Drinking water',ti:'dw',sc:779,st:'wizard_complete',oc:'eligible',dt:'Dec 15, 2025',fl:{ta:false,no:false},adv:'',
   srf:{type:'DWSRF',num:'0910002-031C/032C',pf:false,dac:false,iup:'Fundable'},
   ts:{en:'Public utility district',sta:'California',ci:'South Lake Tahoe, CA',po:'60,000',cs:'12-24 months',
       co:'$14.5M',balloc:'$14.5M',cws:'~$1.45M',ds:'1.7x - 2.0x',ca:'135 days',
       cr:'Investment grade — A equiv.',rv:'Confirmed',ws:'52M gal/yr',wa:'60,000',
       gh:'145 tCO2e/yr',nr:'14% — typical',bi:'System reliability upgrade. Climate resilience framing applicable.',
       bs:'High — WRI Tier 4 (drought-stressed Lake Tahoe basin)',cd:true,score_equiv:'BBB+ (779 pts)',
       pillar_scores:{p1:192,p2:158,p3:120,p4:118,p5:105,p6:42,p7:44}}},

  {id:6,org:'Placer County Water Agency — Colfax WTP Replacement',ba:'Sacramento River',bt:'mvp',portfolio:1,
   ty:'Drinking water',ti:'dw',sc:821,st:'tech_a_intake',oc:'eligible',dt:'Nov 30, 2025',fl:{ta:false,no:false},adv:'',
   srf:{type:'DWSRF',num:'3110006-001C',pf:true,dac:false,iup:'Fundable — Priority F'},
   ts:{en:'Water agency',sta:'California',ci:'Colfax, CA',po:'2,987',cs:'Within 12 months',
       co:'$12.5M',balloc:'$12.5M',cws:'~$1.25M',ds:'2.0x - 2.5x',ca:'155 days',
       cr:'Investment grade — A',rv:'Confirmed',ws:'38M gal/yr',wa:'2,987',
       gh:'92 tCO2e/yr',nr:'19% — slightly elevated',bi:'WTP replacement. No NBS. Energy efficiency claim applicable.',
       bs:'Extremely high — WRI Tier 5',cd:true,score_equiv:'A (821 pts)',
       pillar_scores:{p1:210,p2:165,p3:130,p4:128,p5:110,p6:46,p7:32}}},

  // TA referral in Sacramento basin
  {id:7,org:'City of Redding — Ricardo Ave Septic to Sewer',ba:'Sacramento River',bt:'mvp',portfolio:1,
   ty:'Wastewater',ti:'ww',sc:618,st:'wizard_complete',oc:'ta',dt:'Feb 5, 2026',fl:{ta:true,no:false},adv:'',
   srf:{type:'CWSRF/SCWW',num:'8621-110',pf:true,dac:true,iup:'Fundable'},
   ts:{en:'Municipal utility',sta:'California',ci:'Redding, CA',po:'100',cs:'12-24 months',
       co:'$2.7M',balloc:'N/A — TA referral',cws:'Pending TA resolution',ds:'1.0x - 1.2x',ca:'55 days',
       cr:'TA required — thin financial coverage',rv:'Not sure',ws:'N/A — wastewater',wa:'100',
       gh:'25 tCO2e/yr',nr:'N/A',bi:'Small DAC project. Strong SRF set-aside. Financial TA needed.',
       bs:'High — WRI Tier 4',cd:false,score_equiv:'BBB (618 pts — TA required)',
       pillar_scores:{p1:138,p2:130,p3:125,p4:110,p5:80,p6:35,p7:0}}},

  // ── P1 ADDITIONS — Sacramento River Basin (CWSRF IUP 2024-25) ───────────
  {id:13,org:'City of Woodland — WWTP Improvements',ba:'Sacramento River',bt:'mvp',portfolio:1,
   ty:'Wastewater treatment',ti:'ww',sc:741,st:'under_review',oc:'eligible',dt:'Apr 2, 2026',fl:{ta:false,no:false},adv:'K. Walsh',
   srf:{type:'CWSRF',num:'8631-110',pf:false,dac:false},
   ts:{co:'$18.5M',ci:'Woodland, CA',ws:'16.2M gal/yr',gh:'68 tCO2e/yr',cd:true,
       score_equiv:'BBB+ (741/1000)',pillar_scores:{p1:172,p2:148,p3:108,p4:110,p5:105,p6:42,p7:36}}},

  {id:14,org:'City of Chico — WWTP Biogas Recovery',ba:'Sacramento River',bt:'mvp',portfolio:1,
   ty:'Wastewater treatment',ti:'ww',sc:788,st:'tech_a_intake',oc:'eligible',dt:'Mar 28, 2026',fl:{ta:false,no:false},adv:'J. Martinez',
   srf:{type:'CWSRF',num:'8742-110',pf:false,dac:false},
   ts:{co:'$22.1M',ci:'Chico, CA',ws:'19.8M gal/yr',gh:'142 tCO2e/yr',cd:true,
       score_equiv:'A- (788/1000)',pillar_scores:{p1:192,p2:155,p3:114,p4:118,p5:112,p6:48,p7:49}}},

  {id:15,org:'Yolo County FCD — Sewer System Rehabilitation',ba:'Sacramento River',bt:'mvp',portfolio:1,
   ty:'Wastewater collection',ti:'ww',sc:722,st:'wizard_complete',oc:'eligible',dt:'Apr 8, 2026',fl:{ta:false,no:false},adv:'',
   srf:{type:'CWSRF',num:'8698-110',pf:false,dac:false},
   ts:{co:'$11.8M',ci:'Yolo County, CA',ws:'10.4M gal/yr',gh:'44 tCO2e/yr',cd:false,
       score_equiv:'BBB+ (722/1000)',pillar_scores:{p1:165,p2:142,p3:105,p4:108,p5:108,p6:44,p7:50}}},

  // ── PORTFOLIO 2 PIPELINE: San Joaquin Basin ─────────────────────────────
  {id:8,org:'City of Dixon — WWTF Expansion',ba:'San Joaquin',bt:'mvp',portfolio:2,
   ty:'Wastewater',ti:'ww',sc:748,st:'wizard_complete',oc:'eligible',dt:'Jan 25, 2026',fl:{ta:false,no:false},adv:'',
   srf:{type:'CWSRF',num:'8001-210',pf:false,dac:false,iup:'Fundable — Priority 13'},
   ts:{en:'Municipal water utility',sta:'California',ci:'Dixon, CA',po:'157,635',cs:'12-24 months',
       co:'$36.7M',balloc:'$36.7M',cws:'~$3.67M',ds:'1.5x - 1.7x',ca:'98 days',
       cr:'Investment grade — BBB+',rv:'Confirmed',ws:'N/A — wastewater',wa:'157,635',
       gh:'440 tCO2e/yr',nr:'N/A',bi:'Nutrient reduction. Green Project Reserve eligible.',
       bs:'Extremely high — WRI Tier 5',cd:true,score_equiv:'BBB+ (748 pts)',
       pillar_scores:{p1:182,p2:152,p3:128,p4:118,p5:100,p6:45,p7:23}}},

  {id:9,org:'City of Merced — WWTF Phase VI Improvements',ba:'San Joaquin',bt:'mvp',portfolio:2,
   ty:'Wastewater',ti:'ww',sc:762,st:'wizard_complete',oc:'eligible',dt:'Jan 5, 2026',fl:{ta:false,no:false},adv:'',
   srf:{type:'CWSRF',num:'8798-110',pf:false,dac:false,iup:'Fundable — Priority 14'},
   ts:{en:'Municipal water utility',sta:'California',ci:'Merced, CA',po:'91,563',cs:'12-24 months',
       co:'$61.9M',balloc:'$50.0M',cws:'~$6.19M',ds:'1.5x - 1.8x',ca:'100 days',
       cr:'Investment grade — BBB+',rv:'Confirmed',ws:'N/A — wastewater',wa:'91,563',
       gh:'580 tCO2e/yr',nr:'N/A',bi:'BIL General Supplemental eligible. Green Project Reserve applicable.',
       bs:'Extremely high — WRI Tier 5',cd:true,score_equiv:'BBB+ (762 pts)',
       pillar_scores:{p1:188,p2:155,p3:130,p4:118,p5:103,p6:45,p7:23}}},

  {id:10,org:'Stockton-East Water District — Bellota Weir Modification',ba:'San Joaquin',bt:'mvp',portfolio:2,
   ty:'Drinking water',ti:'dw',sc:738,st:'wizard_complete',oc:'eligible',dt:'Dec 20, 2025',fl:{ta:false,no:false},adv:'',
   srf:{type:'DWSRF',num:'3910006-004C',pf:false,dac:false,iup:'Fundable — Priority F'},
   ts:{en:'Water district (wholesaler)',sta:'California',ci:'Stockton, CA',po:'364,624',cs:'12-24 months',
       co:'$80.0M',balloc:'$50.0M',cws:'~$8.0M',ds:'1.5x - 1.7x',ca:'88 days',
       cr:'Investment grade — BBB+',rv:'Confirmed',ws:'310M gal/yr',wa:'364,624',
       gh:'480 tCO2e/yr',nr:'12% — well managed',bi:'Diversion infrastructure. Climate resilience applicable.',
       bs:'Extremely high — WRI Tier 5',cd:true,score_equiv:'BBB+ (738 pts)',
       pillar_scores:{p1:178,p2:150,p3:125,p4:115,p5:102,p6:45,p7:23}}},

  // San Joaquin TA referral
  {id:11,org:'Kern Delta Water District',ba:'San Joaquin',bt:'mvp',portfolio:2,
   ty:'Drinking water',ti:'dw',sc:582,st:'wizard_complete',oc:'ta',dt:'Dec 1, 2025',fl:{ta:true,no:true},adv:'',
   srf:{type:'DWSRF',num:'Pre-application',pf:false,dac:false,iup:'Not yet on IUP'},
   ts:{en:'Special district',sta:'California',ci:'Bakersfield, CA',po:'31,000',cs:'24-36 months',
       co:'$11.2M',balloc:'N/A — TA referral',cws:'Pending TA resolution',ds:'1.0x - 1.2x',ca:'45 days',
       cr:'TA required — no licensed operator',rv:'Confirmed',ws:'95M gal/yr',wa:'31,000',
       gh:'340 tCO2e/yr',nr:'31% — elevated',bi:'Distribution upgrade. Limited NBS component.',
       bs:'Extremely high — WRI Tier 5',cd:true,score_equiv:'BBB- (582 pts — TA required)',
       pillar_scores:{p1:130,p2:120,p3:80,p4:105,p5:100,p6:47,p7:0}}},

  // ── P2 ADDITIONS — San Joaquin Basin (CWSRF IUP 2024-25) ─────────────────
  {id:16,org:'City of Modesto — WW System Rehabilitation',ba:'San Joaquin',bt:'mvp',portfolio:2,
   ty:'Wastewater treatment',ti:'ww',sc:748,st:'wizard_complete',oc:'eligible',dt:'Apr 5, 2026',fl:{ta:false,no:false},adv:'',
   srf:{type:'CWSRF',num:'8901-110',pf:false,dac:false},
   ts:{co:'$45.0M',ci:'Modesto, CA',ws:'39.2M gal/yr',gh:'168 tCO2e/yr',cd:false,
       score_equiv:'BBB+ (748/1000)',pillar_scores:{p1:180,p2:148,p3:110,p4:108,p5:110,p6:42,p7:50}}},

  {id:17,org:'Fresno Irrigation District — Recycled Water Delivery',ba:'San Joaquin',bt:'mvp',portfolio:2,
   ty:'Water recycling / reuse',ti:'reuse',sc:791,st:'wizard_complete',oc:'eligible',dt:'Apr 3, 2026',fl:{ta:false,no:false},adv:'',
   srf:{type:'CWSRF',num:'8832-110',pf:false,dac:false},
   ts:{co:'$28.4M',ci:'Fresno, CA',ws:'12,000 AFY recycled',gh:'210 tCO2e/yr',cd:true,
       score_equiv:'A- (791/1000)',pillar_scores:{p1:188,p2:158,p3:112,p4:120,p5:115,p6:48,p7:50}}},

  {id:18,org:'City of Turlock — WWTP Nitrogen Compliance',ba:'San Joaquin',bt:'mvp',portfolio:2,
   ty:'Wastewater treatment',ti:'ww',sc:736,st:'wizard_complete',oc:'eligible',dt:'Apr 7, 2026',fl:{ta:false,no:false},adv:'',
   srf:{type:'CWSRF',num:'8811-110',pf:false,dac:false},
   ts:{co:'$35.2M',ci:'Turlock, CA',ws:'30.8M gal/yr',gh:'128 tCO2e/yr',cd:false,
       score_equiv:'BBB+ (736/1000)',pillar_scores:{p1:175,p2:150,p3:108,p4:110,p5:108,p6:45,p7:40}}},

  // ── RESERVE / DECLINED ────────────────────────────────────────────────────
  {id:12,org:'Oregon City Waterworks',ba:'Willamette',bt:'reserve',portfolio:null,
   ty:'Lead service line',ti:'lsl',sc:341,st:'wizard_complete',oc:'decline',dt:'Nov 15, 2025',fl:{ta:false,no:false},adv:'',
   srf:{type:'None',num:'N/A',pf:false,dac:false,iup:'Not applicable — reserve basin'},
   ts:{en:'Municipal water utility',sta:'Oregon',ci:'Oregon City, OR',po:'5,800',cs:'Within 12 months',
       co:'$2.1M',balloc:'N/A — reserve basin',cws:'N/A',ds:'Below 1.0x',ca:'28 days',
       cr:'Not eligible',rv:'No',ws:'18M gal/yr',wa:'5,800',
       gh:'45 tCO2e/yr',nr:'18% — typical',bi:'Lead service line replacement. No NBS.',
       bs:'Medium — WRI Tier 3',cd:false,score_equiv:'Sub-investment grade (<500 pts)',
       pillar_scores:{p1:80,p2:90,p3:60,p4:55,p5:36,p6:15,p7:5}}},
];

const SL={wizard_complete:'Pre-screening',tech_a_intake:'Tech A intake',under_review:'Gate review',verified:'Score verified',data_room_locked:'Data room locked',portfolio_queue:'Portfolio queue',impact_prospectus:'Impact prospectus',impact_pledge:'Impact pledge',bio_credit_process:'Bio credit process',bond_prospectus:'Bond prospectus',ppm_issued:'PPM / POM issued',bd_due_diligence:'B/D due diligence',pricing_allocation:'Pricing & allocation',bond_close:'Bond close',trust_admin_handoff:'Trust admin handoff',bond_active:'Bond active'};
const SB2={wizard_complete:'bg',tech_a_intake:'bb',under_review:'ba',verified:'bt',data_room_locked:'bt',portfolio_queue:'bt',impact_prospectus:'ba',impact_pledge:'ba',bio_credit_process:'bt',bond_prospectus:'ba',ppm_issued:'ba',bd_due_diligence:'bl',pricing_allocation:'bl',bond_close:'bl',trust_admin_handoff:'bg',bond_active:'bt'};
const TB={dw:'bb',ww:'bp2',sw:'bt',lsl:'ba',pfas:'br',reuse:'bgn'};
const TL={dw:'Drinking water',ww:'Wastewater',sw:'Stormwater / NBS',lsl:'Lead service line',pfas:'PFAS treatment',reuse:'Water reuse'};
const BL2={sacramento:'Sacramento River Basin',san_joaquin:'San Joaquin Basin',colorado:'Colorado River Basin',willamette:'Willamette Basin',puget:'Puget Sound Basin',rio_grande:'Rio Grande Basin'};

let pTab='active',pFilt={ba:'',ty:'',st:'',oc:''},pSort='score';

function login(){
  const raw=document.getElementById('lem').value.trim().toLowerCase();
  const em=raw.replace('@','[at]'),pw=document.getElementById('lpw').value,a=ACCTS[em];
  if(!a||a.pw!==pw){document.getElementById('lerr').style.display='block';return;}
  document.getElementById('lerr').style.display='none';
  CU={email:em,role:a.role,name:a.nm};
  document.getElementById('ls').style.display='none';
  document.getElementById('as').style.display='flex';
  const tn=document.querySelector('.tn');
  if(tn){tn.className='tn role-'+a.role;}
  setLogos();
  const rl={utility:'Utility',admin:'Admin',impact_capital:'Impact Capital'};
  document.getElementById('nctx').textContent=a.nm;
  document.getElementById('nem').textContent=em.replace('[at]','@');
  const rb=document.getElementById('nrb');rb.textContent=rl[a.role];rb.className='rb r-'+a.role;
  rSidebar();rMain('dashboard');
}
function logout(){CU=null;const tn2=document.querySelector('.tn');if(tn2)tn2.className='tn';document.getElementById('as').style.display='none';document.getElementById('wz').style.display='none';document.getElementById('ls').style.display='flex';document.getElementById('lem').value='';document.getElementById('lpw').value='';}


const STAGE_ORDER=['wizard_complete','tech_a_intake','under_review','verified','data_room_locked','portfolio_queue','impact_prospectus','impact_pledge','bio_credit_process','bond_prospectus','ppm_issued','bd_due_diligence','pricing_allocation','bond_close','trust_admin_handoff','bond_active'];
const STAGE_META={
  wizard_complete:    {icon:'📝',label:'Pre-screening',         actor:'Utility',             cls:'inactive'},
  tech_a_intake:      {icon:'📋',label:'Tech A\nIntake',        actor:'Utility',             cls:'inactive'},
  under_review:       {icon:'🔍',label:'Gate\nReview',          actor:'WaterFundable',       cls:'inactive'},
  verified:           {icon:'✅',label:'Score\nVerified',       actor:'WaterFundable',       cls:'inactive'},
  data_room_locked:   {icon:'🔒',label:'Data Room\nLocked',     actor:'WaterFundable',       cls:'inactive'},
  portfolio_queue:    {icon:'📊',label:'Portfolio\nQueue',      actor:'WaterFundable',       cls:'inactive'},
  impact_prospectus:  {icon:'📰',label:'Impact\nProspectus',    actor:'WaterFundable',       cls:'bd'},
  impact_pledge:      {icon:'🤝',label:'Impact\nPledge',        actor:'Impact investors',    cls:'ppm'},
  bio_credit_process: {icon:'🌿',label:'Bio Credit\nProcess',   actor:'Tech B / PURO',       cls:'ppm'},
  bond_prospectus:    {icon:'📑',label:'Bond\nProspectus',      actor:'Bond counsel',        cls:'ppm'},
  ppm_issued:         {icon:'📄',label:'PPM / POM\nIssued',     actor:'Bond counsel',        cls:'ppm'},
  bd_due_diligence:   {icon:'🏦',label:'B/D\nDiligence',        actor:'Broker-dealer',       cls:'bd'},
  pricing_allocation: {icon:'💰',label:'Pricing &\nAlloc.',     actor:'Broker-dealer',       cls:'price'},
  bond_close:         {icon:'🔐',label:'Bond\nClose',           actor:'Trustee',             cls:'price'},
  trust_admin_handoff:{icon:'🏛️',label:'Trust\nAdmin',         actor:'Trust administrator', cls:'inactive'},
  bond_active:        {icon:'🌊',label:'Bond\nActive',          actor:'Trustee / Tech B',    cls:'inactive'},
};
const SBD={
  utility:[
    {s:'My Application'},{id:'dashboard',l:'My Application',d:'b'},
    {id:'utilitystatus',l:'Portfolio Status',d:'p'},
    {id:'utilityinvite',l:'Portfolio Invitation',d:'t'},
    {id:'dataroom-1',l:'My Data Room',d:'b'},
    {s:'Account'},{id:'utilityteam',l:'Team & Profile',d:'g'},
  ],
  admin:[
    {s:'Pipeline'},{id:'dashboard',l:'All Applications',d:'t',cnt:true},
    {id:'portfolio',l:'Portfolio Assembly',d:'p'},
    {id:'dealflow',l:'Deal Flow',d:'t'},
    {id:'basins',l:'Basin Map',d:'b'},
    {s:'Impact'},{id:'biodiversity',l:'Biodiversity',d:'g'},
    {id:'attribution',l:'Impact Attribution',d:'p'},
    {s:'Reports'},{id:'reports',l:'CDP / Blue Bond Reports',d:'b'},
    {s:'Admin'},{id:'settings',l:'Admin Settings',d:'g'},
  ],
  impact_capital:[
    {s:'Portfolio 1'},{id:'dashboard',l:'Impact Portal',d:'t'},
    {id:'impactpledge',l:'My Pledge — P1',d:'p'},
    {id:'impactattribution',l:'My Attribution',d:'g'},
    {s:'Portfolio 2'},{id:'impact2',l:'P2 Prospectus',d:'b'},
    {s:'Account'},{id:'impactprofile',l:'Company & Team',d:'g'},
  ],
};


function rSidebar(ac='dashboard'){
  const items=SBD[CU.role],cnt=FP.filter(p=>p.oc!=='decline').length+wSubs.length;
  let h='';
  items.forEach(it=>{
    if(it.s){h+=`<div class="slb">${it.s}</div>`;return;}
    const a=it.id===ac?' ac':'',b=it.cnt?`<span class="cb">${cnt}</span>`:'';
    h+=`<div class="ni${a}" onclick="rMain('${it.id}')"><span class="nd ${it.d}"></span>${it.l}${b}</div>`;
  });
  document.getElementById('sidebar').innerHTML=h;
}

function rMain(pg){
  rSidebar(pg);
  if(pg==='wizard'){openWiz();return;}
  if(pg==='dashboard'){
    if(CU.role==='utility')rUtil();
    else if(CU.role==='admin')rPipe();
    else rCWS();
    return;
  }
  if(pg==='utilitystatus')    return rUtilityStatus();
  if(pg==='utilityinvite')    return rUtilityInvite();
  if(pg==='utilityteam')      return rUtilityTeam();
  if(pg==='impactpledge')     return rImpactPledge();
  if(pg==='impactattribution')return rImpactAttribution();
  if(pg==='impactprofile')    return rImpactProfile();
  if(pg==='impact2')          return rImpact2();
  if(pg==='portfolio')        return rPortfolio();
  if(pg==='dealflow')         return rDealFlow();
  if(pg==='basins')           return rBasinMap();
  if(pg==='biodiversity')     return rBiodiversity();
  if(pg==='attribution')      return rAttribution();
  if(pg==='reports')          return rReports();
  if(pg==='impactportfolio')  return rImpactDashboard();
  if(typeof pg==='string'&&pg.startsWith('project-'))return rProjectDetail(parseInt(pg.split('-')[1]));
  if(typeof pg==='string'&&pg.startsWith('dataroom-'))return rDataRoom(parseInt(pg.split('-')[1]));
  if(typeof pg==='string'&&pg.startsWith('taplan-'))  return rTAPlan(parseInt(pg.split('-')[1]));
  rPH(pg);
}

// ── UTILITY ORG/TEAM STATE ───────────────────────────────────────────────

// ── PER-PROJECT CONTRACTING STATE (admin-managed) ────────────────────────
if(typeof window.contractState==='undefined') window.contractState={
  // keyed by project id — stages: none, invited, mou_pending, mou_signed, contracting, executed
  1:{status:'mou_signed',  inviteDate:'Apr 15, 2026',mouDate:'Apr 22, 2026',signedBy:'J. Martinez',notes:'MOU acknowledged via portal. Bond counsel engaged.'},
  2:{status:'invited',     inviteDate:'Apr 18, 2026',mouDate:null,signedBy:null,notes:'Invitation sent. Awaiting utility response.'},
  3:{status:'contracting', inviteDate:'Apr 10, 2026',mouDate:'Apr 17, 2026',signedBy:'B. Torres',notes:'Participation Agreement in review with utility legal.'},
  4:{status:'none',        inviteDate:null,mouDate:null,signedBy:null,notes:''},
  5:{status:'none',        inviteDate:null,mouDate:null,signedBy:null,notes:''},
  6:{status:'none',        inviteDate:null,mouDate:null,signedBy:null,notes:''},
  13:{status:'none',       inviteDate:null,mouDate:null,signedBy:null,notes:''},
  14:{status:'none',       inviteDate:null,mouDate:null,signedBy:null,notes:''},
  15:{status:'none',       inviteDate:null,mouDate:null,signedBy:null,notes:''},
};

const CS_LABEL={none:'No offer yet',invited:'Offer sent',mou_pending:'MOU pending',mou_signed:'MOU signed',contracting:'Contracting',executed:'Executed'};
const CS_CLS={none:'bg',invited:'ba',mou_pending:'ba',mou_signed:'bt',contracting:'bl',executed:'bt'};

function getCS(id){return window.contractState[id]||{status:'none',inviteDate:null,mouDate:null,signedBy:null,notes:''};}
function setCS(id,update){
  if(!window.contractState[id]) window.contractState[id]={status:'none',inviteDate:null,mouDate:null,signedBy:null,notes:''};
  Object.assign(window.contractState[id],update);
}

if(typeof window.orgProfile==='undefined') window.orgProfile={
  name:'Colusa County Water District',
  type:'Municipal water utility',
  state:'California',
  ein:'94-XXXXXXX',
  sfr:'8613-110',
  contact:'jmartinez@colusa.gov',
  phone:'(530) 458-XXXX',
  team:[
    {id:1,name:'J. Martinez',role:'Project manager',email:'jmartinez@colusa.gov',status:'active'},
    {id:2,name:'A. Singh',role:'Finance director',email:'asingh@colusa.gov',status:'active'},
    {id:3,name:'T. Nguyen',role:'Engineering lead',email:'tnguyen@colusa.gov',status:'active'},
  ]
};
if(typeof nextTeamId==='undefined') var nextTeamId=4;

function rUtil(){
  const subs=wSubs;
  const hasApp=subs.length>0;
  const myProjects=FP.filter(p=>p.org===orgProfile.name||p.id===1); // demo: show Colusa
  const currentStep=hasApp?Math.max(projStageIdx+1,1):1;

  // 16-stage process (same as admin deal flow)
  // Drive tracker from actual project stage in STAGE_ORDER
  const myProj=FP.find(p=>p.id===1)||FP.find(p=>p.portfolio===1&&p.oc==='eligible');
  const projStageIdx=myProj?STAGE_ORDER.indexOf(myProj.st):-1;
  const stageLabels=['Pre-screening','Tech A Intake','Gate Review','BPBM Score','Data Room Lock','Portfolio Queue','Impact Prospectus','Impact Pledge','Bio Credits','Bond Prospectus','PPM / POM','B/D Diligence','Pricing','Bond Close','Trust Admin','Bond Active'];
  const steps=stageLabels.map((label,i)=>({n:i+1,label,done:hasApp&&i<Math.max(projStageIdx,0)}));

  let stepHTML='';
  steps.forEach((s,i)=>{
    const active=s.n===currentStep;
    const done=s.done&&s.n<currentStep;
    const cc=done?'var(--t)':active?'var(--td)':'var(--bo)';
    const tc=done?'var(--t)':active?'var(--tx)':'var(--fa)';
    stepHTML+=`<div style="display:flex;flex-direction:column;align-items:center;min-width:56px">`;
    stepHTML+=`<div style="display:flex;align-items:center;width:100%">`;
    stepHTML+=i>0?`<div style="flex:1;height:2px;background:${done?'var(--t)':'var(--bo)'};margin-top:-13px"></div>`:`<div style="flex:1"></div>`;
    stepHTML+=`<div style="width:24px;height:24px;border-radius:50%;background:${cc};border:2px solid ${cc};display:flex;align-items:center;justify-content:center;flex-shrink:0;${active?'box-shadow:0 0 0 3px var(--tl)':''}">`;
    stepHTML+=`<span style="font-size:8px;font-weight:700;color:${(done||active)?'#fff':'var(--fa)'}">${done?'✓':s.n}</span></div>`;
    stepHTML+=i<steps.length-1?`<div style="flex:1;height:2px;background:var(--bo);margin-top:-13px"></div>`:`<div style="flex:1"></div>`;
    stepHTML+=`</div>`;
    stepHTML+=`<div style="font-size:7.5px;font-weight:${active?700:500};color:${tc};text-align:center;margin-top:4px;line-height:1.2;max-width:52px">${s.label}</div>`;
    stepHTML+=`</div>`;
  });

  document.getElementById('main').innerHTML=`
<div class="pt">My Application Portal</div>
<div class="ps">${orgProfile.name} · ${hasApp?'Application in progress':'Pre-screening stage'}</div>

<!-- Process tracker -->
<div style="background:var(--wh);border:1px solid var(--bo);border-radius:11px;padding:14px 18px;margin-bottom:18px">
  <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Process — step ${currentStep} of ${steps.length}</div>
  <div style="display:flex;align-items:flex-start;overflow-x:auto;padding-bottom:6px">${stepHTML}</div>
  <div style="margin-top:10px;padding:8px 12px;background:var(--tl);border-radius:7px;font-size:12px;color:var(--td)">
    <strong>You are here:</strong> Step ${currentStep} — ${steps[currentStep-1].label}
    · <span style="cursor:pointer;text-decoration:underline" onclick="rMain('utilityteam')">Manage team →</span>
  </div>
</div>

<!-- My projects status -->
${myProjects.length?`
<div class="s5-section" style="margin-top:0">My projects</div>
${myProjects.map(p=>{
  const stageIdx=STAGE_ORDER.indexOf(p.st);
  const totalStages=STAGE_ORDER.length;
  const pct=Math.round(stageIdx/totalStages*100);
  const impactPledgeActive=p.st==='impact_pledge'||p.st==='impact_prospectus';
  const bondActive=p.st==='bond_active';
  return `<div class="card" style="margin-bottom:14px">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
      <div>
        <div style="font-size:15px;font-weight:700">${p.org}</div>
        <div style="font-size:12px;color:var(--mu);margin-top:2px">${p.ty} · ${p.ba} Basin · BPBM ${p.sc}/1000</div>
      </div>
      <span class="badge ${p.oc==='eligible'?'bt':p.oc==='ta'?'ba':'br'}">${p.oc==='eligible'?'Eligible':p.oc==='ta'?'TA referral':'Not eligible'}</span>
    </div>
    <!-- Stage progress bar -->
    <div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--mu);margin-bottom:4px">
        <span>Current stage: <strong style="color:var(--tx)">${SL[p.st]||p.st}</strong></span>
        <span>${pct}% through process</span>
      </div>
      <div style="height:7px;background:var(--bo);border-radius:4px;overflow:hidden">
        <div style="height:7px;width:${pct}%;background:var(--t);border-radius:4px;transition:width .4s"></div>
      </div>
    </div>
    <!-- Status flags -->
    ${impactPledgeActive?`<div class="ib it" style="margin-bottom:8px;font-size:12px">🤝 Impact investors are reviewing your project. The Impact Prospectus has been issued. Pledge commitments are being collected.</div>`:''}
    ${bondActive?`<div class="ib it" style="margin-bottom:8px;font-size:12px">🌊 Bond is active. Tech B MRV is running. Your project receives capital per the drawdown schedule.</div>`:''}
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="hb" onclick="openTS(${p.id})">Tear sheet</button>
      <button class="hb" onclick="rMain('dataroom-${p.id}')">📁 Data room</button>
      <button class="hb" onclick="rMain('utilitystatus')">Portfolio status</button>
      ${(p.st==='verified'||p.st==='portfolio_queue')&&!window.portInviteState.mouSigned?`<button class="hb" style="background:var(--aml);color:var(--am);border-color:var(--am);font-weight:700;animation:pulse 2s infinite" onclick="rMain('utilityinvite')">⚡ Portfolio invitation</button>`:''}
      ${window.portInviteState&&window.portInviteState.mouSigned?`<button class="hb" style="background:var(--tl);color:var(--td);border-color:var(--tm)" onclick="rMain('utilityinvite')">✓ MOU acknowledged</button>`:''}
      ${p.oc==='ta'?`<button class="hb" style="background:var(--aml);color:var(--am);border-color:var(--am)" onclick="rMain('taplan-${p.id}')">TA gap report</button>`:''}
    </div>
  </div>`;
}).join('')}`:`
<!-- Empty state -->
<div class="s5-section" style="margin-top:0">How to apply — three steps</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:18px">
  <div class="bio-card" style="margin:0">
    <div style="font-size:26px;margin-bottom:8px">📝</div>
    <div style="font-size:10px;font-weight:700;color:var(--t);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Step 1 — Free · 8 min</div>
    <div style="font-size:14px;font-weight:700;margin-bottom:6px">Pre-screening wizard</div>
    <div style="font-size:12px;color:var(--mu);line-height:1.6;margin-bottom:12px">Basin, project type, size ($1M–$100M), financial snapshot, digital readiness. Instant BPBM pre-screen score out of 1,000.</div>
    <button class="bcta" style="font-size:12px;padding:8px 16px" onclick="openWiz()">Start now</button>
  </div>
  <div class="bio-card" style="margin:0">
    <div style="font-size:26px;margin-bottom:8px">📁</div>
    <div style="font-size:10px;font-weight:700;color:var(--bl);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Step 2 — Tech A portal</div>
    <div style="font-size:14px;font-weight:700;margin-bottom:6px">Full application + data room</div>
    <div style="font-size:12px;color:var(--mu);line-height:1.6">Upload audited financials (3yr), engineering report, SRF IUP listing, rate study, debt schedule. Tier-1 encrypted. BPBM 7-pillar taxonomy.</div>
  </div>
  <div class="bio-card" style="margin:0">
    <div style="font-size:26px;margin-bottom:8px">🏅</div>
    <div style="font-size:10px;font-weight:700;color:var(--pu);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Step 3 — 45 days</div>
    <div style="font-size:14px;font-weight:700;margin-bottom:6px">BPBM score report</div>
    <div style="font-size:12px;color:var(--mu);line-height:1.6">7-pillar review. Rating equivalent + gap analysis. Full deal flow activation upon score verification.</div>
  </div>
</div>
<div class="ib it">
  <strong>What WaterFundable looks for:</strong> WRC priority basin · $1M–$100M · 3 years audited financials · Engineering report · SRF IUP placement preferred · BPBM 700+/1,000. Projects 500–699 qualify with an external guarantor.
</div>`}`;
}

function rUtilityStatus(){
  // Show invitation when project is at 'verified' (offer extended) or 'portfolio_queue' (pending MOU)
  const myP=FP.find(p=>p.id===1)||FP.find(p=>p.portfolio===1&&p.oc==='eligible'&&(p.st==='verified'||p.st==='portfolio_queue'))||FP.find(p=>p.portfolio===1&&p.oc==='eligible');
  if(!myP){document.getElementById('main').innerHTML='<div class="pt">Portfolio Status</div><div class="ib ia">No projects in portfolio assembly yet.</div>';return;}
  const stageIdx=STAGE_ORDER.indexOf(myP.st);
  const pct=Math.round(stageIdx/STAGE_ORDER.length*100);

  document.getElementById('main').innerHTML=`
<div style="cursor:pointer;color:var(--t);font-size:13px;margin-bottom:4px" onclick="rUtil()">← Back</div>
${window.portInviteState&&window.portInviteState.mouSigned?`<div class="ib" style="background:var(--tl);border-left:3px solid var(--t);margin-bottom:12px;font-size:12px"><strong>✓ Portfolio invitation acknowledged.</strong> Contracting phase initiated. <span style="cursor:pointer;text-decoration:underline;color:var(--t)" onclick="rMain('utilityinvite')">View MOU →</span></div>`:''}
${window.portInviteState&&!window.portInviteState.mouSigned&&(window.orgProfile&&window.orgProfile.team||true)?`<div class="ib ia" style="margin-bottom:12px;font-size:12px"><strong>⚡ Portfolio invitation waiting for your response.</strong> <span style="cursor:pointer;text-decoration:underline;color:var(--t)" onclick="rMain('utilityinvite')">Review and acknowledge →</span></div>`:''}
<div class="pt">Portfolio & Bond Status</div>
<div class="ps">${myP.org} · Portfolio 1 · Sacramento River Basin</div>

${myP.st==='verified'?`<div class="ib" style="background:#FFF8EC;border-left:4px solid var(--am);margin-bottom:14px">
  <strong>⚡ Portfolio offer extended.</strong> Your BPBM score has been verified. WaterFundable has selected your project for Portfolio 1. <span style="cursor:pointer;text-decoration:underline;color:var(--t)" onclick="rMain('utilityinvite')">Review offer and acknowledge MOU →</span>
</div>`:''}
${myP.st==='portfolio_queue'&&!window.portInviteState.mouSigned?`<div class="ib ia" style="margin-bottom:14px">
  <strong>Awaiting your MOU acknowledgment.</strong> Your project is ready for portfolio queue entry. <span style="cursor:pointer;text-decoration:underline;color:var(--t)" onclick="rMain('utilityinvite')">Complete portfolio invitation →</span>
</div>`:''}
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">
  <div class="met"><div class="ml">BPBM Score</div><div class="mv" style="color:var(--t)">${myP.sc}/1000</div><div class="ms">${myP.ts&&myP.ts.score_equiv?myP.ts.score_equiv.split(' (')[0]:'BBB+'}</div></div>
  <div class="met"><div class="ml">Current stage</div><div class="mv" style="font-size:13px">${SL[myP.st]||myP.st}</div><div class="ms">Step ${stageIdx+1} of ${STAGE_ORDER.length}</div></div>
  <div class="met"><div class="ml">Process progress</div><div class="mv">${pct}%</div><div class="ms">Through deal flow</div></div>
  <div class="met"><div class="ml">Data room</div><div class="mv" style="font-size:13px">📁</div><div class="ms"><span style="cursor:pointer;color:var(--t)" onclick="rMain('dataroom-1')">Open data room →</span></div></div>
</div>

<div class="s5-section">Deal flow — where your project sits</div>
<div style="background:var(--wh);border:1px solid var(--bo);border-radius:10px;padding:16px;margin-bottom:18px;overflow-x:auto">
  <div style="display:flex;align-items:flex-start;min-width:800px">
  ${STAGE_ORDER.map((stage,i)=>{
    const isDone=i<stageIdx;
    const isActive=i===stageIdx;
    const meta=STAGE_META[stage];
    const cc=isDone?'var(--t)':isActive?'var(--td)':'var(--bo)';
    const tc=isDone?'var(--t)':isActive?'var(--tx)':'var(--fa)';
    return `<div style="display:flex;flex-direction:column;align-items:center;min-width:56px">
      <div style="display:flex;align-items:center;width:100%">
        ${i>0?`<div style="flex:1;height:2px;background:${isDone?'var(--t)':'var(--bo)'};margin-top:-13px"></div>`:`<div style="flex:1"></div>`}
        <div style="width:24px;height:24px;border-radius:50%;background:${cc};border:2px solid ${cc};display:flex;align-items:center;justify-content:center;flex-shrink:0;${isActive?'box-shadow:0 0 0 3px var(--tl)':''}">
          <span style="font-size:8px;font-weight:700;color:${isDone||isActive?'#fff':'var(--fa)'}">${isDone?'✓':meta?meta.icon||i+1:i+1}</span>
        </div>
        ${i<STAGE_ORDER.length-1?`<div style="flex:1;height:2px;background:var(--bo);margin-top:-13px"></div>`:`<div style="flex:1"></div>`}
      </div>
      <div style="font-size:7px;font-weight:${isActive?700:400};color:${tc};text-align:center;margin-top:4px;line-height:1.2;max-width:52px">${meta?meta.label.replace('\\n',' '):SL[stage]||stage}</div>
    </div>`;
  }).join('')}
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
  <div>
    <div class="s5-section" style="margin-top:0">Impact Capital activity</div>
    <div class="card" style="margin:0;padding:14px">
      ${myP.st==='portfolio_queue'||myP.st==='impact_prospectus'||myP.st==='impact_pledge'?`
      <div class="ib it" style="margin-bottom:10px;font-size:12px"><strong>Impact Prospectus issued.</strong> Impact investors are reviewing Portfolio 1 projects and making pledge commitments. You will be notified when pledges are confirmed and the bond structure is finalized.</div>
      <div style="font-size:12px;color:var(--mu)">Impact commitments collected so far: <strong>$4.0M</strong> of $30M target</div>
      `:`<div style="font-size:12px;color:var(--mu)">Impact Capital outreach begins after data room lock and portfolio assembly. No action required from you at this stage.</div>`}
    </div>
  </div>
  <div>
    <div class="s5-section" style="margin-top:0">Bond status</div>
    <div class="card" style="margin:0;padding:14px">
      ${myP.st==='bond_active'?`
      <div class="ib it" style="margin-bottom:10px;font-size:12px"><strong>Bond is active.</strong> Capital deployed. Tech B MRV running. Drawdown schedule active.</div>
      <div style="font-size:12px;color:var(--mu)">Allocated: <strong>${myP.ts&&myP.ts.co||'$33.3M'}</strong> · Rate: <strong>3-4%</strong> (blended)</div>
      `:`<div style="font-size:12px;color:var(--mu)">Bond closes after B/D diligence, pricing, and allocation. Your utility receives capital per your drawdown schedule upon bond close.</div>`}
    </div>
  </div>
</div>`;
}

function rUtilityTeam(){
  const team=orgProfile.team;
  document.getElementById('main').innerHTML=`
<div style="cursor:pointer;color:var(--t);font-size:13px;margin-bottom:4px" onclick="rUtil()">← Back</div>
${window.portInviteState&&window.portInviteState.mouSigned?`<div class="ib" style="background:var(--tl);border-left:3px solid var(--t);margin-bottom:12px;font-size:12px"><strong>✓ Portfolio invitation acknowledged.</strong> Contracting phase initiated. <span style="cursor:pointer;text-decoration:underline;color:var(--t)" onclick="rMain('utilityinvite')">View MOU →</span></div>`:''}
${window.portInviteState&&!window.portInviteState.mouSigned&&(window.orgProfile&&window.orgProfile.team||true)?`<div class="ib ia" style="margin-bottom:12px;font-size:12px"><strong>⚡ Portfolio invitation waiting for your response.</strong> <span style="cursor:pointer;text-decoration:underline;color:var(--t)" onclick="rMain('utilityinvite')">Review and acknowledge →</span></div>`:''}
<div class="pt">Organization Profile &amp; Team</div>
<div class="ps">${orgProfile.name}</div>

<!-- Org profile -->
<div class="s5-section" style="margin-top:0">Organization profile</div>
<div class="card" style="margin-bottom:18px;padding:16px">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    ${[['Organization name',orgProfile.name,'orgName'],['Entity type',orgProfile.type,'orgType'],['State',orgProfile.state,'orgState'],['EIN',orgProfile.ein,'orgEIN'],['SRF project #',orgProfile.sfr,'orgSFR'],['Primary contact email',orgProfile.contact,'orgContact']].map(([l,v,fid])=>`
    <div>
      <div style="font-size:11px;font-weight:700;color:var(--fa);text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px">${l}</div>
      <input type="text" id="${fid}" value="${v}" style="width:100%;padding:6px 10px;border:1px solid var(--bo);border-radius:6px;font-size:13px;color:var(--tx);background:var(--wh)"
        onchange="orgProfile.${fid.replace('org','').toLowerCase()}=this.value"/>
    </div>`).join('')}
  </div>
  <button class="hb" style="margin-top:12px" onclick="alert('Organization profile saved.')">Save profile</button>
</div>

<!-- Team -->
<div class="s5-section">Team members</div>
<div style="margin-bottom:14px">
${team.map(m=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--bo);border-radius:8px;margin-bottom:8px;background:var(--wh)">
  <div style="width:36px;height:36px;border-radius:50%;background:var(--tl);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:var(--td);flex-shrink:0">${m.name.charAt(0)}</div>
  <div style="flex:1">
    <div style="font-size:13px;font-weight:600">${m.name}</div>
    <div style="font-size:11px;color:var(--mu)">${m.role} · ${m.email}</div>
  </div>
  <span class="badge ${m.status==='active'?'bt':'ba'}">${m.status}</span>
  <div style="display:flex;gap:6px">
    <button class="hb" onclick="editTeamMember(${m.id})">Edit</button>
    <button class="hb" style="color:var(--re);border-color:var(--re)" onclick="removeTeamMember(${m.id})">Remove</button>
  </div>
</div>`).join('')}
</div>

<!-- Add member form -->
<div class="card" style="padding:14px 16px">
  <div style="font-size:12px;font-weight:700;color:var(--mu);margin-bottom:10px">Add team member</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:10px;align-items:end">
    <div><div style="font-size:11px;color:var(--fa);margin-bottom:3px">Full name</div><input type="text" id="newMemberName" placeholder="Jane Smith" style="width:100%;padding:6px 10px;border:1px solid var(--bo);border-radius:6px;font-size:13px;color:var(--tx);background:var(--wh)"/></div>
    <div><div style="font-size:11px;color:var(--fa);margin-bottom:3px">Role</div><input type="text" id="newMemberRole" placeholder="Engineering lead" style="width:100%;padding:6px 10px;border:1px solid var(--bo);border-radius:6px;font-size:13px;color:var(--tx);background:var(--wh)"/></div>
    <div><div style="font-size:11px;color:var(--fa);margin-bottom:3px">Email</div><input type="email" id="newMemberEmail" placeholder="jane@district.gov" style="width:100%;padding:6px 10px;border:1px solid var(--bo);border-radius:6px;font-size:13px;color:var(--tx);background:var(--wh)"/></div>
    <button class="hb" style="background:var(--tl);color:var(--td);border-color:var(--tm);padding:6px 14px" onclick="addTeamMember()">Add</button>
  </div>
</div>`;
}

function addTeamMember(){
  const n=document.getElementById('newMemberName')?.value?.trim();
  const r=document.getElementById('newMemberRole')?.value?.trim();
  const e=document.getElementById('newMemberEmail')?.value?.trim();
  if(!n||!r||!e){alert('Please fill in all fields.');return;}
  orgProfile.team.push({id:nextTeamId++,name:n,role:r,email:e,status:'active'});
  rUtilityTeam();
}
function removeTeamMember(id){
  if(!confirm('Remove this team member?'))return;
  orgProfile.team=orgProfile.team.filter(m=>m.id!==id);
  rUtilityTeam();
}
function editTeamMember(id){
  const m=orgProfile.team.find(x=>x.id===id);
  if(!m)return;
  const n=prompt('Name:',m.name);if(n===null)return;
  const r=prompt('Role:',m.role);if(r===null)return;
  const e=prompt('Email:',m.email);if(e===null)return;
  m.name=n;m.role=r;m.email=e;
  rUtilityTeam();
}



function allP(){
  return [...FP,...wSubs.map((p,i)=>({id:100+i,org:p.org||p.org_name||'Submitted utility',ba:BL2[p.basin_id]||p.basin_id||'Unknown',bt:p.basin_tier||'mvp',ty:TL[p.project_type]||'—',ti:p.project_type||'dw',sc:p.score,st:'wizard_complete',oc:p.outcome,dt:'Just now',fl:{ta:p.outcome==='ta',no:p.operator_status==='no'},adv:'',ts:{}}))];
}

function rPipe(){
  let all=allP();
  const el=all.filter(p=>p.oc==='eligible').length;
  const ta=all.filter(p=>p.oc==='ta').length;
  const dc=all.filter(p=>p.oc==='decline').length;
  const p1=all.filter(p=>p.portfolio===1);
  const p1el=p1.filter(p=>p.oc==='eligible').length;
  // Stage breakdown
  const stageGroups={};
  all.forEach(p=>{stageGroups[p.st]=(stageGroups[p.st]||0)+1;});
  // Type breakdown
  const typeCount={dw:0,ww:0,sw:0,lsl:0,pfas:0,reuse:0};
  all.forEach(p=>{if(typeCount[p.ti]!==undefined)typeCount[p.ti]++;});
  // Score distribution
  const scoreB={anchor:0,core:0,qual:0,cond:0,ta_band:0,ne:0};
  all.forEach(p=>{
    if(p.sc>=900)scoreB.anchor++;
    else if(p.sc>=800)scoreB.core++;
    else if(p.sc>=700)scoreB.qual++;
    else if(p.sc>=600)scoreB.cond++;
    else if(p.sc>=500)scoreB.ta_band++;
    else scoreB.ne++;
  });

  let d=pTab==='reserve'?all.filter(p=>p.oc==='ta'||p.bt==='reserve'):all;
  if(pFilt.ba)d=d.filter(p=>p.ba.toLowerCase().includes(pFilt.ba.toLowerCase()));
  if(pFilt.ty)d=d.filter(p=>p.ti===pFilt.ty);
  if(pFilt.st)d=d.filter(p=>p.st===pFilt.st);
  if(pFilt.oc)d=d.filter(p=>p.oc===pFilt.oc);
  if(pSort==='score')d.sort((a,b)=>b.sc-a.sc);
  if(pSort==='date')d.sort((a,b)=>b.id-a.id);
  if(pSort==='name')d.sort((a,b)=>a.org.localeCompare(b.org));
  const isR=pTab==='reserve';
  const so=Object.entries(SL).map(([v,l])=>`<option value="${v}">${l}</option>`).join('');

  document.getElementById('main').innerHTML=`
<div class="pt">All Applications</div>
<div class="ps">Pipeline dashboard · Portfolio 1 (Sacramento) active · Single-basin portfolio rule</div>

<!-- Top metrics row -->
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px">
  <div class="met"><div class="ml">Total applications</div><div class="mv">${all.length}</div></div>
  <div class="met"><div class="ml">Eligible (700+/1000)</div><div class="mv" style="color:var(--t)">${el}</div><div class="ms">BBB+ or better</div></div>
  <div class="met"><div class="ml">TA referrals</div><div class="mv" style="color:var(--am)">${ta}</div><div class="ms">600-699 pts</div></div>
  <div class="met"><div class="ml">Portfolio 1 projects</div><div class="mv" style="color:var(--bl)">${p1el}</div><div class="ms">Sacramento Basin</div></div>
  <div class="met"><div class="ml">Not eligible</div><div class="mv" style="color:var(--re)">${dc}</div></div>
  <div class="met"><div class="ml">Needs guarantor</div><div class="mv" style="color:#F0A500">${all.filter(p=>p.sc>=500&&p.sc<700).length}</div><div class="ms">500-699 pts</div></div>
</div>

<!-- Portfolio status + project type profile side by side -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">

  <!-- Stage pipeline status -->
  <div class="card" style="margin:0;padding:14px 16px">
    <div style="font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:12px">Applications in motion — by stage</div>
    ${Object.entries(SL).map(([stage,label])=>{
      const count=stageGroups[stage]||0;
      if(!count)return '';
      const pct=Math.round(count/all.length*100);
      const barColor=stage==='bond_active'?'var(--gn)':stage.includes('ppm')||stage.includes('bd')||stage.includes('pricing')?'var(--bl)':stage==='portfolio_queue'?'var(--pu)':stage==='data_room_locked'?'var(--td)':stage==='verified'?'var(--t)':'var(--am)';
      return `<div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
          <span style="color:var(--tx);font-weight:500">${label}</span>
          <span style="color:var(--mu)">${count} project${count>1?'s':''}</span>
        </div>
        <div style="height:7px;background:var(--bo);border-radius:4px;overflow:hidden">
          <div style="height:7px;width:${Math.max(pct,5)}%;background:${barColor};border-radius:4px"></div>
        </div>
      </div>`;
    }).join('')}
  </div>

  <!-- Project type profile -->
  <div class="card" style="margin:0;padding:14px 16px">
    <div style="font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:12px">Project type profile · BPBM score bands</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      ${Object.entries(typeCount).filter(([k,v])=>v>0).map(([type,count])=>`
        <div style="background:var(--grl);border-radius:7px;padding:8px 10px">
          <div style="font-size:11px;color:var(--mu)">${TL[type]||type}</div>
          <div style="font-size:18px;font-weight:700;color:var(--tx)">${count}</div>
        </div>`).join('')}
    </div>
    <div style="border-top:1px solid var(--bo);padding-top:10px">
      <div style="font-size:11px;font-weight:600;color:var(--mu);margin-bottom:6px">Score distribution (BPBM /1000)</div>
      ${[
        {label:'900-1000 (AAA/AA)',count:scoreB.anchor,color:'var(--gn)'},
        {label:'800-899 (A)',count:scoreB.core,color:'var(--t)'},
        {label:'700-799 (BBB+)',count:scoreB.qual,color:'var(--bl)'},
        {label:'600-699 (BBB cond.)',count:scoreB.cond,color:'var(--am)'},
        {label:'500-699 (needs guarantor)',count:scoreB.ta_band+scoreB.cond,color:'#F0A500'},
        {label:'<500 (Not eligible)',count:scoreB.ne,color:'var(--fa)'},
      ].filter(b=>b.count>0).map(b=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <div style="width:8px;height:8px;border-radius:50%;background:${b.color};flex-shrink:0"></div>
        <div style="font-size:11px;color:var(--mu);flex:1">${b.label}</div>
        <div style="font-size:12px;font-weight:700;color:var(--tx)">${b.count}</div>
      </div>`).join('')}
    </div>
  </div>
</div>

<!-- Pipeline tabs + filters -->
<div class="ptabs">
  <div class="ptab ${pTab==='active'?'ac':''}" onclick="sTab('active')">Active pipeline (${all.filter(p=>p.oc!=='decline').length})</div>
  <div class="ptab ${pTab==='reserve'?'ac':''}" onclick="sTab('reserve')">Reserve / TA pool (${all.filter(p=>p.oc==='ta'||p.bt==='reserve').length})</div>
</div>
<div class="fbar">
  <select class="fsel" onchange="sF('ba',this.value)"><option value="">All basins</option><option value="Sacramento">Sacramento</option><option value="San Joaquin">San Joaquin</option><option value="Colorado">Colorado</option><option value="Willamette">Willamette</option></select>
  <select class="fsel" onchange="sF('ty',this.value)"><option value="">All types</option><option value="dw">Drinking water</option><option value="ww">Wastewater</option><option value="sw">Stormwater</option><option value="lsl">Lead service line</option><option value="pfas">PFAS</option><option value="reuse">Reuse</option></select>
  <select class="fsel" onchange="sF('st',this.value)"><option value="">All stages</option>${so}</select>
  <select class="fsel" onchange="sF('oc',this.value)"><option value="">All outcomes</option><option value="eligible">Eligible</option><option value="ta">TA referral</option><option value="decline">Not eligible</option></select>
  <div class="fbr"><span class="slbl">Sort:</span>
    <select class="fsel" onchange="pSort=this.value;rPipe()"><option value="score">BPBM Score</option><option value="date">Date</option><option value="name">Name</option></select>
  </div>
</div>
${d.length===0?'<div class="nr">No projects match the current filters.</div>':`
<div class="tw"><table><thead><tr>
  <th>Organization</th><th>Basin</th><th>Type</th><th>BPBM Score</th><th>Stage</th><th>Outcome</th><th>Advisor</th>${isR?'<th>Re-eval</th>':''}
  <th>Date</th><th></th>
</tr></thead><tbody>
${d.map(p=>`<tr>
  <td><div style="font-weight:600">${p.org}${needsGuarantor(p)?guarantorBadge(p):''}</div><div style="display:flex;gap:3px;margin-top:2px">
  <td><span class="badge ${p.bt==='reserve'?'ba':'bt'}">${p.ba}</span></td>
  <td><span class="badge ${TB[p.ti]||'bg'}">${p.ty}</span></td>
  <td>
    <span class="s${p.oc}" style="font-size:14px">${p.sc}<span style="font-size:11px;font-weight:400;color:var(--fa)">/1000</span></span>
    <div style="font-size:10px;color:var(--fa);margin-top:1px">${p.ts&&p.ts.score_equiv?p.ts.score_equiv.split(' (')[0]:'—'}</div>
  </td>
  <td><select class="ssel" onchange="advSt(${p.id},this.value,'${p.st}')">
    ${Object.entries(SL).map(([v,l])=>`<option value="${v}"${v===p.st?' selected':''}>${l}</option>`).join('')}
  </select></td>
  <td>
    <span class="badge ${p.oc==='eligible'?'bt':p.oc==='ta'?'ba':'br'}">${p.oc==='eligible'?'Eligible':p.oc==='ta'?'TA referral':'Not eligible'}</span>
    ${p.oc==='eligible'&&STAGE_ORDER.indexOf(p.st)>=STAGE_ORDER.indexOf('verified')?`<div style="margin-top:3px"><span class="badge ${CS_CLS[getCS(p.id).status]||'bg'}" style="font-size:10px">${CS_LABEL[getCS(p.id).status]||'—'}</span></div>`:''}
  </td>
  <td><span class="ac2" id="al${p.id}" onclick="eAdv(${p.id})">${p.adv||'<span style="color:var(--fa)">Assign</span>'}</span>
    <input class="ai2" id="ai${p.id}" style="display:none" value="${p.adv||''}" onblur="sAdv(${p.id})" onkeydown="if(event.key==='Enter')sAdv(${p.id})"/>
  </td>
  ${isR?`<td><input class="reeval-inp" type="date" value="${p.reeval||''}" onchange="sRe(${p.id},this.value)"/></td>`:''}
  <td style="color:var(--mu);font-size:12px;white-space:nowrap">${p.dt}</td>
  <td style="display:flex;gap:4px;padding-top:10px;flex-wrap:wrap">
    <button class="hb" onclick="openH(${p.id},'${p.org.replace(/'/g,"\\'")}')">History</button>
    <button class="hb" onclick="openTS(${p.id})">Tear sheet</button>
    <button class="hb" onclick="rMain('dataroom-${p.id}')">📁 Data room</button>
    ${p.oc==='eligible'&&STAGE_ORDER.indexOf(p.st)>=STAGE_ORDER.indexOf('verified')?`<button class="hb" style="background:var(--bll);color:var(--bl);border-color:var(--bl)" onclick="openContractPanel(${p.id})">Contracting</button>`:''}
  </td>
</tr>`).join('')}
</tbody></table></div>`}`;
}


function sTab(t){pTab=t;pFilt={ba:'',ty:'',st:'',oc:''};rPipe();}
function sF(k,v){pFilt[k]=v;rPipe();}
function advSt(id,ns,os){if(ns===os)return;const fp=FP.find(p=>p.id===id);if(fp)fp.st=ns;if(id>=100&&wSubs[id-100])wSubs[id-100].st=ns;if(!pH[id])pH[id]=[];pH[id].unshift({type:'Stage change',detail:`${SL[os]||os} → ${SL[ns]||ns}`,by:CU.name,ts:new Date().toLocaleString()});rPipe();}
function eAdv(id){document.getElementById('al'+id).style.display='none';const i=document.getElementById('ai'+id);i.style.display='inline-block';i.focus();}
function sAdv(id){const i=document.getElementById('ai'+id);if(!i)return;const v=i.value.trim();const fp=FP.find(p=>p.id===id);if(fp)fp.adv=v;if(id>=100&&wSubs[id-100])wSubs[id-100].adv=v;if(v){if(!pH[id])pH[id]=[];pH[id].unshift({type:'Advisor assigned',detail:v,by:CU.name,ts:new Date().toLocaleString()});}rPipe();}
function sRe(id,v){const fp=FP.find(p=>p.id===id);if(fp)fp.reeval=v;}
function openH(id,org){document.getElementById('hpht').textContent=org;const evs=pH[id]||[];document.getElementById('hpbody').innerHTML=evs.length===0?'<div style="padding:18px 0;text-align:center;color:var(--mu);font-size:13px">No events yet.<br><span style="font-size:12px">Stage changes and advisor assignments appear here.</span></div>':evs.map(e=>`<div class="hev"><div class="hevt">${e.type}</div><div class="hevd">${e.detail}</div><div class="hevm">${e.by} · ${e.ts}</div></div>`).join('');document.getElementById('hpanel').classList.add('open');}
function closeH(){document.getElementById('hpanel').classList.remove('open');}


function rPH(p){document.getElementById('main').innerHTML=`<div class="pt">${p.charAt(0).toUpperCase()+p.slice(1)}</div><div class="ps">Coming in a future sprint</div><div class="card"><div style="text-align:center;padding:34px;color:var(--mu)"><div style="font-size:28px;margin-bottom:9px">🚧</div><div style="font-size:14px;font-weight:600;margin-bottom:4px">Coming soon</div><div style="font-size:13px">This section will be built in a future sprint.</div></div></div>`;}

// WIZARD
let wSt=1,wD={},CKS=['sc','am','gi','wq','en','np'];
const SN=['Your organization','Basin and location','Project basics','Financial snapshot','Digital readiness','Your result'];

function openWiz(){wSt=1;wD={};CKS.forEach(f=>wD[f]=false);document.getElementById('wz').style.display='flex';rWiz();}
function closeWiz(){document.getElementById('wz').style.display='none';rSidebar('dashboard');rMain('dashboard');}

function rWiz(){
  document.getElementById('wpf').style.width=(wSt/6*100)+'%';
  document.querySelectorAll('.ws').forEach(s=>s.classList.remove('ac'));
  document.getElementById('ws'+wSt).classList.add('ac');
  let nav='';
  SN.forEach((n,i)=>{const s=i+1,c=s<wSt?'dn':s===wSt?'ac':'',lc=s<wSt?'dn':s===wSt?'ac':'',inn=s<wSt?'✓':s;nav+=`<div class="wsi"><div class="wsc ${c}">${inn}</div><div class="wsl ${lc}">${n}</div></div>`;if(i<SN.length-1)nav+=`<div class="wco ${s<wSt?'dn':''}"></div>`;});
  document.getElementById('wsnav').innerHTML=nav;
  const ir=wSt===6;
  document.getElementById('wfh').textContent=ir?'Your eligibility result':`Step ${wSt} of 5`;
  document.getElementById('wbk').style.display=wSt>1?'block':'none';
  const cb=document.getElementById('wct');
  if(ir)cb.style.display='none';else{cb.style.display='block';cb.textContent=wSt===5?'See my eligibility result':'Continue';wval();}
  if(wSt===5)updS();
}

function g(id){const e=document.getElementById(id);return e&&e.value&&e.value.trim()!=='';}
function wval(){
  const b=document.getElementById('wct');if(!b)return;
  let ok=false;
  if(wSt===1)ok=g('w1')&&g('w2')&&g('w3')&&g('w4')&&g('w5')&&g('w6')&&g('w7');
  if(wSt===2)ok=!!wD.basin_id;
  if(wSt===3)ok=!!wD.project_type&&g('w9');
  if(wSt===4)ok=g('w12')&&g('w14')&&g('w16');
  if(wSt===5)ok=g('w18');
  b.disabled=!ok;
}

function saveW(){
  if(wSt===1){wD.org=document.getElementById('w1').value;wD.entity_type=document.getElementById('w2').value;wD.state=document.getElementById('w3').value;wD.population=document.getElementById('w4').value;wD.contact=document.getElementById('w5').value;wD.email=document.getElementById('w6').value;wD.srf=document.getElementById('w7').value;}
  if(wSt===3){wD.cost_range=document.getElementById('w9').value;wD.start=document.getElementById('w10').value;wD.desc=document.getElementById('w11').value;}
  if(wSt===4){wD.rev=document.getElementById('w12').value;wD.covenant=document.getElementById('w13').value;wD.dscr=document.getElementById('w14').value;wD.cash=document.getElementById('w15').value;wD.audits=document.getElementById('w16').value;}
  if(wSt===5){wD.nrw=document.getElementById('w17').value;wD.operator=document.getElementById('w18').value;}
}

function wNext(){saveW();if(wSt===5){doResult();wSt=6;rWiz();return;}wSt++;rWiz();}
function wBack(){if(wSt>1){wSt--;rWiz();}}

function selB(el,id,tier){document.querySelectorAll('.bc').forEach(c=>c.classList.remove('sl'));el.classList.add('sl');wD.basin_id=id;wD.basin_tier=tier;wD.basin_label=BL2[id];const m=document.getElementById('bmsg');m.innerHTML=tier==='mvp'?'<div class="ib it"><strong>This basin is in the MVP portfolio.</strong> Basin geography adds 30 points to your eligibility score.</div>':'<div class="ib ia"><strong>Reserve list basin.</strong> +15 points. Your application will be considered for future portfolio cycles.</div>';m.style.display='block';wval();updS();}
function selT(el,id){document.querySelectorAll('.tc').forEach(c=>c.classList.remove('sl'));el.classList.add('sl');wD.project_type=id;wD.project_type_label=TL[id];wval();updS();}
function costWarn(){const v=document.getElementById('w9').value,w=document.getElementById('cwarn');if(v==='toosmall'){w.textContent='Below portfolio minimum. Consider USDA Rural Development loans for smaller projects.';w.style.display='block';}else if(v==='toobig'){w.textContent='Exceeds portfolio limit. Consider WIFIA for large-scale projects.';w.style.display='block';}else w.style.display='none';updS();}
function tog(f){wD[f]=!wD[f];document.getElementById('ck-'+f).classList.toggle('on',wD[f]);const cnt=CKS.filter(x=>wD[x]).length;document.getElementById('twarn').style.display=cnt<2?'block':'none';updS();}

function calcSc(){
  let s=0;
  if(wD.basin_tier==='mvp')s+=30;else if(wD.basin_tier==='reserve')s+=15;
  s+={dw:20,ww:18,sw:18,lsl:16,pfas:14,reuse:14}[wD.project_type]||0;
  if(['small','medium','large'].includes(wD.cost_range||document.getElementById('w9')?.value))s+=20;
  const dv=document.getElementById('w14')?.value||wD.dscr;
  s+={high:20,good:18,ok:15,thin:10,below:2,unsure:10}[dv]||10;
  if((document.getElementById('w13')?.value||wD.covenant)==='yes')s+=3;
  if((document.getElementById('w16')?.value||wD.audits)==='yes')s+=2;
  const dp={sc:8,am:8,gi:4,wq:4,en:3,np:3};let dig=0;CKS.forEach(f=>{if(wD[f])dig+=dp[f];});
  s+=Math.min(dig,10);return Math.min(s,100);
}

function updS(){
  if(wSt!==5)return;const sc=calcSc(),n=document.getElementById('spn'),b=document.getElementById('sbf'),l=document.getElementById('slb');
  if(!n)return;n.textContent=sc;b.style.width=sc+'%';
  if(sc>=65){n.className='sbn g';b.style.background='var(--t)';l.textContent='700+ pts eligible';l.style.color='var(--t)';}
  else if(sc>=50){n.className='sbn a';b.style.background='var(--am)';l.textContent='Near threshold';l.style.color='var(--am)';}
  else{n.className='sbn r';b.style.background='var(--re)';l.textContent='Below threshold';l.style.color='var(--re)';}
}

function doResult(){
  saveW();const sc=calcSc(),oc=sc>=65?'eligible':sc>=50?'ta':'decline';
  wD.score=sc;wD.outcome=oc;wSubs.push({...wD});
  let h='';
  if(oc==='eligible'){h=`<div class="rc el"><div class="rsc el">${sc}</div><div class="rh" style="color:var(--td)">Likely eligible for the portfolio</div><div class="rb2">Your pre-screen assessment indicates likely eligibility for WaterFundable's climate water bond portfolio. The full application uses the Basin Portfolio Build Methodology (BPBM v1.0) — a 1,000-point scoring system across 7 pillars. Target score: 700+ points. The next step is the Tech A full application, where you will upload financial statements, engineering documents, and permit data.</div><div class="rm"><div class="rme"><div class="rmel">Basin</div><div class="rmev">${wD.basin_label||'MVP portfolio basin'}</div></div><div class="rme"><div class="rmel">Project type</div><div class="rmev">${wD.project_type_label||'—'}</div></div><div class="rme"><div class="rmel">Est. Impact Capital grant share</div><div class="rmev">~10% of project cost</div></div><div class="rme"><div class="rmel">Bond allocation range</div><div class="rmev">$1M – $100M</div></div></div></div><div class="ns"><div class="nst">Your next steps</div><div class="nsi"><div class="nsn">1</div><div class="nstx">Complete the full Tech A application. You will need 3 years of audited financials, engineering reports, and permit documents.</div></div><div class="nsi"><div class="nsn">2</div><div class="nstx">A WaterFundable advisor will contact you within 2 business days to review your application.</div></div><div class="nsi"><div class="nsn">3</div><div class="nstx">Once verified, your project enters the portfolio assembly queue for the next bond issuance cycle.</div></div></div><div style="text-align:center;margin-top:8px"><button class="rct" onclick="closeWiz()">Return to dashboard</button><span class="rrv" onclick="wSt=5;rWiz()">Review my answers</span></div>`;}
  else if(oc==='ta'){h=`<div class="rc ta"><div class="rsc ta">${sc}</div><div class="rh" style="color:#633806">Near-miss — technical assistance available</div><div class="rb2">Your project scored below the 700/1000 BPBM threshold for direct portfolio inclusion, but you may qualify after technical assistance. A WaterFundable CIP advisor can help close the gaps.</div></div><div class="ib ia"><strong>Common reasons for a TA referral:</strong> missing audited financials, thin debt service coverage, no licensed operator, or limited digital monitoring infrastructure. These are fixable. Many utilities qualify after 3-6 months of TA support.</div><div class="ns"><div class="nst">Your next steps</div><div class="nsi"><div class="nsn">1</div><div class="nstx">A WaterFundable CIP advisor will contact you within 3 business days to discuss your specific gaps.</div></div><div class="nsi"><div class="nsn">2</div><div class="nstx">Your project enters the reserve pool and will be reassessed for the next portfolio cycle once gaps are resolved.</div></div><div class="nsi"><div class="nsn">3</div><div class="nstx">TA support is free for qualifying utilities.</div></div></div><div style="text-align:center;margin-top:8px"><button class="rct" onclick="closeWiz()">Return to dashboard</button><span class="rrv" onclick="wSt=5;rWiz()">Review my answers</span></div>`;}
  else{h=`<div class="rc dc"><div class="rsc dc">${sc}</div><div class="rh" style="color:#501313">Not eligible at this time</div><div class="rb2">Your project does not meet the minimum criteria for WaterFundable's current portfolio. This may be due to basin geography, project size, or financial profile.</div></div><div class="ib ir"><strong>Other funding resources that may be a better fit:</strong><br>• USDA Rural Development Water and Waste Disposal loans — no geographic restriction, projects from $100K up<br>• EPA WIFIA — for large water infrastructure projects over $20M<br>• Your state's SRF program — contact your state revolving fund administrator</div><div style="text-align:center;margin-top:13px"><button class="rct" onclick="closeWiz()">Return to dashboard</button><span class="rrv" onclick="wSt=5;rWiz()">Review my answers</span></div>`;}
  document.getElementById('rc').innerHTML=h;
}

// TEAR SHEET
function openTS(id){
  const all=allP(),p=FP.find(x=>x.id===id)||all.find(x=>x.id===id);
  if(!p)return;
  document.getElementById('tsmt').textContent=p.org+' — Project tear sheet';
  document.getElementById('tsbd').innerHTML=buildTS(p);
  document.getElementById('tso').classList.add('op');
}
function closeTS(){document.getElementById('tso').classList.remove('op');}

function buildTS(p){
  const ts=p.ts||{},wz=p.id>=100?wSubs[p.id-100]||{}:{};
  const gf=(a,b)=>a||b||'—';
  const city=gf(ts.ci,wz.project_city||wz.city);
  const pop=gf(ts.po,wz.population||wz.population_served);
  const cost=gf(ts.co,null);
  const dscr=gf(ts.ds,wz.dscr_range||wz.dscr);
  const cov=gf(ts.rv,wz.rate_covenant||wz.covenant);
  const cash=gf(ts.ca,wz.cash_days_range||wz.cash);
  const cred=gf(ts.cr,p.oc==='eligible'?'Investment grade equivalent':p.oc==='ta'?'TA required':'Not eligible');
  const ba=gf(ts.ba2,cost);
  const cws=gf(ts.cw,p.oc==='eligible'?'~10% of project cost':'N/A');
  const ws=gf(ts.ws,null),wsh=gf(ts.wa,pop),ghg=gf(ts.gh,null),nrw=gf(ts.nr,wz.nrw_range||wz.nrw),bio=gf(ts.bi,null),bst=gf(ts.bs,null);
  const cdp=ts.cd!==undefined?ts.cd:p.oc==='eligible';
  const start=gf(ts.cs,wz.start_estimate||wz.start);
  const ent=gf(ts.en,wz.entity_type);
  const sta=gf(ts.sta,wz.state);
  const today=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  return `<div class="tsh"><div><div class="tso2">${p.org}</div><div class="tss">${p.ba} Basin · ${p.ty} · ${ent}</div></div><div class="tssr"><div class="tssn">${p.sc}<span class="tssl">/1000</span></div><div class="tssl" style="font-size:11px;margin-top:2px">BPBM pre-screen score</div><div style="margin-top:5px"><span class="badge ${p.oc==='eligible'?'bt':p.oc==='ta'?'ba':'br'}">${p.oc==='eligible'?'Eligible':p.oc==='ta'?'TA referral':'Not eligible'}</span></div></div></div>
<div class="tsbl">
  <div class="tsb3"><div class="tsbh id">Identity &amp; geography</div><div class="tsbb">
    <div class="tsf"><div class="tsfl">Utility</div><div class="tsfv">${p.org}</div></div>
    <div class="tsf"><div class="tsfl">Entity type</div><div class="tsfv">${ent}</div></div>
    <div class="tsf"><div class="tsfl">Location</div><div class="tsfv">${city}${sta&&sta!=='—'?', '+sta:''}</div></div>
    <div class="tsf"><div class="tsfl">Basin</div><div class="tsfv">${p.ba} <span class="badge ${p.bt==='mvp'?'bt':'ba'}" style="font-size:10px">${p.bt==='mvp'?'MVP portfolio':'Reserve list'}</span></div></div>
    <div class="tsf"><div class="tsfl">Population served</div><div class="tsfv">${pop}</div></div>
    <div class="tsf"><div class="tsfl">Project type</div><div class="tsfv">${p.ty}</div></div>
    <div class="tsf"><div class="tsfl">Construction start</div><div class="tsfv">${start}</div></div>
  </div></div>
  <div class="tsb3"><div class="tsbh fn">Financial &amp; credit</div><div class="tsbb">
    <div class="tsf"><div class="tsfl">Est. project cost</div><div class="tsfv">${cost}</div></div>
    <div class="tsf"><div class="tsfl">Bond allocation</div><div class="tsfv">${ba}</div></div>
    <div class="tsf"><div class="tsfl">Impact Capital grant share</div><div class="tsfv g">${cws}</div></div>
    <div class="tsf"><div class="tsfl">Approx. DSCR</div><div class="tsfv ${p.sc>=700?'g':p.sc>=600?'a':'r'}">${dscr}</div></div>
    <div class="tsf"><div class="tsfl">Days cash on hand</div><div class="tsfv">${cash}</div></div>
    <div class="tsf"><div class="tsfl">Rate covenant</div><div class="tsfv">${cov}</div></div>
    <div class="tsf"><div class="tsfl">Credit tier</div><div class="tsfv ${p.oc==='eligible'?'g':p.oc==='ta'?'a':'r'}">${cred}</div></div>
  </div></div>
  <div class="tsb3"><div class="tsbh im">Water &amp; climate impact</div><div class="tsbb">
    <div class="tsf"><div class="tsfl">Water secured</div><div class="tsfv g">${ws}</div></div>
    <div class="tsf"><div class="tsfl">WASH beneficiaries</div><div class="tsfv">${wsh}</div></div>
    <div class="tsf"><div class="tsfl">GHG reduced</div><div class="tsfv">${ghg}</div></div>
    <div class="tsf"><div class="tsfl">NRW baseline</div><div class="tsfv">${nrw}</div></div>
    <div class="tsf"><div class="tsfl">Basin water stress</div><div class="tsfv">${bst}</div></div>
    <div class="tsf"><div class="tsfl">Biodiversity</div><div class="tsfv" style="font-size:11px">${bio}</div></div>
    <div class="tsf"><div class="tsfl">CDP attribution</div><div class="tsfv ${cdp?'g':''}">${cdp?'Eligible — CDP Water W-series':'Not yet confirmed'}</div></div>
  </div></div>
</div>
<div class="tsfl2">
  ${p.fl&&p.fl.no?'<span class="tsf2" style="background:var(--rel);color:var(--re)">⚠ No licensed operator — bond eligibility blocker</span>':''}
  ${p.fl&&p.fl.ta?'<span class="tsf2" style="background:var(--aml);color:var(--am)">TA referral — CIP advisor engagement required</span>':''}
'<span class="tsf2" style="background:var(--aml);color:var(--am)">Reserve list basin</span>'}
  ${cdp?'<span class="tsf2" style="background:var(--bll);color:var(--bl)">CDP Water attribution eligible</span>':''}
</div>
<div class="tsdv"></div>
<div class="tsfoo"><div class="tsfl3">WaterFundable PBC &nbsp;·&nbsp; Confidential &nbsp;·&nbsp; Pre-screen assessment only — not an investment recommendation</div><div class="tsfl3">Generated ${today}</div></div>`;
}

// ── REGEN MRV ─────────────────────────────────────────────────────────────
const MRV_DATA = {
  1: { // Colusa County - bond active, verified data
    status: 'live', status_label: 'Live — Tech B MRV active', tracking_id: 'RGN-2026-001-SAC',
    last_report: 'Annual Report · Mar 2026', next_report: 'Mar 2027',
    verified: true,
    metrics: [
      { icon:'💧', label:'Water secured', val:'44.2M', unit:'gal/yr', sub:'Verified vs 42M estimated', vs:'+5% above estimate', cls:'g' },
      { icon:'🌿', label:'GHG reduced', val:'187', unit:'tCO2e/yr', sub:'Pumping + treatment energy', vs:'+4% above estimate', cls:'g' },
      { icon:'👥', label:'WASH beneficiaries', val:'8,400', unit:'people', sub:'Reliable water access confirmed', vs:'On target', cls:'v' },
      { icon:'📉', label:'NRW reduction', val:'22% → 14%', unit:'', sub:'Non-revenue water improvement', vs:'8pp reduction achieved', cls:'g' },
      { icon:'🦋', label:'Biodiversity credits', val:'0', unit:'PURO credits', sub:'No NBS component in this project', vs:'N/A', cls:'' },
      { icon:'🏦', label:'Impact Capital grant disbursed', val:'$210K', unit:'of $420K', sub:'First milestone completed', vs:'50% disbursed', cls:'g' },
    ],
    sources: [
      { icon:'📡', name:'SCADA telemetry', sub:'Real-time flow, pressure, NRW · 15-min intervals', status:'on' },
      { icon:'📊', name:'AMI consumption data', sub:'Smart meter reads · Daily aggregation', status:'on' },
      { icon:'🛰️', name:'Remote sensing', sub:'Sentinel-2 · Quarterly NDVI, land cover', status:'on' },
      { icon:'🧪', name:'Water quality sensors', sub:'Turbidity, conductivity · In-pipe sensors', status:'on' },
      { icon:'⚡', name:'Energy metering', sub:'kWh/MG tracking · Monthly reporting', status:'on' },
      { icon:'🏛️', name:'NPDES effluent reports', sub:'Not applicable — drinking water project', status:'off' },
    ],
    events: [
      { dot:'g', title:'Annual MRV report verified', detail:'Tech B verifier confirmed Year 1 impact report. 44.2M gal/yr water secured confirmed. Report posted to EMMA by trustee.', date:'Mar 15, 2026' },
      { dot:'g', title:'Impact Capital grant milestone 1 disbursed', detail:'$210K released from Impact Capital reserve to Colusa County Water District. Third-party assessor verified construction completion. CDP W-series attribution packet generated.', date:'Feb 28, 2026' },
      { dot:'b', title:'Tech B MRV baseline established', detail:'Pre-construction baseline locked: 22% NRW, SCADA and AMI feeds connected, remote sensing baseline captured. Tech B tracking ID: RGN-2026-001-SAC.', date:'Jul 12, 2025' },
      { dot:'b', title:'Bond close — MRV activated', detail:'$4.2M bond allocation escrowed. Tech B MRV protocol activated. Construction monitoring begins.', date:'Jun 1, 2025' },
      { dot:'a', title:'Data room locked — handoff to Tech B', detail:'Tech A data room locked. Project data package sent to Tech B API. SCADA integration specs shared with utility.', date:'May 10, 2025' },
    ],
    attribution: [
      { corp:'Microsoft', commit:'$2.0M', water:'18.4M gal/yr', cdp:true },
      { corp:'Google Water Pledge', commit:'$1.5M', water:'13.8M gal/yr', cdp:true },
      { corp:'Unilever', commit:'$500K', water:'4.6M gal/yr', cdp:false },
    ]
  },
  2: { // Glenn-Colusa - data room locked, MRV initializing
    status: 'pending', status_label: 'Initializing — MRV baseline in setup', tracking_id: 'RGN-2026-002-SAC',
    last_report: 'No reports yet', next_report: 'After construction close',
    verified: false,
    metrics: [
      { icon:'💧', label:'Water secured', val:'210M', unit:'gal/yr est.', sub:'Pre-screen estimate only — not verified', vs:'Tech B verification pending', cls:'' },
      { icon:'🌿', label:'GHG reduced', val:'620', unit:'tCO2e/yr est.', sub:'Pre-screen estimate only', vs:'Pending', cls:'' },
      { icon:'👥', label:'WASH beneficiaries', val:'45,000', unit:'people', sub:'Pre-screen estimate', vs:'Pending', cls:'' },
      { icon:'🌾', label:'Riparian restoration', val:'14 acres', unit:'est.', sub:'NBS component — PURO assessment eligible', vs:'Pending', cls:'' },
      { icon:'🦋', label:'Biodiversity credits', val:'Est. 28-42', unit:'PURO credits', sub:'Pending PURO standard assessment', vs:'Pending', cls:'' },
      { icon:'🏦', label:'Impact Capital grant disbursed', val:'$0', unit:'of $1.85M', sub:'Bond not yet closed', vs:'—', cls:'' },
    ],
    sources: [
      { icon:'📡', name:'SCADA telemetry', sub:'Not yet connected — pending bond close', status:'pend' },
      { icon:'📊', name:'AMI consumption data', sub:'Not yet connected', status:'pend' },
      { icon:'🛰️', name:'Remote sensing', sub:'Pre-construction baseline scheduled for Q3 2026', status:'pend' },
      { icon:'🧪', name:'Water quality sensors', sub:'Sensor specs confirmed. Install post-construction.', status:'pend' },
      { icon:'⚡', name:'Energy metering', sub:'Not yet connected', status:'pend' },
      { icon:'🏛️', name:'NPDES effluent reports', sub:'Applicable — stormwater project. Setup pending.', status:'pend' },
    ],
    events: [
      { dot:'a', title:'Tech B MRV integration planned', detail:'Pre-construction remote sensing baseline scheduled. SCADA and AMI integration specs to be finalized at bond close.', date:'Mar 8, 2026' },
      { dot:'fa', title:'Project under review', detail:'Tech A application submitted. Awaiting document validation and verification completion before data room lock and Tech B handoff.', date:'Mar 8, 2026' },
    ],
    attribution: [],
    ledger_claims: []
  }
};

function openMRV(id) {
  const p = FP.find(x=>x.id===id);
  if (!p) return;
  const data = MRV_DATA[id];
  if (!data) {
    // Generic pending state for projects without MRV data
    document.getElementById('mrv-title').textContent = p.org + ' — MRV Dashboard';
    document.getElementById('mrv-body').innerHTML = `<div class="mrv-status-bar"><div class="mrv-status-dot inactive"></div><div><div class="mrv-status-label">MRV not yet activated</div><div style="font-size:12px;color:var(--mu)">Tech B MRV activates after bond close and construction start. This project has not yet reached that stage.</div></div></div>
    <div class="ib it"><strong>How Tech B MRV works for this project:</strong> Once the bond closes and construction begins, Tech B connects to your SCADA system, AMI meters, and remote sensing feeds. The platform computes verified annual impact metrics: water secured (gal/yr), GHG reduced (tCO2e/yr), WASH beneficiaries with reliable access, and — where applicable — PURO biodiversity credits. These verified numbers replace the pre-screen estimates in your tear sheet and feed directly into the annual bond report posted to EMMA.</div>`;
    document.getElementById('mrvoverlay').classList.add('op');
    return;
  }
  document.getElementById('mrv-title').textContent = p.org + ' — MRV Dashboard';
  const firstTab = document.querySelector('.mrv-tab');
  document.querySelectorAll('.mrv-tab').forEach(t=>t.classList.remove('ac'));
  firstTab.classList.add('ac');
  renderMRVTab('mrv-impact', data);
  document.getElementById('mrvoverlay').classList.add('op');
}

function closeMRV() { document.getElementById('mrvoverlay').classList.remove('op'); }

function mrvTab(el, view) {
  document.querySelectorAll('.mrv-tab').forEach(t=>t.classList.remove('ac'));
  el.classList.add('ac');
  // Find which project's data we're showing by getting the title
  const title = document.getElementById('mrv-title').textContent;
  const p = FP.find(x=>title.startsWith(x.org));
  const data = p ? MRV_DATA[p.id] : null;
  if (data) renderMRVTab(view, data);
}

function renderMRVTab(view, data) {
  const body = document.getElementById('mrv-body');
  const statusDotClass = data.status==='live' ? 'live' : data.status==='pending' ? 'pending' : 'inactive';

  const statusBar = `<div class="mrv-status-bar">
    <div class="mrv-status-dot ${statusDotClass}"></div>
    <div><div class="mrv-status-label">${data.status_label}</div><div style="font-size:11px;color:var(--mu)">Tech B tracking ID: ${data.tracking_id}</div></div>
    <div class="mrv-status-sub">${data.last_report} · Next: ${data.next_report}</div>
  </div>`;

  if (view === 'mrv-impact') {
    body.innerHTML = statusBar + `
    ${data.verified ? '<div class="ib it" style="margin-bottom:16px"><strong>Verified by Tech B.</strong> These figures are confirmed via SCADA telemetry, AMI data, and remote sensing. They feed directly into the annual bond report posted to EMMA and the Impact attribution packets for CDP/GRI/TNFD disclosure.</div>' : '<div class="ib ia" style="margin-bottom:16px"><strong>Pre-screen estimates only.</strong> These are projections from the WaterFundable onboarding assessment. Tech B will replace these with verified figures after bond close and construction completion.</div>'}
    <div class="mrv-grid">
    ${data.metrics.map(m=>`<div class="mrv-card">
      <div class="mrv-card-icon">${m.icon}</div>
      <div class="mrv-card-label">${m.label}</div>
      <div class="mrv-card-val ${m.cls}">${m.val} <span style="font-size:13px;font-weight:400;color:var(--mu)">${m.unit}</span></div>
      <div class="mrv-card-sub">${m.sub}</div>
      ${m.vs ? `<div class="mrv-card-vs">${m.vs}</div>` : ''}
    </div>`).join('')}
    </div>`;
  }

  if (view === 'mrv-data') {
    body.innerHTML = statusBar + `
    <div class="mrv-section-title">Data ingestion sources — Tech B connections</div>
    ${data.sources.map(s=>`<div class="mrv-source-row">
      <div class="mrv-source-icon" style="background:var(--grl)">${s.icon}</div>
      <div><div class="mrv-source-name">${s.name}</div><div class="mrv-source-sub">${s.sub}</div></div>
      <div class="mrv-source-status ${s.status}">${s.status==='on'?'Connected':s.status==='pend'?'Pending':'N/A'}</div>
    </div>`).join('')}
    <div style="margin-top:16px" class="ib it"><strong>How data flows:</strong> SCADA and AMI data push via API from the utility's data historian to Tech B ingestion pipeline every 15 minutes. Tech B converts raw telemetry into structured claims anchored on the Tech B Ledger for provenance. Remote sensing runs quarterly via Sentinel-2. Annual MRV reports are generated each anniversary of construction completion and pushed to Tech A for bond reporting.</div>`;
  }

  if (view === 'mrv-events') {
    body.innerHTML = statusBar + `
    <div class="mrv-section-title">Event log — Tech B platform activity</div>
    <div class="mrv-timeline">
    ${data.events.map((e,i)=>`<div class="mrv-event">
      <div class="mrv-event-dot-col"><div class="mrv-event-dot ${e.dot}"></div>${i<data.events.length-1?'<div class="mrv-event-line"></div>':''}</div>
      <div class="mrv-event-body"><div class="mrv-event-title">${e.title}</div><div class="mrv-event-detail">${e.detail}</div><div class="mrv-event-date">${e.date}</div></div>
    </div>`).join('')}
    </div>`;
  }

  if (view === 'mrv-ledger') {
    const claims = data.ledger_claims || [];
    if (!claims.length) {
      body.innerHTML = statusBar + '<div class="ib ia"><strong>No on-chain claims yet.</strong> Tech B Ledger anchoring activates after bond close and first annual MRV report. Claims are immutably recorded on the Tech B Ledger blockchain for provenance and audit.</div>';
      return;
    }
    const anchored = claims.filter(c=>c.status==='anchored').length;
    const verified = claims.filter(c=>c.verified).length;
    const pending = claims.filter(c=>c.status==='pending').length;
    body.innerHTML = statusBar + `
    <div class="ledger-wrap">
      <div class="ledger-inner-hdr">
        <div class="ledger-title">Tech B Ledger</div>
        <div class="ledger-sub">On-chain claim anchoring for ${document.getElementById('mrv-title').textContent.replace(' — MRV Dashboard','')}</div>
      </div>
      <div class="ledger-stats">
        <div class="ledger-stat"><div class="ledger-stat-hdr"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Claims Anchored</div><div class="ledger-stat-num">${anchored}</div></div>
        <div class="ledger-stat green"><div class="ledger-stat-hdr"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.2"/><path d="M4.5 7l2 2 3-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>Verified On-Chain</div><div class="ledger-stat-num">${verified}</div></div>
        <div class="ledger-stat ${pending>0?'amber':''}"><div class="ledger-stat-hdr"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.2"/><path d="M7 4v3.5l2 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>Pending Anchor</div><div class="ledger-stat-num">${pending}</div></div>
      </div>
      <p class="ledger-section-title">Anchored Claims</p>
      <p class="ledger-section-sub">Immutable claim records on the Tech B Ledger</p>
      <table class="ledger-table">
        <thead><tr><th>Project / Benefit</th><th>Value</th><th>Claim ID</th><th>TX Hash</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
        ${claims.map(c=>`<tr>
          <td><div style="font-weight:600">${c.project}</div><div class="benefit-type">${c.benefit_type}</div></td>
          <td style="font-weight:500">${c.value}</td>
          <td><span class="claim-id">${c.claim_id}</span></td>
          <td><span class="tx-hash">${c.tx_hash}<span class="tx-ext">&#x2197;</span></span></td>
          <td style="color:var(--mu);font-size:12px">${c.date}</td>
          <td><span class="anchored-badge">Anchored</span></td>
        </tr>`).join('')}
        </tbody>
      </table>
      <div class="ledger-footer">Powered by Tech B &nbsp;·&nbsp; Claims immutably anchored on Tech B Ledger</div>
    </div>`;
    return;
  }
  if (view === 'mrv-attribution') {
    if (!data.attribution || !data.attribution.length) {
      body.innerHTML = statusBar + `<div class="ib ia"><strong>No Impact attribution data yet.</strong> Attribution data becomes available after the bond closes and corporate sponsor commitment letters are executed. The Tech B Attribution Engine then allocates verified ecosystem outcomes proportionally to each sponsor's financial contribution, generating CDP W-series, GRI 303, and TNFD disclosure packets.</div>`;
      return;
    }
    body.innerHTML = statusBar + `
    <div class="mrv-section-title">Impact Capital investor attribution — Tech B Attribution Engine</div>
    <div style="font-size:12px;color:var(--mu);margin-bottom:12px">Attribution allocates verified water outcomes proportionally to each sponsor's commitment. CDP Water W-series packets generated annually.</div>
    ${data.attribution.map(a=>`<div class="mrv-attribution-row">
      <div class="mrv-attr-corp">${a.corp}</div>
      <div class="mrv-attr-commit">${a.commit} committed</div>
      <div class="mrv-attr-water">💧 ${a.water} attributed</div>
      ${a.cdp ? '<div class="mrv-attr-cdp">CDP W-series</div>' : '<div style="font-size:11px;color:var(--fa)">CDP pending</div>'}
    </div>`).join('')}
    <div class="ib it" style="margin-top:16px"><strong>Attribution methodology (BPBM Pillar 5):</strong> Tech B allocates verified Sacramento Basin water outcomes proportionally to each Impact investor's financial share. Impact investors include Impact Capital investors, foundations, and biodiversity credit buyers — all purchasing the same bond at the same price. Outputs align with WRI VWBA 2.0, CDP Water W4/W8/W11, GRI 303, and TNFD. Annual attribution packets are auto-generated for direct disclosure submission.</div>`;
  }
}


// ── SPRINT 5 PAGES ────────────────────────────────────────────────────────

// ── PORTFOLIO ASSEMBLY — sub-nav state ───────────────────────────────────
if(typeof window.portTab==='undefined') window.portTab='overview';
if(!window.portModel) window.portModel={impactPct:15};

function rPortfolio(){
  const tab=window.portTab;
  const p1=FP.filter(p=>p.portfolio===1);
  const p1el=p1.filter(p=>p.oc==='eligible');
  const p1alloc=p1el.reduce((s,p)=>{return s+(parseFloat((p.ts&&p.ts.co||'$5').replace(/[^0-9.]/g,''))||5);},0);
  const p2=FP.filter(p=>p.portfolio===2);
  const p2el=p2.filter(p=>p.oc==='eligible');
  const p2alloc=p2el.reduce((s,p)=>{return s+(parseFloat((p.ts&&p.ts.co||'$5').replace(/[^0-9.]/g,''))||5);},0);
  const imp=window.portModel.impactPct;
  const qib=100-imp;
  const totalBond=p1alloc;
  const impAmt=(totalBond*imp/100).toFixed(1);
  const qibAmt=(totalBond*qib/100).toFixed(1);

  // ── Contracting summary ──────────────────────────────────────────────────
  const csAll=p1el.map(p=>getCS(p.id));
  const csExecuted=csAll.filter(c=>c.status==='executed').length;
  const csContracting=csAll.filter(c=>c.status==='contracting').length;
  const csMOU=csAll.filter(c=>c.status==='mou_signed').length;
  const csInvited=csAll.filter(c=>c.status==='invited').length;
  const csNone=csAll.filter(c=>c.status==='none').length;

  // ── Tab content ───────────────────────────────────────────────────────────
  const tabs={
    overview: renderPortOverview,
    projects: renderPortProjects,
    capital:  renderPortCapital,
    contracting: renderPortContracting,
    ratings:  renderPortRatings,
  };

  const tabLabels=[
    {id:'overview',   label:'Overview',     icon:'◈'},
    {id:'projects',   label:'Projects',     icon:'▤', count:p1el.length},
    {id:'capital',    label:'Capital Stack', icon:'◉'},
    {id:'contracting',label:'Contracting',  icon:'✎', count:csExecuted+'/'+p1el.length},
    {id:'ratings',    label:'Ratings',      icon:'◆'},
  ];

  const subnav=tabLabels.map(t=>`
    <button onclick="window.portTab='${t.id}';rPortfolio()" style="
      display:flex;align-items:center;gap:7px;padding:9px 14px;border:none;
      background:${tab===t.id?'#fff':'transparent'};
      color:${tab===t.id?'#0A3028':'#6B7280'};
      font-size:12.5px;font-weight:${tab===t.id?700:500};
      border-radius:7px;cursor:pointer;white-space:nowrap;font-family:inherit;
      box-shadow:${tab===t.id?'0 1px 4px rgba(0,0,0,.10)':''};
      transition:all .15s;position:relative">
      <span style="font-size:11px;opacity:.7">${t.icon}</span>
      ${t.label}
      ${t.count!==undefined?`<span style="background:${tab===t.id?'#E8F5F0':'#F3F4F6'};color:${tab===t.id?'#0A3028':'#9CA3AF'};font-size:10px;padding:1px 6px;border-radius:10px;font-weight:700">${t.count}</span>`:''}
    </button>`).join('');

  const content=(tabs[tab]||tabs.overview)(p1,p1el,p1alloc,p2,p2el,p2alloc,imp,qib,totalBond,impAmt,qibAmt,csExecuted,csContracting,csMOU,csInvited,csNone);

  document.getElementById('main').innerHTML=`
<div style="margin-bottom:0">
  <div style="font-size:20px;font-weight:700;color:#111827;letter-spacing:-.01em;margin-bottom:2px">Portfolio Assembly</div>
  <div style="font-size:13px;color:#6B7280">Sacramento River Basin · $${p1alloc.toFixed(0)}M · ${p1el.length} projects · 144A Climate Water Bond</div>
</div>

<!-- Sub-navigation -->
<div style="display:flex;align-items:center;gap:4px;padding:5px;background:#F3F4F6;border-radius:10px;margin:16px 0;overflow-x:auto">
  ${subnav}
  <div style="margin-left:auto;padding:0 8px;font-size:11px;color:#9CA3AF;white-space:nowrap">Portfolio 1</div>
</div>

${content}`;
}

// ── TAB 1: OVERVIEW ───────────────────────────────────────────────────────
function renderPortOverview(p1,p1el,p1alloc,p2,p2el,p2alloc,imp,qib,totalBond,impAmt,qibAmt,csExecuted,csContracting,csMOU,csInvited,csNone){
  const avgScore=p1el.length?Math.round(p1el.reduce((s,p)=>s+p.sc,0)/p1el.length):0;
  const minScore=p1el.length?Math.min(...p1el.map(p=>p.sc)):0;
  const readyPct=p1el.length?Math.round(csExecuted/p1el.length*100):0;
  // Stage distribution
  const stageGroups={};
  p1.forEach(p=>{stageGroups[p.st]=(stageGroups[p.st]||0)+1;});
  return `
<!-- KPI strip -->
<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:20px">
  ${[
    {label:'Portfolio size',value:'$'+p1alloc.toFixed(0)+'M',sub:p1el.length+' eligible projects',accent:'#1D9E75'},
    {label:'Avg BPBM score',value:avgScore+'/1000',sub:'Floor: '+minScore,accent:'#3B82F6'},
    {label:'QIB allocation',value:'$'+qibAmt+'M',sub:qib+'% of portfolio',accent:'#185FA5'},
    {label:'Impact allocation',value:'$'+impAmt+'M',sub:imp+'% of portfolio',accent:'#0F6E56'},
    {label:'Contracting',value:csExecuted+'/'+p1el.length,sub:'executed',accent:csExecuted===p1el.length?'#1D9E75':'#F59E0B'},
    {label:'Portfolio 2 pipeline',value:'$'+p2alloc.toFixed(0)+'M',sub:p2el.length+' eligible',accent:'#534AB7'},
  ].map(k=>`<div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:14px;border-top:3px solid ${k.accent}">
    <div style="font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">${k.label}</div>
    <div style="font-size:22px;font-weight:800;color:#111827;letter-spacing:-.02em;line-height:1">${k.value}</div>
    <div style="font-size:11px;color:#6B7280;margin-top:4px">${k.sub}</div>
  </div>`).join('')}
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">

  <!-- Capital stack visual -->
  <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:18px">
    <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:14px">Capital stack — $${p1alloc.toFixed(0)}M portfolio</div>
    <div style="height:48px;border-radius:8px;overflow:hidden;display:flex;margin-bottom:14px">
      <div style="width:${qib}%;background:linear-gradient(135deg,#1a4fa0,#185FA5);display:flex;align-items:center;padding-left:12px">
        <div><div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.9)">QIB ${qib}%</div><div style="font-size:10px;color:rgba(255,255,255,.65)">$${qibAmt}M</div></div>
      </div>
      <div style="width:${imp}%;background:linear-gradient(135deg,#0F6E56,#1D9E75);display:flex;align-items:center;justify-content:center">
        <div style="text-align:center"><div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.9)">Impact ${imp}%</div><div style="font-size:10px;color:rgba(255,255,255,.65)">$${impAmt}M</div></div>
      </div>
    </div>
    ${[
      {label:'Qualified Institutional Buyers',sub:'144A Rule · One price · KBRA BBB+ equiv.',amt:'$'+qibAmt+'M',pct:qib+'%',col:'#185FA5'},
      {label:'Impact investors',sub:'CWS sponsors · Foundations · Yield subsidy role',amt:'$'+impAmt+'M',pct:imp+'%',col:'#1D9E75'},
    ].map(r=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid #F3F4F6">
      <div style="width:3px;height:32px;background:${r.col};border-radius:2px;flex-shrink:0"></div>
      <div style="flex:1"><div style="font-size:12px;font-weight:600;color:#374151">${r.label}</div><div style="font-size:11px;color:#9CA3AF">${r.sub}</div></div>
      <div style="text-align:right"><div style="font-size:14px;font-weight:700;color:${r.col}">${r.amt}</div><div style="font-size:10px;color:#9CA3AF">${r.pct}</div></div>
    </div>`).join('')}
  </div>

  <!-- Pipeline stage heat -->
  <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:18px">
    <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:14px">Stage distribution — Portfolio 1</div>
    ${Object.entries(stageGroups).map(([stage,count])=>{
      const pct=Math.round(count/p1.length*100);
      const col=stage==='bond_active'?'#1D9E75':stage==='portfolio_queue'?'#3B82F6':stage.includes('verified')?'#0F6E56':stage.includes('data_room')?'#0F6E56':'#F59E0B';
      return `<div style="margin-bottom:9px">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <span style="font-size:11px;color:#374151;font-weight:500">${SL[stage]||stage}</span>
          <span style="font-size:11px;color:#9CA3AF">${count} project${count>1?'s':''}</span>
        </div>
        <div style="height:5px;background:#F3F4F6;border-radius:3px"><div style="height:5px;width:${Math.max(pct,5)}%;background:${col};border-radius:3px"></div></div>
      </div>`;
    }).join('')}
    <div style="margin-top:12px;padding:10px 12px;background:#F9FAFB;border-radius:8px;font-size:11px;color:#6B7280">
      Contracting progress: <strong style="color:#111">${csExecuted} executed · ${csContracting} in review · ${csMOU} MOU signed · ${csInvited} invited · ${csNone} not yet offered</strong>
    </div>
  </div>
</div>

<!-- Portfolio 2 pipeline -->
<div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:18px">
  <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:12px">Portfolio 2 — San Joaquin Basin <span style="font-size:11px;font-weight:400;color:#9CA3AF;margin-left:6px">Pipeline · Not yet open</span></div>
  <div style="display:flex;gap:10px;overflow-x:auto">
    ${p2el.map(p=>`<div style="min-width:180px;padding:12px 14px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;flex-shrink:0">
      <div style="font-size:11px;font-weight:600;color:#374151;margin-bottom:4px">${p.org.split('—')[0].trim()}</div>
      <div style="font-size:11px;color:#9CA3AF;margin-bottom:6px">${p.ty}</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;font-weight:700;color:${p.sc>=700?'#1D9E75':'#F59E0B'}">${p.sc}<span style="font-size:9px;color:#9CA3AF">/1000</span></span>
        <span style="font-size:11px;font-weight:600;color:#374151">${p.ts&&p.ts.co||'—'}</span>
      </div>
    </div>`).join('')}
  </div>
</div>`;
}

// ── TAB 2: PROJECTS ───────────────────────────────────────────────────────
function renderPortProjects(p1,p1el){
  const sorted=[...p1el].sort((a,b)=>b.sc-a.sc);
  return `
<div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden">
  <div style="padding:16px 20px;border-bottom:1px solid #F3F4F6;display:flex;align-items:center;justify-content:space-between">
    <div>
      <div style="font-size:13px;font-weight:700;color:#374151">Portfolio 1 — eligible projects</div>
      <div style="font-size:11px;color:#9CA3AF;margin-top:1px">${sorted.length} projects · $${sorted.reduce((s,p)=>{return s+(parseFloat((p.ts&&p.ts.co||'0').replace(/[^0-9.]/g,''))||0);},0).toFixed(0)}M total · Ranked by BPBM score</div>
    </div>
    <div style="font-size:11px;color:#9CA3AF">Click row for detail</div>
  </div>
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr style="background:#F9FAFB">
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E7EB">#</th>
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E7EB">Project</th>
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E7EB">BPBM</th>
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E7EB">Rating</th>
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E7EB">Allocation</th>
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E7EB">Stage</th>
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E7EB">Contracting</th>
        <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E7EB">DSCR</th>
        <th style="padding:10px 16px;border-bottom:1px solid #E5E7EB"></th>
      </tr>
    </thead>
    <tbody>
    ${sorted.map((p,i)=>{
      const ts=p.ts||{};
      const cs=getCS(p.id);
      const scColor=p.sc>=800?'#059669':p.sc>=700?'#1D9E75':'#F59E0B';
      const csColor={executed:'#059669',contracting:'#3B82F6',mou_signed:'#0F6E56',invited:'#F59E0B',none:'#D1D5DB'}[cs.status]||'#D1D5DB';
      const barWidth=Math.round(p.sc/10);
      return `<tr style="border-bottom:1px solid #F3F4F6;transition:background .1s;cursor:pointer"
        onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background=''"
        onclick="openTS(${p.id})">
        <td style="padding:12px 16px;font-size:12px;color:#9CA3AF;font-weight:600">${i+1}</td>
        <td style="padding:12px 16px">
          <div style="font-size:13px;font-weight:600;color:#111827">${p.org}</div>
          <div style="font-size:11px;color:#9CA3AF;margin-top:1px">${p.ty} · ${ts.ci||p.ba}</div>
        </td>
        <td style="padding:12px 16px">
          <div style="font-size:16px;font-weight:800;color:${scColor};letter-spacing:-.01em">${p.sc}<span style="font-size:10px;color:#D1D5DB;font-weight:400">/1000</span></div>
          <div style="height:3px;background:#F3F4F6;border-radius:2px;width:64px;margin-top:4px"><div style="height:3px;width:${barWidth}%;background:${scColor};border-radius:2px"></div></div>
        </td>
        <td style="padding:12px 16px;font-size:12px;color:#374151;font-weight:500">${ts.score_equiv?ts.score_equiv.split(' (')[0]:'BBB+'}</td>
        <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#111827">${ts.co||'—'}</td>
        <td style="padding:12px 16px">
          <span style="display:inline-flex;align-items:center;padding:3px 8px;border-radius:20px;font-size:10px;font-weight:600;background:#F0FDF4;color:#166534;border:1px solid #BBF7D0">${SL[p.st]||p.st}</span>
        </td>
        <td style="padding:12px 16px">
          <div style="display:flex;align-items:center;gap:5px">
            <div style="width:7px;height:7px;border-radius:50%;background:${csColor}"></div>
            <span style="font-size:11px;color:#374151">${CS_LABEL[cs.status]||'—'}</span>
          </div>
        </td>
        <td style="padding:12px 16px;font-size:12px;font-weight:600;color:${ts.ds&&parseFloat(ts.ds)>=1.5?'#059669':'#F59E0B'}">${ts.ds||'—'}</td>
        <td style="padding:12px 16px">
          <div style="display:flex;gap:5px" onclick="event.stopPropagation()">
            <button onclick="openTS(${p.id})" style="padding:4px 10px;font-size:11px;border:1px solid #E5E7EB;border-radius:5px;background:#fff;color:#374151;cursor:pointer;font-family:inherit;font-weight:500">Tear sheet</button>
            <button onclick="rMain('dataroom-${p.id}')" style="padding:4px 10px;font-size:11px;border:1px solid #E5E7EB;border-radius:5px;background:#fff;color:#374151;cursor:pointer;font-family:inherit;font-weight:500">Data room</button>
          </div>
        </td>
      </tr>`;
    }).join('')}
    </tbody>
  </table>
  <div style="padding:12px 20px;background:#F9FAFB;border-top:1px solid #F3F4F6;display:flex;justify-content:space-between;align-items:center">
    <div style="font-size:12px;color:#9CA3AF">Click any row for full tear sheet · Avg score: ${Math.round(sorted.reduce((s,p)=>s+p.sc,0)/sorted.length)}/1000</div>
    <div style="font-size:12px;font-weight:700;color:#111827">Total: $${sorted.reduce((s,p)=>{return s+(parseFloat((p.ts&&p.ts.co||'0').replace(/[^0-9.]/g,''))||0);},0).toFixed(1)}M</div>
  </div>
</div>`;
}

// ── TAB 3: CAPITAL STACK ──────────────────────────────────────────────────
function renderPortCapital(p1,p1el,p1alloc,p2,p2el,p2alloc,imp,qib,totalBond,impAmt,qibAmt){
  return `
<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:16px">
  <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:20px">
    <div style="font-size:14px;font-weight:700;color:#374151;margin-bottom:16px">Bond participation model</div>
    <div style="font-size:12px;color:#9CA3AF;margin-bottom:14px">Adjust Impact investor participation (10–25%). QIB fills the remainder (75–90%). One bond, one price.</div>

    <div style="margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600;color:#374151">Impact investor participation</span>
        <span style="font-size:18px;font-weight:800;color:#1D9E75">${imp}%</span>
      </div>
      <input type="range" min="10" max="25" step="1" value="${imp}"
        style="width:100%;accent-color:#1D9E75;height:5px"
        oninput="window.portModel.impactPct=+this.value;rPortfolio()"/>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:#9CA3AF;margin-top:3px">
        <span>10% min</span><span>25% max</span>
      </div>
    </div>

    <div style="height:52px;border-radius:8px;overflow:hidden;display:flex;margin-bottom:16px;box-shadow:0 2px 6px rgba(0,0,0,.08)">
      <div style="width:${qib}%;background:linear-gradient(90deg,#1a4fa0,#2563EB);display:flex;align-items:center;padding-left:14px;transition:width .3s">
        <div>
          <div style="font-size:11px;font-weight:700;color:#fff">QIB Investors · ${qib}%</div>
          <div style="font-size:10px;color:rgba(255,255,255,.7)">$${qibAmt}M · Qualified Institutional Buyers</div>
        </div>
      </div>
      <div style="width:${imp}%;background:linear-gradient(90deg,#0F6E56,#1D9E75);display:flex;align-items:center;justify-content:center;transition:width .3s;flex-shrink:0">
        <div style="text-align:center">
          <div style="font-size:11px;font-weight:700;color:#fff">Impact ${imp}%</div>
          <div style="font-size:10px;color:rgba(255,255,255,.7)">$${impAmt}M</div>
        </div>
      </div>
    </div>

    ${[
      {label:'QIB investors (75–90%)',amt:'$'+qibAmt+'M',sub:'144A Rule · KBRA BBB+ rating · One price',col:'#185FA5',pct:qib+'%'},
      {label:'Impact investors (10–25%)',amt:'$'+impAmt+'M',sub:'Yield subsidy role · Yield subsidy precedes underwriting',col:'#1D9E75',pct:imp+'%'},
    ].map(r=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:#F9FAFB;border-radius:8px;margin-bottom:8px">
      <div style="width:4px;height:36px;background:${r.col};border-radius:2px;flex-shrink:0"></div>
      <div style="flex:1"><div style="font-size:13px;font-weight:600;color:#374151">${r.label}</div><div style="font-size:11px;color:#9CA3AF">${r.sub}</div></div>
      <div style="text-align:right"><div style="font-size:16px;font-weight:800;color:${r.col}">${r.amt}</div><div style="font-size:10px;color:#9CA3AF">${r.pct}</div></div>
    </div>`).join('')}

    <div style="padding:12px 14px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;margin-top:12px;font-size:11px;color:#166534;line-height:1.6">
      <strong>Yield subsidy mechanism:</strong> Impact investor commitments are collected before bond structuring. The subsidy reduces the blended financing rate for utilities, improving financial capacity scores. Anchor reserve managed externally — not modeled here.
    </div>
  </div>

  <div>
    <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:18px;margin-bottom:14px">
      <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:12px">Projected capital flows</div>
      ${[
        {label:'Gross proceeds',value:'$'+p1alloc.toFixed(0)+'M',note:'Pre-cost'},
        {label:'Bond counsel / legal',value:'~$1.2M',note:'Est. 0.6%'},
        {label:'Placement fee (B/D)',value:'~$2.0M',note:'Est. 1.0%'},
        {label:'WaterFundable fee',value:'~$0.8M',note:'Est. 0.4%'},
        {label:'Net to utilities',value:'~$'+Math.round(p1alloc-4).toFixed(0)+'M',note:'Est. net proceeds',bold:true},
      ].map(r=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #F3F4F6">
        <span style="font-size:12px;color:#374151;font-weight:${r.bold?700:400}">${r.label}</span>
        <div style="text-align:right"><div style="font-size:13px;font-weight:${r.bold?800:600};color:${r.bold?'#1D9E75':'#111827'}">${r.value}</div><div style="font-size:10px;color:#9CA3AF">${r.note}</div></div>
      </div>`).join('')}
    </div>

    <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:18px">
      <div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:12px">Credit profile</div>
      ${[
        {label:'Investment grade equiv.',pct:78,col:'#1D9E75'},
        {label:'IG with guarantor',pct:11,col:'#F59E0B'},
        {label:'TA / reserve pool',pct:11,col:'#E5E7EB'},
      ].map(b=>`<div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
          <span style="color:#374151;font-weight:500">${b.label}</span>
          <span style="color:#9CA3AF">${b.pct}%</span>
        </div>
        <div style="height:6px;background:#F3F4F6;border-radius:3px"><div style="height:6px;width:${b.pct}%;background:${b.col};border-radius:3px"></div></div>
      </div>`).join('')}
    </div>
  </div>
</div>`;
}

// ── TAB 4: CONTRACTING ────────────────────────────────────────────────────
function renderPortContracting(p1,p1el,p1alloc,p2,p2el,p2alloc,imp,qib,totalBond,impAmt,qibAmt,csExecuted,csContracting,csMOU,csInvited,csNone){
  const stages=[
    {key:'executed',   label:'Executed',          col:'#059669', bg:'#F0FDF4', border:'#BBF7D0'},
    {key:'contracting',label:'PA in review',       col:'#2563EB', bg:'#EFF6FF', border:'#BFDBFE'},
    {key:'mou_signed', label:'MOU signed',         col:'#0F6E56', bg:'#F0FDF4', border:'#A7F3D0'},
    {key:'invited',    label:'Offer sent',         col:'#D97706', bg:'#FFFBEB', border:'#FDE68A'},
    {key:'none',       label:'Not yet offered',    col:'#6B7280', bg:'#F9FAFB', border:'#E5E7EB'},
  ];
  return `
<!-- Summary pills -->
<div style="display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap">
  ${stages.map(s=>{
    const count=p1el.filter(p=>getCS(p.id).status===s.key).length;
    return `<div style="padding:8px 16px;background:${s.bg};border:1px solid ${s.border};border-radius:20px;display:flex;align-items:center;gap:8px">
      <div style="width:8px;height:8px;border-radius:50%;background:${s.col}"></div>
      <span style="font-size:12px;font-weight:600;color:${s.col}">${count}</span>
      <span style="font-size:12px;color:#6B7280">${s.label}</span>
    </div>`;
  }).join('')}
  <div style="margin-left:auto;padding:8px 16px;background:#fff;border:1px solid #E5E7EB;border-radius:20px;font-size:12px;font-weight:700;color:#111827">${csExecuted}/${p1el.length} complete</div>
</div>

<!-- Project contracting table -->
<div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden">
  <div style="padding:14px 18px;border-bottom:1px solid #F3F4F6;font-size:13px;font-weight:700;color:#374151">Portfolio 1 contracting tracker</div>
  <table style="width:100%;border-collapse:collapse">
    <thead><tr style="background:#F9FAFB">
      <th style="text-align:left;padding:9px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #E5E7EB">Project</th>
      <th style="text-align:left;padding:9px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #E5E7EB">Score</th>
      <th style="text-align:left;padding:9px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #E5E7EB">Alloc.</th>
      <th style="text-align:left;padding:9px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #E5E7EB">Status</th>
      <th style="text-align:left;padding:9px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #E5E7EB">Offer date</th>
      <th style="text-align:left;padding:9px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #E5E7EB">MOU date</th>
      <th style="text-align:left;padding:9px 16px;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #E5E7EB">Signatory</th>
      <th style="padding:9px 16px;border-bottom:1px solid #E5E7EB"></th>
    </tr></thead>
    <tbody>
    ${p1el.sort((a,b)=>{const order={executed:0,contracting:1,mou_signed:2,invited:3,none:4};return order[getCS(a.id).status]-order[getCS(b.id).status];}).map(p=>{
      const cs=getCS(p.id);
      const sObj=stages.find(s=>s.key===cs.status)||stages[stages.length-1];
      return `<tr style="border-bottom:1px solid #F3F4F6">
        <td style="padding:12px 16px">
          <div style="font-size:12px;font-weight:600;color:#111827">${p.org.split('—')[0].trim()}</div>
          <div style="font-size:10px;color:#9CA3AF">${p.ty}</div>
        </td>
        <td style="padding:12px 16px;font-size:13px;font-weight:700;color:${p.sc>=700?'#059669':'#F59E0B'}">${p.sc}</td>
        <td style="padding:12px 16px;font-size:12px;font-weight:600;color:#374151">${p.ts&&p.ts.co||'—'}</td>
        <td style="padding:12px 16px">
          <div style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:${sObj.bg};border:1px solid ${sObj.border};border-radius:20px">
            <div style="width:6px;height:6px;border-radius:50%;background:${sObj.col}"></div>
            <span style="font-size:10px;font-weight:600;color:${sObj.col}">${sObj.label}</span>
          </div>
        </td>
        <td style="padding:12px 16px;font-size:11px;color:#6B7280">${cs.inviteDate||'—'}</td>
        <td style="padding:12px 16px;font-size:11px;color:#6B7280">${cs.mouDate||'—'}</td>
        <td style="padding:12px 16px;font-size:11px;color:#374151;font-weight:500">${cs.signedBy||'—'}</td>
        <td style="padding:12px 16px">
          <div style="display:flex;gap:5px">
            <button onclick="openContractPanel(${p.id})" style="padding:4px 10px;font-size:11px;border:1px solid #3B82F6;border-radius:5px;background:#EFF6FF;color:#2563EB;cursor:pointer;font-family:inherit;font-weight:600">Manage</button>
            <button onclick="rGenerateAdminMOU(${p.id})" style="padding:4px 10px;font-size:11px;border:1px solid #E5E7EB;border-radius:5px;background:#fff;color:#374151;cursor:pointer;font-family:inherit;font-weight:500">MOU</button>
          </div>
        </td>
      </tr>`;
    }).join('')}
    </tbody>
  </table>
</div>`;
}

// ── TAB 5: RATINGS ────────────────────────────────────────────────────────
function renderPortRatings(){
  const items=[
    {label:'KBRA shadow rating',status:'In progress',note:'Pool DSCR 1.62x avg. Raftelis data package submitted. Preliminary BBB+ indication expected within 30 days.',col:'#D97706'},
    {label:'Kestrel Blue Bond SPO',status:'In review',note:'Green bond framework submitted. Sacramento Basin WRI Tier 5 stress documented. Expected 6 weeks.',col:'#D97706'},
    {label:'Green bond framework',status:'Complete',note:'Bond counsel drafted. ICMA GBP and CBI Water Criteria alignment confirmed. Ready for SPO.',col:'#059669'},
    {label:'Legal opinion chain',status:'In progress',note:'Bond counsel, 144A securities counsel, and issuer authority opinions in preparation.',col:'#D97706'},
    {label:'Impact commitment letters',status:'Outreach active',note:'Impact prospectus issued. 3 confirmed · 4 in pipeline. Target $21.8M (10% of portfolio).',col:'#D97706'},
    {label:'EMMA filing (post-close)',status:'Pending',note:'Official Statement filed with MSRB EMMA upon bond close. Annual updates thereafter.',col:'#6B7280'},
    {label:'Biodiversity credit process',status:'1 project eligible',note:'City of Colusa (P1 reuse). PURO assessment initiated. Fresno ID (P2) — Verra VCS wetland module.',col:'#D97706'},
    {label:'Trustee engagement',status:'Pending selection',note:'Three bank trustees under consideration. Term sheet review in process.',col:'#6B7280'},
  ];
  return `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
  ${[
    {label:'KBRA rating target',value:'BBB+',sub:'Shadow rating in progress',col:'#1D9E75'},
    {label:'Kestrel SPO',value:'Pending',sub:'Blue Bond Second-Party Opinion',col:'#F59E0B'},
    {label:'CBI Water Criteria',value:'Aligned',sub:'Self-labeling complete',col:'#1D9E75'},
    {label:'ICMA GBP',value:'Aligned',sub:'Framework drafted',col:'#1D9E75'},
  ].map(k=>`<div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:14px;display:flex;align-items:center;gap:14px">
    <div style="width:44px;height:44px;border-radius:8px;background:${k.col}18;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:${k.col};flex-shrink:0">◆</div>
    <div><div style="font-size:11px;color:#9CA3AF;font-weight:600;text-transform:uppercase;letter-spacing:.04em">${k.label}</div><div style="font-size:16px;font-weight:800;color:#111827">${k.value}</div><div style="font-size:11px;color:#9CA3AF">${k.sub}</div></div>
  </div>`).join('')}
</div>

<div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden">
  <div style="padding:14px 18px;border-bottom:1px solid #F3F4F6;font-size:13px;font-weight:700;color:#374151">Ratings & compliance checklist</div>
  ${items.map(r=>`<div style="display:flex;align-items:center;gap:14px;padding:13px 18px;border-bottom:1px solid #F3F4F6">
    <div style="width:8px;height:8px;border-radius:50%;background:${r.col};flex-shrink:0"></div>
    <div style="flex:1">
      <div style="font-size:13px;font-weight:600;color:#374151">${r.label}</div>
      <div style="font-size:11px;color:#9CA3AF;margin-top:2px">${r.note}</div>
    </div>
    <span style="padding:4px 10px;font-size:11px;font-weight:600;color:${r.col};background:${r.col}15;border:1px solid ${r.col}40;border-radius:20px;white-space:nowrap">${r.status}</span>
  </div>`).join('')}
</div>`;
}



function rBasinMap(){
  const p1el=FP.filter(p=>p.portfolio===1&&p.oc==='eligible').length;
  const p2el=FP.filter(p=>p.portfolio===2&&p.oc==='eligible').length;

  document.getElementById('main').innerHTML=`
<div class="pt">Basin Map</div>
<div class="ps">WRC priority basins &middot; One portfolio per basin &middot; Albers Equal-Area projection</div>

<div class="basin-legend" style="margin-bottom:10px">
  <div class="bl-item"><div class="bl-dot" style="background:var(--t)"></div>P1 active — Sacramento</div>
  <div class="bl-item"><div class="bl-dot" style="background:#534AB7"></div>P2 pipeline — San Joaquin</div>
  <div class="bl-item"><div class="bl-dot" style="background:var(--tm)"></div>P3 open — Colorado River</div>
  <div class="bl-item"><div class="bl-dot" style="background:var(--am)"></div>Reserve basins</div>
  <div style="margin-left:auto;font-size:11px;color:var(--mu)">Click pins to navigate &middot; Hover for detail</div>
</div>

<div id="bmap-wrap" style="position:relative;width:100%;background:#d4e8f7;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.15)">
  <div id="bmap-loading" style="display:flex;align-items:center;justify-content:center;height:420px;font-size:13px;color:var(--mu)">
    Loading map data<span id="bmap-dots">...</span>
  </div>
  <div class="basin-tooltip" id="btip"></div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:14px">
  ${[
    {name:'Sacramento River Basin',portfolio:'P1 — ACTIVE',color:'var(--t)',projects:FP.filter(p=>p.portfolio===1&&p.oc==='eligible').length,alloc:'$165M',notes:'6 eligible · CWSRF + DWSRF · BPBM avg 763/1000 · Target close Q4 2026.',onclick:"rMain('portfolio')"},
    {name:'San Joaquin Basin',portfolio:'P2 — PIPELINE',color:'#534AB7',projects:FP.filter(p=>p.portfolio===2&&p.oc==='eligible').length,alloc:'$149M',notes:'3 eligible. Dixon, Merced, Stockton-East. 12-18 mo after P1.',onclick:''},
    {name:'Colorado River Basin',portfolio:'P3 — OPEN',color:'var(--tm)',projects:0,alloc:'Open',notes:'No projects yet. AZ, NV, CO, UT. Accepting applications.',onclick:''},
  ].map(b=>`<div class="pa-card" style="${b.onclick?'cursor:pointer':''}" onclick="${b.onclick}">
    <div class="pa-card-hdr">
      <div class="pa-card-title">${b.name}</div>
      <span style="font-size:10px;font-weight:700;padding:3px 8px;background:${b.color}22;color:${b.color};border-radius:4px;border:1px solid ${b.color}40">${b.portfolio}</span>
    </div>
    <div class="pa-card-body">
      <div style="font-size:14px;font-weight:700;color:${b.color};margin-bottom:4px">${b.projects} projects &middot; ${b.alloc}</div>
      <div style="font-size:12px;color:var(--mu)">${b.notes}</div>
    </div>
  </div>`).join('')}
</div>`;

  // Load D3 + TopoJSON from CDN and render the map
  loadBasinMapLibs();
}

function loadBasinMapLibs(){
  // Check if already loaded
  if(window.d3&&window.topojson){renderD3Map();return;}

  // Dot animation while loading
  let dots=0;
  const dotEl=document.getElementById('bmap-dots');
  const dotTimer=setInterval(()=>{if(dotEl)dotEl.textContent='...'.slice(0,++dots%4);},400);

  let loaded=0;
  function onLoad(){loaded++;if(loaded===2){clearInterval(dotTimer);renderD3Map();}}
  function onError(src){
    clearInterval(dotTimer);
    const wrap=document.getElementById('bmap-wrap');
    if(wrap)wrap.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:420px;font-size:13px;color:var(--re);padding:20px;text-align:center">Unable to load map libraries. Check your internet connection.<br><small>CDN: cdnjs.cloudflare.com</small></div>';
  }

  const s1=document.createElement('script');
  s1.src='https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
  s1.onload=onLoad; s1.onerror=()=>onError(s1.src);

  const s2=document.createElement('script');
  s2.src='https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js';
  s2.onload=onLoad; s2.onerror=()=>onError(s2.src);

  document.head.appendChild(s1);
  document.head.appendChild(s2);
}

function renderD3Map(){
  const wrap=document.getElementById('bmap-wrap');
  if(!wrap)return;
  const W=wrap.clientWidth||900;
  const H=Math.round(W*0.52);
  wrap.innerHTML='<canvas id="bmap-canvas" width="'+W+'" height="'+H+'" style="display:block;width:100%;height:auto"></canvas><div class="basin-tooltip" id="btip"></div>';

  // Basin pin definitions (lat/lng)
  const pins=[
    {id:'p1',label:'P1',sub:FP.filter(p=>p.portfolio===1&&p.oc==='eligible').length+' proj',lat:38.9,lng:-121.4,r:16,fill:'#0F6E56',text:'white',subtext:'#9FE1CB',onclick:"rMain('portfolio')",tip:'Sacramento River Basin — PORTFOLIO 1 ACTIVE · '+FP.filter(p=>p.portfolio===1&&p.oc==='eligible').length+' eligible · BPBM avg 763/1000 · WRI Tier 5'},
    {id:'p2',label:'P2',sub:'pipeline',lat:37.3,lng:-120.4,r:12,fill:'#534AB7',text:'white',subtext:'#C8C3F0',onclick:'',tip:'San Joaquin Basin — PORTFOLIO 2 PIPELINE · '+FP.filter(p=>p.portfolio===2&&p.oc==='eligible').length+' eligible'},
    {id:'p3',label:'P3',sub:'open',lat:36.1,lng:-111.5,r:12,fill:'#1D9E75',text:'white',subtext:'#9FE1CB',onclick:'',tip:'Colorado River Basin — PORTFOLIO 3 OPEN · AZ/NV/CO/UT · Accepting applications',dashed:true},
    {id:'r1',label:'R',sub:'',lat:44.8,lng:-123.0,r:8,fill:'#BA7517',text:'white',subtext:'',onclick:'',tip:'Willamette Basin — Reserve · Oregon'},
    {id:'r2',label:'R',sub:'',lat:47.6,lng:-122.4,r:8,fill:'#BA7517',text:'white',subtext:'',onclick:'',tip:'Puget Sound — Reserve · Washington'},
    {id:'r3',label:'R',sub:'',lat:32.5,lng:-106.8,r:8,fill:'#BA7517',text:'white',subtext:'',onclick:'',tip:'Rio Grande Basin — Reserve · NM/TX'},
  ];

  // Project dots for Portfolio 1
  const projDots=[
    {id:1,lat:39.15,lng:-122.0},{id:2,lat:38.45,lng:-121.35},
    {id:3,lat:39.55,lng:-121.55},{id:4,lat:39.1,lng:-121.6},
    {id:5,lat:38.95,lng:-119.95},{id:6,lat:38.98,lng:-120.95},
  ];

  const proj=d3.geoAlbersUsa().scale(W*1.25).translate([W/2,H/2]);
  const canvas=document.getElementById('bmap-canvas');
  const ctx=canvas.getContext('2d');
  const path=d3.geoPath().projection(proj).context(ctx);

  // Fetch TopoJSON US atlas
  fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
    .then(r=>r.json())
    .then(us=>{
      const states=topojson.feature(us,us.objects.states);
      const mesh=topojson.mesh(us,us.objects.states,(a,b)=>a!==b);

      // Draw ocean background
      ctx.fillStyle='#C8DCF0';
      ctx.fillRect(0,0,W,H);

      // Draw states
      ctx.beginPath();
      path(states);
      ctx.fillStyle='#EAE6D8';
      ctx.fill();

      // State borders
      ctx.beginPath();
      path(mesh);
      ctx.strokeStyle='#C8C4B4';
      ctx.lineWidth=0.7;
      ctx.stroke();

      // Outer border
      ctx.beginPath();
      path({type:'Sphere'});
      ctx.strokeStyle='#B0C8E0';
      ctx.lineWidth=1;
      ctx.stroke();

      // Draw basin highlight ellipses
      const basinHighlights=[
        {lat:38.7,lng:-121.0,rxDeg:1.8,ryDeg:2.8,fill:'rgba(15,110,86,0.15)',stroke:'#0F6E56',sw:2},
        {lat:37.2,lng:-120.2,rxDeg:1.4,ryDeg:1.8,fill:'rgba(83,74,183,0.12)',stroke:'#534AB7',sw:1.5,dash:[5,3]},
        {lat:36.0,lng:-111.5,rxDeg:3.5,ryDeg:2.4,fill:'rgba(29,158,117,0.08)',stroke:'#1D9E75',sw:1.5,dash:[5,3]},
      ];

      basinHighlights.forEach(bh=>{
        const cx=proj([bh.lng,bh.lat]);
        if(!cx)return;
        const ex=proj([bh.lng+bh.rxDeg,bh.lat]);
        const ey=proj([bh.lng,bh.lat+bh.ryDeg]);
        if(!ex||!ey)return;
        const rx=Math.abs(ex[0]-cx[0]);
        const ry=Math.abs(ey[1]-cx[1]);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx[0],cx[1],rx,ry,0,0,Math.PI*2);
        ctx.fillStyle=bh.fill;
        ctx.fill();
        ctx.strokeStyle=bh.stroke;
        ctx.lineWidth=bh.sw;
        if(bh.dash)ctx.setLineDash(bh.dash);else ctx.setLineDash([]);
        ctx.stroke();
        ctx.restore();
      });

      // Draw project dots
      projDots.forEach(pd=>{
        const fp=FP.find(p=>p.id===pd.id);
        if(!fp)return;
        const pt=proj([pd.lng,pd.lat]);
        if(!pt)return;
        const col=fp.sc>=800?'#1D9E75':fp.sc>=700?'#3B82F6':'#F0A500';
        ctx.beginPath();
        ctx.arc(pt[0],pt[1],4.5,0,Math.PI*2);
        ctx.fillStyle='white';
        ctx.fill();
        ctx.strokeStyle=col;
        ctx.lineWidth=2;
        ctx.stroke();
      });

      // Draw pins
      pins.forEach(pin=>{
        const pt=proj([pin.lng,pin.lat]);
        if(!pt)return;
        pin._px=pt[0]; pin._py=pt[1];

        // Shadow
        ctx.save();
        ctx.shadowColor='rgba(0,0,0,0.3)';
        ctx.shadowBlur=6;
        ctx.shadowOffsetY=2;
        ctx.beginPath();
        ctx.arc(pt[0],pt[1],pin.r,0,Math.PI*2);
        if(pin.dashed){ctx.setLineDash([5,2]);ctx.strokeStyle='white';ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);}
        ctx.fillStyle=pin.fill;
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle='white';
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.arc(pt[0],pt[1],pin.r,0,Math.PI*2);
        ctx.stroke();

        // Label
        ctx.fillStyle=pin.text;
        ctx.font='bold '+(pin.r>=12?9:7)+'px system-ui,sans-serif';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(pin.label,pt[0],pt[1]-(pin.sub?3:0));
        if(pin.sub&&pin.r>=12){
          ctx.font=(pin.r>=12?'6.5':'5.5')+'px system-ui,sans-serif';
          ctx.fillStyle=pin.subtext;
          ctx.fillText(pin.sub,pt[0],pt[1]+5);
        }
      });

      // Canvas click & hover handling
      canvas.style.cursor='default';
      canvas.onmousemove=function(e){
        const rect=canvas.getBoundingClientRect();
        const scaleX=canvas.width/rect.width;
        const scaleY=canvas.height/rect.height;
        const mx=(e.clientX-rect.left)*scaleX;
        const my=(e.clientY-rect.top)*scaleY;
        let hit=false;
        pins.forEach(pin=>{
          if(pin._px===undefined)return;
          const dx=mx-pin._px,dy=my-pin._py;
          if(dx*dx+dy*dy<=pin.r*pin.r*1.5){
            hit=true;
            canvas.style.cursor='pointer';
            const tip=document.getElementById('btip');
            if(tip){
              tip.textContent=pin.tip;
              tip.style.display='block';
              tip.style.left=Math.round((pin._px/canvas.width)*100)+'%';
              tip.style.top=Math.round((pin._py/canvas.height)*100-8)+'%';
            }
          }
        });
        // Check project dots
        projDots.forEach(pd=>{
          const fp=FP.find(p=>p.id===pd.id);
          if(!fp)return;
          const pt=proj([pd.lng,pd.lat]);
          if(!pt)return;
          const dx=mx-pt[0],dy=my-pt[1];
          if(dx*dx+dy*dy<=25){
            hit=true;
            canvas.style.cursor='pointer';
            const tip=document.getElementById('btip');
            if(tip){
              tip.textContent=fp.org+' · BPBM '+fp.sc+'/1000 · '+fp.ty;
              tip.style.display='block';
              tip.style.left=Math.round((pt[0]/canvas.width)*100)+'%';
              tip.style.top=Math.round((pt[1]/canvas.height)*100-8)+'%';
            }
          }
        });
        if(!hit){canvas.style.cursor='default';const tip=document.getElementById('btip');if(tip)tip.style.display='none';}
      };
      canvas.onmouseleave=function(){const tip=document.getElementById('btip');if(tip)tip.style.display='none';};
      canvas.onclick=function(e){
        const rect=canvas.getBoundingClientRect();
        const scaleX=canvas.width/rect.width;
        const scaleY=canvas.height/rect.height;
        const mx=(e.clientX-rect.left)*scaleX;
        const my=(e.clientY-rect.top)*scaleY;
        pins.forEach(pin=>{
          if(pin._px===undefined||!pin.onclick)return;
          const dx=mx-pin._px,dy=my-pin._py;
          if(dx*dx+dy*dy<=pin.r*pin.r*1.5)eval(pin.onclick);
        });
        projDots.forEach(pd=>{
          const fp=FP.find(p=>p.id===pd.id);
          if(!fp)return;
          const pt=proj([pd.lng,pd.lat]);
          if(!pt)return;
          const dx=mx-pt[0],dy=my-pt[1];
          if(dx*dx+dy*dy<=25)rMain('project-'+fp.id);
        });
      };
    })
    .catch(err=>{
      console.error('US atlas load failed:',err);
      // Fallback SVG if fetch fails
      wrap.innerHTML=renderFallbackMapSVG();
      const tip=document.createElement('div');
      tip.className='basin-tooltip';tip.id='btip';
      wrap.appendChild(tip);
    });
}

function renderFallbackMapSVG(){
  const p1el=FP.filter(p=>p.portfolio===1&&p.oc==='eligible').length;
  const p2el=FP.filter(p=>p.portfolio===2&&p.oc==='eligible').length;
  const projDots=FP.filter(p=>p.portfolio===1&&p.oc==='eligible').map((p,i)=>{
    const offsets=[[8,-24],[-10,-32],[16,-15],[-4,-13],[12,-32],[-14,-18]];
    const [ox,oy]=offsets[i]||[0,-22];
    const col=p.sc>=800?'#1D9E75':p.sc>=700?'#3B82F6':'#F0A500';
    return `<circle cx="${50+ox}" cy="${208+oy}" r="4.5" fill="white" stroke="${col}" stroke-width="2" style="cursor:pointer" onmouseenter="showTip(event,'${p.org.replace(/'/g,"&apos;")} &bull; BPBM ${p.sc}/1000')" onmouseleave="hideTip()" onclick="rMain('project-${p.id}')"/>`;
  }).join('');
  return `<svg viewBox="0 0 960 504" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%">
  <rect width="960" height="504" fill="#C8DCF0"/>
  <g fill="#E8E4D8" stroke="#C8C4B0" stroke-width="0.7">
    <polygon points="61,2 178,20 164,85 58,50 55,26"/>
    <polygon points="50,48 171,87 152,176 21,141"/>
    <polygon points="24,142 95,162 152,336 94,385 90,372 77,345 31,272 30,244 14,177"/>
    <polygon points="95,162 193,184 167,318 152,336 78,228"/>
    <polygon points="178,20 267,37 242,193 144,174 164,85"/>
    <polygon points="193,23 371,49 364,139 253,125"/>
    <polygon points="253,125 364,139 356,229 238,215"/>
    <polygon points="272,220 390,232 384,323 259,311"/>
    <polygon points="193,184 242,193 224,305 259,311 264,277 167,318"/>
    <polygon points="171,296 259,311 242,439 202,433 137,394"/>
    <polygon points="259,311 366,322 358,435 289,434 257,441 242,439"/>
    <polygon points="371,49 473,54 472,121 365,116"/><polygon points="365,116 472,121 481,190 360,184"/>
    <polygon points="360,184 491,190 503,258 388,255 356,229"/>
    <polygon points="388,255 508,258 516,326 384,323"/>
    <polygon points="366,322 520,338 521,395 419,393 419,336"/>
    <polygon points="358,435 529,406 540,485 471,496 411,460 334,430 289,434"/>
    <polygon points="473,54 590,73 554,109 482,122"/>
    <polygon points="481,178 586,175 590,241 495,244"/><polygon points="495,244 590,241 615,333 516,326"/>
    <polygon points="520,338 601,335 607,391 529,406"/><polygon points="529,406 607,391 622,448 576,435"/>
    <polygon points="539,110 630,92 639,183 579,199 569,165"/>
    <polygon points="566,199 639,183 643,320 615,326 590,280"/>
    <polygon points="633,211 678,206 686,269 639,274"/><polygon points="677,201 748,191 761,270 687,281"/>
    <polygon points="639,183 678,99 714,174 642,212"/>
    <polygon points="607,322 741,296 725,276 685,267 641,301"/>
    <polygon points="601,335 749,318 753,352 596,369"/><polygon points="572,370 634,366 628,446 576,435"/>
    <polygon points="634,366 693,360 703,424 637,445"/><polygon points="693,360 767,350 784,426 706,430 703,424"/>
    <polygon points="655,428 799,410 819,490 786,504 656,440"/>
    <polygon points="722,334 815,342 823,382 780,412 728,378"/>
    <polygon points="701,300 860,287 867,320 768,332 705,336"/>
    <polygon points="710,283 856,245 862,273 762,294 710,290"/>
    <polygon points="724,250 804,213 810,242 766,273 728,276"/><polygon points="774,219 851,211 856,232 814,242 776,230"/>
    <polygon points="835,200 848,197 856,230 842,233"/><polygon points="832,168 858,162 871,208 842,215"/>
    <polygon points="747,164 842,145 855,202 757,222"/>
    <polygon points="754,135 872,75 872,178 857,182 759,162"/>
    <polygon points="860,148 890,141 896,162 865,170"/><polygon points="889,141 902,138 906,155 893,159"/>
    <polygon points="858,128 915,113 924,143 863,148"/><polygon points="848,82 878,74 891,124 861,132"/>
    <polygon points="859,72 888,64 904,120 874,129"/><polygon points="869,18 930,0 950,97 886,116"/>
  </g>
  <g font-size="8.5" fill="#9CA3AF" font-family="sans-serif" text-anchor="middle">
    <text x="119" y="36">WA</text><text x="98" y="112">OR</text><text x="56" y="258">CA</text>
    <text x="140" y="233">NV</text><text x="205" y="122">ID</text><text x="278" y="82">MT</text>
    <text x="304" y="170">WY</text><text x="328" y="264">CO</text><text x="226" y="242">UT</text>
    <text x="206" y="358">AZ</text><text x="308" y="368">NM</text><text x="424" y="82">ND</text>
    <text x="426" y="148">SD</text><text x="429" y="214">NE</text><text x="458" y="282">KS</text>
    <text x="466" y="352">OK</text><text x="435" y="450">TX</text><text x="524" y="106">MN</text>
    <text x="535" y="204">IA</text><text x="554" y="280">MO</text><text x="566" y="358">AR</text>
    <text x="574" y="430">LA</text><text x="598" y="148">WI</text><text x="608" y="248">IL</text>
    <text x="658" y="238">IN</text><text x="718" y="232">OH</text><text x="682" y="295">KY</text>
    <text x="671" y="336">TN</text><text x="601" y="404">MS</text><text x="660" y="400">AL</text>
    <text x="729" y="392">GA</text><text x="750" y="462">FL</text><text x="773" y="380">SC</text>
    <text x="802" y="318">NC</text><text x="802" y="278">VA</text><text x="763" y="260">WV</text>
    <text x="803" y="192">PA</text><text x="820" y="140">NY</text><text x="668" y="140">MI</text>
  </g>
  <rect x="28" y="418" width="74" height="46" rx="3" fill="#E8E4D8" stroke="#C8C4B0" stroke-width="0.7"/>
  <text x="65" y="444" font-size="9" fill="#9CA3AF" font-family="sans-serif" text-anchor="middle">Alaska</text>
  <rect x="112" y="418" width="65" height="46" rx="3" fill="#E8E4D8" stroke="#C8C4B0" stroke-width="0.7"/>
  <text x="144" y="444" font-size="9" fill="#9CA3AF" font-family="sans-serif" text-anchor="middle">Hawaii</text>
  <ellipse cx="50" cy="222" rx="24" ry="42" fill="rgba(15,110,86,.16)" stroke="#0F6E56" stroke-width="2"/>
  <ellipse cx="68" cy="265" rx="20" ry="25" fill="rgba(83,74,183,.14)" stroke="#534AB7" stroke-width="1.5"/>
  <ellipse cx="215" cy="340" rx="52" ry="38" fill="rgba(29,158,117,.09)" stroke="#1D9E75" stroke-width="1.5" stroke-dasharray="5,3"/>
  ${projDots}
  <defs><filter id="ps2"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/></filter></defs>
  <g style="cursor:pointer" onclick="rMain('portfolio')" onmouseenter="showTip(event,'Sacramento River Basin — P1 ACTIVE &bull; ${p1el} eligible')" onmouseleave="hideTip()">
    <circle cx="50" cy="210" r="17" fill="#0F6E56" stroke="white" stroke-width="2.5" filter="url(#ps2)"/>
    <text x="50" y="206" font-size="9" fill="white" font-family="sans-serif" text-anchor="middle" font-weight="700">P1</text>
    <text x="50" y="217" font-size="7" fill="#9FE1CB" font-family="sans-serif" text-anchor="middle">${p1el} proj</text>
  </g>
  <g onmouseenter="showTip(event,'San Joaquin Basin — P2 PIPELINE &bull; ${p2el} eligible')" onmouseleave="hideTip()">
    <circle cx="68" cy="252" r="13" fill="#534AB7" stroke="white" stroke-width="2" filter="url(#ps2)"/>
    <text x="68" y="248" font-size="8.5" fill="white" font-family="sans-serif" text-anchor="middle" font-weight="700">P2</text>
    <text x="68" y="258" font-size="6.5" fill="#C8C3F0" font-family="sans-serif" text-anchor="middle">pipeline</text>
  </g>
  <g onmouseenter="showTip(event,'Colorado River Basin — P3 OPEN &bull; AZ/NV/CO/UT')" onmouseleave="hideTip()">
    <circle cx="215" cy="326" r="13" fill="#1D9E75" stroke="white" stroke-width="2" stroke-dasharray="5,2" filter="url(#ps2)"/>
    <text x="215" y="322" font-size="8.5" fill="white" font-family="sans-serif" text-anchor="middle" font-weight="700">P3</text>
    <text x="215" y="332" font-size="6.5" fill="#9FE1CB" font-family="sans-serif" text-anchor="middle">open</text>
  </g>
  <g onmouseenter="showTip(event,'Willamette — Reserve')" onmouseleave="hideTip()"><circle cx="38" cy="116" r="8" fill="#BA7517" stroke="white" stroke-width="1.5"/><text x="38" y="120" font-size="8" fill="white" font-family="sans-serif" text-anchor="middle" font-weight="700">R</text></g>
  <g onmouseenter="showTip(event,'Puget Sound — Reserve')" onmouseleave="hideTip()"><circle cx="47" cy="58" r="8" fill="#BA7517" stroke="white" stroke-width="1.5"/><text x="47" y="62" font-size="8" fill="white" font-family="sans-serif" text-anchor="middle" font-weight="700">R</text></g>
  <g onmouseenter="showTip(event,'Rio Grande — Reserve')" onmouseleave="hideTip()"><circle cx="308" cy="410" r="8" fill="#BA7517" stroke="white" stroke-width="1.5"/><text x="308" y="414" font-size="8" fill="white" font-family="sans-serif" text-anchor="middle" font-weight="700">R</text></g>
  <div class="basin-tooltip" id="btip"></div>
</svg>`;
}



function showTip(e,text){const t=document.getElementById('btip');t.textContent=text;t.style.display='block';const r=document.getElementById('bmap').getBoundingClientRect();t.style.left=(e.clientX-r.left+12)+'px';t.style.top=(e.clientY-r.top-36)+'px';}
function hideTip(){document.getElementById('btip').style.display='none';}

// Biodiversity credit data per project
const BIO_CREDITS={
  1:{// City of Colusa — water reuse = NBS-adjacent, riparian buffer possible
    eligible:true, standard:'PURO Biodiversity v2.1', status:'Assessment in progress',
    estCredits:'18-28', estValue:'$2,700–$4,200', pricePerCredit:'$150',
    methodology:'Water reuse + riparian corridor restoration. Reduced groundwater extraction supports natural flow regime and wetland hydrology along Sacramento River tributary.',
    ecosystemType:'Riparian / freshwater wetland', baselineYear:2025,
    cobenefits:['Reduced groundwater pumping','Habitat connectivity','Migratory bird corridor'],
    verification:'Tech B / third-party ISO accredited verifier',
    marketComps:[
      {buyer:'Corporate CDP W14',price:'$120-180/credit',notes:'TNFD-aligned, watershed-specific'},
      {buyer:'Voluntary PURO registry',price:'$140-200/credit',notes:'Freshwater biodiversity premium'},
      {buyer:'Compliance (CA AB 1757 pilot)',price:'TBD — pilot program',notes:'California biodiversity offset'},
    ]
  },
  2:{// Sacramento Area Sewer District — septic conversions, DAC
    eligible:true, standard:'PURO Biodiversity v2.1', status:'Pre-assessment',
    estCredits:'8-14', estValue:'$960–$2,100', pricePerCredit:'$120-150',
    methodology:'Septic-to-sewer conversion eliminates nutrient loading (nitrogen, phosphorus) into groundwater and surface water. Supports downstream freshwater ecosystem health in Sacramento Delta.',
    ecosystemType:'Freshwater / delta', baselineYear:2025,
    cobenefits:['Nitrogen load reduction','Delta smelt habitat quality','Disadvantaged community co-benefit'],
    verification:'Tech B MRV + third-party verifier',
    marketComps:[
      {buyer:'Corporate water stewardship',price:'$100-140/credit',notes:'Delta ecosystem premium'},
      {buyer:'PURO registry',price:'$110-150/credit',notes:'DAC project bonus'},
    ]
  },
  3:{eligible:false},4:{eligible:false},5:{eligible:false},
  6:{eligible:false},7:{eligible:false},
  // Portfolio 2 — Fresno Irrigation District (id:17): NBS-scale recycled water project
  17:{eligible:true,standard:'Verra VCS + PURO Biodiversity',status:'Pre-assessment initiated',
    estCredits:'180-360',estValue:'$36,000-$144,000',pricePerCredit:'$200-400',
    methodology:'12,000 AFY recycled water delivered to farmland restores 1,800 acres of Tulare Lake Basin riparian and seasonal wetland. Supports tricolored blackbird and Swainsonhawk habitat corridors. Measured via satellite biomass index + field verification.',
    ecosystemType:'Riparian / seasonal wetland / Central Valley',
    baselineYear:2025,acreFt:12000,wetlandAcres:1800,
    cobenefits:['Groundwater recharge','Tulare Lake watershed restoration','Tricolored blackbird nesting','Carbon sequestration (wetland soil)'],
    verification:'Verra-accredited third party + Tech B satellite MRV',
    realityCheck:'At $200M portfolio scale, bio credits generate $36K-$144K — meaningful as additionality and corporate buyer signal, not a primary capital contributor. Real value: enables $20M+ yield subsidy from CWS programs through verifiable TNFD-aligned credits.',
    marketComps:[
      {buyer:'Corporate CDP W8 / TNFD LEAP',price:'$200-400/credit',notes:'Tulare Lake Basin premium, TNFD Nature-related risk disclosure'},
      {buyer:'Verra VCS Wetland Module',price:'$250-450/credit',notes:'Soil carbon + wetland hydrology co-benefit'},
      {buyer:'CA Voluntary Wetland Mitigation (Pilot)',price:'TBD $300-600/credit',notes:'AB 1757 biodiversity offset pilot — Tulare Lake priority'},
      {buyer:'PURO Freshwater Biodiversity',price:'$180-300/credit',notes:'Recycled water delivery — first-of-type in PURO registry'},
    ]
  },
};

function getBioProjects(){
  return FP.filter(p=>p.portfolio===1&&BIO_CREDITS[p.id]&&BIO_CREDITS[p.id].eligible);
}

function rBiodiversity(){
  const bioProj=getBioProjects();
  const totalEstCredits=bioProj.reduce((s,p)=>{
    const bc=BIO_CREDITS[p.id];
    return s+parseInt((bc.estCredits||'0').split('-')[1]||'0');
  },0);
  const totalEstValue=bioProj.reduce((s,p)=>{
    const bc=BIO_CREDITS[p.id];
    const hi=parseFloat((bc.estValue||'$0').split('–')[1]?.replace(/[^0-9.]/g,'')||'0');
    return s+hi;
  },0);

  document.getElementById('main').innerHTML=`
<div class="pt">Biodiversity Credits</div>
<div class="ps">PURO Biodiversity Standard · Tech B Registry · Portfolio 1 — Sacramento River Basin</div>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">
  <div class="met"><div class="ml">Eligible projects</div><div class="mv" style="color:var(--t)">${bioProj.length}</div><div class="ms">of ${FP.filter(p=>p.portfolio===1).length} Portfolio 1</div></div>
  <div class="met"><div class="ml">Est. total credits</div><div class="mv">Up to ${totalEstCredits}</div><div class="ms">PURO Biodiversity credits</div></div>
  <div class="met"><div class="ml">Est. market value</div><div class="mv" style="color:var(--t)">Up to $${(totalEstValue/1000).toFixed(0)}K</div><div class="ms">At current market comps</div></div>
  <div class="met"><div class="ml">Registry</div><div class="mv" style="font-size:14px">Tech B</div><div class="ms">PURO standard · on-chain</div></div>
</div>

<div class="ib it" style="margin-bottom:16px">
  <strong>Single-basin advantage for biodiversity:</strong> Because Portfolio 1 covers only the Sacramento River Basin, biodiversity credits map to a specific watershed with known stress, ecosystem type, and habitat baseline. This specificity commands a market premium and supports TNFD LEAP assessments at the watershed level.
</div>

${bioProj.map(p=>{
  const bc=BIO_CREDITS[p.id];
  return `
<div class="bio-card" style="margin-bottom:16px;padding:16px">
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px">
    <div>
      <div style="font-size:15px;font-weight:700;color:var(--tx)">${p.org}</div>
      <div style="font-size:12px;color:var(--mu)">${p.ty} · ${p.ts&&p.ts.ci||p.ba} · BPBM ${p.sc}/1000</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:20px;font-weight:800;color:var(--t)">${bc.estCredits}</div>
      <div style="font-size:10px;color:var(--fa)">est. PURO credits</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
    <div class="rf"><div class="rfl">Standard</div><div class="rfv" style="font-size:12px">${bc.standard}</div></div>
    <div class="rf"><div class="rfl">Status</div><div class="rfv ${bc.status.includes('progress')?'a':bc.status.includes('Pre')?'':'g'}" style="font-size:12px">${bc.status}</div></div>
    <div class="rf"><div class="rfl">Est. market value</div><div class="rfv g">${bc.estValue}</div></div>
    <div class="rf"><div class="rfl">Est. price/credit</div><div class="rfv">${bc.pricePerCredit}</div></div>
    <div class="rf"><div class="rfl">Ecosystem type</div><div class="rfv" style="font-size:12px">${bc.ecosystemType}</div></div>
    <div class="rf"><div class="rfl">Verification</div><div class="rfv" style="font-size:11px">${bc.verification}</div></div>
  </div>

  <div style="margin-bottom:10px">
    <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Methodology</div>
    <div style="font-size:12px;color:var(--tx);line-height:1.6">${bc.methodology}</div>
  </div>

  <div style="margin-bottom:10px">
    <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Co-benefits</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${bc.cobenefits.map(cb=>`<span style="background:var(--tl);color:var(--td);border-radius:5px;padding:3px 8px;font-size:11px;font-weight:600">${cb}</span>`).join('')}
    </div>
  </div>

  <div>
    <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px">Market price comparables</div>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr>
        <th style="text-align:left;padding:6px 10px;background:var(--grl);font-size:11px;border-bottom:2px solid var(--t)">Buyer type</th>
        <th style="text-align:left;padding:6px 10px;background:var(--grl);font-size:11px;border-bottom:2px solid var(--t)">Price range</th>
        <th style="text-align:left;padding:6px 10px;background:var(--grl);font-size:11px;border-bottom:2px solid var(--t)">Notes</th>
      </tr></thead>
      <tbody>
        ${bc.marketComps.map(mc=>`<tr>
          <td style="padding:7px 10px;border-bottom:1px solid var(--bo);font-size:12px;font-weight:600">${mc.buyer}</td>
          <td style="padding:7px 10px;border-bottom:1px solid var(--bo);font-size:12px;color:var(--t);font-weight:700">${mc.price}</td>
          <td style="padding:7px 10px;border-bottom:1px solid var(--bo);font-size:11px;color:var(--mu)">${mc.notes}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div style="margin-top:12px;display:flex;gap:8px">
    <button class="tspb" onclick="openBioCreditTS(${p.id})">📋 Bio credit tear sheet</button>
    <button class="hb" onclick="rMain('project-${p.id}')">Project detail →</button>
  </div>
</div>`;
}).join('')}

${FP.filter(p=>p.portfolio===1&&(!BIO_CREDITS[p.id]||!BIO_CREDITS[p.id].eligible)).map(p=>`
<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--bo);border-radius:8px;margin-bottom:8px;opacity:0.7">
  <div style="font-size:20px">🔘</div>
  <div style="flex:1">
    <div style="font-size:13px;font-weight:600">${p.org}</div>
    <div style="font-size:11px;color:var(--mu)">${p.ty} — No biodiversity credit pathway identified for this project type</div>
  </div>
  <span class="badge bg" style="font-size:10px">Not eligible</span>
</div>`).join('')}`;
}

function openBioCreditTS(id){
  const p=FP.find(x=>x.id===id);
  const bc=BIO_CREDITS[id];
  if(!p||!bc||!bc.eligible)return;
  document.getElementById('tsmt').textContent=p.org+' — Biodiversity Credit Summary';
  document.getElementById('tsbd').innerHTML=`
<div style="padding:16px 20px">
  <div style="font-size:16px;font-weight:700;margin-bottom:4px">${p.org}</div>
  <div style="font-size:12px;color:var(--mu);margin-bottom:16px">${p.ty} · ${p.ts&&p.ts.ci||p.ba} · Portfolio 1 · Sacramento River Basin</div>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
    <div class="rf"><div class="rfl">Standard</div><div class="rfv" style="font-size:12px">${bc.standard}</div></div>
    <div class="rf"><div class="rfl">Est. credits</div><div class="rfv g">${bc.estCredits}</div></div>
    <div class="rf"><div class="rfl">Est. value</div><div class="rfv g">${bc.estValue}</div></div>
    <div class="rf"><div class="rfl">Price / credit</div><div class="rfv">${bc.pricePerCredit}</div></div>
    <div class="rf"><div class="rfl">Ecosystem</div><div class="rfv" style="font-size:12px">${bc.ecosystemType}</div></div>
    <div class="rf"><div class="rfl">Status</div><div class="rfv a" style="font-size:12px">${bc.status}</div></div>
  </div>

  <div style="margin-bottom:12px;padding:10px 14px;background:var(--grl);border-radius:8px">
    <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">Methodology</div>
    <div style="font-size:13px;line-height:1.6">${bc.methodology}</div>
  </div>

  <div style="margin-bottom:12px">
    <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Market pricing context</div>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr>
        <th style="text-align:left;padding:6px;background:var(--grl);font-size:11px;border-bottom:2px solid var(--t)">Buyer type</th>
        <th style="text-align:left;padding:6px;background:var(--grl);font-size:11px;border-bottom:2px solid var(--t)">Price range</th>
        <th style="text-align:left;padding:6px;background:var(--grl);font-size:11px;border-bottom:2px solid var(--t)">Notes</th>
      </tr></thead>
      <tbody>${bc.marketComps.map(mc=>`<tr>
        <td style="padding:6px;border-bottom:1px solid var(--bo);font-size:12px">${mc.buyer}</td>
        <td style="padding:6px;border-bottom:1px solid var(--bo);font-size:13px;font-weight:700;color:var(--t)">${mc.price}</td>
        <td style="padding:6px;border-bottom:1px solid var(--bo);font-size:11px;color:var(--mu)">${mc.notes}</td>
      </tr>`).join('')}</tbody>
    </table>
  </div>

  <div style="padding:10px 14px;background:var(--tl);border-radius:8px;font-size:11px;color:var(--td)">
    <strong>Registry:</strong> Credits issued on Tech B Ledger (PURO Biodiversity Standard). On-chain provenance. Immutable. Retirement recorded for TNFD / CSRD disclosure. Co-benefits verified annually by ISO-accredited third party.
  </div>
</div>`;
  document.getElementById('tso').classList.add('op');
}



function rAttribution(){
  if(!window.attrPortfolio) window.attrPortfolio=1;
  const portNum=window.attrPortfolio;
  const portLabel=portNum===1?'Sacramento River Basin':'San Joaquin Basin';
  const portEl=FP.filter(p=>p.portfolio===portNum&&p.oc==='eligible');
  const portTotal=portEl.reduce((s,p)=>{return s+(parseFloat((p.ts&&p.ts.co||'$5M').replace(/[^0-9.]/g,''))||5);},0);
  const impactTarget=portTotal*0.10; // 10% of portfolio
  const impactMax=portTotal*0.25;    // 25% max

  const sponsors=[
    {name:'Microsoft',logo:'🖥',color:'#00A4EF',commit:2.0,water:'22.1M gal/yr',ghg:'93 tCO2e',cdp:true,gri:true,tnfd:false,port:1,projects:[1,6],status:'confirmed',contact:'achen@microsoft.com'},
    {name:'Google Water Pledge',logo:'🔍',color:'#4285F4',commit:1.5,water:'16.6M gal/yr',ghg:'70 tCO2e',cdp:true,gri:true,tnfd:false,port:1,projects:[1,5],status:'confirmed',contact:'water@google.com'},
    {name:'Unilever',logo:'🧴',color:'#1F36C7',commit:0.5,water:'5.5M gal/yr',ghg:'24 tCO2e',cdp:false,gri:true,tnfd:false,port:1,projects:[2],status:'confirmed',contact:'sustainability@unilever.com'},
  ];

  // Sales pipeline — prospects not yet committed
  const pipeline=[
    {name:'Meta — Water Replenishment Program',logo:'📘',color:'#0866FF',estCommit:3.0,port:1,stage:'In discussion',note:'Q2 2026 — CDP W8 target alignment confirmed. Finalizing commitment amount.',projects:[3,13]},
    {name:'Amazon — Water Positive',logo:'📦',color:'#FF9900',estCommit:5.0,port:1,stage:'Prospectus review',note:'Reviewing P1 Impact Prospectus. Internal ESG approval pending.',projects:[14,4]},
    {name:'Intel — Water Restoration Pledge',logo:'💻',color:'#0071C5',estCommit:2.5,port:1,stage:'Expression of interest',note:'EOI received Apr 2026. NDA executed. Data room access granted.',projects:[5,15]},
    {name:'Cargill — Water Stewardship',logo:'🌾',color:'#005596',estCommit:4.0,port:1,stage:'Initial outreach',note:'Contacted Mar 2026. Connected via WRC Sacramento Basin working group.',projects:[1,2]},
  ];
  const portSponsors=sponsors.filter(s=>s.port===portNum);
  const portPipeline=pipeline.filter(p=>p.port===portNum);
  const confirmedTotal=portSponsors.reduce((s,sp)=>s+sp.commit,0);
  const pipelineTotal=portPipeline.reduce((s,p)=>s+p.estCommit,0);
  const gap=impactTarget-confirmedTotal;
  const pct=Math.round(confirmedTotal/impactTarget*100);
  const stageColors={'confirmed':'var(--t)','In discussion':'var(--bl)','Prospectus review':'#534AB7','Expression of interest':'var(--am)','Initial outreach':'var(--fa)'};

  document.getElementById('main').innerHTML=`
<div class="pt">Impact Capital Attribution</div>
<div class="ps">Tech B Attribution Engine · Portfolio-scoped · CDP/GRI/TNFD · Sales pipeline</div>

<div style="display:flex;gap:10px;margin-bottom:16px">
  <button onclick="window.attrPortfolio=1;rAttribution()" style="padding:6px 16px;border-radius:7px;border:2px solid ${portNum===1?'var(--t)':'var(--bo)'};background:${portNum===1?'var(--tl)':'transparent'};color:${portNum===1?'var(--td)':'var(--mu)'};cursor:pointer;font-size:12px;font-weight:${portNum===1?700:400}">Portfolio 1 — Sacramento</button>
  <button onclick="window.attrPortfolio=2;rAttribution()" style="padding:6px 16px;border-radius:7px;border:2px solid ${portNum===2?'#534AB7':'var(--bo)'};background:${portNum===2?'#F0EEFF':'transparent'};color:${portNum===2?'#534AB7':'var(--mu)'};cursor:pointer;font-size:12px;font-weight:${portNum===2?700:400}">Portfolio 2 — San Joaquin</button>
</div>

${portNum===2?`<div class="ib ia">Portfolio 2 Impact outreach begins after Portfolio 1 close. No attribution data yet.</div>`:`

<!-- Gap analysis strip -->
<div style="background:var(--wh);border:2px solid ${gap<=0?'var(--t)':'var(--am)'};border-radius:10px;padding:14px 18px;margin-bottom:18px">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
    <div style="font-size:14px;font-weight:700">Impact Capital Gap Analysis — Portfolio ${portNum}</div>
    <span class="badge ${gap<=0?'bt':'ba'}">${gap<=0?'Target met':'Gap remaining'}</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:12px">
    <div class="met"><div class="ml">Portfolio size</div><div class="mv">$${portTotal.toFixed(0)}M</div></div>
    <div class="met"><div class="ml">Impact target (10%)</div><div class="mv" style="color:var(--t)">$${impactTarget.toFixed(1)}M</div></div>
    <div class="met"><div class="ml">Impact max (25%)</div><div class="mv">$${impactMax.toFixed(1)}M</div></div>
    <div class="met"><div class="ml">Confirmed</div><div class="mv" style="color:var(--t)">$${confirmedTotal.toFixed(1)}M</div><div class="ms">${pct}% of 10% target</div></div>
    <div class="met"><div class="ml">Gap to 10% target</div><div class="mv" style="color:${gap<=0?'var(--t)':'var(--re)'}">$${Math.max(0,gap).toFixed(1)}M</div><div class="ms">${gap<=0?'Fully subscribed':'Needs closing'}</div></div>
  </div>
  <div style="height:12px;background:var(--bo);border-radius:6px;overflow:hidden;margin-bottom:6px">
    <div style="height:12px;width:${Math.min(pct,100)}%;background:${pct>=100?'var(--t)':'var(--am)'};border-radius:6px;transition:width .4s"></div>
  </div>
  <div style="font-size:11px;color:var(--mu)">$${confirmedTotal.toFixed(1)}M confirmed + $${pipelineTotal.toFixed(1)}M pipeline = $${(confirmedTotal+pipelineTotal).toFixed(1)}M total potential vs $${impactTarget.toFixed(1)}M minimum target</div>
</div>

<!-- Confirmed sponsors -->
<div class="s5-section" style="margin-top:0">Confirmed impact investors (${portSponsors.length})</div>
${portSponsors.map(s=>{
  const projNames=s.projects.map(id=>{const p=FP.find(x=>x.id===id);return p?p.org.split('—')[0].split(' — ')[0].trim().split(' ').slice(0,3).join(' '):'—';});
  return `<div class="cws-sponsor-card">
  <div class="cws-sp-hdr">
    <div class="cws-sp-logo" style="background:${s.color}20;font-size:20px">${s.logo}</div>
    <div><div class="cws-sp-name">${s.name}</div><div class="cws-sp-sub">${s.contact}</div><div style="font-size:11px;color:var(--mu);margin-top:2px">Projects: ${projNames.join(', ')}</div></div>
    <div class="cws-sp-commit"><div class="cws-sp-amt">$${s.commit.toFixed(1)}M</div><div class="cws-sp-aml" style="color:var(--t)">Confirmed</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px">
    <div class="rf"><div class="rfl">Water attributed</div><div class="rfv g">${s.water}</div></div>
    <div class="rf"><div class="rfl">GHG</div><div class="rfv">${s.ghg}/yr</div></div>
    <div class="rf"><div class="rfl">Status</div><div class="rfv g">Confirmed</div></div>
  </div>
  <div class="attr-framework-row"><div class="attr-fw-badge" style="background:#E6F1FB;color:#185FA5">CDP Water</div><div class="attr-fw-field">W4 · W8 · W11</div><div class="attr-fw-val">${s.water} verified</div><div class="attr-fw-status ${s.cdp?'bt':'ba'}">${s.cdp?'Packet ready':'In progress'}</div></div>
  <div class="attr-framework-row"><div class="attr-fw-badge" style="background:#EAF3DE;color:#27500A">GRI 303</div><div class="attr-fw-field">303-1 · 303-3 · 303-4</div><div class="attr-fw-val">Interaction confirmed</div><div class="attr-fw-status ${s.gri?'bt':'ba'}">${s.gri?'Confirmed':'Pending'}</div></div>
  <div class="attr-framework-row"><div class="attr-fw-badge" style="background:#EEEDFE;color:#534AB7">TNFD</div><div class="attr-fw-field">LEAP approach</div><div class="attr-fw-val">Pending NBS data</div><div class="attr-fw-status ${s.tnfd?'bt':'ba'}">${s.tnfd?'Ready':'Pending'}</div></div>
</div>`;}).join('')}

<!-- Sales pipeline -->
<div class="s5-section">Impact investor pipeline (${portPipeline.length} prospects — $${pipelineTotal.toFixed(1)}M potential)</div>
${portPipeline.map(p=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--bo);border-radius:8px;margin-bottom:8px;background:var(--wh)">
  <div style="font-size:22px">${p.logo}</div>
  <div style="flex:1">
    <div style="font-size:13px;font-weight:600">${p.name}</div>
    <div style="font-size:11px;color:var(--mu);margin-top:2px">${p.note}</div>
  </div>
  <div style="text-align:right;min-width:100px">
    <div style="font-size:13px;font-weight:700;color:var(--bl)">$${p.estCommit.toFixed(1)}M</div>
    <div style="font-size:10px;color:var(--fa)">est. commitment</div>
  </div>
  <span class="badge ba" style="font-size:10px;min-width:120px;text-align:center;background:${stageColors[p.stage]||'var(--bo)'}22;color:${stageColors[p.stage]||'var(--mu)'};border-color:${stageColors[p.stage]||'var(--bo)'}40">${p.stage}</span>
</div>`).join('')}

<div class="ib it" style="margin-top:4px"><strong>Attribution methodology:</strong> Tech B Attribution Engine allocates verified Sacramento Basin water outcomes proportionally to each investor's financial share per project. CDP W-series packets generated automatically. Investors in multiple portfolios receive separate attribution packets per portfolio.</div>
`}`;
}


function rReports(){
  // Impact investors get a different reports view
  if(CU&&CU.role==='impact_capital'){rImpactReports();return;}
  // Admin/utility reports below:
  document.getElementById('main').innerHTML=`
<div class="pt">CDP / Blue Bond Reports</div>
<div class="ps">Annual reporting · Kestrel SPO · ICMA GBP · CBI Water Criteria · EMMA</div>
<div class="s5-grid-4">
  <div class="met"><div class="ml">Kestrel SPO</div><div class="mv" style="color:var(--am)">In review</div><div class="ms">Blue Bond designation</div></div>
  <div class="met"><div class="ml">KBRA rating</div><div class="mv" style="color:var(--am)">Pending</div><div class="ms">Pool-level IG equiv.</div></div>
  <div class="met"><div class="ml">EMMA posting</div><div class="mv" style="color:var(--t)">1 report</div><div class="ms">Colusa Year 1</div></div>
  <div class="met"><div class="ml">CDP packets</div><div class="mv" style="color:var(--bl)">2 ready</div><div class="ms">For sponsors</div></div>
</div>

<div class="report-card">
  <div class="report-hdr">
    <div class="report-icon" style="background:#E6F1FB">🏅</div>
    <div><div class="report-title">Kestrel Blue Bond Second Party Opinion (SPO)</div><div class="report-sub">Blue Bond methodology · January 2026 · SDG 6 and 14 alignment</div></div>
    <div class="report-status"><span class="badge ba">In review — 60-90 day process</span></div>
  </div>
  <div class="report-body">
    <div class="report-field-grid">
      <div class="rf"><div class="rfl">Green bond framework submitted</div><div class="rfv g">Yes — bond counsel drafted</div></div>
      <div class="rf"><div class="rfl">Data room access granted</div><div class="rfv g">Verifier RBAC role active</div></div>
      <div class="rf"><div class="rfl">SDG 6 alignment</div><div class="rfv g">Clean water and sanitation — confirmed</div></div>
      <div class="rf"><div class="rfl">SDG 14 alignment</div><div class="rfv a">Life below water — NBS projects only</div></div>
      <div class="rf"><div class="rfl">ICMA GBP use of proceeds</div><div class="rfv g">Water and wastewater infrastructure</div></div>
      <div class="rf"><div class="rfl">CBI Water Criteria</div><div class="rfv g">Climate Bonds Standard v4 alignment</div></div>
    </div>
    <div class="s5-section" style="margin-top:0">SPO compliance checklist</div>
    ${[
      {c:'pass',l:'Use of proceeds — eligible water infrastructure categories',n:'All 6 project types confirmed eligible per CBI Water Criteria'},
      {c:'pass',l:'Process for project evaluation and selection',n:'WaterFundable + Tech A scoring methodology documented'},
      {c:'pass',l:'Management of proceeds — escrow and drawdown structure',n:'Trustee escrow with engineer certification release'},
      {c:'pass',l:'Reporting — annual impact metrics plan',n:'Tech B MRV annual report + EMMA posting workflow confirmed'},
      {c:'pending',l:'Do-no-harm environmental screening',n:'NEPA/CEQA screening field added to Tech A — review pending'},
      {c:'pending',l:'SDG 14 biodiversity component',n:'Fresno NBS PURO assessment in progress'},
    ].map(r=>`<div class="compliance-row"><div class="compliance-check ${r.c}">${r.c==='pass'?'✓':r.c==='fail'?'✗':'~'}</div><div><div class="compliance-label">${r.l}</div><div class="compliance-note">${r.n}</div></div></div>`).join('')}
  </div>
</div>

<div class="report-card">
  <div class="report-hdr">
    <div class="report-icon" style="background:var(--grl)">📊</div>
    <div><div class="report-title">Annual Bond Impact Report — Year 1</div><div class="report-sub">Colusa County Water District · Tech B verified · Posted to EMMA Mar 2026</div></div>
    <div class="report-status"><span class="badge bt">Published</span><button class="dl-btn" style="margin-left:8px">⬇ Download PDF</button></div>
  </div>
  <div class="report-body">
    <div class="report-field-grid">
      <div class="rf"><div class="rfl">Water secured</div><div class="rfv g">44.2M gal/yr — Tech B MRV verified</div></div>
      <div class="rf"><div class="rfl">GHG reduced</div><div class="rfv g">187 tCO2e/yr — Tech B MRV verified</div></div>
      <div class="rf"><div class="rfl">WASH beneficiaries</div><div class="rfv">8,400 people with reliable access</div></div>
      <div class="rf"><div class="rfl">NRW improvement</div><div class="rfv g">22% → 14% (8 percentage points)</div></div>
      <div class="rf"><div class="rfl">Financial coverage</div><div class="rfv">DSCR 1.62x — above covenant</div></div>
      <div class="rf"><div class="rfl">Impact Capital grant disbursed</div><div class="rfv g">$210K milestone 1 — verified</div></div>
    </div>
  </div>
</div>

<div class="report-card">
  <div class="report-hdr">
    <div class="report-icon" style="background:#E6F1FB">💧</div>
    <div><div class="report-title">CDP Water Disclosure Packets</div><div class="report-sub">W4 · W8 · W11 · Annual corporate sponsor attribution · Tech B Attribution Engine</div></div>
    <div class="report-status"><span class="badge bb">2 packets ready</span></div>
  </div>
  <div class="report-body">
    <div class="report-field-grid">
      <div class="rf"><div class="rfl">W4 — Water risks</div><div class="rfv b">Basin stress mitigation — Sacramento River Tier 5</div></div>
      <div class="rf"><div class="rfl">W8 — Replenishment target</div><div class="rfv g">44.2M gal/yr toward WRC basin target</div></div>
      <div class="rf"><div class="rfl">W11 — Stewardship programs</div><div class="rfv g">WaterFundable Impact program documented</div></div>
      <div class="rf"><div class="rfl">Verification standard</div><div class="rfv">WRI VWBA · Tech B MRV</div></div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="dl-btn">⬇ Microsoft CDP packet</button>
      <button class="dl-btn">⬇ Google CDP packet</button>
      <button class="dl-btn">⬇ Unilever CDP packet (draft)</button>
    </div>
  </div>
</div>

<div class="report-card">
  <div class="report-hdr">
    <div class="report-icon" style="background:var(--aml)">🏦</div>
    <div><div class="report-title">KBRA Rating Package</div><div class="report-sub">Pool-level DSCR · Fitch FAST stress test · Investment grade equivalent target</div></div>
    <div class="report-status"><span class="badge ba">Pending — data package in preparation</span></div>
  </div>
  <div class="report-body">
    <div class="report-field-grid">
      <div class="rf"><div class="rfl">Pool DSCR (weighted avg)</div><div class="rfv a">1.62x — above 1.20x floor (BPBM Pillar 1 avg 183/250)</div></div>
      <div class="rf"><div class="rfl">Fitch FAST stress scenario</div><div class="rfv a">Preparing with Raftelis/PFM</div></div>
      <div class="rf"><div class="rfl">Reserve account</div><div class="rfv">$20M Impact reserve — 10%</div></div>
      <div class="rf"><div class="rfl">Legal opinions</div><div class="rfv a">Bond counsel — in progress</div></div>
      <div class="rf"><div class="rfl">Target rating tier</div><div class="rfv">Investment grade equivalent (Baa)</div></div>
      <div class="rf"><div class="rfl">Est. rating timeline</div><div class="rfv">60-90 days from data submission</div></div>
    </div>
  </div>
</div>`;
}




function advanceDealStage(id, newStage) {
  const fp = FP.find(p=>p.id===id);
  if (fp) {
    const oldStage = fp.st;
    fp.st = newStage;
    if (!pH[id]) pH[id] = [];
    pH[id].unshift({
      type:'Stage advance',
      detail:`${SL[oldStage]||oldStage} → ${SL[newStage]||newStage}`,
      by: CU.name,
      ts: new Date().toLocaleString()
    });
  }
  // Refresh current view
  rDealFlow();
}

function rDealFlow(){
  // Portfolio selector
  if(!window.dfPortfolio) window.dfPortfolio=1;
  const portNum=window.dfPortfolio;
  const portLabel=portNum===1?'Portfolio 1 — Sacramento River Basin':'Portfolio 2 — San Joaquin Basin';
  const allPortfolioProjects=FP.filter(p=>p.portfolio===portNum);
  const eligible=allPortfolioProjects.filter(p=>p.oc==='eligible');
  const total=eligible.reduce((s,p)=>{const c=parseFloat((p.ts&&p.ts.co||'$5M').replace(/[^0-9.]/g,''))||5;return s+c;},0);

  // Current portfolio stage = max stage across eligible projects
  const stageIdx=p=>STAGE_ORDER.indexOf(p.st);
  const maxIdx=eligible.reduce((mx,p)=>Math.max(mx,stageIdx(p)),0);
  const curStage=STAGE_ORDER[maxIdx];
  const curMeta=STAGE_META[curStage]||{};

  // Stage task definitions
  const STAGE_TASKS={
    wizard_complete:{
      status:'Pre-screening complete',
      tasks:['Utility completes 8-min wizard','Instant BPBM pre-screen score generated','Wizard submission reviewed for basin eligibility','Advisor assigned if eligible'],
      nextGate:'Tech A full application portal invite sent',
      actor:'WaterFundable / Utility'
    },
    tech_a_intake:{
      status:'Full application in progress',
      tasks:['Utility uploads T1/T2/T3/T4 documents via Tech A','Audited financials (3yr) — required','Engineering report (feasibility level) — required','SRF IUP listing confirmation — required','Rate study and debt schedule — required'],
      nextGate:'All T1 documents uploaded and verified',
      actor:'Utility (primary) / WaterFundable (review)'
    },
    under_review:{
      status:'7-gate review in progress',
      tasks:['Gate 1: Licensed operator or credible plan — verified','Gate 2: Basin within WRC priority list — confirmed','Gate 3: Project cost $1M-$100M — confirmed','Gate 4: ≥3 years audited financials — uploading','Gate 5: Engineering report verified by PE — in review','Gate 6: No active regulatory enforcement — clear','Gate 7: Legal authority to borrow — pending resolution'],
      nextGate:'All 7 gates pass → BPBM full score calculation begins',
      actor:'WaterFundable underwriting team'
    },
    verified:{
      status:'BPBM score verified and delivered',
      tasks:['7-pillar BPBM score calculated (1,000-pt)','Rating equivalent assigned (BBB+ / A / TA)','Score report delivered to utility','Gap analysis for any pillar deficiencies','Guarantor pathway outlined if score 500-699','Portfolio assembly algorithm run — project queued'],
      nextGate:'Data room formally locked with verifier sign-off',
      actor:'WaterFundable + Raftelis / Fitch comparables'
    },
    data_room_locked:{
      status:'Data room locked — verifier sign-off obtained',
      tasks:['All T1-T4 documents uploaded and classified','Third-party verifier engaged (ISO-accredited)','Tech B MRV monitoring plan executed','Verifier signs off on data room completeness','Data room access locked to WaterFundable + bond counsel','NDA executed with prospective investors'],
      nextGate:'Portfolio assembly complete → Impact Prospectus drafted',
      actor:'WaterFundable + third-party verifier'
    },
    portfolio_queue:{
      status:'In portfolio assembly queue — contracting in progress',
      tasks:['Portfolio offer issued to all eligible utilities (BPBM score + terms)','MOU acknowledgments collected via utility portal or direct execution','Participation Agreement dispatched by bond counsel to each utility legal team','Executed agreements returned and logged','Guarantor placement confirmed for any 500-699 projects','Single-basin portfolio rule confirmed','Portfolio diversification and credit profile reviewed','Total portfolio size verified ($200M+ target)','KBRA shadow rating analysis initiated based on committed utilities'],
      nextGate:'All Participation Agreements executed → Impact Prospectus issued',
      actor:'WaterFundable deal team + bond counsel'
    },
    impact_prospectus:{
      status:'Impact Prospectus issued to investors',
      tasks:['Impact Prospectus document drafted (project summaries, scores, water data)','BPBM scorecards included per project','Basin stress data (WRI Aqueduct Tier 5) documented','Biodiversity credit pathway disclosed for eligible projects','Prospectus distributed to pre-qualified Impact investors','NDA and data room access granted per investor tier','Investor Q&A period: 30 days'],
      nextGate:'Impact pledge commitments collected → Pledge confirmed',
      actor:'WaterFundable + Impact investors'
    },
    impact_pledge:{
      status:'Impact pledge collection in progress',
      tasks:['Impact investors review prospectus and select projects','Annual vs. lump-sum pledge structure confirmed per investor','LOI / MOU exhibits generated and executed','Biodiversity credit purchase commitments recorded','Yield subsidy total calculated for underwriting','Pledge amounts incorporated into financial capacity model','Target: $20M impact capital on $200M portfolio (10%)'],
      nextGate:'Pledges confirmed → Bio credit process initiated (if applicable)',
      actor:'Impact investors + WaterFundable'
    },
    bio_credit_process:{
      status:'Biodiversity credit process underway',
      tasks:['Eligible projects identified (NBS-adjacent, riparian, reuse)','PURO Biodiversity v2.1 or Verra VCS standard selected','Baseline ecological assessment initiated (field + satellite)','Tech B satellite MRV layer activated for eligible sites','ISO-accredited third-party verifier contracted','Credit registry entry drafted on Tech B Ledger','Bio credit prospectus issued to interested buyers','Market comps assembled for pricing ($180-450/credit)'],
      nextGate:'Credits issued and registered → Bond Prospectus finalized',
      actor:'WaterFundable + Tech B + Verra/PURO verifier'
    },
    bond_prospectus:{
      status:'Bond Prospectus in preparation',
      tasks:['Bond counsel drafts Official Statement / PPM framework','ICMA Green Bond Principles alignment memo completed','CBI Water Criteria self-labeling completed','Kestrel Blue Bond Second-Party Opinion engaged','KBRA shadow rating finalized (target BBB+)','144A Rule private placement documentation drafted','Trust indenture framework drafted with trustee','Legal opinion chain initiated: issuer, securities, bond counsel'],
      nextGate:'Bond Prospectus finalized → PPM / POM issued to B/D',
      actor:'Bond counsel + WaterFundable + KBRA + Kestrel'
    },
    ppm_issued:{
      status:'PPM / POM issued',
      tasks:['Preliminary Placement Memorandum issued to broker-dealer','All legal opinions attached','KBRA rating letter attached','Kestrel SPO attached','Financial model with blended rate finalized','144A qualified purchaser verification process outlined','B/D engagement letter executed'],
      nextGate:'B/D due diligence begins',
      actor:'Bond counsel + Broker-dealer'
    },
    bd_due_diligence:{
      status:'Broker-dealer due diligence in progress',
      tasks:['B/D management call with WaterFundable team','Individual utility due diligence packages reviewed','DSCR verification per project (target ≥1.50x)','Operator qualification verified','Environmental clearance docs reviewed','Comfort letter from bond counsel issued','QIB purchaser list compiled and verified'],
      nextGate:'B/D sign-off → Pricing and allocation',
      actor:'Broker-dealer + bond counsel'
    },
    pricing_allocation:{
      status:'Pricing and allocation in progress',
      tasks:['Investor roadshow (QIB) — 5 days','Pricing determined (single rate, one bond)','QIB allocation finalized (75-90% of offering)','Impact investor allocation confirmed (10-25%)','Oversubscription management protocol executed','Final term sheet issued'],
      nextGate:'All allocations confirmed → Bond close',
      actor:'Broker-dealer + WaterFundable'
    },
    bond_close:{
      status:'Bond closing in progress',
      tasks:['Closing conditions checklist complete','All legal opinions delivered and dated','Trust indenture executed','Funds wired to trustee','Grant disbursement schedule activated','Utility drawdown schedule established','EMMA filing completed','144A closing memorandum executed'],
      nextGate:'Trust admin handoff',
      actor:'Trustee + bond counsel + WaterFundable'
    },
    trust_admin_handoff:{
      status:'Handoff to Trust Administrator',
      tasks:['Trust administrator engagement letter executed','Drawdown schedule transferred to trust','Annual reporting calendar established','MRV data feed from Tech B activated','Compliance reporting templates issued to utilities','First annual impact report scheduled (12 months post-close)'],
      nextGate:'Bond active — MRV and compliance begins',
      actor:'Trust administrator + WaterFundable'
    },
    bond_active:{
      status:'Bond active — MRV and compliance running',
      tasks:['Quarterly drawdown disbursements per schedule','Tech B annual MRV report generated','CDP attribution packets issued to Impact investors','EMMA annual filing updated','Compliance certificates from each utility (annual)','Kestrel SPO renewal (year 3)','Portfolio health dashboard maintained'],
      nextGate:'Ongoing — bond term (typically 10-20 years)',
      actor:'Trust administrator + Tech B + utilities'
    },
  };

  const curTasks=STAGE_TASKS[curStage]||{tasks:['Stage data loading...'],nextGate:'—',actor:'—',status:'—'};

  document.getElementById('main').innerHTML=`
<div class="pt">Deal Flow</div>
<div class="ps">Full 16-stage workflow · Portfolio management · Task tracking</div>

<!-- Portfolio selector -->
<div style="display:flex;gap:10px;margin-bottom:16px;align-items:center">
  <div style="font-size:12px;font-weight:600;color:var(--mu)">Portfolio:</div>
  <button onclick="window.dfPortfolio=1;rDealFlow()" style="padding:6px 16px;border-radius:7px;border:2px solid ${portNum===1?'var(--t)':'var(--bo)'};background:${portNum===1?'var(--tl)':'transparent'};color:${portNum===1?'var(--td)':'var(--mu)'};cursor:pointer;font-size:12px;font-weight:${portNum===1?700:400}">Portfolio 1 — Sacramento $${total.toFixed(0)}M</button>
  <button onclick="window.dfPortfolio=2;rDealFlow()" style="padding:6px 16px;border-radius:7px;border:2px solid ${portNum===2?'#534AB7':'var(--bo)'};background:${portNum===2?'#F0EEFF':'transparent'};color:${portNum===2?'#534AB7':'var(--mu)'};cursor:pointer;font-size:12px;font-weight:${portNum===2?700:400}">Portfolio 2 — San Joaquin $${FP.filter(p=>p.portfolio===2&&p.oc==='eligible').reduce((s,p)=>{return s+(parseFloat((p.ts&&p.ts.co||'$5M').replace(/[^0-9.]/g,''))||5);},0).toFixed(0)}M</button>
</div>

<!-- Stage timeline (horizontal scrollable) -->
<div style="background:var(--wh);border:1px solid var(--bo);border-radius:10px;padding:14px 16px;margin-bottom:18px;overflow-x:auto">
  <div style="display:flex;align-items:flex-start;min-width:900px">
  ${STAGE_ORDER.map((stage,i)=>{
    const meta=STAGE_META[stage]||{};
    const isDone=i<maxIdx;
    const isActive=i===maxIdx;
    const isFuture=i>maxIdx;
    const cc=isDone?'var(--t)':isActive?'var(--td)':'var(--bo)';
    const tc=isDone?'var(--t)':isActive?'var(--tx)':'var(--fa)';
    return `<div style="display:flex;flex-direction:column;align-items:center;min-width:56px;cursor:${isFuture?'default':'pointer'}" onclick="${isFuture?'':'showStageDetail('+JSON.stringify(stage)+')'}">
      <div style="display:flex;align-items:center;width:100%">
        ${i>0?`<div style="flex:1;height:2px;background:${isDone?'var(--t)':'var(--bo)'};margin-top:-13px"></div>`:'<div style="flex:1"></div>'}
        <div style="width:24px;height:24px;border-radius:50%;background:${cc};border:2px solid ${cc};display:flex;align-items:center;justify-content:center;flex-shrink:0;${isActive?'box-shadow:0 0 0 3px var(--tl)':''}">
          <span style="font-size:8px;font-weight:700;color:${isDone||isActive?'#fff':'var(--fa)'}">${isDone?'✓':meta.icon||i+1}</span>
        </div>
        ${i<STAGE_ORDER.length-1?`<div style="flex:1;height:2px;background:var(--bo);margin-top:-13px"></div>`:'<div style="flex:1"></div>'}
      </div>
      <div style="font-size:7px;font-weight:${isActive?700:400};color:${tc};text-align:center;margin-top:4px;line-height:1.2;max-width:52px">${(meta.label||SL[stage]||stage).replace('\\n',' ')}</div>
    </div>`;
  }).join('')}
  </div>
  <div style="margin-top:10px;padding:8px 12px;background:var(--tl);border-radius:7px;font-size:12px;color:var(--td)">
    <strong>Current stage:</strong> ${SL[curStage]||curStage} · <strong>Actor:</strong> ${curMeta.actor||'—'} · Click any completed stage to see its task log
  </div>
</div>

<!-- Current stage tasks -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">
  <div>
    <div class="s5-section" style="margin-top:0">Current stage — ${SL[curStage]||curStage}</div>
    <div class="card" style="margin:0;padding:14px">
      <div style="font-size:12px;font-weight:700;color:var(--t);margin-bottom:10px">📋 Tasks for this stage</div>
      ${curTasks.tasks.map(t=>`<div style="display:flex;gap:8px;margin-bottom:6px">
        <div style="width:16px;height:16px;border-radius:50%;background:var(--tl);border:1px solid var(--t);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">
          <span style="font-size:8px;font-weight:700;color:var(--t)">✓</span>
        </div>
        <div style="font-size:12px;color:var(--tx);line-height:1.5">${t}</div>
      </div>`).join('')}
      <div style="margin-top:12px;padding:8px 12px;background:var(--grl);border-radius:7px">
        <div style="font-size:11px;font-weight:700;color:var(--mu);margin-bottom:2px">NEXT GATE</div>
        <div style="font-size:12px;color:var(--tx)">${curTasks.nextGate}</div>
      </div>
    </div>
  </div>

  <div>
    <div class="s5-section" style="margin-top:0">Portfolio ${portNum} projects — ${portLabel}</div>
    <div style="max-height:380px;overflow-y:auto">
    ${allPortfolioProjects.sort((a,b)=>b.sc-a.sc).map(p=>`
    <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid var(--bo);border-radius:8px;margin-bottom:6px;background:var(--wh)">
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600">${p.org}</div>
        <div style="font-size:10px;color:var(--mu)">${p.ty} · ${p.ts&&p.ts.co||'—'}</div>
      </div>
      <span style="font-size:12px;font-weight:700;color:${p.sc>=700?'var(--t)':p.sc>=500?'var(--am)':'var(--re)'}">${p.sc}</span>
      <select class="ssel" style="font-size:10px;max-width:120px" onchange="advanceDealStage(${p.id},this.value)">
        ${STAGE_ORDER.map(s=>`<option value="${s}"${s===p.st?' selected':''}>${SL[s]||s}</option>`).join('')}
      </select>
      <span class="badge ${p.oc==='eligible'?'bt':p.oc==='ta'?'ba':'br'}" style="font-size:10px">${p.oc==='eligible'?'Eligible':p.oc==='ta'?'TA':'N/E'}</span>
    </div>`).join('')}
    </div>
  </div>
</div>

<div id="stage-detail-panel"></div>`;
}

function showStageDetail(stage){
  const STAGE_TASKS_LOCAL={
    wizard_complete:{tasks:['Wizard submitted','Instant score generated','Basin eligibility confirmed','Advisor assigned'],actor:'WaterFundable'},
    tech_a_intake:{tasks:['T1-T4 documents uploaded','Financials verified','Engineering report reviewed','SRF IUP confirmed'],actor:'Utility + WaterFundable'},
    under_review:{tasks:['7 gates evaluated','All binary criteria checked','Flags documented','Score queue entry created'],actor:'WaterFundable'},
    verified:{tasks:['Full BPBM score computed','Rating equivalent assigned','Score report delivered','Gap analysis completed'],actor:'WaterFundable'},
    data_room_locked:{tasks:['All docs uploaded','Verifier sign-off obtained','Tech B MRV activated','Access locked'],actor:'WaterFundable + verifier'},
    portfolio_queue:{tasks:['Basin rule confirmed','Diversification check passed','Shadow rating initiated','Portfolio size verified'],actor:'WaterFundable'},
    impact_prospectus:{tasks:['Prospectus drafted','Scorecards included','Distributed to investors','Q&A period opened'],actor:'WaterFundable'},
    impact_pledge:{tasks:['Pledges collected','LOI/MOU executed','Yield subsidy calculated','Incorporated in model'],actor:'Impact investors'},
    bio_credit_process:{tasks:['Eligible projects identified','Verifier contracted','Baseline assessed','Credits issued on Tech B'],actor:'WaterFundable + Tech B'},
    bond_prospectus:{tasks:['PPM framework drafted','KBRA rating finalized','Kestrel SPO completed','144A docs prepared'],actor:'Bond counsel + WaterFundable'},
    ppm_issued:{tasks:['PPM distributed to B/D','Opinions attached','Rating letter attached','B/D letter executed'],actor:'Bond counsel + B/D'},
    bd_due_diligence:{tasks:['Mgmt call complete','DU packages reviewed','DSCR verified','Comfort letter issued'],actor:'Broker-dealer'},
    pricing_allocation:{tasks:['Roadshow complete','Pricing determined','Allocations confirmed','Term sheet issued'],actor:'Broker-dealer'},
    bond_close:{tasks:['Closing conditions met','Funds wired','Trust indenture executed','EMMA filed'],actor:'Trustee + bond counsel'},
    trust_admin_handoff:{tasks:['TA engaged','Drawdown transferred','Reporting calendar set','MRV feed activated'],actor:'Trust administrator'},
    bond_active:{tasks:['Disbursements running','MRV reports issued','CDP packets delivered','Annual EMMA updated'],actor:'Trust admin + Tech B'},
  };
  const t=STAGE_TASKS_LOCAL[stage]||{tasks:['—'],actor:'—'};
  const meta=STAGE_META[stage]||{};
  const panel=document.getElementById('stage-detail-panel');
  if(!panel)return;
  panel.innerHTML=`<div class="s5-section">Stage detail: ${SL[stage]||stage}</div>
  <div class="card" style="padding:14px;margin-bottom:8px">
    <div style="font-size:12px;font-weight:700;color:var(--mu);margin-bottom:8px">Actor: ${t.actor} · ${meta.icon||''}</div>
    ${t.tasks.map(tk=>`<div style="font-size:12px;padding:4px 0;border-bottom:1px solid var(--bo);color:var(--tx)">✓ ${tk}</div>`).join('')}
  </div>`;
  panel.scrollIntoView({behavior:'smooth'});
}

function advanceDealStage(id,stage){
  const p=FP.find(x=>x.id===id);
  if(p)p.st=stage;
  rDealFlow();
}



function buildDealFlowTimeline(currentStage) {
  const currentIdx = STAGE_ORDER.indexOf(currentStage);
  let html = '<div class="deal-flow-wrap"><div class="deal-flow-track">';
  STAGE_ORDER.forEach((stage, i) => {
    const meta = STAGE_META[stage];
    const isDone = i < currentIdx;
    const isActive = i === currentIdx;
    let circleCls = isDone ? 'done' : isActive ? meta.cls + ' active' : 'inactive';
    const labelCls = isDone ? 'done' : isActive ? 'active' : '';
    // Add divider line before PPM section
    if (stage === 'ppm_issued') {
      html += `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 4px">
        <div style="width:1px;height:44px;background:var(--bo)"></div>
        <div style="font-size:9px;color:var(--fa);text-align:center;line-height:1.2;margin-top:4px;white-space:nowrap">B/D<br>handoff</div>
      </div>`;
    }
    html += `<div class="df-stage">
      <div class="df-circle ${circleCls}">${isDone ? '✓' : meta.icon}</div>
      <div class="df-label ${labelCls}" style="white-space:pre-line">${meta.label}</div>
      <div style="font-size:9px;color:var(--fa);text-align:center">${meta.actor}</div>
    </div>`;
    // Connector between stages
    if (i < STAGE_ORDER.length - 1 && STAGE_ORDER[i+1] !== 'ppm_issued') {
      const connCls = isDone ? 'done' : isActive ? 'active' : '';
      html += `<div style="flex:1;height:2px;align-self:center;position:relative;top:-32px;background:${isDone?'var(--t)':isActive?'linear-gradient(to right, var(--t) 40%, var(--bo) 40%)':'var(--bo)'}"></div>`;
    }
  });
  html += '</div></div>';
  return html;
}

function buildPPMPanel(currentStage) {
  const stageIdx = STAGE_ORDER.indexOf(currentStage);
  const ppmIdx = STAGE_ORDER.indexOf('ppm_issued');
  const isActive = currentStage === 'portfolio_queue';
  const isDone = stageIdx > ppmIdx;
  const isLocked = stageIdx < STAGE_ORDER.indexOf('portfolio_queue');

  return `<div class="ppm-panel">
    <div class="ppm-panel-hdr">
      <div class="ppm-panel-icon">📄</div>
      <div>
        <div class="ppm-panel-title">Stage 7 — PPM / POM issued to broker-dealer</div>
        <div class="ppm-panel-sub">WaterFundable + bond counsel deliver the Preliminary Private Placement Memorandum</div>
      </div>
      <div class="ppm-panel-status">
        <span class="badge ${isDone?'bt':isActive?'bb':'bg'}">${isDone?'Complete':isActive?'Ready to issue':'Awaiting portfolio assembly'}</span>
      </div>
    </div>
    <div class="ppm-body">
      <div class="s5-section" style="margin-top:0">Portfolio Offering Package — documents included in PPM handoff</div>
      ${[
        {icon:'📋',name:'Preliminary Private Placement Memorandum (PPM)',note:'Core 144A legal offering document. Use of proceeds, risk factors, capital structure, portfolio description, financial summaries. Drafted by bond counsel.',owner:'Bond counsel',st:isDone?'done':'pending'},
        {icon:'🏅',name:'Kestrel Blue Bond SPO',note:'Second Party Opinion confirming Blue Bond / Green Bond designation. ICMA GBP and CBI Water Criteria alignment. SDG 6 and 14 mapping.',owner:'Kestrel',st:isDone?'done':'pending'},
        {icon:'🏦',name:'KBRA Rating Letter',note:'Pool-level credit rating opinion. Investment-grade equivalent for senior tranche. Based on pool DSCR model and Fitch FAST stress test.',owner:'KBRA',st:isDone?'done':'pending'},
        {icon:'💧',name:'WaterFundable Portfolio Tear Sheet Summary',note:'One-page visual summary per project. Identity, financial, and impact blocks. WaterFundable copyright. Attached as Exhibit A.',owner:'WaterFundable',st:isDone?'done':'done'},
        {icon:'📝',name:'Impact Capital SPV Commitment Letters',note:'Executed commitment letters totaling $20M from corporate impact capital sponsors. Evidence of 10% first-loss credit enhancement.',owner:'Impact Capital investors',st:isDone?'done':'pending'},
        {icon:'🌿',name:'Tech B MRV Framework Summary',note:'Post-close monitoring, reporting, and verification methodology. VWBA protocol, data sources, annual report cadence, PURO biodiversity standard.',owner:'Tech B',st:isDone?'done':'done'},
        {icon:'⚖️',name:'Legal Opinion Chain',note:'Bond counsel opinion, securities counsel 144A opinion, tax opinion, issuer authority opinions per project.',owner:'Bond counsel',st:isDone?'done':'pending'},
      ].map(d=>`<div class="doc-row">
        <div class="doc-icon" style="background:${d.st==='done'?'var(--tl)':'var(--grl)'}">${d.icon}</div>
        <div style="flex:1"><div class="doc-name">${d.name}</div><div class="doc-note">${d.note}</div></div>
        <div style="text-align:right;padding-left:12px;flex-shrink:0">
          <div class="doc-status ${d.st==='done'?'bt':'ba'}">${d.st==='done'?'Ready':'Pending'}</div>
          <div style="font-size:10px;color:var(--fa);margin-top:3px">${d.owner}</div>
        </div>
      </div>`).join('')}

      ${isActive ? `<div style="margin-top:16px;display:flex;align-items:center;gap:12px">
        <button class="issue-btn" onclick="advanceDealStage(1,'ppm_issued');advanceDealStage(2,'ppm_issued');advanceDealStage(3,'ppm_issued');advanceDealStage(4,'ppm_issued')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h10M9 5l3 3-3 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Issue PPM / POM to Broker-Dealer
        </button>
        <span style="font-size:12px;color:var(--mu)">Advances all eligible Portfolio 1 projects to PPM issued stage</span>
      </div>` : isDone ? `<div class="ib it" style="margin-top:12px">PPM issued. B/D due diligence is now active.</div>` : `<div class="ib ia" style="margin-top:12px">Available after portfolio assembly is complete and data room is locked for all eligible projects.</div>`}
    </div>
  </div>`;
}

function buildBDPanel(currentStage) {
  const stageIdx = STAGE_ORDER.indexOf(currentStage);
  const bdIdx = STAGE_ORDER.indexOf('bd_due_diligence');
  const isActive = currentStage === 'ppm_issued';
  const isDone = stageIdx > bdIdx;
  const isLocked = stageIdx < bdIdx;

  return `<div class="ppm-panel">
    <div class="ppm-panel-hdr bd">
      <div class="ppm-panel-icon">🏦</div>
      <div>
        <div class="ppm-panel-title">Stage 8 — B/D due diligence</div>
        <div class="ppm-panel-sub">Broker-dealer legal, credit, and compliance review · Investor roadshow · Final OM production</div>
      </div>
      <div class="ppm-panel-status">
        <span class="badge ${isDone?'bt':isActive?'bp2':'bg'}">${isDone?'Complete':isActive?'In progress':'Awaiting PPM issuance'}</span>
      </div>
    </div>
    <div class="ppm-body">
      ${[
        {title:"B/D counsel legal review",note:"B/D's counsel reviews PPM for completeness, accuracy, and 144A compliance. Red-line comments returned to WaterFundable bond counsel. Typically 2-3 rounds.",owner:'B/D counsel',st:isActive||isDone?'pending':'notstarted'},
        {title:"Credit committee approval",note:"B/D internal credit committee reviews the pool DSCR model, KBRA rating opinion, and Impact first-loss structure. Approval required before roadshow.",owner:'Broker-dealer',st:isActive||isDone?'pending':'notstarted'},
        {title:"Investor roadshow preparation",note:"WaterFundable and B/D prepare investor presentation. QIB target list developed. NDAs executed with interested investors.",owner:'WaterFundable + B/D',st:isActive||isDone?'pending':'notstarted'},
        {title:"QIB investor roadshow",note:"B/D presents to qualified institutional buyers. Impact narrative, financial structure, Kestrel SPO, and KBRA rating letter shared. Book-building begins.",owner:'Broker-dealer',st:'notstarted'},
        {title:"Final Offering Memorandum (OM)",note:"Bond counsel produces final OM incorporating all B/D comments. Securities counsel signs off on 144A compliance. Final document distributed to investors.",owner:'Bond counsel',st:'notstarted'},
      ].map(item=>`<div class="ppm-checklist-item">
        <div class="ppm-check ${item.st}">${item.st==='done'?'✓':item.st==='pending'?'~':'○'}</div>
        <div style="flex:1"><div class="ppm-item-title">${item.title}</div><div class="ppm-item-note">${item.note}</div></div>
        <div class="ppm-item-owner">${item.owner}</div>
      </div>`).join('')}

      ${isActive ? `<div style="margin-top:16px;display:flex;align-items:center;gap:12px">
        <button class="stage-advance-btn pu" onclick="advanceDealStage(1,'bd_due_diligence');advanceDealStage(2,'bd_due_diligence');advanceDealStage(3,'bd_due_diligence');advanceDealStage(4,'bd_due_diligence')">
          Advance to B/D due diligence
        </button>
        <span style="font-size:12px;color:var(--mu)">Estimated timeline: 4-8 weeks</span>
      </div>` : isDone ? `<div class="ib it" style="margin-top:12px">B/D due diligence complete. Final OM executed. Advancing to pricing.</div>` : ''}
    </div>
  </div>`;
}

function buildPricingPanel(currentStage) {
  const stageIdx = STAGE_ORDER.indexOf(currentStage);
  const priceIdx = STAGE_ORDER.indexOf('pricing_allocation');
  const isActive = currentStage === 'bd_due_diligence';
  const isDone = stageIdx > priceIdx;

  return `<div class="ppm-panel">
    <div class="ppm-panel-hdr price">
      <div class="ppm-panel-icon">💰</div>
      <div>
        <div class="ppm-panel-title">Stage 9 — Pricing & allocation → Bond close</div>
        <div class="ppm-panel-sub">B/D prices notes · QIB allocation · Trustee closes · Proceeds distributed · Tech B MRV activated</div>
      </div>
      <div class="ppm-panel-status">
        <span class="badge ${isDone?'bt':isActive?'ba':'bg'}">${isDone?'Complete':isActive?'Pending pricing':'Awaiting B/D diligence'}</span>
      </div>
    </div>
    <div class="ppm-body">
      ${[
        {title:"Bond pricing date set",note:"B/D sets pricing date. Final yield spread determined based on investor book. $180M senior notes (5-7%) and $20M Impact Capital reserve funded.",owner:'Broker-dealer',st:'notstarted'},
        {title:"QIB allocation confirmed",note:"B/D allocates notes to qualified institutional buyers. Rule 144A transfer restrictions confirmed. Closing mechanics initiated with trustee.",owner:'Broker-dealer',st:'notstarted'},
        {title:"Bond closes — proceeds distributed",note:"$180M (90%) escrowed to individual project accounts per drawdown schedules. $20M (10%) funded to Impact Capital SPV first-loss reserve.",owner:'Trustee',st:'notstarted'},
        {title:"Tech B MRV activated",note:"Bond close triggers Tech B MRV activation. Pre-construction baselines established. SCADA/AMI data feeds connected. Remote sensing initiated.",owner:'Tech B',st:'notstarted'},
        {title:"EMMA posting — annual reporting begins",note:"Trustee posts deal documents to EMMA (MSRB). Annual MRV and bond reporting cycle begins. Kestrel annual SPO review scheduled.",owner:'Trustee + WaterFundable',st:'notstarted'},
      ].map(item=>`<div class="ppm-checklist-item">
        <div class="ppm-check ${item.st}">${item.st==='done'?'✓':item.st==='pending'?'~':'○'}</div>
        <div style="flex:1"><div class="ppm-item-title">${item.title}</div><div class="ppm-item-note">${item.note}</div></div>
        <div class="ppm-item-owner">${item.owner}</div>
      </div>`).join('')}

      ${isActive ? `<div style="margin-top:16px;display:flex;align-items:center;gap:12px">
        <button class="stage-advance-btn am" onclick="advanceDealStage(1,'pricing_allocation');advanceDealStage(2,'pricing_allocation');advanceDealStage(3,'pricing_allocation');advanceDealStage(4,'pricing_allocation')">
          Advance to pricing & allocation
        </button>
      </div>` : ''}

      ${isActive || isDone ? '' : `<div class="ib ia" style="margin-top:12px">Available after B/D due diligence and Final OM are complete.</div>`}
    </div>
  </div>`;
}



function rDataRoom(id){
  const all=[...FP,...wSubs.map((p,i)=>({id:100+i,org:p.org||'Your organization',ba:BL2[p.basin_id]||'—',ty:TL[p.project_type]||'—',ts:{co:p.cost_range||'—',ci:p.project_city||'—'},srf:{type:'CWSRF/DWSRF',num:'Pending',pf:false,dac:false}}))];
  const p=all.find(x=>x.id===id);
  const projName=p?p.org:'Project';
  // Data room folder structure per BPBM data taxonomy
  const folders=[
    {tier:'T1 — RESTRICTED',color:'var(--re-l)',border:'var(--re)',docs:[
      {name:'Audited Financial Statements (3yr)',status:'Required',uploaded:p&&p.id<10?'✓ Uploaded':'⬆ Upload needed',size:p&&p.id<10?'3 PDFs · 2.4MB':'—'},
      {name:'Rate Study (≤5 years)',status:'Required',uploaded:p&&p.id<10?'✓ Uploaded':'⬆ Upload needed',size:p&&p.id<10?'1 PDF · 840KB':'—'},
      {name:'Debt Schedule',status:'Required',uploaded:p&&p.id<10?'✓ Uploaded':'⬆ Upload needed',size:p&&p.id<10?'1 PDF · 180KB':'—'},
      {name:'Financial Model (post-project)',status:'Required',uploaded:'⬆ Upload needed',size:'—'},
      {name:'MHI / Affordability Analysis',status:'Required',uploaded:'⬆ Upload needed',size:'—'},
      {name:'Authorizing Resolution',status:'Required',uploaded:p&&p.id<10?'✓ Uploaded':'⬆ Upload needed',size:p&&p.id<10?'1 PDF · 95KB':'—'},
      {name:'Rate Covenant Documentation',status:'Required',uploaded:'⬆ Upload needed',size:'—'},
    ]},
    {tier:'T2 — CONFIDENTIAL',color:'var(--aml)',border:'var(--am)',docs:[
      {name:'Engineering Report (min. feasibility)',status:'Required',uploaded:p&&p.id<10?'✓ Uploaded':'⬆ Upload needed',size:p&&p.id<10?'1 PDF · 3.1MB':'—'},
      {name:'Environmental Clearance / SRF Priority List',status:'Required',uploaded:p&&p.id<10?'✓ Uploaded':'⬆ Upload needed',size:p&&p.id<10?'1 PDF · 620KB':'—'},
      {name:'Construction Permits (if available)',status:'If available',uploaded:'⬆ Upload when ready',size:'—'},
      {name:'Project Schedule (Gantt or milestone)',status:'Required',uploaded:'⬆ Upload needed',size:'—'},
      {name:'SRF Pre-Application / IUP Listing',status:'Recommended',uploaded:p&&p.id<10?'✓ Uploaded':'⬆ Upload needed',size:p&&p.id<10?'1 PDF · 210KB':'—'},
      {name:'Procurement Documents (ITB/RFP)',status:'If available',uploaded:'⬆ Upload when ready',size:'—'},
      {name:'O&M Cost Projections',status:'Required',uploaded:'⬆ Upload needed',size:'—'},
      {name:'Third-Party Verifier Contract / LOI',status:'Before data room lock',uploaded:'⬆ Upload needed',size:'—'},
      {name:'CBI Category Mapping Memo',status:'Required',uploaded:'⬆ Upload needed',size:'—'},
    ]},
    {tier:'T3 — INTERNAL',color:'var(--tl)',border:'var(--t)',docs:[
      {name:'VWBA Data Input Form + Outputs',status:'Required',uploaded:'⬆ Upload needed',size:'—'},
      {name:'WASH Quantification Worksheet',status:'Required',uploaded:'⬆ Upload needed',size:'—'},
      {name:'GHG Calculation / Energy Efficiency Analysis',status:'Required',uploaded:'⬆ Upload needed',size:'—'},
      {name:'NRW Audit (if efficiency claim)',status:'If claimed',uploaded:'⬆ Upload when ready',size:'—'},
      {name:'WRI Aqueduct Basin Stress Extract',status:'Auto-generated by platform',uploaded:'✓ Auto-populated',size:'Platform'},
      {name:'MRV Monitoring Plan / SCADA Documentation',status:'Required',uploaded:p&&p.id<10?'✓ Uploaded':'⬆ Upload needed',size:p&&p.id<10?'1 PDF · 1.2MB':'—'},
      {name:'Biodiversity Baseline (NBS projects)',status:'If NBS scope',uploaded:'⬆ Upload if applicable',size:'—'},
    ]},
    {tier:'T4 — PUBLIC (post-issuance)',color:'var(--bll)',border:'var(--bl)',docs:[
      {name:'Green Bond Framework (entity-level)',status:'Pre-issuance',uploaded:'⬆ In preparation',size:'—'},
      {name:'Kestrel Blue Bond SPO',status:'Pre-issuance',uploaded:'⬆ Pending SPO engagement',size:'—'},
      {name:'Annual MRV Report Template',status:'Post-close',uploaded:'⬆ Post-close document',size:'—'},
    ]},
  ];

  const uploaded=folders.flatMap(f=>f.docs).filter(d=>d.uploaded.startsWith('✓')).length;
  const total=folders.flatMap(f=>f.docs).length;
  const pct=Math.round(uploaded/total*100);

  document.getElementById('main').innerHTML=`
<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
  <span style="cursor:pointer;color:var(--t);font-size:13px" onclick="CU.role==='admin'?rPipe():rUtil()">&#x2190; Back</span>
</div>
<div class="pt">📁 Data Room — ${projName}</div>
<div class="ps">Secure document repository · BPBM taxonomy · Tier-classified access control</div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px">
  <div class="met"><div class="ml">Documents uploaded</div><div class="mv" style="color:var(--t)">${uploaded}<span style="font-size:14px;color:var(--fa)">/${total}</span></div><div class="ms">${pct}% complete</div></div>
  <div class="met"><div class="ml">Data room status</div><div class="mv" style="font-size:14px">${pct<50?'Early stage':pct<80?'In progress':pct<100?'Nearly ready':'Complete'}</div></div>
  <div class="met"><div class="ml">Access tier</div><div class="mv" style="font-size:14px">${CU.role==='utility'?'Project owner':'Admin — full access'}</div></div>
</div>

<div class="ib it" style="margin-bottom:16px">
  <strong>Data room structure:</strong> Documents are organized by data tier (T1 Restricted through T4 Public) following the BPBM taxonomy. T1 (financial) documents require NDA before any third-party access. T3 (impact/MRV) data feeds directly to Tech B for verification. T4 documents are published post-bond-close.
</div>

${folders.map(folder=>`
<div style="margin-bottom:16px">
  <div style="font-size:12px;font-weight:700;padding:8px 12px;background:${folder.color};border-left:3px solid ${folder.border};border-radius:6px 6px 0 0;color:var(--tx)">${folder.tier}</div>
  <div style="border:1px solid var(--bo);border-top:none;border-radius:0 0 8px 8px;overflow:hidden">
    ${folder.docs.map((doc,i)=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;${i<folder.docs.length-1?'border-bottom:1px solid var(--bo)':''}">
      <div style="font-size:18px;opacity:0.7">${doc.uploaded.startsWith('✓')?'📄':'📋'}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500;color:var(--tx)">${doc.name}</div>
        <div style="font-size:11px;color:var(--mu);margin-top:1px">${doc.status}</div>
      </div>
      <div style="text-align:right;min-width:140px">
        <div style="font-size:12px;font-weight:600;color:${doc.uploaded.startsWith('✓')?'var(--t)':'var(--am)'}">${doc.uploaded}</div>
        ${doc.size&&doc.size!=='—'?`<div style="font-size:10px;color:var(--fa)">${doc.size}</div>`:''}
      </div>
      ${CU.role==='utility'&&!doc.uploaded.startsWith('✓')?`<button class="hb" style="flex-shrink:0" onclick="alert('Tech A upload portal — Tier-1 encrypted. Document will be classified and auto-tagged upon upload.')">Upload</button>`:''}
    </div>`).join('')}
  </div>
</div>`).join('')}`;
}

function rTAPlan(id){
  const all=[...FP,...wSubs.map((p,i)=>({id:100+i,org:p.org||'Your organization',sc:p.score,ts:{pillar_scores:{}},fl:{ta:true,no:false},oc:'ta'}))];
  const p=all.find(x=>x.id===id);
  const projName=p?p.org:'Project';
  const ps=p&&p.ts&&p.ts.pillar_scores||{};
  document.getElementById('main').innerHTML=`
<div style="cursor:pointer;color:var(--t);font-size:13px;margin-bottom:4px" onclick="rUtil()">&#x2190; Back</div>
<div class="pt">TA Gap Report — ${projName}</div>
<div class="ps">Technical Assistance referral · BPBM v1.0 analysis · Path to portfolio eligibility</div>
<div class="ib ia" style="margin-bottom:16px">
  <strong>This project scored below the 700/1000 threshold for direct portfolio inclusion.</strong> Technical Assistance is free. A WaterFundable CIP advisor will contact you within 3 business days. Most utilities resolve TA gaps within 3-6 months.
</div>
<div class="s5-section" style="margin-top:0">Most common TA gap areas and resolution paths</div>
${[
  {pillar:'Financial strength (Pillar 1)',issue:'DSCR below 1.50x or days cash below 90 days',fix:'Rate study + financial model showing post-project coverage. GFOA rate covenant adoption. SRF principal forgiveness application to reduce debt service.',effort:'60-90 days'},
  {pillar:'Technical readiness (Pillar 2)',issue:'Engineering design at feasibility level only; permits not initiated',fix:'Advance engineering to 30% design. Engage licensed PE. Initiate NEPA/CEQA categorical exclusion. Add project to SRF priority list.',effort:'90-180 days'},
  {pillar:'SRF alignment (Pillar 3)',issue:'Project not on SRF IUP fundable list',fix:'File SRF pre-application with state revolving fund agency. Request priority list placement. For DAC/small systems, request SRF principal forgiveness eligibility determination.',effort:'30-60 days'},
  {pillar:'MRV readiness (Pillar 7)',issue:'No SCADA system; no third-party verifier engaged',fix:'Document existing monitoring protocols. Identify ISO-accredited verifier from WaterFundable approved list. Execute MRV data sharing agreement.',effort:'30-45 days'},
].map(g=>`<div class="bio-card" style="margin:0 0 12px 0">
  <div style="font-size:11px;font-weight:700;color:var(--am);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">${g.pillar}</div>
  <div style="font-size:13px;font-weight:600;margin-bottom:4px">Issue: ${g.issue}</div>
  <div style="font-size:12px;color:var(--mu);margin-bottom:6px;line-height:1.6">Resolution: ${g.fix}</div>
  <span class="badge ba">Typical timeline: ${g.effort}</span>
</div>`).join('')}
<div class="ib it" style="margin-top:4px">TA support is provided at no cost by WaterFundable's network of licensed engineers, CPAs, and SRF program advisors. Your project will be held in the Reserve Pool and automatically reassessed when gaps are resolved.</div>`;
}



// ── IMPACT INVESTOR STATE ─────────────────────────────────────────────────
if(!window.impactProfile) window.impactProfile={
  name:'Microsoft Impact Capital',
  type:'Corporate water stewardship program',
  csrContact:'sustainability@microsoft.com',
  team:[
    {id:1,name:'A. Chen',role:'Water program lead',email:'achen@microsoft.com',status:'active'},
    {id:2,name:'R. Patel',role:'ESG reporting',email:'rpatel@microsoft.com',status:'active'},
  ]
};
let nextImpactTeamId=3;

// ── IMPACT DASHBOARD ──────────────────────────────────────────────────────
function rImpactDashboard(){
  const p1el=FP.filter(p=>p.portfolio===1&&p.oc==='eligible');
  const pledge=icPledge;
  const locked=pledge.locked||false;
  const totalCommit=pledge.pledgeType==='annual'?pledge.annualAmount*pledge.durationYears:(pledge.totalAmount||10000000);
  const selectedIds=Object.keys(pledge.selectedProjects||{}).filter(k=>pledge.selectedProjects[k]).map(Number);

  document.getElementById('main').innerHTML=`
<div class="pt">Impact Portal</div>
<div class="ps">${CU.name} · Active portfolios · Water &amp; ecosystem impact</div>

<!-- Summary strip -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px">
  <div class="met"><div class="ml">My commitment</div><div class="mv" style="color:${locked?'var(--t)':'var(--am)'}">${locked?'$'+(totalCommit/1e6).toFixed(1)+'M':'Pending'}</div><div class="ms">${locked?'Confirmed pledge':'Not yet locked'}</div></div>
  <div class="met"><div class="ml">Projects supported</div><div class="mv">${selectedIds.length}</div><div class="ms">Portfolio 1 — Sacramento</div></div>
  <div class="met"><div class="ml">Water target</div><div class="mv" style="color:var(--t)">${pledge.targetMGY||100}M gal/yr</div><div class="ms">My attribution target</div></div>
  <div class="met"><div class="ml">Bio credits</div><div class="mv">${pledge.bioPurchase&&pledge.bioPurchase>0?Math.floor(pledge.bioPurchase/150)+' credits':'—'}</div><div class="ms">${pledge.bioPurchase>0?'Purchased':'Not purchased'}</div></div>
</div>

<!-- Available prospectuses -->
<div class="s5-section" style="margin-top:0">Available Impact Prospectuses</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
  <div class="card" style="margin:0;padding:14px 16px;cursor:pointer" onclick="rMain('impactpledge')">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
      <div>
        <div style="font-size:14px;font-weight:700">Portfolio 1 — Sacramento River Basin</div>
        <div style="font-size:11px;color:var(--mu);margin-top:2px">6 eligible projects · CWSRF + DWSRF · WRI Tier 5 basin stress</div>
      </div>
      <span class="badge bt">Open for pledges</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px">
      <div class="rf"><div class="rfl">Portfolio size</div><div class="rfv">$165M</div></div>
      <div class="rf"><div class="rfl">Impact allocation</div><div class="rfv" style="color:var(--t)">10–25%</div></div>
      <div class="rf"><div class="rfl">Your pledge</div><div class="rfv" style="color:${locked?'var(--t)':'var(--fa)'}'">${locked?'$'+(totalCommit/1e6).toFixed(1)+'M':'Not yet'}</div></div>
    </div>
    <div style="font-size:12px;color:var(--mu);margin-bottom:10px">Water recycling, drinking water, wastewater. BPBM avg 763/1000. Tech B MRV active post-close. PURO biodiversity credits available on 2 projects.</div>
    <button class="hb" style="background:var(--tl);color:var(--td);border-color:var(--tm)">${locked?'View my pledge':'Review &amp; pledge →'}</button>
  </div>
  <div class="card" style="margin:0;padding:14px 16px;opacity:0.65">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
      <div>
        <div style="font-size:14px;font-weight:700">Portfolio 2 — San Joaquin Basin</div>
        <div style="font-size:11px;color:var(--mu);margin-top:2px">3 projects accumulating · CWSRF + DWSRF · WRI Tier 5</div>
      </div>
      <span class="badge ba">Pipeline — not yet open</span>
    </div>
    <div style="font-size:12px;color:var(--mu)">Impact prospectus will be issued 12–18 months after Portfolio 1 close. Dixon WWTF, Merced WWTF, Stockton-East Bellota Weir. Expressions of interest welcome.</div>
    <button class="hb" style="margin-top:10px" onclick="alert('Portfolio 2 prospectus not yet issued. You will be notified when it opens for pledges.')">Express interest →</button>
  </div>
</div>

<!-- Project health -->
<div class="s5-section">Project health — Portfolio 1</div>
${p1el.map(p=>{
  const bc=BIO_CREDITS[p.id];
  const waterOk=(p.ts&&p.ts.ws&&p.ts.ws!=='N/A');
  const isSel=selectedIds.includes(p.id);
  return `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid ${isSel?'var(--t)':'var(--bo)'};border-radius:8px;margin-bottom:8px;background:${isSel?'var(--tl)':'var(--wh)'}">
    <div style="flex:1">
      <div style="font-size:13px;font-weight:600">${p.org}</div>
      <div style="font-size:11px;color:var(--mu)">${p.ty} · ${p.ts&&p.ts.ci||p.ba} · BPBM ${p.sc}/1000</div>
    </div>
    ${waterOk?`<span style="font-size:11px;background:var(--tl);color:var(--td);padding:2px 8px;border-radius:5px">💧 ${p.ts.ws}</span>`:''}
    ${bc&&bc.eligible?`<span style="font-size:11px;background:var(--grl);color:#27500A;padding:2px 8px;border-radius:5px">🌿 Bio credits</span>`:''}
    ${isSel?`<span class="badge bt">My project</span>`:''}
    <span class="badge ${p.sc>=800?'bt':p.sc>=700?'bl':'ba'}">${p.ts&&p.ts.score_equiv?p.ts.score_equiv.split(' (')[0]:'BBB+'}</span>
  </div>`;
}).join('')}

<!-- Attribution summary -->
${locked?`
<div class="s5-section">My attribution — ${CU.name}</div>
<div class="ib it"><strong>Tech B MRV will generate your verified attribution after bond close.</strong> Below are your pre-close estimates based on your pledge and project selections.</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px">
  ${FP.filter(p=>selectedIds.includes(p.id)).map(p=>`<div class="bio-card" style="margin:0">
    <div style="font-size:12px;font-weight:700;margin-bottom:6px">${p.org.split('—')[0].trim()}</div>
    <div class="bio-fl">Water target</div><div class="bio-fv g">${p.ts&&p.ts.ws||'Post-MRV'}</div>
    <div class="bio-fl" style="margin-top:4px">CDP eligible</div><div class="bio-fv ${p.ts&&p.ts.cd?'g':''}">${p.ts&&p.ts.cd?'W4/W8/W11':'Pending'}</div>
  </div>`).join('')}
</div>`:''}`;
}

// ── IMPACT PLEDGE (fixed) ─────────────────────────────────────────────────
function rImpactPledge(){
  const p1=FP.filter(p=>p.portfolio===1&&p.oc==='eligible');
  const bioEligible=typeof getBioProjects==='function'?getBioProjects():[];
  const pledge=icPledge||{annualAmount:2000000,totalAmount:10000000,pledgeType:'annual',durationYears:5,targetMGY:100,selectedProjects:{},bioPurchase:0,locked:false};
  if(!icPledge)window.icPledge=pledge;
  const totalCommit=pledge.pledgeType==='annual'?pledge.annualAmount*pledge.durationYears:(pledge.totalAmount||10000000);
  const annualEq=pledge.pledgeType==='annual'?pledge.annualAmount:Math.round((pledge.totalAmount||10000000)/Math.max(pledge.durationYears,1));
  const allocPerMGY=pledge.targetMGY>0?Math.round(totalCommit/pledge.targetMGY/1000):0;
  const selectedIds=Object.keys(pledge.selectedProjects||{}).filter(k=>pledge.selectedProjects[k]).map(Number);
  const totalPortfolioAlloc=p1.reduce((s,p)=>{const c=parseFloat((p.ts&&p.ts.co||'$5M').replace(/[^0-9.]/g,''))||5;return s+c;},0);
  const myPctOfPortfolio=totalPortfolioAlloc>0?Math.round((totalCommit/1e6/totalPortfolioAlloc)*100):0;
  const locked=pledge.locked||false;

  document.getElementById('main').innerHTML=`
<div style="cursor:pointer;color:var(--t);font-size:13px;margin-bottom:8px" onclick="rImpactDashboard()">← Back to impact portal</div>
<div class="pt">Portfolio 1 — Impact Pledge</div>
<div class="ps">${CU.name} · Sacramento River Basin · <span style="color:${locked?'var(--t)':'var(--am)'}">${locked?'✓ Pledge confirmed':'Draft'}</span></div>

${locked?`<div class="ib" style="background:var(--tl);border-left:3px solid var(--t);margin-bottom:16px">
  <strong>Pledge confirmed.</strong> LOI exhibit is ready. <button class="tspb" style="margin-left:10px" onclick="rGenerateLOI()">Download LOI →</button>
</div>`:`<div class="ib it" style="margin-bottom:14px">
  Configure your pledge below. These are commitments — final allocations are set during portfolio balancing. Confirming generates the LOI/MOU exhibit for additionality documentation.
</div>`}

<!-- Pledge structure -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
  <div class="card" style="margin:0;padding:14px">
    <div style="font-size:12px;font-weight:700;color:var(--mu);margin-bottom:10px">Contribution approach</div>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <button onclick="icPledge.pledgeType='annual';rImpactPledge()" style="flex:1;padding:7px;border-radius:7px;border:2px solid ${pledge.pledgeType==='annual'?'var(--t)':'var(--bo)'};background:${pledge.pledgeType==='annual'?'var(--tl)':'transparent'};color:${pledge.pledgeType==='annual'?'var(--td)':'var(--mu)'};cursor:pointer;font-size:12px;font-weight:${pledge.pledgeType==='annual'?700:400}" ${locked?'disabled':''}>Annual</button>
      <button onclick="icPledge.pledgeType='total';rImpactPledge()" style="flex:1;padding:7px;border-radius:7px;border:2px solid ${pledge.pledgeType==='total'?'var(--t)':'var(--bo)'};background:${pledge.pledgeType==='total'?'var(--tl)':'transparent'};color:${pledge.pledgeType==='total'?'var(--td)':'var(--mu)'};cursor:pointer;font-size:12px;font-weight:${pledge.pledgeType==='total'?700:400}" ${locked?'disabled':''}>Lump sum</button>
    </div>
    ${pledge.pledgeType==='annual'?`
    <div style="margin-bottom:10px">
      <div style="font-size:11px;color:var(--fa);margin-bottom:3px">Annual amount</div>
      <div style="font-size:20px;font-weight:800;color:var(--t)">$${(pledge.annualAmount/1e6).toFixed(1)}M / yr</div>
      <input type="range" min="500000" max="20000000" step="250000" value="${pledge.annualAmount}" style="width:100%;margin-top:6px" oninput="icPledge.annualAmount=+this.value;rImpactPledge()" ${locked?'disabled':''}/>
    </div>
    <div>
      <div style="font-size:11px;color:var(--fa);margin-bottom:3px">Duration</div>
      <div style="font-size:20px;font-weight:800;color:var(--t)">${pledge.durationYears} yr</div>
      <input type="range" min="1" max="10" step="1" value="${pledge.durationYears}" style="width:100%;margin-top:6px" oninput="icPledge.durationYears=+this.value;rImpactPledge()" ${locked?'disabled':''}/>
    </div>`:`
    <div>
      <div style="font-size:11px;color:var(--fa);margin-bottom:3px">Total commitment</div>
      <div style="font-size:20px;font-weight:800;color:var(--t)">$${((pledge.totalAmount||10000000)/1e6).toFixed(1)}M</div>
      <input type="range" min="1000000" max="50000000" step="500000" value="${pledge.totalAmount||10000000}" style="width:100%;margin-top:6px" oninput="icPledge.totalAmount=+this.value;rImpactPledge()" ${locked?'disabled':''}/>
    </div>`}
  </div>
  <div class="card" style="margin:0;padding:14px">
    <div style="font-size:12px;font-weight:700;color:var(--mu);margin-bottom:10px">Water target &amp; implied rate</div>
    <div style="margin-bottom:10px">
      <div style="font-size:11px;color:var(--fa);margin-bottom:3px">Target volume (M gal/yr)</div>
      <div style="font-size:20px;font-weight:800;color:var(--t)">${pledge.targetMGY}M gal/yr</div>
      <input type="range" min="10" max="500" step="10" value="${pledge.targetMGY}" style="width:100%;margin-top:6px" oninput="icPledge.targetMGY=+this.value;rImpactPledge()" ${locked?'disabled':''}/>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div class="rf"><div class="rfl">Total commitment</div><div class="rfv" style="color:var(--t)">$${(totalCommit/1e6).toFixed(1)}M</div></div>
      <div class="rf"><div class="rfl">Rate / MGY</div><div class="rfv">$${allocPerMGY}k</div></div>
      <div class="rf"><div class="rfl">Annual equiv.</div><div class="rfv">$${(annualEq/1e6).toFixed(1)}M/yr</div></div>
      <div class="rf"><div class="rfl">Portfolio share</div><div class="rfv">~${myPctOfPortfolio}%</div></div>
    </div>
  </div>
</div>

<!-- Bio credit option -->
${bioEligible.length?`<div class="card" style="margin-bottom:14px;padding:14px">
  <div style="font-size:12px;font-weight:700;color:var(--mu);margin-bottom:6px">Optional: Biodiversity credit purchase</div>
  <div style="font-size:12px;color:var(--mu);margin-bottom:10px">${bioEligible.length} project(s) have PURO biodiversity credit pathways. Purchase separately from the bond — retired on Tech B Ledger for TNFD/CSRD disclosure.</div>
  <div style="display:flex;align-items:center;gap:14px">
    <div style="flex:1">
      <div style="font-size:16px;font-weight:800;color:${(pledge.bioPurchase||0)>0?'var(--t)':'var(--fa)'}">$${(pledge.bioPurchase||0)>0?((pledge.bioPurchase)/1000).toFixed(0)+'K':'0 — not purchasing'}</div>
      <input type="range" min="0" max="100000" step="5000" value="${pledge.bioPurchase||0}" style="width:100%;margin-top:6px" oninput="icPledge.bioPurchase=+this.value;rImpactPledge()" ${locked?'disabled':''}/>
    </div>
    <div>${bioEligible.map(p=>{const bc=BIO_CREDITS[p.id];const cr=(pledge.bioPurchase||0)>0?Math.floor((pledge.bioPurchase||0)/150)+'–'+Math.floor((pledge.bioPurchase||0)/120)+' credits':'—';return `<div style="font-size:12px;padding:6px 10px;background:var(--tl);border-radius:6px;margin-bottom:4px"><div style="font-weight:600;color:var(--td)">${p.org.split('—')[0].trim()}</div><div style="color:var(--t)">Est. ${cr}</div></div>`;}).join('')}</div>
  </div>
</div>`:''}

<!-- Project selection -->
<div class="s5-section">Select projects to support</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
${p1.map(p=>{
  const sel=(pledge.selectedProjects||{})[p.id]||false;
  const cost=parseFloat((p.ts&&p.ts.co||'$5M').replace(/[^0-9.]/g,''))||5;
  const pctPort=totalPortfolioAlloc>0?Math.round(cost/totalPortfolioAlloc*100):0;
  const myAlloc=(totalCommit/1e6)*pctPort/100;
  const ws=p.ts&&p.ts.ws&&p.ts.ws!=='N/A'?p.ts.ws:'Post-MRV';
  const sc=p.sc>=800?'var(--t)':p.sc>=700?'var(--bl)':'var(--am)';
  const hasBio=BIO_CREDITS&&BIO_CREDITS[p.id]&&BIO_CREDITS[p.id].eligible;
  return `<div onclick="${locked?'':'toggleICProject('+p.id+')'}" style="border:2px solid ${sel?'var(--t)':'var(--bo)'};background:${sel?'var(--tl)':'var(--wh)'};border-radius:10px;padding:14px;${locked?'':'cursor:pointer;'}transition:all .2s">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
      <div><div style="font-size:13px;font-weight:700">${p.org}</div><div style="font-size:11px;color:var(--mu)">${p.ty} · ${p.ts&&p.ts.ci||p.ba}</div>${hasBio?`<span style="font-size:10px;background:var(--tl);color:var(--td);border-radius:4px;padding:1px 6px;display:inline-block;margin-top:3px">🌿 Bio credits</span>`:''}</div>
      <div style="width:22px;height:22px;border-radius:50%;background:${sel?'var(--t)':'var(--bo)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">${sel?'<span style="color:#fff;font-size:11px;font-weight:800">✓</span>':''}</div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <span style="font-size:16px;font-weight:800;color:${sc}">${p.sc}<span style="font-size:10px;color:var(--fa)">/1000</span></span>
      <div style="flex:1;height:4px;background:var(--bo);border-radius:2px"><div style="height:4px;width:${Math.round(p.sc/10)}%;background:${sc};border-radius:2px"></div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:11px">
      <div><div style="color:var(--fa)">Cost</div><div style="font-weight:600">${p.ts&&p.ts.co||'—'}</div></div>
      <div><div style="color:var(--fa)">Water</div><div style="font-weight:600;color:var(--t)">${ws}</div></div>
      <div><div style="color:var(--fa)">~My alloc.</div><div style="font-weight:600">$${myAlloc.toFixed(1)}M</div></div>
    </div>
  </div>`;
}).join('')}
</div>

${selectedIds.length?`
<div style="padding:12px 14px;background:var(--grl);border-radius:8px;margin-bottom:14px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
    <div style="font-size:13px;font-weight:700">Pledge summary</div>
    <div style="font-size:14px;font-weight:800;color:var(--t)">$${(totalCommit/1e6).toFixed(1)}M total</div>
  </div>
  <div style="font-size:12px;color:var(--mu)">${selectedIds.length} project(s) selected · ${pledge.targetMGY}M gal/yr target · ~${myPctOfPortfolio}% of portfolio</div>
</div>
<div class="ib" style="background:#FFF8EC;border-left:3px solid var(--am);margin-bottom:14px;font-size:12px"><strong>These are pledges only.</strong> Final allocations set during portfolio balancing. Precedes bond structuring. Incorporated as yield subsidy in underwriting.</div>
${!locked?`<button class="bcta" onclick="confirmICPledge()">Confirm pledge &amp; generate LOI exhibit</button>`:`<button class="tspb" style="padding:10px 22px;font-size:13px" onclick="rGenerateLOI()">Download LOI / MOU Exhibit →</button>`}
`:`<div class="ib ia">Select at least one project to see your pledge summary.</div>`}`;
}

// ── IMPACT COMPANY PROFILE & TEAM ─────────────────────────────────────────
function rImpactProfile(){
  const team=impactProfile.team;
  document.getElementById('main').innerHTML=`
<div style="cursor:pointer;color:var(--t);font-size:13px;margin-bottom:8px" onclick="rImpactDashboard()">← Back</div>
<div class="pt">Company Profile &amp; Team</div>
<div class="ps">${impactProfile.name}</div>

<div class="s5-section" style="margin-top:0">Company profile</div>
<div class="card" style="margin-bottom:18px;padding:16px">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    ${[['Company name',impactProfile.name,'impName'],['Type',impactProfile.type,'impType'],['CSR contact email',impactProfile.csrContact,'impContact']].map(([l,v,fid])=>`
    <div>
      <div style="font-size:11px;font-weight:700;color:var(--fa);text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px">${l}</div>
      <input type="text" id="${fid}" value="${v}" style="width:100%;padding:6px 10px;border:1px solid var(--bo);border-radius:6px;font-size:13px;color:var(--tx);background:var(--wh)"/>
    </div>`).join('')}
  </div>
  <button class="hb" style="margin-top:12px" onclick="impactProfile.name=document.getElementById('impName').value;impactProfile.type=document.getElementById('impType').value;impactProfile.csrContact=document.getElementById('impContact').value;alert('Profile saved.')">Save</button>
</div>

<div class="s5-section">Impact team</div>
${team.map(m=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--bo);border-radius:8px;margin-bottom:8px;background:var(--wh)">
  <div style="width:34px;height:34px;border-radius:50%;background:#0A3028;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#9FE1CB;flex-shrink:0">${m.name.charAt(0)}</div>
  <div style="flex:1"><div style="font-size:13px;font-weight:600">${m.name}</div><div style="font-size:11px;color:var(--mu)">${m.role} · ${m.email}</div></div>
  <span class="badge ${m.status==='active'?'bt':'ba'}">${m.status}</span>
  <div style="display:flex;gap:6px">
    <button class="hb" onclick="editImpactTeamMember(${m.id})">Edit</button>
    <button class="hb" style="color:var(--re);border-color:var(--re)" onclick="removeImpactTeamMember(${m.id})">Remove</button>
  </div>
</div>`).join('')}
<div class="card" style="padding:14px;margin-top:10px">
  <div style="font-size:12px;font-weight:700;color:var(--mu);margin-bottom:10px">Add team member</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:10px;align-items:end">
    <div><div style="font-size:11px;color:var(--fa);margin-bottom:3px">Name</div><input type="text" id="newImpName" placeholder="Jane Smith" style="width:100%;padding:6px 10px;border:1px solid var(--bo);border-radius:6px;font-size:13px;color:var(--tx);background:var(--wh)"/></div>
    <div><div style="font-size:11px;color:var(--fa);margin-bottom:3px">Role</div><input type="text" id="newImpRole" placeholder="Water program lead" style="width:100%;padding:6px 10px;border:1px solid var(--bo);border-radius:6px;font-size:13px;color:var(--tx);background:var(--wh)"/></div>
    <div><div style="font-size:11px;color:var(--fa);margin-bottom:3px">Email</div><input type="email" id="newImpEmail" placeholder="jane@company.com" style="width:100%;padding:6px 10px;border:1px solid var(--bo);border-radius:6px;font-size:13px;color:var(--tx);background:var(--wh)"/></div>
    <button class="hb" style="background:var(--tl);color:var(--td);border-color:var(--tm);padding:6px 14px" onclick="addImpactTeamMember()">Add</button>
  </div>
</div>`;
}
function addImpactTeamMember(){const n=document.getElementById('newImpName')?.value?.trim(),r=document.getElementById('newImpRole')?.value?.trim(),e=document.getElementById('newImpEmail')?.value?.trim();if(!n||!r||!e){alert('Fill all fields.');return;}impactProfile.team.push({id:nextImpactTeamId++,name:n,role:r,email:e,status:'active'});rImpactProfile();}
function removeImpactTeamMember(id){if(!confirm('Remove?'))return;impactProfile.team=impactProfile.team.filter(m=>m.id!==id);rImpactProfile();}
function editImpactTeamMember(id){const m=impactProfile.team.find(x=>x.id===id);if(!m)return;const n=prompt('Name:',m.name);if(!n)return;const r=prompt('Role:',m.role);if(!r)return;const e=prompt('Email:',m.email);if(!e)return;m.name=n;m.role=r;m.email=e;rImpactProfile();}

// Fix rCWS to route to rImpactDashboard
function rCWS(){rImpactDashboard();}



// ── GUARANTOR FLAG HELPER ──────────────────────────────────────────────────
function needsGuarantor(p){
  return p.sc>=500&&p.sc<700;
}
function guarantorBadge(p){
  if(!needsGuarantor(p))return '';
  return '<span style="display:inline-flex;align-items:center;gap:3px;background:#FFF3DC;border:1px solid #F0A500;color:#8A5800;border-radius:5px;padding:2px 7px;font-size:10px;font-weight:700;margin-left:4px" title="Score 500-699: external guarantor required to reach BBB+ equivalent">🛡 Guarantor needed</span>';
}

// ── IMPACT PLEDGE DASHBOARD ───────────────────────────────────────────────
let icPledge={annualAmount:2000000,totalAmount:10000000,pledgeType:'annual',durationYears:5,targetMGY:100,selectedProjects:{},bioPurchase:0,shareIdentity:false,locked:false,confirmedDate:null};


function toggleICProject(id){
  if(icPledge.locked)return;
  icPledge.selectedProjects[id]=!icPledge.selectedProjects[id];
  rImpactPledge();
}

function confirmICPledge(){
  const sel=Object.keys(icPledge.selectedProjects).filter(k=>icPledge.selectedProjects[k]);
  if(!sel.length){alert('Select at least one project before confirming.');return;}
  icPledge.locked=true;
  icPledge.confirmedDate=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  if(!pH[-99])pH[-99]=[];
  pH[-99].unshift({type:'Impact pledge confirmed',detail:`${CU.name} confirmed $${(icPledge.annualAmount/1e6).toFixed(1)}M/yr × ${icPledge.durationYears}yr = $${(icPledge.annualAmount*icPledge.durationYears/1e6).toFixed(1)}M total. ${sel.length} projects selected.`,by:CU.name,ts:new Date().toLocaleString()});
  rImpactPledge();
}

function rGenerateLOI(){
  const sel=Object.keys(icPledge.selectedProjects).filter(k=>icPledge.selectedProjects[k]).map(Number);
  const selProjects=FP.filter(p=>sel.includes(p.id));
  const totalCommit=icPledge.annualAmount*icPledge.durationYears;
  const today=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const loiHTML=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Impact Pledge LOI Exhibit — ${CU.name}</title>
<style>body{font-family:Georgia,serif;max-width:760px;margin:40px auto;padding:0 32px;color:#1a1a1a;line-height:1.7}
h1{font-size:22px;border-bottom:2px solid #1D9E75;padding-bottom:8px;color:#0A3028}
h2{font-size:16px;color:#0A3028;margin-top:28px}
.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0}
.mf{font-size:13px}.ml{color:#666;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
.mv{font-weight:700;font-size:15px}
table{width:100%;border-collapse:collapse;margin-top:12px}
th{text-align:left;padding:8px 10px;background:#f0faf6;font-size:12px;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #1D9E75}
td{padding:8px 10px;border-bottom:1px solid #e8e8e8;font-size:13px}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #ccc;font-size:12px;color:#666}
.sig{margin-top:40px;display:grid;grid-template-columns:1fr 1fr;gap:40px}
.sig-line{border-top:1px solid #333;margin-top:48px;padding-top:6px;font-size:12px}
</style></head><body>
<h1>Impact Capital Pledge — Letter of Intent Exhibit</h1>
<p style="font-size:13px;color:#666">WaterFundable PBC · Portfolio 1 · Sacramento River Basin · <strong>CONFIDENTIAL — Additionality Documentation</strong></p>
<div class="meta">
  <div class="mf"><div class="ml">Impact investor</div><div class="mv">${CU.name}</div></div>
  <div class="mf"><div class="ml">Date of pledge</div><div class="mv">${icPledge.confirmedDate||today}</div></div>
  <div class="mf"><div class="ml">Annual contribution</div><div class="mv">USD $${(icPledge.annualAmount/1e6).toFixed(2)}M per year</div></div>
  <div class="mf"><div class="ml">Commitment duration</div><div class="mv">${icPledge.durationYears} years</div></div>
  <div class="mf"><div class="ml">Total commitment</div><div class="mv">USD $${(totalCommit/1e6).toFixed(2)}M</div></div>
  <div class="mf"><div class="ml">Target water volume</div><div class="mv">${icPledge.targetMGY}M gallons per year</div></div>
</div>
<h2>Supported Projects</h2>
<table><thead><tr><th>Project</th><th>Program</th><th>BPBM Score</th><th>Cost</th><th>Water Secured</th></tr></thead><tbody>
${selProjects.map(p=>`<tr><td>${p.org}</td><td>${p.srf&&p.srf.type||'SRF'}</td><td>${p.sc}/1000</td><td>${p.ts&&p.ts.co||'—'}</td><td>${p.ts&&p.ts.ws||'Post-MRV'}</td></tr>`).join('')}
</tbody></table>
<h2>Terms and Conditions</h2>
<p style="font-size:13px">This pledge constitutes a letter of intent by the Impact investor to provide the above annual contribution to the WaterFundable Portfolio 1 climate water bond program. The contribution functions as a yield subsidy and credit enhancement, reducing financing costs for the supported water infrastructure projects. Final allocation across projects is subject to portfolio balancing as described in the WaterFundable Basin Portfolio Build Methodology (BPBM v1.0). This document shall constitute Exhibit A (Impact Capital Commitment) to the formal MOU between the investor and WaterFundable PBC, and serves as additionality documentation under applicable voluntary carbon and water market standards.</p>
<div class="sig">
  <div><div class="sig-line">Impact Investor Authorized Signatory · ${CU.name}</div></div>
  <div><div class="sig-line">WaterFundable PBC Authorized Signatory</div></div>
</div>
<div class="footer">WaterFundable PBC · Private and Benefit Corporation · This document is confidential and for authorized use only. Not for distribution without written consent.</div>
</body></html>`;
  const blob=new Blob([loiHTML],{type:'text/html'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`WaterFundable_Impact_Pledge_LOI_${CU.name.replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.html`;
  a.click();
}

// ── IMPACT INVESTOR ATTRIBUTION VIEW (impact role only) ───────────────────
function rImpactAttribution(){
  const myName=CU.name;
  const pledge=icPledge;
  const locked=pledge.locked||false;
  const totalCommit=pledge.pledgeType==='annual'?pledge.annualAmount*pledge.durationYears:pledge.totalAmount;
  const selectedIds=Object.keys(pledge.selectedProjects).filter(k=>pledge.selectedProjects[k]).map(Number);
  const selProjects=FP.filter(p=>selectedIds.includes(p.id));

  // Blockchain / trust flow stages
  const flowStages=[
    {icon:'🤝',label:'Pledge submitted',desc:'Your commitment parameters recorded on the WaterFundable platform.',status:locked?'done':'pending',date:pledge.confirmedDate||'—'},
    {icon:'📋',label:'LOI / MOU executed',desc:'Signed LOI exhibit serves as additionality documentation. Legal commitment confirmed.',status:locked?'done':'pending',date:locked?pledge.confirmedDate:'—'},
    {icon:'🔗',label:'Impact prospectus reviewed',desc:'WaterFundable issues the Impact prospectus detailing portfolio composition, project scoring, and impact targets.',status:locked?'done':'pending',date:locked?'Q2 2026':'—'},
    {icon:'⛓️',label:'Blockchain position recorded',desc:'Upon bond close, your portfolio position is anchored on the Tech B Ledger. Immutable provenance established.',status:'pending',date:'Post-close'},
    {icon:'🏛️',label:'Trust admin handoff',desc:'Bond proceeds and your Impact commitment transferred to the Trust administrator. MRV and compliance begins.',status:'pending',date:'Post-close'},
    {icon:'📊',label:'Annual MRV & attribution',desc:'Each year, Tech B generates your verified attribution packet: water volume, GHG, WASH beneficiaries, CDP disclosures.',status:'pending',date:'Annual'},
  ];

  // Double-blind co-investor disclosure
  const otherInvestors=2; // number of other investors (without naming them)
  const shareConsent=pledge.shareIdentity||false;

  document.getElementById('main').innerHTML=`
<div class="pt">My Impact Attribution</div>
<div class="ps">${myName} · Portfolio 1 · Sacramento River Basin</div>

<!-- Pledge status summary -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">
  <div class="met"><div class="ml">My commitment</div><div class="mv" style="color:${locked?'var(--t)':'var(--am)'}">${locked?'$'+(totalCommit/1e6).toFixed(1)+'M':'Not yet confirmed'}</div><div class="ms">${locked?'Confirmed':'Pledge pending'}</div></div>
  <div class="met"><div class="ml">Projects selected</div><div class="mv">${selectedIds.length}</div><div class="ms">of ${FP.filter(p=>p.portfolio===1&&p.oc==='eligible').length} eligible</div></div>
  <div class="met"><div class="ml">Water target</div><div class="mv" style="color:var(--t)">${pledge.targetMGY}M gal/yr</div><div class="ms">My attribution target</div></div>
  <div class="met"><div class="ml">Blockchain status</div><div class="mv" style="font-size:13px">${locked?'LOI signed':'Pending confirmation'}</div><div class="ms">Tech B Ledger</div></div>
</div>

${!locked?`<div class="ib ia"><strong>Complete your pledge first.</strong> Go to <span style="cursor:pointer;color:var(--t)" onclick="rMain('dashboard')">Impact Pledge →</span> to confirm your commitment and generate the LOI exhibit.</div>`:''}

<!-- Commitment flow -->
<div class="s5-section">My commitment flow — ${myName}</div>
<div style="padding:16px;background:var(--wh);border:1px solid var(--bo);border-radius:10px;margin-bottom:18px">
  ${flowStages.map((stage,i)=>`
  <div style="display:flex;gap:14px;margin-bottom:${i<flowStages.length-1?'14px':'0'}">
    <div style="display:flex;flex-direction:column;align-items:center">
      <div style="width:36px;height:36px;border-radius:50%;background:${stage.status==='done'?'var(--t)':'var(--bo)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px">
        ${stage.status==='done'?'✓':stage.icon}
      </div>
      ${i<flowStages.length-1?`<div style="width:2px;flex:1;background:${stage.status==='done'?'var(--t)':'var(--bo)'};margin:4px 0;min-height:20px"></div>`:''}
    </div>
    <div style="flex:1;padding-top:4px">
      <div style="font-size:13px;font-weight:700;color:${stage.status==='done'?'var(--tx)':'var(--fa)'}">${stage.label}</div>
      <div style="font-size:12px;color:var(--mu);line-height:1.5;margin-top:2px">${stage.desc}</div>
      <div style="font-size:11px;color:${stage.status==='done'?'var(--t)':'var(--fa)'};margin-top:3px">${stage.status==='done'?'✓ Complete — '+stage.date:'⏳ '+stage.date}</div>
    </div>
  </div>`).join('')}
</div>

<!-- Selected projects -->
${selectedIds.length?`
<div class="s5-section">My project commitments — Portfolio 1</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px">
${selProjects.map(p=>{
  const ws=(p.ts&&p.ts.ws&&p.ts.ws!=='N/A')?p.ts.ws:'Post-MRV';
  return `<div class="bio-card" style="margin:0">
    <div style="font-size:13px;font-weight:700;margin-bottom:4px">${p.org}</div>
    <div style="font-size:11px;color:var(--mu);margin-bottom:8px">${p.ty} · ${p.ts&&p.ts.ci||p.ba}</div>
    <div class="bio-fl">Water secured (verified)</div><div class="bio-fv g">${ws}</div>
    <div class="bio-fl" style="margin-top:5px">GHG reduced</div><div class="bio-fv">${p.ts&&p.ts.gh||'Post-MRV'}</div>
    <div class="bio-fl" style="margin-top:5px">CDP eligible</div><div class="bio-fv ${p.ts&&p.ts.cd?'g':''}">${(p.ts&&p.ts.cd)?'W4/W8/W11':'Pending'}</div>
    <div style="margin-top:8px;padding:6px 10px;background:var(--tl);border-radius:6px;font-size:11px;color:var(--td)">BPBM ${p.sc}/1000 · ${p.ts&&p.ts.score_equiv?p.ts.score_equiv.split(' (')[0]:'BBB+'}</div>
  </div>`;
}).join('')}
</div>`:''}

<!-- Co-investor disclosure (double-blind) -->
<div class="s5-section">Co-investor participation — Portfolio 1</div>
<div class="card" style="padding:14px 16px;margin-bottom:16px">
  <div style="font-size:13px;margin-bottom:10px">There ${otherInvestors===1?'is':'are'} <strong>${otherInvestors} other Impact investor${otherInvestors>1?'s':''}</strong> participating in Portfolio 1 alongside you. Their identities are confidential unless they consent to disclosure.</div>
  <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--grl);border-radius:8px;margin-bottom:10px">
    <div style="font-size:22px">👥</div>
    <div>
      <div style="font-size:13px;font-weight:600">Impact investor cohort — Portfolio 1</div>
      <div style="font-size:12px;color:var(--mu)">${otherInvestors+1} total participants · Combined commitment: ~$4.0M · You: ~$${(totalCommit/1e6).toFixed(1)}M</div>
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:10px">
    <div style="flex:1;font-size:12px;color:var(--mu)">Share your identity with other Impact investors in this portfolio? This allows for co-branded reporting and joint CDP submissions where permitted.</div>
    <div>
      <button onclick="icPledge.shareIdentity=!icPledge.shareIdentity;rImpactAttribution()" style="padding:7px 14px;border-radius:7px;border:2px solid ${shareConsent?'var(--t)':'var(--bo)'};background:${shareConsent?'var(--tl)':'transparent'};color:${shareConsent?'var(--td)':'var(--mu)'};cursor:pointer;font-size:12px;font-weight:600">
        ${shareConsent?'✓ Sharing identity':'Share my identity'}
      </button>
    </div>
  </div>
  ${shareConsent?`<div class="ib it" style="margin-top:10px;margin-bottom:0;font-size:11px">Your identity (${myName}) will be shared with other Portfolio 1 Impact investors who have also opted in. WaterFundable manages this list and does not share it with QIB investors or the public.</div>`:''}
</div>

<!-- Attribution methodology -->
<div class="ib it" style="margin-top:4px">
  <strong>How your attribution is calculated:</strong> Tech B Attribution Engine divides verified water outcomes (gal/yr, tCO2e/yr, WASH beneficiaries) proportionally based on your financial share of the total Impact commitment for each project. Attribution is project-specific, portfolio-specific, and updated annually after each Tech B MRV report. CDP W-series packets are generated automatically.
</div>`;
}




function rImpact2(){
  document.getElementById('main').innerHTML=`
<div class="pt">Portfolio 2 — San Joaquin Basin</div>
<div class="ps">Impact prospectus — pipeline, not yet open for pledges</div>
<div class="ib ia"><strong>Portfolio 2 impact prospectus is not yet issued.</strong> Portfolio 2 is currently in the project accumulation phase. Projects: City of Dixon WWTF ($36.7M), City of Merced WWTF ($61.9M), Stockton-East Bellota Weir ($80M). Impact outreach begins 12–18 months after Portfolio 1 close.<br><br>Expressions of interest may be registered with your WaterFundable advisor.</div>
<button class="hb" style="margin-top:12px" onclick="rImpactDashboard()">← Back to impact portal</button>`;
}

// ── IMPACT INVESTOR REPORTS ────────────────────────────────────────────────
function rImpactReports(){
  const pledge=icPledge||{};
  const locked=pledge.locked||false;
  const profile=window.impactProfile||{name:'Your organization',type:'',csrContact:''};
  const totalCommit=pledge.pledgeType==='annual'?((pledge.annualAmount||2e6)*(pledge.durationYears||5)):(pledge.totalAmount||10e6);
  const selectedIds=Object.keys(pledge.selectedProjects||{}).filter(k=>pledge.selectedProjects[k]).map(Number);
  const selProjects=FP.filter(p=>selectedIds.includes(p.id));

  document.getElementById('main').innerHTML=`
<div class="pt">Impact Reporting</div>
<div class="ps">${profile.name} · CDP · TNFD · CSRD · GRI 303 · Annual attribution</div>

<div class="ib it" style="margin-bottom:18px">
  <strong>Reporting is unlocked after bond close.</strong> The reports below are templates and draft structures based on your pledge and profile data. Final verified reports are generated by Tech B MRV after the first annual monitoring cycle.
</div>

<!-- Report selection -->
<div class="s5-section" style="margin-top:0">Select reports to prepare</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">

  <!-- CDP Water Disclosure -->
  <div class="card" style="margin:0;padding:14px 16px">
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px">
      <div style="width:40px;height:40px;border-radius:8px;background:#E6F1FB;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">💧</div>
      <div>
        <div style="font-size:14px;font-weight:700">CDP Water Disclosure</div>
        <div style="font-size:11px;color:var(--mu)">Questionnaire W4, W8, W11 · Annual</div>
      </div>
      <span class="badge ${locked?'bt':'ba'}" style="margin-left:auto">${locked?'Draft ready':'Pledge required'}</span>
    </div>
    <div style="font-size:12px;color:var(--mu);line-height:1.6;margin-bottom:10px">
      <strong>W4.1</strong> Do you have a water replenishment target? → Yes — ${pledge.targetMGY||100}M gal/yr<br>
      <strong>W8.1</strong> Describe your water stewardship activities → WaterFundable Portfolio 1 commitment<br>
      <strong>W11.1</strong> What does your organization consider to be shared water risks? → Sacramento Basin WRI Tier 5
    </div>
    <div style="padding:8px 12px;background:var(--grl);border-radius:7px;margin-bottom:10px">
      <div style="font-size:11px;font-weight:700;color:var(--mu);margin-bottom:4px">Profile data needed</div>
      ${[['Organization name',profile.name],['Water withdrawal basin','Sacramento River (WRI Tier 5)'],['Replenishment target',pledge.targetMGY+'M gal/yr'],['Annual commitment','$'+((pledge.annualAmount||2e6)/1e6).toFixed(1)+'M/yr'],['CSR contact',profile.csrContact||'—']].map(([l,v])=>`<div style="font-size:11px;display:flex;justify-content:space-between;padding:2px 0"><span style="color:var(--fa)">${l}</span><span style="font-weight:600">${v}</span></div>`).join('')}
    </div>
    <button class="hb" style="background:var(--bll);color:var(--bl);border-color:var(--bl)" onclick="rMain('impactprofile')">Update profile →</button>
    <button class="hb" style="margin-left:8px" onclick="alert('CDP W-series draft packet will be generated by Tech B after bond close and first MRV cycle. Contact your WaterFundable advisor to discuss pre-close CDP disclosure strategy.')">Preview draft →</button>
  </div>

  <!-- TNFD LEAP -->
  <div class="card" style="margin:0;padding:14px 16px">
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px">
      <div style="width:40px;height:40px;border-radius:8px;background:#EEEDFE;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">🌿</div>
      <div>
        <div style="font-size:14px;font-weight:700">TNFD LEAP Disclosure</div>
        <div style="font-size:11px;color:var(--mu)">Nature-related risks & opportunities · LEAP approach</div>
      </div>
      <span class="badge ba" style="margin-left:auto">Post-MRV</span>
    </div>
    <div style="font-size:12px;color:var(--mu);line-height:1.6;margin-bottom:10px">
      <strong>L — Locate:</strong> Sacramento River Basin · Tulare Lake (P2) · WRI Aqueduct Tier 5 both basins<br>
      <strong>E — Evaluate:</strong> Nature-related dependencies on freshwater. Water stress exposure mapped.<br>
      <strong>A — Assess:</strong> Risks: water scarcity, regulatory, reputational. Opportunities: ecosystem restoration.<br>
      <strong>P — Prepare:</strong> Disclosure aligned with ISSB S2 / IFRS exposure draft.
    </div>
    <div style="padding:8px 12px;background:var(--grl);border-radius:7px;font-size:11px;color:var(--mu)">
      TNFD LEAP report available for projects with biodiversity credits (Fresno Irrigation District, P2). Sacramento Basin projects enable W-LEAP (Water-specific) disclosure.
    </div>
  </div>

  <!-- GRI 303 -->
  <div class="card" style="margin:0;padding:14px 16px">
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px">
      <div style="width:40px;height:40px;border-radius:8px;background:#EAF3DE;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">📊</div>
      <div>
        <div style="font-size:14px;font-weight:700">GRI 303 Water & Effluents</div>
        <div style="font-size:11px;color:var(--mu)">303-1 · 303-3 · 303-4 · Annual</div>
      </div>
      <span class="badge ${locked?'bt':'ba'}" style="margin-left:auto">${locked?'Inputs ready':'Pledge required'}</span>
    </div>
    <div style="font-size:12px;color:var(--mu);line-height:1.6;margin-bottom:10px">
      <strong>303-1</strong> Interactions with water as a shared resource → Sacramento River Basin water stress documentation<br>
      <strong>303-3</strong> Water withdrawal — your portfolio share of total basin withdrawal reduction<br>
      <strong>303-4</strong> Water discharged — treated effluent quality improvements from supported projects
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${selProjects.slice(0,4).map(p=>`<div class="rf"><div class="rfl">${p.org.split('—')[0].trim().split(' ').slice(0,2).join(' ')}</div><div class="rfv g" style="font-size:11px">${p.ts&&p.ts.ws||'Post-MRV'}</div></div>`).join('')}
    </div>
  </div>

  <!-- LOI / MOU Draft -->
  <div class="card" style="margin:0;padding:14px 16px">
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px">
      <div style="width:40px;height:40px;border-radius:8px;background:#FFF8EC;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">📋</div>
      <div>
        <div style="font-size:14px;font-weight:700">LOI / MOU Exhibit</div>
        <div style="font-size:11px;color:var(--mu)">Legal commitment · Additionality proof · Per portfolio</div>
      </div>
      <span class="badge ${locked?'bt':'ba'}" style="margin-left:auto">${locked?'Ready to download':'Pledge required'}</span>
    </div>
    <div style="font-size:12px;color:var(--mu);line-height:1.6;margin-bottom:10px">
      The LOI/MOU exhibit is generated upon pledge confirmation. It serves as your legal commitment document and as proof of additionality under applicable voluntary water and biodiversity market standards.
    </div>
    ${locked?`<button class="tspb" onclick="rGenerateLOI()">Download LOI Exhibit →</button>`:`
    <div style="padding:8px 12px;background:var(--grl);border-radius:7px;font-size:11px">
      <strong>Required to complete LOI:</strong><br>
      · Company name: ${profile.name||'<em>Update in profile</em>'}<br>
      · CSR contact: ${profile.csrContact||'<em>Update in profile</em>'}<br>
      · Pledge: ${locked?'Confirmed':'<em>Confirm pledge first →</em>'}<br>
      · Projects selected: ${selectedIds.length} of ${FP.filter(p=>p.portfolio===1&&p.oc==='eligible').length}
    </div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="hb" onclick="rMain('impactpledge')">Complete pledge →</button>
      <button class="hb" onclick="rMain('impactprofile')">Update profile →</button>
    </div>`}
  </div>

</div>

<!-- Profile completion status -->
<div class="s5-section">Profile data for reporting</div>
<div class="card" style="padding:14px 16px;margin-bottom:4px">
  <div style="font-size:12px;color:var(--mu);margin-bottom:10px">The following fields from your company profile are used to populate CDP, TNFD, and GRI disclosures. <span style="cursor:pointer;color:var(--t)" onclick="rMain('impactprofile')">Update profile →</span></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
    ${[['Company name',profile.name,!!profile.name],['Organization type',profile.type,!!profile.type],['CSR contact',profile.csrContact,!!profile.csrContact],['Annual target (MGY)',(pledge.targetMGY||0)+'M gal/yr',!!pledge.targetMGY],['Portfolio basin','Sacramento River Basin (P1)',true],['CDP reporter?',profile.name?'Yes':'Not confirmed',!!profile.name]].map(([l,v,ok])=>`<div class="rf"><div class="rfl">${l}</div><div class="rfv ${ok?'g':'a'}" style="font-size:12px">${v||'—'}</div></div>`).join('')}
  </div>
</div>`;
}

// ── PORTFOLIO INVITATION STATE ────────────────────────────────────────────
if(typeof window.portInviteState==='undefined') window.portInviteState={
  acknowledged: false,
  mouSigned: false,
  signedBy: '',
  signedDate: null,
};

function rUtilityInvite(){
  const myP=FP.find(p=>p.id===1)||FP.find(p=>p.portfolio===1&&p.oc==='eligible');
  if(!myP){
    document.getElementById('main').innerHTML='<div class="pt">Portfolio Invitation</div><div class="ib ia">No projects in portfolio queue yet.</div>';
    return;
  }
  const inv=window.portInviteState;
  const ts=myP.ts||{};
  const ps=ts.pillar_scores||{};
  const signed=inv.mouSigned;

  // Pillar labels and max points
  const pillars=[
    {key:'p1',label:'Financial strength',max:250,desc:'DSCR · Days cash on hand · Rate covenant · Debt coverage'},
    {key:'p2',label:'Technical readiness',max:200,desc:'Design level · Permits · Licensed operator · O&M capacity'},
    {key:'p3',label:'SRF alignment',max:150,desc:'IUP placement · Principal forgiveness eligibility · DAC status'},
    {key:'p4',label:'Climate & Blue Bond',max:150,desc:'ICMA GBP · CBI Water Criteria · Green bond framework'},
    {key:'p5',label:'Water & biodiversity impact',max:150,desc:'Volume secured · GHG · WASH · VWBA · Biodiversity pathway'},
    {key:'p6',label:'Basin priority & hydrology',max:50,desc:'WRI Aqueduct stress tier · Basin WRC priority designation'},
    {key:'p7',label:'MRV readiness',max:50,desc:'SCADA · Third-party verifier · Tech B data agreement'},
  ];

  document.getElementById('main').innerHTML=`
<div style="cursor:pointer;color:var(--t);font-size:13px;margin-bottom:8px" onclick="rUtil()">← Back to my application</div>
<div class="pt">Portfolio Invitation</div>
<div class="ps">${myP.org} · Portfolio 1 · Sacramento River Basin</div>

${signed?`<div class="ib" style="background:var(--tl);border-left:4px solid var(--t);margin-bottom:18px">
  <strong>✓ MOU acknowledgment confirmed.</strong> Signed by ${inv.signedBy} on ${inv.signedDate}. WaterFundable will initiate the formal contracting phase within 5 business days. Your legal counsel will receive the Participation Agreement directly from bond counsel.
</div>`:`<div style="background:#FFF8EC;border:2px solid var(--am);border-radius:10px;padding:14px 18px;margin-bottom:18px">
  <div style="font-size:14px;font-weight:700;color:var(--am);margin-bottom:4px">⚡ Action required — Portfolio invitation</div>
  <div style="font-size:13px;color:var(--tx);line-height:1.6">WaterFundable has verified your BPBM score and extended a formal portfolio offer. Review your score report and participation terms below. Acknowledging the MOU confirms your commitment and places your project in the Portfolio Queue for bond assembly.</div>
</div>`}

<!-- Score verification card -->
<div class="s5-section" style="margin-top:0">Step 1 — Verify your BPBM score and rating</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">

  <!-- Score summary -->
  <div class="card" style="margin:0;padding:16px">
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
      <div style="text-align:center">
        <div style="font-size:44px;font-weight:800;color:var(--t);line-height:1">${myP.sc}</div>
        <div style="font-size:11px;color:var(--fa);font-weight:600">/1,000</div>
      </div>
      <div>
        <div style="font-size:18px;font-weight:700;color:var(--tx)">${ts.score_equiv||'A (810 pts)'}</div>
        <div style="font-size:12px;color:var(--mu);margin-top:2px">Rating equivalent · Kestrel / KBRA comparable</div>
        <div style="font-size:12px;color:var(--mu);margin-top:2px">SRF Program: ${myP.srf&&myP.srf.type||'CWSRF'} · ${myP.srf&&myP.srf.num||'—'}</div>
        <div style="font-size:12px;color:var(--mu);margin-top:2px">Basin stress: <strong style="color:var(--re)">${ts.bs||'Extremely high — WRI Tier 5'}</strong></div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div class="rf"><div class="rfl">DSCR</div><div class="rfv g">${ts.ds||'1.6x-1.8x'}</div></div>
      <div class="rf"><div class="rfl">Days cash on hand</div><div class="rfv g">${ts.ca||'105 days'}</div></div>
      <div class="rf"><div class="rfl">Credit profile</div><div class="rfv">${ts.cr||'Investment grade'}</div></div>
      <div class="rf"><div class="rfl">Revenue verified</div><div class="rfv g">${ts.rv||'Confirmed'}</div></div>
      <div class="rf"><div class="rfl">Allocation</div><div class="rfv">${ts.balloc||ts.co||'$33.3M'}</div></div>
      <div class="rf"><div class="rfl">Water secured</div><div class="rfv g">${ts.ws||'—'}</div></div>
    </div>
  </div>

  <!-- Pillar breakdown -->
  <div class="card" style="margin:0;padding:16px">
    <div style="font-size:12px;font-weight:700;color:var(--mu);margin-bottom:12px;text-transform:uppercase;letter-spacing:.04em">BPBM pillar scores</div>
    ${pillars.map(pillar=>{
      const score=ps[pillar.key]||0;
      const pct=Math.round(score/pillar.max*100);
      const col=pct>=80?'var(--t)':pct>=60?'var(--bl)':pct>=40?'var(--am)':'var(--re)';
      return `<div style="margin-bottom:9px">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
          <span style="color:var(--tx);font-weight:500">${pillar.label}</span>
          <span style="color:var(--mu)">${score}/${pillar.max}</span>
        </div>
        <div style="height:6px;background:var(--bo);border-radius:3px;overflow:hidden">
          <div style="height:6px;width:${pct}%;background:${col};border-radius:3px"></div>
        </div>
      </div>`;
    }).join('')}
    <div style="margin-top:10px;font-size:11px;color:var(--fa)">Total: ${myP.sc}/1,000 · ${pillars.reduce((s,p)=>s+(ps[p.key]||0),0)} points verified</div>
  </div>
</div>

<!-- Portfolio terms summary -->
<div class="s5-section">Step 2 — Review portfolio participation terms</div>
<div class="card" style="margin-bottom:18px;padding:16px">
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px">
    <div class="rf"><div class="rfl">Portfolio</div><div class="rfv">Portfolio 1 — Sacramento</div></div>
    <div class="rf"><div class="rfl">Your allocation</div><div class="rfv" style="color:var(--t)">${ts.balloc||ts.co||'$33.3M'}</div></div>
    <div class="rf"><div class="rfl">Blended rate (est.)</div><div class="rfv">3.0%–3.8%</div></div>
    <div class="rf"><div class="rfl">Bond structure</div><div class="rfv">144A private placement</div></div>
    <div class="rf"><div class="rfl">Term</div><div class="rfv">20 years</div></div>
    <div class="rf"><div class="rfl">Drawdown structure</div><div class="rfv">Construction draw schedule</div></div>
    <div class="rf"><div class="rfl">SRF co-funding</div><div class="rfv">${myP.srf&&myP.srf.type||'CWSRF'}</div></div>
    <div class="rf"><div class="rfl">Impact Capital subsidy</div><div class="rfv" style="color:var(--t)">${ts.cws||'~$3.3M'}</div></div>
    <div class="rf"><div class="rfl">MRV obligation</div><div class="rfv">Annual · Tech B</div></div>
  </div>
  <div class="ib it" style="margin-bottom:0;font-size:12px">
    <strong>What happens next:</strong> Acknowledging this MOU initiates the formal contracting phase. Bond counsel will contact your designated legal representative within 5 business days with the Participation Agreement, Trust Indenture, and Rate Covenant documentation. Your legal team reviews and executes offline. Execution of the Participation Agreement is required before your project proceeds to PPM issuance.
  </div>
</div>

<!-- MOU acknowledgment -->
<div class="s5-section">Step 3 — Acknowledge portfolio MOU</div>
<div style="border:2px solid ${signed?'var(--t)':'var(--bo)'};border-radius:10px;padding:18px;background:${signed?'var(--tl)':'var(--wh)'}">
  <div style="font-size:13px;font-weight:700;margin-bottom:12px">${signed?'✓ MOU acknowledged':'Portfolio Participation MOU — Acknowledgment'}</div>
  <div style="font-size:12px;color:var(--mu);line-height:1.8;margin-bottom:14px">
    By acknowledging this MOU, <strong>${myP.org}</strong> confirms that:<br>
    1. The BPBM score of <strong>${myP.sc}/1,000</strong> and rating equivalent of <strong>${ts.score_equiv||'A (810 pts)'}</strong> have been reviewed and are not disputed.<br>
    2. The organization authorizes WaterFundable PBC to include this project in <strong>Portfolio 1</strong> for purposes of the $200M 144A Climate Water Bond offering.<br>
    3. The organization understands that the allocation of <strong>${ts.balloc||ts.co||'$33.3M'}</strong> is subject to final bond pricing and portfolio balancing.<br>
    4. Execution of the formal Participation Agreement (to be delivered by bond counsel) is required before capital is committed.<br>
    5. Annual MRV reporting obligations under the Tech B protocol are accepted as a condition of participation.
  </div>
  ${signed?`
  <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--tl);border-radius:8px">
    <div style="font-size:22px">✅</div>
    <div>
      <div style="font-size:13px;font-weight:700;color:var(--td)">MOU acknowledged</div>
      <div style="font-size:12px;color:var(--td)">Signed by ${inv.signedBy} · ${inv.signedDate}</div>
    </div>
  </div>
  <div style="margin-top:12px;display:flex;gap:8px">
    <button class="tspb" onclick="rGenerateUtilityMOU()">Download MOU acknowledgment →</button>
    <button class="hb" onclick="rMain('utilitystatus')">View portfolio status →</button>
  </div>
  `:`
  <div style="margin-bottom:12px">
    <div style="font-size:11px;color:var(--fa);margin-bottom:4px">Authorized signatory full name</div>
    <input type="text" id="mou-signer" placeholder="${orgProfile&&orgProfile.team&&orgProfile.team[0]?orgProfile.team[0].name:'Authorized representative'}" style="width:340px;padding:8px 12px;border:1px solid var(--bo);border-radius:7px;font-size:13px;color:var(--tx);background:var(--wh)"/>
  </div>
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <input type="checkbox" id="mou-check" style="width:16px;height:16px;cursor:pointer"/>
    <label for="mou-check" style="font-size:12px;color:var(--tx);cursor:pointer">I am authorized to act on behalf of ${myP.org} and confirm all statements above.</label>
  </div>
  <button class="bcta" onclick="signUtilityMOU()">Acknowledge MOU &amp; launch contracting phase</button>
  <div style="font-size:11px;color:var(--fa);margin-top:8px">Acknowledging this MOU places your project in the Portfolio Queue. The binding Participation Agreement — delivered separately by bond counsel — must be fully executed before capital is committed.</div>
  `}
</div>`;
}

function signUtilityMOU(){
  const signer=document.getElementById('mou-check');
  const name=document.getElementById('mou-signer')?.value?.trim();
  if(!signer?.checked){alert('Please check the authorization box to proceed.');return;}
  if(!name){alert('Please enter the authorized signatory name.');return;}
  window.portInviteState.mouSigned=true;
  window.portInviteState.signedBy=name;
  window.portInviteState.signedDate=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  // MOU acknowledged → project enters portfolio_queue (committed)
  const myP=FP.find(p=>p.id===1)||FP.find(p=>p.portfolio===1&&p.oc==='eligible');
  // MOU signed = utility confirmed participation → enters portfolio_queue
  // (they were offered at 'verified'; now they accept → queue)
  if(myP&&(myP.st==='verified'||myP.st==='portfolio_queue')) myP.st='portfolio_queue';
  if(!pH[-1])pH[-1]=[];
  pH[-1].unshift({type:'Portfolio MOU acknowledged',detail:`${name} acknowledged portfolio participation MOU for Portfolio 1. Formal contracting phase initiated.`,by:name,ts:new Date().toLocaleString()});
  rUtilityInvite();
}

function rGenerateUtilityMOU(){
  const inv=window.portInviteState;
  const myP=FP.find(p=>p.id===1)||FP.find(p=>p.portfolio===1&&p.oc==='eligible');
  const ts=myP&&myP.ts||{};
  const org=orgProfile&&orgProfile.name||myP&&myP.org||'Your organization';
  const today=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Portfolio Participation MOU — ${org}</title>
<style>
body{font-family:Georgia,serif;max-width:780px;margin:40px auto;padding:0 36px;color:#1a1a1a;line-height:1.8}
h1{font-size:20px;border-bottom:2px solid #1D9E75;padding-bottom:8px;color:#0A3028;margin-bottom:4px}
h2{font-size:15px;color:#0A3028;margin-top:28px;margin-bottom:6px}
.sub{font-size:13px;color:#666;margin-bottom:24px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:16px 0}
.field{font-size:13px;padding:6px 0;border-bottom:1px solid #eee}
.label{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888}
.val{font-weight:600}
ol{padding-left:20px} li{margin-bottom:8px;font-size:13px}
.sig{margin-top:48px;display:grid;grid-template-columns:1fr 1fr;gap:48px}
.sig-line{border-top:1px solid #333;margin-top:52px;padding-top:6px;font-size:12px;color:#666}
.stamp{background:#f0faf6;border:1px solid #1D9E75;border-radius:6px;padding:12px 16px;margin-top:24px}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #ccc;font-size:11px;color:#888}
</style></head><body>
<h1>Portfolio Participation Memorandum of Understanding</h1>
<div class="sub">WaterFundable PBC · Portfolio 1 · Sacramento River Basin · CONFIDENTIAL</div>

<h2>Parties</h2>
<div class="grid">
  <div class="field"><div class="label">Utility / Issuer</div><div class="val">${org}</div></div>
  <div class="field"><div class="label">Platform / Arranger</div><div class="val">WaterFundable PBC</div></div>
  <div class="field"><div class="label">Portfolio</div><div class="val">Portfolio 1 — Sacramento River Basin</div></div>
  <div class="field"><div class="label">Bond structure</div><div class="val">144A Private Placement · $200M Climate Water Bond</div></div>
</div>

<h2>BPBM score verification</h2>
<div class="grid">
  <div class="field"><div class="label">BPBM Score</div><div class="val">${myP&&myP.sc||810}/1,000</div></div>
  <div class="field"><div class="label">Rating equivalent</div><div class="val">${ts.score_equiv||'A (810 pts)'}</div></div>
  <div class="field"><div class="label">SRF program</div><div class="val">${myP&&myP.srf&&myP.srf.type||'CWSRF'} · ${myP&&myP.srf&&myP.srf.num||'—'}</div></div>
  <div class="field"><div class="label">DSCR</div><div class="val">${ts.ds||'1.6x–1.8x'}</div></div>
  <div class="field"><div class="label">Project allocation</div><div class="val">${ts.balloc||ts.co||'$33.3M'}</div></div>
  <div class="field"><div class="label">Impact Capital subsidy (est.)</div><div class="val">${ts.cws||'~$3.3M'}</div></div>
  <div class="field"><div class="label">Water secured</div><div class="val">${ts.ws||'—'}</div></div>
  <div class="field"><div class="label">Basin stress</div><div class="val">${ts.bs||'WRI Aqueduct Tier 5'}</div></div>
</div>

<h2>Participation terms acknowledged</h2>
<ol>
  <li>The BPBM score of <strong>${myP&&myP.sc||810}/1,000</strong> and rating equivalent of <strong>${ts.score_equiv||'A (810 pts)'}</strong> have been reviewed and are accepted without dispute.</li>
  <li>${org} authorizes WaterFundable PBC to include this project in <strong>Portfolio 1</strong> for purposes of the $200M 144A Climate Water Bond offering.</li>
  <li>The allocation of <strong>${ts.balloc||ts.co||'$33.3M'}</strong> is acknowledged as subject to final bond pricing and portfolio balancing.</li>
  <li>Execution of the formal Participation Agreement (to be delivered by bond counsel) is required before capital commitment. This MOU acknowledgment does not constitute a binding financial commitment.</li>
  <li>Annual MRV reporting obligations under the Tech B protocol are accepted as a condition of participation. Reporting package will be specified in the Participation Agreement.</li>
  <li>The blended interest rate of approximately 3.0%–3.8% is acknowledged as an estimate subject to market conditions at pricing.</li>
</ol>

<h2>Next steps</h2>
<p style="font-size:13px">Bond counsel will deliver the Participation Agreement, Trust Indenture draft, and Rate Covenant documentation within 5 business days of this acknowledgment. The utility's legal representative should be designated and available for review. No capital is committed until the Participation Agreement is fully executed.</p>

<div class="stamp">
  <strong style="color:#1D9E75">✓ MOU acknowledged electronically</strong><br>
  <span style="font-size:13px">Signed by: <strong>${inv.signedBy}</strong> · Date: <strong>${inv.signedDate||today}</strong><br>
  Organization: ${org}<br>
  Platform: WaterFundable PBC · Portfolio 1 · Sacramento River Basin</span>
</div>

<div class="sig">
  <div><div class="sig-line">Utility authorized signatory · ${org}</div></div>
  <div><div class="sig-line">WaterFundable PBC authorized signatory</div></div>
</div>

<div class="footer">This document is an electronic MOU acknowledgment only. The binding Participation Agreement, executed offline with bond counsel, governs the financial relationship. WaterFundable PBC · Confidential · Not for distribution.</div>
</body></html>`;
  const blob=new Blob([html],{type:'text/html'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`WaterFundable_Portfolio1_MOU_${org.replace(/[\s,]+/g,'_')}_${new Date().toISOString().slice(0,10)}.html`;
  a.click();
}



function openContractPanel(pid){
  const p=FP.find(x=>x.id===pid);
  if(!p)return;
  const cs=getCS(pid);
  const ts=p.ts||{};
  const ps=ts.pillar_scores||{};
  const pillars=[
    {key:'p1',label:'Financial',max:250},{key:'p2',label:'Technical',max:200},
    {key:'p3',label:'SRF align',max:150},{key:'p4',label:'Blue Bond',max:150},
    {key:'p5',label:'Impact',max:150},{key:'p6',label:'Basin',max:50},{key:'p7',label:'MRV',max:50},
  ];

  // Build modal content
  const modalHTML=`
<div style="padding:0 20px 20px">
  <!-- Header -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px">
    <div>
      <div style="font-size:16px;font-weight:700">${p.org}</div>
      <div style="font-size:12px;color:var(--mu)">${p.ty} · BPBM ${p.sc}/1000 · ${ts.score_equiv||'BBB+'} · ${ts.co||'—'}</div>
    </div>
    <span class="badge ${CS_CLS[cs.status]||'bg'}">${CS_LABEL[cs.status]||'No offer yet'}</span>
  </div>

  <!-- BPBM score summary -->
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:14px">
  ${pillars.map(pl=>{
    const sc=ps[pl.key]||0;
    const pct=Math.round(sc/pl.max*100);
    const col=pct>=80?'var(--t)':pct>=60?'var(--bl)':pct>=40?'var(--am)':'var(--re)';
    return `<div style="text-align:center;padding:6px 4px;background:var(--grl);border-radius:6px">
      <div style="font-size:10px;color:var(--fa);margin-bottom:2px">${pl.label}</div>
      <div style="font-size:13px;font-weight:700;color:${col}">${sc}</div>
      <div style="font-size:9px;color:var(--fa)">/${pl.max}</div>
    </div>`;
  }).join('')}
  </div>

  <!-- Key financial terms -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">
    <div class="rf"><div class="rfl">Allocation</div><div class="rfv">${ts.balloc||ts.co||'—'}</div></div>
    <div class="rf"><div class="rfl">DSCR</div><div class="rfv g">${ts.ds||'—'}</div></div>
    <div class="rf"><div class="rfl">Impact subsidy</div><div class="rfv" style="color:var(--t)">${ts.cws||'—'}</div></div>
    <div class="rf"><div class="rfl">SRF program</div><div class="rfv">${p.srf&&p.srf.type||'CWSRF'} ${p.srf&&p.srf.num||''}</div></div>
    <div class="rf"><div class="rfl">Current stage</div><div class="rfv">${SL[p.st]||p.st}</div></div>
    <div class="rf"><div class="rfl">Advisor</div><div class="rfv">${p.adv||'Unassigned'}</div></div>
  </div>

  <!-- Contracting timeline -->
  <div style="font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px">Contracting status</div>
  ${[
    {step:'Portfolio offer issued',field:'inviteDate',status:cs.inviteDate?'done':'pending',date:cs.inviteDate||'—'},
    {step:'MOU acknowledged by utility',field:'mouDate',status:cs.mouDate?'done':cs.inviteDate?'pending':'inactive',date:cs.mouDate||'—',sub:cs.signedBy?'Signed by: '+cs.signedBy:''},
    {step:'Participation Agreement dispatched',status:cs.status==='contracting'||cs.status==='executed'?'done':cs.mouDate?'pending':'inactive',date:cs.status==='contracting'||cs.status==='executed'?'In progress':'—'},
    {step:'Agreement executed',status:cs.status==='executed'?'done':'inactive',date:cs.status==='executed'?'Complete':'Pending utility legal'},
  ].map((item,i)=>`<div style="display:flex;gap:12px;margin-bottom:10px">
    <div style="width:20px;height:20px;border-radius:50%;background:${item.status==='done'?'var(--t)':item.status==='pending'?'var(--am)':'var(--bo)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">
      <span style="font-size:9px;font-weight:700;color:${item.status==='inactive'?'var(--fa)':'#fff'}">${item.status==='done'?'✓':i+1}</span>
    </div>
    <div>
      <div style="font-size:12px;font-weight:${item.status==='done'?600:400};color:${item.status==='inactive'?'var(--fa)':'var(--tx)'}">${item.step}</div>
      <div style="font-size:11px;color:var(--mu)">${item.date}${item.sub?' · '+item.sub:''}</div>
    </div>
  </div>`).join('')}

  <!-- Admin actions -->
  <div style="border-top:1px solid var(--bo);padding-top:14px;margin-top:4px">
    <div style="font-size:12px;font-weight:700;color:var(--mu);margin-bottom:10px">Admin actions</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${cs.status==='none'?`<button class="hb" style="background:var(--tl);color:var(--td);border-color:var(--tm)" onclick="adminIssueInvite(${pid})">Issue portfolio offer</button>`:''}
      ${cs.status==='invited'?`<button class="hb" style="background:var(--aml);color:var(--am);border-color:var(--am)" onclick="adminRecordMOU(${pid})">Record MOU acknowledgment</button>`:''}
      ${cs.status==='mou_signed'?`<button class="hb" style="background:var(--bll);color:var(--bl);border-color:var(--bl)" onclick="adminDispatchPA(${pid})">Dispatch Participation Agreement</button>`:''}
      ${cs.status==='contracting'?`<button class="hb" style="background:var(--tl);color:var(--td);border-color:var(--tm)" onclick="adminRecordExecution(${pid})">Record executed agreement</button>`:''}
      ${cs.status==='executed'?`<button class="hb" onclick="adminAdvanceToQueue(${pid})">✓ Move to Portfolio Queue</button>`:''}
      <button class="hb" onclick="rMain('dataroom-${pid}')">📁 Data room</button>
      <button class="hb" onclick="rGenerateAdminMOU(${pid})">Download MOU →</button>
    </div>
    ${cs.notes?`<div style="font-size:11px;color:var(--mu);padding:6px 10px;background:var(--grl);border-radius:6px">${cs.notes}</div>`:''}
  </div>
</div>`;

  document.getElementById('tsmt').textContent=p.org+' — Contracting';
  document.getElementById('tsbd').innerHTML=modalHTML;
  document.getElementById('tso').classList.add('op');
}

function adminIssueInvite(pid){
  const p=FP.find(x=>x.id===pid);
  if(!p)return;
  const today=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  setCS(pid,{status:'invited',inviteDate:today,notes:'Portfolio offer issued via WaterFundable portal. Utility notified by email.'});
  if(!pH[pid])pH[pid]=[];
  pH[pid].unshift({type:'Portfolio offer issued',detail:'Admin issued portfolio participation offer. BPBM score '+p.sc+'/1000 shared with utility.',by:CU.name,ts:new Date().toLocaleString()});
  openContractPanel(pid);
}

function adminRecordMOU(pid){
  const p=FP.find(x=>x.id===pid);
  if(!p)return;
  const signer=prompt('Utility signatory name:','');
  if(!signer)return;
  const today=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  setCS(pid,{status:'mou_signed',mouDate:today,signedBy:signer,notes:'MOU acknowledged by '+signer+'. Ready for Participation Agreement.'});
  if(p.st==='verified')p.st='portfolio_queue';
  if(!pH[pid])pH[pid]=[];
  pH[pid].unshift({type:'MOU acknowledged',detail:'MOU signed by '+signer+'. Project stage → Portfolio Queue.',by:CU.name,ts:new Date().toLocaleString()});
  openContractPanel(pid);
}

function adminDispatchPA(pid){
  const p=FP.find(x=>x.id===pid);
  if(!p)return;
  const today=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  setCS(pid,{status:'contracting',notes:'Participation Agreement dispatched by bond counsel '+today+'. Awaiting utility legal review and execution.'});
  if(!pH[pid])pH[pid]=[];
  pH[pid].unshift({type:'Participation Agreement dispatched',detail:'Bond counsel dispatched PA to utility legal team.',by:CU.name,ts:new Date().toLocaleString()});
  openContractPanel(pid);
}

function adminRecordExecution(pid){
  const p=FP.find(x=>x.id===pid);
  if(!p)return;
  const today=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  setCS(pid,{status:'executed',notes:'Participation Agreement fully executed '+today+'. Project cleared for portfolio queue inclusion.'});
  if(!pH[pid])pH[pid]=[];
  pH[pid].unshift({type:'Participation Agreement executed',detail:'PA fully executed. Contracting complete.',by:CU.name,ts:new Date().toLocaleString()});
  openContractPanel(pid);
}

function adminAdvanceToQueue(pid){
  const p=FP.find(x=>x.id===pid);
  if(!p)return;
  p.st='portfolio_queue';
  const today=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  setCS(pid,{notes:getCS(pid).notes+' · Advanced to Portfolio Queue '+today+'.'});
  if(!pH[pid])pH[pid]=[];
  pH[pid].unshift({type:'Advanced to portfolio queue',detail:'Project formally entered Portfolio Queue. All contracting complete.',by:CU.name,ts:new Date().toLocaleString()});
  document.getElementById('tso').classList.remove('op');
  rPipe();
}

function rGenerateAdminMOU(pid){
  const p=FP.find(x=>x.id===pid);
  if(!p){alert('Project not found.');return;}
  const cs=getCS(pid);
  const ts=p.ts||{};
  const today=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const ps=p.ts&&p.ts.pillar_scores||{};
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Portfolio Participation MOU — ${p.org}</title>
<style>body{font-family:Georgia,serif;max-width:780px;margin:40px auto;padding:0 36px;color:#1a1a1a;line-height:1.8}
h1{font-size:20px;border-bottom:2px solid #1D9E75;padding-bottom:8px;color:#0A3028}h2{font-size:15px;color:#0A3028;margin-top:28px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:14px 0}.field{font-size:13px;padding:6px 0;border-bottom:1px solid #eee}
.label{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888}.val{font-weight:600}
.score-bar{height:6px;background:#e5e7eb;border-radius:3px;margin-top:3px}
.score-fill{height:6px;border-radius:3px;background:#1D9E75}
ol{padding-left:20px}li{margin-bottom:8px;font-size:13px}
.stamp{background:#f0faf6;border:1px solid #1D9E75;border-radius:6px;padding:12px 16px;margin-top:24px}
.sig{margin-top:48px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px}
.sig-line{border-top:1px solid #333;margin-top:52px;padding-top:6px;font-size:12px;color:#666}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #ccc;font-size:11px;color:#888}
</style></head><body>
<h1>Portfolio Participation Memorandum of Understanding</h1>
<p style="font-size:13px;color:#666">WaterFundable PBC · Portfolio 1 · Sacramento River Basin · <strong>CONFIDENTIAL — For legal review only</strong></p>
<h2>Parties</h2>
<div class="grid">
  <div class="field"><div class="label">Utility / Issuer</div><div class="val">${p.org}</div></div>
  <div class="field"><div class="label">Arranger</div><div class="val">WaterFundable PBC</div></div>
  <div class="field"><div class="label">Portfolio</div><div class="val">Portfolio 1 — Sacramento River Basin · $200M+ 144A Climate Water Bond</div></div>
  <div class="field"><div class="label">SRF Program</div><div class="val">${p.srf&&p.srf.type||'CWSRF'} · ${p.srf&&p.srf.num||'—'}</div></div>
</div>
<h2>BPBM Score verification — as agreed</h2>
<div class="grid">
  <div class="field"><div class="label">Total score</div><div class="val">${p.sc}/1,000</div></div>
  <div class="field"><div class="label">Rating equivalent</div><div class="val">${ts.score_equiv||'BBB+'}</div></div>
  <div class="field"><div class="label">Project allocation</div><div class="val">${ts.balloc||ts.co||'—'}</div></div>
  <div class="field"><div class="label">DSCR</div><div class="val">${ts.ds||'—'}</div></div>
  <div class="field"><div class="label">Impact Capital subsidy (est.)</div><div class="val">${ts.cws||'—'}</div></div>
  <div class="field"><div class="label">Water secured</div><div class="val">${ts.ws||'—'}</div></div>
</div>
<h2>Pillar scores</h2>
<table style="width:100%;border-collapse:collapse;font-size:12px">
<tr style="background:#f0faf6"><th style="text-align:left;padding:6px 8px;border-bottom:2px solid #1D9E75">Pillar</th><th style="padding:6px 8px;border-bottom:2px solid #1D9E75;text-align:right">Score</th><th style="padding:6px 8px;border-bottom:2px solid #1D9E75;text-align:right">Max</th><th style="padding:6px 8px;border-bottom:2px solid #1D9E75">Progress</th></tr>
${[['Financial strength','p1',250],['Technical readiness','p2',200],['SRF alignment','p3',150],['Blue Bond standards','p4',150],['Water & biodiversity impact','p5',150],['Basin priority','p6',50],['MRV readiness','p7',50]].map(([l,k,mx])=>`<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${l}</td><td style="padding:6px 8px;text-align:right;font-weight:600">${ps[k]||0}</td><td style="padding:6px 8px;text-align:right;color:#888">${mx}</td><td style="padding:6px 8px"><div class="score-bar"><div class="score-fill" style="width:${Math.round((ps[k]||0)/mx*100)}%"></div></div></td></tr>`).join('')}
</table>
<h2>Participation terms</h2>
<ol>
  <li>The BPBM score of <strong>${p.sc}/1,000</strong> and rating equivalent of <strong>${ts.score_equiv||'BBB+'}</strong> have been reviewed and accepted without dispute by both parties.</li>
  <li>${p.org} authorizes WaterFundable PBC to include this project in Portfolio 1 for purposes of the 144A private placement bond offering.</li>
  <li>The project allocation of <strong>${ts.balloc||ts.co||'—'}</strong> is subject to final bond pricing and portfolio balancing at close.</li>
  <li>The binding Participation Agreement, delivered separately by bond counsel, must be fully executed before any capital is committed. This MOU does not constitute a financial commitment by either party.</li>
  <li>Annual Tech B MRV reporting is accepted as a condition of participation. Full reporting obligations are specified in the Participation Agreement.</li>
  <li>The blended rate of approximately 3.0%–3.8% is an estimate subject to market conditions at pricing.</li>
</ol>
<h2>Contracting status record</h2>
<p style="font-size:13px">Offer issued: ${cs.inviteDate||'—'} &nbsp;|&nbsp; MOU acknowledged: ${cs.mouDate||'Pending'} &nbsp;|&nbsp; Signatory: ${cs.signedBy||'—'} &nbsp;|&nbsp; PA status: ${cs.status==='executed'?'Executed':cs.status==='contracting'?'In review':'Pending dispatch'}</p>
${cs.status==='mou_signed'||cs.status==='contracting'||cs.status==='executed'?`<div class="stamp"><strong style="color:#1D9E75">✓ MOU acknowledged</strong><br><span style="font-size:13px">Signed by: <strong>${cs.signedBy}</strong> · Date: <strong>${cs.mouDate}</strong><br>Utility: ${p.org} · Arranger: WaterFundable PBC</span></div>`:'<div class="stamp" style="background:#FFF8EC;border-color:#F0A500"><strong style="color:#8A5800">Pending utility acknowledgment</strong></div>'}
<div class="sig">
  <div><div class="sig-line">Utility authorized signatory · ${p.org}</div></div>
  <div><div class="sig-line">WaterFundable PBC authorized signatory</div></div>
  <div><div class="sig-line">Bond counsel · [Firm name]</div></div>
</div>
<div class="footer">Portfolio Participation MOU · WaterFundable PBC · Confidential · Generated ${today} · Not for public distribution</div>
</body></html>`;
  const blob=new Blob([html],{type:'text/html'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='WaterFundable_MOU_'+p.org.replace(/[\s,\/]+/g,'_').slice(0,30)+'_'+new Date().toISOString().slice(0,10)+'.html';
  a.click();
}
