import Chart from 'chart.js/auto';
import './style.css';

window.Chart = Chart;

/* ============ SCORING ============ */
const FACTORS={
  F1:{label:'Anomali Waktu Pelaporan',max:20},F2:{label:'Deviasi Nilai vs Estimasi',max:25},
  F3:{label:'Duplikasi Lintas Penyelenggara',max:25},F4:{label:'Profil Risiko Bengkel',max:15},
  F5:{label:'Riwayat Pemegang Polis',max:15},
};
const BANDS=[
  {min:80,label:'KRITIS',cls:'b-crit',rcls:'r-crit',reco:'Tahan pembayaran. Eskalasi segera ke SIU dan bekukan pengajuan terkait dalam 24 jam.'},
  {min:60,label:'TINGGI',cls:'b-high',rcls:'r-high',reco:'Wajib investigasi lanjutan sebelum keputusan. Verifikasi dokumen sumber dan konfirmasi silang ke bengkel.'},
  {min:40,label:'SEDANG',cls:'b-med',rcls:'r-med',reco:'Tinjauan manual penilai. Prioritaskan verifikasi faktor kontribusi terbesar.'},
  {min:0,label:'RENDAH',cls:'b-low',rcls:'r-low',reco:'Layak jalur cepat (fast-track). Proses setelah kelengkapan dokumen standar.'},
];
const band=s=>BANDS.find(b=>s>=b.min);
const bandColor=s=>s>=80?'#771c31':s>=60?'#a53049':s>=40?'#96690a':'#177a43';
let CLAIMS=[
  {id:1,nama:'NURI AGUS RAMDHANI',polis:'1222012012100051',no:'222012112000065',bengkel:'SAPPHIRE',nilai:706181,dol:'04 Maret 2025',status:'Menunggu',provider:'PT Asuransi Jaya',conf:94,f:{F1:18,F3:25,F4:12,F5:17},
   tl:[['Laporan Awal','04 Maret 2025'],['Dokumen Diterima','10 Maret 2025'],['Dokumen Lengkap','15 Maret 2025'],['SK Cabang Terbit','27 Juni 2025']]},
  {id:2,nama:'ANTON ABDURRACHMAN',polis:'1422012012100002',no:'222012112000024',bengkel:'SAPPHIRE',nilai:3500000,dol:'06 Juni 2025',status:'Disetujui',provider:'PT Asuransi Jaya',conf:88,f:{F2:10,F4:12,F5:13},
   tl:[['Laporan Awal','06 Juni 2025'],['Dokumen Lengkap','12 Juni 2025'],['Disetujui','20 Juni 2025']]},
  {id:3,nama:'ADE SENTOSA',polis:'1422012012100003',no:'222012112000026',bengkel:'SAPPHIRE',nilai:1000000,dol:'09 Mei 2025',status:'Disetujui',provider:'PT Asuransi Jaya',conf:90,f:{F2:10,F4:10,F5:8},
   tl:[['Laporan Awal','09 Mei 2025'],['Dokumen Lengkap','14 Mei 2025'],['Disetujui','22 Mei 2025']]},
  {id:4,nama:'YADI SUPRADIA',polis:'1422012012100004',no:'222012112000028',bengkel:'SAPPHIRE',nilai:2500000,dol:'12 Mei 2025',status:'Menunggu',provider:'PT Asuransi Jaya',conf:91,f:{F2:22,F4:15,F5:18},
   tl:[['Laporan Awal','12 Mei 2025'],['Dokumen Diterima','18 Mei 2025'],['Dokumen Lengkap','25 Mei 2025']]},
  {id:5,nama:'ALDY HERMAWAN',polis:'1422012012100005',no:'222012112000031',bengkel:'SAPPHIRE',nilai:4750000,dol:'20 Februari 2025',status:'Menunggu',provider:'PT Asuransi Jaya',conf:87,f:{F2:20,F4:10,F5:11},
   tl:[['Laporan Awal','20 Februari 2025'],['Dokumen Diterima','26 Februari 2025'],['Dokumen Lengkap','03 Maret 2025']]},
  {id:6,nama:'ALDY HERMAWAN',polis:'1222012012100051',no:'222012112000044',bengkel:'SAPPHIRE',nilai:8900000,dol:'11 April 2025',status:'Menunggu',provider:'PT Asuransi Jaya',conf:95,f:{F2:23,F3:25,F5:20},
   tl:[['Laporan Awal','11 April 2025'],['Dokumen Diterima','15 April 2025'],['Dokumen Lengkap','22 April 2025']]},
  {id:7,nama:'ALFIN MUGRIHA',polis:'1422012012100002',no:'222012112000004',bengkel:'DIAMOND AUTO',nilai:6200000,dol:'02 Mei 2025',status:'Menunggu',provider:'PT Asuransi Jaya',conf:86,f:{F2:19,F4:8,F5:20},
   tl:[['Laporan Awal','02 Mei 2025'],['Dokumen Diterima','08 Mei 2025'],['Dokumen Lengkap','16 Mei 2025']]},
  {id:8,nama:'WENDY HUSMAN N',polis:'1422012012100006',no:'222012112040004',bengkel:'SAPPHIRE',nilai:9401000,dol:'19 Mei 2025',status:'Menunggu',provider:'PT Asuransi Jaya',conf:93,f:{F3:25,F4:14,F5:23},
   tl:[['Laporan Awal','19 Mei 2025'],['Dokumen Diterima','24 Mei 2025'],['Dokumen Lengkap','30 Mei 2025']]},
  {id:9,nama:'RINA MARLINA',polis:'1422012012100007',no:'222012112000052',bengkel:'DIAMOND AUTO',nilai:1850000,dol:'25 Juni 2025',status:'Disetujui',provider:'PT Asuransi Jaya',conf:89,f:{F2:6,F4:6,F5:10},
   tl:[['Laporan Awal','25 Juni 2025'],['Dokumen Lengkap','29 Juni 2025'],['Disetujui','02 Juli 2025']]},
];
CLAIMS.forEach(c=>c.risk=Object.values(c.f).reduce((a,b)=>a+b,0));

const CASES=[
  {id:'SIU-2026-041',subj:'NURI AGUS RAMDHANI',ref:'222012112000065',pri:1,inv:'D. Prasetyo',sla:'22 jam',nilai:706181,status:'Investigasi Lapangan'},
  {id:'SIU-2026-040',subj:'ALDY HERMAWAN',ref:'222012112000044',pri:1,inv:'R. Wulandari',sla:'2 hari',nilai:8900000,status:'Analisis Dokumen'},
  {id:'SIU-2026-038',subj:'WENDY HUSMAN N',ref:'222012112040004',pri:2,inv:'D. Prasetyo',sla:'5 hari',nilai:9401000,status:'Konfirmasi Bengkel'},
  {id:'SIU-2026-035',subj:'BENGKEL SAPPHIRE',ref:'AUDIT-LAPANGAN',pri:3,inv:'Tim Audit Gabungan',sla:'9 hari',nilai:4750000,status:'Penjadwalan Audit'},
];

const USERS={
  insurer:{nama:'Administrator Klaim',org:'PT Asuransi Jaya',role:'PERUSAHAAN ASURANSI',sub:'PORTAL PENYELENGGARA',uname:'admin.jaya',
    nav:[['pg-exec','▦','Executive Summary'],['pg-ops','◍','Command Center'],['pg-claims','☰','Daftar Klaim'],['pg-cases','◈','Case Intelligence'],['pg-sim','∿','Threshold Simulator'],['pg-feeds','⇄','Data Integration'],['pg-monitor','◉','Monitoring'],['pg-ledger','▣','Ledger & Security'],['pg-sla','◎','Reports & SLA']],home:'pg-exec'},
  adjuster:{nama:'Budi Santoso, AAIK',org:'Penilai Klaim Tersertifikasi',role:'PENILAI KLAIM',sub:'PORTAL PENILAI',uname:'b.santoso',
    nav:[['pg-queue','☰','Antrean Penilaian'],['pg-feeds','⇄','Data Integration'],['pg-monitor','◉','Monitoring']],home:'pg-queue'},
  regulator:{nama:'Direktorat Pengawasan IKNB',org:'Otoritas Jasa Keuangan',role:'PENGAWAS',sub:'PORTAL PENGAWASAN',uname:'ojk.iknb',
    nav:[['pg-regulator','▦','Pengawasan'],['pg-ops','◍','Command Center'],['pg-audit','≡','Audit Trail'],['pg-ledger','▣','Ledger & Security'],['pg-monitor','◉','Monitoring'],['pg-feeds','⇄','Data Integration']],home:'pg-regulator'},
  nasabah:{nama:'Nuri Agus Ramdhani',org:'Pemegang Polis Perorangan',role:'PEMEGANG POLIS',sub:'PORTAL PEMEGANG POLIS',uname:'nuri.agus',
    nav:[['pg-mine','▦','Polis & Klaim Saya']],home:'pg-mine'},
  aaui:{nama:'Sekretariat AAUI',org:'Asosiasi Asuransi Umum Indonesia',role:'ASOSIASI',sub:'PORTAL ASOSIASI INDUSTRI',uname:'aaui.sekretariat',
    nav:[['pg-aaui','▦','Industry Overview'],['pg-registry','☰','Industry Claim Registry'],['pg-ledger','▣','Ledger & Security'],['pg-monitor','◉','Monitoring']],home:'pg-aaui'},
};
let currentUser=null,currentPage=null;
const N_GLYPH='<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg"><path d="M6 5 L47 49 L47 105 L6 105 Z" fill="currentColor"/><path d="M53 5 H94 V105 L53 53 Z" fill="currentColor"/></svg>';
const OJK_MINI='<svg width="62" height="30" viewBox="0 0 200 84" xmlns="http://www.w3.org/2000/svg"><path d="M8 30 C40 8 84 4 118 14 C96 17 68 25 52 36 C36 29 20 28 8 30 Z" fill="#d81f2a"/><path d="M26 23 C62 9 104 9 132 20 C110 19 82 24 64 32 C50 26 36 23 26 23 Z" fill="#d8dadd"/><text x="4" y="76" font-family="Arial,Helvetica,sans-serif" font-size="54" font-weight="900" font-style="italic" fill="#c41722">OJK</text></svg>';
function setTopMark(role){
  const tm=document.getElementById('topMark');
  if(role==='regulator'){
    tm.style.width='auto';tm.style.borderRadius='9px';tm.style.padding='4px 9px';tm.style.background='#fff';
    tm.innerHTML=OJK_MINI;
  }else{
    tm.style.width='';tm.style.borderRadius='';tm.style.padding='';tm.style.background='';
    tm.innerHTML=N_GLYPH;
  }
}
const fmtIDR=n=>'Rp'+n.toLocaleString('id-ID');
const statusClass=s=>({'Menunggu':'s-pending','Disetujui':'s-approved','Ditolak':'s-rejected','Investigasi':'s-invest'})[s];
function fakeHash(seed){let h='';const c='0123456789abcdef';let x=seed*2654435761%4294967296;
  for(let i=0;i<64;i++){x=(x*1103515245+12345)%2147483648;h+=c[x%16];}return h;}
