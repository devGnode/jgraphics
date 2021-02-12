///<amd-module name='/lib/components/GScroll.js'/>
import {GObject} from "../GObject";
import {Pane} from "../Pane";
import {BoxLayout} from "../layout/BoxLayout";
import {BorderLayout} from "../layout/BorderLayout";

export class GScroll  extends GObject{

    public static readonly SHOW_AXIS_X:number = 0x01;
    public static readonly SHOW_AXIS_Y:number = 0x02;

    public static readonly SLOW_SCROLL:number = 10;
    public static readonly SPEED_SCROLL:number= 20;

    private readonly axis:number    = 0x01;
    private mounted:boolean         = false;
    private readonly element:GObject;
    private gScroll:GObject;
    private wScroll:Pane;

    public ScrollHeight:number     = 0;

    private ScrollOffsetY:number = 50;
    private ScrollOffsetX:number = 0;

        constructor( gObject: GObject, axis:number = 0x01 ) {
        super(gObject.innerWidth,gObject.innerHeight);
        // allow to keep a good sizeof the object, so i prefer to lock it
        gObject.setMinWidth(gObject.width).setMinHeight(gObject.height);
        this.element = gObject;
        this.axis = axis;
    }

    set scrollHeight( value:number ){  console.log("this.ScrollHeight = ",this.ScrollHeight,value ) ; if(value >= 0 )this.ScrollHeight = value; }

    get scrollHeight( ){ return this.ScrollHeight; }

    get scrollOffsetY():number{ return this.ScrollHeight; }

    // mock
   // set ScrollHeight( v:number ){ this.ScrollHeight = v; }

    render(): GObject {

        if(this.mounted){
            console.log(' +++++ this.gScroll = ', this.wScroll )
            let sz:number = this.ScrollHeight * (this.wScroll.width);
          //  if(sz<0)return this;
            console.log("SCROLL HEIGHT ",this.ScrollHeight, "/", this.ScrollHeight * (this.wScroll.width))
            this.element.getFrameBuffer().sliceStart = this.ScrollHeight * (this.wScroll.width);
            this.gScroll.setPadding(null,this.ScrollHeight);
            super.render();
            return this;
        }

        console.log("xskdmqskdmkqsmdmsqmdkmqskdmksmdkqmsdk -----/-----", this, this.innerHeight, this.parentHandle.parentHandle.innerHeight)
       this.resize(this.parentHandle.parentHandle.innerWidth-0,this.parentHandle.parentHandle.innerHeight-0)
            //.setBorder(1,1,1,1, 0xafb9c2)
            .setBackground(0);
        console.log("xskdmqskdmkqsmdmsqmdkmqskdmksmdkqmsdk -----/-----", this, this.parentHandle)
       let pane = new Pane();
        this.wScroll = pane;
        pane.resize(this.innerWidth,this.innerHeight);
        pane.setLayout(new BorderLayout(0,0));
        //pane.resize(width,height||25);

        let scrollBarX:Pane = new Pane(), scrollBarY:Pane = new Pane(),
            ax:number = this.axis&0x01, ay:number = (this.axis&0x02) >> 1;

        scrollBarX.resize(10, this.innerHeight  ).setPreferenceWidth(10).setBackground(0xf0f0f0);
        scrollBarY.resize(this.innerWidth, 10  ).setPreferenceHeight(10).setBorder(0,1,0,0,0xc6c6c6).setBackground(0xf0f0f0);

        scrollBarX.setLayout(new BoxLayout(0,0, BoxLayout.RIGHT));
        scrollBarY.setLayout(new BoxLayout(0,0, BoxLayout.LEFT));

        let test:GObject = new GObject(10, Math.floor( this.innerHeight / Math.floor( this.element.height/ this.innerHeight ) ) ).setMinWidth(10).setBackground(0x8b3f9d);
        console.log("INNER HEIGHT ", this.innerHeight)
        this.gScroll = new GObject(10, this.innerHeight  ).setY(0).add(test);
        scrollBarX.add( this.gScroll );
        scrollBarY.add(new GObject(Math.floor( this.innerWidth / Math.floor( this.element.width/ this.innerWidth ) ), 10 ).setMargin(this.ScrollOffsetX).setBackground(0x8b3f9d) );

        if(ay===1)pane.add(scrollBarY,BorderLayout.SOUTH);
        if(ax===1)pane.add(scrollBarX,BorderLayout.EAST);
        pane.add(this.element,BorderLayout.CENTER);
        this.element.getFrameBuffer().sliceStart = this.ScrollHeight * (450);
        this.add(pane);
        this.mounted = true;
        return super.render();
    }
}

