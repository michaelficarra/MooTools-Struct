Struct
======

Implementation of a Struct class in MooTools, inspired by [Ruby's Struct class](http://ruby-doc.org/core/classes/Struct.html)


How To Use
----------

Generate a Struct class with the constructor

	var Car = new Struct('make','model','year')		// [Class:Car]
	var myCar = new Car('Chrysler','Cirrus',2000)	// [Object:myCar]
	console.log(myCar.getMake())					// 'Chrysler'
	console.log(myCar.getModel())					// 'Cirrus'
	console.log(myCar.getYear())					// 2000
	console.log(myCar.setModel('Sebring'))			// [Object:myCar]
	console.log(myCar.getModel())					// 'Sebring'
	
Undefined values will be ignored

	var Car = new Struct('make','model','year')		// [Class:Car]
	var myCar = new Car('Chrysler','Cirrus')		// [Object:myCar]
	console.log(myCar.getMake())					// 'Chrysler'
	console.log(myCar.getYear())					// undefined
	console.log(myCar.setYear(2000))				// [Object:myCar]
	console.log(myCar.getYear())					// 2000

Optionally, one may set the prefixes for the getter
and setter methods when generating the class

	var Car = new Struct(['make','model','year'],{getterPrefix:'',setterPrefix:'change'})		// [Class:Car]
	var myCar = new Car('Chrysler','Cirrus',2000)	// [Object:myCar]
	console.log(myCar.make())						// 'Chrysler'
	console.log(myCar.year())						// 2000
	console.log(myCar.changeYear(2010))				// [Object:myCar]
	console.log(myCar.year())						// 2010


Other Features
--------------

In the following examples, assume the following Struct has been defined

	var Car = new Struct('make','model','year')		// [Class:Car]

### toHash
Retrieve a hash representation of the Struct and its contents

	(new Car('Chrysler','Cirrus',2000)).toHash()
	// {make:'Chrysler',model:'Cirrus',year:2000}
	(new Car('Chrysler','Cirrus')).toHash()
	// {make:'Chrysler',model:'Cirrus',year:undefined}

### members
Retrieve the Struct's properties

	(new Car()).members()		// ['make','model','year']

### each(func(val,key,hash), bind)
Passes the given function to the each function of the hash representation of the Struct

	var cadillac = new Car('Cadillac','CTS',2010)
	cadillac.each(function(val,key){
		console.log(key+' => '+val.toString())
	})
	// make => Cadillac
	// model => CTS
	// year => 2010

### equals
Checks if two instances of a class generated by Struct have the same values for the available properties

	var myCar = new Car('Chrysler','Cirrus',2000),
		cadillac = new Car('Cadillac','CTS',2010),
		anotherCaddy = new Car('Cadillac','CTS',2010)
	myCar.equals(cadillac)				// false (unfortunately)
	cadillac.equals(anotherCaddy)		// true

### Array.toStruct(options)
Converts the array to a Struct class, using the array entries as struct properties, and passing an optional options hash to the Struct constructor

	var Car = ['make','model','year'].toStruct({getterPrefix:''})	// [Class:Car]


Additional Info
---------------

I am always open for feature requests or any feedback.
I can be reached at [Github](http://github.com/michaelficarra).

Thanks go out to the Ruby community for the original idea and implementation.
