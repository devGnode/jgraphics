///<amd-module name='/lib/glib/glib.js'/>
import {
    byte, dword, float,
    frameBufferDataArgs,
    frameBuilderDim,
    predicationColors,
    rgbProto,
    screenTypeArgs,
    YCrCbOpts
} from "./glibConstants";

import {filters, frameBuffer, graphicalUserInterface, tiles} from "./glibInterface";

export class GraphicalUserInterface implements graphicalUserInterface{

    public static readonly verion = "ts-3.0.0-es2020";

    private readonly monitor: HTMLCanvasElement;
    private readonly ctxMonitor:CanvasRenderingContext2D;

    private Screen_x:number;
    private Screen_y:number;

    constructor(opts) {
        this.monitor     = opts.monitor|| null;
        this.ctxMonitor = this.monitor.getContext("2d");
        this.resize(opts.width,opts.height);
    }

    public getHandle():HTMLCanvasElement{ return this.monitor; }

    public screen(type:screenTypeArgs = "x"):number{return parseInt(String(this.monitor[(type==="x"? "width" : "height")]));}

    public screen_x():number{return this.screen("x");}

    public screen_y():number{return this.screen("y");}

    get screenX( ):number{ return this.screen_x();}

    get screenY( ){ return this.screen_y();}

    public drawImage( domImg: HTMLImageElement ):void{
        this.ctxMonitor.drawImage( domImg, 0, 0 );
    }
    /***
     * @param width
     * @param height
     * @return {GraphicalUserInterface}
     */
    public resize( width, height ):GraphicalUserInterface{
        this.setScreenX = width;
        this.setScreenY = height;
        return this;
    }
    /***
     * @param width
     */
    set setScreenX(width){this.monitor.width = this.Screen_x  = Math.abs(width);}
    /***
     * @param height
     */
    set setScreenY(height){this.monitor.height = this.Screen_y = Math.abs(height);}
    /***
     * Uint8
     * @return {FrameBuffer}
     */
    public getFrameBuffer(): FrameBuffer{
        return FrameBuffer.builder(this.ctxMonitor.getImageData(0,0, this.screen_x(), this.screen_y() ),{
            x: this.screen_x(), y: this.screen_y()
        });
    }
    /***
     * @return {string}
     */
    // @ts-ignore
    public snapshot( ){return this.ctxMonitor.toDataURL( );}
    /***
     */
    public refresh( frameBuffer ):FrameBuffer{
        if(!(frameBuffer instanceof FrameBuffer)) throw  new TypeError("arguments must be a FrameBuffer instance !");
        this.ctxMonitor.putImageData(frameBuffer.getBuffer(),0,0);
        return frameBuffer;
    }
}

export class FrameBuffer implements frameBuffer{

    public static readonly RESET_BACKGROUND = 0xFF000000;
    public static readonly BITS_PER_PIXEL   = 0x04;

    private buffer:ImageData    = null;
    private dim:frameBuilderDim = null;

    private rgba:boolean     = false;
    private bpp:number       = FrameBuffer.BITS_PER_PIXEL;

    public bindType:number = 0;

    // test
    public sliceStart:number = 0;

    constructor( data: frameBufferDataArgs, dimension:frameBuilderDim) {

        if(data&&!(data instanceof  ImageData) && !(data instanceof  Uint8ClampedArray) && !(data instanceof Array) && !(data instanceof Uint8Array))
            throw new Error("Bad cast [ " +typeof data+ " ], object accepted can be ImageData | Uint8Array | Uint8ClampedArray | Array ");

        if (data instanceof ImageData) this.buffer = data;
        else if (typeof data === "object" && data !== null) {
            this.buffer = new ImageData(
                data instanceof Uint8ClampedArray ? data : new Uint8ClampedArray(data), dimension.x, dimension.y
            );
        }else {
            // default
            this.buffer = new ImageData(dimension.x || 1, dimension.y || 1);
        }

        this.dim  = dimension;
        if(!this.dim.x)this.dim = {x: this.buffer.width, y : this.buffer.height};
    }
    /**
     * Getter
     */
    get width( ){return this.buffer.width;}

