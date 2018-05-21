<template>
  <div id="wordcloud" style="height:100%;width:100%">
    <div id="wordcloud_send" style="height:50%;width:100%"></div>
    <hr>
    <div id="wordcloud_rec" style="height:50%;width:100%"></div>
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
    props:{
      my_node:{
        type:Object,
        default:function(){
          return {"name":"asdasd"}
        }
      },
      my_timerange:{
        type:Array,
        default:function(){
          return [1,2]
        }
      }
    },
    methods:{
    drawwordcloud (node){
      let that=this;

      that.drawcloud(this.$store.getters.getEmail_person[node.type].send.slice(0,50),'wordcloud_send')
      that.drawcloud(this.$store.getters.getEmail_person[node.type].rec.slice(0,50),'wordcloud_rec')
    },
    drawcloud(newdata,divname){
          var chart = echarts.init(document.getElementById(divname));

          var option = {
              color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
              tooltip: {},
              series: [ {
                  type: 'wordCloud',
                  gridSize: 2,
                  sizeRange: [20, 60],
                  rotationRange: [-90, 90],
                  shape: 'pentagon',
                  width: 700,
                  height: 350,
                  drawOutOfBound: true,
                  textStyle: {
                      normal: {
                          color: function () {
                              return 'rgb(' + [
                                  Math.round(Math.random() * 160),
                                  Math.round(Math.random() * 160),
                                  Math.round(Math.random() * 160)
                              ].join(',') + ')';
                          }
                      },
                      emphasis: {
                          shadowBlur: 10,
                          shadowColor: '#333'
                      }
                  },
                  data:[]
              } ]
          };
          option.series[0].data = newdata;
          chart.setOption(option);

         window.onresize = chart.resize;
    }
    },
    computed:{
     node(){
      return this.my_node
    },
    timerange(){
      return this.my_timerange
    }
  },
  mounted (){
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>