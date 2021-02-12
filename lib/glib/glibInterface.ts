import {byte, dword,  float, frameBuilderDim, predicationColors,  YCrCbOpts} from "./glibConstants";
import {Filters, FrameBuffer, Tiles} from "./glib";

export interface frameBuffer{
    getWidth():number
    getHeight():number
    setRawPixel(offset: number,color:number):FrameBuffer
    getRawPixel(offset: number ): number
    setPixelOff(offset :number, color:number ):FrameBuffer
    getPixelOff(offset: number):number
    setPixel( x:number, y:number, color :number ): FrameBuffer
    getPosition( offset :number ):frameBuilderDim
    getOffset(x:number, y:number ):number
    sizeof():number
    each( callback :Function ):FrameBuffer
    resetScreen( color: number, rgba:boolean ): FrameBuffer
    copy():ImageData
    setRgba( enabled: boolean )
    getRgba( ):boolean
    setBpp(bpp:number): FrameBuffer
    getBpp( ):number
    getBuffer():ImageData
    getUin32FrameBuffer( addAlpha: number ):Uint32Array
    line( type:boolean, y:number, color :number, returnedColorInt:boolean):Array<number>|FrameBuffer
    getLine(y:number, color :number, returnedColorInt:boolean) :Array<number>
    setLine(y:number, color:number, returnedColorInt:boolean):FrameBuffer
    rotate(degree:number, overflow:number, x:number, y:number ):FrameBuffer
    rot(degree:number, overflow:number, x:number, y:number ):FrameBuffer
    bind(xa: number, ya:number, xb:number, yb:number, color:number, opts:number ):FrameBuffer
    templateDraw():Object
    resize( width:number,height:number):FrameBuffer
    append( x:number, y:number, frameBuffer:FrameBuffer, overflow:number ):FrameBuffer
    tiles( options: Object ):Tiles
}
export interface graphicalUserInterface {
    getHandle():Object
    screen(type: string): number
    screen_x():number
    screen_y():number
    drawImage( image: HTMLImageElement ):void
    resize( width: number, height: number ):void
    getFrameBuffer():FrameBuffer
    refresh( frameBuffer: FrameBuffer )
}
export interface tiles {
    getOffsetX():number
    getOffsetY():number
    setOffsetX( value:number ):Tiles
    setOffsetY( value:number ):Tiles
    setAlpha( state:boolean  ):Tiles
    filter( functionCallback:predicationColors ):Tiles
    setMode( value:byte ):Tiles
    setOverflow( value:byte ):Tiles
    getBuffer():ImageData
    getAlpha( ):boolean
    setCenter( state:boolean ):Tiles
    getCenter():boolean
    setTile( x:number, y:number, sprite, color:number, background:number ):Tiles
    dimention( width:number, height:number ):void
    setTilesByOffset( offset:dword, tile :Array<number>|Uint32Array, color:number, background:dword ):Tiles
}
export interface filters {
    bitsGreyScale( bits:byte ):void
    YCrCb( opts: YCrCbOpts, p:float, q:float, r:float ):Filters|FrameBuffer
    YCrCbA( opts:YCrCbOpts  ):Filters|FrameBuffer
    median( dx:number, dy:number ):Filters
    negativeGrey( deep:byte ):FrameBuffer
    negativeColor( deep:byte ) :FrameBuffer
    thresholding(limit:byte ):void
}
