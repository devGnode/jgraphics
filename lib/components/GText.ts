///<amd-module name='/lib/components/GText.js'/>
import {PAGE_CODE,KEYS_CP437} from "../cp437/KEYS_CP437";
import {GObject} from "../GObject";

export class GText extends GObject{

    // typo available
    public static readonly CP437_9_14:PAGE_CODE = PAGE_CODE.CP437_9_14;
    public static readonly CP437_9_16:PAGE_CODE = PAGE_CODE.CP437_9_16;
    public static readonly CP437_8_16:PAGE_CODE = PAGE_CODE.CP437_8_16;
    public static readonly CP437_8_8:PAGE_CODE  = PAGE_CODE.CP437_8_8;
    //
    public static readonly INLINE   = 0x00;
    public static readonly PRE_WRAP = 0x01;

    private cp437    = new KEYS_CP437(GText.CP437_9_14);
    private char:Array<number>     = Array<number>();
    private color:number           = 0x000001;
    private wrap:number            = 0x00;

    private Target:string = "";

    constructor( value = "", color = 0x000001 ) {
        super(1, 1);
        this.mount(value,color);
    }

    private mount(value = "", color = 0x000001, length:number = -1):void{
        this.resize(this.cp437.getOffsetX() * value.length, this.cp437.getOffsetY());
        this.char = value.split("").map(value => value.charCodeAt(0));
        this.Target = value;
        this.color = color;
        this.setPosition(0, 0);
        this.setBackground(0x000000);
    }

    get target():string{return this.Target;}

    setColor( color:number = 0 ):GText{ this.color = color;return this;}

    setWrap( wrap:number = 0 ):GText{this.wrap = wrap&0xf;return this;}

    setFontFamily( family: PAGE_CODE = GText.CP437_9_14 ):GText{
        this.cp437 = new KEYS_CP437(family);
        this.resize(this.cp437.getOffsetX() * this.Target.length, this.cp437.getOffsetY());
        return this;
    }

    concat( value:string = "" ): GText{
        return new GText( this.Target+value )
            .setBackground(this.color)
            // @ts-ignore
            .setWrap(this.wrap)
            .setFontFamily(this.cp437.id);
    }
    // disabled appender
    // in a text area
    appendText(value:string):GText{  this.mount(this.Target+=value); return this;}

    update(value:string):GText{ this.mount(this.Target=value); return this; }

    render( ): GText{
        let print:boolean=true,tile = this.getFrameBuffer()
                // @ts-ignore
                .tiles()
                .setOffsetX(this.cp437.getOffsetX())
                .setOffsetY(this.cp437.getOffsetY())
                .setOverflow(1)
                .setMode(3)
                .filter((offset,color)=>color>0),
            // overflow string split it
            spliter:number = Number.POSITIVE_INFINITY,
            syncX:number = 0, line:number = 0,tmp:number = 0;

        // frame overflow
        if( this.parentHandle.innerWidth - this.width <= 0 && this.wrap !== GText.INLINE ){
            spliter = parseInt(String( this.parentHandle.innerWidth/this.cp437.getOffsetX() )); // Max Character to displayed in the screen
            tmp = Math.round( (this.width/this.cp437.getOffsetX()/spliter ) );
            tmp += tmp%2 === 1 ? 1 : 0;
            this.Target.replace( /\n|\r\n/gi, find=>{  tmp++; return find; });
            this.resize(  this.parentHandle.innerWidth, tmp*this.cp437.getOffsetY() );
        }

        this.char.forEach((char:number, index:number)=>{
            if(syncX===spliter|| char === 10 ){
                syncX = 0;
                line++;
            }
            if(this.wrap !== GText.PRE_WRAP&&(syncX+3)*this.cp437.getOffsetX()>this.parentHandle.innerWidth&&syncX+3<this.Target.length)char=46;
            if((line>0&&syncX===1&&char===32) || ( char === 10||char === 13  ) ) {
                print=false;
                --syncX;
            }

            if(print) {
                tile.setTile(
                    syncX * this.cp437.getOffsetX(),    // X
                    line * this.cp437.getOffsetY(),   // Y
                    this.cp437.getSpriteChar(char),      // sprite
                    this.color                         // color
                );
                syncX++;
            }
            print=true;
        });
        return null;
    }
}