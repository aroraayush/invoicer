$(document).on('click', '.logout-root', function () {
    $.ajax({
        url: `${api_url}/user/logout`,
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", auth);
        },
        success: function(data, textStatus, jqXHR){
            if(jqXHR.status == 200){
                localStorage.clear();
                window.location = "/login";
            }
        },
        error: function(data,bb,cc){
            console.log("Already logged out")
            setTimeout(window.location = "/login",500);
            localStorage.clear()
        }
    });
    return false;
});