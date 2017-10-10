﻿var cardDeck;
var testList = [2000, 1995, 1980, 1900, 1904]
var player1 = [2000, 1995];
var player2 = [1980, 1900, 1904, 2012, 1977, 1988, 1954];
var players = [player1, player2];

$(document).ready(function () {
    getCardDeckFromDB();
    let nr = 0;
    console.log(players)
    console.log(nr)
    players.forEach(function (player) {
        drawTimeline(player, nr)
        nr++; 
    });
}) //egentligen när spelet laddas in

function getCardDeckFromDB() {
    $.ajax({
        url: '/api/getquestions',
        method: 'GET'
    })
        .done(function (response) {
            console.log("response", response)
            cardDeck = response;
            console.log(cardDeck);
            showNewCard(); //vill inte ha den här, men behöver vänta på cardDeck laddas in...
        })
        .fail(function (xhr, status, error) {
            console.log(xhr, status, error);
        })
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

function getSortList() {
    let sortedList = testList.sort();
    return sortedList;
}

//$(".timelinecontainer").ready(drawTimeline())

$("body").on("click", ".timelineblock", function () {
    let yearBefore = $(this).prev().text();
    let yearAfter = $(this).next().text();
    console.log(yearBefore);
    console.log(yearAfter);
    if (cardDeck[0].Year >= yearBefore && cardDeck[0].Year <= yearAfter) {
        console.log('yes det var rätt!');
        showCorrectCard();
        addYearToList();
        drawTimeline();
    } else {
        console.log('nej det blev fel');
        showWrongCard();
    }
    //getCardFromDB()
    //showNewCard()
})

function showCorrectCard() {
    console.log('Nu visas det korrekta kortet (grönt)');
    $('.cardContent').empty();
    $('.cardContent').addClass('rightGreen');
    $('.cardContent').append(`
            <div class="answer">Rätt</div>
            <div id="aretVar">Året var</div>
            <div id="correctYear">${cardDeck[0].Year}</div>`);
}

function showWrongCard() {
    console.log('Nu visas det felaktiga kortet (rött)');
    $('.cardContent').empty();
    $('.cardContent').addClass('wrongRed');
    $('.cardContent').append(`
            <div class="answer">Fel</div>
            <div id="aretVar">Året var</div>
            <div id="correctYear">${cardDeck[0].Year}</div>`);
}

function addYearToList() {
    console.log('Nu läggs det rätta kortet till i listan');
}

function drawTimeline(player, nr) {
    $(`#player${nr}`).empty(); //tömmer vyn för timeline innan den målas om
    let sortedList = player.sort();
    let height = heightCalculation(player);
    for (var i = 0; i < player.length; i++) {
        $(`#player${nr}`).append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\"></div> </div> <div class=\"yearblock\">${sortedList[i]}</div>`);
    }
    $(`#player${nr}`).append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\"></div> </div> `);
}

function showNewCard() {
    $(".cardContent").empty();
    $(".cardContent").append(`<div id="categoryHeader">${cardDeck[0].Name}</div><div id="questionArea">${cardDeck[0].Question}</div>`);
}

