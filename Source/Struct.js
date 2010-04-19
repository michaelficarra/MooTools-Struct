/*
---
description: Generates classes to be used similarly to C's struct construct
license: LGPL
authors: ['Michael Ficarra']
requires: [Core,Array,Hash,Class,Options]
provides: [Struct]
... */

var Struct = new Class({

	Implements: Options,
	options: {
		getterPrefix: 'get',
		setterPrefix: 'set'
	},

	initialize: function(){
		var args = $A(arguments),
			options = {};
		if(['object','hash'].contains($type(args.getLast()))) {
			options = args.getLast();
			args = args.slice(0,-1);
		}
		if($type(arguments[0])=='array') args = arguments[0];
		this.args = args;
		this.setOptions(options);
		return this.struct = this.createStruct();
	},
		
	createStruct: function(){
		var that = this;

		var struct = new Class({
			_storage: {},
			initialize: function(){
				var args = arguments, len = args.length;
				$each(that.args,function(arg,i){
					this._storage[arg] = (i>=len ? undefined : args[i]);
				}.bind(this));
			},
			members: $lambda(that.args),
			each: function(fn,bind){
				return $each(this._storage,fn,bind);
			},
			toHash: function(){
				return $H(this._storage);
			},
			equals: function(other){
				// enforce type-checking:
				//if(other.constructor!==this.constructor) return false;
				
				// duck-typing equality:
				var otherMembers = other.members();
				var myMembers = this.members();
				if(!myMembers.every(function(key){ return otherMembers.contains(key); })) return false;
				if(!otherMembers.every(function(key){ return myMembers.contains(key); })) return false;
				
				other = other.toHash();
				return this.members().every(function(key){
					return other.has(key) && this._storage[key]==other[key];
				},this);
			}
		});
		struct.members = $lambda(this.args);

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
		return struct;
	},
});

Array.implement({
	toStruct:function(options){
		return new Struct(this,options);
	}
});

/* Copyright 2010 Michael Ficarra
This program is distributed under the (very open)
terms of the GNU Lesser General Public License */
