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

d3.json("../static/Email_depart.json",function(email){
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
        nodes.push({"index":node.label,"level":node.level,"name":node.name,"r":node.r,"subjects_in":node.subjects_in,"subjects_out":node.subjects_out,"type":node.type,});

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

        var node_g = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(data.nodes)
            .enter()
            .append('g')
            .attr("class", function(d){
                if (d.level<=2)
                    return "g_"+d.type+'_showword'
                else return "g_"+d.type
            })            
            .style("cursor","hand")
            .on("mousedown",function(d){
                that.selectnode(d);
            })
            .on("mouseover",function(d) {
                d3.selectAll("circle").attr("opacity",0.2)
                d3.selectAll("."+d.type).attr("opacity",1)
            })
            .on("mouseout",function(d){
                d3.selectAll("circle").attr("opacity",1)
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

         var node=node_g.append("circle")
            .attr("class",function(d){  return d.type; })
            .attr("r", function(d){  return d.r })
            .attr("fill",function(d){return color[d.type]})
            .attr("stroke",function(d){
                 if(d.level==2)
                    return "white"
                else if (d.level==3 && d.type.indexOf("development")!=-1)
                    return "#ffff00"
            })

             //word-cloud--------------------------
                console.log(email)


                    var color = d3.scaleLinear()
                            .domain([0,1,2,3,4,5,6,10,15,20,100])
                            .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);


                    var text_g='g_'
                    for (let key in email)
                    {
                        console.log(email[key].send)
                        text_g+=key;
                         d3.layout.cloud().size([200, 200])
                                .words(email[key].send)
                                .rotate(0)
                                .fontSize(function(d) { return d.size; })
                                .on("end", draw)
                                .start();
                    }



                    function draw(words) {
                        console.log(words)
                        d3.select('.'+text_g+'_showword')
                                .append('g')
                                .selectAll("text")
                                .data(words)
                                .enter().append("text")
                                .style("font-size", function(d) { return d.size + "px"; })
                                .style("fill", function(d, i) { return color(i); })
                                .attr("transform", function(d) {
                                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                                })
                                .text(function(d) { return d.text; });
                        text_g='g_'
                    }

        var ticked = function() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node_g.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"});
    
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