function now(){return new Date().toLocaleString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});}
function nowT(){return new Date().toLocaleTimeString('id-ID');}
function spark(points,color,w=72,h=26){
  const max=Math.max(...points),min=Math.min(...points);
  const pts=points.map((p,i)=>`${(i/(points.length-1)*w).toFixed(1)},${(h-3-((p-min)/(max-min||1))*(h-6)).toFixed(1)}`).join(' ');
  return `<svg width="${w}" height="${h}"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}

/* ============ AUDIT ============ */
const AUDIT=[
  {w:'02/07/2026, 09.14.05',a:'system',p:'SISTEM',aksi:'SCORING_COMPLETE',obj:'222012112000052',ket:'Skor 22/100 (RENDAH) · confidence 89% · fast-track'},
  {w:'01/07/2026, 15.31.44',a:'system',p:'SISTEM',aksi:'BATCH_ANCHOR',obj:'#1842',ket:'17 dokumen · validators IDRN+OJK+AAUI'},
  {w:'20/06/2026, 10.44.12',a:'b.santoso',p:'PENILAI KLAIM',aksi:'KLAIM_DISETUJUI',obj:'222012112000024',ket:'Dokumen lengkap; nilai sesuai estimasi'},
  {w:'19/05/2026, 16.20.47',a:'system',p:'SISTEM',aksi:'DETEKSI_KLAIM_GANDA',obj:'WENDY HUSMAN N',ket:'Pengajuan serupa pada 2 penyelenggara (feed AAUI)'},
];
function audit(aksi,obj,ket){
  AUDIT.unshift({w:now(),a:currentUser?currentUser.uname:'anonim',p:currentUser?currentUser.role:'—',aksi,obj,ket});
  renderAudit();
}
function renderAudit(){
  const tb=document.getElementById('auditRows');if(!tb)return;
  const c=document.getElementById('auditCount');if(c)c.textContent=AUDIT.length+' entri · di-anchor tiap 10 menit';
  tb.innerHTML=AUDIT.map(e=>`<tr><td class="mono" style="white-space:nowrap">${e.w}</td><td class="mono">${e.a}</td>
    <td><span class="status s-invest" style="font-size:9px">${e.p}</span></td><td><b style="font-size:12px">${e.aksi}</b></td>
    <td class="mono">${e.obj}</td><td style="color:var(--muted);font-size:12px">${e.ket}</td></tr>`).join('');
}
function toast(title,msg,type='info'){
  const t=document.createElement('div');t.className='toast '+type;
  t.innerHTML=`<b>${title}</b><span>${msg}</span>`;
  document.getElementById('toasts').appendChild(t);
  setTimeout(()=>{t.classList.add('bye');setTimeout(()=>t.remove(),350)},4200);
}
function animateCounters(root){
  root.querySelectorAll('[data-count]').forEach(el=>{
    if(el.dataset.done)return;el.dataset.done=1;
    const target=+el.dataset.count,dur=900,t0=performance.now();
    function tick(t){const p=Math.min((t-t0)/dur,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3))).toLocaleString('id-ID');
      if(p<1)requestAnimationFrame(tick);}
    requestAnimationFrame(tick);
  });
}
function animateMoney(el,target,dur=1600){
  const t0=performance.now();
  function tick(t){const p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);
    el.textContent='Rp'+Math.round(target*e).toLocaleString('id-ID');
    if(p<1)requestAnimationFrame(tick);}
  requestAnimationFrame(tick);
}

/* ============ LOGIN ============ */
let pendingRole=null;
document.querySelectorAll('.demo-btn').forEach(b=>b.addEventListener('click',()=>{
  pendingRole=b.dataset.role;
  document.getElementById('inUser').value=USERS[pendingRole].uname;
  document.getElementById('inPass').value='••••••••••';
}));
document.getElementById('loginForm').addEventListener('submit',e=>{
  e.preventDefault();
  if(!document.getElementById('inUser').value){toast('Autentikasi gagal','Pilih akun demonstrasi terlebih dahulu.','err');return;}
  const btn=document.getElementById('btnLogin');
  btn.disabled=true;btn.textContent='Memverifikasi kredensial…';
  setTimeout(()=>{btn.disabled=false;btn.textContent='Masuk';enter(pendingRole||'insurer');},850);
});
function enter(role){
  currentUser=USERS[role];
  document.getElementById('page-login').style.display='none';
  document.getElementById('app').style.display='block';
  document.getElementById('whoName').textContent=currentUser.nama;
  document.getElementById('whoOrg').textContent=currentUser.org;
  document.getElementById('whoRole').textContent=currentUser.role;
  document.getElementById('appSubtitle').textContent=currentUser.sub;
  setTopMark(role);
  buildSidebar();showPage(currentUser.home);
  audit('MASUK_SISTEM','sesi-'+Math.floor(Math.random()*9000+1000),'Autentikasi MFA berhasil — '+currentUser.role);
  toast('Autentikasi berhasil','Sesi ber-MFA aktif. Selamat bekerja, '+currentUser.nama+'.','ok');
  startLive();
  document.getElementById('copFab').style.display=(role==='nasabah')?'none':'flex';
}
function logout(){
  audit('KELUAR_SISTEM','—','Sesi diakhiri pengguna');
  currentUser=null;pendingRole=null;stopLive();
  document.getElementById('copFab').style.display='none';
  document.getElementById('copPanel').classList.remove('show');
  document.getElementById('app').style.display='none';
  document.getElementById('page-login').style.display='flex';
  document.getElementById('inUser').value='';document.getElementById('inPass').value='';
}
function buildSidebar(){
  const pend=CLAIMS.filter(c=>c.status==='Menunggu').length;
  document.getElementById('sidebar').innerHTML='<div class="nav-label">NAVIGASI</div>'+
    currentUser.nav.map(([id,ic,label])=>
      `<button class="nav-item" data-pg="${id}" onclick="showPage('${id}')"><span class="ic">${ic}</span>${label}
       ${id==='pg-queue'&&pend?`<span class="nav-badge">${pend}</span>`:''}
       ${id==='pg-cases'?`<span class="nav-badge">${CASES.length}</span>`:''}</button>`).join('')
    +`<div class="side-meta">Model scoring <b>IDRN-RS v2.1</b><br>SLA 99,95% · MFA aktif<br>Ledger anchor setiap 10 menit<br><br>
      <b>Dukungan 24/7</b><br>Manajer akun khusus<br>Respons kritis &lt; 15 menit</div>`;
}
const inited=new Set();
function showPage(id){
  currentPage=id;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('on',n.dataset.pg===id));
  const pg=document.getElementById(id);
  animateCounters(pg);
  if(id==='pg-exec'&&!inited.has(id))initExec();
  if(id==='pg-claims')renderTable();
  if(id==='pg-cases')renderCases();
  if(id==='pg-queue')renderQueue();
  if(id==='pg-regulator'&&!inited.has(id)){initNet();initProvChart();renderDbl();}
  if(id==='pg-audit')renderAudit();
  if(id==='pg-feeds'&&!inited.has(id))renderFeeds();
  if(id==='pg-monitor'&&!inited.has(id))initMonitor();
  if(id==='pg-ledger'&&!inited.has(id))renderLedger();
  if(id==='pg-sla'&&!inited.has(id))renderSLA();
  if(id==='pg-ops'&&!inited.has(id))initOps();
  if(id==='pg-sim'&&!inited.has(id))initSim();
  if(id==='pg-aaui'&&!inited.has(id))initAaui();
  if(id==='pg-registry'&&!inited.has(id)){renderRegistry();document.getElementById('regSearch').addEventListener('input',e=>renderRegistry(e.target.value));}
  if(id==='pg-mine'&&!inited.has(id)){renderMyPolicies();renderMyClaims();}
  inited.add(id);
}

/* ============ EXEC ============ */
function initExec(){
  animateMoney(document.getElementById('vhMoney'),4283500000);
  document.getElementById('briefTime').textContent=nowT();
  document.getElementById('sp1').innerHTML=spark([4,6,5,9,7,3,9],'#1d4b85');
  document.getElementById('sp2').innerHTML=spark([1,2,1,3,2,1,3],'#a53049');
  document.getElementById('sp3').innerHTML=spark([8,7,9,6,7,6,6],'#96690a');
  document.getElementById('sp4').innerHTML=spark([58,56,55,52,50,49,48],'#a5842e');
  document.getElementById('spw1').innerHTML=spark([44,48,52,58,63,68,71],'#a53049',110,30);
  document.getElementById('spw2').innerHTML=spark([31,35,42,50,58,64,68],'#a53049',110,30);
  document.getElementById('spw3').innerHTML=spark([40,45,49,58,64,70,72],'#a53049',110,30);
  Chart.defaults.color='#5b6a80';Chart.defaults.font.family="'Segoe UI',Inter,sans-serif";Chart.defaults.font.size=11;
  new Chart(document.getElementById('lossChart'),{
    data:{labels:['Jan','Feb','Mar','Apr','Mei','Jun'],datasets:[
      {type:'bar',label:'Premi (Rp jt)',data:[420,435,448,441,462,478],backgroundColor:'#1d4b85',borderRadius:5,barPercentage:.55,order:2},
      {type:'bar',label:'Klaim Dibayar (Rp jt)',data:[310,298,301,285,295,297],backgroundColor:'#b9c6da',borderRadius:5,barPercentage:.55,order:2},
      {type:'line',label:'Loss Ratio (%)',data:[73.8,68.5,67.2,64.6,63.9,62.1],borderColor:'#a5842e',backgroundColor:'#a5842e',tension:.35,pointRadius:4,yAxisID:'y2',order:1}]},
    options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
      plugins:{legend:{labels:{usePointStyle:true,pointStyleWidth:8,padding:14}},tooltip:{backgroundColor:'#0b1f3d',padding:11,cornerRadius:7}},
      scales:{x:{grid:{display:false}},y:{grid:{color:'#eef1f6'},title:{display:false}},
        y2:{position:'right',grid:{display:false},suggestedMin:50,suggestedMax:80,ticks:{callback:v=>v+'%'}}}}});
}

/* ============ TABLE ============ */
let filter='all';
function renderTable(){
  const tb=document.getElementById('claimRows');if(!tb)return;
  const rows=CLAIMS.filter(c=>filter==='all'||c.status===filter).sort((a,b)=>b.risk-a.risk);
  document.getElementById('claimCount').textContent=rows.length+' klaim · diurutkan skor tertinggi';
  const kp=document.getElementById('kpiPending');if(kp)kp.textContent=CLAIMS.filter(c=>c.status==='Menunggu').length;
  tb.innerHTML=rows.map(c=>{
    const b=band(c.risk);
    return `<tr class="rowlink" onclick="openDoc(${c.id})">
      <td><b>${c.nama}</b><br><span style="color:var(--dim);font-size:11.5px">Polis ${c.polis}</span></td>
      <td class="mono">${c.no}</td>
      <td><b>${fmtIDR(c.nilai)}</b></td>
      <td>${c.dol}</td>
      <td><div class="score-line"><b style="color:${bandColor(c.risk)}">${c.risk}</b><span>/ 100</span></div>
        <div class="conf" style="font-size:10.5px">confidence ${c.conf}%</div></td>
      <td><span class="band ${b.cls}">${b.label}</span></td>
      <td><span class="status ${statusClass(c.status)}">${c.status.toUpperCase()}</span></td></tr>`;}).join('');
}
document.getElementById('statusChips').addEventListener('click',e=>{
  const c=e.target.closest('.chip');if(!c)return;
  document.querySelectorAll('#statusChips .chip').forEach(x=>x.classList.toggle('on',x===c));
  filter=c.dataset.f;renderTable();
});

/* ============ CASES ============ */
function renderCases(){
  document.getElementById('caseActive').textContent=CASES.length;
  document.getElementById('caseRows').innerHTML=CASES.map((k,i)=>`
    <tr>
      <td class="mono">${k.id}</td>
      <td><b>${k.subj}</b><br><span class="mono" style="font-size:10.5px">${k.ref}</span></td>
      <td><span class="case-pri p${k.pri}">P${k.pri}</span></td>
      <td>${k.inv}</td>
      <td><span class="sla-chip" style="color:${k.pri===1?'var(--red)':'var(--amber)'}">${k.sla}</span></td>
      <td><b>${fmtIDR(k.nilai)}</b></td>
      <td><span class="status s-invest">${k.status.toUpperCase()}</span></td>
      <td><button class="btn" style="padding:6px 12px;font-size:11.5px" onclick="caseNote(${i})">Catat Perkembangan</button></td>
    </tr>`).join('');
}
function caseNote(i){
  const k=CASES[i];
  audit('PERKEMBANGAN_KASUS',k.id,'Pembaruan status: '+k.status+' — dicatat investigator');
  pushLive('info','Perkembangan kasus '+k.id+' dicatat');
  toast('Perkembangan tercatat',k.id+' — '+k.subj+'. Timeline kasus diperbarui.','ok');
}

/* ============ SCORE WIDGETS ============ */
function factorBreakdown(c){
  return Object.entries(c.f).map(([k,v])=>{
    const F=FACTORS[k];
    return `<div class="factor">
      <div class="fl">${F.label}<small>${k} · bobot maks ${F.max}</small></div>
      <div class="fbar"><i data-w="${v/F.max*100}" style="background:${bandColor(c.risk)}"></i></div>
      <div class="fval" style="color:${bandColor(c.risk)}">+${v}</div></div>`;}).join('');
}
function recoBox(c){const b=band(c.risk);
  return `<div class="reco ${b.rcls}"><b>System Recommendation — Band ${b.label}</b>${b.reco}</div>`;}
function animateFbars(root){
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    root.querySelectorAll('.fbar i').forEach(i=>i.style.width=i.dataset.w+'%');}));
}

/* ============ BERKAS ============ */
function openDoc(id){
  const c=CLAIMS.find(x=>x.id===id);
  const b=band(c.risk);const circ=2*Math.PI*46;
  const claimAudit=AUDIT.filter(e=>e.obj===c.no).slice(0,6);
  document.getElementById('docModal').innerHTML=`
    <div class="modal-head"><h3>BERKAS KLAIM — ${c.no}</h3>
      <div style="display:flex;gap:11px;align-items:center">
        <span class="status ${statusClass(c.status)}">${c.status.toUpperCase()}</span>
        <button class="modal-close" onclick="closeDoc()">✕</button></div></div>
    <div class="modal-body">
      <div style="display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap">
        <div>
          <h2 style="font-family:var(--serif);font-size:21px;color:var(--navy)">${c.nama}</h2>
          <div style="color:var(--muted);font-size:12.5px;margin-top:3px">Polis <span class="mono">${c.polis}</span> · ${c.provider}</div>
          <div style="margin-top:9px;display:flex;gap:7px;flex-wrap:wrap">
            <span class="status s-invest">KERUSAKAN</span>
            <span class="status" style="color:var(--navy-2);background:#eef4fb;border:1px solid #cdddf1">${c.bengkel}</span>
            <span class="band ${b.cls}">BAND ${b.label}</span></div>
          <div class="conf" style="margin-top:12px">Model <b>IDRN-RS v2.1</b> · confidence <b>${c.conf}%</b> · evaluasi ulang otomatis pada dokumen baru</div>
        </div>
        <div class="gauge">
          <svg width="114" height="114">
            <circle cx="57" cy="57" r="46" fill="none" stroke="#eef1f6" stroke-width="9"/>
            <circle id="gArc" cx="57" cy="57" r="46" fill="none" stroke="${bandColor(c.risk)}" stroke-width="9"
              stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ}" style="transition:stroke-dashoffset 1s ease"/></svg>
          <div class="gauge-num"><div><b style="color:${bandColor(c.risk)}">${c.risk}</b><small> / 100</small><span>RISK SCORE</span></div></div>
        </div>
      </div>
      <div class="kv">
        <div><label>NILAI PENGAJUAN</label><b>${fmtIDR(c.nilai)}</b></div>
        <div><label>TANGGAL KERUGIAN</label><b>${c.dol}</b></div>
        <div><label>PERIODE POLIS</label><b>29 Des 2023 — 16 Des 2028</b></div>
        <div><label>PERTANGGUNGAN</label><b>Kendaraan Bermotor — Comprehensive</b></div>
      </div>
      <div class="sect-label">SCORE DECOMPOSITION — ${Object.keys(c.f).length} CONTRIBUTING FACTORS</div>
      ${factorBreakdown(c)}
      <div class="factor" style="border-top:2px solid var(--line);border-bottom:0;margin-top:2px">
        <div class="fl" style="font-weight:700">FINAL SCORE</div><div></div>
        <div class="fval" style="font-family:var(--serif);font-size:17px;color:${bandColor(c.risk)}">${c.risk} / 100</div></div>
      ${recoBox(c)}
      <div class="sect-label">KRONOLOGI DOKUMEN</div>
      ${c.tl.map(([t,d])=>`<div class="tl-row"><b>${t}</b><span>${d}</span></div>`).join('')}
      <div class="sect-label">DOCUMENT INTEGRITY — LEDGER ANCHOR</div>
      <div class="hashbox">
        <label style="font-size:9.5px;letter-spacing:1.4px;color:var(--dim);font-weight:700">SHA-256 DIGITAL FINGERPRINT</label>
        <code style="display:block;margin-top:6px">${fakeHash(c.id)}</code>
        <div style="font-size:11.5px;color:var(--dim);margin-top:8px">Batch <span class="mono">#18${240+c.id}</span> · validators: IDRN + OJK + AAUI</div>
        <button class="btn btn-navy" id="vBtn" style="margin-top:11px" onclick="verifyDoc(${c.id})">Verify Integrity</button>
        <div id="vResult"></div>
      </div>
      <div class="sect-label">AUDIT TRAIL BERKAS INI</div>
      ${claimAudit.length?claimAudit.map(e=>`<div class="tl-row"><div><b>${e.aksi}</b> · <span class="mono" style="font-size:11px">${e.a}</span>
        <div style="color:var(--muted);font-size:11.5px">${e.ket}</div></div><span>${e.w}</span></div>`).join('')
        :'<div style="color:var(--dim);font-size:12.5px">Belum ada aktivitas tercatat pada sesi berjalan.</div>'}
    </div>`;
  document.getElementById('ovDoc').classList.add('show');
  audit('BERKAS_DIBUKA',c.no,'Skor '+c.risk+'/100 ('+b.label+') ditinjau');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.getElementById('gArc').style.strokeDashoffset=circ*(1-c.risk/100);}));
  animateFbars(document.getElementById('docModal'));
}
function closeDoc(){document.getElementById('ovDoc').classList.remove('show');}
document.getElementById('ovDoc').addEventListener('click',e=>{if(e.target.id==='ovDoc')closeDoc();});
function verifyDoc(id){
  const c=CLAIMS.find(x=>x.id===id);
  const btn=document.getElementById('vBtn');
  btn.disabled=true;btn.textContent='Memverifikasi Merkle proof…';
  setTimeout(()=>{
    btn.style.display='none';
    document.getElementById('vResult').innerHTML=
      `<div class="verify-ok"><b>Integrity verified.</b> Digital fingerprint identik dengan Merkle root batch <span class="mono">#18${240+id}</span>, divalidasi 3 pihak · ${now()}</div>`;
    audit('INTEGRITY_VERIFICATION',c.no,'Merkle proof valid — batch #18'+(240+id));
    toast('Integrity verified','Dokumen tidak berubah sejak dicatatkan.','ok');
  },1300);
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeDoc();closeDec();closeCmd();}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&currentUser){e.preventDefault();openCmd();}
});

