// var global untuk request dan data mahasiswa

var DataMahasiswa = new Array();
var request = new XMLHttpRequest();

window.onload = init;

function init() {
	//kirim request untuk ambil data json
	request.open("GET", "data.json", true);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			if (request.responseText != null) {
				//hasil request (response) di pindah ke var data
				var data = request.responseText;
				//data dijadikan array dan di taruh dalam var global DataMahasiswa
				DataMahasiswa = parseToArray(data);
			}
		}
	}

	request.send();
}

function getDataMahasiswa() {	
	//akses fungsi show		
	show(DataMahasiswa);
}

function parseToArray(jsonFile){
	//ubah data json menjadi array
	var todoArray = JSON.parse(jsonFile);
	for (var i = 0; i < todoArray.length; i++) {
		var item = todoArray[i];
		//Masukan data item hasil dari json ke dalam array DataMahasiswa
		DataMahasiswa.push(item);
	}

	return DataMahasiswa;
}

function show(Data){
	//Ambil tag table dg id mahasiswa
	var div = document.getElementById("mahasiswa");

	//Ambil tag tr dan menghitung banyakny tag tr
	var lengthRow = document.getElementsByTagName("tr").length;

	//Ambil isi dari tag search pada input cari
	var input = document.getElementById("Search").value;

	//variable untuk banyak data yang ditemukan
	var find = 1;

	//jika baris lebih dari 0 maka table di hapus dulu
	if(lengthRow > 0){
		//fungsi hapus table
		DeleteTable(lengthRow);
	}

	for(i = 0; i < Data.length; i++){
		//variable untuk membandingkan dengan kata pencarian
		var compare = true;
		//variable untuk menghitung banyak huruf
		var count = 0;
		//looping sebanyak huruf pada kata pencarian dan akan berhenti ketika 
		//sudah sampai huruf terakhir atau jika huruf yang di bandingkan tidak sama
		while(count < input.length && compare){
			//pengecekan apakah huruf pada kata pencarian sama dengan nama yang ada pada DataMahasiswa
			//melakukan uppercase agar tidak terpengaruh case sensitive
			if(input[count].toUpperCase() != DataMahasiswa[i].nama[count].toUpperCase()){
				//jika tidak sama var compare di set false
				compare = false;
			}
			//penambahan count untuk berganti ke huruf selanjutnya
			count++;
		}

		//jika compare atau kata pencarian kosong maka akan mengisi data pada table
		if(compare || (input == '')){
			//membuat table pada banyak baris data yang ditemukan
			//baris 0 untuk judul, jadi dimulai dari baris 1
			var row = div.insertRow(find);
			//baris 1, kolom 0, dst
			var cell0 = row.insertCell(0);
			var cell1 = row.insertCell(1);
			var cell2 = row.insertCell(2);
			var cell3 = row.insertCell(3);
			var cell4 = row.insertCell(4);

			//Mengisi kolom 0 (Pertama) dg nama. dst
			cell0.innerHTML = Data[i].nama;
			cell1.innerHTML = Data[i].semester;
			cell2.innerHTML = Data[i].hobby;
			//membuat button untuk update beserta event dan delete beserta event
			cell3.innerHTML = '<button onclick="ShowUpdate('+i+')"> Update </button>';
			cell4.innerHTML = '<button onclick="Delete('+i+')"> Delete </button>';

			//jika data ditampilkan maka find ditambah 1
			find++;
		}
	} 

	//jika data kosong maka ditampilkan alert
	if(DataMahasiswa.length == 0){
		alert('Tidak Ada Data Untuk Ditampilkan');
	}
}

function DeleteTable(lengthRow){
	//untuk mengapus sebanyak baris pada table, kecuali baris judul
	for(i = 1; i < lengthRow; i++){
		document.getElementById("mahasiswa").deleteRow(1);
	}
}