    get height( ){return this.buffer.height;}
    /***
     * @return {number}
     */
    getWidth():number{ return this.buffer.width; }

    getHeight():number{ return this.buffer.height; }
    /***
     * @setRawPixel : set a new pixel into the canvas
     * @param offset uint32
     * @param color uint32
     * @return {FrameBuffer}
     */
    setRawPixel(offset:dword = 0x00000000,color:dword = 0xFF000000):FrameBuffer{
        this.buffer.data[ offset+0x00 ] = ( color >> 0x10 )&0xff;	// R
        this.buffer.data[ offset+0x01 ] = ( color >> 0x08 )&0xff;	// G
        this.buffer.data[ offset+0x02 ] = ( color )&0xff;		    // B
        this.buffer.data[ offset+0x03 ] = this.rgba ? ( color >> 0x18 )&0xff : 255; // A
        return this;
    }
    /***
     * @param offset
     * @return {number}
     */
    getRawPixel(offset:dword = 0x00000000):dword{
        return (
            this.buffer.data[ offset+0x00 ] << 0x10 | // 0x00XX0000 R
            this.buffer.data[ offset+0x01 ] << 0x08 | // 0x0000XX00 G
            this.buffer.data[ offset+0x02 ] |         // 0x000000XX B
            (this.rgba ? this.buffer.data[ offset+0x03 ]  : 0 ) << 0x18  // 0xXX000000 A
        );
    }
    /***
     * @param offset
     * @param color
     * @return {FrameBuffer}
     */
    setPixelOff(offset:dword = 0x00000000, color:dword = 0xFF000000 ):FrameBuffer{return this.setRawPixel(offset*this.bpp,color);}
    /***
     * @param offset
     * @return {number}
     */
    getPixelOff(offset:dword = 0x00000000):dword{return this.getRawPixel(offset*this.bpp);}
    /***
     * @param x
     * @param y
     * @return {number}
     */
    getPixel( x:number = 0, y:number = 0 ){return this.getRawPixel(( ( y * this.dim.x ) + x )* this.bpp );}
    /***
     * @param x
     * @param y
     * @param color
     * @return {FrameBuffer}
     */
    setPixel( x:number = 0, y:number = 0, color:dword = 0xFF000000 ):FrameBuffer{
        return this.setRawPixel(( ( y * this.dim.x ) + x )* this.bpp, color );
    }
    /***
     * Convert and offset as an object with x & y getter
     * @param offset
     * @return {{x: number, y: number}}
     */
    getPosition( offset = 0x00000000 ):frameBuilderDim{
        return {
            x: parseInt(String((offset/this.bpp)%this.buffer.width)),
            y: parseInt(String((offset/this.bpp)/this.buffer.width)),
        };
    }
    /***
     * @param x
     * @param y
     * @return {number}
     */
    getOffset(x:number= 0, y:number = 0 ):dword{return ( (( y * this.buffer.width ) + x ) * this.bpp );}
    /**
     * @return {number}
     */
    sizeof():number{return ( this.buffer.width * this.buffer.height) * this.bpp;}
    /***
     * @param callback
     * @return {FrameBuffer}
     */
    each( callback:Function = null ): FrameBuffer{
        let x:number = this.buffer.width,
            len:number = this.sizeof(),
            offset:dword = 0,color:dword;

        callback = typeof callback === "function" ? callback : (... args)=>{return null;};
        for(; offset < len; offset+= this.bpp){
            if( callback.call(
                this,         // this
                offset/4,     // addr,
                (color = this.getRawPixel(offset)),   // UINT32 color
                FrameBuffer.intToRgb(color),          // JSON RGB
                parseInt( String((offset/4)%x) ),         // X position
                parseInt( String((offset/4)/x)  )  	     // Y position
            ) === null ) break;
        }
        return this;
    }
    /***
     * @param color
     * @param rgba
     * @return {FrameBuffer}
     */
    resetScreen( color:dword = FrameBuffer.RESET_BACKGROUND, rgba:boolean = false ):FrameBuffer{
        let offset = 0, rgbaA = this.rgba,
            len = this.sizeof();

        if(isNaN(parseInt(String(color)))) throw new TypeError("Wrong color");
        if( this.rgba !== rgba ) this.rgba=rgba;

        /***
         * avoid to use each method
         * for performing this code
         */
        for(; offset < len; offset+= this.getBpp() ){
            this.setRawPixel(offset,color);
        }
        this.rgba = rgbaA;

        return this;
    }
    /***
     * @return {ImageData}
     */
    copy():ImageData{return new ImageData(new Uint8ClampedArray(this.buffer.data), this.dim.x,this.dim.y);}
    /***
     * @param enabled
     * @return {FrameBuffer}
     */
    setRgba( enabled:boolean = false ):FrameBuffer{
        this.rgba = enabled;
        return this;
    }
    /***
     * @return {boolean}
     */
    getRgba( ):boolean{ return this.rgba; }
    /***
     * @param bpp
     * @return {FrameBuffer}
     */
    setBpp(bpp:byte = 0x04):FrameBuffer{
        this.bpp = bpp;
        return this;
    }
    /***
     * @return {number}
     */
    getBpp( ):byte{return this.bpp;}
    /***
     * @return {ImageData}
     */
    getBuffer():ImageData{return this.buffer;}
    /***
     * @return {Uint32Array}
     */
    getUin32FrameBuffer( addAlpha:number = -1 ):Uint32Array{
        let offset:number = 0,
            len:number = this.sizeof(),
            buffer:Uint32Array;

        addAlpha = (addAlpha===-1?0:addAlpha)<<0x18;
        buffer = new Uint32Array( (this.buffer.width * this.buffer.height) ).fill(0);
        for(; offset < len; offset+= this.getBpp() ){
            buffer[parseInt(String(offset/4))] = addAlpha +(this.getRawPixel(offset));
        }

        return buffer;
    }
    /***
     * type false == set ; true == get
     * @param type
     * @param y
     * @param color
     * @param returnedColorInt
     */
    line( type:boolean = false, y:number = 0, color:dword|Function = FrameBuffer.RESET_BACKGROUND, returnedColorInt:boolean = false):Array<dword>|FrameBuffer{
        let colors:Array<dword> = null, cnt:number = 0,
            eip:number = ( y * this.buffer.width * this.bpp ),
            base:number = eip + ( this.buffer.width * this.bpp );

        try{
            colors = type ? new Array(this.buffer.width*this.bpp).fill(0) : null;
            while( eip < base ){
                if( type ) colors[ returnedColorInt ? colors.length : parseInt(String(eip/this.bpp)) ] = this.getRawPixel(eip);
                else{
                    typeof color === "function" ?
                        color.call( this, parseInt(String(eip/this.bpp)) ) :
                        this.setRawPixel(eip, typeof color === "number" ? color : color[ returnedColorInt ? cnt : parseInt(String(eip/this.bpp))] );
                }
                cnt++;
                eip+= this.bpp;
            }
        }catch (e) {
            return null;
        }

        return type ? colors : this;
    }

