beforeEach(function() {
	this.addMatchers({
		matchesArray: function(expected){
		
		//Returns how many levels (sub-arrays) an array has and the length of the FINAL sub-array
		function arrayInfo(array){
			var testArray = array;
			var arrayLength;
			var arrayLevels = 0;
			while (testArray[0] != undefined){
				arrayLevels++;
				arrayLength = testArray.length;
				testArray = testArray[0];
			}
			return ([arrayLength, arrayLevels]);
		}
		
		//Converts to strings because JS hates me
		return (arrayInfo(this.actual).toString == arrayInfo(expected).toString);
	}
	})
})

describe("A KDE", function(){
	it ("requires input in the form of a set of data consisting of single integers", function(){
		expect(dataGenGaussian(1000,400,2000,1)).matchesArray([[0]]);
	})
	it ("returns input in the form of a set of plottable points", function(){
		expect(createKDE(dataGenGaussian(1000,400,2000,1))).matchesArray([[0,0]]);
	})
})