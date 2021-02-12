///<amd-module name='/lib/layout/BorderLayout.js'/>
import {COMPONENT_ALIGN, LayoutComponent} from "./LayoutComponent";
import {GObject,Map} from "../GObject";

export class BorderLayout extends LayoutComponent{

    public static readonly NORTH:COMPONENT_ALIGN = 0x0A;
    public static readonly WEST:COMPONENT_ALIGN  = 0x0C;
    public static readonly EAST:COMPONENT_ALIGN  = 0x0E;
    public static readonly SOUTH:COMPONENT_ALIGN = 0x10;

    private north:GObject  = new GObject();
    private west:GObject   = new GObject();
    private center:GObject = new GObject();
    private east:GObject   = new GObject();
    private south:GObject  = new GObject();

    constructor(hgap:number = 0, vgap:number = 0) {
        super(hgap,vgap);
    }

    private getHeightState( ):Map<string,boolean>{
        return {
            north: this.north.computedHeight>1,
            west:this.west.computedHeight>1 ,
            center: this.east.computedHeight>1|| this.center.computedHeight>1||this.west.computedHeight>1,
            east: this.east.computedHeight>1,
            south: this.south.computedHeight>1
        };
    }

    add(parent:GObject,child:GObject, align:COMPONENT_ALIGN = BorderLayout.CENTER){
        super.add(parent,child);
        let rY:number = parent.height, rX: number = parent.width, sY:number=0,sX:number=0,
            area:any = this.getHeightState();
        let wrap = new GObject(child.computedWidth,child.computedHeight)
            .setBackground(0)
            .setPadding(this.getHgap(),this.getVgap(),this.getHgap(),this.getVgap())
            .append(child)
            .setParent(parent)

        if(align===BorderLayout.NORTH) {

            this.north = wrap;
            if(area.south&&!area.center) {
                rY = Math.floor(parent.height /2 );
                this.south.resize(null, rY).setY(rY);
            }
            // WEST ||CENTER || EAST
            else if( area.center ) {
                rY = child.prefsHeight||Math.floor(parent.height/4);
                wrap.setMaxHeight(60);
                if( area.south ) this.south.setY( rY + Math.floor(parent.height/2));
                if(area.west) this.west.resize(null,parent.height-rY-this.south.computedHeight).setY(rY);
                if(area.center) this.center.resize(null,parent.height-rY-this.south.computedHeight).setY(rY);
                if(area.east) this.east.resize(null,parent.height-rY-this.south.computedHeight).setY(rY);
            }
            this.north
                .setMinHeight(10)
                .setX(sX).setY(sY)
                .resize(parent.width, rY)
                .setPreferenceHeight(child.prefsHeight)
                .setPreferenceWidth(parent.width)
               // .setBackgroundGradient(0xffffff,0x87ceeb );
        }
        else if(align===BorderLayout.CENTER||align===BorderLayout.WEST||align===BorderLayout.EAST) {
            // init area
            if(align===BorderLayout.CENTER)this.center=wrap;
            if(align===BorderLayout.WEST)this.west=wrap;
            if(align===BorderLayout.EAST)this.east=wrap;

            if(area.north) {
                this.north.resize(null, this.north.prefsHeight||Math.floor(parent.height/4)).setMaxHeight(60);
                sY = this.north.computedHeight;
                rY = Math.floor(parent.height - sY );
            }
            if( area.south ){
                this.south.resize(null, this.south.prefsHeight||Math.floor(parent.height/4)).setMaxHeight(60);
                this.south.setY( parent.height - this.south.computedHeight );
                rY = Math.floor( rY - this.south.computedHeight );
            }
            // resize if exists
            if( area.west ){
                sX= this.west.prefsWidth||Math.floor( parent.width / 4 );
                this.west.resize( this.west.prefsWidth||Math.floor( parent.width / 4 ) ,null).packs();
            }
            if( area.east ){
                this.east.resize( this.east.prefsWidth||Math.floor( parent.width / 4 ) ,null).packs();
            }
            if( area.center ){
                this.center.resize( parent.width - this.west.computedWidth - this.east.computedWidth, null);
                console.log(area.north, area.south, area.west,area.center,area.east   ,"AREA CENTER - ", this.center, this.center.x, this.center);
            }
            // Compute Size
            if(align===BorderLayout.WEST){
                rX = parent.width - this.center.computedWidth - this.east.computedWidth;
            }
            if(align===BorderLayout.CENTER){
                sX = this.west.computedWidth;
                rX = parent.width - this.west.computedWidth - this.east.computedWidth;
                console.log( "SETCENTER SX = ", sX, "RX = ", rX)
            }
            if(align===BorderLayout.EAST){
                sX = this.west.computedWidth + this.center.computedWidth;
                rX =  parent.width - this.west.computedWidth - this.center.computedWidth;
            }
            // resize Height
            // WEST = CENTER = EAST
            if(area.west&&this.west.height!==rY)this.west.resize( null, rY ).packs();
            if(area.east&&this.east.height!==rY)this.east.resize( null, rY ).packs();
            if(area.center&&this.center.height!==rY)this.center.resize( null, rY ).packs();
            // EAST : replacement if first set was been EAST element, and after set Center
            if(area.east&&align===BorderLayout.CENTER) this.east.setX(rX);

            console.log("ORIENT MIDDLE ", rY)

            wrap.setX(sX).setY(sY)
                .resize(rX, rY)
                .setPreferenceHeight(child.prefsHeight)
                .setPreferenceWidth(child.prefsWidth)
                .packs();
        }
        else if(align===BorderLayout.SOUTH){
            let  rYY:number=0;

            this.south =wrap;
            if(area.north&&!area.center){
                rY = Math.floor(parent.height /2 );
                this.north.resize(null, rY);
                sY = this.north.computedHeight;
            }
            else if( area.center ){
                rY = child.prefsHeight||Math.floor(parent.height/4);
                wrap.setMaxHeight(60);
                if( area.north ) rYY = rY + this.north.computedHeight;
                console.log("*---------------------okkkkk")
                if(this.west) this.west.resize(null,parent.height-rYY);
                sY =  this.north.computedHeight + this.west.computedHeight;
            }
            this.south
                .setMinHeight(5)
                .setX(0).setY(sY)
                .resize(parent.width, rY)
                .setPreferenceHeight(child.prefsHeight)
                .setPreferenceWidth(parent.width)
               // .setBackground(0x55AA55);
        }
        parent.pack();

        console.log( wrap.child )
        return wrap;
    }

}