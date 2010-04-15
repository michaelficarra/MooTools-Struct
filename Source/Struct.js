/*
---
description: Struct class, generates classes to be used similarly to C's struct construct

license: LGPL

authors:
- Michael Ficarra
- Arian Stolwijk

requires:
- core/1.2.4:Core
- core/1.2.4:Array
- core/1.2.4:Hash
- core/1.2.4:Class
- core/1.2.4:Class.Extras

provides: [Struct]

...
*/
var Struct = new Class({

	Implements: Options,
	options: {
		getterPrefix: 'get',
		setterPrefix: 'set'
	},

	initialize: function(){
		var args = arguments, options;
		if(args.length==2 && ['object','hash'].contains($type(arguments[1]))){
			args = arguments[0];
			options = arguments[1];
		}
		this.args = $splat(args);
		this.setOptions(options);
		this.struct = this.createStruct();
		this.addAccessors(this.struct);
		return this.struct;
	},
		
	createStruct: function(){
		var that = this;
		var storage = {};
		return new Class({
			initialize: function(){
				var args = arguments, len = args.length;
				$each(that.args,function(arg,i){
					storage[arg] = (i>=len ? undefined : args[i]);
				}.bind(this));
			},
			members: function(){
				return that.args;
			},
			each: function(fn,bind){
				return $each(storage,fn,bind);
			},
			toHash: function(){
				return $H(storage);
			},
			equals: function(other){
				other = other.toHash();
				return this.toHash().every(function(val,key){
					return other[key] == val;
				});
			}
		});
	},

	addAccessors: function(struct){
		var prefixes = {get: this.options.getterPrefix, set: this.options.setterPrefix};
		$each(this.args,function(arg){
			var getName, setName, baseName, implement = {};
			getName = setName = arg.toString().replace(/^[A-Z]/,function(m){return m.toLowerCase();}).replace('_','-').camelCase();
			baseName = arg.toString().capitalize().replace('_','-').camelCase();
			if(prefixes.get != '') getName = prefixes.get + baseName;
			if(prefixes.set != '') setName = prefixes.set + baseName;
			implement[getName] = function(){ return this._storage[arg]; },
			implement[setName] = function(val){ this._storage[arg] = val; return this; },
			struct.implement(implement);
		}.bind(this));
	}
});

Array.implement({
	toStruct:function(options){
		return new Struct(this,options);
	}
});

/* Copyright 2010 Michael Ficarra
This program is distributed under the (very open)
terms of the GNU Lesser General Public License */