    getLine(y:number = 0, color:dword = FrameBuffer.RESET_BACKGROUND, returnedColorInt:boolean = false):Array<dword>{
        // @ts-ignore
        return this.line(
            true,
            y, color,
            returnedColorInt
        );
    }

    setLine(y:number = 0, color:dword = FrameBuffer.RESET_BACKGROUND, returnedColorInt:boolean = false):FrameBuffer{
        // @ts-ignore
        return this.line(
            false,
            y, color,
            returnedColorInt
        );
    }

    /***
     * @param x
     * @param y
     * @param degree
     * @param overflow
     */
    rotate(degree:number = 0, overflow:number = -1, x:number = 0, y:number = 0 ):FrameBuffer{
        let rcos:number,rsin:number,nx:number,ny:number,len:number, buffer:Uint32Array,
            width:number,height:number, offsetX:number = x, offsetY:number = y, offset:number=0;
        // deg rad
        rcos = Math.cos(Math.PI*degree /180);
        rsin = Math.sin(Math.PI*degree /180);

        width = this.buffer.width;
        height= this.buffer.height;
        nx = Math.floor(width * Math.abs(rcos) + height * Math.abs(rsin) );
        ny = Math.floor(width * Math.abs(rsin) + height * Math.abs(rcos) );
        len =  nx*ny;

        buffer = this.getUin32FrameBuffer();
        this.resize(nx,ny);

        try{
            for(; offset < len; offset++){

                x = Math.floor( (width/2) +( Math.floor(offset%nx) - (nx/2)) * rcos  - ( Math.floor(offset/nx) - (ny/2) ) * rsin  );
                y = Math.floor(  ( height/2)+  (Math.floor(offset%nx) - (nx/2)) * rsin  +  ( Math.floor(offset/nx) - (ny/2) ) * rcos   );

                if( x >= 0 && x < width && y >= 0 && y < height  ){
                    this.setPixel(
                        Math.floor( (Math.floor(offset%nx ) + offsetX) ),
                        Math.floor( (Math.floor(offset/nx ) + offsetY) ),
                        buffer[ ( y * width ) + x ]
                    );
                    // overflow
                }else overflow > -1 ? this.setPixel(
                    Math.floor( (Math.floor(offset%nx ) + offsetX)  ),
                    Math.floor( (Math.floor(offset/nx ) + offsetY)  ),
                    overflow
                ): void 0;
            }
        }catch (e) {
            console.log(e);
            return this;
        }
        return this;
    }

