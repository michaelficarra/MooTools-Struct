describe('constructor',{
	before: function(){
		test = function(S){
			value_of(!!S).should_be_true();
			value_of(S.constructor).should_be(Function);
			value_of(S.prototype.initialize).should_not_be_undefined();
			value_of(S.prototype.initialize.constructor).should_be(Function);
		}
	},
	'accepts a list of strings': function(){
		var S = new Struct('a','b','c','d');
		test(S);
		var S = new Struct();
		test(S);
	},
	'accepts an array of strings': function(){
		var S = new Struct(['a','b','c','d']);
		test(S);
		var S = new Struct([]);
		test(S);
	},
	'accepts options': function(){
		var S = new Struct(['a','b','c','d'],{option0:0,option1:1});
		test(S);
		var S = new Struct([],{option0:0,option1:1});
		test(S);
		var S = new Struct('a','b','c','d',{option0:0,option1:1});
		test(S);
		var S = new Struct('a','b','c','d',new Hash({option0:0,option1:1}));
		test(S);
		var S = new Struct({option0:0,option1:1});
		test(S);
	},
	'creates appropriately-named methods': function(){
		var S = new Struct();
		test(S);
		['initialize','equals'].each(function(method){
			value_of(S.prototype[method]).should_not_be(undefined);
			value_of(S.prototype[method].constructor).should_be(Function);
		});
	}
});


describe('generated constructor',{
	before: function(){
		test = function(S){
			value_of(!!new S()).should_be_true();
			[
				[],
				[0],
				[undefined],
				['a','b'],
				[undefined,false,null],
				[1,true,/(?:)/,new Date()],
				[5,5,5,5,5]
			].each(function(args){
				var F = function(){};
				F.prototype = S.prototype;
				var s = new F();
				S.apply(s,args);
				value_of(!!s).should_be_true();
				value_of(s.constructor).should_be(S);
				['initialize','equals'].each(function(method){
					value_of(s[method]).should_not_be(undefined);
					value_of(s[method].constructor).should_be(Function);
				});
			});
		}
	},
	'accepts a list of values': function(){
		var S = new Struct('a','b','c','d');
		test(S);
		var S = new Struct(['a','b','c','d']);
		test(S);
		var S = new Struct('a','b','c','d',{option:0});
		test(S);
		var S = new Struct(['a','b','c','d'],{option:0});
		test(S);
		var S = new Struct();
		test(S);
	}
});


describe('generated methods',{
	before: function(){
		S = new Struct('a','b','c');
	},
	'generated methods should be able to get values': function(){
		var s = new S(1,2);
		value_of(s.getA()).should_be(1);
		value_of(s.getB()).should_be(2);
		value_of(s.getC()).should_be_undefined();
	},
	'generated methods should be able to override values (and not affect other structs)': function(){
		var s0 = new S(1,2),
			s1 = new S(undefined,8,7);
		value_of(s0.getA()).should_be(1);
		value_of(s0.getB()).should_be(2);
		value_of(s0.getC()).should_be_undefined();
		value_of(s1.getA()).should_be_undefined();
		value_of(s1.getB()).should_be(8);
		value_of(s1.getC()).should_be(7);
		s0.setC(3);
		s0.setB(3);
		s1.setA(9);
		s1.setB(0);
		value_of(s0.getA()).should_be(1);
		value_of(s0.getB()).should_be(3);
		value_of(s0.getC()).should_be(3);
		value_of(s1.getA()).should_be(9);
		value_of(s1.getB()).should_be(0);
		value_of(s1.getC()).should_be(7);
	},
	'generated setters should be chainable': function(){
		var s = new S(1,2);
		value_of(s.setB(3)).should_be(s);
		value_of(s.setB(2).setC(3)).should_be(s);
		value_of(s.getB()).should_be(2);
		value_of(s.getC()).should_be(3);
	}
});


describe('Struct.members',{
	before: function(){
		
	},
	'returns the names of the values accepted by this struct': function(){
		var S0 = new Struct('a','b','c'),
			S1 = new Struct(['a','b']),
			S2 = new Struct('a','a'),
			S3 = new Struct(1),
			S4 = new Struct();
		value_of(S0.members()).should_be(['a','b','c']);
		value_of(S1.members()).should_be(['a','b']);
		value_of(S2.members()).should_be(['a','a']);
		value_of(S3.members()).should_be(['1']);
		value_of(S4.members()).should_be([]);
	}
});


