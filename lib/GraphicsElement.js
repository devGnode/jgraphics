

class GraphicsElement{
    // frame_layout
    #buffer = FrameBuffer.builder();
    //
    #parent = null;
    #child  = Array();
    //
    #x  = 0;
    #y  = 0;
    //
    #width  = 0;
    #height = 0;
    //
    #offsetX = 0;
    #offsetY = 0;
    //
    #padding = {left:0,top:0,right:0,bottom:0};
    #margin  = {left:0,top:0,right:0,bottom:0};
    #border  = {left:0,top:0,right:0,bottom:0};
    //
    #background = 0xffffff;
    //
    #precompiled = {};
    /***
     *
     * @param width  : number
     * @param height : number
     * @param parent : GraphicsElement
     */
    constructor(width = 1, height = 1, parent = null ) {
        this.#buffer = FrameBuffer.builder();
        this.#buffer.resize(width,height);
        this.#parent    = parent;
        this.#width     = width;
        this.#height    = height;
        this.setBackground(this.#background);
    }

    get width(){return this.#width; }

    get height(){return this.#height; }

    get x( ){ return this.#x; }

    get y( ){ return this.#y; }

    // outerWidth
    get computedWidth( ){ return this.width + this.#padding.left + this.#padding.right + this.#border.left + this.#border.right; }
    // outerHeight
    get computedHeight( ){ return this.height + this.#padding.top + this.#padding.bottom + this.#border.top + this.#border.bottom; }

    get innerWidth( ){ return this.width - (this.#padding.left + this.#padding.right + this.#border.left + this.#border.right); }

    get innerHeight( ){return this.height - (this.#padding.top + this.#padding.bottom + this.#border.top + this.#border.bottom); }

    get background( ){ return this.#background; }

    get parentHandle( ){return this.#parent;}

    get child(){ return this.#child;}

    resize( width = 0, height = 0 ){
        this.#buffer.resize(this.#width = width,this.#height= height);
        return this;
    }

    setPosition( x = 0, y = 0 ){
        this.#x = x;
        this.#y = y;
    }

    setX( x = 0){this.#x=x; return this}

    setY(y = 0){this.#y=y;return this}

    setParent( parent = null ){
        if(!this.#parent)this.#parent = parent;
        return this;
    }

    setBackground( color = 0x000000 ){
        this.#background = color;
        this.#precompiled.color = ()=>this.#buffer.resetScreen(color);
        return this;
    }

    setMargin(  left = 0, top = 0, right = 0, bottom = 0 ){
        if(left>-1)this.#margin.left       = left;
        if(top>-1)this.#margin.top         = top;
        if(right>-1)this.#margin.right     = right;
        if(bottom>-1)this.#margin.bottom   = bottom;
        this.resize( this.width + left + right, this.height + top + bottom );
        return this;
    }

    getMargin( value = null ){
        if(value===null) return this.#margin;
        else if(this.#margin[value]!==undefined)return this.#margin[value];
        return null;
    }

    setPadding( left = 0, top = 0, right = 0, bottom = 0 ){
        if(left>-1)this.#padding.left       = left;
        if(top>-1)this.#padding.top         = top;
        if(right>-1)this.#padding.right     = right;
        if(bottom>-1)this.#padding.bottom   = bottom;
        this.resize( this.width + left + right, this.height + top + bottom );
        return this;
    }

    getPadding( value = null ){
        if(value===null) return this.#margin;
        else if(this.#padding[value])return this.#padding[value];
        return null;
    }

    setBorder( left = 0, top = 0, right = 0, bottom = 0, color = 0xececec ){
        let max = Math.max(Math.max(left,right),Math.max(top,bottom)),
            w = left+right, h = top+bottom;

        this.#precompiled.border = ()=> {
            for(let i = 0; i<max;i++){
                if(top>0){
                    this.#buffer.bind(0,i, this.width,i,color);
                    --top;
                }
                if(bottom>0){
                    this.#buffer.bind(0,this.height-i-1, this.width,this.height-i,color);
                    --bottom;
                }
                if(right>0){
                    this.#buffer.bind(i,0, i,this.height-1,color);
                    --right;
                }
                if(left>0){
                    this.#buffer.bind(this.width-i,0, this.width-i-1, this.height,color);
                    --left;
                }
            }
        };
        this.#offsetX = parseInt(w/2);
        this.#offsetY = parseInt(h/2);
        this.resize(this.width+w,this.height+h)
        return this;
    }

    pack( ){
        // for now just pack element from X
        if(this.#child.length>0)
        this.#child.forEach(element=>{

            element.resize(
                this.width - ( this.#margin.left + this.#margin.right + element.getMargin("left") + element.getMargin("right")  ),
                element.height
            );
        });
    }

    getFrameBuffer(){ return this.#buffer;}

    render(){
        let tmp;
        for( tmp in this.#precompiled ) this.#precompiled[tmp]();
        if(this.#child.length >0)
        this.#child.forEach(element=>{
            element.render();
            this.#buffer.append(
                this.#offsetX + element.x + this.#padding.left + element.getMargin("left"),
                this.#offsetY + element.y + this.#padding.top  + element.getMargin("top"),
                element.getFrameBuffer(),
                0x00
            );
        });
        return this;
    }

    add(graphicsElement){
        this.#child.push(graphicsElement);
        graphicsElement.setParent(this);
        return this;
    }

    append( element = null, align = 0 ){
        let childHeight = 0;
        if(this.#child.length>=1)this.#child.forEach(element=>childHeight+=element.computedHeight);

        // if (marginX)+width > parentWidth => get Area of element width-marginX
        this.#child.push(element);
        element.setParent(this);
        element.setY( element.y + childHeight );

        return this;
    }

}
export default GraphicsElement;