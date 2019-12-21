function getCustomers() {
    $.ajax({
        url: `${api_url}/customer/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(data, textStatus, jqXHR){
            if(jqXHR.status === 200){

                $('#customers-table').dataTable({
                    data: data.data,
                    destroy: true,
                    columns: [
                        {data: 'name'},
                        {data: 'mobile'},
                        {data: 'email'},
                        {data: 'company_name'},
                        {data: 'company_type'},
                        {data: 'tin_number'}
                    ],
                    responsive: true
                });
                $('.no_data_found').hide();
                $('#customers-table').show();
            }
            else if(jqXHR.status === 204){
                $('#customers-table').hide();
                $('.no_data_found').html('<h3 class="m-t-15">No Customer Found</h3>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseJSON.message);
            $(".login_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');
            $(".login_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
        }
    });
    return false;
}
getCustomers();

$(document).ready(function () {

    $(document).on('submit', '.add-customer-form', function () {
        const name = $('input[name="name"]').val();
        const mobile = $('input[name="mobile"]').val();
        const company_name = $('input[name="company_name"]').val();
        const type_id = $('select[name="company_type"]').val();
        const tin_number = $('input[name="tin_number"]').val();
        const email = $('input[name="email"]').val();

        let form_data = {name,mobile,company_name,type_id,tin_number,email};
        form_data = JSON.stringify(form_data);

        $.ajax({
            url: `${api_url}/customer/new`,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", auth);
            },
            contentType :'application/json',
            data: form_data,
            success: function(data, textStatus, jqXHR){
                if(jqXHR.status == 200){
                    $('.customer_alert_div').removeClass('alert-danger').addClass('alert-success');
                    $(".customer_alert_div").html("Inserted successfully").show().fadeTo(2000, 500).slideUp(500).hide(0,function () {
                        getCustomers();
                        $('.add-customer-form').hide();
                        $('.add-customer-form').trigger("reset");
                        $('.remove_new_customer').hide();
                        $('.add_new_customer').show();
                    });
                }
                else{
                    $(".customer_alert_div").empty().hide().removeClass('alert-success').addClass('alert-danger');
                    $(".customer_alert_div").text("Something didn't work").show().fadeTo(2000, 500).slideUp(500);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                $(".customer_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');

                if(jqXHR.hasOwnProperty('responseJSON') && jqXHR.responseJSON.hasOwnProperty('message'))
                    $(".customer_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
                else
                    $(".customer_alert_div").text("Something didn't work").show(0).delay(3000).hide(0);
            }
        });
        return false;
    });

    $(document).on('click', ".add_new_customer", function () {
        $('.add-customer-form').show();
        $('.remove_new_customer').show();
        $('.add_new_customer').hide();
    })

    $(document).on('click', ".remove_new_customer", function () {
        $('.add-customer-form').hide();
        $('.add-customer-form').trigger("reset");
        $('.remove_new_customer').hide();
        $('.add_new_customer').show();
    })
});