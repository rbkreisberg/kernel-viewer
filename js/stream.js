

/* Inspired by Lee Byron's test data generator. */
var stream_layers = function(n, m, o) {
  if (arguments.length < 3) o = 0;
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(stream_index);
    });
};

/* Another layer generator using gamma distributions. */
var stream_waves = function(n, m) {
  return d3.range(n).map(function(i) {
    return d3.range(m).map(function(j) {
        var x = 20 * j / m - i / 3;
        return 2 * x * Math.exp(-.5 * x);
      }).map(stream_index);
    });
};



var n = 5, // number of layers
    m = 200, // number of samples per layer
    generators = [stream_layers,stream_waves],
    gIndex = 0,
    generator = generators[gIndex],
    data0 = d3.layout.stack().offset("wiggle")(stream_layers(n, m)),
    data1 = d3.layout.stack().offset("wiggle")(stream_waves(n, m)),
    color = d3.interpolateRgb("#aad", "#556");

var width = 960,
    height = 500,
    mx = m - 1,
    my = d3.max(data0.concat(data1), function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    });

var area = d3.svg.area()
    .x(function(d,i) { return i * width / mx; })
    .y0(function(d) { return height - d.y0 * height / my; })
    .y1(function(d) { return height - (d.y + d.y0) * height / my; });

function render_streamgraph(color_scheme) {
  var vis = d3.select("#chart")
    .append("svg")
      .attr("width", width)
      .attr("height", height);

    vis.selectAll("path")
    .data(data0)
  .enter().append("path")
    .style("fill", function(d,i) { 
      return color_scheme[i]; 
    })
    .attr("d", area);
  }
 
function alter_color(color_scheme) {
  d3.select("#chart svg").selectAll("path")
  .transition()
  .duration(50)
  .style('fill',function(d,i) { 
      return color_scheme[i]; 
    });
}


function transition() {
  gIndex = ++gIndex >= generators.length ? 0 : gIndex;
  generator = generators[gIndex];
  
  d3.selectAll("path")
//      .data(function() {
//        var d = data1;
//        data1 = data0;
//        return data0 = d;
//      })
  	.data(data0)
    .transition()
      .duration(50)
      .attr("d", area);
}

function stream_index(d, i) {
  return {x: i, y: Math.max(0, d)};
}

