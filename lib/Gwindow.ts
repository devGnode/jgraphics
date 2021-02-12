///<amd-module name='/lib/GWindow.js'/>
import {GObject, Map} from "./GObject";
import {BoxLayout} from "./layout/BoxLayout";
import {GText} from "./components/GText";
import {Pane} from "./Pane";
import {COMPONENT_ALIGN, LayoutComponent} from "./layout/LayoutComponent";
import {GProcessManager} from "./GProcessManager";
import {GButton} from "./components/GButton";
import {FlowLayout} from "./layout/FlowLayout";
import {BorderLayout} from "./layout/BorderLayout";
import {GImg} from "./components/GImg";

export abstract class GFrame{
    protected window:GObject  = new GObject(50,50);
    protected mounted:boolean = false;

    protected constructor() {}

    isMounted():boolean{ return this.mounted;}
}
export class GWindow extends GFrame{

    private Title:string = "Message Box : CubiX centOs";
    private hText:GText;
    private widget:Pane;
    private icon:GImg;

    constructor() {super();}

    setTitle( title:string ):GWindow{
        if(!this.isMounted()) this.Title = title;
        else {
            this.hText.update(title);
            this.window.render();
            /****
             * @refreshAll
             */
            GProcessManager.getInstance().render(null);
        }
        return this;
    }

    get innerWidth():number{ return this.widget.innerWidth; }

    get innerHeight():number{return this.widget.innerHeight; }

    maximize():void{
        this.window.resize(800,600);
        this.window.render();
    }

    setIconImg( gImg: GImg ):void{
            if(gImg.width>20||gImg.height>20) throw new Error("GWindow : icon must have 20x20 size");
            this.icon = gImg;
    }

    setLayout( layout:LayoutComponent ):void{
        this.render();
        this.widget.setLayout(layout);
    }

    add( component:GObject, align?:COMPONENT_ALIGN ):void{
        if(!this.isMounted()) throw new Error("GWindow : No layout is set up")
        this.widget.add(component,align);
    }

    setPosition( x:number, y:number ):void{
        this.window.setX(x||0).setY(y||0);
    }

    getPosition(  ):Map<string,number>{
        return {x:this.window.x, y:this.window.y}
    }

    setDimension(width:number, height:number ):void{
        this.window.resize(width,height);
    }

    getDimension(  ):Map<string,number>{
        return {width:this.window.computedWidth, height:this.window.computedHeight}
    }

    setPreferredDimensions( width:number, height:number ):void{
        this.window.setPreferenceWidth(width).setPreferenceHeight(height);
    }
    
    show():void{
        this.window.render();
        GProcessManager.getInstance().newInstance(this);
        //GProcessManager.getInstance().render({offsetX:10, offsetY: 10});
    }

    getFocus( ):void{
    }

    //0xcd5c5c
    render():GObject{
        if(this.isMounted()) return this.window;
        let wrap :Pane, header = new Pane(), body = new Pane(),
            gt : GText = new GText(this.Title).setColor(0x505050);
        this.window
            //
            .setBackground(0xc0c0c0) // --> Background
            .setBorder(1,1,1,1,0x729c9b)
            .setPadding(0,0,0,1);
        wrap = new Pane().setLayout(new BoxLayout(0,0,BoxLayout.LEFT));
        wrap.resize(this.window.innerWidth, this.window.innerHeight).setBackground(0);

        // Button Close - hide
        let button:Pane= new Pane().setLayout( new FlowLayout(0,0,FlowLayout.LEFT) );
        button.resize(50,25 ).setPreferenceWidth(50);
        button.add(new GObject(25,25).setBackground(0).add(new GButton("_",25).setPadding(1,1).setBackgroundGradient( 0x6495ed, 0xffffff)))
              .add(new GObject(25,25).setBackground(0).add(new GButton(".",25).setPadding(1,1).setBackgroundGradient(0xfdb9b9,0xff0000)));

        (<Pane>header.resize(this.window.width,25)
            .setBackgroundGradient(0xffffff,0xe0e0e0)
            .setBorder(0,0,0,1,0x00bfff))
            .setLayout(new BorderLayout(0,0));
        // icon
        if(this.icon)header.add(new GObject(25,25).setBackground(0).setPadding(4,4).add(this.icon).setPreferenceWidth(25), BorderLayout.WEST);
        header
            .add(new GObject(this.window.width-75,25).setBackground(0).setPadding(5,5).add(gt), BorderLayout.CENTER)
            .add(button, BorderLayout.EAST);

        body.resize(wrap.innerWidth,this.window.height - header.computedHeight ).setBackground(0xececec);
        wrap.add(header).add(body);
        //
        this.widget = body;
        this.hText  = gt;
        this.window.add(wrap).render();
        this.mounted=true;

        return this.window;
    }
}