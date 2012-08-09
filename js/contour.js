
/*
 * 
 * radius
 * cx
 * cy
 * interp (optional)
 */

function makeCircle(radius, cx, cy){
	var interp = ((arguments.length == 4) ? arguments[3] : 30);
	var points = []
	for (var i = 0; i < interp; i++){
		var angle = (360 / interp) * i;
		var x = (radius * Math.cos(Math.PI / 180 * angle)) + cx;	
		var y = (radius * Math.sin(Math.PI / 180 * angle)) + cy;
		points.push([x,y]);
	}
	points.push(points[0]);
	return points;
}

function plotHeart(points){
	var svg = d3.select("body").append("svg");
	 svg.selectAll(".heart")
	     .data([points])
	   .enter().append("path")
	 .attr("class", "heart")
	 .attr("d", d3.svg.line()
			 .x(function(point) {return point[0];})
			 .y(function(point) {return point[1];})
			 .interpolate("basis"))
	 .style("fill", "red")
	 .style("stroke", "black");
}

function makeHeart(radius, cx, cy){
	var type = ((arguments.length == 4) ? arguments[3] : 0);
	var points = [];
	if (type == 0){
		for (var i = -100; i <= 100; i += 1){ //JS does not handle floats well; multiplied bounds as a fix
			var temp = i/100;
			var x = (radius * Math.sin(temp) * Math.cos(temp) * Math.log(Math.abs(temp))) + cx;	
			var y = cy - (radius * Math.pow((Math.abs(temp)), .3) * Math.sqrt((Math.cos(temp))));
			if (isNaN(x)){
				x = cx;
			}
			points.push([x,y]);
		}
	}
	else {
		for (var i = -300; i <= 300; i += 1){
			var temp = i/100;
			var x = (radius * (16 * Math.pow((Math.sin(temp)), 3))) + cx;	
			var y = cy - (radius * ((13 * Math.cos(temp)) - (5 * Math.cos(2 * temp)) - (2 * Math.cos(3 * temp)) - (Math.cos(4 * temp))));
			points.push([x,y]);
		}
	}
	points.push(points[0]);
	return points;
}

function transition(){
	d3.selectAll(".heart")
	/*switch data set depending on type of heart (using type var?)
	 * redraw heart (using different parameters - heart parameters are not equivalent)
	 */
}