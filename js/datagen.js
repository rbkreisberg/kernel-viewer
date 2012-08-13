function dataGen(size, xrange, yrange){
	var points = [];
	for (var i = 0; i < size; i++){
		//replace with science.js Gaussian random distribution?
		var x = Math.random() * xrange;
		var y = Math.random() * yrange;
		points.push([x,y]);
	}
	return points;
}

function dataGenGaussian(size, mean, variance, dimensions){
	var gaussian = science.stats.distribution.gaussian();
	gaussian.mean(mean);
	gaussian.variance(variance);
	var points = [];
	for (var i = 0; i < size; i++){
		var coords = []
		for (var j = 0; j < dimensions; j++){
			var temp = gaussian();
			coords.push(temp);
		}
		points.push(coords);
	}
	return points;
}

function plotPoints(points){
	var svg = d3.select("body").append("svg");
	 svg.selectAll(".circle")
	  	.data(points)
	     .enter().append("circle")
	 .attr("class", "circle")
	 .attr("cx", function(point) {return point[0];})
	 .attr("cy", function(point) {return point[1];})
	 .attr("r", 1)
	 .style("fill", "black");
}

function createKDE(points){
	var kde = science.stats.kde();
	kde.sample(points);
	console.log(kde.bandwidth());
	var newPoints = [];
	for (var i = 0; i < 1; i += .01){
		newPoints.push(i);
	}
	return kde(newPoints);
}