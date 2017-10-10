$("#card").click(function () {
    $.ajax({
        url: '/api/getquestions',
        method: 'GET'
    })
        .done(function (response) {
            console.log('hej')
            $("#card").append(`${response.year}`);

        })
        .fail(function (xhr, status, error) {
            console.log(xhr, status, error);
        })
})
