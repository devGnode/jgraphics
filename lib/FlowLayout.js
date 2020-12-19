import Layout from "./Layout.js";

class FlowLayout extends Layout{

    #offsetY= 0;
    #offsetX= 0;
    #greater=0;

    constructor( hgap = 0, vgap = 0, align = FlowLayout.CENTER ) {
        super(hgap,vgap,align);
    }

    add(parent,child){
        super.add(parent,child);
        let wrap = new GraphicsElement(child.width,child.height);
        wrap.setBackground(0)
            .setPadding(this.getHgap(),this.getVgap(),this.getHgap(),this.getVgap())
            .append(child)
            .setParent(parent)
            .setY(this.#offsetY)
            .setX(this.#offsetX);
        /***
         * Alignment
         * LEFT == 0 => default
         */
        if( wrap.width<parent.width && this.getAlign() === FlowLayout.CENTER ) wrap.setX( parseInt((parent.width-wrap.width)/2) );
        if( wrap.width<parent.width && this.getAlign() === FlowLayout.RIGHT )wrap.setX( parseInt((parent.width-wrap.width-this.getHgap()*1)) ); // ------> * 1  ??

        // add parent padding
        if( this.#offsetX+child.computedWidth  > parent.computedWidth ){
            wrap.setX(this.#offsetX = 0).setY(this.#offsetY += this.#greater);
            this.#greater = 0;
        }
        if(child.computedHeight+(this.getVgap()*2)>this.#greater)this.#greater = child.computedHeight+(this.getVgap()*2);
        this.#offsetX+= child.computedWidth+(this.getHgap()*2);
        //parent.pack();
        if(this.getAlign() ===FlowLayout.LEADING)child.pack();

        return wrap;
    }

}
export default FlowLayout;