    rot(degree:number=0, overflow:number=-1, x:number= 0, y:number = 0):FrameBuffer{return this.rotate(degree,overflow,x,y);  }
    /***
     * @param xa
     * @param ya
     * @param xb
     * @param yb
     * @param color
     * @param opts
     * @return {FrameBuffer}
     */
    bind(xa:number ,ya:number ,xb:number ,yb:number,color:dword = 0xFF000000, opts:byte = 0x00 ):FrameBuffer{
        // Y = a.( x - xa ) + ya
        // m  Coeff director -- i  offset
        // bs base
        let dist:number, m:number, _yx:number,
            i:number    = Math.min(xa,xb),
            base:number = Math.max(xa,xb);

        // distance Euclidean
        // AXE X [ xa, xb ]
        dist = Math.floor(Math.sqrt( Math.pow(xb-xa, 2 ) + Math.pow(yb-ya, 2) ))-(base-i);
        if((xb-xa) !== 0){
            m = (yb-ya)/(xb-xa);
            while( i <= base ){
                _yx = Math.abs(Math.floor( m*(i-xa)+ya ));
                if(
                    _yx > 0 &&/*_yx <= this.#buffer.width &&*/ i > 0 && i <=this.buffer.width &&
                    ( !(opts&0xf||this.bindType) || (i%(opts&0xf||this.bindType)) )
                ){
                    this.setPixel( i, Math.abs(_yx), color === null || color=== undefined ? 0xff000000 : color);
                }
                i++;
            }
        }else {
            // to review for pass to down
            i   =  Math.min(ya,yb);
            base= Math.max(ya,yb);
            while( i <= base ){
                this.setPixel(xa,i,color === null || color=== undefined ? 0xff000000 : color);
                i++;
            }
        }
        // re-def coeff
        // AXE Y [ ya, yb ]
        i    = Math.min(ya,yb);
        base = Math.max(ya,yb);
        m    = (xb-xa)/(yb-ya);
        if( dist > 0 && (yb-ya) !== 0  ){
            while( i <= base ){
                _yx = Math.abs(Math.floor( m*(i-ya)+xa ));
                if(
                    _yx > 0 &&/* _yx <= this.#buffer.height &&*/ i > 0 && i <= this.buffer.height &&
                    ( !(opts&0xf||this.bindType) || !(i%(opts&0xf||this.bindType)) )
                ){
                    this.setPixel(Math.abs(_yx), i, color === null ? 0xff000000 : color );
                }
                i++
            }
            // DEFECT
        }else if((yb-ya) === 0) this.setLine(ya,color === null || color=== undefined ? 0xff000000 : color);

        return this;
    }
    /***
     * @return {TemplateDraw}
     */
    templateDraw():TemplateDraw{return new TemplateDraw(this);}
    /***
     * @param width
     * @param height
     */
    resize( width:number = 0,height:number = 0 ):FrameBuffer{

        if(isNaN(Math.floor(width))||isNaN(Math.floor(height))) throw new TypeError("Bad cast");
        this.buffer = new ImageData( width, height);
        this.dim = {x: width, y: height};

        return this;
    }

