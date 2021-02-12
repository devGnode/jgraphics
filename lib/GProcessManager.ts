///<amd-module name='/lib/GProcessManager.js'/>
import {GWindow} from "./Gwindow";
import {GObject,Map} from "./GObject";
import {FrameBuffer} from "./glib/glib";
import {GMouse} from "./GOS/GMouse";

export class GProcessManager {

    private static readonly INSTANCE:GProcessManager = new GProcessManager();

    private monitor:FrameBuffer;
    private windows:Array<GWindow> = new Array<GWindow>();
    private currentTarget:GWindow;

    // go to config
    private readonly hMouse:GMouse = GMouse.getInstance();

    mock;
    constructor () {
    }

    newInstance( window: GWindow ):GProcessManager{
        this.windows = [this.currentTarget = window].concat( this.windows );
        return this;
    }

    getCurrentTarget( ):GWindow{
        return this.currentTarget;
    }

    setMock(mock):GProcessManager{
        this.mock=mock;
        return this;
    }

    render( e: any ):void{
        let pos:Map<string,number>;

        this.monitor = FrameBuffer.builder(null,{x:1024,y:768});
        [].concat(this.windows).reverse().forEach(value=>{
            pos=value.getPosition();
           this.monitor.append(pos.x,pos.y, value.render().getFrameBuffer(),0);
        });
       // this.monitor.append(e.offsetX-50,e.offsetY-5, this.currentTarget.render().getFrameBuffer(),0);
        // MOCK
        this.mock.refresh(this.monitor.append(this.hMouse.x,this.hMouse.y+10, this.hMouse.render().getFrameBuffer(),0));

    }

    clickManaging(e: Map<string, any>):void{
        let value:GWindow, index:number= 0;
        let d:any, p:any,a:boolean=false;
        while( (value = this.windows[index]) ){
            d = value.getDimension();
            p = value.getPosition();
            console.log(index, "clickManaging = => ",p, d, d.width+p.x);
            if(e.offsetX>=p.x && e.offsetX <  d.width+p.x && e.offsetY>= p.y && e.offsetY < d.height+p.y ){
                    console.log("oooooooooooooooooooooooooui");
                if(index==0)break;
                if(!a){
                    this.getFocus(index,value);
                    break;
                }
            }
            index++;
        }
        console.log(this.windows[0])
        this.render(e);
    }

    public displacement( e: MouseEvent, s:number = 0 ):void{
        console.log("dispalement ", e.offsetX, this.windows[0].getPosition(), e.offsetX+(e.offsetX-this.windows[0].getPosition().x), (e.offsetX-this.windows[0].getPosition().x) )
        console.log(s)
        this.windows[0].setPosition(e.offsetX-s, e.offsetY);
    }

    public getFocus( to:number, target:GWindow ):void{
        if(target===null)throw new Error('Window Handle is null !');
        if(to===null) to= this.windows.indexOf(target);
        this.windows =
            [target].concat(this.windows
            .slice(0,Math.abs(to))
            .concat(this.windows.slice( ( to<0? this.windows.length-to:to )+1, this.windows.length)));
    }

    public remove( target:GWindow ):void{
        if(target===null)throw new Error('Window Handle is null !');
        let to:number= this.windows.indexOf(target);
        this.windows = this.windows
                .slice(0,Math.abs(to))
                .concat(this.windows.slice( ( to<0? this.windows.length-to:to )+1, this.windows.length));
    }

    public static getInstance():GProcessManager{return this.INSTANCE;}
}