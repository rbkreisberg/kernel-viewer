/*
3. code explanations - 1 liners
4. inline object documentation - javadocs
5. tests for data validation. also, have data validation. console.error()
*/
function dataGen(size, xrange, yrange){
	var points = [];
	for (var i = 0; i < size; i++){
		var x = Math.random() * xrange;
		var y = Math.random() * yrange;
		points.push([x,y]);
	}
	return points;
}

function dataGenGaussian(size, mean, variance){
	var gaussian = science.stats.distribution.gaussian();
	gaussian.mean(mean);
	gaussian.variance(variance);
	var points = [];
	for (var i = 0; i < size; i++){
		var temp = gaussian();
		points.push(temp);
	}
	return points;
}