    tiles( options = null ):Tiles{return new Tiles( this, options||{} );}
    /***
     *
     * @param x
     * @param y
     * @param frameBuffer
     * @param overflow
     */
    append( x:number = 0, y:number = 0, frameBuffer:FrameBuffer, overflow:byte = 0x01 ):FrameBuffer{
        if(!(frameBuffer instanceof FrameBuffer))throw new Error(`Bad Cast : is not FrameBuffer Object : ${frameBuffer}`);
        this.tiles()
            .setOffsetX(frameBuffer.getWidth())
            .setOffsetY(frameBuffer.getHeight())
            .filter((c,value)=>value>0)
            .setOverflow(overflow)
            .setSlice(frameBuffer.sliceStart,1)
            .setTile(x,y,frameBuffer.getUin32FrameBuffer());
        return this;
    }
    /***
     * @param color
     * @return {{r: number, b: number, g: number}}
     */
    static intToRgb( color:dword = 0x000000 ):rgbProto{
        return {r:( color >> 0x10 )&0xff, g:( color >> 0x08 )&0xff, b:color&0xff};
    }
    /***
     * @param color
     * @return {dword}
     */
    static rgbToInt( color:rgbProto ):dword{return ( (color.r&0xff) << 0x10 ) | ( (color.g&0xff) << 0x08 ) | color.b&0xff;}
    /***
     * @param data
     * @param dimension
     * @return {FrameBuffer}
     */
    static builder(data?: frameBufferDataArgs,dimension?: frameBuilderDim):FrameBuffer{return new FrameBuffer(data,dimension||{x:0,y:0});}
}

export class Tiles implements tiles{
    /***
     * Tile size in pixels
     * @type FrameBuffer
     */
    private frame:FrameBuffer;
    /***
     * Tile size in pixels
     * @type Number
     */
    private offsetTilesX:number;
    private offsetTilesY:number;
    /***
     * @type boolean
     */
    private center:boolean;
    /***
     * @type boolean
     */
    private mod:byte;
    /***
     * @type Array<Number>
     */
    private readonly palette:Array<number>;
    private readonly buffer:ImageData;
    private alpha:boolean;
    /***
     * predication
     * @type ( offset : number, color: number)=> boolean
     */
    private Filter:predicationColors;
    /***
     * show : 0x01
     * hide : 0x00
     * @type number
     */
    private overflow:byte = 0x01;
    /***
     *
     */
    private sliceStart:number = 0;
    private sliceEnd:number;

    constructor( frameBufferHandler:FrameBuffer = null, options = null) {
        this.frame = frameBufferHandler;
        this.offsetTilesX = options.offsetTileX===null?1:options.offsetTileX;
        this.offsetTilesY = options.offsetTileY===null?1:options.offsetTileY;
        this.center       = options.center || false;
        this.mod          = options.mod || 0;
        this.palette      = options.palette || null;
        this.buffer       = options.buffer  || null;
        this.alpha        = frameBufferHandler.getRgba() || false;
        this.Filter       = options.filter || null;
        this.overflow     = options.overflow || 1;
    }

    getOffsetX():number{return this.offsetTilesX;}

    getOffsetY():number{return this.offsetTilesY;}

    setOffsetX( value:number = 0 ):Tiles{
        this.offsetTilesX = value;
        return this;
    }

    setOffsetY( value:number = 0 ):Tiles{
        this.offsetTilesY = value;
        return this;
    }

    setAlpha( state:boolean = false ):Tiles{
        this.alpha = state;
        return this;
    }

