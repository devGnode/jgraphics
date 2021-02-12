///<amd-module name='/lib/GOS/GMouse.js'/>
import {GObject} from "../GObject";
import {FrameBuffer} from "../glib/glib";
import {GImg} from "../components/GImg";

export class GMouse extends GObject{

    private static readonly INSTANCE:GMouse = new GMouse();

    // go to config
    private readonly mouse:Array<number> = [0xe9,0xe9,0xe9,0x5c,0xfc,0xfc,0xfc,0xee,0xf2,0xf2,0xf2,0x87,0x59,0x59,0x59,0x14,0x00,0x00,0x00,0x0b,0x00,0x00,0x00,0x08,0x00,0x00,0x00,0x05,0x00,0x00,0x00,0x03,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xf3,0xf3,0xf3,0x94,0xb9,0xb9,0xb9,0xff,0xd0,0xd0,0xd0,0xfe,0xf4,0xf4,0xf4,0xa7,0x64,0x64,0x64,0x1c,0x00,0x00,0x00,0x0e,0x00,0x00,0x00,0x09,0x00,0x00,0x00,0x06,0x00,0x00,0x00,0x04,0x00,0x00,0x00,0x02,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xf0,0xf0,0xf0,0x96,0xa1,0xa1,0xa1,0xff,0x29,0x29,0x29,0xff,0xba,0xba,0xba,0xff,0xf6,0xf6,0xf6,0xc2,0x8c,0x8c,0x8c,0x28,0x00,0x00,0x00,0x0f,0x00,0x00,0x00,0x0a,0x00,0x00,0x00,0x06,0x00,0x00,0x00,0x03,0x00,0x00,0x00,0x02,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xee,0xee,0xee,0x97,0xa0,0xa0,0xa0,0xff,0x1a,0x1a,0x1a,0xff,0x21,0x21,0x21,0xff,0x9f,0x9f,0x9f,0xff,0xf8,0xf8,0xf8,0xd7,0xae,0xae,0xae,0x39,0x00,0x00,0x00,0x10,0x00,0x00,0x00,0x0b,0x00,0x00,0x00,0x07,0x00,0x00,0x00,0x04,0x00,0x00,0x00,0x02,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xec,0xec,0xec,0x97,0xa1,0xa1,0xa1,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1e,0x1e,0x1e,0xff,0x87,0x87,0x87,0xff,0xfb,0xfb,0xfb,0xe5,0xbe,0xbe,0xbe,0x47,0x00,0x00,0x00,0x11,0x00,0x00,0x00,0x0b,0x00,0x00,0x00,0x07,0x00,0x00,0x00,0x04,0x00,0x00,0x00,0x02,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x00,0xed,0xed,0xed,0x98,0xa1,0xa1,0xa1,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x6a,0x6a,0x6a,0xff,0xf0,0xf0,0xf0,0xf6,0xd8,0xd8,0xd8,0x63,0x0e,0x0e,0x0e,0x12,0x00,0x00,0x00,0x0c,0x00,0x00,0x00,0x08,0x00,0x00,0x00,0x05,0x00,0x00,0x00,0x02,0x00,0x00,0x00,0x01,0xed,0xed,0xed,0x98,0xa0,0xa0,0xa0,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x56,0x56,0x56,0xff,0xea,0xea,0xea,0xf8,0xe4,0xe4,0xe4,0x7d,0x0d,0x0d,0x0d,0x13,0x00,0x00,0x00,0x0d,0x00,0x00,0x00,0x08,0x00,0x00,0x00,0x05,0x00,0x00,0x00,0x03,0xec,0xec,0xec,0x97,0xa1,0xa1,0xa1,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x41,0x41,0x41,0xff,0xdc,0xdc,0xdc,0xfc,0xec,0xec,0xec,0x97,0x3d,0x3d,0x3d,0x19,0x00,0x00,0x00,0x0e,0x00,0x00,0x00,0x09,0x00,0x00,0x00,0x05,0xed,0xed,0xed,0x98,0xa0,0xa0,0xa0,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x32,0x32,0x32,0xff,0xc9,0xc9,0xc9,0xff,0xf3,0xf3,0xf3,0xaf,0x71,0x71,0x71,0x22,0x00,0x00,0x00,0x0e,0x00,0x00,0x00,0x09,0xed,0xed,0xed,0x98,0xa1,0xa1,0xa1,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x29,0x29,0x29,0xff,0xb8,0xb8,0xb8,0xff,0xf7,0xf7,0xf7,0xc5,0x89,0x89,0x89,0x27,0x00,0x00,0x00,0x0d,0xed,0xed,0xed,0x98,0xa1,0xa1,0xa1,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1d,0x1d,0x1d,0xff,0x9a,0x9a,0x9a,0xff,0xf8,0xf8,0xf8,0xdd,0xc0,0xc0,0xc0,0x39,0xed,0xed,0xed,0x98,0xa1,0xa1,0xa1,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1c,0x1c,0x1c,0xff,0x83,0x83,0x83,0xff,0xfc,0xfc,0xfc,0xe6,0xec,0xec,0xec,0x97,0xa1,0xa1,0xa1,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x26,0x26,0x26,0xff,0x68,0x68,0x68,0xff,0xc7,0xc7,0xc7,0xf8,0xfb,0xfb,0xfb,0xcd,0xec,0xec,0xec,0x97,0xa0,0xa0,0xa0,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x29,0x29,0x29,0xff,0x8c,0x8c,0x8c,0xff,0xd8,0xd8,0xd8,0xe5,0xed,0xed,0xed,0x9f,0xc6,0xc6,0xc6,0x48,0x20,0x20,0x20,0x10,0xf0,0xf0,0xf0,0x96,0xa1,0xa1,0xa1,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0x3e,0x3e,0x3e,0xff,0xfd,0xfd,0xfd,0xf1,0x75,0x75,0x75,0x32,0x00,0x00,0x00,0x17,0x00,0x00,0x00,0x10,0x00,0x00,0x00,0x0b,0xf1,0xf1,0xf1,0x95,0xa3,0xa3,0xa3,0xff,0x2f,0x2f,0x2f,0xff,0x4e,0x4e,0x4e,0xff,0x85,0x85,0x85,0xff,0xbc,0xbc,0xbc,0xf7,0xa2,0xa2,0xa2,0xff,0x1d,0x1d,0x1d,0xff,0x1a,0x1a,0x1a,0xff,0x1b,0x1b,0x1b,0xff,0xef,0xef,0xef,0xff,0x9b,0x9b,0x9b,0x38,0x00,0x00,0x00,0x13,0x00,0x00,0x00,0x0c,0x00,0x00,0x00,0x07,0xed,0xed,0xed,0x72,0xeb,0xeb,0xeb,0xff,0xe1,0xe1,0xe1,0xe7,0xf4,0xf4,0xf4,0xb3,0xdd,0xdd,0xdd,0x78,0xac,0xac,0xac,0x4a,0xf5,0xf5,0xf5,0xce,0x7f,0x7f,0x7f,0xff,0x1a,0x1a,0x1a,0xff,0x1a,0x1a,0x1a,0xff,0xc1,0xc1,0xc1,0xff,0xda,0xda,0xda,0x68,0x00,0x00,0x00,0x10,0x00,0x00,0x00,0x0a,0x00,0x00,0x00,0x06,0x5b,0x5b,0x5b,0x0e,0xc9,0xc9,0xc9,0x2f,0x84,0x84,0x84,0x1d,0x1b,0x1b,0x1b,0x13,0x00,0x00,0x00,0x13,0x00,0x00,0x00,0x16,0x97,0x97,0x97,0x36,0xf6,0xf6,0xf6,0xe9,0x5c,0x5c,0x5c,0xff,0x1a,0x1a,0x1a,0xff,0x8f,0x8f,0x8f,0xff,0xf0,0xf0,0xf0,0x9b,0x00,0x00,0x00,0x0f,0x00,0x00,0x00,0x09,0x00,0x00,0x00,0x05,0x00,0x00,0x00,0x05,0x00,0x00,0x00,0x07,0x00,0x00,0x00,0x08,0x00,0x00,0x00,0x09,0x00,0x00,0x00,0x0b,0x00,0x00,0x00,0x0e,0x00,0x00,0x00,0x11,0xd1,0xd1,0xd1,0x54,0xeb,0xeb,0xeb,0xf8,0x48,0x48,0x48,0xff,0x88,0x88,0x88,0xff,0xfa,0xfa,0xfa,0xc5,0x00,0x00,0x00,0x0c,0x00,0x00,0x00,0x07,0x00,0x00,0x00,0x04,0x00,0x00,0x00,0x02,0x00,0x00,0x00,0x03,0x00,0x00,0x00,0x04,0x00,0x00,0x00,0x05,0x00,0x00,0x00,0x06,0x00,0x00,0x00,0x08,0x00,0x00,0x00,0x0b,0x00,0x00,0x00,0x0e,0xef,0xef,0xef,0x7d,0xf0,0xf0,0xf0,0xfa,0xf4,0xf4,0xf4,0xc2,0xe1,0xe1,0xe1,0x4c,0x00,0x00,0x00,0x09,0x00,0x00,0x00,0x06,0x00,0x00,0x00,0x03];
    private frame:FrameBuffer;
    private load:boolean = false;

    constructor() {
        super(15,20);
        this.frame =  FrameBuffer.builder(this.mouse,{x:15,y:20});
    }

    loadImg( gImg: GImg ):GMouse{
        let tmp = gImg.render().getFrameBuffer();
        this.resize(tmp.width,tmp.height);
        this.frame = FrameBuffer.builder(tmp.copy(),{x:tmp.width,y:tmp.height});
        this.load=false;
        this.render();
        return this;
    }

    render(): GObject {
        if(this.load) return this;
        this.getFrameBuffer().append(0,0, this.frame,0);
        this.load=true;
        return this;
    }

    public static getInstance():GMouse{ return this.INSTANCE; }
}