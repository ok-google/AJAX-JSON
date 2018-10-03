var datajson = new Array();

function load(){
    $('#mahasiswa-body tr').remove();
    $.ajax({ 
        type: 'GET', 
        url: '../data.json', 
        data: { get_param: 'value' }, 
        success: function (data) { 
            datajson = data;
    
            $.each(data, function (key, value) { 
                $('#mahasiswa')
                    .append($("<tr>")
                    .append($("<td>").append(value.nama))
                    .append($("<td>").append(value.semester))
                    .append($("<td>").append(value.hobby))
                    .append($("<td>").append($("<button>")
                    .attr("data-name", value.nama).attr("class", "delete").text('delete')))
                );
            });
        }
    });
}

function clearField(){
    $('#nama').val('');
    $('#semester').val('');
    $('#hobby').val('');
}

function store(data){
    datajson = JSON.stringify(datajson);
    
    $.ajax({ 
        type: 'POST', 
        url: '../save.php', 
        data: {'data' : datajson}, 
        success: function (data) {             
          clearField();
          load(); 
        }
    });   
}


$(document).ready(function () {
    $("#show").click(function(){
       load(); 
    });

    $("#tambah").click(function(){
        $("#insert").css("display", "block");
    });

    $("#store-insert").click(function(){
        var data = new Object();

        data.nama = $('#nama').val();
        data.semester = $('#semester').val();
        data.hobby = $('#hobby').val();

        datajson.push(data);
        
        store();
    });

    $("#close-insert").click(function(){
        $("#insert").css("display", "none");
    });

    $("#showupdate").click(function(){
        $("#update").css("display", "block");
    });

    $("#close-update").click(function(){
        $("#update").css("display", "none");
    });

    $(".delete").click(function(){
        var nama = $( this ).attr('data-name');
        console.log(nama);
        var datajson = $.grep(datajson, function (element) {
                            return element.nama != nama;
                        });

        store();
    });

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

    $("#store-update").click(function(){
        var data = new Object();

        data.nama = $('#UpdateNama').val();
        data.semester = $('#UpdateSemester').val();
        data.hobby = $('#UpdateHobby').val();

        var jsonlength = datajson.length;

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
        var value = $(this).val().toLowerCase();
    
        $("#mahasiswa tbody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});