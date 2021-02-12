///<amd-module name='/lib/layout/BoxLayout.js'/>
import {COMPONENT_ALIGN, LayoutComponent} from "./LayoutComponent";
import {GObject} from "../GObject";

export class BoxLayout extends LayoutComponent{

    private offsetY:number = 0x00;

    constructor(hgap:number = 0, vgap:number = 0, align:COMPONENT_ALIGN = BoxLayout.CENTER) {
        super(hgap,vgap,align);
    }

    add(parent:GObject,child:GObject):GObject{
        super.add(parent,child);
        let wrap = new GObject(child.computedWidth,child.computedHeight);
        (<any>wrap).s = child.width;
        wrap.setBackground(0)
            .setPadding(this.getHgap(),this.getVgap(),this.getHgap(),this.getVgap())
            .append(child)
            .setParent(parent)
            .setY( this.offsetY )
         //   .setBackground(0x00aaff);
        /***
         * Alignment
         * LEFT == 0 => default
         */
        if( wrap.width<parent.width && this.getAlign() === BoxLayout.CENTER ) wrap.setX( Math.floor((parent.width-wrap.width)/2) );

        if( wrap.width<parent.width && this.getAlign() === BoxLayout.RIGHT )wrap.setX( Math.floor(parent.width-wrap.width-this.getHgap() ) ); // -------- *1 ??

        this.offsetY+= child.height+(this.getVgap()*2);
        parent.pack();

        console.log("BOXLAYOUT", wrap, this )
        if(this.getAlign()===BoxLayout.LEADING)child.pack();
        return wrap;
    }

}