/* ============ QUEUE ============ */
const TOTAL_Q=CLAIMS.filter(c=>c.status==='Menunggu').length;
function renderQueue(){
  const el=document.getElementById('queue');if(!el)return;
  const q=CLAIMS.filter(c=>c.status==='Menunggu').sort((a,b)=>b.risk-a.risk);
  document.getElementById('qStat').textContent=`${TOTAL_Q-q.length} dari ${TOTAL_Q} klaim diputuskan · ${q.length} menunggu · SLA 48 jam per klaim`;
  document.getElementById('qProg').style.width=((TOTAL_Q-q.length)/TOTAL_Q*100)+'%';
  document.getElementById('qEmpty').style.display=q.length?'none':'block';
  el.innerHTML=q.map(c=>{
    const b=band(c.risk);
    return `<div class="q-item" id="qi-${c.id}">
      <div class="q-top" onclick="toggleQ(${c.id})">
        <div class="q-score" style="color:${bandColor(c.risk)};border-color:${bandColor(c.risk)};background:${c.risk>=60?'var(--red-bg)':c.risk>=40?'var(--amber-bg)':'var(--green-bg)'}">
          <div><b>${c.risk}</b><br><small>/100</small></div></div>
        <div class="q-meta">
          <span class="mono">${c.no}</span> <span class="band ${b.cls}" style="margin-left:5px">${b.label}</span>
          <h4>${c.nama}</h4>
          <small>Polis ${c.polis} · ${c.bengkel} · ${c.dol} · confidence ${c.conf}%</small></div>
        <div class="q-amt">${fmtIDR(c.nilai)}</div><span class="q-caret">▼</span></div>
      <div class="q-body"><div class="q-body-inner">
        <div class="sect-label" style="margin-top:14px">SCORE DECOMPOSITION</div>
        ${factorBreakdown(c)}
        ${recoBox(c)}
        <div class="actions">
          <button class="btn btn-approve" onclick="openDec(${c.id},'Disetujui')">Setujui Klaim</button>
          <button class="btn btn-reject" onclick="openDec(${c.id},'Ditolak')">Tolak Klaim</button>
          <button class="btn btn-invest" onclick="openDec(${c.id},'Investigasi')">Eskalasi SIU</button>
          <button class="btn" onclick="openDoc(${c.id})">Buka Berkas</button>
        </div></div></div></div>`;}).join('');
}
function toggleQ(id){
  const el=document.getElementById('qi-'+id);
  el.classList.toggle('open');
  if(el.classList.contains('open'))animateFbars(el);
}

