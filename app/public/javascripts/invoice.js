var productsArr;
var discount = 0;
var quantity = 0;
var rate = 0;
var tax_val = 0;
var shipping_charge = 0;
var amt_paid = 0;

getInvoices();
function getInvoices() {
    // Store user entered data to local storage
    $.ajax({
        url: `${api_url}/invoice/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR){
            if(jqXHR.status === 200){
                const invoiceData = data.data.map(invoice =>{
                    return {
                        customer_name: invoice.customer_name,
                        due_amt: `$ ${invoice.due_amt}`,
                        inv_number: invoice.inv_number,
                        inv_date: moment(invoice.inv_date).format("YYYY-MM-DD"),
                        due_date: moment(invoice.due_date).format("YYYY-MM-DD"),
                        created_on: moment(invoice.created_on).format("YYYY-MM-DD hh:mm:ss A"),
                        action:`<a class="view_pdf_button" target="_blank" href="/view/${invoice.id}" style="">View</a><a class="download_pdf_button" target="_blank" href="/download/${invoice.id}" style=""><i class="fa fa-file-pdf-o fa-lg" aria-hidden="true"></i></a>`
                    }
                });
                $('#invoices-table').dataTable({
                    data: invoiceData,
                    destroy: true,
                    columns: [
                        {data: 'inv_number'},
                        {data: 'customer_name'},
                        {data: 'due_amt'},
                        {data: 'inv_date'},
                        {data: 'due_date'},
                        {data: 'created_on'},
                        {data: 'action'}
                    ],
                    responsive: true
                });
                $('.no_data_found').hide();
                $('#invoices-table').show();
            }
            else if(jqXHR.status === 204){
                $('#invoices-table').hide();
                $('.no_data_found').html('<h3 class="m-t-15">No Invoice Found</h3>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseJSON);
            $('#invoices-table').hide();
            $('.no_data_found').html('<h3 class="m-t-15">No Invoice Found</h3>');
        }
    });
    return false;
}
(() => {
    $.ajax({
        url: `${api_url}/customer/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(data, textStatus, jqXHR){
            if(jqXHR.status === 200){
                $('#customer_id').append(`<option value="">Select Customer</option>`);
                data.data.forEach(i=>{
                    $('#customer_id').append(`<option value="${i.customer_id}">${i.name}</option>`);
                })
            }
            else if(jqXHR.status === 204){
                $('#customer_id').append(`<option value="">No customer exist. Add new customer via Customer Tab above</option>`);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseJSON.message);
            $(".login_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');
            $(".login_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
        }
    });
    return false;
})();
(() => {
    $.ajax({
        url: `${api_url}/product/all`,
        type: 'get',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR){
            if(jqXHR.status === 200){
                productsArr = data.data;
                $('#product_id').append(`<option value="">Select Product</option>`);
                addProductsToSelect(1);
            }
            else if(jqXHR.status === 204){
                $('#product_id').append(`<option value="">No Product exist. Add new customer via Product Tab above</option>`);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseJSON);
            $('#products-table').hide();
            $('.no_data_found').html('<h3 class="m-t-15">No Product Found</h3>');
        }
    });
    return false;
})();

