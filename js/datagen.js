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

function plotViolin(points){
	var kde = createKDE(points);
	for (var i = 0; i < kde.length; i++){
    	kde[i][1] = kde[i][1] * 10000; //Adds visibility to KDE rendering
	}
	var median = (points.sort())[points.length / 2];
	var svg = d3.select("body").append("svg");
	 svg.append("g")
	 	.attr("transform","scale(-1,1) rotate(90) translate(0,100) scale(.5)")
	  	.data([kde])
	 	.append("path")
	 	.attr("class","path")
	 		 .attr("d", d3.svg.line()
			 .x(function(point) {return point[0];})
			 .y(function(point) {return point[1];})
			 .interpolate("basis"))
		.style("fill","orange")
		.style("stroke","black");
	 svg.append("g")
	 	.attr("transform","rotate(90) translate(0,-100) scale(.5)")
	  	.data([kde])
	 	.append("path")
	 	.attr("class","path")
	 		 .attr("d", d3.svg.line()
			 .x(function(point) {return point[0];})
			 .y(function(point) {return point[1];})
			 .interpolate("basis"))
		.style("fill","orange")
		.style("stroke","black");
	 svg.append("g")
	 	.attr("transform","scale(-1,1) rotate(90) translate(0,100) scale(.5)")
	 	.selectAll(".circle")
	  	.data(points)
	    .enter().append("circle")
	    .attr("class", "circle")
	    .attr("cx", function(point) {return point[0];})
	    .attr("cy", function(point) {return point[1];})
	    .attr("r", 1)
	    .style("fill", "black");
	 var diff = 1000000;
	 var res = 0;
	 for (var i = 0; i < kde.length; i++){
		 var x = kde[i][0];
		 console.log(Math.abs(x - median) < diff);
		 if (Math.abs(x - median) < diff){
			 diff = Math.abs(x - median);
			 res = i;
		 }
	 }
	 console.log(res);
	 svg.append("line")
	 	.attr("x1",median)
	 	.attr("x2",median)
	 	.attr("y1",-100)
	 	.attr("y2",100)
	 	.style("stroke","black")
	 	.attr("transform","scale(-1,1) rotate(90) translate(0,100) scale(.5)");
}

function createKDE(points){
	var kde = science.stats.kde();
	var tempArray = [];
	for (var i = 0; i < points.length; i++){
		tempArray.push(points[i][0]);
	}
	kde.sample(tempArray);
	var newPoints = [];
	for (var i = 0; i <= 1200; i += 100){
		newPoints.push(i);
	}
	return kde(newPoints);
}