///<amd-module name='/lib/layout/FlowLayout.js'/>
import {COMPONENT_ALIGN, LayoutComponent} from "./LayoutComponent";
import {GObject} from "../GObject";

export class FlowLayout extends LayoutComponent {

    private offsetY: number = 0;
    private offsetX: number = 0;
    private greater: number = 0;

    constructor(hgap: number = 0, vgap: number = 0, align: COMPONENT_ALIGN = FlowLayout.CENTER) {
        super(hgap, vgap, align);
    }

    add(parent: GObject, child: GObject):GObject {
        super.add(parent,child);
        let wrap = new GObject(child.computedWidth,child.computedHeight);
        wrap.setBackground(0)
            .setPadding(this.getHgap(),this.getVgap(),this.getHgap(),this.getVgap())
            .append(child)
            .setParent(parent)
            .setY(this.offsetY)
            .setX(this.offsetX);
        /***
         * Alignment
         * LEFT == 0 => default
         */
        if( wrap.width<parent.width && this.getAlign() === FlowLayout.CENTER ){
            wrap.setX( Math.floor((parent.width-wrap.width)/2) ); //  -this.offsetX
        }
        if( wrap.width<parent.width && this.getAlign() === FlowLayout.RIGHT ){
            wrap.setX( Math.floor((parent.width-wrap.width-this.getHgap())-this.offsetX) );
        }

        // add parent padding
        if( this.offsetX+child.computedWidth  > parent.computedWidth ){
            wrap.setX(this.offsetX = 0).setY(this.offsetY += this.greater);
            this.greater = 0;
        }
        if(child.computedHeight+(this.getVgap()*2)>this.greater)this.greater = child.computedHeight+(this.getVgap()*2);
        this.offsetX+= child.computedWidth+(this.getHgap()*2);
        //parent.pack();
        if(this.getAlign() ===FlowLayout.LEADING)child.pack();

        return wrap;
    }
}