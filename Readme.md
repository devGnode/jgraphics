# GUI 


## GraphicalUserInterface

Canvas wrapping class.

- constructor( opts ) : GraphicalUserInterface

ReadOnly Getter : 

- `screenX` : canvas width value

- `screenY` : canvas height value

Setter : 

- `setScreenX( width : number ) : void`

- `setScreenY( height : number ) : void`

Method :

- `getHandle() : DOMHtmlCanvas`

- `screen( type : string ) : number` \: Type can be "x" or 'y' value.

- `screen_x() : number`

- `screen_y() : number`

- `drawImage( dom : ImageDomElement ) : void`

- `snapshot( ) : StringImageBase64Url`

- `getFrameBuffer() : FrameBuffer`

- `refresh( frameBuffer : FrameBuffer ) : void`

## FrameBuffer 

- constructor( opts ) : FrameBuffer

ReadOnly Static : 

- `RESET_BACKGROUND` : default value `0xFF000000`
- `BITS_PER_PIXEL` :  default value `0x04`, 4 bytes peer pixel => rgbA

Static Method : 

- `intToRgb( color : number ) : RgbObject {r,g,b} `  :
- `builder( opts, dimension ) : FrameBuffer`

Getter : 

- `width`

- `height`

Method : 

- `width( ) : number`

- `height( ) : number`

- `setRawPixel( offset : number, color : number ) : void ` : How calc offset => `( ( y * width ) * x ) * bpp`

- `getRawPixel( offset : number ) : number`

- `setPixelOff( offset : number ) : void` : How calc offset => `( ( y * width ) * x )`

- `getPixelOff( offset : number ) : number`

- `setPixel( x : number, y : number, color : number ) :void`

- `getPixel( x : number, y : number ) : number`

- `getPosition( offset : number ) : Point` : Convert an offset address to point (X,Y) to an object.

- `getOffset( x :number, y : number ) :number` : Convert point (X,Y) to an offset.

- `sizeOf() : number` : return size of the framebuffer in bytes.

- `copy() : ImageData`  : Get copy of the FrameBuffer

- `resize( width : number, height : number ) : FrameBuffer`
 
- `getBuffer() : ImageData` : get current FrameBuffer

- `getUin32FrameBuffer() : Uint32Array`

- `append( x : number, y : number, framebuffer : FrameBuffer, overflow : number ) : FrameBuffer`

- `each( callback : lambda ) : void`  : callback prototype ( offset &rarr; `( ( y * width ) * x )`, color32bits, RgbObject, x, y )

- `line( type : boolean, y : number, color : number = FrameBuffer.RESET_BACKGROUND, returnedColorInt : boolean ) : FrameBuffer | Array | Uint32Array`

- `getLine(y : number, returnedColorInt : boolean = false ) : Array<number> | Uint32Array`

- `setLine(y : number, color: number, returnedColorInt = false ) : FrameBuffer`

- `setLine( y : number, color : number = FrameBuffer.RESET_BACKGROUND ) : FrameBuffer`

- `rotate( degree : number, overflow : number ) : FrameBuffer`  : Oveflow value is color to overflow square

- `bind( xa : number, ya : number, xb : number, yb : number, color : number ) : FrameBuffer`


## Tiles

- constructor( \[ opts : Object, void \] ) : Tiles

````json
{
  "offsetTilesX" : number,
  "offsetTilesY" : number,
  "center" : boolean,
  "mod" : number,
  "alpha" : number,
  "palette": Array<Number>
  "filter" : PredicationCallBack,
  "overflow" : number
}
````

- `getBuffer() : Array` : from opts

- `getOffsetX() : number`

- `getOffsetY() : number` 

- `setOffsetX( value : number ) : Tiles`

- `setOffsetY( value : number ) : Tiles`

- `filter( predication : Predication ) : Tiles`

PredicationCallback prototype : ( color : number ) : boolean

- `setMode( mode : number ) : Tiles`

- `setOverflow( state : boolean ) : Tiles`

- `setCenter( state : boolean ) : Tiles`

- `getCenter( ): boolean `

- `setTile( x: number, y: number, sprite : Array<Number> [, color : number, background : number ] ) : Tiles`

- `setTilesByOffset( offset : number, sprite : Array<Number> [, color : number, background : number ] ) : Tiles`

## Filters

**public Filter extends FrameBuffer**

- constructor( opts ) : Filters

Methods :

- `bitsGreyScale( bits : number = 0x01 ) : void` 
  
 Algorithm applied on each pixel &rarr; `( ( ( r + g + b ) / 3 ) /  ( 255 / bits  + 0.5 )  ) * ( 255 / bits )`, bits > 0 & bits <= 255, 
 if bits is equals to 2, image date will be in black and white.

- `YCrCb( opts : object,  p : number = .2126, q : number = .7152, r : number = .0722 ) : void` : 

````json
{
  "greyscale" : boolean,
  "r" : boolean,
  "g" : boolean,
  "b" : boolean,
}
````

If `greycscale` property is at true not obligatory to define `rgb` properties.

- `YCrCbA( opts : Object ) : void`

- `negativeColor( deep : number ) : void`

- `negativeGrey( deep : number = 0xFF ) : void` :
 
Convert each pixel in greyscale like `bitsGreyScale` method, and then apply negative algorithm

- `median( dx : number, dy : number ) : void` : 

Examples : \[3,1\] - \[3,3\] - \[5,3\] - \[7,7\]

- `thresholding( limit : number ) : void`

- `sobel( ) : void`