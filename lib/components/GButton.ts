///<amd-module name='/lib/components/GButton.js'/>
import {GObject} from "../GObject";
import {Pane} from "../Pane";
import {BoxLayout} from "../layout/BoxLayout";
import {GText} from "./GText";

export class GButton extends GObject{

    private color:number = 0xFFFFFF;
    private gTxt: GText;
    private value: GText;

    constructor( value:string = "Ok", width:number = 65, height?: number ) {
        super(width,height||25);
        this.setBackground(0x00bfff);
        this.setPadding(0,5);
        let pane = new Pane();
        pane.setLayout(new BoxLayout(0,0,BoxLayout.CENTER))
        pane.resize(width,height||25);

        this.setBorder(1,1,1,1,0x6f6f6f);
        this.append(pane.add( this.gTxt = new GText(value,this.color) ));
    }

    setColor( color:number ):GButton{
        this.gTxt.setColor(this.color = color);
        return this;
    }

    setValue( value:string ):GButton{
        this.gTxt.setColor(this.color).update(value);
        return this;
    }

}