///<amd-module name='/lib/GObject.js'/>

import "./glib/glib"
import {FrameBuffer} from "./glib/glib";
import {rgbProto} from "./glib/glibConstants";

export interface gObject {
    resize( width: number, height: number ):GObject
    resizeWidth( width:number ):GObject
    resizeHeight( width:number ):GObject
    setPosition( x:number, y:number ):void
    setX(x:number ):GObject
    setY(y:number ):GObject
    setParent( parent:GObject ):GObject
    setMinWidth(size:number):GObject
    setMaxWidth(size:number):GObject
    setPreferenceWidth(size:number):GObject
    setPreferenceHeight(size:number):GObject
    setMaxHeight(size:number):GObject
    setMinHeight(size:number):GObject
    setBackground( color:number):GObject
    setMargin(  left: number, top:number, right:number, bottom:number ):GObject
    getMargin( value:string ): number|Map<string, number>
    setPadding( left:number, top:number, right:number, bottom:number ):GObject
    getPadding( value:Position ):number|Map<string, number>
    setBorder( left:number, top:number, right:number, bottom:number, color:number ):GObject
    pack( ):void
    getFrameBuffer():FrameBuffer
    render():GObject
    add(graphicsElement: GObject):GObject
    append( element:GObject, align?:number):GObject
}
/****
 * @GObject : Master Graphics Object
 */
export type Map<K extends number|string,V> = { [J in K] : V };
export type Position = "top"|"left"|"right"|"bottom";

export class GObject implements gObject{
    //
    private readonly buffer: FrameBuffer;
    //
    private parent:GObject        = null;
    private Child:Array<GObject>  = Array();
    // Position
    private X :number = 0;
    private Y :number = 0;
    // Width Dimension
    private Width :number    = 0;
    private MaxWidth:number  = null;
    private MinWidth:number  = null;
    private PrefsWidth:number= null;
    // Height Dimension
    private Height :number    = 0;
    private MinHeight:number  = null;
    private MaxHeight:number  = null;
    private PrefsHeight:number= null;
    //
    private offsetX:number = 0;
    private offsetY:number = 0;
    // Gap Dimension
    private padding:Map<string, number> = {left:0,top:0,right:0,bottom:0};
    private margin:Map<string, number>  = {left:0,top:0,right:0,bottom:0};
    private border:Map<string, number>  = {left:0,top:0,right:0,bottom:0};
    // Background
    private Background:number = 0xffffff;
    private Gradient:number;
    private precompiled:Map<string, Function> = {};
    /***
     * @param width  : number
     * @param height : number
     * @param parent : GraphicsElement
     */
    constructor(width:number = 0, height:number = 0, parent: GObject = null) {
        this.buffer = FrameBuffer.builder();
        this.buffer.resize(width||1,height||1);
        this.parent    = parent;
        this.Width     = width;
        this.Height    = height;
        this.setBackground(this.Background);
    }

    get width():number{return this.Width; }

    get height():number{return this.Height; }

    get x( ):number{ return this.X; }

    get y( ):number{ return this.Y; }

    // outerWidth
    get computedWidth( ):number{ return this.width + this.padding.left + this.padding.right + this.border.left + this.border.right; }
    // outerHeight
    get computedHeight( ):number{ return this.height + this.padding.top + this.padding.bottom + this.border.top + this.border.bottom; }

    get innerWidth( ):number{ return this.width - (this.padding.left + this.padding.right + this.border.left + this.border.right); }

    get innerHeight( ):number{return this.height - (this.padding.top + this.padding.bottom + this.border.top + this.border.bottom); }

    get background( ):number{ return this.Background; }

    get minWidth():number{return this.MinWidth;}

    get maxWidth():number{return this.MaxWidth;}

    get prefsWidth():number{return this.PrefsWidth; }

    get minHeight():number{return this.MinHeight;}

    get maxHeight():number{return this.MaxHeight;}

    get prefsHeight():number{return this.PrefsHeight; }

    get parentHandle( ):GObject{return this.parent;}

    get child():Array<GObject>{ return this.Child;}

