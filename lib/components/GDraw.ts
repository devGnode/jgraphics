///<amd-module name='/lib/components/GDraw.js'/>
import {GObject} from "../GObject";
import {FrameBuffer} from "../glib/glib";

export class GDraw extends GObject{

    constructor( file:string, width:number, height:number) {
        super(width,height);
        super.resize(width,height);
        this.setBorder(1,1,1,1,0x010101).setBackground(0x00);
    }

    render( ):GDraw{
        let t:any;
        (t=this.getFrameBuffer().resetScreen(0x00FFaa).templateDraw()).arc(50,50,8)//.arc(50,50,2).arc(50,50,1);
        let len:number= 6;
        for( ; len>1;len--){
            t.arc(50,50,len, 0x6181ff);
        }
        return null;
    }

}