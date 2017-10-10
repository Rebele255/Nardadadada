var testList = [2000, 1995, 1980, 1900, 1904]

function heightCalculation() {
    let height = (100 - (testList.length * 4)) / (testList.length+1);
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

$(".timelinecontainer").ready(function () {
    let list = getSortList();
    let height = heightCalculation();
    for (var i = 0; i < list.length; i++) {
        $(".timelinecontainer").append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\"></div> </div> <div class=\"yearblock\">${list[i]}</div>`);
    }
    $(".timelinecontainer").append(`<div class=\"timelineblock\" style=\"height: ${height}%\"> <div class=\"timelineline\"></div> </div> `);

})