    public resize( width: number = 0, height: number = 0 ):GObject{
        if(width===null&&height===null||this.width===width&&this.height===height)return this;

        this.Height= height||this.Height;
        this.Width = width||this.Width;
        if(this.MaxWidth&&this.Width>this.MaxWidth) this.Width=this.MaxWidth;
        if(this.MinWidth&&this.Width<this.MinWidth) this.Width=this.MinWidth;
        if(this.MaxHeight&&this.Height>this.MaxHeight) this.Height=this.MaxHeight;
        if(this.MinHeight&&this.Height<this.MinHeight) this.Height=this.MinHeight;
        // resize
        this.buffer.resize(this.Width||1,this.Height||1);
        return this;
    }

    public resizeWidth( width:number ): GObject{
        return this.resize(width,null);
    }

    public resizeHeight( width:number ): GObject{
        return this.resize(width,null);
    }

    public setPosition( x:number = 0, y:number = 0 ):void{
        this.X = x;
        this.Y = y;
    }

    public setX(x:number = 0):GObject{this.X=x; return this}

    public setY(y:number = 0):GObject{this.Y=y;return this}

    public setParent( parent:GObject = null ):GObject{
        if(!this.parent)this.parent = parent;
        return this;
    }

    public setMinWidth(size:number):GObject{
        this.MinWidth=size;
        return this;
    }

    public setMaxWidth(size:number):GObject{
        this.MaxWidth=size;
        return this;
    }

    public setPreferenceHeight(size:number):GObject{
        this.PrefsHeight=size;
        return this;
    }

    public setMinHeight(size:number):GObject{
        this.MinHeight=size;
        return this;
    }

    public setMaxHeight(size:number):GObject{
        this.MaxHeight=size;
        return this;
    }

    public setPreferenceWidth(size:number):GObject{
        this.PrefsWidth=size;
        return this;
    }

    public setBackground( color:number = 0x000000 ):GObject{
        this.Background = color;
        this.precompiled.color = ()=>this.buffer.resetScreen(color);
        return this;
    }

    public setBackgroundGradient( color1: number, color2:number ):GObject{
        this.Background = color1;
        this.Gradient   = color2;

        this.precompiled.gradient = ()=>{
            let loopY = 0,
            colorA: rgbProto = FrameBuffer.intToRgb(Math.max(color1,color2)),
            colorB:rgbProto = FrameBuffer.intToRgb(Math.min(color1,color2)),
            ratio:rgbProto = {
                r: (colorA.r-colorB.r )/ this.height,
                g: (colorA.g-colorB.g )/ this.height,
                b: (colorA.b-colorB.b )/ this.height
            };
            while( loopY < this.height ){
                colorA.r = Math.floor( colorA.r - ratio.r );
                colorA.g = Math.floor( colorA.g - ratio.g );
                colorA.b = Math.floor( colorA.b - ratio.b );
                this.buffer.setLine(loopY, FrameBuffer.rgbToInt( colorA ) );
                loopY++;
            }
        };
        return this;
    }

    public setMargin(  left: number= null, top:number = null, right:number = null, bottom:number = null ):GObject{
        let width:number = this.width, height:number = this.height;

        width -= this.margin.left + this.margin.right;
        height -= this.margin.top + this.margin.bottom;
        if(left>-1)this.margin.left       = left;
        if(top>-1)this.margin.top         = top;
        if(right>-1)this.margin.right     = right;
        if(bottom>-1)this.margin.bottom   = bottom;
        this.resize( width + this.margin.left + this.margin.right, height + this.margin.top + this.margin.bottom );
        return this;
    }

    public getMargin( value:string = null ): number|Map<string, number>{
        if(value===null) return this.margin;
        else if(this.margin[value]!==undefined)return this.margin[value];
        return null;
    }

    public setPadding( left:number = null, top:number = null, right:number = null, bottom:number = null ):GObject{
        let width:number = this.width, height:number = this.height;

        width -= this.padding.left + this.padding.right;
        height -= this.padding.top + this.padding.bottom;
        if(left>-1)this.padding.left       = left;
        if(top>-1)this.padding.top         = top;
        if(right>-1)this.padding.right     = right;
        if(bottom>-1)this.padding.bottom   = bottom;
        this.resize( width + this.padding.left + this.padding.right, height + this.padding.top + this.padding.bottom );
        return this;
    }

