<template>
  <div id="con"style="height:100%;width:100%">
    <button @click="upordaown"
      style="position:absolute;width:60px;height:20px">{{showname}}</button>
<!--    <svg id="svg-filter"></svg>   -->
  </div>
</template>

<script>
/*import * as d3 from 'd3v4'*/
export default {
  name: 'timelinex',
  data () {
    return {
      Timedatax:[],
      nowshow:true,
      showname:'down'
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
    },
    upordaown(){
      var that=this;
      d3.select('#con').select('svg').remove();
      d3.selectAll('.remove').remove();
      if (that.nowshow==true)
      {
         d3.csv("../static/up_timeline.csv",function(data){
         that.chart(that,"blue",data);
          })
         that.nowshow=false
      }
      else{
        that.nowshow=true
         d3.csv("../static/down_timeline.csv",function(data){
         that.chart(that,"blue",data);
          })
      }

    },
  chart(that,color,data) {
  var datearray = [];
  var colorrange = [];
  var sliderHeight=document.getElementById('con').offsetHeight;
  var sliderWidth = document.getElementById('con').offsetWidth;
  var Yheight=document.getElementById('con').offsetHeight*0.70;
  var Yheight2=document.getElementById('con').offsetHeight*0.25;

//-----------------------------------------------------------

  if (color == "blue") {
    colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
  }
  else if (color == "pink") {
    colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
  }
  else if (color == "orange") {
    colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
  }
  var strokecolor = colorrange[0];

  var timefo = d3.timeFormat("%Y/%m/%d/%H:00:00");

  var margin = {top: 20, right: 40, bottom: 30, left: 30};



     var tooltip =d3.select("body")
      .append("div")
      .attr("class", "remove")
      .style("position", "absolute")
      .style("z-index", "20")
      .style("visibility", "hidden")
      .style("top", "600px")
      .style("left", "55px")
      .style("font-size",'20px')
      .style("color",'white');

      var pro

      var x = d3.scaleTime().range([0, sliderWidth]).interpolate(d3.interpolateRound),
      x2 = d3.scaleTime().range([0, sliderWidth]),
      y = d3.scaleLinear().range([Yheight-20, 0]),
      y2 = d3.scaleLinear().range([Yheight2, 0]);


      var zoom = d3.zoom()
      .scaleExtent([1, 107])
      .translateExtent([[0, 0], [sliderWidth, Yheight]])
      .extent([[0, 0], [sliderWidth, Yheight]])
      .on("zoom", zoomed);

      var brush = d3.brushX()
              .extent([[0, 0], [sliderWidth, Yheight2]])
              .on("brush end", brushed)
              .on("end", function(){
                    that.change(getRangeText());
                });

      //---------------------------------------------------------

      var z = d3.scaleOrdinal(d3.schemeCategory20c);
      var xAxis = d3.axisBottom(x)
          .tickFormat(d3.timeFormat("%m-%d")),
        xAxis2 = d3.axisBottom(x2);

      var yAxisl = d3.axisLeft(y)

      var stack = d3.stack()
          .keys(['smtp','ssh','ftp','tds','mysql','mongodb','postgresql','sftp','http'])
          .order(d3.stackOrderNone)
          .offset(d3.stackOffsetNone);


      var svg = d3.select("#con")
                .append("svg")
                .attr("width",sliderWidth)
                .attr("height",sliderHeight)

        var layers = stack(data);

        x.domain(d3.extent(data, function(d) {
          return new Date(d.month); 
        }));
        y.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])

        x2.domain(x.domain());
        y2.domain(y.domain());

         var brush = d3.brushX()
              .extent([[0, 0], [sliderWidth, Yheight2]])
              .on("brush end", brushed)
              .on("end", function(){
                    that.change(getRangeText());
                });


        var area = d3.area()
          .curve(d3.curveCardinal)
          .x(function(d) {return x(new Date(d.data['month'])); })
          .y0(function(d) {return y(d[0]); })
          .y1(function(d) { return y(d[1]); });


        var area2 = d3.area()
          .curve(d3.curveCardinal)
          .x(function(d) { return x(new Date(d.data['month'])); })
          .y0(function(d) {return y2(d[0]+Yheight2); })
          .y1(function(d) { return y2(d[1]); });



        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", sliderWidth)
            .attr("height", Yheight)
            .call(zoom);


        var context = svg.append("g")
            .attr("class", "context")
/*            .call(zoom);*/

        var focus = svg.append("g")
          .attr("class", "focus")
          .attr("transform", "translate(" + 0 + "," + Yheight + ")");

        context.selectAll(".layer")
            .data(layers)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", area)
            .style("fill", function(d, i) { return z(i); });





        context.append("g") 
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," +(Yheight-20) + ")")
            .attr("stroke","white")
            .call(xAxis);

