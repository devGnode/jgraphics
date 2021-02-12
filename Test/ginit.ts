import {FrameBuffer, GraphicalUserInterface} from "../lib/glib/glib";
import {GWindow} from "../lib/Gwindow";
import {GProcessManager} from "../lib/GProcessManager";
import {BorderLayoutTest} from "./BorderLayoutTest";
import {FlowLayoutTest} from "./FlowLayoutTest";
import {BoxLayoutTest} from "./BoxLayoutTest";
import {LayoutTest} from "./LayoutTest";
import {GMouse} from "../lib/GOS/GMouse";
import {LayoutScroll} from "./LayoutScroll";

let m12 = new GraphicalUserInterface({
    monitor: document.getElementById("media12"),
    width:1024,
    height:768
});
let frameB12 = FrameBuffer.builder(null,{x:800,y:600}).resetScreen(0x0000ff);

let w = FrameBuffer.builder();
w.resize(350, 120)
w.resetScreen(0x010101);
w.templateDraw().rect(0, 1, 350, 150, 0xf0f0f0);
let wx:GWindow = new GWindow(),fgg:GWindow= new GWindow();

fgg.setDimension(450,150);
wx.setDimension(450,150);

function ww(a?,b?,e?,f?) {


   /* h.forEach(value=>{
        frameB12.append(15, 20,value.render().getFrameBuffer(),0)
    })*/
    // @ts-ignore
  /*  window.gg= wx;
        m12.refresh(
        frameB12.append(50||10, 5||10,fgg.render().getFrameBuffer(),0)
            .append(a-50||10, b-5||10,wx.render().getFrameBuffer(),0)
            .append(50 || 10, 5 || 10, w, 0).append(e,f+10,fmouse,0)
    );*/

}
//ww();
//BorderLayoutTest.main(0,["/Test/BorderLayoutTest.js"]);
//FlowLayoutTest.main(0,["/Test/FlowLayoutTest.js"]);
//BoxLayoutTest.main(0,["/Test/BoxLayoutTest.js"]);
//LayoutTest.main(0,["/Test/LayoutTest.js"]);
LayoutScroll.main(0,["/Test/LayoutScroll.js"]);
let testIO = {
    mousedown: false,
    mouseup:false,
    e:null
};
GProcessManager.getInstance().setMock(m12);
document.getElementById("media12").onmousemove = function( e ) {
    GMouse.getInstance().setX(e.offsetX).setY(e.offsetY);
   /* frameB12 = FrameBuffer.builder(null,{x:800,y:600}) //.resetScreen(0x0000ff);
    frameB12.templateDraw()/*.grid(0xf0f0f0,50,true,true)
    ww(e.offsetX,e.offsetY,e.offsetX,e.offsetY);*/
    console.log("mousemouve")
    if(testIO.mousedown) GProcessManager.getInstance().displacement(e, testIO.e);
    GProcessManager.getInstance().render(e);
};
document.getElementById("media12").onclick = function( e ) {

    /* frameB12 = FrameBuffer.builder(null,{x:800,y:600}) //.resetScreen(0x0000ff);
     frameB12.templateDraw()/*.grid(0xf0f0f0,50,true,true)
     ww(e.offsetX,e.offsetY,e.offsetX,e.offsetY);*/
    console.log("ONCLICK --- ", e.offsetX, e.offsetY )
    //GProcessManager.getInstance().clickManaging(e);
    //GProcessManager.getInstance().setMock(m12).render(e);
};

document.getElementById("media12").onmousedown = function( e: MouseEvent ) {
    testIO.mousedown = true;
    testIO.e = Math.abs(e.offsetX - GProcessManager.getInstance().getCurrentTarget().getPosition().x );
    console.log("ONKEYDOWN --- ", e.offsetX, e.offsetY )
    GProcessManager.getInstance().clickManaging(e);
};

document.getElementById("media12").onmouseup = function( e: MouseEvent ) {
    testIO.mousedown = false;
    console.log("mouseUp --- ", e.offsetX, e.offsetY )
};

document.getElementById("media12").onwheel = function(e: WheelEvent  ) {
       if( e.deltaY<0 ){

       }
       // @ts-ignore
    window.grg.scroll(e.deltaY<0?-10:10);
    GProcessManager.getInstance().render(null);
};
GProcessManager.getInstance().setMock(m12).render({offsetX:200,offsetY:100});
(<any>window).grg = GProcessManager.getInstance().getCurrentTarget();

//setInterval(()=> GProcessManager.getInstance().setMock(m12).render(null),0)