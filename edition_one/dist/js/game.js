"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}();$(window).on("scroll.elasticity",function(t){t.preventDefault()}).on("touchmove.elasticity",function(t){t.preventDefault()}),$(document).ready(function(){var t={canvas:document.querySelector("#canvas"),context:document.querySelector("#canvas").getContext("2d"),timer:null,run:!1,isStart:!1,stopTimer:function(){window.clearInterval(this.timer)}};window.innerHeight>568&&(document.querySelector("#canvas").height=window.innerHeight);var e=function(){function e(){_classCallCheck(this,e),this.context=t.context,this.startX=0,this.startY=0,this.width=320,this.height=document.querySelector("#canvas").height,this.upFlag=!1,this.upPosLow=250}return _createClass(e,[{key:"refresh",value:function(){this.context.clearRect(this.startX,this.startY,this.width,this.height)}},{key:"up",value:function(t){this.upFlag=t<this.upPosLow,this.upFlag&&(this.context.translate(0,3),this.upPosLow-=3,this.startY-=3)}},{key:"run",value:function(){t.timer=window.setInterval(function(){h.refresh(),h.up(c.getPos()[1]),c.collision(a.testPoint.down.y,a.testPoint.down.status),c.collision(a.testPoint.up.y,a.testPoint.up.status),a.rotate(),d.eat(c.top+c.height/2),c.collision(r.testPoint.down.y,r.testPoint.down.status),c.collision(r.testPoint.up.y,r.testPoint.up.status),r.rotate(),p.eat(c.top+c.height/2),c.collision(u.testPoint.down.y,u.testPoint.down.status),c.collision(u.testPoint.up.y,u.testPoint.up.status),u.rotate(),c.collision(l.top,l.isClose),l.move(),f.move(),c.collision(g.top,g.isClose),g.move(),c.fall()},100/6),$(document).on("touchstart",function(){c.jump()})}}]),e}(),i=function(){function e(t,i,s,o,n,h){_classCallCheck(this,e),this.context=t,this.width=i,this.height=s,this.top=o,this.left=n,this.img=h,this.timer=null,this.exp=.1}return _createClass(e,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"jump",value:function(){this.exp=-5}},{key:"fall",value:function(){this.top+=this.exp,this.exp+=.2,this.paint(),this.isEnd()}},{key:"isEnd",value:function(){this.top>600&&(console.log("Fall down game over"),t.stopTimer())}},{key:"getPos",value:function(){return[this.left+this.width/2,this.top+this.height/2]}},{key:"collision",value:function(e,i){var s=this.getPos()[1];Math.abs(e-s)<10&&i&&(console.log("collision"),console.log("game over"),t.stopTimer(),$("#continue").css({display:"none"}),$("#cover").addClass("cover-show"))}}]),e}(),s=function(){function t(e,i,s,o,n,h,c,a,r){_classCallCheck(this,t),this.context=e,this.start={x:i,y:s},this.width=o,this.height=n,this.img=h,this.rotateDeg=c,this.initDegree=c,this.testPoint={up:{y:this.start.y,zone:a,status:!0},down:{y:this.start.y+this.height,zone:r,status:!0}}}return _createClass(t,[{key:"paint",value:function(){this.context.save(),this.context.translate(this.start.x+.5*this.width,this.start.y+.5*this.height),this.context.rotate(this.rotateDeg),this.context.drawImage(this.img,-.5*this.width,-.5*this.height),this.context.restore()}},{key:"rotate",value:function(){var t=this;this.context.save(),this.context.translate(this.start.x+.5*this.width,this.start.y+.5*this.height),this.context.rotate(this.rotateDeg),this.context.clearRect(-.5*this.width,-.5*this.height,this.width,this.height),this.context.restore(),this.rotateDeg+=.02,this.rotateDeg>=2*Math.PI+this.initDegree&&(this.rotateDeg=this.initDegree);var e=0,i=0;this.testPoint.up.zone.map(function(i){return e+=t.rotateDeg>=i[0]&&t.rotateDeg<=i[1]}),this.testPoint.down.zone.map(function(e){return i+=t.rotateDeg>=e[0]&&t.rotateDeg<=e[1]}),this.testPoint.up.status=!(e>0),this.testPoint.down.status=!(i>0),this.paint()}}]),t}(),o=function(){function t(e,i,s,o,n,h,c,a,r,u){_classCallCheck(this,t),this.context=e,this.left=i,this.top=s,this.width=o,this.height=n,this.img=h,this.direction=c,this.maxLeft=a,this.maxRight=r,this.zone=u,this.isClose=!0}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"move",value:function(){var t=this.left+this.width/2,e=0;this.context.clearRect(this.left,this.top,this.width,this.height),this.zone.map(function(i){return e+=t>=i[0]&&t<=i[1]}),this.isClose=e>0,(this.direction&&t>=this.maxRight||!this.direction&&t<=this.maxLeft)&&(this.direction=!this.direction),this.direction?this.left+=1:this.left-=1,this.paint()}}]),t}(),n=function(){function t(e,i,s,o,n,h){_classCallCheck(this,t),this.context=e,this.left=i,this.top=s,this.width=o,this.height=n,this.img=h,this.isAte=!1}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"eat",value:function(t){var e=this.top+this.height/2;console.log(e),Math.abs(e-t)<5&&(this.isAte=!0),this.isAte||this.paint()}}]),t}(),h=new e,c=new i(t.context,20,20,400,150,document.querySelector("#block")),a=new s(t.context,60,50,200,200,document.querySelector("#circle"),0,[[3.5,4.9]],[[.3,1.8]]),r=new s(t.context,85,-250,150,150,document.querySelector("#four-exit-circle"),0,[[0,.7],[1.5,2.2],[3,3.7],[4.5,5.2]],[[0,.7],[1.5,2.2],[3,3.7],[4.5,5.2]]),u=new s(t.context,110,-500,100,100,document.querySelector("#two-exit-circle"),0,[[0,1.4],[3.2,4.6]],[[0,1.4],[3.2,4.6]]),l=new o(t.context,50,-650,25,5,document.querySelector("#single-block"),!0,50,147.5,[[137.5,147.5]]),f=new o(t.context,245,-650,25,5,document.querySelector("#single-block"),!1,172.5,270,[[172.5,182.5]]),g=new o(t.context,50,-800,150,10,document.querySelector("#two-blocks"),!0,105.5,214.5,[[105.5,134.5],[184.5,214.5]]),d=new n(t.context,150,140,20,20,document.querySelector("#block")),p=new n(t.context,150,-190,20,20,document.querySelector("#block"));h.refresh(),window.setTimeout(function(){a.paint(),c.paint(),d.paint()},200),$("#container").on("touchstart",function(){t.run===!1&&(h.run(),t.run=!0,t.isStart=!0)}),$("#pause").on("touchstart",function(){t.stopTimer(),$("#cover").toggleClass("cover-show")}),$("#continue").on("touchstart",function(){$("#cover").toggleClass("cover-show"),t.isStart&&setTimeout(function(){h.run()},500)}),$("#restart").on("touchstart",function(){window.location.reload()})});