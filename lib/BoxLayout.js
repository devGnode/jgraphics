import Layout from "./Layout.js";

class BoxLayout extends Layout{

    #offsetY= 0;

    constructor( hgap = 0, vgap = 0, align = BoxLayout.CENTER) {
        super(hgap,vgap,align);
    }

    add(parent,child){
        super.add(parent,child);
        let wrap = new GraphicsElement(child.width,child.height);
        wrap.setBackground(0)
            .setPadding(this.getHgap(),this.getVgap(),this.getHgap(),this.getVgap())
            .append(child)
            .setParent(parent)
            .setY( this.#offsetY );
        /***
         * Alignment
         * LEFT == 0 => default
         */
        if( wrap.width<parent.width && this.getAlign() === BoxLayout.CENTER ) wrap.setX( parseInt((parent.width-wrap.width)/2) );
        if( wrap.width<parent.width && this.getAlign() === BoxLayout.RIGHT )wrap.setX( parseInt((parent.width-wrap.width-this.getHgap()*1)) ); // -------- *1 ??

        this.#offsetY+= child.computedHeight+(this.getVgap()*2);
        parent.pack();

        if(this.getAlign() ===BoxLayout.LEADING)child.pack();
        return wrap;
    }

}
export default BoxLayout;