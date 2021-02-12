import GraphicsElement from './GraphicsElement.js';
import KEYS_CP437 from "./cp437/KEYS_CP437.js";
/***
 * Graphical Text
 */
class GText extends GraphicsElement{

    // typo available
    static CP437_9_14 = 0x00;
    static CP437_9_16 = 0x01;
    static CP437_8_16 = 0x02;
    static CP437_8_8  = 0x04;
    //
    static INLINE   = 0x00;
    static PRE_WRAP = 0x01;

    #cp437    = new KEYS_CP437(GText.CP437_9_14);
    #char     = Array();
    #color    = 0x000001;
    #wrap     = 0x00;

    #target = "";

    constructor( value = "", color = 0x000001 ) {
        super( 1,1);
        // Resize buffer
        this.resize( this.#cp437.getOffsetX() * value.length, this.#cp437.getOffsetY() );
        this.#char = value.split("").map(value=>value.charCodeAt(0));
        this.#target= value;
        this.#color = color;
        this.setPosition(0,0);
        this.setBackground(0x000000);
    }

    get target(){return this.#target;}

    setColor( color = 0 ){ this.#color = color;return this;}

    setWrap( wrap = 0 ){this.#wrap = wrap&0xf;return this;}

    setFontFamily( family = GText.CP437_9_14 ){
        this.#cp437 = new KEYS_CP437(family);
        return this;
    }

    concat( value = "" ){
        return new GText( this.target+value )
            .setBackground(this.#color)
            .setWrap(this.#wrap)
            .setFontFamily(this.#cp437.id);
    }
    // disabled appender
    // in a text area
    append(){}

    render( ){
        let tile = this.getFrameBuffer()
                .tiles()
                .setOffsetX(this.#cp437.getOffsetX())
                .setOffsetY(this.#cp437.getOffsetY())
                .setOverflow(1)
                .setMode(3)
                .filter((offset,color)=>color>0),
            // overflow string split it
            spliter = Number.POSITIVE_INFINITY,
            syncX = 0, line = 0,tmp = 0;

        // frame overflow
        if( this.parentHandle.innerWidth - this.width < 0 && this.#wrap !== GText.INLINE ){
            spliter = parseInt(this.parentHandle.innerWidth/this.#cp437.getOffsetX()); // Max Character to displayed in the screen
            tmp = Math.round( (this.width/this.#cp437.getOffsetX()/spliter ) );
            tmp += tmp%2 === 1 ? 1 : 0;
            this.resize(  this.parentHandle.innerWidth, tmp*this.#cp437.getOffsetY() );
        }

        this.#char.forEach((char, index)=>{
            if(syncX===spliter){
                syncX = 0;
                line++;
            }
            tile.setTile(
                syncX * this.#cp437.getOffsetX(),    // X
                line  * this.#cp437.getOffsetY(),   // Y
                this.#cp437.getSpriteChar(char),      // sprite
                this.#color                         // color
            );
            syncX++;
        });
    }
}
/***
 * extenced String
 */
String.prototype.toGText = function( ){return new GText(this.valueOf()); };
export default GText;