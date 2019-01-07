var page = 1;

var current_page = 1;

var total_page = 0;

var is_ajax_fire = 0;




manageData();




/* manage data list */

function manageData() {



    $.ajax({

        dataType: 'json',

        url: url,

        data: {page:page}

    }).done(function(data){



        total_page = data.last_page;

        current_page = data.current_page;



        $('#pagination').twbsPagination({

            totalPages: total_page,

            visiblePages: current_page,

            onPageClick: function (event, pageL) {

                page = pageL;

                if(is_ajax_fire != 0){

                    getPageData();

                }

            }

        });



        manageRow(data.data);

        is_ajax_fire = 1;

    });

}




$.ajaxSetup({

    headers: {

        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')

    }

});




/* Get Page Data*/

function getPageData() {

    $.ajax({

        dataType: 'json',

        url: url,

        data: {page:page}

    }).done(function(data){

        manageRow(data.data);

    });

}




/* Add new Post table row */

function manageRow(data) {

    var	rows = '';

    $.each( data, function( key, value ) {

        rows = rows + '<tr>';

        rows = rows + '<td>'+value.name+'</td>';

        rows = rows + '<td>'+value.email+'</td>';
        rows = rows + '<td>'+value.phone+'</td>';

        rows = rows + '<td data-id="'+value.id+'">';

        rows = rows + '<button data-toggle="modal" data-target="#edit-data" class="btn btn-primary edit-data">Edit</button> ';

        rows = rows + '<button class="btn btn-danger delete-data" onclick="Delete_data()">Delete</button>';

        rows = rows + '</td>';

        rows = rows + '</tr>';

    });

    $("tbody").html(rows);

}




/* Create new CUSTOMER */

$(".add-submit").click(function(e){

    e.preventDefault();

    var form_action = $("#add-modal").find("form").attr("action");

    var name = $("#add-modal").find("input[name='name']").val();

    var email = $("#add-modal").find("input[name='email']").val();
    var phone = $("#add-modal").find("input[name='phone']").val();



    $.ajax({

        dataType: 'json',

        type:'POST',

        url: form_action,

        data:{name:name, email:email,phone:phone}

    }).done(function(data){

        getPageData();

        $(".modal").modal('hide');

        toastr.success('Post Created Successfully.', 'Success Alert', {timeOut: 5000});

    });

});




/* Remove customer */
function Delete_data(id) {
    $("body").on("click",function(){

        var id = $(this).parent("td").data('id');

        var c_obj = $(this).parents("tr");



        $.ajax({

            dataType: 'json',

            type:'delete',

            url: url + '/' + id,

        }).done(function(data){



            c_obj.remove();

            toastr.success('Post Deleted Successfully.', 'Success Alert', {timeOut: 5000});

            getPageData();



        });

    });


}




/* Edit customer */

$("body").on("click",".edit-data",function(){

    var id = $(this).parent("td").data('id');

    var name = $(this).parent("td").prev("td").prev("td").prev("td").text();

    var email = $(this).parent("td").prev("td").prev("td").text();
    var phone = $(this).parent("td").prev("td").text();



    $("#edit-data").find("input[name='name']").val(name);

    $("#edit-data").find("input[name='email']").val(email);
    $("#edit-data").find("input[name='phone']").val(phone);
    $("#edit-data").find("form").attr("action",url + '/' + id);

});




/* Updated new customer */

$(".edit-submit").click(function(e){

    e.preventDefault();

    var form_action = $("#edit-data").find("form").attr("action");

    var name = $("#edit-data").find("input[name='name']").val();

    var email = $("#edit-data").find("input[name='email']").val();
    var phone = $("#edit-data").find("input[name='phone']").val();



    $.ajax({

        dataType: 'json',

        type:'PUT',

        url: form_action,

        data:{name:name, email:email, phone:phone}

    }).done(function(data){

        getPageData();

        $(".modal").modal('hide');

        toastr.success('Post Updated Successfully.', 'Success Alert', {timeOut: 5000});

    });

});