/* ============ DECISION ============ */
let decCtx=null;
function openDec(id,action){
  const c=CLAIMS.find(x=>x.id===id);decCtx={id,action};
  const label={'Disetujui':'Persetujuan Klaim','Ditolak':'Penolakan Klaim','Investigasi':'Eskalasi Investigasi'}[action];
  document.getElementById('decTitle').textContent='Konfirmasi '+label;
  document.getElementById('decSum').innerHTML=
    `<b>${c.nama}</b> · <span class="mono">${c.no}</span><br>
     <span style="color:var(--muted)">${fmtIDR(c.nilai)} · skor <b style="color:${bandColor(c.risk)}">${c.risk}/100 (${band(c.risk).label})</b> · confidence ${c.conf}%</span><br>
     <span style="color:var(--muted);font-size:12px">Keputusan: <b style="color:var(--ink)">${action.toUpperCase()}</b> — final, tercatat permanen, di-anchor ke ledger.</span>`;
  document.getElementById('decReason').value='';
  document.getElementById('decErr').style.display='none';
  document.getElementById('ovDec').classList.add('show');
  setTimeout(()=>document.getElementById('decReason').focus(),100);
}
function closeDec(){document.getElementById('ovDec').classList.remove('show');decCtx=null;}
document.getElementById('ovDec').addEventListener('click',e=>{if(e.target.id==='ovDec')closeDec();});
document.getElementById('decConfirm').addEventListener('click',()=>{
  if(!decCtx)return;
  const reason=document.getElementById('decReason').value.trim();
  if(reason.length<10){document.getElementById('decErr').style.display='block';return;}
  const c=CLAIMS.find(x=>x.id===decCtx.id);
  c.status=decCtx.action;
  c.tl.push([{'Disetujui':'Disetujui Penilai','Ditolak':'Ditolak Penilai','Investigasi':'Eskalasi ke SIU'}[decCtx.action],now().split(',')[0]]);
  audit({'Disetujui':'KLAIM_DISETUJUI','Ditolak':'KLAIM_DITOLAK','Investigasi':'ESKALASI_INVESTIGASI'}[decCtx.action],c.no,reason);
  pushLive(decCtx.action==='Disetujui'?'ok':decCtx.action==='Ditolak'?'err':'warn',
    `Keputusan ${decCtx.action.toUpperCase()} — ${c.no} oleh ${currentUser.uname}`);
  const card=document.getElementById('qi-'+decCtx.id);if(card)card.classList.add('leaving');
  const tMap={'Disetujui':['Klaim disetujui',`${c.no} — pembayaran ${fmtIDR(c.nilai)} diproses.`,'ok'],
    'Ditolak':['Klaim ditolak',`${c.no} — pemberitahuan resmi beserta dasar dikirim.`,'err'],
    'Investigasi':['Eskalasi tercatat',`${c.no} — kasus SIU baru dibuka otomatis.`,'info']};
  toast(...tMap[decCtx.action]);closeDec();
  if(decCtx.action==='Investigasi'){
    CASES.unshift({id:'SIU-2026-0'+(42+CASES.length),subj:c.nama,ref:c.no,pri:c.risk>=70?1:2,inv:'Belum ditugaskan',sla:'48 jam',nilai:c.nilai,status:'Kasus Baru'});
  }
  setTimeout(()=>{renderQueue();renderTable();buildSidebar();
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('on',n.dataset.pg===currentPage));},380);
});

/* ============ REGULATOR NET ============ */
const NODES=[
  {id:'jaya',x:250,y:100,r:25,c:'#2458a6',label:'PT Asuransi Jaya',type:'Penyelenggara',info:'9 klaim · rata-rata 48/100'},
  {id:'berkah',x:650,y:100,r:25,c:'#2458a6',label:'PT Asuransi Berkah',type:'Penyelenggara',info:'7 klaim · rata-rata 52/100'},
  {id:'nuri',x:450,y:48,r:18,c:'#a53049',label:'Nuri Agus R.',type:'Terindikasi klaim ganda',info:'3 klaim · skor 72/100'},
  {id:'aldy',x:450,y:168,r:18,c:'#a53049',label:'Aldy Hermawan',type:'Terindikasi klaim ganda',info:'3 klaim · skor 68/100'},
  {id:'wendy',x:450,y:272,r:16,c:'#a53049',label:'Wendy Husman',type:'Terindikasi klaim ganda',info:'2 klaim · skor 62/100'},
  {id:'sapphire',x:118,y:238,r:19,c:'#a5842e',label:'SAPPHIRE',type:'Bengkel rekanan',info:'7 klaim · 4 berisiko tinggi (F4)'},
  {id:'diamond',x:792,y:238,r:16,c:'#a5842e',label:'DIAMOND AUTO',type:'Bengkel rekanan',info:'3 klaim · tanpa temuan'},
  {id:'anton',x:104,y:58,r:11,c:'#7d8aa3',label:'Anton A.',type:'Pemegang polis',info:'1 klaim · 35/100'},
  {id:'rina',x:800,y:54,r:11,c:'#7d8aa3',label:'Rina M.',type:'Pemegang polis',info:'1 klaim · 22/100'},
];
const EDGES=[['nuri','jaya',1],['nuri','berkah',1],['aldy','jaya',1],['aldy','berkah',1],['wendy','jaya',1],['wendy','berkah',1],
  ['jaya','sapphire',0],['berkah','diamond',0],['berkah','sapphire',1],['anton','jaya',0],['rina','berkah',0]];
let selNode=null;
function initNet(){
  const svg=document.getElementById('net'),tip=document.getElementById('netTip'),ns='http://www.w3.org/2000/svg';
  const find=id=>NODES.find(n=>n.id===id);
  EDGES.forEach(([a,b,hot])=>{
    const A=find(a),B=find(b),l=document.createElementNS(ns,'line');
    l.setAttribute('x1',A.x);l.setAttribute('y1',A.y);l.setAttribute('x2',B.x);l.setAttribute('y2',B.y);
    l.setAttribute('stroke',hot?'rgba(165,48,73,.5)':'rgba(91,106,128,.28)');
    l.setAttribute('stroke-width',hot?1.8:1.2);
    if(hot)l.setAttribute('stroke-dasharray','5 4');
    l.dataset.a=a;l.dataset.b=b;l.style.transition='opacity .25s';svg.appendChild(l);
  });
  NODES.forEach(n=>{
    const g=document.createElementNS(ns,'g');g.dataset.id=n.id;g.style.cursor='pointer';g.style.transition='opacity .25s';
    const c=document.createElementNS(ns,'circle');
    c.setAttribute('cx',n.x);c.setAttribute('cy',n.y);c.setAttribute('r',n.r);
    c.setAttribute('fill',n.c);c.setAttribute('fill-opacity','.14');c.setAttribute('stroke',n.c);c.setAttribute('stroke-width','1.8');
    g.appendChild(c);
    const t=document.createElementNS(ns,'text');
    t.setAttribute('x',n.x);t.setAttribute('y',n.y+n.r+13);t.setAttribute('class','net-label');t.textContent=n.label;g.appendChild(t);
    g.addEventListener('mousemove',e=>{
      const rect=svg.parentElement.getBoundingClientRect();
      tip.style.left=(e.clientX-rect.left+14)+'px';tip.style.top=(e.clientY-rect.top-8)+'px';tip.style.opacity=1;
      tip.innerHTML=`<b>${n.label}</b><span>${n.type}<br>${n.info}</span>`;});
    g.addEventListener('mouseleave',()=>tip.style.opacity=0);
    g.addEventListener('click',()=>{
      selNode=selNode===n.id?null:n.id;
      const conn=new Set([n.id]);
      EDGES.forEach(([a,b])=>{if(a===n.id)conn.add(b);if(b===n.id)conn.add(a);});
      svg.querySelectorAll('g').forEach(el=>el.style.opacity=!selNode||conn.has(el.dataset.id)?1:.15);
      svg.querySelectorAll('line').forEach(el=>el.style.opacity=!selNode||(el.dataset.a===n.id||el.dataset.b===n.id)?1:.06);
    });
    svg.appendChild(g);
  });
}
function renderDbl(){
  const groups=[{n:'NURI AGUS RAMDHANI',k:3,s:72},{n:'ALDY HERMAWAN',k:3,s:68},{n:'WENDY HUSMAN N',k:2,s:62}];
  document.getElementById('dblGroups').innerHTML=groups.map(g=>`
    <div class="dbl">
      <div style="flex:1"><b>${g.n}</b><small>PT Asuransi Jaya · PT Asuransi Berkah — ${g.k} pengajuan · ${g.s}/100</small></div>
      <span class="dbl-badge">PRIORITAS TINGGI</span>
      <button class="btn" onclick="flagDbl('${g.n}')">Kirim Pemberitahuan</button></div>`).join('');
}
function flagDbl(nama){
  audit('PEMBERITAHUAN_KLAIM_GANDA',nama,'Pemberitahuan resmi dikirim kepada kedua penyelenggara');
  pushLive('warn','Pemberitahuan klaim ganda — '+nama);
  toast('Pemberitahuan terkirim',`Indikasi klaim ganda ${nama} diteruskan kepada kedua penyelenggara.`,'info');
}
function initProvChart(){
  new Chart(document.getElementById('provChart'),{type:'bar',
    data:{labels:['PT Asuransi Jaya','PT Asuransi Berkah'],datasets:[
      {label:'Jumlah Klaim',data:[9,7],backgroundColor:'#1d4b85',borderRadius:5,barPercentage:.5},
      {label:'Rata-rata Skor (/100)',data:[48,52],backgroundColor:'#a5842e',borderRadius:5,barPercentage:.5}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{usePointStyle:true,pointStyleWidth:8,padding:12}},tooltip:{backgroundColor:'#0b1f3d',padding:11,cornerRadius:7}},
      scales:{x:{grid:{display:false}},y:{grid:{color:'#eef1f6'},beginAtZero:true}}}});
}

