<template>
  <div id="inf" style="height:100%;width:100%">
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
    },
    computed:{
    },
    mounted (){
      var dom = document.getElementById("inf");
      var myChart = this.$echarts.init(dom);
      var app = {};
      var option = null;

      var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
      '7a', '8a', '9a','10a','11a',
      '12p', '1p', '2p', '3p', '4p', '5p',
      '6p', '7p', '8p', '9p', '10p', '11p'];
      var days = ['Saturday', 'Friday', 'Thursday',
      'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

      var data = [[0,23,10],[0,1,10],[0,10,10]];

      option = {
          textStyle:{
            color:"white"
          },
/*        title: {
          text: 'Punch Card of Github',
          link: 'https://github.com/pissang/echarts-next/graphs/punch-card'
        },*/
        legend: {
          data: ['Punch Card'],
          left: 'right'
        },
        polar: {},
        tooltip: {
          formatter: function (params) {
            return params.value[2] + ' commits in ' + hours[params.value[1]] + ' of ' + days[params.value[0]];
          }
        },
        angleAxis: {
          type: 'category',
          data: hours,
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'white',
              type: 'dashed'
            }
          },
          axisLine: {
            show: false
          }
        },
        radiusAxis: {
          type: 'category',
          data: days,
          axisLine: {
            show: false
          },
          axisLabel: {
            rotate: 45
          }
        },
        series: [{
          name: 'Punch Card',
          type: 'scatter',
          coordinateSystem: 'polar',
          symbolSize: function (val) {
            return val[2] * 2;
          },
          data: data,
          animationDelay: function (idx) {
            return idx * 5;
          }
        }]
      };;
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
    }
  }
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

</style>
