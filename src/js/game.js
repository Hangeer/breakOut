/*
*   16-04-23
*   需要解决的坑
*
*   等正式代码出来了在考虑 优雅代码吧 = =
*   然后功能函数相应改变
*
*   食物也 ok 了
*   然后就是还有些优化啥的问题
*   以及显示,计时什么的,尝试使用异步函数解决
*
*   圆环试一下动态生成, 页面上只保留游戏时运行需要的部分
*   使用 队列 试一下, 不要渲染全屏
*
*   如果每一关失败之后显示内容, 把文字写好, 然后使用 CSS3 写动画来做弹窗什么的
* */

$(window).on('scroll.elasticity',function (e){e.preventDefault();}).on('touchmove.elasticity',function(e){e.preventDefault();});
/* 禁掉 webview 的拖动 */

$(document).ready(() => {

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

                ball.collision(barrierOne.testPoint.down.y, barrierOne.testPoint.down.status);
                ball.collision(barrierOne.testPoint.up.y, barrierOne.testPoint.up.status);
                barrierOne.rotate();

                foodOne.eat(ball.top + ball.height / 2 );
                //console.log(ball.top + ball.height / 2);
                /*
                *   食物写的顺序要注意, 在圆圈转动之后写
                * */

                ball.collision(barrierTwo.testPoint.down.y, barrierTwo.testPoint.down.status);
                ball.collision(barrierTwo.testPoint.up.y, barrierTwo.testPoint.up.status);
                barrierTwo.rotate();

                foodTwo.eat(ball.top + ball.height / 2 );

                ball.collision(barrierThree.testPoint.down.y, barrierThree.testPoint.down.status);
                ball.collision(barrierThree.testPoint.up.y, barrierThree.testPoint.up.status);
                barrierThree.rotate();

                ball.collision(barrierFour_one.top, barrierFour_one.isClose);
                /* 两个一组的就判断一个吧 */
                barrierFour_one.move();
                barrierFour_two.move();

                ball.collision(barrierFive.top, barrierFive.isClose);
                barrierFive.move();

                ball.fall();
                /*
                *   通关的过程可以尝试使用异步函数重新写一下
                *   每次通过一个障碍/吃掉一个东西,就更新自己的状态
                * */

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

            /* 等会用结构赋值重新写一下 */
            //[this.context, this.width, this.height, this.img, this.direction, this.left, this.top] = [...arguments];
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

            this.direction ? this.left += 1 : this.left -= 1;

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

    let stage = new Stage();
    let ball = new Ball(pub.context, 20, 20, 400, 150, document.querySelector("#block"));
    let barrierOne = new Circle(pub.context, 60, 50, 200, 200, document.querySelector("#circle"), 0, [[3.5, 4.9]], [[.3, 1.8]]);
    let barrierTwo = new Circle(pub.context, 85, -250, 150, 150, document.querySelector("#four-exit-circle"), 0, [[0, .7], [1.5, 2.2], [3, 3.7], [4.5, 5.2]], [[0, .7], [1.5, 2.2], [3, 3.7], [4.5, 5.2]]);
    let barrierThree = new Circle(pub.context, 110, -500, 100, 100, document.querySelector("#two-exit-circle"), 0, [[0, 1.4], [3.2, 4.6]], [[0, 1.4], [3.2, 4.6]]);
    let barrierFour_one = new Block(pub.context, 50, -650, 25, 5, document.querySelector("#single-block"), true, 50, 147.5, [[137.5, 147.5]]);
    let barrierFour_two = new Block(pub.context, 245, -650, 25, 5, document.querySelector("#single-block"), false, 172.5, 270, [[172.5, 182.5]]);
    let barrierFive = new Block(pub.context, 50, -800, 150, 10, document.querySelector("#two-blocks"), true, 105.5, 214.5, [[105.5, 134.5], [184.5, 214.5]]);

    let foodOne = new Food(pub.context, 150, 140, 20, 20, document.querySelector("#block"));
    let foodTwo = new Food(pub.context, 150, -190, 20, 20, document.querySelector("#block"));

    stage.refresh();

    window.setTimeout(function () {
        ball.paint();
        barrierOne.paint();
        foodOne.paint();
    }, 50);
    /* 在 refresh 之后延时加载, 避免被擦掉, 只用画第一关, 其他的画了也看不到 */

    $("#container").on("touchstart", function () {
        if (pub.run === false) {
            stage.run();
            pub.run = true;
        }
    });
    /*
    *   感觉这样写不怎么优雅
    * */

    $("#pause").on("click", function () {
        pub.stopTimer();
    });
    $("#continue").on("click", function () {
        stage.run();
    });
    /*
    *   手动加的按钮,测试是否能够暂停/继续游戏
    * */

});