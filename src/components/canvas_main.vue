<template>
    <div id="graph" style="height:100%;width:100%">
        <canvas width="1000" height="598"></canvas>
    </div>    
</template>

<script>
import * as d3 from 'd3v4'

export default {
  name: 'my_main',
  data () {
    return {
    }
  },
  methods:{
  },
  mounted (){
    d3.json("../static/tree.json",function(data){
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
        search(data)

        var data={
            nodes:nodes,
            links:links
        }

/*        var nodes = d3.range(1000).map(function(i) {
          return {
            index: i
          };
        });

    var links = d3.range(nodes.length - 1).map(function(i) {
      return {
        source: Math.floor(Math.sqrt(i)),
        target: i + 1
      };
    });*/

    console.log(nodes)
    console.log(links)

    var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(links).distance(20).strength(1))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .on("tick", ticked);

var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height;

d3.select(canvas)
    .call(d3.drag()
        .container(canvas)
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

function ticked() {
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);

      context.beginPath();
      links.forEach(drawLink);
      context.strokeStyle = "#aaa";
      context.stroke();

      context.beginPath();
      nodes.forEach(drawNode);
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      context.restore();
    }

    function dragsubject() {
      return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
    }

    function dragstarted() {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;
    }

    function dragged() {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }

    function dragended() {
      if (!d3.event.active) simulation.alphaTarget(0);
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }

    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    function drawNode(d) {
      context.moveTo(d.x + 3, d.y);
      context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
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
