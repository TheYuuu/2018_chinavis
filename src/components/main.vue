<template>
    <div id="graph" style="height:100%;width:100%"></div>    
</template>
<script type="text/javascript" src="../assets/d3.layout.cloud.js"></script>
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
    d3.json("../static/tree.json",function(data){
    !(function(){
    "use strict"

    var width,height
    var chartWidth, chartHeight
    var margin
    var my_svg = d3.select("#graph").append("svg");
    var svg=my_svg.append("g")


    my_main(data)
    
    function my_main(x) {
        function search(node){
        node.r=15/node.level;
        node.label=count;
        count++;
        nodes.push({"index":node.label,"level":node.level,"name":node.name,"r":node.r,"type":node.type,});

        if (node.children!=undefined){
            node.children.forEach(function(item){
                search(item);
               links.push({"source":node.label,"target":item.label})
            })
            }
        } 


        var nodes=[];
        var links=[];
        var count=0;
        search(x)

        var data={
            nodes:nodes,
            links:links
        }
       
        setSize(data)
        drawChart(data)    
    }
    


    function setSize(data) {
        width = document.querySelector("#graph").clientWidth
        height = document.querySelector("#graph").clientHeight
    
        margin = {top:0, left:0, bottom:0, right:0 }
        
        
        chartWidth = width - (margin.left+margin.right)
        chartHeight = height - (margin.top+margin.bottom)
        
        my_svg.attr("width", width).attr("height", height)   
            
    }
    
    function drawChart(data) {
        
/*        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id( function(d) {return d.index }))
            .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
            .force("charge", d3.forceManyBody(-10))
            .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0))*/


            var simulation = d3.forceSimulation(data.nodes)
            .force("charge", d3.forceManyBody(-10))
            .force("link", d3.forceLink(data.links).distance(50).strength(1))
            .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
            .force("x", d3.forceX(0))
            .force("y", d3.forceY(0));
    
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("stroke", "black")

        
        var color=[];
        color["Boss"]="red";
        color["development1"]="#1d94fa";
        color["development2"]="#1d94fa";
        color["development3"]="#1d94fa";
        color["finance"]="#FAA24B";
        color["HR"]="green";

        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("color","white")

        var node_g = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(data.nodes)
            .enter()
            .append('g')
            .attr("class", function(d){
                 return +d.type
            })            
            .style("cursor","hand")
            .on("mousedown",function(d){
                that.selectnode(d);
            })
            .on("mouseover", function(d){ 
                tooltip.html("ID:"+d.name+"<br>"+"Depart:"+d.type);
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(d){ 
                tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
            })
            .on("mouseout", function(d){ 
                tooltip.style("visibility", "hidden")
            })

            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


         var node=node_g.append("circle")
            .attr("class",function(d){  return "circle_"+d.type })
            .attr("r", function(d){  return d.r })
            .attr("fill",function(d){
                if (d.type.indexOf("Boss")!=-1)
                    return color["Boss"];
                else if (d.type.indexOf("development1")!=-1)
                    return color["development1"];
                else if (d.type.indexOf("development2")!=-1)
                    return color["development2"];
                else if (d.type.indexOf("development3")!=-1)
                    return color["development3"];
                else if (d.type.indexOf("finance")!=-1)
                    return color["finance"];
                else if (d.type.indexOf("HR")!=-1)
                    return color["HR"];
            })
            .attr("stroke",function(d){
                 if(d.level==2)
                    return "white"
                else if (d.level==3 && d.type.indexOf("development")!=-1)
                    return "#ffff00"
            })            


            var texts=node_g.selectAll("text")
                    .append("text")


        var ticked = function() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; })

            node_g.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"})
    
        }  
        simulation
            .nodes(data.nodes)
            .on("tick", ticked);
    
        simulation.force("link")
            .links(data.links);   


        var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

        zoom_handler(my_svg);  
        
        
        
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        } 

        function zoom_actions(){
        svg.attr("transform", d3.event.transform)
}

                

    }
}());
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