var DataMahasiswa = new Array();
var request = new XMLHttpRequest();

window.onload = init;

function init() {
	request.open("GET", "data.json", true);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			if (request.responseText != null) {
				var data = request.responseText;
				DataMahasiswa = parseToArray(data);
			}
		}
	}

	request.send();
}

function getDataMahasiswa() {			
	show(DataMahasiswa);
}

function parseToArray(jsonFile){
	var todoArray = JSON.parse(jsonFile);
	for (var i = 0; i < todoArray.length; i++) {
		var item = todoArray[i];
		DataMahasiswa.push(item);
	}

	return DataMahasiswa;
}

function show(Data){
	var div = document.getElementById("mahasiswa");

	var lengthRow = document.getElementsByTagName("tr").length;

	var input = document.getElementById("Search").value;

	var find = 1;
	if(lengthRow > 0){
		DeleteTable(lengthRow);
	}

	for(i = 0; i < Data.length; i++){
		var compare = true;

		var count = 0;
		while(count < input.length && compare){
			if(input[count].toUpperCase() != DataMahasiswa[i].nama[count].toUpperCase()){
				compare = false;
			}

			count++;
		}

		if(compare || (input == '')){
			var row = div.insertRow(find);
			var cell0 = row.insertCell(0);
			var cell1 = row.insertCell(1);
			var cell2 = row.insertCell(2);
			var cell3 = row.insertCell(3);
			var cell4 = row.insertCell(4);

			cell0.innerHTML = Data[i].nama;
			cell1.innerHTML = Data[i].semester;
			cell2.innerHTML = Data[i].hobby;
			cell3.innerHTML = '<button onclick="ShowUpdate('+i+')"> Update </button>';
			cell4.innerHTML = '<button onclick="Delete('+i+')"> Delete </button>';

			find++;
		}
	} 

	if(DataMahasiswa.length == 0){
		alert('Tidak Ada Data Untuk Ditampilkan');
	}
}

function DeleteTable(lengthRow){
	for(i = 1; i < lengthRow; i++){
		document.getElementById("mahasiswa").deleteRow(1);
	}
}

function Insert(){
	var pushData = new Object();

	pushData.nama = document.getElementById("nama").value;
    pushData.semester = document.getElementById("semester").value;
    pushData.hobby = document.getElementById("hobby").value;

    document.getElementById("nama").value = "";
    document.getElementById("semester").value = "";
    document.getElementById("hobby").value = "";

    if(pushData.nama != "" && pushData.semester != "" && pushData.hobby != ""){
	    DataMahasiswa.push(pushData);	

	    StoreJSON();
	}
	else{
		alert("isi semua data");
	}

	ShowInsert();
}

function Update(){
	var nama = document.getElementById("UpdateNama").value;
	var semester = document.getElementById("UpdateSemester").value;
	var hobby = document.getElementById("UpdateHobby").value;

	document.getElementById("UpdateNama").value = "";
    document.getElementById("UpdateSemester").value = "";
    document.getElementById("UpdateHobby").value = "";

	for(i = 0; i < DataMahasiswa.length; i++){
		if(DataMahasiswa[i].nama == nama){
			DataMahasiswa[i].semester = semester;
    		DataMahasiswa[i].hobby = hobby;
    		DataMahasiswa[i].nama = nama;
		}
	}

	if(nama != "" &&  hobby != "" && semester != ""){
		StoreJSON();
	}

	else{
		alert("isi semua data");
	}

	ShowUpdate(0);
}

function ShowInsert(){
	var x = document.getElementById("insert");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function ShowUpdate(id){
	var x = document.getElementById("update");
    
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }	

    if(x.style.display === "block"){
   		for(i = 0; i < DataMahasiswa.length; i++){
			if(i == id){
				document.getElementById("UpdateSemester").value = DataMahasiswa[i].semester;
	    		document.getElementById("UpdateHobby").value = DataMahasiswa[i].hobby;
	    		document.getElementById("UpdateNama").value = DataMahasiswa[i].nama;
			}
		}	
    }
}

function Delete(id){
	DataMahasiswa.splice(id, 1);

	StoreJSON();
}

function StoreJSON(){
	var URL = "save.php?data=" + encodeURI(JSON.stringify(DataMahasiswa));
	    
    request.open("GET", URL, true);
    request.setRequestHeader("Content-Type",
                             "text/plain;charset=UTF-8");

    request.send();

    getDataMahasiswa();
}