/* ============ FEEDS ============ */
function renderFeeds(){
  const feeds=[
    ['🪪','Dukcapil — Verifikasi Identitas','e-KTP & data kependudukan (KYC)','210 ms','32 detik lalu','ok'],
    ['🌦','BMKG — Data Cuaca & Bencana','Validasi kondisi tanggal kerugian','145 ms','1 menit lalu','ok'],
    ['🔧','Estimasi Bengkel — SAPPHIRE API','Estimasi biaya perbaikan resmi','188 ms','45 detik lalu','ok'],
    ['🔧','Estimasi Bengkel — DIAMOND AUTO API','Estimasi biaya perbaikan resmi','176 ms','50 detik lalu','ok'],
    ['🗂','AAUI — Riwayat Klaim Industri','Deteksi duplikasi lintas penyelenggara','240 ms','2 menit lalu','ok'],
    ['🏦','Core System — PT Asuransi Jaya','Data polis & pembayaran','95 ms','12 detik lalu','ok'],
    ['🏦','Core System — PT Asuransi Berkah','Data polis & pembayaran','102 ms','15 detik lalu','ok'],
    ['🚓','Korlantas — Data Kecelakaan','Laporan kepolisian (opsional)','—','Menunggu perjanjian akses','warn'],
  ];
  document.getElementById('feedList').innerHTML=feeds.map(f=>`
    <div class="feed-row">
      <div class="feed-ic">${f[0]}</div>
      <div class="feed-meta"><b>${f[1]}</b><small>${f[2]}</small></div>
      <div class="feed-stat"><b><span class="dot ${f[5]==='ok'?'d-ok':'d-warn'}"></span>${f[5]==='ok'?'Terhubung':'Tertunda'}</b>
        Latensi ${f[3]} · sinkron ${f[4]}</div>
      <button class="btn" style="padding:7px 12px;font-size:11.5px" onclick="toast('Tanda tangan valid','Pembaruan ${f[1].split('—')[0].trim()} terverifikasi kriptografis.','ok')">Verifikasi</button>
    </div>`).join('');
}

/* ============ MONITOR ============ */
let liveTimer=null,latChart=null;
const LIVE_POOL=[
  ['info','Scoring selesai — klaim baru dievaluasi IDRN-RS v2.1'],
  ['ok','Ledger batch anchor terkonfirmasi 3 validator'],
  ['info','Sinkronisasi feed AAUI — 0 duplikasi baru'],
  ['ok','Health check node: 4/4 sehat'],
  ['info','Verifikasi tanda tangan feed BMKG berhasil'],
  ['warn','Latensi Dukcapil di atas ambang sesaat (312 ms) — pulih'],
  ['info','Rotasi log audit — 500 entri diarsipkan'],
  ['ok','Backup terenkripsi selesai — RPO 15 menit terpenuhi'],
];
function pushLive(tag,msg){
  const el=document.getElementById('livefeed');if(!el)return;
  const row=document.createElement('div');row.className='lf-row';
  row.innerHTML=`<span class="lf-time">${nowT()}</span><span class="lf-tag lf-${tag}">${tag.toUpperCase()}</span><span>${msg}</span>`;
  el.prepend(row);
  while(el.children.length>30)el.lastChild.remove();
}
function initMonitor(){
  const labels=Array.from({length:30},(_,i)=>(29-i)*2+' mnt');
  const data=Array.from({length:30},()=>140+Math.round(Math.random()*90));
  latChart=new Chart(document.getElementById('latChart'),{type:'line',
    data:{labels,datasets:[{label:'Latensi P95 (ms)',data,borderColor:'#0d6b7c',backgroundColor:'rgba(13,107,124,.08)',fill:true,tension:.35,pointRadius:0}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{backgroundColor:'#0b1f3d',padding:10,cornerRadius:7}},
      scales:{x:{grid:{display:false},ticks:{maxTicksLimit:6}},y:{grid:{color:'#eef1f6'},suggestedMin:100,suggestedMax:320}}}});
  for(let i=0;i<6;i++)pushLive(...LIVE_POOL[Math.floor(Math.random()*LIVE_POOL.length)]);
}
function startLive(){
  stopLive();
  liveTimer=setInterval(()=>{
    pushLive(...LIVE_POOL[Math.floor(Math.random()*LIVE_POOL.length)]);
    if(latChart){latChart.data.datasets[0].data.push(140+Math.round(Math.random()*90));
      latChart.data.datasets[0].data.shift();latChart.update('none');}
  },7000);
}
function stopLive(){if(liveTimer)clearInterval(liveTimer);liveTimer=null;if(opsTimer)clearInterval(opsTimer);opsTimer=null;}

/* ============ LEDGER ============ */
function renderLedger(){
  document.getElementById('ledgerRows').innerHTML=Array.from({length:8},(_,i)=>{
    const n=1842-i;
    return `<tr><td class="mono">#${n}</td>
      <td class="mono" style="font-size:10.5px">${fakeHash(n).slice(0,40)}…</td>
      <td>${12+((n*7)%9)} dokumen</td><td>IDRN · OJK · AAUI</td>
      <td style="white-space:nowrap">03/07/2026 ${String(9-i).padStart(2,'0')}.${String((n*13)%60).padStart(2,'0')}</td>
      <td><span class="status s-approved">TERKONFIRMASI</span></td></tr>`;}).join('');
}

/* ============ SLA ============ */
function renderSLA(){
  const strip=document.getElementById('uptimeStrip');
  const months=['99,97','99,99','99,96','100','99,98','99,99','99,95','100','99,99','99,98','100','99,99'];
  strip.innerHTML=months.map((m,i)=>{
    const v=parseFloat(m.replace(',','.'));
    const h=30+(v-99.9)*140;
    return `<i style="height:${Math.max(26,Math.min(44,h))}px" class="${v<99.96?'w':''}" title="Bulan ${i+1}: ${m}%"></i>`;}).join('');
}

/* ============ CMD PALETTE ============ */
function openCmd(){
  document.getElementById('ovCmd').classList.add('show');
  const inp=document.getElementById('cmdInput');inp.value='';renderCmd('');
  setTimeout(()=>inp.focus(),60);
}
function closeCmd(){document.getElementById('ovCmd').classList.remove('show');}
document.getElementById('ovCmd').addEventListener('click',e=>{if(e.target.id==='ovCmd')closeCmd();});
document.getElementById('cmdInput').addEventListener('input',e=>renderCmd(e.target.value));
function renderCmd(q){
  q=q.toLowerCase();
  const pages=currentUser?currentUser.nav.map(([id,ic,label])=>({t:'page',id,ic,label})):[];
  const claims=CLAIMS.filter(c=>!q||c.nama.toLowerCase().includes(q)||c.no.includes(q))
    .map(c=>({t:'claim',id:c.id,ic:'▤',label:c.nama,sub:c.no+' · '+c.risk+'/100'}));
  const cases=CASES.filter(k=>!q||k.subj.toLowerCase().includes(q)||k.id.toLowerCase().includes(q))
    .map(k=>({t:'case',id:0,ic:'◈',label:k.id+' — '+k.subj,sub:'Kasus SIU'}));
  const items=[...pages.filter(p=>!q||p.label.toLowerCase().includes(q)),...claims,...cases].slice(0,9);
  document.getElementById('cmdList').innerHTML=items.map(i=>
    `<div class="cmd-item" onclick="cmdGo('${i.t}',${i.t==='claim'?i.id:`'${i.id}'`})">
      <span class="ic">${i.ic}</span><span>${i.label}</span><small>${i.sub||'Halaman'}</small></div>`).join('')
    ||'<div style="padding:18px;color:var(--dim);font-size:13px;text-align:center">Tidak ada hasil.</div>';
}
function cmdGo(type,id){
  closeCmd();
  if(type==='page')showPage(id);
  else if(type==='claim')openDoc(id);
  else showPage('pg-cases');
}

