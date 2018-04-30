<template>
  <div id="con"style="height:100%;width:100%">
   <svg id="svg-filter"></svg>  
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
     function TimeLine() {
        that.Timedatax.columns=["date","mounts"]
        var timefo=d3.timeFormat("%Y/%m/%d:%H");
            for (var i=0;i<that.Timedatax.length;i++)
            {
                that.Timedatax[i].mounts=Number(that.Timedatax[i].mounts);
                that.Timedatax[i].date=new Date(that.Timedatax[i].date.split("/"));
            }
            console.log(that.Timedatax)
            var sliderHeight=document.getElementById('con').offsetHeight*0.7;
            var sliderWidth = document.getElementById('con').offsetWidth;
            var Yheight=sliderHeight=document.getElementById('con').offsetHeight*0.75;

            var x = d3.scaleTime().range([0, sliderWidth]),
            x2 = d3.scaleTime().range([0, sliderWidth]),
            y = d3.scaleLinear().range([Yheight, 0]),
            y2 = d3.scaleLinear().range([Yheight, 0]);


            var zoom = d3.zoom()
                .scaleExtent([1, Infinity])
                .translateExtent([[0, 0], [sliderWidth, sliderHeight]])
                .extent([[0, 0], [sliderWidth, sliderHeight]])
                .on("zoom", zoomed);


            var svgFilter = d3.select("#svg-filter");
            svgFilter.attr("width",sliderWidth)
                .attr("height",sliderHeight)


            // slider

            var sliderMargin = {
                "top" : sliderHeight*0.9,
                "bottom" : 100,
                "left" : 30,
                "right" : 550
            };

            var b=that.timedate[0].date;
            var e=that.timedate[that.timedate.length-1].date;

            var xYearFirst = d3.scaleTime()
                .domain([b, e])
                .range([0, sliderWidth])
                .clamp(true);

            var context = svgFilter.append("g")
                .attr("class", "context")

           var xAxis = d3.axisBottom(x)
           var yAxis = d3.axisLeft(y)

            context.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(-10," + sliderHeight + ")")
                .attr("stroke","white")
                .call(xAxis);


//文字--------------------------------------------------------------------------
            var xx = [sliderHeight-100,sliderWidth-200];

            var svgFilterText = svgFilter
                .insert("g")
                .selectAll("text")
                .data([0,1])
                .enter()
                .append("text");

            var svgFilterLabels =  svgFilterText
                .attr("x", function(d) { return xx[d]; })
                .attr("y", sliderMargin.top+65)
                .text( function (d) { return 0; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("font-weight","bold")
                .attr("fill","white")

//刷子----------------------------------------------------------------------------

            var area = d3.area()
              .curve(d3.curveMonotoneX)
              .x(function(d) { return x(d.date); })
              .y0(Yheight)
              .y1(function(d) { return y(d.mounts); });


              x.domain(d3.extent(that.timedate, function(d) { return d.date; }));
              y.domain([0, d3.max(that.timedate, function(d) { return d.mounts; })]);
              x2.domain(x.domain());
              y2.domain(y.domain());

            var brush = d3.brushX()
                .extent([[0, 0], [sliderWidth, sliderHeight]])
                .on("brush", function(){
                    updateFilterText();
                })
                .on("end", function(){
                    that.change(getRangeText());
                });

            context.append("path")
                  .datum(that.timedate)
                  .attr("class", "area")
                  .attr("d", area);

/*            svgFilter.append("rect")
                  .attr("class", "zoom")
                  .attr("width", sliderWidth)
                  .attr("height", Yheight)
                  .call(zoom);*/

            context.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range())
                .attr("transform", "translate(0," + 0 + ")")
                .call(zoom);


            var handle1 = context.select(".brush").select(".handle--w");
            var handle2 = context.select(".brush").select(".handle--e");
            
            function brushed() {
                var s = d3.event.selection || x2.range();
                x.domain(s.map(x2.invert, x2));
            }


            function getRangeText() {
                var handle1 = context.select(".brush").select(".handle--w");
                var handle2 = context.select(".brush").select(".handle--e");
                var valA = x.invert(Number(handle1.attr("x"))+3);
                var valB = x.invert(Number(handle2.attr("x"))+3);
                return [timefo(valA),timefo(valB)];
            }

            function updateFilterText() {
                var Timedataxx = getRangeText();
                var valA = +Timedataxx[0];
                var valB = +Timedataxx[1]
                redrawLabel(Timedataxx);
            }

            function redrawLabel(curVal) {
                svgFilterLabels
                    .text(function(d) { return curVal[d]; })
            }


            function zoomed() {
              if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
              var t = d3.event.transform;
              x.domain(t.rescaleX(x2).domain());
              context.select(".area").attr("d", area);
              context.select(".axis--x").call(xAxis);
              updateFilterText();
            }

            function type(d) {
              d.date = parseDate(d.date);
              d.mounts = +d.mounts;
              return d;
            }
        }
        TimeLine();
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
