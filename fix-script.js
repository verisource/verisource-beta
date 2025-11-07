<script>
const API_URL='https://api.verisource.io';
let selectedBulkFiles=[];

function login(){
const pwd=document.getElementById('passwordInput').value;
if(pwd==='verisource-beta-2024'){
document.getElementById('loginScreen').classList.add('hidden');
document.getElementById('mainInterface').classList.add('show');
}else{
document.getElementById('errorMessage').classList.add('show');
}
}

function logout(){
document.getElementById('loginScreen').classList.remove('hidden');
document.getElementById('mainInterface').classList.remove('show');
document.getElementById('passwordInput').value='';
}

function switchTab(tab){
document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
if(tab==='single'){
document.querySelectorAll('.tab')[0].classList.add('active');
document.getElementById('singleTab').classList.add('active');
}else{
document.querySelectorAll('.tab')[1].classList.add('active');
document.getElementById('bulkTab').classList.add('active');
}
}

async function uploadSingle(file){
if(!file)return;
document.getElementById('singleLoading').classList.add('show');
document.getElementById('singleResults').classList.remove('show');
const formData=new FormData();
formData.append('file',file);
try{
const res=await fetch(`${API_URL}/verify`,{method:'POST',body:formData});
const data=await res.json();
displaySingleResult(data);
}catch(e){
alert('Upload failed: '+e.message);
}finally{
document.getElementById('singleLoading').classList.remove('show');
}
}

function displaySingleResult(data){
const conf=data.confidence||{};
const score=conf.score||0;
const level=conf.level||'MEDIUM';
let verdictClass='verdict-medium';
let icon='⚠️';
let title='VERIFICATION INCOMPLETE';
if(level==='HIGH'){verdictClass='verdict-high';icon='✓';title='CONTENT VERIFIED'}
else if(level==='LOW'){verdictClass='verdict-low';icon='🚨';title='AUTHENTICITY CONCERNS'}
let html=`
<div class="verdict-section ${verdictClass}">
<div class="verdict-icon">${icon}</div>
<div class="verdict-title">${title}</div>
<div class="score-bar"><div class="score-fill ${level.toLowerCase()}" style="width:${score}%">${score}%</div></div>
</div>`;
if(data.canonical){
html+=`<div class="fingerprints-section">
<div class="fingerprint-item">
<div class="fingerprint-label">SHA-256</div>
<div class="fingerprint-value">${data.canonical.sha256||'N/A'}</div>
</div>
<div class="fingerprint-item">
<div class="fingerprint-label">Perceptual Hash</div>
<div class="fingerprint-value">${data.canonical.phash||'N/A'}</div>
</div>
</div>`;
}
document.getElementById('singleResults').innerHTML=html;
document.getElementById('singleResults').classList.add('show');
}

function uploadBulk(files){
if(!files.length)return;
selectedBulkFiles=Array.from(files);
document.getElementById('fileCount').textContent=files.length;
document.getElementById('bulkUploadBtn').style.display='block';
}

async function processBulk(){
if(!selectedBulkFiles.length)return;
document.getElementById('bulkLoading').classList.add('show');
document.getElementById('bulkResults').classList.remove('show');
const formData=new FormData();
selectedBulkFiles.forEach(f=>formData.append('files',f));
try{
const res=await fetch(`${API_URL}/api/verify/batch`,{method:'POST',body:formData});
const data=await res.json();
displayBulkResult(data);
}catch(e){
alert('Batch upload failed: '+e.message);
}finally{
document.getElementById('bulkLoading').classList.remove('show');
}
}

function displayBulkResult(data){
const html=`
<div class="batch-summary">
<h3>✅ Batch Complete</h3>
<div class="summary-grid">
<div class="summary-item"><div class="summary-value">${data.summary.total}</div><div class="summary-label">Total</div></div>
<div class="summary-item"><div class="summary-value">${data.summary.successful}</div><div class="summary-label">Success</div></div>
<div class="summary-item"><div class="summary-value">${data.summary.failed}</div><div class="summary-label">Failed</div></div>
<div class="summary-item"><div class="summary-value">${data.summary.duplicatesFound}</div><div class="summary-label">Duplicates</div></div>
</div>
<button class="btn-primary" onclick="window.open('${API_URL}${data.links.dashboard}','_blank')">View Dashboard</button>
<button class="btn-primary" onclick="window.open('${API_URL}${data.links.csv}','_blank')" style="margin-top:10px">Download CSV</button>
</div>`;
document.getElementById('bulkResults').innerHTML=html;
document.getElementById('bulkResults').classList.add('show');
}
</script>
