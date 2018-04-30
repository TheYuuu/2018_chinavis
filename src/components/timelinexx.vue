<template>
  <div id="con"style="height:100%;width:100%">
   <svg></svg>
  </div>
</template>

<script>
import * as d3 from 'd3v4'
export default {
  name: 'timeline',
  data () {
    return {
    }
  },
  props:{
        Timedatax:{
            type:Array
        }
  },
  methods:{
    change(range) {
      this.$emit('timechange',range);
    }
  },
  computed:{
        timedate (){
            return this.Timedatax;
        }
  },
  mounted (){
    var that=this;

    var sliderHeight=document.getElementById('con').offsetHeight*0.7;
    var sliderWidth = document.getElementById('con').offsetWidth;
    console.log(sliderHeight)

    var svg = d3.select("svg");
    var sliderHeight=document.getElementById('con').offsetHeight*0.7;
    var sliderWidth = document.getElementById('con').offsetWidth;

      svg.attr("width",sliderWidth)
      .attr("height",sliderHeight)


var parseDate = d3.timeParse("%b %Y");

var Yheight=sliderHeight=document.getElementById('con').offsetHeight*0.75;

var x = d3.scaleTime().range([0, sliderWidth]),
    x2 = d3.scaleTime().range([0, sliderWidth]),
    y = d3.scaleLinear().range([Yheight, 0]),
    y2 = d3.scaleLinear().range([Yheight, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

/*var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);*/

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [sliderWidth, Yheight]])
    .extent([[0, 0], [sliderWidth, Yheight]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(Yheight)
    .y1(function(d) { return y(d.price); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.date); })
    .y0(Yheight)
    .y1(function(d) { return y2(d.price); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", sliderWidth)
    .attr("height", Yheight);

var focus = svg.append("g")
    .attr("class", "focus")

/*var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");*/

d3.csv("../static/sp500.csv", type, function(error, data) {
  if (error) throw error;
  
  console.log(data)

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.price; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

/*  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);*/

/*  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());*/

  svg.append("rect")
      .attr("class", "zoom")
      .attr("width", sliderWidth)
      .attr("height", sliderHeight)
      .call(zoom);
});

/*function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);

  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}*/

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());

  focus.select(".area").attr("d", area);
  console.log(d3.select(".area"))
/*  focus.select(".axis--x").call(xAxis);*/
/*  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));*/
}

function type(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#svg-filter {
    width: 100%;
    height: 100%;
}
</style>
