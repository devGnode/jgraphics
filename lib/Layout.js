class Layout{

    static CENTER   = 0x00;
    static LEADING  = 0x01;
    static LEFT     = 0x02;
    static RIGHT    = 0x04;
    static TRAILING = 0x08;

    #Hgap = 0;
    #Vgap = 0;
    #align= Layout.LEFT;

    constructor(hgap = 0, vgap = 0, align = Layout.LEFT) {
        this.#Hgap = hgap;
        this.#Vgap = vgap;
        this.#align= align;
    }

    setHgap( gap = 0 ){this.#Hgap=gap;}

    setVgap( gap = 0 ){this.#Vgap=gap;}

    getHgap( ){return this.#Hgap;}

    getVgap(){return this.#Vgap;}

    setAlign( align = Layout.LEFT ){ this.#align = align;}

    getAlign( ){ return this.#align;}

    add(parent,child){
        if(!(parent instanceof  GraphicsElement)) throw new Error("Bad cast "+(parent.constructor.name)+"to GraphicsElement");
        if(!(child instanceof  GraphicsElement)) throw new Error("Bad cast "+(child.constructor.name)+"to GraphicsElement");
    }

}
export default Layout;