describe('Struct::toHash',{
	before: function(){
		S0 = new Struct('a','b','c');
		S1 = new Struct();
	},
	'returns a proper hash representation of current struct contents': function(){
		var s = new S0(1,2,3,4);
		value_of(s.toHash().getClean()).should_be({a:1,b:2,c:3});
		var s = new S0(1,2,3);
		value_of(s.toHash().getClean()).should_be({a:1,b:2,c:3});
		var s = new S0(1,2);
		value_of(s.toHash().getClean()).should_be({a:1,b:2,c:undefined});
		var s = new S0();
		value_of(s.toHash().getClean()).should_be({a:undefined,b:undefined,c:undefined});
		var s = new S0(1,2);
		s.setA(undefined);
		value_of(s.toHash().getClean()).should_be({a:undefined,b:2,c:undefined});
	}
});


describe('Struct::members',{
	before: function(){
		
	},
	'returns the names of the values accepted by this struct instance\'s contructor': function(){
		var S0 = new Struct('a','b','c'),
			S1 = new Struct(['a','b']),
			S2 = new Struct('a','a'),
			S3 = new Struct(1),
			S4 = new Struct();
		value_of(new S0().members()).should_be(S0.members());
		value_of(new S1().members()).should_be(S1.members());
		value_of(new S2().members()).should_be(S2.members());
		value_of(new S3().members()).should_be(S3.members());
		value_of(new S4().members()).should_be(S4.members());
	}
});


describe('Struct::each',{
	before: function(){
		
	},
	'iterates over all key/value pairs as if the struct was a hash': function(){
		var S0 = new Struct('a','b','c'),
			S1 = new Struct(),
			collect = {};
		new S0(1,2,3).each(function(v,k){
			collect[k] = v;
		});
		value_of(collect).should_be({a:1,b:2,c:3});

		collect = {}
		new S1().each(function(v,k){
			collect[k] = v;
		});
		value_of(collect).should_be({});
	},
	'context is preserved': function(){
		
	}
});


describe('options',{
	before: function(){
		
	},
	'getterPrefix / setterPrefix': function(){
		var methods = new Hash({
			a: 'a',
			b: 'b',
			abc: 'abc',
			ABC: 'Abc',
			abcDef: 'abcDef',
			ab_cd: 'abCd',
			'ab-cd': 'abCd',
			a_bc: 'aBc',
			'a-bc': 'aBc',
			ab_c: 'abC',
			'ab-c': 'abC',
			'': '',
			0: '0',
			123: '123',
			'0123': '0123',
			'01_234': '01_234',
			'56-789': '56_789'
		});
		var S = new Struct(methods.getKeys(),{getterPrefix:'get',setterPrefix:'set'});
		methods.getValues().each(function(expected){
			if(!expected) return;
			value_of(S.prototype['get'+expected.capitalize()].constructor).should_be(Function);
			value_of(S.prototype['set'+expected.capitalize()].constructor).should_be(Function);
			value_of(S.prototype[expected]).should_be_undefined();
			value_of(S.prototype[expected.capitalize()]).should_be_undefined();
		});
		var S = new Struct(methods.getKeys(),{getterPrefix:'',setterPrefix:''});
		methods.getValues().map(function(_){ return _.replace(/^[A-Z]/,function(_){ return _.toLowerCase(); }); }).each(function(expected){
			if(!expected) return;
			value_of(S.prototype['get'+expected]).should_be_undefined();
			value_of(S.prototype['set'+expected]).should_be_undefined();
			value_of(S.prototype[expected]).should_not_be_undefined();
			value_of(S.prototype[expected].constructor).should_be(Function);
		});
		var S = new Struct(methods.getKeys(),{getterPrefix:'retrieve',setterPrefix:'change'});
		methods.getValues().each(function(expected){
			if(!expected) return;
			value_of(S.prototype['retrieve'+expected.capitalize()].constructor).should_be(Function);
			value_of(S.prototype['change'+expected.capitalize()].constructor).should_be(Function);
			value_of(S.prototype[expected]).should_be_undefined();
			value_of(S.prototype[expected.capitalize()]).should_be_undefined();
		});
	}
});


describe('Array.toStruct',{
	before: function(){
		
	},
	'': function(){

	}
});
