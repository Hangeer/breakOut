$(document).ready(() => {
    let $cover = $("#cover");
    let $banner = $("#banner");

    setTimeout(function () {
        $cover.addClass("cover-hide");
    }, 1000);
    setTimeout(function () {
        $banner.addClass("banner-bounce");
    }, 2000);
    /* 先写效果 然后再看 */


    $(window).on('scroll.elasticity', function (e) {
        e.preventDefault();
    }).on('touchmove.elasticity', function(e) {
        e.preventDefault();
    });
    /* 禁掉 webview 的拖动 */

});
