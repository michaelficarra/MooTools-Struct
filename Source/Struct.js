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
		var args = Array.from(arguments),
			options = {};
		if(['object','hash'].contains(typeOf(args.getLast()))) {
			options = args.getLast();
			args = args.slice(0,-1);
		}
		if(typeOf(arguments[0])=='array') args = arguments[0];
		this.args = args;
		this.setOptions(options);
		return this.struct = this.createStruct();
	},

	createStruct: function(){
		var that = this;

		var struct = new Class({
			_storage: {},
			initialize: function(){
				var args = arguments, len = arguments.length;
				Array.each(that.args,function(arg,i){
					this._storage[arg] = (i>=len ? undefined : args[i]);
				},this);
			},
			members: Function.from(that.args),
			toHash: function(){
				return new Hash(this._storage);
			},
			equals: function(other,typeChecking){
				if(typeChecking) {
					// enforce type-checking:
					if(other.constructor!==this.constructor) return false;
				} else {
					// duck-typing equality:
					var otherMembers = other.members();
					var myMembers = this.members();
					if(!myMembers.every(function(_){ return otherMembers.contains(_); })) return false;
					if(!otherMembers.every(function(_){ return myMembers.contains(_); })) return false;
				}
				// check values
				var otherHash = other.toHash();
				return this.members().every(function(_){
					return otherHash.has(_) && this._storage[_]==otherHash[_];
				},this);
			}
		});
		['each','erase','get','set','empty','include',
		'map','filter','every','some','getKeys',
		'getValues','getLength'].each(function(method){
			struct.implement(method,function(){
				return Hash[method].apply(this,[this._storage].concat(Array.from(arguments)));
			});
		});
		struct.members = Function.from(this.args);

		var prefixes = {get: this.options.getterPrefix, set: this.options.setterPrefix};
		Array.each(this.args,function(arg){
			if(!arg) return;
			var getName, setName, baseName;
			getName = setName = arg.toString()
				.replace(/^[A-Z]/,function(_){return _.toLowerCase();})
				.replace('_','-').camelCase().replace('-','_');
			baseName = arg.toString().capitalize().replace('_','-').camelCase().replace('-','_');
			if(prefixes.get) getName = prefixes.get + baseName;
			if(prefixes.set) setName = prefixes.set + baseName;
			struct.implement(getName,function(){ return this._storage[arg]; });
			struct.implement(setName,function(_){ this._storage[arg] = _; return this; });
		},this);

		return struct;
	}
});

Array.implement('toStruct',function(options){
	return new Struct(this,options);
});

/* Copyright 2010 Michael Ficarra
This program is distributed under the (very open)
terms of the GNU Lesser General Public License */
