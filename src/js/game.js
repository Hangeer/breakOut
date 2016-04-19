/*
*   16-04-18
*   需要解决的坑
*   写法要优雅 赋值什么的
*   不同屏幕啥的适配不同大小的画布
*   然后功能函数相应改变
* */

/*
*   16-04-19
*   把几个圆形画出来, 改进一下 Circle 对象
* */

$(window).on('scroll.elasticity',function (e){e.preventDefault();}).on('touchmove.elasticity',function(e){e.preventDefault();});
/* 禁掉 webview 的拖动 */

$(document).ready(evt => {
    let ev = evt || window.event;
    ev.preventDefault;
    /* 阻止默认事件 */

    let pub = {
        canvas: document.querySelector("#canvas"),
        context: document.querySelector("#canvas").getContext("2d"),
        timer: null,
        run: false,
        stopTimer () {
            window.clearInterval(this.timer);
        }
    };
    /* 伪全局对象 */

    if (window.innerHeight > 568) {
        document.querySelector("#canvas").height = window.innerHeight;
    }
    /*
    *   默认屏幕宽度 320 高度 568 （ip 5）
    *   如果屏幕高度大于 568 那么按照屏幕高度重新设置 canvas 大小
    * */

    class Stage {
        constructor () {
            this.context = pub.context;
            this.startX = 0;
            this.startY = 0;
            this.width = 320;
            this.height = document.querySelector("#canvas").height;
            this.upFlag = false;
            this.upPosLow = 250;

            /* 是否指定默认参数有待思考 */

        }

        refresh () {
            this.context.clearRect(this.startX, this.startY, this.width, this.height);
            /* 重绘整个舞台 */
        }

        up (ballTop) {
            this.upFlag = (ballTop < this.upPosLow);
            /* 判断小球位置,是否向上走 */
            /* 背景的移动也可以写在这里面 */

            if (this.upFlag) {
                this.context.translate(0, 3);
                this.upPosLow -= 3;
                this.startY -= 3;
            }
            /*
            *   如果达到向上条件整个屏幕向下拉 3px
            *   看背景需不需要也写成移动的
            * */

        }

        run () {

            /* 这个是游戏里面手写的 */

            pub.timer = window.setInterval(function () {
                stage.refresh();
                stage.up(ball.getPos()[1]);
                ball.fall();

                ball.collision(barrierOne.testPoint.down.y, barrierOne.testPoint.down.status);
                ball.collision(barrierOne.testPoint.up.y, barrierOne.testPoint.up.status);
                barrierOne.rotate();

                ball.collision(barrierTwo.testPoint.down.y, barrierTwo.testPoint.down.status);
                ball.collision(barrierTwo.testPoint.up.y, barrierTwo.testPoint.up.status);
                barrierTwo.rotate();

                ball.collision(barrierThree.testPoint.down.y, barrierThree.testPoint.down.status);
                ball.collision(barrierThree.testPoint.up.y, barrierThree.testPoint.up.status);
                barrierThree.rotate();



            }, 100/6);

            $(document).on('touchstart', function () {
                ball.jump();
            });

            /* 根据实际情况修改 */

        }

    }
    /*
    *   Stage
    *   整个游戏运行的舞台
    * */

    class Ball {
        constructor (context, width, height, top, left, img) {
            this.context = context;
            this.width = width;
            this.height = height;
            this.top = top;
            this.left = left;
            this.img = img;
            this.timer = null;
            this.exp = .1;
        }

        paint () {
            this.context.drawImage(this.img, this.left, this.top);
        }

        jump () {
            this.exp = -5;
        }

        fall () {
            this.top += this.exp;
            this.exp += .2;
            /* 模拟匀加速直线运动相同时间内 1 3 5... */
            this.paint();
            this.isEnd();
        }

        isEnd () {
            if (this.top > 600) {
                console.log("Fall down game over");
                /* 这里还有一个停止计时的代码 */
                pub.stopTimer();
            }
        }
        getPos () {
            return [this.left + this.width / 2, this.top + this.height / 2];
        }

        collision (posY, status) {
            let selfY = this.getPos()[1];
            if (Math.abs(posY - selfY) < 10 && status) {
                console.log("collision");
                console.log("game over");
                pub.stopTimer();
            }
        }
    }
    /*
    *   Ball
    *   原来的游戏是小球,改成小星星吧 whatever 名字先就叫这个
    * */

    class Circle {
        constructor (ctx, x, y, width, height, img, rotateDegree, zoneUp, zoneDown) {
            this.context = ctx;
            this.start = {
                x,
                y
            };
            this.width = width;
            this.height = height;
            this.img = img;
            this.rotateDeg = rotateDegree;
            this.initDegree = rotateDegree;
            this.testPoint = {
                up: {
                    y: this.start.y,
                    zone: zoneUp,
                    status: true
                },
                down: {
                    y: this.start.y + this.height,
                    zone: zoneDown,
                    status: true
                }
            }
        }

        paint () {
            this.context.save();
            this.context.translate(this.start.x + .5 * this.width, this.start.y + .5 * this.height);
            this.context.rotate(this.rotateDeg);
            this.context.drawImage(this.img, -.5 * this.width, -.5 * this.height);
            this.context.restore();

            //this.context.save()
            //            .translate(this.start.x + .5 * this.width, this.start.y + .5 * this.height)
            //            .rotate(this.rotateDeg)
            //            .drawImage(this.img, -.5 * this.width, -.5 * this.height)
            //            .restore();
        }

        rotate () {
            this.context.save();
            this.context.translate(this.start.x + .5 * this.width, this.start.y + .5 * this.height);
            this.context.rotate(this.rotateDeg);
            this.context.clearRect(-.5 * this.width, -.5 *this.height, this.width, this.height);
            this.context.restore();
            /* 这种是否可以写成链式,可以思考一下 */

            this.rotateDeg += .02;

            //console.log(this.rotateDeg);

            if(this.rotateDeg >= 2 * Math.PI + this.initDegree) {
                this.rotateDeg = this.initDegree;
            }

            let upCount = 0;
            let downCount = 0;

            this.testPoint.up.zone.map(item => upCount += (this.rotateDeg >= item[0] && this.rotateDeg <= item[1]));
            this.testPoint.down.zone.map(item => downCount += (this.rotateDeg >= item[0] && this.rotateDeg <= item[1]));

            this.testPoint.up.status = !(upCount > 0);
            this.testPoint.down.status = !(downCount > 0);

            //console.log("down: " + downCount + "up: " + upCount);

            /*
             *   圆形上下的碰撞检测
             *   04-19 改写, 变成传递数组
             * */

            this.paint();

            /* 差一个重绘 ball 的函数 */
            ball.paint();
        }
    }
    /*
    *   Circle
    *   旋转的圆形障碍物
    *   多个缺口的时候的状况需要写新的判断
    * */

    class Block {
        constructor (context, width, height, img, direction, left, top) {
            this.context = context;
            this.width = width;
            this.height = height;
            this.img = img;
            this.direction = direction;
            /* true -> 向右移动 */
            this.left = left;
            /* 方块左边距画布左边位置 */
            this.top = top;
            /* 方块顶端距画布顶端位置 */
            this.isClose = true;

            /* 等会用结构赋值重新写一下 */
            //[this.context, this.width, this.height, this.img, this.direction, this.left, this.top] = [...arguments];
        }

        paint () {
            this.context.drawImage(this.img, this.left, this.top);
        }

        move () {
            this.context.clearRect(this.left, this.top, this.width, this.height);

            this.isClose = (this.left > 140);
            /* 这里的判断是手写的, 需要改进 */

            if ((this.direction && this.left + this.width /2 >= 160) || (!this.direction && this.left - this.width / 2 <= 20)) {
                this.direction = !this.direction;
            }

            this.direction ? this.left += 1 : this.left -= 1;

            this.paint();
        }
    }
    /*
     *   Block
     *   左右小方块的构造函数
     * */

    let stage = new Stage();
    let ball = new Ball(pub.context, 20, 20, 400, 150, document.querySelector("#block"));
    let barrierOne = new Circle(pub.context, 60, 50, 200, 200, document.querySelector("#circle"), 0, [[3.5, 4.9]], [[.3, 1.8]]);
    let barrierTwo = new Circle(pub.context, 85, -250, 150, 150, document.querySelector("#four-exit-circle"), 0, [[0, .7], [1.5, 2.2], [3, 3.7], [4.5, 5.2]], [[0, .7], [1.5, 2.2], [3, 3.7], [4.5, 5.2]]);
    let barrierThree = new Circle(pub.context, 110, -500, 100, 100, document.querySelector("#two-exit-circle"), 0, [[0, 1.4], [3.2, 4.6]], [[0, 1.4], [3.2, 4.6]]);

    //let blockOne = new Block(pub.context, 20, 20, document.querySelector("#block"), true, 100, -450);

    stage.refresh();

    barrierOne.paint();
    barrierTwo.paint();
    barrierThree.paint();
    ball.paint();

    //blockOne.paint();

    $(document).on("touchstart", function () {
        if (pub.run === false) {
            stage.run();
            pub.run = true;
        }
    });
    /*
    *   感觉这样写不怎么优雅
    * */

});