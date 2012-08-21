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

violinPlot = function(){
	var data = dataGenGaussian(1000,400,400),
		kde = createKDE(data),
		yScale = d3.scale.linear()
			.domain([-1 * d3.max(kde, function(a){return a[1];})
			         , d3.max(kde, function(a){return a[1];})])
			.rangeRound([0,400]),
		median = science.stats.median(data),
		xScale = d3.scale.linear()
			.domain([d3.min(kde, function(a){return a[0];})
			         ,d3.max(kde, function(a){return a[0];})])
			.range([0,200]),
		xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.ticks(4),
		yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
			.ticks(4),
		renderColor = "orange",
		renderMedian = true,
		renderPoints = false;

	violinPlot.data = function(x){
		if (!arguments.length) return data;
		data = x;
		kde = createKDE(data);
		median = (data.sort())[data.length / 2];
		return data;
	}
	
	violinPlot.xScale = function(x){
		if (!arguments.length) return xScale;
		xScale = x;
		return xScale;
	}
	
	violinPlot.yScale = function(x){
		if (!arguments.length) return yScale;
		yScale = x;
		return yScale;
	}
	
	violinPlot.renderMedian = function(x){
		if (!arguments.length) return renderMedian;
		renderMedian = x;
		return renderMedian;
	}
	
	violinPlot.renderPoints = function(x){
		if (!arguments.length) return renderPoints;
		renderPoints = x;
		return renderPoints;
	}
	
	violinPlot.renderColor = function(x){
		if (!arguments.length) return renderColor;
		renderColor = x;
		return renderColor;
	}	
	
	violinPlot.render = function(x){
		var svg = x.append("svg").append("g")
			.attr("transform","translate(50,0)");
		 svg.append("g")
		 	.data([kde])
		 	.append("path")
		 	.attr("class","path")
		 		 .attr("d", d3.svg.line()
				 .x(function(point) {return xScale(point[0]);})
				 .y(function(point) {return yScale(-1*point[1]);})
				 .interpolate("basis"))
			.style("fill",renderColor)
			.style("stroke","black");
		var g = svg.append("g")
		 	.data([kde]);
		g.append("path")
		 	.attr("class","path")
		 		 .attr("d", d3.svg.line()
				 .x(function(point) {return xScale(point[0]);})
				 .y(function(point) {return yScale(point[1]);})
				 .interpolate("basis"))
			.style("fill",renderColor)
			.style("stroke","black");
		if (renderPoints){
			g.append("g")
				.selectAll(".circle")
			  	.data(data)
			    .enter().append("circle")
			    .attr("class", "circle")
			    .attr("cx", function(point) {return xScale(point[0]);})
			    .attr("cy", function(point) {return yScale(0);})
			    .attr("r", 1)
			    .style("fill", "black");
		}
		if (renderMedian){
			g.append("line")
				.attr("x1",xScale(median))
				.attr("x2",xScale(median))
				.attr("y1",yScale(0) + 100)
				.attr("y2",yScale(0) - 100)
				.style("stroke","black");
		}
		 svg.append("g")
		 	.style("fill","none")
		 	.style("stroke","black")
		 	.call(xAxis);
		 svg.append("g")
		 	.style("fill","none")
		 	.style("stroke","black")
		 	.call(yAxis);
	}
	return violinPlot;
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
	var g = svg.append("g")
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
//	for (var i = 0; i < points.length; i++){
//		console.log(points[i][0]);
//		tempArray.push(points[i][0]);
//	}
	kde.sample(points);
	var median = science.stats.median(points);
	var variance = science.stats.variance(points);
	var newPoints = [];
	for (var i = (median - (1 * variance)); i <= (median + (1 * variance)); i += (variance / 10)){
		newPoints.push(i);
	}	
	return kde(newPoints);
}