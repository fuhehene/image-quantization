/**
 * @preserve
 * Copyright (c) 2015, Igor Bezkrovny
 * All rights reserved. (MIT Licensed)
 *
 * pointContainer.ts - part of Image Quantization Library
 */

/// <reference path='./point.ts' />
module IQ.Utils {

	// TODO: http://www.javascripture.com/Uint8ClampedArray
	// TODO: Uint8ClampedArray is better than Uint8Array to avoid checking for out of bounds
	// TODO: check performance (it seems identical) http://jsperf.com/uint8-typed-array-vs-imagedata/4
	/*

	 TODO: Examples:

	 var x = new Uint8ClampedArray([17, -45.3]);
	 console.log(x[0]); // 17
	 console.log(x[1]); // 0
	 console.log(x.length); // 2

	 var x = new Uint8Array([17, -45.3]);
	 console.log(x[0]); // 17
	 console.log(x[1]); // 211
	 console.log(x.length); // 2

	 */

	export class PointContainer {
		private _pointArray : Point[];
		private _width : number;
		private _height : number;

		constructor() {
			this._width = 0;
			this._height = 0;
			this._pointArray = [];
		}

		public getWidth() : number {
			return this._width;
		}

		public getHeight() : number {
			return this._height;
		}

		public setWidth(width : number) : void {
			this._width = width;
		}

		public setHeight(height : number) : void {
			this._height = height;
		}

		public getPointArray() : Point[] {
			return this._pointArray;
		}

		public clone() : PointContainer {
			var clone = new PointContainer();
			clone._width = this._width;
			clone._height = this._height;

			clone._pointArray = [];
			for(var i = 0, l = this._pointArray.length; i < l; i++) {
				clone._pointArray[i] = Point.createByUint32(this._pointArray[i].uint32 | 0); // "| 0" is added for v8 optimization
			}

			return clone;
		}

		public toUint32Array() : Uint32Array {
			var l = this._pointArray.length,
				uint32Array = new Uint32Array(l);

			for(var i = 0; i < l; i++) {
				uint32Array[i] = this._pointArray[i].uint32;
			}

			return uint32Array;
		}

		public toUint8Array() : Uint8Array {
			return new Uint8Array(this.toUint32Array().buffer);
		}

		static fromHTMLImageElement(img : HTMLImageElement) : PointContainer {
			var width = img.naturalWidth,
				height = img.naturalHeight;

			var canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			var ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width,height, 0, 0, width, height);

			return PointContainer.fromHTMLCanvasElement(canvas);
		}

		static fromHTMLCanvasElement(canvas : HTMLCanvasElement) : PointContainer {
			var width = canvas.width,
				height = canvas.height;

			var ctx = <CanvasRenderingContext2D>canvas.getContext("2d"),
				imgData = ctx.getImageData(0, 0, width, height);

			return PointContainer.fromImageData(imgData);
		}

		static fromNodeCanvas(canvas : any) : PointContainer {
			return PointContainer.fromHTMLCanvasElement(canvas);
		}

		static fromImageData(imageData : ImageData) : PointContainer {
			var width = imageData.width,
				height = imageData.height;

			return PointContainer.fromCanvasPixelArray(imageData.data, width, height);
			/*
			 var buf8;
			 if (Utils.typeOf(imageData.data) == "CanvasPixelArray")
			 buf8 = new Uint8Array(imageData.data);
			 else
			 buf8 = imageData.data;

			 this.fromUint32Array(new Uint32Array(buf8.buffer), width, height);
			 */
		}

		static fromArray(data : number[], width : number, height : number) : PointContainer {
			var uint8array = new Uint8Array(data);
			return PointContainer.fromUint32Array(new Uint32Array(uint8array.buffer), width, height);
		}

		static fromCanvasPixelArray(data : any, width : number, height : number) : PointContainer {
			return PointContainer.fromArray(data, width, height);
		}

		static fromUint32Array(uint32array : Uint32Array, width : number, height : number) : PointContainer {
			var container = new PointContainer();

			container._width = width;
			container._height = height;

			container._pointArray = [];//new Array(uint32array.length);
			for(var i = 0, l = uint32array.length; i < l; i++) {
				container._pointArray[i] = Point.createByUint32(uint32array[i] | 0); // "| 0" is added for v8 optimization
			}

			return container;
		}
	}

}