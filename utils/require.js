/****
 * So after much time, to try to use requireJs
 * i have take very old cold that i have stole
 * to facebook boot in 2010
 */
(function( self ){
    let exportable = {}, baseUrl = "", i = 0;
    //
    function Socket( type, url, Async ){
        this.xhr	= new XMLHttpRequest( );
        // argv
        this.type   = type;
        this.url 	= url;
        this.Async  = Async || null;
        //data
        this.get    = null;
        this.post   = null;
        this.header = {};
        this.file	= null;
    }
    Socket.prototype.objectData = function( data ){
        let ret = "",tmp;
        try{
            for( tmp in data )ret += `${tmp}=${data[tmp]}&`;
            ret = ( /(.+)\&/.exec( ret ) )[1];
        }catch( e ){}
        return ret;
    };
    Socket.prototype.data = function( data, type ){

        if ( this.type.toLowerCase( ) === "post" && ( type && type.toLowerCase( ) === "get" ) ){
            this.get = typeof data == "object" ? this.objectData( data ) : data;
        }
        if( ( this.type.toLowerCase( ) === "get" || this.type.toLowerCase( ) === "post" ) && type || !type ){
            this[ ( this.type.toLowerCase( ) === "get" ? "get" : "post" ) ] = typeof data == "object" ? this.objectData( data ) : data;
        }
        return this;
    };
    Socket.prototype.head = function( object ){
        let tmp = null;
        try{
            for( tmp in object )this.header[ tmp ] = object[ tmp ];
        }catch(e){}
        return this;
    };
    Socket.prototype.send = function( callback, rtype ){
        let self = this, ret = null, quote = "";

        this.xhr.onreadystatechange = function( ){
            if( this.readyState === 0x04 ){
                if( this.response && typeof this.response === "function" ){
                    return ( ret = self.response.call( self, this.status, this[ "response"+( rtype ? rtype : "Text" ) ] ) );
                }
                if( callback && typeof callback === "function" ){
                    return (ret = callback.call( self, this.status, this[ "response"+( rtype ? rtype : "Text" ) ] ) );
                }
            }
        };

        quote =  /(.+)\?(.+)/.test( this.url ) ? "&" : "?";
        this.xhr.open( this.type, this.url+( this.get ? quote+this.get : "" ), this.Async );

        try{
            let tmp;
            for( tmp in this.header )this.xhr.setRequestHeader(tmp, this.header[ tmp ]);
        }catch(e){}

        if( this.post && !this.file )
            this.xhr.setRequestHeader(
                "Content-Type",
                this.post && !this.file ? "application/x-www-form-urlencoded" : ""
            );

        try{
            this.xhr.send( this.post && !this.file ? this.post : this.file );
            this.post = this.get = null;
        }catch(e){
            if( callback && typeof callback === "function" )return (ret = callback.call( self, 0xBAD00000, 0xBAD00000 ) );
        }
        return ret;
    };

    function throwError( e ){ throw new Error(e); }
    function loadDependencies( module = null, exports = {} ) {
        let args = [],tmp = null,dep = null,i=0;
        try{
            while( ( dep = module.dependencies[ i ] )  ){
                args.push(dep === "exports" ? exports  : getLocalModule.call(null, dep,module));
                i++;
            }
            return args;
        }catch(e){
            throwError(`Dependency : '${dep}' doesn't exists : parent module : '${tmp.module}'`);
        }
    }
    function getLocalModule( a, b ){
        let exports = {}, args = [],
            tmp = null;

        if( ( tmp = exportable[ a ] ) || ( tmp = exportable[ a.replace(/^\./,"") ] )  ){
             // become dead code
            if( tmp.mount && typeof tmp.mount === "function" ){
                args = loadDependencies(tmp,exports);
                tmp.returned = ( tmp.returned = tmp.mount.apply(
                    exports,
                    args
                ) ) === undefined || tmp.returned === null ? exports : tmp.returned;
                delete tmp.mount;

            }else if( tmp.mount !== undefined ){
                tmp.returned = tmp.mount;
                delete tmp.mount;
            }else;

            return tmp.returned;
        }else{
            console.log(exportable,"--------------", a, b)
        }
        return null;
    }
    function getFileStream( module = null, sync = false ){
        return  exportable[ module ] === undefined ? (new Socket("GET", baseUrl+module, !sync)).send((code,result)=>{
            if(code!==200) throw new Error(`http.query : error : module '${module}' not found !`);
            eval(result);
        }) : null;
    }
    /* import new*/
    function setLocalModule( a, b, c, d ){
        let tmp;

        // load lib
        if(b.length>0){
            b=b.filter(value=>value!==a);
            for( tmp in b )if(exportable[ tmp ]===undefined&&["require","define","exports"].indexOf(b[tmp])===-1) getFileStream( b[tmp], ()=> setLocalModule(a,b,c,d ));
        }
        if( a!== null && exportable[ a ] === undefined ){
            /*import module*/
            exportable[ a ] = ({
                module 	        : btoa( a ),
                mount  	        : c,
                dependencies    : b
            });
            getLocalModule(a);
            i++;
            // load dep and call
        }else if(a===null)c.apply(c,loadDependencies({dependencies : b},{}));
        return !0;
    }
    function inModule( a, b ){ exportable[ a ] = { module: "__module__"+ btoa( a ), returned: b, access: 3 }; }
    // import
    function __import( a,b,c,d ){
        if(arguments.length===2){c=b,b=a,a=null}
        return setLocalModule( a, [].concat( b ), c, d );
    }
    function __req( a ){return  getLocalModule( a );}
    __import.config = __req.config = ( baseUrlA )=>{ baseUrl =baseUrlA; }
    inModule("define", __req );
    inModule("require", __import );
    /**/
    self.define = self._export = __import;
    self.require= self._import = __req;
})( self === window ? self : window );