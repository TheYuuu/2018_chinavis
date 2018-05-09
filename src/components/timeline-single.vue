<template>
  <div id="con"style="height:100%;width:100%">
   <svg id="svg-filter"></svg>  
  </div>
</template>

<script>
import * as d3 from 'd3v4'
export default {
  name: 'timelinex',
  data () {
    return {
      Timedatax:[]
    }
  },
  props:{
        Timedatax1:{
            type:Array
        }
  },
  methods:{
    change(range) {
      this.$emit('timechange',range);
    }
  },
  computed:{
  },
  created (){
  },
  mounted (){
    var that=this;
      d3.csv("../static/timeline-min.csv",function(data){
        that.Timedatax=data
        TimeLine();//画时间轴
    })

     function TimeLine() {
        that.Timedatax.columns=["date","mounts"]
        var timefo=d3.timeFormat("%Y/%m/%d/%H:00");
            for (var i=0;i<that.Timedatax.length;i++)
            {
/*                var t=that.Timedatax[i].date.split("/");
                let x=t[2].split(" ");
                t[2]=x[0];
                t[3]=x[1];
                that.Timedatax[i].mounts=Number(that.Timedatax[i].mounts);
                that.Timedatax[i].date=new Date(t[0],t[1]-1,t[2],t[3]);*/

                var t=that.Timedatax[i].date.split("/");
                let x=t[2].split(" ");
                t[2]=x[0];
                t[3]=x[1].split(':')[0]
                t[4]=x[1].split(':')[1]
                that.Timedatax[i].mounts=Number(that.Timedatax[i].mounts);
                that.Timedatax[i].date=new Date(t[0],t[1],t[2],t[3],t[4]);
            }

            console.log(that.Timedatax)
            var sliderHeight=document.getElementById('con').offsetHeight*0.7;
            var sliderWidth = document.getElementById('con').offsetWidth;
            var Yheight=sliderHeight=document.getElementById('con').offsetHeight*0.70;
            var Yheight2=sliderHeight=document.getElementById('con').offsetHeight*0.25;

            var x = d3.scaleTime().range([0, sliderWidth]),
            x2 = d3.scaleTime().range([0, sliderWidth]),
            y = d3.scaleLinear().range([Yheight, 0]),
            y2 = d3.scaleLinear().range([Yheight2, 0]);


            var zoom = d3.zoom()
                .scaleExtent([1, 107])
                .translateExtent([[0, 0], [sliderWidth, sliderHeight]])
                .extent([[0, 0], [sliderWidth, sliderHeight]])
                .on("zoom", zoomed);


            var svgFilter = d3.select("#svg-filter");
            svgFilter.attr("width",sliderWidth)
                .attr("height",sliderHeight)


            var brush = d3.brushX()
              .extent([[0, 0], [sliderWidth, Yheight2]])
              .on("brush end", brushed)
              .on("end", function(){
                    that.change(getRangeText());
                });

            var area = d3.area()
              .curve(d3.curveMonotoneX)
              .x(function(d) { return x(d.date); })
              .y0(Yheight)
              .y1(function(d) { return y(d.mounts); });


            var area2 = d3.area()
                .curve(d3.curveMonotoneX)
                .x(function(d) { return x2(d.date); })
                .y0(Yheight2)
                .y1(function(d) { return y2(d.mounts); });

            // slider

            var sliderMargin = {
                "top" : sliderHeight*0.9,
                "bottom" : 100,
                "left" : 30,
                "right" : 550
            };

            var b=that.Timedatax[0].date;
            var e=that.Timedatax[that.Timedatax.length-1].date;

            var xYearFirst = d3.scaleTime()
                .domain([b, e])
                .range([0, sliderWidth])
                .clamp(true);

            var context = svgFilter.append("g")
                .attr("class", "context")

            var focus = svgFilter.append("g")
              .attr("class", "focus")
              .attr("transform", "translate(" + 0 + "," + Yheight + ")");




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

              x.domain(d3.extent(that.Timedatax, function(d) { return d.date; }));
              y.domain([0, d3.max(that.Timedatax, function(d) { return d.mounts; })]);

              x2.domain(x.domain());
              y2.domain(y.domain());

              var xAxis = d3.axisBottom(x),
                xAxis2 = d3.axisBottom(x2);

            context.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(-10," + Yheight + ")")
                .attr("stroke","white")
                .call(xAxis);



            context.append("path")
                  .datum(that.Timedatax)
                  .attr("class", "area")
                  .attr("d", area);

            svgFilter.append("rect")
                  .attr("class", "zoom")
                  .attr("width", sliderWidth)
                  .attr("height", Yheight)
                  .call(zoom);
            //-------------------------------------
            focus.append("path")
                .datum(that.Timedatax)
                .attr("class", "area")
                .attr("d", area2);

            focus.append("g")
                .attr("class", "axis axis--x")
                .attr("stroke","white")
                .attr("transform", "translate(0," + (Yheight2) + ")")
                .call(xAxis2);

            focus.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());


            var handle1 = focus.select(".brush").select(".handle--w");
            var handle2 = focus.select(".brush").select(".handle--e");
            
            function getRangeText() {
                var handle1 = focus.select(".brush").select(".handle--w");
                var handle2 = focus.select(".brush").select(".handle--e");
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

            function brushed() {
              updateFilterText();
              if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
              var s = d3.event.selection || x2.range();
              x.domain(s.map(x2.invert, x2));
              context.select(".area").attr("d", area);
              context.select(".axis--x").call(xAxis);

              svgFilter.select(".zoom").call(zoom.transform, d3.zoomIdentity
                  .scale(sliderWidth / (s[1] - s[0]))
                  .translate(-s[0], 0));
            }


            function zoomed() {
              if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
              var t = d3.event.transform;
              x.domain(t.rescaleX(x2).domain());
              context.select(".area").attr("d", area);
              context.select(".axis--x").call(xAxis);

             focus.select(".brush").call(brush.move, x.range().map(t.invertX, t));
              updateFilterText();
            }

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
