/*
---
description: Struct class, generates classes to be used similarly to C's struct construct

license: LGPL

authors:
- Michael Ficarra

requires:
- core/1.2.4:Core
- core/1.2.4:Array
- core/1.2.4:Function
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
		if(arguments.length==2 && ['object','hash'].contains($type(arguments[1]))){
			args = arguments[0];
			options = arguments[1];
		}
		args = $A($splat(args));
		this.setOptions(options||{});
		this.struct = new Class({
			_storage: {},
			initialize: function(){
				$A(arguments).each(function(arg,i){
					this._storage[args[i]] = arg;
				}.bind(this));
			},
			members: function(){ return args; },
			each: function(fn,bind){ return this.toHash().each(fn,bind); },
			toHash: function(){ return $H(this._storage); },
			equals: function(other){
				other = other.toHash();
				return this.toHash().every(function(val,key){
					return other[key] == val;
				});
			}
		});
		args.each(function(arg){
			var getFunc = function(){ return this._storage[arg]; },
			setFunc = function(val){ this._storage[arg] = val; return this; },
			getName, setName, baseName;
			getName = setName = arg.toString().replace(/^[A-Z]/,function(m){return m.toLowerCase();}).replace('_','-').camelCase();
			baseName = arg.toString().capitalize().replace('_','-').camelCase();
			if(this.options.getterPrefix != '') getName = this.options.getterPrefix + baseName;
			if(this.options.setterPrefix != '') setName = this.options.setterPrefix + baseName;
			this.struct.implement($H().set(setName,setFunc).set(getName,getFunc).getClean());
		}.bind(this));
		return this.struct;
	}
});

Array.implement({toStruct:function(options){
	return new Struct(this,options||{});
}});

/* Copyright 2010 Michael Ficarra
This program is distributed under the (very open)
terms of the GNU Lesser General Public License */