    filter( functionCallback:predicationColors = null ):Tiles{
        if(typeof functionCallback !== "function")throw new TypeError("Wrong arguments "+typeof functionCallback);
        this.Filter = functionCallback;
        return this;
    }

    setMode( value:byte = 0 ):Tiles{
        this.mod = value&0xff;
        return this;
    }

    setOverflow( value:byte = 0 ):Tiles{
        this.overflow = value&0x0f;
        return this;
    }

    getBuffer():ImageData{return this.buffer; }

    getAlpha( ):boolean{ return this.alpha; }

    setCenter( state:boolean = false ):Tiles{
        this.center = state;
        return this;
    }

    setSlice( start:number, end:number ):Tiles{
        if(!start||!end)return this;
        this.sliceStart = start;
        this.sliceEnd   = end;
        return this;
    }

    getCenter():boolean{return this.center; }

    /***
     * @param x
     * @param y
     * @param sprite
     * @param color
     * @param background
     * @return {boolean|*}
     */
    setTile( x:number = 0, y:number = 0, sprite = null, color:number = 0, background:number = 0):Tiles{
        let offsetX:number = x * this.offsetTilesX,
            offsetY:number = y * this.offsetTilesY,
            // center opts
            cx:number = this.center ? Math.floor( this.offsetTilesX/2 ):0,
            cy:number = this.center ? Math.floor( this.offsetTilesY/2 ):0,
            len:number = sprite.length, i:number = 0;

        //check
        offsetX /= /*this.#mod === 0 ?*/ this.offsetTilesX /*: 1*/;
        offsetY /= /*this.#mod === 0 ?*/ this.offsetTilesY /*: 1*/;

        try{
            for(; i < len; i++ ){

                if( ( ( this.Filter && this.Filter.call(null,i,sprite[i]) ) || !this.Filter ) && ( ( ( Math.floor( i%this.offsetTilesX ) - cx + offsetX ) < this.frame.getBuffer().width && this.overflow === 0 ) || this.overflow === 1 ) )
                    this.frame.setRawPixel(
                        ( (( (Math.floor( i/this.offsetTilesX ) + offsetY) - cy) * (this.frame.getBuffer().width) ) +( Math.floor( i%this.offsetTilesX ) - cx + offsetX ))*this.frame.getBpp(),
                        !this.mod || this.mod === 0 ?
                            sprite[ i + this.sliceStart ] :
                            this.mod === 1 ?
                                this.palette[ sprite[i] ] :
                                // binary image
                                this.mod === 2 ?
                                    (
                                        sprite[i] === 1 ? this.palette[color] :  // FIX CLR VAR
                                            sprite[i] === 0  && (background||background>=0) ? this.palette[background] :
                                                this.frame.getRawPixel(i)
                                    ) :
                                    this.mod === 3 ?  color :  void 0
                    );

            }
        }catch (e) {
            console.log(e);
            return null;
        }
        return this;
    }

    dimention( width:number = 0, height:number = 0 ):void{}
    /***
     * @param offset
     * @param tile
     * @param color
     * @param background
     * @return {*}
     */
    setTilesByOffset( offset:dword = 0, tile :Array<number>|Uint32Array = null, color:number = 0, background:dword = 0 ):Tiles{
        return this.setTile(
            Math.floor( offset% ( this.frame.width / this.offsetTilesX ) ),
            Math.floor( offset/ ( this.frame.height / this.offsetTilesX ) ),
            tile, color, background
        );
    }

}

export class TemplateDraw{

    private static readonly DEFAULT_COLOR = 0xFF000000;

    private frameBufferHandler:FrameBuffer;

    constructor(frameBufferHandler:FrameBuffer = null) {
        this.frameBufferHandler = frameBufferHandler;
    }

    grid( color:dword = TemplateDraw.DEFAULT_COLOR, mod:byte = 2, showX:boolean = true, showY:boolean = true ):TemplateDraw{
        return this.gridA(
            color,
            mod, mod,
            showX, showY
        );
    }

