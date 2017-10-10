﻿var testList = [2000, 1995, 1980, 1900, 1904]

function heightCalculation() {
    let height = (100 - (testList.length * 4)) / (testList.length + 1);
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

//$(".timelinecontainer").ready(function () {
//    let list = getSortList();
//    let height = heightCalculation();
//    for (var i = 0; i < list.length; i++) {
//        $(".timelinecontainer").append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\"></div> </div> <div class=\"yearblock\">${list[i]}</div>`);
//    }
//    $(".timelinecontainer").append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\"></div> </div> `);
//})

$(".timelinecontainer").ready(drawTimeline())

$("body").on("click", ".timelineblock", function () {
    let yearBefore = $(this).prev().text();
    let yearAfter = $(this).next().text();
    console.log(yearBefore);
    console.log(yearAfter);
    if (1850 >= yearBefore && 1850 <= yearAfter) {
        console.log('yes det var rätt!');
        showCorrectCard();
        addYearToList();
        drawTimeline();
    } else {
        console.log('nej det blev fel');
        showWrongCard();
    }
    showNextCard();
})

function showCorrectCard() {
    console.log('Nu visas det korrekta kortet (grönt)');
}

function showWrongCard() {
    console.log('Nu visas det felaktiga kortet (rött)');
}

function addYearToList() {
    console.log('Nu läggs det rätta kortet till i listan');
}

function drawTimeline() {
    $(".timelinecontainer").empty(); //tömmer vyn för timeline innan den målas om
    let list = getSortList();
    let height = heightCalculation();
    for (var i = 0; i < list.length; i++) {
        $(".timelinecontainer").append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\"></div> </div> <div class=\"yearblock\">${list[i]}</div>`);
    }
    $(".timelinecontainer").append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\"></div> </div> `);
}

function showNextCard() {
    console.log('nästa kort visas');
}