function Insert(){
	//variable untuk object yang nantinya akan ditambahkan pada json
	var pushData = new Object();

	//memberikan nilai pada object dengan mengambil nilai dari tiap input
	//yang ada pada html
	pushData.nama = document.getElementById("nama").value;
    pushData.semester = document.getElementById("semester").value;
    pushData.hobby = document.getElementById("hobby").value;

    //Validasi untuk pengecekan apakah input ada yang kosong atau tidak
    if(pushData.nama != "" && pushData.semester != "" && pushData.hobby != ""){
    	//jika tidak ada, maka akan ditambahkan ke variable DataMahasiswa
	    DataMahasiswa.push(pushData);	

	    //Kemudian lanjut ke proses simpan ke file json
	    StoreJSON();
	}
	//Jika ada 1 saja field kosong maka akan muncul alert
	else{
		alert("isi semua data");
	}

	//mengapus isi dari tiap file input
	document.getElementById("nama").value = "";
    document.getElementById("semester").value = "";
    document.getElementById("hobby").value = "";

    //membuat form input data baru menjadi tidak muncul
	ShowInsert();
}

function Update(){
	//mengambil nilai dari input
	var nama = document.getElementById("UpdateNama").value;
	var semester = document.getElementById("UpdateSemester").value;
	var hobby = document.getElementById("UpdateHobby").value;

	//looping sebanyak isi dari DataMahasiswa
	for(i = 0; i < DataMahasiswa.length; i++){
		//Melakukan perbandingan antara nama yang ada field input
		//dengan nama yang ada pada data
		if(DataMahasiswa[i].nama == nama){
			//Jika cocok maka data akan diubah
			//sesuai dengan isi dari input
			DataMahasiswa[i].semester = semester;
    		DataMahasiswa[i].hobby = hobby;
    		DataMahasiswa[i].nama = nama;
		}
	}

	//Validasi apakah ada field input yang kosong
	if(nama != "" &&  hobby != "" && semester != ""){
		//Jika tidak ada maka akan save ke file json
		//Menghapus isi field dari form update
		document.getElementById("UpdateNama").value = "";
	    document.getElementById("UpdateSemester").value = "";
	    document.getElementById("UpdateHobby").value = "";

	    //membuat form update tidak tampil
		ShowUpdate(0);
		
		StoreJSON();
	}

	//Jika ada field yang kosong maka akan mencul alert
	else{
		alert("isi semua data");
	}
}

function ShowInsert(){
	//Mengambil form insert dengan id insert
	var x = document.getElementById("insert");
	//jika form tidak tampil, maka akan ditampilkan
    if (x.style.display === "none") {
        x.style.display = "block";
    } 
    //sebaliknya
    else {
        x.style.display = "none";
    }
}

function ShowUpdate(id){
	//Mengambil form update dengan id update
	var x = document.getElementById("update");
    //Jika form tidak tampil, maka akan ditampilkan
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }	

    //ketika form tampil maka akan mengisi field input
    //dengan data yang akan di update
    if(x.style.display === "block"){
   		for(i = 0; i < DataMahasiswa.length; i++){
   			//jika sesuai dengan urutan data pada DataMahasiswa
   			//maka data akan di isikan ke dalam field input
			if(i == id){
				//mengisi field input denga data yang sesuai
				document.getElementById("UpdateSemester").value = DataMahasiswa[i].semester;
	    		document.getElementById("UpdateHobby").value = DataMahasiswa[i].hobby;
	    		document.getElementById("UpdateNama").value = DataMahasiswa[i].nama;
			}
		}	
    }
}

//fungsi untuk mengapus data pada json
function Delete(id){
	//mengapus 1 data sesuai urutan yang dipilih
	DataMahasiswa.splice(id, 1);

	//simpan ke file json
	StoreJSON();
}

function StoreJSON(){
	//Mengambil url untuk save DataMahasiswa ke dalam file json
	var URL = "save.php?data=" + encodeURI(JSON.stringify(DataMahasiswa));
	
	//request untuk membuka data
    request.open("GET", URL, true);
    request.setRequestHeader("Content-Type",
                             "text/plain;charset=UTF-8");

    //kirim request
    request.send();

    //update tampilan table
    getDataMahasiswa();
}