    gridA( color:dword = TemplateDraw.DEFAULT_COLOR, modX:byte = 2, modY:byte = 2, showX:boolean = true, showY:boolean = true ):TemplateDraw{
        let offset:number = 0,tmp:frameBuilderDim,
            len:number = this.frameBufferHandler.sizeof(),
            bpp:number = this.frameBufferHandler.getBpp();
        for(; offset < len; offset+= bpp){
            tmp = this.frameBufferHandler.getPosition(offset);
            if((tmp.x%modX===1&&tmp.x>-1&&showX)||(tmp.y%modY===1&&tmp.y>-1&&showY)){
                this.frameBufferHandler.setRawPixel(offset,color);
            }
        }
        return this;
    }

    square( x:number = 0, y:number = 0, width:number = 0, color:dword = 0x000000 ):FrameBuffer{
        return this.frameBufferHandler
            .bind( x,y, x+width,y, color )
            .bind( x+width,y, x+width,y+width, color)
            .bind( x+width,y+width, x,y+width, color )
            .bind(  x,y+width, x,y, color);
    }

    rect( x:number = 0, y:number = 0, width:number = 0, height:number = 0, color:dword = 0x000000 ):FrameBuffer{
        return this.frameBufferHandler
            .bind( x,y, x+width,y, color )
            .bind( x+width,y, x+width,y+height, color)
            .bind( x+width,y+height, x,y+height, color )
            .bind(  x,y+height, x,y, color);
    }

    cerc( xCenter:number = 0, yCenter:number = 0, rayon:number = 0 ):TemplateDraw{
        let x= 0, y= rayon, m= 5-4*rayon;

        while( x <= y ){

            this.frameBufferHandler.setPixel( x+xCenter, y+yCenter, 0x010101 );
            this.frameBufferHandler.setPixel( y+yCenter, x+xCenter, 0x010101 );

          //  this.frameBufferHandler.setPixel( xCenter-x, y+yCenter, 0x010101 );
          //  this.frameBufferHandler.setPixel( xCenter-y, yCenter+x, 0x010101 );
          //  this.frameBufferHandler.setPixel( x+xCenter, yCenter-y, 0x010101 );
          //  this.frameBufferHandler.setPixel( xCenter+y, yCenter-x, 0x010101 );

         //   this.frameBufferHandler.setPixel( xCenter-x, yCenter-y, 0x010101 );
         //   this.frameBufferHandler.setPixel( xCenter-y, yCenter-x, 0x010101 );
            if( m > 0 ) {
                y--;
                m-=4*y;
            }
            x++;
            m+=4*x+4;
        }
        return this;
    }

    arc( xCenter:number = 0, yCenter:number = 0, rayon:number = 0, color:dword = 0x010101 ):TemplateDraw{
        let x:number = 0,
            y:number = rayon,
            d:number = rayon - 1;

        while(y >= x)
        {
            this.frameBufferHandler.setPixel(  xCenter + x, yCenter + y, color );
            this.frameBufferHandler.setPixel( xCenter + y, yCenter + x, color );
            this.frameBufferHandler.setPixel( xCenter - x, yCenter + y, color );
            this.frameBufferHandler.setPixel( xCenter - y, yCenter + x, color );
            this.frameBufferHandler.setPixel(  xCenter + x, yCenter - y, color );
            this.frameBufferHandler.setPixel(  xCenter + y, yCenter - x, color );
            this.frameBufferHandler.setPixel(  xCenter - x, yCenter - y, color );
            this.frameBufferHandler.setPixel(  xCenter - y, yCenter - x, color );

            if (d >= 2*x) {
                d -= 2*x + 1;
                x ++;
            }
            else if (d < 2 * (rayon-y)) {
                d += 2*y - 1;
                y--;
            }
            else {
                d += 2*(y - x - 1);
                y--;
                x++;
            }
        }

        return this;
    }

    public getFrameBuffer():FrameBuffer{return this.frameBufferHandler;}
}

export class Filters extends FrameBuffer implements filters{

