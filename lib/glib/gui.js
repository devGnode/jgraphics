class GraphicalUserInterface{

    static verion = "3.0.0-es2020";

    #monitor;
    #ctxMonitor;
    #screen_x;
    #screen_y;

    constructor(opts) {
        this.#monitor     = opts.monitor|| null;
        this.#ctxMonitor = this.#monitor.getContext("2d");
        this.resize(opts.width,opts.height);
    }

    getHandle(){ return this.#monitor; }

    screen(type){return parseInt(this.#monitor[(type==="x"? "width" : "height")]);}

    screen_x(){return this.screen("x");}

    screen_y(){return this.screen("y");}

    get screenX( ){ return this.screen_x();}

    get screenY( ){ return this.screen_y();}

    drawImage( domImg ){
        if(!(domImg instanceof Element)) throw new TypeError("");
        this.#ctxMonitor.drawImage( domImg, 0, 0 );
    }
    /***
     * @param width
     * @param height
     * @return {GraphicalUserInterface}
     */
    resize( width, height ){
        this.setScreenX = width;
        this.setScreenY = height;
        return this;
    }
    /***
     * @param width
     */
    set setScreenX(width){this.#monitor.width = this.#screen_x  = Math.abs(width);}
    /***
     * @param height
     */
    set setScreenY(height){this.#monitor.height = this.#screen_y = Math.abs(height);}
    /***
     * Uint8
     * @return {FrameBuffer}
     */
    getFrameBuffer(){
        return FrameBuffer.builder(this.#ctxMonitor.getImageData(0,0, this.screen_x(), this.screen_y() ),{
            x: this.screen_x(), y: this.screen_y()
        });
    }
    /***
     * @return {string}
     */
    snapshot( ){return this.#ctxMonitor.toDataURL( );}
    /***
     */
    refresh( frameBuffer ){
        if(!(frameBuffer instanceof FrameBuffer)) throw  new TypeError("arguments must be a FrameBuffer instance !");
        this.#ctxMonitor.putImageData(frameBuffer.getBuffer(),0,0);
        return frameBuffer;
    }   
}

class Tiles{
    /***
     * Tile size in pixels
     * @type FrameBuffer
     */
    #frame;
    /***
     * Tile size in pixels
     * @type Number
     */
    #offsetTilesX;
    #offsetTilesY;
    /***
     * @type boolean
     */
    #center;
    /***
     * @type boolean
     */
    #mod;
    /***
     * @type Array<Number>
     */
    #palette;
    #buffer;
    #alpha;
    /***
     * predication
     * @type ( offset : number, color: number)=> boolean
     */
    #filter;
    /***
     * show : 0x01
     * hide : 0x00
     * @type number
     */
    #overflow = 0x01;

    constructor( frameBufferHandler = null, options = null) {
        this.#frame = frameBufferHandler;
        this.#offsetTilesX = options.offsetTileX===null?1:options.offsetTileX;
        this.#offsetTilesY = options.offsetTileY===null?1:options.offsetTileY;
        this.#center       = options.center || false;
        this.#mod          = options.mod || 0;
        this.#palette      = options.palette || null;
        this.#buffer       = options.buffer  || null;
        this.#alpha        = frameBufferHandler.getRgba() || false;
        this.#filter       = options.filter || null;
        this.#overflow     = options.overflow || 1;
    }

    getOffsetX(){return this.#offsetTilesX;}

    getOffsetY(){return this.#offsetTilesY;}

    setOffsetX( value = 0 ){
        this.#offsetTilesX = value;
        return this;
    }

    setOffsetY( value = 0 ){
        this.#offsetTilesY = value;
        return this;
    }

    setAlpha( state = false ){
        this.#alpha = state;
        return this;
    }

    filter( functionCallback = null ){
        if(typeof functionCallback !== "function")throw new TypeError("Wrong arguments "+typeof functionCallback);
        this.#filter = functionCallback;
        return this;
    }

    setMode( value = 0 ){
        this.#mod = value&0xff;
        return this;
    }

    setOverflow( value = 0 ){
        this.#overflow = value&0x0f;
        return this;
    }

    getBuffer(){return this.#buffer; }

    getAlpha( ){ return this.#alpha; }

    setCenter( state = false ){
        this.#center = state;
        return this;
    }

    getCenter(){return this.#center; }

    /***
     * @param x
     * @param y
     * @param sprite
     * @param color
     * @param background
     * @return {boolean|*}
     */
    setTile( x = 0, y = 0, sprite = null, color = 0, background = 0){
        let offsetX = x * this.#offsetTilesX,
            offsetY = y * this.#offsetTilesY,
            // center opts
            cx = this.#center ? parseInt( this.#offsetTilesX/2 ):0,
            cy = this.#center ? parseInt( this.#offsetTilesY/2 ):0,
            len = sprite.length, i = 0;

        //check
        offsetX /= /*this.#mod === 0 ?*/ this.#offsetTilesX /*: 1*/;
        offsetY /= /*this.#mod === 0 ?*/ this.#offsetTilesY /*: 1*/;

        try{
            for(; i < len; i++ ){

                if( ( ( this.#filter && this.#filter.call(null,i,sprite[i]) ) || !this.#filter ) && ( ( ( parseInt( i%this.#offsetTilesX ) - cx + offsetX ) < this.#frame.getBuffer().width && this.#overflow === 0 ) || this.#overflow === 1 ) )
                this.#frame.setRawPixel(
                    ( (( (parseInt( i/this.#offsetTilesX ) + offsetY) - cy) * (this.#frame.getBuffer().width) ) +( parseInt( i%this.#offsetTilesX ) - cx + offsetX ))*this.#frame.getBpp(),
                    !this.#mod || this.#mod === 0 ?
                        sprite[i] :
                        this.#mod === 1 ?
                            this.#palette[ sprite[i] ] :
                            // binary image
                        this.#mod === 2 ?
                             (
                                sprite[i] === 1 ? this.#palette[color] :  // FIX CLR VAR
                                sprite[i] === 0  && (background||background>=0) ? this.#palette[background] :
                                this.#frame.getRawPixel(i)
                             ) :
                        this.#mod === 3 ?  color :  void 0
                );

            }
        }catch (e) {
            console.log(e);
            return false;
        }
        return this;
    }

    dimention( width = 0, height = 0 ){

    }
    /***
     * @param offset
     * @param tile
     * @param color
     * @param background
     * @return {*}
     */
    setTilesByOffset( offset = 0, tile = null, color = 0, background = 0 ){
        return this.setTiles(
            parseInt( offset% ( this.#frame.screenY / this.#offsetTilesX ) ),
            parseInt( offset/ ( this.#frame.screenX / this.#offsetTilesX ) ),
            tile, color, background
        );
    }

}

class FrameBuffer{

    static RESET_BACKGROUND = 0xFF000000;
    static BITS_PER_PIXEL   = 0x04;

    #buffer = null;
    #dim    = null;

    #rgba   = false;
    #bpp    = FrameBuffer.BITS_PER_PIXEL;

    bindType = 0;

    constructor( data, dimension ) {

        if(data&&!(data instanceof  ImageData) && !(data instanceof  Uint8ClampedArray) && !(data instanceof Array) && !(data instanceof Uint8Array))
            throw new Error("Bad cast [ " +typeof data+ " ], object accepted can be ImageData | Uint8Array | Uint8ClampedArray | Array ");

        if (data instanceof ImageData) this.#buffer = data;
        else if (typeof data === "object" && data !== null) {
            this.#buffer = new ImageData(
                data instanceof Uint8ClampedArray ? data : new Uint8ClampedArray(data), dimension.x, dimension.y
            );
        }else {
        // default
        this.#buffer = new ImageData(dimension.x || 1, dimension.y || 1);
        }

        this.#dim    = dimension;
        if(!this.#dim.x){
           this.#dim = {x: this.#buffer.width, y : this.#buffer.height};
        }
    }
    /**
     * Getter
     */
    get width( ){return this.#buffer.width;}

    get height( ){return this.#buffer.height;}
    /***
     * @setRawPixel : set a new pixel into the canvas
     * @param offset uint32
     * @param color uint32
     * @return {FrameBuffer}
     */
    setRawPixel(offset = 0x00000000,color = 0xFF000000){
        this.#buffer.data[ offset+0x00 ] = ( color >> 0x10 )&0xff;	// R
        this.#buffer.data[ offset+0x01 ] = ( color >> 0x08 )&0xff;	// G
        this.#buffer.data[ offset+0x02 ] = ( color )&0xff;		    // B
        this.#buffer.data[ offset+0x03 ] = this.#rgba ? ( color >> 0x18 )&0xff : 255; // A
        return this;
    }
    /***
     * @param offset
     * @return {number}
     */
    getRawPixel(offset = 0x00000000){
        return (
            this.#buffer.data[ offset+0x00 ] << 0x10 | // 0x00XX0000 R
            this.#buffer.data[ offset+0x01 ] << 0x08 | // 0x0000XX00 G
            this.#buffer.data[ offset+0x02 ] |         // 0x000000XX B
            (this.#rgba ? this.#buffer.data[ offset+0x03 ]  : 0 ) << 0x18  // 0xXX000000 A
        );
    }
    /***
     * @param offset
     * @param color
     * @return {FrameBuffer}
     */
    setPixelOff(offset = 0x00000000, color = 0xFF000000 ){
        return this.setRawPixel(offset*this.#bpp,color);
    }
    /***
     * @param offset
     * @return {number}
     */
    getPixelOff(offset = 0x00000000){
        return this.getRawPixel(offset*this.#bpp);
    }
    /***
     * @param x
     * @param y
     * @return {number}
     */
    getPixel( x = 0, y = 0 ){
        return this.getRawPixel(( ( y * this.#dim.x ) + x )* this.#bpp );
    }
    /***
     * @param x
     * @param y
     * @param color
     * @return {FrameBuffer}
     */
    setPixel( x = 0, y = 0, color = 0xFF000000 ){
        return this.setRawPixel(( ( y * this.#dim.x ) + x )* this.#bpp, color );
    }
    /***
     * Convert and offset as an object with x & y getter
     * @param offset
     * @return {{x: number, y: number}}
     */
    getPosition( offset = 0x00000000 ){
        return {
            x: parseInt((offset/this.#bpp)%this.#buffer.width),
            y: parseInt((offset/this.#bpp)/this.#buffer.width),
        };
    }
    /***
     * @param x
     * @param y
     * @return {number}
     */
    getOffset(x= 0, y = 0 ){return ( (( y * this.#buffer.width ) + x ) * this.#bpp );}
    /**
     * @return {number}
     */
    sizeof(){return ( this.#buffer.width * this.#buffer.height) * this.#bpp;}
    /***
     * @return {number}
     */
    getWidth(){ return this.#buffer.width; }
    getHeight(){ return this.#buffer.height; }
    /***
     * @param callback
     * @return {FrameBuffer}
     */
    each( callback = null ){
        let x = this.#buffer.width,
            len = this.sizeof(),
            offset = 0,color;

        callback = typeof callback === "function" ? callback : (... args)=>{return null;};
        for(; offset < len; offset+= this.#bpp){
            if( callback.call(
                this,         // this
                offset/4,     // addr,
                (color = this.getRawPixel(offset)),   // UINT32 color
                FrameBuffer.intToRgb(color),          // JSON RGB
                parseInt( (offset/4)%x ),         // X position
                parseInt( (offset/4)/x )  	     // Y position
            ) === null ) break;
        }

        return this;
    }
    /***
     * @param color
     * @param rgba
     * @return {FrameBuffer}
     */
    resetScreen( color = FrameBuffer.RESET_BACKGROUND, rgba = false ){
        let offset = 0, rgbaA = this.#rgba,
            len = this.sizeof();

        if(isNaN(parseInt(color))) throw new TypeError("Wrong color");
        if( this.#rgba !== rgba ) this.#rgba=rgba;

        /***
         * avoid to use each method
         * for performing this code
         */
        for(; offset < len; offset+= this.getBpp() ){
            this.setRawPixel(offset,color);
        }
        this.#rgba = rgbaA;

        return this;
    }
    /***
     * @return {ImageData}
     */
    copy(){return new ImageData(new Uint8ClampedArray(this.#buffer.data), this.#dim.x,this.#dim.y);}
    /***
     * @param enabled
     * @return {FrameBuffer}
     */
    setRgba( enabled = false ){
        this.#rgba = enabled;
        return this;
    }
    /***
     * @return {boolean}
     */
    getRgba( ){ return this.#rgba; }
    /***
     * @param bpp
     * @return {FrameBuffer}
     */
    setBpp(bpp = 0x04){
        this.#bpp = bpp;
        return this;
    }
    /***
     * @return {number}
     */
    getBpp( ){return this.#bpp;}
    /***
     * @return {ImageData}
     */
    getBuffer(){return this.#buffer;}
    /***
     * @return {Uint32Array}
     */
    getUin32FrameBuffer( addAlpha = -1 ){
        let offset = 0,
            len = this.sizeof(),
            buffer;

        addAlpha = (addAlpha===-1?0:addAlpha)<<0x18;
        buffer = new Uint32Array( (this.#buffer.width * this.#buffer.height) ).fill(0);
        for(; offset < len; offset+= this.getBpp() ){
            buffer[parseInt(offset/4)] = addAlpha +(this.getRawPixel(offset));
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
    line( type = false, y = 0, color = FrameBuffer.RESET_BACKGROUND, returnedColorInt = false){
        let colors = null, cnt = 0,
            eip = ( y * this.#buffer.width * this.#bpp ),
            base = eip + ( this.#buffer.width * this.#bpp );

        try{
            colors = type ? new Array(this.#buffer.width*this.#bpp).fill(0) : null;
            while( eip < base ){
                    if( type ) colors[ returnedColorInt ? colors.length : parseInt(eip/this.#bpp) ] = this.getRawPixel(eip);
                    else{
                        typeof color === "function" ?
                            color.call( this, parseInt(eip/this.#bpp) ) :
                            this.setRawPixel(eip, typeof color === "number" ? color : color[ returnedColorInt ? cnt : parseInt(eip/this.#bpp)] );
                    }
                cnt++;
                eip+= this.#bpp;
            }
        }catch (e) {
            return null;
        }

        return type ? colors : this;
    }

    getLine(y = 0, color = FrameBuffer.RESET_BACKGROUND, returnedColorInt = false){
        return this.line(
            true,
            y, color,
            returnedColorInt
        );
    }

    setLine(y = 0, color = FrameBuffer.RESET_BACKGROUND, returnedColorInt = false){
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
    rotate(degree = 0, overflow = -1, x = 0, y = 0 ){
        let rcos,rsin,nx,ny,len, buffer,width,height,
        offsetX = x, offsetY = y, offset=0;
        // deg rad
        rcos = Math.cos(Math.PI*degree /180);
        rsin = Math.sin(Math.PI*degree /180);

        width = this.#buffer.width;
        height= this.#buffer.height;
        nx = parseInt(width * Math.abs(rcos) + height * Math.abs(rsin) );
        ny = parseInt(width * Math.abs(rsin) + height * Math.abs(rcos) );
        len =  nx*ny;

        buffer = this.getUin32FrameBuffer();
        this.resize(nx,ny);

        try{
            for(; offset < len; offset++){

               x = Math.floor( (width/2) +( parseInt(offset%nx) - (nx/2)) * rcos  - ( parseInt(offset/nx) - (ny/2) ) * rsin  );
               y = Math.floor(  ( height/2)+  (parseInt(offset%nx) - (nx/2)) * rsin  +  ( parseInt(offset/nx) - (ny/2) ) * rcos   );

                if( x >= 0 && x < width && y >= 0 && y < height  ){
                    this.setPixel(
                        parseInt( (parseInt(offset%nx ) + offsetX) ),
                        parseInt( (parseInt(offset/nx ) + offsetY) ),
                        buffer[ ( y * width ) + x ]
                    );
                // overflow
                }else overflow > -1 ? this.setPixel(
                    parseInt( (parseInt(offset%nx ) + offsetX)  ),
                    parseInt( (parseInt(offset/nx ) + offsetY)  ),
                    overflow
                ): void 0;

            }

        }catch (e) {
            console.log(e);
            return this;
        }
        return this;
    }

    rot(degree=0, overflow=-1, x = 0, y = 0){return this.rotate(degree,overflow,x,y);  }

    /***
     * @param xa
     * @param ya
     * @param xb
     * @param yb
     * @param color
     * @param opts
     * @return {FrameBuffer}
     */
     bind(xa, ya, xb, yb, color = 0xFF000000, opts = 0x00 ){
        // Y = a.( x - xa ) + ya
        // m  Coeff director -- i  offset
        // bs base
        let dist, m, _yx,
            i    = Math.min(xa,xb),
            base = Math.max(xa,xb);

        // distance Euclidean
        // AXE X [ xa, xb ]
        dist = parseInt(Math.sqrt( Math.pow(xb-xa, 2 ) + Math.pow(yb-ya, 2) ))-(base-i);
        //if(dist<=0)console.log("dist neg "+ dist, i, base, " xb-xa ", xb-xa, "yb-ya", (yb-ya))
        if((xb-xa) !== 0){
            m = (yb-ya)/(xb-xa);
            while( i <= base ){
                _yx = Math.abs(parseInt( m*(i-xa)+ya ));
                if(
                    _yx > 0 &&/*_yx <= this.#buffer.width &&*/ i > 0 && i <=this.#buffer.width &&
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
                _yx = Math.abs(parseInt( m*(i-ya)+xa ));
                if(
                    _yx > 0 &&/* _yx <= this.#buffer.height &&*/ i > 0 && i <= this.#buffer.height &&
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
    templateDraw(){return new TemplateDraw(this);}
    /***
     * @param width
     * @param height
     */
    resize( width = 0, height = 0 ){

         if(isNaN(parseInt(width))||isNaN(parseInt(height))) throw new TypeError("Bad cast");
         this.#buffer = new ImageData( width, height);
         this.#dim = {x: width, y: height};

         return this;
    }

    tiles( options = null ){return new Tiles( this, options||{} );}
    /***
     *
     * @param x
     * @param y
     * @param frameBuffer
     * @param overflow
     */
    append( x = 0, y = 0, frameBuffer, overflow = 0x01 ){
        if(!(frameBuffer instanceof FrameBuffer))throw new Error(`Bad Cast : is not FrameBuffer Object : ${frameBuffer}`);
        this.tiles()
            .setOffsetX(frameBuffer.getWidth())
            .setOffsetY(frameBuffer.getHeight())
            .filter((c,value)=>value>0)
            .setOverflow(overflow)
            .setTile(x,y,frameBuffer.getUin32FrameBuffer());
        return this;
    }
    /***
     * @param color
     * @return {{r: number, b: number, g: number}}
     */
    static intToRgb( color ){
        return {r:( color >> 0x10 )&0xff, g:( color >> 0x08 )&0xff, b:color&0xff};
    }
    /***
     * @param data
     * @param dimension
     * @return {FrameBuffer}
     */
    static builder(data,dimension){return new FrameBuffer(data,dimension||{});}
}

class TemplateDraw{

    static DEFAULT_COLOR = 0xFF000000;

    #frameBufferHandler;
    constructor(frameBufferHandler = null) {
        this.#frameBufferHandler = frameBufferHandler;
    }

    grid( color = TemplateDraw.DEFAULT_COLOR, mod = 2, showX = true, showY = true ){
        return this.gridA(
            color,
            mod, mod,
            showX, showY
        );
    }

    gridA( color = TemplateDraw.DEFAULT_COLOR, modX = 2, modY = 2, showX = true, showY = true ){
        let offset = 0,tmp,
            len = this.#frameBufferHandler.sizeof(),
            bpp = this.#frameBufferHandler.getBpp();
        for(; offset < len; offset+= bpp){
            tmp = this.#frameBufferHandler.getPosition(offset);
            if((tmp.x%modX===1&&tmp.x>-1&&showX)||(tmp.y%modY===1&&tmp.y>-1&&showY)){
                this.#frameBufferHandler.setRawPixel(offset,color);
            }
        }
        return this;
    }

    square( x = 0, y = 0, width = 0, color = 0x000000 ){
        return this.#frameBufferHandler
            .bind( x,y, x+width,y, color )
            .bind( x+width,y, x+width,y+width, color)
            .bind( x+width,y+width, x,y+width, color )
            .bind(  x,y+width, x,y, color);
    }

    rect( x = 0, y = 0, width = 0, height = 0, color = 0x000000 ){
        return this.#frameBufferHandler
            .bind( x,y, x+width,y, color )
            .bind( x+width,y, x+width,y+height, color)
            .bind( x+width,y+height, x,y+height, color )
            .bind(  x,y+height, x,y, color);
    }
}

class Filters extends FrameBuffer{

    constructor(data,dimension) {
        super(data,dimension);
    }

    /***
     * @param bits
     * @return {FrameBuffer}
     */
    bitsGreyScale( bits = 0x01 ){
        let d,json,clr,offset =0,
            len = this.sizeof();
        bits&=0xff;

        for(; offset < len; offset+= 4 ){
            clr = this.getRawPixel(offset);
            json=GraphicalUserInterface.intToRgb(clr);
            d = Math.floor((((json.r+json.g+json.b)/3)/(255/bits))+0.5)*(255/bits);
            this.setRawPixel(offset, d<<0x10|d<<0x08|d)
        }
        /*return this.each((offset,color,rgb)=>{
            let byte = Math.floor( (( (rgb.r + rgb.g + rgb.b)/3 ) / (255/bits) )+.5 )*(255/bits);
            this.setPixelOff( offset,byte<<0x10|byte<<0x08|byte);
        });*/
    }

    /***
     * @param opts
     * @param p
     * @param q
     * @param r
     * @return {*}
     * @constructor
     */
    YCrCb( opts = {}, p = .2126, q = .7152, r = .0722 ){
        let k,_rgb = {r:0,g:0,b:0};
        return (p+q+r) >= 0 && (p+q+r) <= 1 ?
            this.each((offset,uint32Color,rgb)=>{

                k = parseInt(rgb.r * p + rgb.g * q + rgb.b * r );
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
    YCrCbA( opts ){return this.YCrCb( opts, 0.2126, 0.7152, 0.0722 );}

    /***
     * @param dx 3 , 3 , 5, 7
     * @param dy 1 , 3 , 3, 7
     */
    median( dx = 3, dy = 3 ){
        let i,p,xa,ya,
            offset = 0, len = this.sizeof(),
            tmp = new Array(dx*dy ),
            m = parseInt( (dx*dy)/2 ),
            my = parseInt( dy/2 ),
            mx = parseInt( dx/2 );

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
    negativeGrey( deep = 255 ){
        return this.each((offset,color,rgb)=>{
            let byte = Math.floor( deep-( (rgb.r + rgb.g + rgb.b)/3 ) );
            this.setPixelOff( offset,byte<<0x10|byte<<0x08|byte);
        });
    }

    /**
     * @param deep
     * @return {FrameBuffer}
     */
    negativeColor( deep = 255 ) {
        return this.each((offset,color,rgb)=>{
            this.setPixelOff( offset,(deep-rgb.r)<<0x10|(deep-rgb.g)<<0x08|(deep-rgb.b));
        });
    };

    /***
     * @param limit
     */
    thresholding(limit = 128){
        let offset =0,len = this.sizeof(),
            json;

        limit &=0xff;
        for(; offset < len; offset+= 4 ){
            json=GraphicalUserInterface.intToRgb(this.getRawPixel(offset));
            this.setRawPixel(offset,
                (json.r>limit?0xff:json.r)<<0x10 |
                (json.g>limit?0xff:json.g) << 0x08 |
                (json.b>limit?0xff:json.b)
            );
        }
    }

    /*sobel(){
        let x = this.#buffer.width,
            y = this.#buffer.height,
            len = (x * y)*this.#bpp,
            offset = 0,color;

        for(; offset < len; offset+= this.getBpp()){

        }
    }*/

}
