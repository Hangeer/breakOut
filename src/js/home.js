(function () {
    let start = document.querySelector("#start");
    start.addEventListener('touchstart', function () {
        start.innerHTML = "不要慌,劳资在跳转";
        setTimeout(function () {
            window.location.href = "../html/game.html";
        }, 1000);
    });
})();