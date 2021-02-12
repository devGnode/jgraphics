///<amd-module name='/lib/layout/LayoutComponent.js'/>
import {GObject} from "../GObject";

export type COMPONENT_ALIGN = number;

interface layer{
    add(parent:GObject,child:GObject,align?:COMPONENT_ALIGN):GObject
}

export abstract class LayoutComponent implements layer{
    /***
     * CONSTANT
     */
    public static readonly CENTER:COMPONENT_ALIGN   = 0x00;
    public static readonly LEADING:COMPONENT_ALIGN  = 0x01;
    public static readonly LEFT:COMPONENT_ALIGN     = 0x02;
    public static readonly RIGHT:COMPONENT_ALIGN    = 0x04;
    public static readonly TRAILING:COMPONENT_ALIGN = 0x08;
    /****
     * Gape space
     */
    protected Hgap:number = 0x00;
    protected Vgap:number = 0x00;
    /***
     * Alignment
     */
    protected align:COMPONENT_ALIGN = LayoutComponent.LEFT;

    protected constructor(hgap:number = 0, vgap:number = 0, align:COMPONENT_ALIGN = LayoutComponent.LEFT) {
        this.Hgap = hgap;
        this.Vgap = vgap;
        this.align= align;
    }

    setHgap( gap:number = 0 ): void{this.Hgap=gap;}

    setVgap( gap:number = 0 ): void{this.Vgap=gap;}

    getHgap( ):number{return this.Hgap;}

    getVgap():number{return this.Vgap;}

    setAlign( align:COMPONENT_ALIGN = LayoutComponent.LEFT ):void{ this.align = align;}

    getAlign( ):COMPONENT_ALIGN{ return this.align;}

    add(parent:GObject,child:GObject,align:COMPONENT_ALIGN=LayoutComponent.CENTER):GObject{ return null; }
}