    constructor(data,dimension) {
        super(data,dimension);
    }
    /***
     * @param bits
     * @return {FrameBuffer}
     */
    bitsGreyScale( bits:byte = 0x01 ):void{
        let d,json,clr,offset =0,
            len = this.sizeof();
        bits&=0xff;
        bits = 255/bits;

        for(; offset < len; offset+= 4 ){
            clr = this.getRawPixel(offset);
            json=FrameBuffer.intToRgb(clr);
            d = Math.floor((((json.r+json.g+json.b)/3)/bits)+0.5)*bits;
            this.setRawPixel(offset, d<<0x10|d<<0x08|d)
        }
    }
    /***
     * @param opts
     * @param p
     * @param q
     * @param r
     * @return {*}
     * @constructor
     */
    YCrCb( opts: YCrCbOpts = {greyscale:true}, p:float = .2126, q:float = .7152, r:float = .0722 ):Filters|FrameBuffer{
        let k:number,_rgb:rgbProto = {r:0,g:0,b:0};
        return (p+q+r) >= 0 && (p+q+r) <= 1 ?
            this.each((offset:dword,uint32Color:dword,rgb:rgbProto)=>{

                k = Math.floor(rgb.r * p + rgb.g * q + rgb.b * r );
                if(opts.greyscale) _rgb.r = _rgb.g = _rgb.b = k;
                else{
                    _rgb.r = opts.r && k;
                    _rgb.g = opts.g && k;
                    _rgb.b = opts.b && k;
                }
                this.setPixelOff( offset,_rgb.r<<0x10|_rgb.g<<0x08|_rgb.b);
            }) : this;
    }
    /***
     * @param opts = greyscale boolean | r boolean | g boolean | b boolean
     * @return {*}
     * @constructor
     */
    YCrCbA( opts:YCrCbOpts  ):Filters|FrameBuffer{return this.YCrCb( opts, 0.2126, 0.7152, 0.0722 );}
    /***
     * @param dx 3 , 3 , 5, 7
     * @param dy 1 , 3 , 3, 7
     */
    median( dx:number = 3, dy:number = 3 ):Filters{
        let i,p,xa,ya,
            offset = 0, len = this.sizeof(),
            tmp = new Array(dx*dy ),
            m = Math.floor( (dx*dy)/2 ),
            my = Math.floor( dy/2 ),
            mx = Math.floor( dx/2 );
        /***
         * avoid to use each method
         * for performing this code
         */
        for(; offset < len; offset+= this.getBpp() ){
            //
            tmp.fill(-1);
            p = this.getPosition(offset);
            // deep browsing
            // Y-FLIP
            // X-FLIP
            for( ya= p.y-my,i = 0; ya <= p.y+my; ya++ ){
                for( xa= p.x-mx; xa <= p.x+mx; xa++, i++ ){
                    if( xa >= 0 && ya >= 0 && xa <= this.getWidth() && ya <= this.getHeight() ) tmp[i] = this.getPixel(xa,ya);
                }
            }
            //
            this.setRawPixel( offset, tmp.sort()[m] );
        }
        return this;
    }
    /***
     * @param deep
     * @return {FrameBuffer}
     */
    negativeGrey( deep:byte = 255 ):FrameBuffer{
        return this.each((offset,color,rgb)=>{
            let byte = Math.floor( deep-( (rgb.r + rgb.g + rgb.b)/3 ) );
            this.setPixelOff( offset,byte<<0x10|byte<<0x08|byte);
        });
    }
    /**
     * @param deep
     * @return {FrameBuffer}
     */
    negativeColor( deep:byte = 255 ) :FrameBuffer{
        return this.each((offset,color,rgb)=>{
            this.setPixelOff( offset,(deep-rgb.r)<<0x10|(deep-rgb.g)<<0x08|(deep-rgb.b));
        });
    };
    /***
     * @param limit
     */
    thresholding(limit:byte = 128):void{
        let offset:number=0, len:number = this.sizeof(),
            json:rgbProto;

        limit &=0xff;
        for(; offset < len; offset+= 4 ){
            json=FrameBuffer.intToRgb(this.getRawPixel(offset));
            this.setRawPixel(offset,
                (json.r>limit?0xff:json.r)<<0x10 |
                (json.g>limit?0xff:json.g) << 0x08 |
                (json.b>limit?0xff:json.b)
            );
        }
    }

}