/*        context.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + (sliderWidth-2) + ", 0)")
            .attr("stroke","red")
            .call(yAxisl);*/

        //-------------------------------------

        focus.selectAll(".layer")
            .data(layers)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", area2)
            .style("fill", function(d, i) { return z(i); });



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


        context.selectAll(".layer")
          .attr("opacity", 1)
          .on("mouseover", function(d, i) {
            svg.selectAll(".layer").transition()
            .duration(250)
            .attr("opacity", function(d, j) {
              return j != i ? 0.6 : 1;
          })})

          .on("mousemove", function(d, i) {
            var mousex = d3.mouse(this)[0]+5;
            var invertedx = x.invert(mousex);

            var selected = d;

            for (var k = 0; k < selected.length; k++) {
              datearray[String(timefo(new Date(selected[k].data['month'])))] = k
            }

             pro=selected[datearray[String(timefo(invertedx))]][1].toFixed(2);

            d3.select(this)
            .classed("hover", true)
            .attr("stroke", strokecolor)
            .attr("stroke-width", "0.5px"), 
            tooltip.html( "<p>" + d.key + "<br>" + pro +'mb'+ "</p>" ).style("visibility", "visible");
            
          })
          .on("mouseout", function(d, i) {

           svg.selectAll(".layer")
            .transition()
            .duration(250)
            .attr("opacity", "1");

            d3.select(this)
            .classed("hover", false)
            .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro +'mb'+ "</p>" ).style("visibility", "hidden");
        })
          
        var vertical = d3.select("#con")
              .append("div")
              .attr("class", "remove")
              .style("position", "absolute")
              .style("z-index", "19")
              .style("width", "1px")
              .style("height", (Yheight-20)+"px")
              .style("top", "560px")
              .style("left", "0px")
              .style("background", "#fff");

            var xx = [sliderHeight-100,sliderWidth-300];

            var svgFilterText = svg
                .insert("g")
                .attr("class","textlab")
                .selectAll("text")
                .data([0,1])
                .enter()
                .append("text");

            var svgFilterLabels =  svgFilterText
                .attr("x", function(d) { return xx[d]; })
                .attr("y", 65)
                .text( function (d) { return 0; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("font-weight","bold")
                .attr("fill","white")

          updateFilterText();

        d3.select("#con")
            .on("mousemove", function(){  
               var mousex = d3.mouse(this);
               mousex = mousex[0] + 5;
               vertical.style("left", mousex + "px" )})
            .on("mouseover", function(){  
               var mousex = d3.mouse(this);
               mousex = mousex[0] + 5;
               vertical.style("left", mousex + "px")});

        function stackMax(layer) {
        return d3.max(layer, function(d) { return d[1]; });
      }

        function stackMin(layer) {
        return d3.min(layer, function(d) { return d[0]; });
      }



          function getRangeText() {
            var handle1 = focus.select(".brush").select(".handle--w");
            var handle2 = focus.select(".brush").select(".handle--e");
            var valA = x2.invert(Number(handle1.attr("x"))+3);
            var valB = x2.invert(Number(handle2.attr("x"))+3);

            return [timefo(valA),timefo(valB)];
         }

            function updateFilterText() {
                var Timedataxx = getRangeText();
                redrawLabel(Timedataxx);
            }

            function redrawLabel(curVal) {
                d3.select('.textlab').selectAll('text')
                    .text(function(d) { return curVal[d]; })
            }

            function brushed() {
              updateFilterText();
              if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
              var s = d3.event.selection || x2.range();
              x.domain(s.map(x2.invert, x2));


              context.selectAll(".layer").attr("d", area);
              context.select(".axis--x").call(xAxis);

              svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                  .scale(sliderWidth / (s[1] - s[0]))
                  .translate(-s[0], 0));
            }


            function zoomed() {
              if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
              var t = d3.event.transform;
              x.domain(t.rescaleX(x2).domain());

              if (t.k>7)
                xAxis.tickFormat(d3.timeFormat("%m/%d/%H:00"))
              else
                xAxis.tickFormat(d3.timeFormat("%m-%d"))

              context.selectAll(".layer").attr("d", area);
              context.select(".axis--x").call(xAxis);

             focus.select(".brush").call(brush.move, x.range().map(t.invertX, t));
              updateFilterText();
            }
          }
  },
  watch:{
    nowshow(){
      if (this.nowshow==false)
        this.showname='up'
      else
        this.showname='down'
    }
  },
  created (){
  },
  mounted (){
    var that=this;

    d3.csv("../static/down_timeline.csv",function(data){
      console.log(data)
      that.chart(that,"blue",data);
    })


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
