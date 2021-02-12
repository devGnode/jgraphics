export type screenTypeArgs = "x"|"y";
export type dword          = number
export type byte           = number
export type float         = number

export type frameBufferDataArgs = ImageData|Uint8ClampedArray|Uint8Array|Array<number>;
export type frameBuilderDim= { x:number,y:number };
export type rgbProto       = {r:number,g:number,b:number};
export type YCrCbOpts      = { greyscale:boolean,r?:number,g?:number,b?:number};
export type predicationColors= (offset:dword,color?:number)=>boolean