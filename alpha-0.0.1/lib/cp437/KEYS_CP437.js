import CP437 from "./CP437.js";

class KEYS_CP437{
    // Available code page
    static CP437_9_14 = "CP_437_9x14";
    static CP437_9_16 = "CP_437_9x16";
    static CP437_8_16 = "CP_437_8x16";
    static CP437_8_8  = "CP_437_8x8";

    #id         = 0x00;
    #value      = "CP_437_9x14";
    #codePage   = [0,0];

    constructor( family = 0) {
        switch (family) {
            case 0x04: this.#codePage = [8,8]; break;
            case 0x02: this.#codePage = [8,16]; break;
            case 0x01: this.#codePage = [9,16]; break;
            case 0x00:
            default:
                this.#codePage = [9,14]; break;
        }
        this.#id = family;
    }

    get id(){return this.#id;}

    getOffsetX( ){return this.#codePage[0];}

    getOffsetY(){return this.#codePage[1];}

    getSpriteChar( char = 0x00 ){return CP437[this.#value][char]||new Array(this.getOffsetX()*this.getOffsetY()).fill(0);}
}
export default KEYS_CP437;