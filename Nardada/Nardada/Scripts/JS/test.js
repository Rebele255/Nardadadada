var cardDeck;
var winlimit = 3; //skall senare regleras av spelarna i settings vid början av spelet
var testList = [2000, 1995, 1980, 1900, 1904]
var player1 = [];
var player2 = [];
var players = [player1, player2];
var currentPlayer = 0;

function changePlayer() {
    console.log(currentPlayer)
    currentPlayer = (currentPlayer + 1) % players.length;
    console.log(currentPlayer)
    $('.timelinecontainer').addClass('disablePlayer');
    $(`#player${currentPlayer}`).removeClass('disablePlayer');
}

$(document).ready(function () {
    player1.push(Math.floor(Math.random() * (2000 - 1900 + 1)) + 1900);
    player2.push(Math.floor(Math.random() * (2000 - 1900 + 1)) + 1900);

    $('.timelinecontainer').addClass('disablePlayer');
    $(`#player${currentPlayer}`).removeClass('disablePlayer');

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
            cardDeck = _.shuffle(cardDeck);
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
    if (cardDeck[0].Year >= yearBefore && (cardDeck[0].Year <= yearAfter || yearAfter == "")) {
        console.log('yes det var rätt!');
        showCorrectCard();
        addYearToList(cardDeck[0].Year);
        drawTimeline(players[currentPlayer], currentPlayer);
    } else {
        console.log('nej det blev fel');
        showWrongCard();
    }
    //getCardFromDB()
    cardDeck.shift();
    showNewCard();
    changePlayer();
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

function addYearToList(year) {
    console.log('Nu läggs det rätta kortet till i listan');
    players[currentPlayer].push(year);
    console.log(players[currentPlayer]);

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
    let color = getCardColor();
    $(".cardContent").css("background-color", color);
    $(".card").css("border-color", color)

    $(".cardContent").append(`<div id="categoryHeader">${cardDeck[0].Name}</div><div id="questionArea">${cardDeck[0].Question}</div>`);
}

function getCardColor() {
    switch (cardDeck[0].Name) {
        case "Underhållning":
            return "pink";

        case "Kända personer och händelser":
            return "darkorange";

        case "Prylar, nyheter och uppfinningar":
            return "lightseagreen";

        default:
            return "";
    }
}

function checkIfWon(player) { //behövs paraneter?? eller kolla från currentPlayer
    if (player.length >= winLimit) {
        console.log('du har vunnit spelet!');
        return true;
    } else {
        console.log('spelaren har ännu inte vunnit, fortsätt med nytt kort');
        return false;
    }
}