/* ============ NASABAH ============ */
const POLICIES=[
  {no:'1222012012100051',prov:'PT Asuransi Jaya',jenis:'Kendaraan Bermotor — Comprehensive',obj:'Toyota Innova Zenix 2023 · B 1783 EZV',
   mulai:'29 Desember 2023',akhir:'16 Desember 2028',premi:'Rp3.150.000 / tahun',tsi:'Rp185.000.000',klaim:2,
   cov:[['Tabrakan, Benturan & Terbalik',1],['Pencurian & Perbuatan Jahat',1],['Banjir & Angin Topan',1],['Kerusuhan & Huru-hara (SRCC)',1],['Tanggung Jawab Pihak Ketiga — s.d. Rp25 jt',1],['Kecelakaan Diri Penumpang — Rp10 jt/kursi',1],['Gempa Bumi & Tsunami',0],['Mobil Pengganti',0]]},
  {no:'2330045012200019',prov:'PT Asuransi Berkah',jenis:'Kendaraan Bermotor — Total Loss Only (TLO)',obj:'Honda Vario 160 2024 · B 3541 KDE',
   mulai:'15 Januari 2024',akhir:'15 Januari 2027',premi:'Rp425.000 / tahun',tsi:'Rp28.500.000',klaim:1,
   cov:[['Kehilangan Total (Pencurian)',1],['Kerusakan Total ≥ 75% TSI',1],['Banjir & Angin Topan',1],['Tanggung Jawab Pihak Ketiga — s.d. Rp10 jt',1],['Kerusakan Sebagian (Partial Loss)',0],['Kecelakaan Diri Pengendara',0]]},
];
function renderMyPolicies(){
  document.getElementById('myPolicies').innerHTML=POLICIES.map((p,i)=>`
    <div class="q-item" id="pol-${i}">
      <div class="q-top" onclick="document.getElementById('pol-${i}').classList.toggle('open')">
        <div class="q-score" style="color:var(--green);border-color:var(--green);background:var(--green-bg)"><div><b style="font-size:10.5px">IN</b><br><small>FORCE</small></div></div>
        <div class="q-meta"><span class="mono">${p.no}</span>
          <h4>${p.prov}</h4><small>${p.jenis} · ${p.obj}</small></div>
        <div class="q-amt" style="font-size:13px">${p.klaim} klaim terkait</div><span class="q-caret">▼</span>
      </div>
      <div class="q-body"><div class="q-body-inner">
        <div class="kv" style="margin-top:14px">
          <div><label>PERIODE POLIS</label><b>${p.mulai} — ${p.akhir}</b></div>
          <div><label>PREMI</label><b>${p.premi}</b></div>
          <div><label>TOTAL SUM INSURED (TSI)</label><b>${p.tsi}</b></div>
          <div><label>OBJEK PERTANGGUNGAN</label><b>${p.obj}</b></div>
        </div>
        <div class="sect-label">COVERAGE / LUAS JAMINAN — ${p.cov.filter(c=>c[1]).length} AKTIF DARI ${p.cov.length}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${p.cov.map(([c,on])=>`<span class="status ${on?'s-approved':''}" style="${on?'':'color:var(--dim);background:#f2f4f8;border:1px dashed var(--line)'}">${on?'✓ ':'✕ '}${c}</span>`).join('')}
        </div>
        <div style="margin-top:13px;font-size:11.5px;color:var(--dim)">Jaminan bertanda ✕ tidak termasuk dalam polis ini — hubungi penyelenggara untuk perluasan coverage.</div>
      </div></div>
    </div>`).join('');
}
const MYCLAIMS=[
  {kode:'JY-001',prov:'PT Asuransi Jaya',nilai:706181,stage:3,status:'Menunggu',no:'222012112000065',dol:'04 Maret 2025',bengkel:'SAPPHIRE',polis:'1222012012100051',eta:'3–5 hari kerja',
   hist:[
    ['Diajukan','04 Mar 2025 · 14.22','Pengajuan diterima via aplikasi. Foto kerusakan, STNK, dan SIM terunggah lengkap.','system'],
    ['Verifikasi Dokumen','15 Mar 2025 · 09.10','Seluruh dokumen dinyatakan lengkap dan digital fingerprint di-anchor ke ledger.','admin.jaya'],
    ['Tinjauan Penilai','Sedang berlangsung','Berkas dalam antrean penilai (risk score 72/100 — memerlukan tinjauan mendalam sebelum keputusan).','b.santoso'],
    ['Keputusan','Menunggu','Keputusan diterbitkan setelah tinjauan penilai selesai. Anda akan menerima notifikasi otomatis.',''],
    ['Selesai','Menunggu','Pembayaran (bila disetujui) dan penutupan berkas.','']]},
  {kode:'JY-007',prov:'PT Asuransi Jaya',nilai:4500000,stage:4,status:'Ditolak',no:'222012112000091',dol:'01 September 2025',bengkel:'SAPPHIRE',polis:'1222012012100051',eta:'—',
   hist:[
    ['Diajukan','01 Sep 2025 · 10.05','Pengajuan diterima via aplikasi.','system'],
    ['Verifikasi Dokumen','04 Sep 2025 · 13.40','Dokumen lengkap; estimasi bengkel resmi diterima.','admin.jaya'],
    ['Tinjauan Penilai','09 Sep 2025 · 15.12','Ditemukan deviasi nilai signifikan terhadap estimasi bengkel rekanan (faktor F2).','b.santoso'],
    ['Keputusan','10 Sep 2025 · 09.00','Klaim DITOLAK — nilai pengajuan melampaui estimasi kerusakan. Anda berhak mengajukan keberatan dalam 30 hari kalender.','b.santoso'],
    ['Selesai','—','Berkas ditutup dengan status ditolak (dapat dibuka kembali bila keberatan diterima).','']]},
  {kode:'BK-001',prov:'PT Asuransi Berkah',nilai:4200000,stage:3,status:'Menunggu',no:'330045220000012',dol:'06 Maret 2025',bengkel:'DIAMOND AUTO',polis:'2330045012200019',eta:'2–4 hari kerja',
   hist:[
    ['Diajukan','06 Mar 2025 · 08.15','Pengajuan diterima via call center; dokumen menyusul via aplikasi.','system'],
    ['Verifikasi Dokumen','11 Mar 2025 · 11.30','Dokumen lengkap dan terverifikasi terhadap data Dukcapil.','admin.berkah'],
    ['Tinjauan Penilai','Sedang berlangsung','Konfirmasi silang estimasi ke bengkel DIAMOND AUTO sedang berjalan.','penilai.berkah'],
    ['Keputusan','Menunggu','—',''],
    ['Selesai','Menunggu','—','']]},
];
function renderMyClaims(){
  const stages=['Diajukan','Verifikasi Dokumen','Tinjauan Penilai','Keputusan','Selesai'];
  document.getElementById('myClaims').innerHTML=MYCLAIMS.map((m,mi)=>`
    <div style="border:1px solid var(--line);border-radius:10px;padding:18px 20px;margin-bottom:13px;background:#fff">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">
        <div><span class="mono">${m.kode}</span> · <b>${m.prov}</b>
          <div style="color:var(--muted);font-size:12px;margin-top:2px">${m.no} · ${m.dol} · ${m.bengkel} · Polis <span class="mono" style="font-size:11px">${m.polis}</span></div></div>
        <div style="display:flex;gap:11px;align-items:center">
          <b style="font-family:var(--serif);color:var(--navy);font-size:16px">${fmtIDR(m.nilai)}</b>
          <span class="status ${m.status==='Menunggu'?'s-pending':m.status==='Ditolak'?'s-rejected':'s-approved'}">${m.status.toUpperCase()}</span>
        </div></div>
      <div class="stepper">${stages.map((s,i)=>{
        const st=i+1<m.stage?'done':i+1===m.stage?'now':'';
        return `<div class="step ${st}" onclick="showStage(${mi},${i})" title="Klik untuk detail tahap ini"><div class="step-line"></div><div class="step-dot">${i+1<m.stage?'✓':i+1}</div><small>${s}</small></div>`;}).join('')}</div>
      <div id="stgd-${mi}"></div>
      <div style="margin-top:12px;font-size:12px;color:var(--muted);display:flex;gap:16px;flex-wrap:wrap;align-items:center;border-top:1px dashed var(--line-soft);padding-top:11px">
        <span>Tahap saat ini: <b style="color:var(--navy-2)">${stages[m.stage-1]}</b></span>
        <span>Estimasi keputusan: <b style="color:var(--ink)">${m.eta}</b></span>
        ${m.status==='Ditolak'?`<button class="btn" onclick="banding('${m.kode}')">Ajukan Keberatan</button>`:''}
      </div>
    </div>`).join('');
  MYCLAIMS.forEach((m,mi)=>showStage(mi,m.stage-1));
}
function showStage(mi,si){
  const m=MYCLAIMS[mi],h=m.hist[si],el=document.getElementById('stgd-'+mi);
  if(!el)return;
  const reached=si+1<=m.stage;
  el.innerHTML=`<div style="margin-top:4px;border:1px solid ${reached?'var(--cyan-line)':'var(--line)'};background:${reached?'var(--cyan-bg)':'#fafbfd'};border-radius:9px;padding:13px 16px;font-size:12.5px;animation:rise .25s">
    <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
      <b style="color:${reached?'var(--cyan)':'var(--dim)'}">Tahap ${si+1} — ${h[0]} ${si+1===m.stage?'· SAAT INI':si+1<m.stage?'· ✓ SELESAI':'· BELUM DICAPAI'}</b>
      <span style="color:var(--muted);font-size:11.5px">${h[1]}</span></div>
    <div style="margin-top:5px;color:var(--muted);line-height:1.6">${h[2]}</div>
    ${h[3]?`<div style="margin-top:5px;font-size:11px;color:var(--dim)">Ditangani oleh: <span class="mono">${h[3]}</span></div>`:''}
  </div>`;
}

