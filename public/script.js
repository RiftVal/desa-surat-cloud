const form = document.getElementById("formData");

if(form){
form.addEventListener("submit",async(e)=>{
    e.preventDefault();

    const data = new FormData(form);

    await fetch("/api/pengajuan",{
        method:"POST",
        body:data
    });

    alert("Pengajuan berhasil");
});
}

const table=document.getElementById("data");

if(table){
fetch("/api/pengajuan")
.then(res=>res.json())
.then(data=>{
    data.forEach(d=>{
        table.innerHTML+=`
        <tr>
        <td>${d.nama}</td>
        <td>${d.nik}</td>
        <td>${d.jenis}</td>
        <td>${d.status}</td>
        </tr>`;
    });
});
}