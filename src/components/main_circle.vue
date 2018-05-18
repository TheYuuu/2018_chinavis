<template>
    <div id="graph" style="height:100%;width:100%">
        <svg style="height:100%;width:100%"></svg>
    </div>    
</template>

<script>
    /*import * as d3 from 'd3v4'*/
    export default {
      name: 'my_main',
      data () {
        return {
        }
    },
    methods:{
        selectnode(node){
            this.$emit('nodeselect',node);
        }
    },
    computed:{
    },
    mounted (){
        var that=this;
        var svg = d3.select("#graph").select("svg"),
        margin = 20,
        diameter = +document.getElementById('graph').offsetWidth;

        var height=document.getElementById('graph').offsetHeight;

        var g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + height / 2 + ")");

        var color2 = d3.scaleLinear()
        .domain([-1, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

        var color=[]
        color["Boss"]="red";
        color["development1"]="#1d94fa";
        color["development2"]="#1d94fa";
        color["development3"]="#1d94fa";
        color["finance"]="#FAA24B";
        color["HR"]="green";

        var pack = d3.pack()
        .size([diameter,height])
        .padding(2);

        d3.json("../static/tree.json",function(root){
          root = d3.hierarchy(root)
          .sum(function(d) { return 10; })
              .sort(function(a, b) { return b.value - a.value; });

                  var focus = root,
                  nodes = pack(root).descendants(),
                  view;

                  var circle = g.selectAll("circle")
                  .data(nodes)
                  .enter().append("circle")
                  .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                      .style("fill", function(d) { 
                        if (d.data.children.length==0)
                           { 

                              return color[d.data.type]
                          }
                        else
                        return d.children ? color2(d.depth) : null; 
                  })
                    .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); })
                    .on("contextmenu",function(d){
                        that.selectnode(d.data);
                    })

                    var text = g.selectAll("text")
                      .data(nodes)
                      .enter().append("text")
                      .attr("class", "label")
                      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
                      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
                      .text(function(d) { return d.data.name.slice(0,4); });

                var node = g.selectAll("circle,text");

                  svg
                  .on("click", function() { zoom(root); });

                  zoomTo([root.x, root.y, root.r * 2 + margin]);

                  function zoom(d) {
                    var focus0 = focus; focus = d;

                    var transition = d3.transition()
                    .duration(d3.event.altKey ? 7500 : 750)
                    .tween("zoom", function(d) {
                      var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                      return function(t) { zoomTo(i(t)); };
                  });

                    transition.selectAll("text")
                    .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                    .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                    .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                    .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
                }

                function zoomTo(v) {
                    var k = diameter / v[2]; 
                    view = v;
                    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
                    circle.attr("r", function(d) { return d.r * k; });
                }



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
