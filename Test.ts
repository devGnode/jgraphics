var _gradient = {
    _default_ir_:255,
    hxtrgb:function(a){ var a = a.replace(/#/,""), i = 0,t="",r=[]; while( a[i] != undefined ){ if( i%2 == 0 && t.length == 2){ r.push( parseInt( t, 16) ); t = ""; }  t += ""+a[i]; i++; } r.push( parseInt( t, 16) ); return r; },
    rgbthx:function(a){ var t = convert( ).dechex( ( a[0] << 16 ) | ( a[1] << 8 ) | a[2] ),i = 0,c; if( t.length < 6 ){ c = ""; i = (6-(t.length%6) );while( i>0 ){ c+="0"; --i; } } return "#"+( c ? c : "" )+t; },

    crgb:function(a){ return (a[0] >= 0 || a[0] <= 255) && (a[1] >= 0 || a[1] <= 255) && (a[2] >=0 || a[2] <= 255) ? true : false; },
    clcRat:function(a,b,c,d,e,f,g){ return{ r:(a-d)/g, g:(b-e)/g, b:(c-f)/g}; },
    getRGB:function(a){ var b; if( isObj( a ) && this.crgb(a) ) return a; else if(typeof a === "string" && this.crgb( ( b = this.hxtrgb( a ) ) ) ) return b; else false;; },
    floor:function(a){ return Math.floor(a); }
};
var convertGrad = new (function(){
    this.hexToRgb = _gradient.hxtrgb;
    this.rgbToHex = _gradient.rgbthx;
})( );
_exportFn._import("gradiant",[],function( slf ){
    var irr,node = this.node,k = 0,
        w = _gradient;

    irr = w._default_ir_;

    slf.convertGrad = convertGrad;
    slf.grad = function(a,b,c,d,e){
        var cs = [0,0,0],ce = [0,0,0],clr,tm, pk = ( k++ ),
            irr = ir = d ? d : w._default_ir_;

        if( tm )
            clearTimeout( tm );;

        /*repport error*/
        if( !( cs = w.getRGB(b) ) || !(ce = w.getRGB(a) ) )
            return slf;

        clr = w.clcRat(ce[0],ce[1],ce[2],cs[0],cs[1],cs[2],irr);

        if(typeof e === "function"){
            var i = 0;

            try{
                while( ir > 0 ){
                    e.call( slf, w.floor( ce[0] -= clr.r ), w.floor( ce[1] -= clr.g ), w.floor( ce[2] -= clr.b ) );
                    --ir;
                }
            }catch(er){};
        }else{
            function _l(){

                ce[0] -= clr.r,ce[1] -= clr.g,ce[2] -= clr.b;

                slf.css("backgroundColor","rgb("+ w.floor( ce[0] )+","+ w.floor( ce[1] )+","+ w.floor( ce[2] )+")");
                --ir;

                ir != 0 && pk+1 == k ?  ( tm = setTimeout( _l, c ? c : 5 ) ) : 0;
            }

            setTimeout( _l, c ? c  : 5 );
        }

        return slf;
    };

});