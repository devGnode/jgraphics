///<amd-module name='/Test/BoxLayoutTest.js'/>
import {GWindow} from "../lib/Gwindow";
import {GObject} from "../lib/GObject";
import {BoxLayout} from "../lib/layout/BoxLayout";
import {Pane} from "../lib/Pane";
import {FlowLayout} from "../lib/layout/FlowLayout";
import {GDraw} from "../lib/components/GDraw";

export class BoxLayoutTest extends GWindow{

    constructor(argc:number, argv: string[]) {
        super();

        this.setTitle("Test BoxLayout - R-0.0.0");
        this.setDimension(450,450);
        this.setPosition(250,150);

        let left:Pane = new Pane(),
            right:Pane = new Pane(),
            center:Pane = new Pane();

        this.setLayout(new FlowLayout(0,0, BoxLayout.LEFT));
        // center
        center.setLayout(new BoxLayout(1,1,BoxLayout.CENTER))
            .resize(this.window.width,100)
            .add(new GObject(100,50).setBackground(0xaa00ff))
            .add(new GObject(50,50).setBackground(0x555555));
        // Right
        right.setLayout(new BoxLayout(1,1, BoxLayout.RIGHT))
            .resize(this.window.width,100)
            .add(new GObject(75,50).setBackground(0x555555))
            .add(new GObject(50,50).setBackground(0xaa00ff));
        // Left
        left.setLayout(new BoxLayout(1,1, BoxLayout.LEFT))
            .resize(this.window.width,200)
            .add(new GObject(50,50).setBackground(0x55AA55).setBorder(1,1,1,1,0x010101))
            .add(new GObject(100,50).setBackground(0xaa00ff))
            .add(new GDraw(null,100,100));

        this.add(center);
        this.add(right);
        this.add(left);
    }
    /*****
     * Launcher
     * @param argc
     * @param argv
     */
    public static main(argc:number, argv: string[]):number{
        new BoxLayoutTest(argc,argv).show();
        return 0;
    }
}