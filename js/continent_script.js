var formatYAxis = function(d) {return d/1000000;}
var margin = {top: 20, right: 80, bottom: 30, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.format("d"))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatYAxis);

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.arable); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("json/reqThree.json", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));


  var continents = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {year: d.year, arable: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.year; }));

  y.domain([
    d3.min(continents, function(c) { return d3.min(c.values, function(v) { return v.arable; }); }),
    d3.max(continents, function(c) { return d3.max(c.values, function(v) { return v.arable; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Arable land by Continent (in million hectares)");

  var city = svg.selectAll(".city")
      .data(continents)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });


      var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .attr("transform", "translate(50,-10)");

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; })
      .attr("transform", "translate(50,-10)");;

});