/* ============ AAUI ============ */
const REGISTRY=[
  ...CLAIMS.map(c=>({no:c.no,nama:c.nama,prov:'PT Asuransi Jaya',nilai:c.nilai,dol:c.dol,risk:c.risk,
    dup:['NURI AGUS RAMDHANI','ALDY HERMAWAN','WENDY HUSMAN N'].includes(c.nama)&&c.risk>=60})),
  {no:'330045220000012',nama:'NURI AGUS RAMDHANI',prov:'PT Asuransi Berkah',nilai:4200000,dol:'06 Maret 2025',risk:64,dup:true},
  {no:'330045220000018',nama:'ALDY HERMAWAN',prov:'PT Asuransi Berkah',nilai:5300000,dol:'14 April 2025',risk:66,dup:true},
  {no:'330045220000021',nama:'WENDY HUSMAN N',prov:'PT Asuransi Berkah',nilai:7150000,dol:'21 Mei 2025',risk:61,dup:true},
  {no:'330045220000009',nama:'SANTI PURNAMA',prov:'PT Asuransi Berkah',nilai:1250000,dol:'03 Juni 2025',risk:24,dup:false},
  {no:'330045220000015',nama:'JOKO PRIHATIN',prov:'PT Asuransi Berkah',nilai:2900000,dol:'19 Juni 2025',risk:38,dup:false},
  {no:'330045220000024',nama:'MEGA LESTARI',prov:'PT Asuransi Berkah',nilai:3600000,dol:'28 Juni 2025',risk:45,dup:false},
  {no:'330045220000027',nama:'RUDI HARTANTO',prov:'PT Asuransi Berkah',nilai:950000,dol:'01 Juli 2025',risk:19,dup:false},
];
const WATCHLIST=[
  ['BENGKEL SAPPHIRE','Bengkel rekanan',71,'Frekuensi klaim tinggi + deviasi estimasi berulang'],
  ['NURI AGUS RAMDHANI','Pemegang polis',72,'Klaim ganda lintas anggota'],
  ['ALDY HERMAWAN','Pemegang polis',68,'Klaim ganda lintas anggota'],
  ['WENDY HUSMAN N','Pemegang polis',62,'Klaim ganda lintas anggota'],
];
function initAaui(){
  new Chart(document.getElementById('aauiChart'),{type:'bar',
    data:{labels:['PT Asuransi Jaya','PT Asuransi Berkah','Industri non-IDRN'],datasets:[
      {label:'Deteksi Dini Fraud (%)',data:[94,91,61],backgroundColor:['#1d4b85','#1d4b85','#b9c6da'],borderRadius:5,barPercentage:.5},
      {label:'Waktu Proses Klaim (hari)',data:[2.4,2.9,11],backgroundColor:['#a5842e','#a5842e','#d9cba5'],borderRadius:5,barPercentage:.5}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{usePointStyle:true,pointStyleWidth:8,padding:12}},tooltip:{backgroundColor:'#0b1f3d',padding:11,cornerRadius:7}},
      scales:{x:{grid:{display:false}},y:{grid:{color:'#eef1f6'},beginAtZero:true}}}});
  document.getElementById('aauiWatch').innerHTML=WATCHLIST.map(w=>`
    <div class="dbl">
      <div style="flex:1"><b>${w[0]}</b><small>${w[1]} · skor entitas ${w[2]}/100 — ${w[3]}</small></div>
      <button class="btn" onclick="aauiBroadcast('${w[0]}')">Sebarkan Advisori</button>
    </div>`).join('');
}
function aauiBroadcast(n){
  audit('WATCHLIST_BROADCAST',n,'Advisori risiko disebarkan ke seluruh 72 anggota AAUI');
  pushLive('warn','AAUI menyebarkan advisori — '+n);
  toast('Advisori terkirim','Peringatan '+n+' disebarkan ke 72 anggota asosiasi.','info');
}
function renderRegistry(q=''){
  q=q.toLowerCase();
  const rows=REGISTRY.filter(r=>!q||r.nama.toLowerCase().includes(q)||r.no.includes(q)||r.prov.toLowerCase().includes(q));
  document.getElementById('regCount').textContent=rows.length+' dari '+REGISTRY.length+' klaim industri';
  document.getElementById('regRows').innerHTML=rows.map(r=>{const b=band(r.risk);return `<tr>
    <td class="mono">${r.no}</td><td><b>${r.nama}</b></td><td>${r.prov}</td><td>${fmtIDR(r.nilai)}</td><td>${r.dol}</td>
    <td><div class="score-line"><b style="color:${bandColor(r.risk)}">${r.risk}</b><span>/ 100</span></div></td>
    <td><span class="band ${b.cls}">${b.label}</span></td>
    <td>${r.dup?'<span class="status s-rejected">DUPLIKASI</span>':'<span class="status s-approved">UNIK</span>'}</td></tr>`;}).join('')
    ||'<tr><td colspan="8" style="text-align:center;color:var(--dim);padding:24px">Tidak ada hasil.</td></tr>';
}
function banding(kode){
  audit('KEBERATAN_DIAJUKAN',kode,'Pemegang polis mengajukan keberatan');
  toast('Keberatan tercatat',`Peninjauan kembali ${kode} diteruskan. Tiket: KB-${Math.floor(Math.random()*90000+10000)}.`,'ok');
}

/* ============ PUSAT KOMANDO NASIONAL ============ */
let opsTimer=null,opsToday=1287,opsDup=41,opsVal=42150000;
const CITIES=[
  {n:'Medan',x:150,y:80,v:14},{n:'Pekanbaru',x:200,y:130,v:8},{n:'Palembang',x:265,y:200,v:11},
  {n:'Jakarta',x:330,y:255,v:38},{n:'Bandung',x:365,y:278,v:17},{n:'Semarang',x:430,y:262,v:13},
  {n:'Surabaya',x:490,y:268,v:22},{n:'Denpasar',x:540,y:292,v:9},{n:'Banjarmasin',x:480,y:180,v:7},
  {n:'Makassar',x:610,y:210,v:12},{n:'Manado',x:660,y:90,v:5},{n:'Jayapura',x:830,y:150,v:3},
];
const OPS_EVENTS=[
  ['Klaim baru masuk — scoring otomatis dimulai','info'],
  ['Scoring selesai — band RENDAH, jalur cepat','ok'],
  ['Scoring selesai — band TINGGI, ke antrean penilai','warn'],
  ['Duplikasi lintas penyelenggara dicegah','err'],
  ['Verifikasi identitas Dukcapil berhasil','info'],
  ['Document anchor ke ledger terkonfirmasi','ok'],
];
function initOps(){
  const svg=document.getElementById('opsMap'),ns='http://www.w3.org/2000/svg';
  const ISLANDS=[
    ['SUMATERA','M96,38 C126,30 160,52 186,92 C212,132 250,176 288,212 C302,226 296,246 278,241 C244,231 208,198 176,158 C142,116 108,80 94,58 C88,48 90,40 96,38 Z',118,180],
    ['JAWA','M312,250 C355,242 425,246 476,253 C516,258 549,266 566,274 C576,282 566,292 545,288 C482,277 402,270 332,268 C312,266 302,256 312,250 Z',430,236],
    ['KALIMANTAN','M402,192 C386,150 400,104 436,78 C472,55 524,58 553,90 C578,117 582,158 561,188 C539,218 494,228 454,217 C428,210 410,206 402,192 Z',478,132],
    ['SULAWESI','M601,98 C617,82 638,88 642,110 C646,132 636,152 625,167 C641,177 662,188 669,208 C673,226 654,231 644,216 C633,200 621,190 614,181 C609,197 604,216 593,227 C580,238 566,227 575,210 C586,190 594,168 597,146 C599,128 594,112 601,98 Z',600,68],
    ['PAPUA','M762,122 C788,96 832,90 866,110 C892,126 898,158 887,188 C876,218 846,238 810,232 C789,228 774,216 764,196 C748,190 736,178 741,163 C746,150 756,148 762,138 Z',826,110],
  ];
  ISLANDS.forEach(([name,d,lx,ly])=>{
    const p=document.createElementNS(ns,'path');
    p.setAttribute('d',d);p.setAttribute('fill','rgba(255,255,255,.10)');
    p.setAttribute('stroke','rgba(255,255,255,.24)');p.setAttribute('stroke-width','1');
    svg.appendChild(p);
    const t=document.createElementNS(ns,'text');
    t.setAttribute('x',lx);t.setAttribute('y',ly);t.setAttribute('class','ops-isle');t.textContent=name;
    svg.appendChild(t);
  });
  [[578,296,7],[604,298,5],[632,300,6],[662,301,5],[690,301,4],[704,182,4],[718,212,3],[733,152,3]].forEach(([x,y,r])=>{
    const c=document.createElementNS(ns,'circle');
    c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r);
    c.setAttribute('fill','rgba(255,255,255,.10)');c.setAttribute('stroke','rgba(255,255,255,.22)');
    svg.appendChild(c);
  });
  [['BALI & NUSA TENGGARA',636,324],['MALUKU',722,238]].forEach(([name,x,y])=>{
    const t=document.createElementNS(ns,'text');
    t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('class','ops-isle');t.textContent=name;
    svg.appendChild(t);
  });
  CITIES.forEach(c=>{
    const g=document.createElementNS(ns,'g');g.setAttribute('class','ops-city');
    const dot=document.createElementNS(ns,'circle');
    dot.setAttribute('cx',c.x);dot.setAttribute('cy',c.y);dot.setAttribute('r',(4+Math.sqrt(c.v)).toFixed(1));
    dot.setAttribute('fill','#e8d59a');dot.setAttribute('fill-opacity','.85');g.appendChild(dot);
    const t=document.createElementNS(ns,'text');
    t.setAttribute('x',c.x);t.setAttribute('y',c.y+22);t.textContent=c.n;g.appendChild(t);
    g.addEventListener('click',()=>toast(c.n,c.v+' klaim aktif di wilayah ini — seluruhnya terscoring dalam kurang dari 900 ms.','info'));
    svg.appendChild(g);
  });
  refreshOpsStats();
  for(let i=0;i<5;i++)opsTick(true);
  if(!opsTimer)opsTimer=setInterval(()=>opsTick(false),3400);
}
function opsTick(seed){
  const c=CITIES[Math.floor(Math.random()*CITIES.length)];
  const [msg,tag]=OPS_EVENTS[Math.floor(Math.random()*OPS_EVENTS.length)];
  const svg=document.getElementById('opsMap');
  if(svg&&document.getElementById('pg-ops').classList.contains('active')){
    const ns='http://www.w3.org/2000/svg';
    const p=document.createElementNS(ns,'circle');
    p.setAttribute('cx',c.x);p.setAttribute('cy',c.y);p.setAttribute('r',6);
    p.setAttribute('fill','none');p.setAttribute('stroke',tag==='err'?'#ff8fa3':'#e8d59a');
    p.setAttribute('stroke-width','1.6');p.setAttribute('class','ops-pulse');
    svg.appendChild(p);setTimeout(()=>p.remove(),1700);
  }
  const tk=document.getElementById('opsTicker');
  if(tk){
    const row=document.createElement('div');row.className='lf-row';
    row.innerHTML=`<span class="lf-time">${nowT()}</span><span class="lf-tag lf-${tag}">${c.n.toUpperCase()}</span><span>${msg}</span>`;
    tk.prepend(row);while(tk.children.length>40)tk.lastChild.remove();
  }
  if(!seed){
    opsToday++;
    if(tag==='err'){opsDup++;opsVal+=Math.round(500000+Math.random()*4000000);}
    refreshOpsStats();
  }
}
function refreshOpsStats(){
  const a=document.getElementById('opsToday'),b=document.getElementById('opsDup'),v=document.getElementById('opsVal');
  if(a)a.textContent=opsToday.toLocaleString('id-ID');
  if(b)b.textContent=opsDup;
  if(v)v.textContent='Rp'+(opsVal/1000000).toFixed(1).replace('.',',')+' jt';
}

