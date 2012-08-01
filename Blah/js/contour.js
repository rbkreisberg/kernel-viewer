
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

function plotCircle(points){
	var svg = d3.select("body").append("svg");
	 svg.selectAll(".circle")
	     .data([points])
	   .enter().append("path")
	 .attr("class", "circle")
	 .attr("d", d3.svg.line()
			 .x(function(point) {return point[0];})
			 .y(function(point) {return point[1];})
			 .interpolate("basis"))
	 .style("fill", "red")
	 .style("stroke", "black");
}