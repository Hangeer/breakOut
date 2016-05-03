$(window).on('scroll.elasticity', function (e) {
    e.preventDefault();
}).on('touchmove.elasticity', function(e) {
    e.preventDefault();
});
/* 禁掉 webview 的拖动 */

$(document).ready(() => {
    let $cover = $("#cover");
    let $banner = $("#banner");

    setTimeout(function () {
        $cover.addClass("cover-hide");
    }, 2000);
    setTimeout(function () {
        $banner.addClass("banner-bounce");
        $(".stars_3").addClass("rotate-linear");
        $("#start").addClass("start-after");
        $("#intro").addClass("intro-after");
    }, 3000);
    /* 先写效果 然后再看 */

    $("#start").on("touchstart", () => {
        window.location.href = "./game.html";
    });
    /* 这里也可以设置 touchmove 的 flag 什么的 */


});
