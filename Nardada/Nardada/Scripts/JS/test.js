var cardDeck;
//skall senare regleras av spelarna i settings vid början av spelet
var winLimit = 3; 
var player1 = [];
var player2 = [];
var players = [player1, player2];
var currentPlayer = 0;
var playerName1 ='';
var playerName2 = '';

$('#startbutton').click(function () {
    playerName1 = $('#textplayer1').val();
    playerName2 = $('#textplayer2').val();
    winLimit = $('#winlimittext').val();
    console.log(playerName1, playerName2, winLimit)
    $('#page1').hide();
    $('#page2').show();
})

//startar spelet och laddar in det som beövs för att spela
$(document).ready(function () {
    console.log('page2');
    getStartYearForPlayers();
    enableCurrentPlayer();
    //hämtar kortlek från db. visar även första kortet pga laddtid (vill egentligen inte ha visa kortet i denna funktion)
    getCardDeckFromDB();
    //här ska showNewCard ligga egentligen
    
    let nr = 0;
    players.forEach(function (player) {
        drawTimeline(player, nr)
        nr++; 
    });
    console.log(playerName1, playerName2, winLimit)
})

function getStartYearForPlayers() {
player1.push(Math.floor(Math.random() * (2000 - 1900 + 1)) + 1900);
player2.push(Math.floor(Math.random() * (2000 - 1900 + 1)) + 1900);
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
    let sortedList = player.sort();
    let height = heightCalculation(player);
    for (var i = 0; i < player.length; i++) {
        $(`#player${nr}`).append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\"></div> </div> <div class=\"yearblock\">${sortedList[i]}</div>`);
    }
    $(`#player${nr}`).append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\"></div> </div> `);
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
    players[currentPlayer].push(year);
}

function checkIfWon(player) { 
    if (player.length >= winLimit) {
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
    let color = getCardColor();
    $(".cardContent").css("background-color", color);
    $(".card").css("border-color", color)

    $(".cardContent").append(`<div id="categoryHeader">${cardDeck[0].Name}</div><div id="questionArea">${cardDeck[0].Question}</div>`);
}

function getCardColor() {
    switch (cardDeck[0].Name) {
        case "Underhållning":
            return "purple";

        case "Kända personer och händelser":
            return "darkorange";

        case "Prylar, nyheter och uppfinningar":
            return "lightseagreen";

        default:
            return "";
    }
}
function changePlayer() {
    currentPlayer = (currentPlayer + 1) % players.length;
    $('.timelinecontainer').addClass('disablePlayer');
    $(`#player${currentPlayer}`).removeClass('disablePlayer');
    $(`#player${currentPlayer}`).css('pointer-events', 'all');
}

