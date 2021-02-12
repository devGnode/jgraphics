///<amd-module name='/Test/FlowLayoutTest.js'/>
import {GWindow} from "../lib/Gwindow";
import {FlowLayout} from "../lib/layout/FlowLayout";
import {GObject} from "../lib/GObject";
import {DFT_ICON, GImg} from "../lib/components/GImg";

export class FlowLayoutTest extends GWindow{

    constructor(argc:number, argv: string[]) {
        super();

        this.setTitle("Test FlowLayout - R-0.0.0");
        this.setDimension(450,250);
        this.setPosition(150,50);
        this.setIconImg(new GImg("").loadIcon(DFT_ICON.GSUCCESS));

        this.setLayout(new FlowLayout(1,1,FlowLayout.RIGHT));
        this.add(new GObject(50,50).setBackground(0xaa00ff));
        this.add(new GObject(50,100).setBackground(0x555555));
        this.add(new GObject(50,80).setBackground(0x55AA55));
        this.add(new GObject(50,100).setBackground(0x555555));
        this.add(new GObject(50,50).setBackground(0x0000ff));
        this.add(new GObject(50,50).setBackground(0x0000ff));
        this.add(new GObject(80,50).setBackgroundGradient(0xffffff,0xffaaaa));
        this.add(new GObject(50,50).setBackground(0x0000ff));
        this.add(new GObject(50,50).setBackground(0x0000ff));
        this.add(new GObject(100,70).setBackground(0x0000ff));
    }
    /*****
     * Launcher
     * @param argc
     * @param argv
     */
    public static main(argc:number, argv: string[]):number{
        new FlowLayoutTest(argc,argv).show();
        return 0;
    }
}