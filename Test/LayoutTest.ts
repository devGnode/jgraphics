///<amd-module name='/Test/LayoutTest.js'/>
import {GWindow} from "../lib/Gwindow";
import {Pane} from "../lib/Pane";
import {BoxLayout} from "../lib/layout/BoxLayout";
import {GButton} from "../lib/components/GButton";
import {BorderLayout} from "../lib/layout/BorderLayout";
import {GText} from "../lib/components/GText";
import {GObject} from "../lib/GObject";
import {DFT_ICON, GImg} from "../lib/components/GImg";

/****
 * TEST - RELEASE-1.0.0
 *
 */
export class LayoutTest extends GWindow{

    constructor(argc:number, argv: string[]) {
        super();

        this.setDimension(450,150);
        this.setPosition(50,50);
        this.setTitle("MessageBox : Message Informations ! mais bien sur top secret");
        this.setIconImg(new GImg(null).loadIcon(DFT_ICON.GFAIL));

        this.setLayout(new BorderLayout(0,0));

        let wrapButton:Pane = new Pane(),
            paneButton:Pane = new Pane().setLayout(new BoxLayout(2,2,BoxLayout.CENTER));

        wrapButton.resize(450-5,29).setPreferenceHeight(35).setBackground(0);
        paneButton.resize(450-5,30).setPreferenceHeight(35).setPreferenceWidth(450-5).setBackground(0);
        paneButton.setBorder(1,1,1,1,0x010101)
        paneButton.add(new GButton("OK",50,25).setColor(0x050505).setBackgroundGradient(0x00bfff,0xffffff));
        wrapButton.add(paneButton);

        let kk: Pane = new Pane();
        let msg:Pane = new Pane();

        kk.resize(100,100).setPreferenceWidth(100).setPadding(5,5);
        //kk.setLayout(new BoxLayout(0,0,BoxLayout.LEFT)).add(new GText("Hellow 1231 mais ommmem kkk !!!").setWrap(GText.PRE_WRAP).setColor(0xaa55aa)).setPreferenceWidth(40);
        kk.setLayout(new BoxLayout(0,0,BoxLayout.LEFT)).add(new GButton("X",25).resize(25,25).setBackgroundGradient(0xff0000, 0xfdb9b9));
        this.add(new GObject(60,50).setBackground(0).setPreferenceWidth(20),BorderLayout.WEST);
        this.add(wrapButton,BorderLayout.SOUTH);
        this.add(new Pane().setBackground(0).resize(450,30).setPreferenceHeight(30),BorderLayout.NORTH);
        //  body.add(new GText("Hellow 1231", GText.INLINE).setColor(0xaa55aa),BorderLayout.WEST);
        this.add(new GObject(20,50).setBackground(0).setPreferenceWidth(20),BorderLayout.EAST);
        this.add(new GText("BorderLayout.CENTER,BorderLayout.CENTERBorder Layout.CENTER BorderLayout.CENTER").setWrap(GText.PRE_WRAP).setColor(0xaa55aa),BorderLayout.CENTER);
    }
    /*****
     * Launcher
     * @param argc
     * @param argv
     */
    public static main( argc:number, argv: string[] ):number{

        new LayoutTest(argc,argv).show();

        return 0;
    }
}