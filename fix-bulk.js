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
