///<amd-module name='/lib/cp437/KEYS_CP437.js'/>
import {CP437} from "./CP437";

export type Byte = number;
export type TCP477 = "CP_437_9x14"|"CP_437_9x16"|"CP_437_8x16"|"CP_437_8x8";

export enum PAGE_CODE{
    CP437_9_14 = 0x00,
    CP437_9_16 = 0x01,
    CP437_8_16 = 0x02,
    CP437_8_8  = 0x04
}

export class KEYS_CP437 {
    // Available code page
    public static readonly CP437_9_14: TCP477 = "CP_437_9x14";
    public static readonly CP437_9_16: TCP477 = "CP_437_9x16";
    public static readonly CP437_8_16: TCP477 = "CP_437_8x16";
    public static readonly CP437_8_8: TCP477  = "CP_437_8x8";

    private readonly idF:PAGE_CODE           = 0x00;
    private readonly value:TCP477            = "CP_437_9x14";
    private readonly codePage:Array<number>  = [0,0];

    constructor( family:PAGE_CODE = 0x00) {
        switch (family) {
            case 0x04: this.codePage = [8,8]; this.value = KEYS_CP437.CP437_8_8; break;
            case 0x02: this.codePage = [8,16]; this.value = KEYS_CP437.CP437_8_16; break;
            case 0x01: this.codePage = [9,16]; this.value = KEYS_CP437.CP437_9_16; break;
            case 0x00:
            default:
                this.codePage = [9,14]; this.value = KEYS_CP437.CP437_9_14; break;
        }
        this.idF = family;
    }

    get id(){return this.idF;}

    getOffsetX( ){return this.codePage[0];}

    getOffsetY(){return this.codePage[1];}

    getSpriteChar( char = 0x00 ){return CP437[this.value][char]||new Array(this.getOffsetX()*this.getOffsetY()).fill(0);}
}