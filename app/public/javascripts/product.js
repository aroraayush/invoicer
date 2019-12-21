getProducts();
function getProducts() {
    $.ajax({
        url: `${api_url}/product/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR){
            if(jqXHR.status === 200){
                $('#products-table').dataTable({
                    data: data.data,
                    destroy: true,
                    columns: [
                        {data: 'name'},
                        {data: 'label'},
                        {data: 'description'},
                        {data: 'rate'},
                        {data: 'sku'}
                    ],
                    responsive: true
                });
                $('.no_data_found').hide();
                $('#products-table').show();
            }
            else if(jqXHR.status === 204){
                $('#products-table').hide();
                $('.no_data_found').html('<h3 class="m-t-15">No Product Found</h3>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseJSON);
            $('#products-table').hide();
            $('.no_data_found').html('<h3 class="m-t-15">No Product Found</h3>');
        }
    });
    return false;
}
$(document).ready(function () {

    $(document).on('submit', '.add-product-form', function () {
        const name = $('input[name="name"]').val();
        const label = $('input[name="label"]').val();
        const description = $('input[name="description"]').val();
        const rate = $('input[name="rate"]').val();
        const sku = $('input[name="sku"]').val();

        let form_data = {name,label,description,rate,sku};
        form_data = JSON.stringify(form_data);

        $.ajax({
            url: `${api_url}/product/new`,
            type: 'POST',
            contentType :'application/json',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", auth);
            },
            data: form_data,
            success: function(data, textStatus, jqXHR){
                if(jqXHR.status == 200){
                    $('.product_alert_div').removeClass('alert-danger').addClass('alert-success');
                    $(".product_alert_div").html("Inserted successfully").show().fadeTo(2000, 500).slideUp(500).hide(0,function () {
                        getProducts();
                        $('.add-product-form').hide();
                        $('.add-product-form').trigger("reset");
                        $('.remove_new_product').hide();
                        $('.add_new_product').show();
                    });
                }
                else{
                    $(".product_alert_div").empty().hide().removeClass('alert-success').addClass('alert-danger');
                    $(".product_alert_div").text("Something didn't work").show().fadeTo(2000, 500).slideUp(500);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                $(".product_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');

                if(jqXHR.hasOwnProperty('responseJSON') && jqXHR.responseJSON.hasOwnProperty('message'))
                    $(".product_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
                else
                    $(".product_alert_div").text("Something didn't work").show(0).delay(3000).hide(0);
            }
        });
        return false;
    });

    $(document).on('click', ".add_new_product", function () {
        $('.add-product-form').show();
        $('.remove_new_product').show();
        $('.add_new_product').hide();
    })

    $(document).on('click', ".remove_new_product", function () {
        $('.add-product-form').hide();
        $('.add-product-form').trigger("reset");
        $('.remove_new_product').hide();
        $('.add_new_product').show();
    })
});