/* ============ SIMULATOR AMBANG ============ */
function initSim(){
  const sl=document.getElementById('simSlider');
  sl.addEventListener('input',()=>renderSim(+sl.value));
  renderSim(+sl.value);
}
function renderSim(th){
  document.getElementById('simTh').innerHTML=th+'<small> / 100</small>';
  const total=1287;
  const rate=th<=42?0.31:th<=50?0.47:th<=58?0.60:th<=64?0.67:th<=70?0.78:0.86;
  const auto=Math.round(total*rate),man=total-auto;
  const fp=th<=42?0.2:th<=50?0.4:th<=58?0.6:th<=64?0.8:th<=70?1.9:3.6;
  document.getElementById('simAuto').textContent=Math.round(rate*100)+'%';
  document.getElementById('simAutoN').textContent=auto.toLocaleString('id-ID')+' klaim/bln fast-track';
  document.getElementById('simMan').textContent=man.toLocaleString('id-ID');
  document.getElementById('simSave').textContent='Rp'+Math.round(auto*38500/1000000)+' jt';
  document.getElementById('simRisk').textContent=fp.toFixed(1).replace('.',',')+'%';
  const r=document.getElementById('simReco');
  if(th>70){r.className='reco r-high';r.innerHTML='<b>Peringatan</b>Ambang terlalu longgar: estimasi salah bayar melampaui toleransi kontrak (2,0%). Direkomendasikan rentang 55–65.';}
  else if(th<50){r.className='reco r-med';r.innerHTML='<b>Konservatif</b>Beban penilai tinggi dan potensi otomatisasi belum optimal. Direkomendasikan rentang 55–65.';}
  else{r.className='reco r-low';r.innerHTML='<b>Optimal</b>Keseimbangan otomatisasi dan risiko berada pada rentang yang direkomendasikan model (55–65).';}
}

/* ============ IDRN COPILOT ============ */
function toggleCop(open){
  document.getElementById('copPanel').classList.toggle('show',open);
  document.getElementById('copFab').style.display=open?'none':(currentUser?'flex':'none');
  if(open)setTimeout(()=>document.getElementById('copIn').focus(),80);
}
const COP_QA=[
  {k:['sapphire','bengkel'],a:'<b>Bengkel SAPPHIRE</b> adalah entitas berisiko tertinggi saat ini: 7 klaim aktif, 4 di antaranya band TINGGI, dan faktor F4 naik 22% dalam 90 hari. Audit lapangan gabungan telah dijadwalkan (kasus SIU-2026-035). Rekomendasi: tahan pembayaran klaim baru yang menunjuk bengkel ini hingga audit selesai.'},
  {k:['ganda','duplika'],a:'Terdapat <b>3 grup klaim ganda</b> lintas penyelenggara: Nuri Agus R. (72/100), Aldy Hermawan (68/100), dan Wendy Husman (62/100) — total eksposur Rp18,3 jt. Seluruhnya telah dinotifikasi ke kedua penyelenggara dan memiliki kasus SIU aktif.'},
  {k:['roi','nilai','hemat','dicegah','biaya'],a:'YTD platform mencegah kerugian <b>Rp4,28 miliar</b> — ROI 11,4× terhadap biaya langganan. Bulan ini Rp1,42 M (naik 18% MoM), ditambah 312 jam kerja penilai dihemat melalui fast-track 67% klaim band RENDAH tanpa satu pun temuan salah bayar.'},
  {k:['tertinggi','terbesar','prioritas','risiko tinggi','risiko?'],a:'Klaim berisiko tertinggi: <b>222012112000065 — Nuri Agus R., 72/100 (TINGGI)</b>. Kontributor utama: Duplikasi Lintas Penyelenggara +25 dan Anomali Waktu Pelaporan +18, confidence 94%. Kasus SIU-2026-041 aktif dengan sisa SLA 22 jam. Rekomendasi model: investigasi wajib sebelum keputusan.'},
  {k:['skor','model','hitung','cara'],a:'Skor 0–100 dihitung model <b>IDRN-RS v2.1</b> dari 5 faktor berbobot: anomali waktu (maks 20), deviasi nilai (25), duplikasi lintas penyelenggara (25), profil bengkel (15), riwayat pemegang polis (15). Band: RENDAH &lt;40 · SEDANG 40–59 · TINGGI 60–79 · KRITIS ≥80. Setiap skor menyertakan confidence dan dapat diaudit penuh terhadap audit trail.'},
  {k:['ambang','fast','otomatis'],a:'Ambang fast-track saat ini <b>60/100</b>: 67% klaim diproses otomatis dengan estimasi salah bayar 0,8% (toleransi kontrak 2,0%). Gunakan halaman <b>Threshold Simulator</b> untuk menguji skenario lain sebelum mengajukan perubahan — perubahan produksi memerlukan persetujuan dua pejabat.'},
];
function copAsk(q){
  const msgs=document.getElementById('copMsgs');
  msgs.insertAdjacentHTML('beforeend',`<div class="cop-m usr">${q.replace(/</g,'&lt;')}</div>`);
  const ql=q.toLowerCase();
  const hit=COP_QA.find(x=>x.k.some(k=>ql.includes(k)));
  const a=hit?hit.a:'Saya dapat membantu analisis risiko portofolio, klaim ganda, entitas watchlist, ROI platform, kebijakan ambang, dan metodologi scoring. Coba: <b>"klaim risiko tertinggi"</b> atau <b>"berapa nilai yang dicegah"</b>.';
  msgs.insertAdjacentHTML('beforeend','<div class="cop-m bot">…</div>');
  const last=msgs.lastElementChild;msgs.scrollTop=msgs.scrollHeight;
  setTimeout(()=>{last.innerHTML=a;msgs.scrollTop=msgs.scrollHeight;
    audit('COPILOT_DITANYA',q.slice(0,42),'Jawaban analitik disajikan dari data portofolio');},700);
}
function copSend(){
  const i=document.getElementById('copIn');
  if(!i.value.trim())return;
  copAsk(i.value.trim());i.value='';
}
document.getElementById('copIn').addEventListener('keydown',e=>{if(e.key==='Enter')copSend();});

/* ============ PRINT EXEC REPORT ============ */
function printExec(){
  const pend=CLAIMS.filter(c=>c.status==='Menunggu').length;
  const high=CLAIMS.filter(c=>c.risk>=60).length;
  document.getElementById('printReport').innerHTML=`
    <h1>IDRN — Laporan Eksekutif Bulanan</h1>
    <div class="pr-sub">PT Asuransi Jaya · Periode Juli 2026 · Dokumen rahasia — hanya untuk direksi · Dicetak ${now()}</div>
    <div class="pr-sec">RINGKASAN NILAI</div>
    <div>Nilai kerugian fraud yang dicegah (YTD):</div>
    <div class="pr-big">Rp4.283.500.000</div>
    <div>ROI platform 11,4× terhadap biaya langganan · Loss ratio 62,1% (turun 6,8 pp) · Deteksi dini 94% vs industri 61% · Waktu proses klaim 2,4 hari (–78%).</div>
    <div class="pr-sec">POSISI RISIKO</div>
    <table><tr><th>Indikator</th><th>Nilai</th></tr>
      <tr><td>Total klaim aktif</td><td>${CLAIMS.length}</td></tr>
      <tr><td>Band Tinggi/Kritis (skor ≥ 60/100)</td><td>${high}</td></tr>
      <tr><td>Menunggu tinjauan penilai</td><td>${pend}</td></tr>
      <tr><td>Kasus SIU aktif</td><td>${CASES.length} (nilai dalam sengketa Rp23,8 jt)</td></tr>
      <tr><td>Grup klaim ganda lintas penyelenggara</td><td>3 (seluruhnya ternotifikasi)</td></tr></table>
    <div class="pr-sec">TEMUAN UTAMA</div>
    <table><tr><th>#</th><th>Temuan</th><th>Tindak Lanjut</th></tr>
      <tr><td>1</td><td>Konsentrasi risiko bengkel SAPPHIRE — 4 dari 6 klaim berisiko tinggi</td><td>Audit lapangan dijadwalkan bersama SIU</td></tr>
      <tr><td>2</td><td>3 grup klaim ganda lintas penyelenggara, eksposur Rp18,3 jt</td><td>Notifikasi jaringan pengawas terkirim</td></tr>
      <tr><td>3</td><td>67% klaim band RENDAH lolos jalur cepat tanpa temuan salah bayar</td><td>Perluasan ambang fast-track dikaji</td></tr></table>
    <div class="pr-sec">KEPATUHAN SLA</div>
    <table><tr><th>Komitmen</th><th>Target</th><th>Realisasi</th></tr>
      <tr><td>Ketersediaan platform</td><td>≥ 99,95%</td><td>99,99% — terpenuhi</td></tr>
      <tr><td>Latensi scoring P95</td><td>&lt; 900 ms</td><td>412 ms — terpenuhi</td></tr>
      <tr><td>Respons insiden kritis</td><td>&lt; 15 menit</td><td>6 menit — terpenuhi</td></tr></table>
    <div style="margin-top:26px;font-size:11px;color:#555">Laporan dihasilkan otomatis oleh IDRN Analytics. Seluruh angka dapat diverifikasi terhadap audit trail dan ledger anchor. Metodologi perhitungan nilai dicegah diaudit pihak ketiga (Mei 2026).</div>`;
  audit('LAPORAN_DIREKSI_DICETAK','JUL-2026','Laporan eksekutif bulanan dicetak');
  window.print();
}

/* Expose handlers used by inline on* attributes */
Object.assign(window,{aauiBroadcast,banding,caseNote,closeDec,closeDoc,cmdGo,copAsk,copSend,flagDbl,logout,openCmd,openDec,openDoc,printExec,showPage,showStage,toast,toggleCop,toggleQ,verifyDoc});
