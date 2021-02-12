///<amd-module name='/lib/Pane.js'/>
import {GObject} from "./GObject";
import {BoxLayout} from "./layout/BoxLayout";
import {COMPONENT_ALIGN, LayoutComponent} from "./layout/LayoutComponent";

export class Pane extends GObject{

    private layout:LayoutComponent = new BoxLayout();

    constructor( ) {
        super(1,1);
        this.setBackground(0);
    }

    setLayout( layout:LayoutComponent = null ):Pane{
        this.layout = layout;
        return this;
    }

    add( graphicsElement:GObject, align:COMPONENT_ALIGN = LayoutComponent.CENTER ):Pane{ super.add(this.layout.add(this,graphicsElement,align)); return this;}
}