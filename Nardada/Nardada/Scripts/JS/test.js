var cardDeck;
//skall senare regleras av spelarna i settings vid början av spelet
var winLimit = 3; 
//var player1 = [];
var player1 = { name: "", timeLine: [], color: "" };
//var player2 = [];
var player2 = { name: "", timeLine: [], color: "" };
var players = [player1, player2];
var currentPlayer = 0;
var playerName1 ='';
var playerName2 = '';

//startar spelet och laddar in det som beövs för att spela
$(document).ready(function () {
    getStartYearForPlayers();
    enableCurrentPlayer();
    //hämtar kortlek från db. visar även första kortet pga laddtid (vill egentligen inte ha visa kortet i denna funktion)
    getCardDeckFromDB();
    //här ska showNewCard ligga egentligen
    
})

$('.colordot').click(function () {
    if ($(this).parent().attr("id") == "colorbox1") {
        player1.color = $(this).css('background-color');
        console.log(player1);

    }
    else if ($(this).parent().attr("id") == "colorbox2") {
        player2.color = $(this).css('background-color');
        console.log(player2);

    }
    $(this).siblings().removeClass('border');
    $(this).addClass('border');
})



$('#startbutton').click(function () {
    player1.name = $('#textplayer1').val();
    player2.name = $('#textplayer2').val();
    //player1.color = $('#playercolor1').val();
    //player2.color = $('#playercolor2').val();
    winLimit = $('#winlimittext').val();
    console.log(player1.name, player2.name, winLimit, player1.color, player2.color)
    console.log(player1);
    console.log(player2);
    $('#page1').hide();
    $('#page2').show();

    let nr = 0;
    players.forEach(function (player) {
        drawTimeline(player, nr)
        nr++;
    });
})




function getStartYearForPlayers() {
player1.timeLine.push(Math.floor(Math.random() * (2000 - 1900 + 1)) + 1900);
player2.timeLine.push(Math.floor(Math.random() * (2000 - 1900 + 1)) + 1900);
}
function enableCurrentPlayer() {
    $('.timelinecontainer').addClass('disablePlayer');
    $(`#player${currentPlayer}`).removeClass('disablePlayer');
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


//denna funktion skriver ut tidslinjerna
function drawTimeline(player, nr) {
    //tömmer vyn för timeline innan den målas om
    $(`#player${nr}`).empty(); 
    let sortedList = player.timeLine.sort();
    let height = heightCalculation(player.timeLine);
    for (var i = 0; i < player.timeLine.length; i++) {
        $(`#player${nr}`).append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\" style="background-color:${player.color}"></div> </div> <div class=\"yearblock\" >${sortedList[i]}</div>`);
    }
    $(`#player${nr}`).append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\" style="background-color:${player.color}"></div> </div> `);
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
    
    $(this).parent().css("pointer-events", "none");
    //här tar vi in svaret från spelaren
    let yearBefore = $(this).prev().text();
    let yearAfter = $(this).next().text();

    //här kontrollerar vi om svaret är rätt
    if (cardDeck[0].Year >= yearBefore && (cardDeck[0].Year <= yearAfter || yearAfter == "")) {
        showCorrectCard();
        addYearToList(cardDeck[0].Year);
        checkIfWon(players[currentPlayer]);
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
    currentPlayer = (currentPlayer + 1) % players.length;
    $('.timelinecontainer').addClass('disablePlayer');
    $(`#player${currentPlayer}`).removeClass('disablePlayer');
    $(`#player${currentPlayer}`).css('pointer-events', 'all');
}

