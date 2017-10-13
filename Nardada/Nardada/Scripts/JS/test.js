var cardDeck;
//skall senare regleras av spelarna i settings vid början av spelet
var winLimit = 3;
//var player1 = [];
//var player1 = { name: "", timeLine: [], color: "", number: 0 };
//var player2 = [];
//var player2 = { name: "", timeLine: [], color: "", number: 1 };
//var player3 = { name: "Henrik", timeLine: [], color: "yellow", number: 2 };

var players = [];
var currentPlayer = 0;



$('#startbutton').click(function () {
    $('.settingsbox').each(function (index) {
        let color = $(this).children().find('.border').css('background-color');
        let name = $(this).children('input').val();
        players[index] = { name: name, timeLine: [], color: color, number: index };
        getStartYearForPlayers(players[index])
        console.log(players)
    })
    //player1.name = $('#textplayer1').val();
    //player2.name = $('#textplayer2').val();
    //player1.color = $('#playercolor1').val();
    //player2.color = $('#playercolor2').val();
    winLimit = $('#winlimittext').val();

    $('#page1').hide();
    $('#page2').show();

    //let nr = 0;
    //players.forEach(function (player) {
    //    drawTimeline(player, nr)
    //    nr++;
    //});
    //$(`#footer1`).css('background-color', `${player1.color}`);
    //$(`#footer2`).css('background-color', `${player2.color}`);
    //$(`#arrow1`).css('border-top', `20px solid ${player1.color}`);
    //$(`#arrow2`).css('border-top', `20px solid ${player2.color}`);
    //$(`#footer1`).text(player1.name);
    //$(`#footer2`).text(player2.name);
    let j = 0;

    for (var i = 0; i < players.length + 1; i++) {
        if (players.length % 2 == 0) {
            if (i == players.length / 2) {
                createCardDisplay();
            }
            else {
                createDisplay(players[j]);
                j++;
            }
        }
        else if (players.length % 2 == 1) {
            if (i == (players.length - 1) / 2) {
                createCardDisplay();
            }
            else {
                createDisplay(players[j]);
                j++;
            }
        }
    }
    enableCurrentPlayer();

    showNewCard();
})

$('body').on("click", "#addplayer", function () {
    $('#settingsdisplay').find('#addplayer').remove();

    $('#settingsdisplay').append(`<div class="settingsbox">
                    <h2>Ny spelare</h2>
                    <h3>Färg</h3>
                    <div class="colorbox" id="colorbox1">
                        <div class="colordot purple"></div>
                        <div class="colordot red"></div>
                        <div class="colordot orange"></div>
                        <div class="colordot blue"></div>
                    </div>
                    <input type="text" class="textbox" placeholder="Namn"> 
                </div>
            <p id="addplayer">Lägg till spelare</p>`)
})
//startar spelet och laddar in det som beövs för att spela
$(document).ready(function () {
    prepareNewGame();
    //hämtar kortlek från db. visar även första kortet pga laddtid (vill egentligen inte ha visa kortet i denna funktion)
    getCardDeckFromDB();
    //här ska showNewCard ligga egentligen
})

function prepareNewGame() {
    currentPlayer = 0;
    $('#playingfield').empty();
    //töm timelines för spelarna (annars ligger förra rundans år kvar)
    players.forEach(function (player) {
        player.timeLine = [];
        getStartYearForPlayers(player);
    });

    //enableCurrentPlayer();
}

$('body').on("click", ".colordot", function () {
    $(this).siblings().removeClass('border');
    $(this).addClass('border');
})

//$('.colordot').click(function () {
//    //if ($(this).parent().attr("id") == "colorbox1") {
//    //    player1.color = $(this).css('background-color');
//    //    console.log(player1);

//    //}
//    //else if ($(this).parent().attr("id") == "colorbox2") {
//    //    player2.color = $(this).css('background-color');
//    //    console.log(player2);

//    //}
//    $(this).siblings().removeClass('border');
//    $(this).addClass('border');
//})


function getStartYearForPlayers(player) {
    player.timeLine.push(Math.floor(Math.random() * (2000 - 1900 + 1)) + 1900);
}

function enableCurrentPlayer() {
    $(`#display${currentPlayer}`).addClass('active');
}

function getCardDeckFromDB() {
    $.ajax({
        url: '/api/getquestions',
        method: 'GET'
    })
        .done(function (response) {
            cardDeck = response;
            cardDeck = _.shuffle(cardDeck);
            showNewCard(); //vill inte ha den här, men behöver vänta på cardDeck laddas in...
        })
        .fail(function (xhr, status, error) {
            console.log(xhr, status, error);
        })
}
function createCardDisplay() {
    $('#playingfield').append(`<div class="display">
            <div class="ful"></div>
            <div class="card">
                <div id="logoName">Nardada</div>
                <div class="cardContent"></div>
            </div>
        </div>`)
}

