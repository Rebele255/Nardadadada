$("#card").ready(function () {
    $.ajax({
        url: '/api/getquestions',
        method: 'GET'
    })
        .done(function (response) {
            console.log("response", response)
            
            $(".cardContent").append(`<div id="categoryHeader">${response[0].Name}</div><div id="questionArea">${response[0].Question}</div>`);

        })
        .fail(function (xhr, status, error) {
            console.log(xhr, status, error);
        })
})
