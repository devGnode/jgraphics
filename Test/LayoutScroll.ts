///<amd-module name='/Test/LayoutScroll.js'/>
import {GWindow} from "../lib/Gwindow";
import {BoxLayout} from "../lib/layout/BoxLayout";
import {GText} from "../lib/components/GText";
import {GObject} from "../lib/GObject";
import {DFT_ICON, GImg} from "../lib/components/GImg";
import {GScroll} from "../lib/components/GScroll";

/****
 * TEST - RELEASE-1.0.0
 *
 */
export class LayoutScroll extends GWindow{

    // mock
    private readonly gScroll:GScroll;

    constructor(argc:number, argv: string[]) {
        super();

        this.setDimension(500,350);
        this.setPosition(50,50);
        this.setTitle("Scroll Test");
        this.setIconImg(new GImg(null).loadIcon(DFT_ICON.GALERT));

        this.setLayout(new BoxLayout(0,0, BoxLayout.LEFT));
        this.gScroll = new GScroll(new GObject(this.innerWidth*2,this.innerHeight*3 ).setBackground(0x292d3e).add(new GText("gsdqsd dsqdsq dsqsdsd sd s dsd sq d  dss d sd s sd sd sqd sd sqd sd\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq\n sq ds sq sq s  qs s sq sq sq\n sq ds sq sq s  qs s sq sq sq\n sq ds sq sq s  qs s sq sq sq\n sq ds sq sq s  qs s sq sq sq",0xffffff).setWrap(GText.PRE_WRAP)),GScroll.SHOW_AXIS_X);
        // add a box with size x 3 great tall of windows
        this.add(this.gScroll);
    }

    // mock
    scroll( v:number ){
        this.gScroll.scrollHeight = this.gScroll.scrollHeight + v;
        this.window.render();
    }
    /*****
     * Launcher
     * @param argc
     * @param argv
     */
    public static main( argc:number, argv: string[] ):number{

            new LayoutScroll(argc,argv).show();

        return 0;
    }
}