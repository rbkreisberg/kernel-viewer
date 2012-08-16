function dataGen(size, xrange, yrange){
	var points = [];
	for (var i = 0; i < size; i++){
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

function plotViolin(points){
	var kde = createKDE(points);
	var yScale = d3.scale.linear()
		.domain([-1 * d3.max(kde, function(a){return a[1];})
		         , d3.max(kde, function(a){return a[1];})])
		.rangeRound([0,400]);
	var median = (points.sort())[points.length / 2];
	var xScale = d3.scale.linear()
		.domain([d3.min(kde, function(a){return a[0];})
		         ,d3.max(kde, function(a){return a[0];})])
		.range([0,200]);
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(4);
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(4);
	var svg = d3.select("body").append("svg").append("g")	
		.attr("transform","translate(50,0)");
	 svg.append("g")
	 	.data([kde])
	 	.append("path")
	 	.attr("class","path")
	 		 .attr("d", d3.svg.line()
			 .x(function(point) {return xScale(point[0]);})
			 .y(function(point) {return yScale(-1*point[1]);})
			 .interpolate("basis"))
		.style("fill","orange")
		.style("stroke","black");
	var g= svg.append("g")
	 	.data([kde]);
	g.append("path")
	 	.attr("class","path")
	 		 .attr("d", d3.svg.line()
			 .x(function(point) {return xScale(point[0]);})
			 .y(function(point) {return yScale(point[1]);})
			 .interpolate("basis"))
		.style("fill","orange")
		.style("stroke","black");
	g.append("g")
	.selectAll(".circle")
	  	.data(points)
	    .enter().append("circle")
	    .attr("class", "circle")
	    .attr("cx", function(point) {return xScale(point[0]);})
	    .attr("cy", function(point) {return yScale(0);})
	    .attr("r", 1)
	    .style("fill", "black");
	 g.append("line")
	 	.attr("x1",xScale(median))
	 	.attr("x2",xScale(median))
	 	.attr("y1",yScale(0) + 100)
	 	.attr("y2",yScale(0) - 100)
	 	.style("stroke","black");
	 svg.append("g")
	 	.style("fill","none")
	 	.style("stroke","black")
	 	.call(xAxis);
	 svg.append("g")
	 	.style("fill","none")
	 	.style("stroke","black")
	 	.call(yAxis);
}

function createKDE(points){
	var kde = science.stats.kde();
	var tempArray = [];
	for (var i = 0; i < points.length; i++){
		tempArray.push(points[i][0]);
	}
	kde.sample(tempArray);
	var median = science.stats.median(tempArray);
	var variance = science.stats.variance(tempArray);
	console.log(variance);
	var newPoints = [];
	for (var i = (median - (1 * variance)); i <= (median + (1 * variance)); i += (variance / 10)){
		newPoints.push(i);
	}	
	return kde(newPoints);
}