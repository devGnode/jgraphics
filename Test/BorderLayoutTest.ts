///<amd-module name='/Test/BorderLayoutTest.js'/>
import {GWindow} from "../lib/Gwindow";
import {Pane} from "../lib/Pane";
import {BoxLayout} from "../lib/layout/BoxLayout";
import {GButton} from "../lib/components/GButton";
import {BorderLayout} from "../lib/layout/BorderLayout";
import {GText} from "../lib/components/GText";
import {PAGE_CODE} from "../lib/cp437/KEYS_CP437";
/****
 * TEST - RELEASE-1.0.0
 *
 */
export class BorderLayoutTest extends GWindow{

    constructor(argc:number, argv: string[]) {
        super();

        this.setDimension(450,150);
        this.setPosition(50,50);
        this.setTitle("Test BorderLayout - R-1.0.0");

        this.setLayout(new BorderLayout(0,0));

        let kk: Pane = new Pane();
        kk.resize(100,100).setPreferenceWidth(100).setPadding(5,5);
        //kk.setLayout(new BoxLayout(0,0,BoxLayout.LEFT)).add(new GText("Hellow 1231 mais ommmem kkk !!!").setWrap(GText.PRE_WRAP).setColor(0xaa55aa)).setPreferenceWidth(40);
        kk.setLayout(new BoxLayout(0,0,BoxLayout.LEFT)).add(new GButton("X",25).resize(25,25).setBackgroundGradient(0xff0000, 0xfdb9b9));
        this.add(kk,BorderLayout.WEST);
        this.add(new GText("BorderLayout.SOUTH").setFontFamily(PAGE_CODE.CP437_8_16).setColor(0xaa55aa).setWrap(GText.INLINE),BorderLayout.SOUTH);
        this.add(new GText("BorderLayout.NORTH", GText.INLINE).setColor(0xaa55aa).setPreferenceHeight(30),BorderLayout.NORTH);
        //  body.add(new GText("Hellow 1231", GText.INLINE).setColor(0xaa55aa),BorderLayout.WEST);
        this.add(new GText("BorderLayout.CENTER", GText.INLINE).setColor(0xaa55aa),BorderLayout.CENTER);
        this.add(new GText("Hellow 52---", GText.INLINE).setColor(0xaa55aa),BorderLayout.EAST);

        console.log(this);
    }
    /*****
     * Launcher
     * @param argc
     * @param argv
     */
    public static main( argc:number, argv: string[] ):number{

        new BorderLayoutTest(argc,argv).show();

        return 0;
    }
}