function addProductsToSelect(row_id){
    productsArr.forEach(i=>{
        $('.product.'+row_id).append(`<option value="${i.id}">${i.name}</option>`);
    })
}
$(document).ready(function () {

    $(document).on('submit', '.add-invoice-form', function () {
        const inv_number = $('input[name="inv_number"]').val().trim() ;
        const tax_val = $('input[name="tax_val"]').val().trim() ;
        const discount = $('input[name="discount"]').val().trim() ;
        const shipping_charge = $('input[name="shipping_charge"]').val().trim() ;
        const prepaid_amt = $('input[name="prepaid_amt"]').val().trim() ;
        const notes = $('textarea[name="notes"]').val().trim() ;
        const terms = $('textarea[name="terms"]').val().trim() ;
        const inv_date = $('input[name="inv_date"]').val().trim() ;
        const due_date = $('input[name="due_date"]').val().trim() ;
        const total_amt = parseFloat($('.total_amt').html().split(" ")[1]);
        const due_amt = parseFloat($('.balanace').html().split(" ")[1]);
        const customer_id = $('select[name="customer_id"]').val();

        let products = [];
        products.push({
            "product_id": $('select[name="product_id"]').val().trim(),
            "quantity": $('input[name="quantity"]').val().trim(),
            "rate": $('input[name="rate"]').val().trim()
        });

        let form_data = {inv_number, customer_id, inv_date, due_date, total_amt, due_amt,products};

        if (tax_val.length) {
            form_data = {...form_data,tax_val}
        }
        if (discount.length) {
            form_data = {...form_data,discount}
        }
        if (shipping_charge.length) {
            form_data = {...form_data,shipping_charge}
        }
        if (prepaid_amt.length) {
            form_data = {...form_data,prepaid_amt}
        }
        if (notes.length) {
            form_data = {...form_data,notes}
        }
        if (terms.length) {
            form_data = {...form_data,terms}
        }

        form_data = JSON.stringify(form_data);

        $.ajax({
            url: `${api_url}/invoice/new`,
            type: 'POST',
            contentType :'application/json',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", auth);
            },
            data: form_data,
            success: function(data, textStatus, jqXHR){
                if(jqXHR.status == 200){
                    $('.invoice_alert_div').removeClass('alert-danger').addClass('alert-success');
                    $(".invoice_alert_div").html("Inserted successfully").show().fadeTo(2000, 500).slideUp(500).hide(0,function () {
                        getInvoices();
                        $('.add-invoice-form').hide();
                        $('.add-invoice-form').trigger("reset");
                        $('.remove_new_invoice').hide();
                        $('.add_new_invoice').show();
                    });
                }
                else{
                    $(".invoice_alert_div").empty().hide().removeClass('alert-success').addClass('alert-danger');
                    $(".invoice_alert_div").text("Something didn't work").show().fadeTo(2000, 500).slideUp(500);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                $(".invoice_alert_div").empty().hide().addClass('alert-danger').removeClass('alert-success');

                if(jqXHR.hasOwnProperty('responseJSON') && jqXHR.responseJSON.hasOwnProperty('message'))
                    $(".invoice_alert_div").text(jqXHR.responseJSON.message).show().fadeTo(5000, 500).slideUp(500);
                else
                    $(".invoice_alert_div").text("Something didn't work").show(0).delay(3000).hide(0);
            }
        });
        return false;
    });

    $(document).on("click", ".add_new_invoice_product", function () {
        const count = $(".product_parent > div").length + 1;
        const html = `<div class="row ${count} m-t-15"> <div class="col-md-6 "> <label>Name</label> <select class="form-control product ${count}" required> <option>Select Product</option> </select> </div><div class="col-md-1 "> <label>Quantity</label> <input type="number" step="1" min="1" max="9999" class="form-control quantity ${count}" placeholder="Qty" name="quantity" required> </div><div class="col-md-2 "> <label>Rate (in $)</label> <input type="number" step="0.01" min="0.01" max="9999" class="form-control rate ${count}" placeholder="Rate" name="rate" required> </div><div class="col-md-2 "> <label>Amount (in $)</label> <div></div></div><div class="col-md-1 remove_product_row" data-rowid="${count}"><i class="fa fa-times" aria-hidden="true" ></i></div></div>`;
        $(".product_parent").append(html);
    });

    $(document).on('click', ".add_new_invoice", function () {
        $('.add-invoice-form').show();
        $('.remove_new_invoice').show();
        $('.add_new_invoice').hide();
    })

    $(document).on('click', ".remove_new_invoice", function () {
        $('.add-invoice-form').hide();
        $('.add-invoice-form').trigger("reset");
        $('.remove_new_invoice').hide();
        $('.add_new_invoice').show();
    })

    $(document).on("keyup", ".quantity,.rate", function (event) {
        determineRateQty();
    });

    $(document).on("change", ".quantity,.rate", function (event) {
        determineRateQty();
    });
    $(document).on("keyup", ".discount", function (event) {
        determineDiscount();
    });
    $(document).on("change", ".discount", function (event) {
        determineDiscount();
    });

    $(document).on("change", ".tax_val", function (event) {
        determineTaxVal();
    });

    $(document).on("keyup", ".tax_val", function (event) {
        determineTaxVal();
    });
    $(document).on("change", ".amt_paid", function (event) {
        determineAmtPaid();
    });

    $(document).on("keyup", ".amt_paid", function (event) {
        determineAmtPaid();
    });
    $(document).on("change", ".shipping_charge", function (event) {
        determineShipping();
    });

    $(document).on("keyup", ".shipping_charge", function (event) {
        determineShipping();
    });

    function calculateBalance() {

        let total = 0;
        let discounted_price = 0 || discount;
        let taxVal = tax_val || 0;
        let shippingVal = shipping_charge || 0;
        let amtPaid = amt_paid || 0;
        let amount = 0;
        const amountDivVal = $('.div-amount').html().trim();

        if(amountDivVal.length){
            amount = parseFloat(parseFloat(amountDivVal).toFixed(2));
        }
        discounted_price = amount - (amount * discounted_price / 100);

        total += discounted_price;
        total += (total * tax_val / 100);
        total += shippingVal;
        let balanace = total - amtPaid;
        if(discount<0 || taxVal < 0 || discount>100 || taxVal >100) {
            total = 0;
            balanace = 0;
        }
        $('.total_amt').html("$ "+ total.toFixed(2))
        $('.balanace').html("$ "+ balanace.toFixed(2))
    }
    function determineRateQty(){

        const quantityVal = $('.quantity').val().trim();
        const rateVal = $('.rate').val().trim();
        if(!quantityVal.length){
            quantity = 0;
        }
        else{
            quantity = parseFloat(quantityVal);
        }
        if(!rateVal.length){
            rate = 0;
        }
        else{
            rate = parseFloat(rateVal);
        }
        if(quantity && rate){
            $('.div-amount').html((parseFloat(quantity)*parseFloat(rate)).toFixed(2))
            calculateBalance();
        }
        else {
            $('.div-amount').html("0.00");
        }
        return false;
    }
    function determineDiscount(){
        const discountVal = $('.discount').val().trim();
        if(!discountVal.length){
            discount = 0;
        }
        else{
            discount = parseFloat(discountVal);
        }
        calculateBalance();
        return false;
    }
    function determineTaxVal(){
        const taxVal = $('.tax_val').val().trim();
        if(!taxVal.length){
            tax_val = 0;
        }
        else{
            tax_val = parseFloat(taxVal);
        }
        calculateBalance();
        return false;
    }
    function determineAmtPaid(){
        const amtPaid = $('.amt_paid').val().trim();
        if(!amtPaid.length){
            amt_paid = 0;
        }
        else{
            amt_paid = parseFloat(amtPaid);
        }
        calculateBalance();
        return false;
    }
    function determineShipping(){
        const shippingVal = $('.shipping_charge').val().trim();
        if(!shippingVal.length){
            shipping_charge = 0;
        }
        else{
            shipping_charge = parseFloat(shippingVal);
        }
        calculateBalance();
        return false;
    }
});
