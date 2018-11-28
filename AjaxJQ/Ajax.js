// Variable global untuk ambil data json
var datajson = new Array();

function load(){
    $('#mahasiswa-body tr').remove();
    $.ajax({ 
        type: 'GET', //Method dalam request JSON
        url: '../data.json',  //Link dimana file json disimpan
        data: { 
            get_param: 'value' //Standard dalam penyimpanan json
        }, //Response ada dua yaitu success dan error
        success: function (data) { 
            //ketika success data json disimpan dalam variable global
            datajson = data;
            
            //Melakukan looping untuk menambah row pada table
            $.each(data, function (key, value) {
                //Append digunakan untuk menambah element html 
                $('#mahasiswa')
                    .append($("<tr>")
                    .append($("<td>").append(value.nama))
                    .append($("<td>").append(value.semester))
                    .append($("<td>").append(value.hobby))
                    .append($("<td>").append($("<button>")
                    //attr digunakan untuk menambah attribute pada tag html
                    .attr("data-name", value.nama).attr("class", "delete").text('delete')))
                );
            });
        },
        error: function(){
            //Jika error akan menampilkan alert
            alert("Gagal mengambil data");
        }
    });
}

function clearField(){
    //Fungsi untuk menghapus isi / value pada form berdasarkan id
    $('#nama').val('');
    $('#semester').val('');
    $('#hobby').val('');
}

function store(){
    //Mengubah data json menjadi string
    datajson = JSON.stringify(datajson);
    
    $.ajax({ 
        type: 'POST', //Method dalam request 
        url: '../save.php',  //Link untuk melakukan simpan data json
        data: {
            'data' : datajson // data yang dikirim
        }, 
        success: function (data) {             
          clearField();
          load(); 
        },
        error: function(){
            alert("Gagal Save to JSON");
        }
    });   
}


$(document).ready(function () {
    //Seperti init, ketika tidak ada error dan halaman berhasil di load
    //maka event di dalam sini bisa dijalankan

    //event ini digunakan untuk mengambil data dan menampilkan pada table
    $("#show").click(function(){
       load(); 
    });

    //menampilkan form
    $("#tambah").click(function(){
        $("#insert").css("display", "block");
    });

    //event menyimpan data
    $("#store-insert").click(function(){
        //membuat Object baru
        var data = new Object();

        //memberi object data dengan value/isi dari form
        data.nama = $('#nama').val();
        data.semester = $('#semester').val();
        data.hobby = $('#hobby').val();

        //push digunakan untuk menambah data dalam object global
        datajson.push(data);
        
        //menjalankan fungsi simpan
        store();
    });

    //untuk menyembunyikan form
    $("#close-insert").click(function(){
        $("#insert").css("display", "none");
    });

    $("#showupdate").click(function(){
        $("#update").css("display", "block");
    });

    $("#close-update").click(function(){
        $("#update").css("display", "none");
    });

    //menjalankan fungsi hapus
    $(".delete").click(function(){
        //mengambil nilai dari attribute data-name
        //dan menyimpan dalam variable nama
        var nama = $( this ).attr('data-name');
        //melakukan looping dan menyimpan dalam datajson
        var datajson = $.grep(datajson, function (element) {
                            return element.nama != nama;
                        });

        store();
    });

    //delegate adalah membuat function di setiap kita menambahkan row
    //jadi akan melakukan generate function di setiap row dengan function
    //yang telah di buat
    $( "#mahasiswa" ).delegate( "tr", "dblclick", function() {
        var data = $(this).html().replace(/<td>/g, '').split('</td>', 3);

        $("#UpdateNama").val(data[0]);
        $("#UpdateSemester").val(data[1]);
        $("#UpdateHobby").val(data[2]);

        $("#update").css("display", "block");
    });

    $( "#mahasiswa" ).delegate( "tr td button", "click", function() {
        var nama = $( this ).attr('data-name');
        
        datajson = $.grep(datajson, function (element) {
                            return element.nama != nama;
                        });

        store();
    });

    //event yg digunakan untuk melakukan update
    $("#store-update").click(function(){
        var data = new Object();

        data.nama = $('#UpdateNama').val();
        data.semester = $('#UpdateSemester').val();
        data.hobby = $('#UpdateHobby').val();

        //mengambil panjang variable json
        var jsonlength = datajson.length;

        //melakukan proses update
        //jika nama sama maka data akan diubah
        for (var i = 0; i < jsonlength; i++){
            if (datajson[i].nama == data.nama){ 
                datajson[i].semester = data.semester;
                datajson[i].hobby = data.hobby;
            }
        }

        store();

        $("#update").css("display", "none");
    });

    $("#Search").on("keyup", function() {
        //mengubah nilai dari search menjadi kecil
        var value = $(this).val().toLowerCase();
        
        //melakukan filter dengan cara mengambil data
        //yang di dalam row tersebut ada nilai dari search
        $("#mahasiswa tbody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});