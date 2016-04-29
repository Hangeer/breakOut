window.onload = function () {
    function loadJS (path) {
        var element = document.createElement("script");
        element.src = path;
        document.body.appendChild(element);
    }
    function loadCSS (path) {
        var element = document.createElement("link");
        element.rel = "stylesheet";
        element.href = path;
        document.head.appendChild(element);
    }
//        loadJS("../js/zepto.js");
//        loadJS("../js/game.js");
//        if (jsCount === 2) {
//            setTimeout(function () {
//                console.log("js load");
//            }, 500);
//        }
    /*
     *   想首页单独搞个页面, 然后游戏那个页面搞一下异步加载（考虑到重玩一次刷新的状况）
     *   那么在游戏界面的时候就 先加载菊花界面, 然后后面的内容使用 promise 异步加载
     * */
    let _loaded = new Promise ((resolve, reject) => {
        loadJS("./zepto.js");
        console.log("zepto ok");
        resolve();
    });

    _loaded.then(() => {
        loadJS("./game.js");
        console.log("game.js loaded");
    }, () => {
        console.log("failed to load game.js");
    }).then(() => {
        setTimeout(function () {
            console.log(233);
        }, 500);
    }, () => {
        console.log("failed");
    });
};