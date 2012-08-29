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

/** @constructor */
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
		xPadding = 50,
		yPadding = 0,
		height = null,
		width = null,
		renderColor = "orange",
		renderMedian = true,
		renderPoints = false,
		multipleArrays = false;

	violinPlot.data = function(x){
		if (!arguments.length) return data;
		if (x[0] instanceof Array){
			kdeArray = [];
			medianArray = [];
			for (var i = 0; i < x.length; i++){
				kdeArray.push(createKDE(x[i]));
				medianArray.push(science.stats.median(x[i]));
			}
			data = x
			console.log(kdeArray);
			kde = kdeArray;
			median = medianArray;
			multipleArrays = true;
			return data;
		}
		data = x;
		kde = createKDE(data);
		median = science.stats.median(data);
		return data;
	}

	/**
		Sets the horizontal scale of the plot. Returns the current scale if no value is passed in.
	 */			
	violinPlot.xScale = function(x){
		if (!arguments.length) return xScale;
		if (x instanceof d3.scale.linear()){
			xScale = x;
			return xScale;
		}
		console.error("The object passed in is not a scale.")
	}

	/**
		Sets the vertical scale of the plot. Returns the current scale if no value is passed in.
	 */		
	violinPlot.yScale = function(x){
		if (!arguments.length) return yScale;
		if (x instanceof d3.scale.linear()){
			yScale = x;
			return yScale;
		}
		console.error("The object passed in is not a scale.")
	}

	/**
		Sets whether or not the median is rendered. Returns the current setting if no value is passed in.
	 */		
	violinPlot.renderMedian = function(x){
		if (!arguments.length) return renderMedian;
		renderMedian = x;
		return renderMedian;
	}

	/**
		Sets whether or not the original data points are rendered. Returns the current setting if no value is passed in.
	 */	
	violinPlot.renderPoints = function(x){
		if (!arguments.length) return renderPoints;
		renderPoints = x;
		return renderPoints;
	}
	
	/**
		Sets the color that the plot(s) are rendered in. Returns the color if no value is passed in.
	 */	
	violinPlot.renderColor = function(x){
		if (!arguments.length) return renderColor;
		renderColor = x;
		return renderColor;
	}	
	
	/**
		Sets the horizontal padding of the object that the plot(s) are rendered in. Returns the horizontal padding if no value is passed in.
	 */	
	violinPlot.xPadding = function(x){
		if (!arguments.length) return xPadding;
		xPadding = x;
		return xPadding;
	}
	
	/**
		Sets the vertical padding of the object that the plot(s) are rendered in. Returns the vertical padding if no value is passed in.
	 */
	violinPlot.yPadding = function(x){
		if (!arguments.length) return yPadding;
		yPadding = x;
		return yPadding;
	}
	
	/**
 		Sets the height of the object that the plot(s) are rendered in. Returns the height if no value is passed in.
	 */
	violinPlot.height = function(x){
		if (!arguments.length) return height;
		height = x;
		return height;
	}
	
	/**
	 	Sets the width of the object that the plot(s) are rendered in. Returns the width if no value is passed in.
	 */
	violinPlot.width = function(x){
		if (!arguments.length) return width;
		width = x;
		return width;
	}
	
	/**
	 	Renders the violin plot.
	 	@param {HTML Object} x - The container in which the plot is rendered. If no container is passed in, the plot is rendered in the body.
	 */
	violinPlot.render = function(x){
		var root = d3.select("body");
		if (arguments.length) root = d3.select("#" + x);
		var plots = 1;
		if (multipleArrays) plots = data.length;
		var translateFactor = xScale.range()[1];
		//Creates the frame within which the objects are rendered
		var frame = root.append("svg").append("g");
		//If height and width modifiers are defined, scales object by those modifiers
		if (height && width) frame.attr("transform","scale(" + (width / $("#" + x).width()) +","+ (height / $("#" + x).height()) + ")");
		for (var i = 0; i < plots; i++){
			var plotKDE = kde;
			var plotData = data;
			var plotMedian = median;
			if (multipleArrays){ 
				plotData = data[i];
				plotKDE = kde[i];
				plotMedian = median[i];
			}
			var plot = frame.append("g")
				.attr("transform","translate(" + (xPadding + (translateFactor * i)) + "," + yPadding + ")");
			var g1 = plot.append("g")
			 	.data([plotKDE])
			 	.append("path")
			 	//Draws the first half of the violin plot
			 	.attr("class","path")
			 		 .attr("d", d3.svg.line()
					 .x(function(point) {return xScale(point[0]);})
					 .y(function(point) {return yScale(-1*point[1]);})
					 .interpolate("basis"))
				.style("fill",renderColor)
				.style("stroke","black");
			var g2 = plot.append("g")
			 	.data([plotKDE]);
			g2.append("path")
				//Draws the second half of the violin plot
			 	.attr("class","path")
			 		 .attr("d", d3.svg.line()
					 .x(function(point) {return xScale(point[0]);})
					 .y(function(point) {return yScale(point[1]);})
					 .interpolate("basis"))
				.style("fill",renderColor)
				.style("stroke","black");
			if (renderPoints){
				g2.append("g")
					.selectAll(".circle")
				  	.data(plotData)
				    .enter().append("circle")
				    .attr("class", "circle")
				    .attr("cx", function(point) {return xScale(point); })
				    .attr("cy", function(point) {return yScale(0);})
				    .attr("r", 1)
				    .style("fill", "black");
			}
			if (renderMedian){
				g2.append("line")
					.attr("x1",xScale(plotMedian))
					.attr("x2",xScale(plotMedian))
					.attr("y1",yScale(0) + 100)
					.attr("y2",yScale(0) - 100)
					.style("stroke","black");
			}
			 plot.append("g")
			 	.style("fill","none")
			 	.style("stroke","black")
			 	.call(xAxis);
			 if (i == 0){
				 plot.append("g")
				 	.style("fill","none")
				 	.style("stroke","black")
				 	.call(yAxis);
			 }
		}
	}
	
	/**
	   @param {Array of numbers} points - The set of data to be made into a KDE
	   @returns {Array of points} The KDE
	 */
	function createKDE(points){
		var kde = science.stats.kde();
		kde.sample(points);
		var median = science.stats.median(points);
		var variance = science.stats.variance(points);
		var newPoints = [];
		//Filters the data down to relevant points
		for (var i = (median - (1 * variance)); i <= (median + (1 * variance)); i += (variance / 10)){
			newPoints.push(i);
		}	
		return kde(newPoints);
	}
	
	return violinPlot;
}