    public getPadding( value:Position = null ):number|Map<string, number>{
        if(value===null) return this.margin;
        else if(this.padding[value])return this.padding[value];
        return null;
    }

    public setBorder( left:number = 0, top:number = 0, right:number = 0, bottom:number = 0, color:number = 0xececec ):GObject{
        let max:number = Math.max(Math.max(left,right),Math.max(top,bottom)),
            w:number = left+right, h:number = top+bottom;
        if(top>0)this.border.top = top;
        if(bottom>0) this.border.bottom=bottom;
        if(right>0)this.border.right=right;
        if(left>0)this.border.left=left;
        this.precompiled.border = ()=> {
            for(let i = 0; i<max;i++){
                if(top>0){
                    // @ts-ignore
                    this.buffer.bind(0,i, this.width,i,color);
                    --top;
                }
                if(bottom>0){
                    // @ts-ignore
                    this.buffer.bind(0,this.height-i-1, this.width,this.height-i,color);
                    --bottom;
                }
                if(right>0){
                    // @ts-ignore
                    this.buffer.bind(i,0, i,this.height-1,color);
                    --right;
                }
                if(left>0){
                    // @ts-ignore
                    this.buffer.bind(this.width-i,0, this.width-i-1, this.height,color);
                    --left;
                }
            }
        };
        this.offsetX = parseInt(String(w/2));
        this.offsetY = parseInt(String(h/2));
        this.resize(this.width+w,this.height+h)
        return this;
    }

    pack( ):void{
        // for now just pack element from X
        if(this.Child.length>0)
            this.Child.forEach(element=>{

                element.resize(
                    // @ts-ignore
                    this.width - ( this.margin.left + this.margin.right + element.getMargin("left") + element.getMargin("right")  ),
                    element.height
                );
            });
    }
    /****
     * @packs : Resize all child elements
     * @loop
     */
    packs( ):void{
        if(this.Child.length>0) this.Child.forEach(element=>{
                element.resize(
                    // @ts-ignore
                    this.width - ( this.margin.left + this.margin.right + element.getMargin("left") + element.getMargin("right")  ),
                    // @ts-ignore
                    this.height - ( this.margin.top + this.margin.bottom + element.getMargin("top") + element.getMargin("bottom")  )
                );
        });
    }

    public getFrameBuffer():FrameBuffer{ return this.buffer;}

    /****
     * @add : Append child GObject
     * @param graphicsElement
     */
    public add(graphicsElement: GObject):GObject{
        this.child.push(graphicsElement);
        graphicsElement.setParent(this);
        return this;
    }
    /***
     * @deprecated
     * @param element
     * @param align
     */
    public append( element:GObject, align:number = 0 ):GObject{
        let childHeight = 0;
        if(this.Child.length>=1)this.Child.forEach(element=>childHeight+=element.computedHeight);

        // if (marginX)+width > parentWidth => get Area of element width-marginX
        this.Child.push(element);
        element.setParent(this);
        element.setY( element.y + childHeight );

        return this;
    }
    /***
     * @render : Allow to apply each layer to parent layer frameBuffer
     */
    public render():GObject{
        let tmp:string;
        for( tmp in this.precompiled ) this.precompiled[tmp]();
        if(this.Child.length >0)
            this.Child.forEach(element=>{
                element.render();
                //console.log("offsetx ",this.offsetX, "elemntx ",element.x, "padding to left ", this.padding.left, "margin left ",element.getMargin("left") )
                // @ts-ignore
                //console.log("x ",this.offsetX + element.x + this.padding.left + element.getMargin("left"),"y ",this.offsetY + element.y + this.padding.top  + element.getMargin("top"))
                //console.log(this)
                this.buffer.append(
                    // @ts-ignore
                    this.offsetX + element.x + this.padding.left + element.getMargin("left"),
                    // @ts-ignore
                    this.offsetY + element.y + this.padding.top  + element.getMargin("top"),
                    element.getFrameBuffer(),
                    0x00
                );
            });
        return this;
    }
}