/*
*   16-05-03
*
*   是否手机设备
*   计时的东西
*   首页适配, 动画效果
*   canvas 性能问题, 把食物写成队列, 到指定位置的时候再渲染
*
*   星星掉出屏幕外的判定
*   星星相对屏幕的位置, 根据手机高度判定
*
* */


$(window).on('scroll.elasticity',function (e){e.preventDefault();}).on('touchmove.elasticity',function(e){e.preventDefault();});
/* 禁掉 webview 的拖动 */

$(document).ready(() => {

    const pub = {
        canvas: document.querySelector("#canvas"),
        context: document.querySelector("#canvas").getContext("2d"),
        timer: null,
        run: false,
        isStart: false,
        playgroundHeight: window.innerHeight,
        stopTimer () {
            window.clearInterval(this.timer);
        }
    };
    /*
     *   伪全局对象
     *   timer 刷新幕布的计时器
     *   run 是否在跑
     *   isStart 是否已经开始了（防止开始之前暂停）
     *   playgroundHeight 可见区域的高度（用来判断是否掉出屏幕外
     */

    if (window.innerHeight > 568) {
        document.querySelector("#canvas").height = window.innerHeight;
    }
    /*
     *   默认屏幕宽度 320 高度 568 （ip 5）
     *   如果屏幕高度大于 568 那么按照屏幕高度重新设置 canvas 大小
     *
     *   这里也可以加上对于 小球的位置的判断
     * */

    class Stage {
        constructor () {
            this.context = pub.context;
            this.startX = 0;
            this.startY = 0;
            this.width = 320;
            this.height = document.querySelector("#canvas").height;
            this.upFlag = false;
            this.upPosLow = window.innerHeight/2;

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

                pub.playgroundHeight -= 3;
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
                stage.up(star.getPos()[1]);

                //ball.collision(barrierOne.testPoint.down.y, barrierOne.testPoint.down.status);
                //ball.collision(barrierOne.testPoint.up.y, barrierOne.testPoint.up.status);
                //barrierOne.rotate();
                //
                //foodOne.eat(ball.top + ball.height / 2 );
                ////console.log(ball.top + ball.height / 2);
                ///*
                // *   食物写的顺序要注意, 在圆圈转动之后写
                // * */
                //
                //ball.collision(barrierTwo.testPoint.down.y, barrierTwo.testPoint.down.status);
                //ball.collision(barrierTwo.testPoint.up.y, barrierTwo.testPoint.up.status);
                //barrierTwo.rotate();
                //
                //foodTwo.eat(ball.top + ball.height / 2 );
                //
                //ball.collision(barrierThree.testPoint.down.y, barrierThree.testPoint.down.status);
                //ball.collision(barrierThree.testPoint.up.y, barrierThree.testPoint.up.status);
                //barrierThree.rotate();
                //
                //ball.collision(barrierFour_one.top, barrierFour_one.isClose);
                ///* 两个一组的就判断一个吧 */
                //barrierFour_one.move();
                //barrierFour_two.move();
                //
                //ball.collision(barrierFive.top, barrierFive.isClose);
                //barrierFive.move();
                //
                //ball.fall();
                rope_one.move();
                rope_two.move();
                star.collision(rope_one.top, rope_one.isClose);

                star.fall();
                /*
                 *   通关的过程可以尝试使用异步函数重新写一下
                 *   每次通过一个障碍/吃掉一个东西,就更新自己的状态
                 * */

            }, 100/6);

            $(document).on('touchstart', function () {
                star.jump();
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
            if (this.top > pub.playgroundHeight) {
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

                $("#continue").css({"display": "none"});
                $("#cover").addClass("cover-show");
                /* 游戏完了之后,重新开始的那个啥 */

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

            //ball.paint();
            /*
             *   在 up 函数中把 ball.paint 写在最后, 解决这个需要重绘的问题
             * */
        }
    }
    /*
     *   Circle
     *   旋转的圆形障碍物
     *   多个缺口的时候的状况需要写新的判断
     * */

    class Block {
        constructor (context, left, top, width, height, img, direction, maxLeft, maxRight, zone) {
            this.context = context;
            this.left = left;
            /* 方块左边距画布左边位置 */
            this.top = top;
            /* 方块顶端距画布顶端位置 */
            this.width = width;
            this.height = height;
            this.img = img;
            this.direction = direction;
            /* true -> 向右移动 */
            this.maxLeft = maxLeft;
            this.maxRight = maxRight;
            this.zone = zone;
            /* 空隙区域 数组 */

            this.isClose = true;
            /* isClose 能否碰撞 */

        }

        paint () {
            this.context.drawImage(this.img, this.left, this.top);

            //ball.paint();
            /*
             *   重绘小球问题已经解决
             * */
        }

        move () {
            let center = this.left + this.width / 2;
            /* 图形的中心点 */
            let count = 0;
            /* 这是一个标记, 用来判断碰撞 */

            this.context.clearRect(this.left, this.top, this.width, this.height);


            this.zone.map(item => count +=  (center >= item[0] && center <= item[1]));
            this.isClose = (count > 0);
            /* 判断是否能够碰撞 */

            if ((this.direction && center >= this.maxRight) || (!this.direction && center <= this.maxLeft)) {
                this.direction = !this.direction;
            }

            this.direction ? this.left += 2 : this.left -= 2;

            //console.log(this.isClose);

            this.paint();
        }
    }
    /*
     *   Block
     *   左右小方块的构造函数
     * */

    class Food {
        constructor (context, left, top, width, height, img) {
            this.context = context;
            this.left = left;
            this.top = top;
            this.width = width;
            this.height = height;
            this.img = img;
            this.isAte = false;
        }

        paint () {
            this.context.drawImage(this.img, this.left, this.top);
        }

        eat (ballY) {
            var centerY = this.top + this.height / 2;
            console.log(centerY);

            if (Math.abs(centerY - ballY) < 5) {
                this.isAte = true;
            }

            if (!this.isAte) {
                this.paint();
            }
        }

    }
    /*
     *   Food
     *   食物的构造函数
     * */

    const imgStar = document.querySelector("#img-star");
    const imgRope = document.querySelector("#img-rope");

    const stage = new Stage();
    const star = new Ball(pub.context, 30, 30, window.innerHeight - 150, 145, imgStar);
    const rope_one = new Block(pub.context, 0, window.innerHeight - 300, 80, 13, imgRope, true, 40, 120, [[105, 120]]);
    const rope_two = new Block(pub.context, 240, window.innerHeight - 300, 80, 13, imgRope, true, 200, 280, [[200, 215]]);

    stage.refresh();

    window.setTimeout(function () {
        rope_one.paint();
        rope_two.paint();
        star.paint();
    }, 200);
    /* 在 refresh 之后延时加载, 避免被擦掉, 只用画第一关, 其他的画了也看不到 */

    $("#container").on("touchstart", function () {
        if (pub.run === false) {
            stage.run();
            pub.run = true;
            pub.isStart = true;
        }
    });
    /*
     *   感觉这样写不怎么优雅
     *   用异步, 解决刷新的时候食物和星星不出来的问题
     * */


});