function createDisplay(player) {
    let width = displayWidthCalculation();
    $('#playingfield').append(`<div class=\"display timeline\" id=\"display${player.number}\" style=\"width: ${width}vw; background-color: ${player.color}\" >
            <div class=\"timelinecontainer\" id=\"timelinecontainer${player.number}\"/>
            <div class=\"arrowcontainer\">
            <div class=\"arrow\" style=\"border-top-color: ${player.color}\"/>
            </div>
            <div class=\"todayfooter\">${player.name}</div></div>`) /*{player.name }</div >*/
    //$(`#arrow${nr}`).css('border-top-color', `${player.color}`);
    drawTimeline(player, player.number);

}

//denna funktion skriver ut tidslinjerna
function drawTimeline(player, nr) {
    //tömmer vyn för timeline innan den målas om
    $(`#timelinecontainer${nr}`).empty();
    $(`#timelinecontainer${nr}`).css('background-color', 'white');
    let sortedList = player.timeLine.sort();
    let height = heightCalculation(player.timeLine);
    for (var i = 0; i < player.timeLine.length; i++) {
        $(`#timelinecontainer${nr}`).append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\" style="background-color:${player.color}"></div> </div> <div class=\"yearblock\" >${sortedList[i]}</div>`);
    }
    $(`#timelinecontainer${nr}`).append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\" style="background-color:${player.color}"></div> </div> `);
}

function displayWidthCalculation() {
    let width = (100 - 25) / players.length;
    return width;
}

function heightCalculation(list) {
    let height = (100 - (list.length * 4)) / (list.length + 1);
    return height;
}

$("body").on("mouseenter", ".timelineblock", function () {
    $(this).children().toggleClass('hoverline');
})
$("body").on("mouseleave", ".timelineblock", function () {
    $(this).children().toggleClass('hoverline');
})

//nu har tidslinjerna ritats upp, ett kort visats och man ska trycka på tidslinjen för att svara
$("body").on("click", ".timelineblock", function () {

    $(`#display${currentPlayer}`).addClass("lookable");
    //här tar vi in svaret från spelaren
    let yearBefore = $(this).prev().text();
    let yearAfter = $(this).next().text();

    //här kontrollerar vi om svaret är rätt
    if (cardDeck[0].Year >= yearBefore && (cardDeck[0].Year <= yearAfter || yearAfter == "")) {
        showCorrectCard();
        addYearToList(cardDeck[0].Year);
        var ifWon = checkIfWon(players[currentPlayer]);
        if (ifWon) {
            $('#page2').hide();
            $('#page3').show();
            console.log(players[currentPlayer].name)
            $('#winner').html(`<p>${players[currentPlayer].name} är en riktig vinnare!</p> <p>De andra är skyldig dig ett kinderägg</p>`)
        }
        drawTimeline(players[currentPlayer], currentPlayer);
    } else {
        showWrongCard();
    }
})

function showWrongCard() {
    $('.card').addClass('answer');
    $('.cardContent').empty();
    $('.cardContent').css('background-color', 'red');
    $('.card').css('border-color', 'red')
    $('.cardContent').append(`
            <div class="rightorwrong">Fel</div>
            <div id="aretVar">Året var</div>
            <div id="correctYear">${cardDeck[0].Year}</div>`);
}

function showCorrectCard() {
    $('.card').addClass('answer');
    $('.cardContent').empty();
    $('.cardContent').css('background-color', 'yellowgreen');
    $('.card').css('border-color', 'yellowgreen')
    $('.cardContent').append(`
            <div class="rightorwrong">Rätt</div>
            <div id="aretVar">Året var</div>
            <div id="correctYear">${cardDeck[0].Year}</div>`);
}

function addYearToList(year) {
    players[currentPlayer].timeLine.push(year);
}

function checkIfWon(player) {
    if (player.timeLine.length >= winLimit) {
        console.log('du har vunnit spelet!');
        return true;
    } else {
        console.log('spelaren har ännu inte vunnit, fortsätt med nytt kort');
        return false;
    }
}

$('body').on("click", ".answer", function () {
    //ta bort översta kortet i frågeleken
    cardDeck.shift();
    showNewCard();
    changePlayer();
})

function showNewCard() {
    $('.card').removeClass('answer');
    $(".cardContent").empty();

    let color = cardDeck[0].Color;
    $(".cardContent").css("background-color", color);
    $(".card").css("border-color", color)

    $(".cardContent").append(`<div id="categoryHeader">${cardDeck[0].Name}</div><div id="questionArea">${cardDeck[0].Question}</div>`);
}


function changePlayer() {
    $(`#display${currentPlayer}`).removeClass('active lookable');
    currentPlayer = (currentPlayer + 1) % players.length;
    $(`#display${currentPlayer}`).addClass('active');
}

$('#restartbutton').click(function () {
    $('#page3').hide();
    $('#page1').show();
    cardDeck.shift();
    prepareNewGame();
})

//winlimit slider
$("#slider").slider({
    value: 2,
    min: 2,
    max: 20,
    step: 1,
},
    {
        create: function () {
            $("#custom-handle").text($(this).slider("value"));
        },
        slide: function (event, ui) {
            $("#custom-handle").text(ui.value);
        }
    });

