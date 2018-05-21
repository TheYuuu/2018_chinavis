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
      drawpunch(node){
        let that=this;
        if (node.type.indexOf("HR")!=-1)
        {
          that.draw(this.$store.getters.getECheck_person["HR"])
        }
        else if (node.type.indexOf("finance")!=-1)
        {
          that.draw(this.$store.getters.getECheck_person["finance"])
        }
        else if (node.type.indexOf("Boss")!=-1)
        {
          that.draw(this.$store.getters.getECheck_person["Boss"])
        }
        else {
          var t=node.type.split("_");
          if (node.type.indexOf("Depart")!=-1)
          {
            that.draw(this.$store.getters.getECheck_person[t[0]])
          }
          else
          {
            that.draw(this.$store.getters.getECheck_person[t[0]+"_"+t[1]])
          }
        }
      },
      draw(nodedata){

          var dom = document.getElementById("inf");
          var myChart = this.$echarts.init(dom);
          var app = {};
          var option = null;

          var hours = ['00', '01', '02', '03', '04', '05', '06',
          '07', '08', '09','10','11',
          '12', '13', '14', '15', '16', '17',
          '18', '19', '20', '21', '22', '23'];

          var days = ['Saturday', 'Friday', 'Thursday',
          'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

          var timerecord=[];

          hours.forEach(function(num,index){
            timerecord[num]=index
          })

          var data_in=[];
          var data_out=[];

          for (let i=0;i<nodedata.length;i++)
         {
            if (nodedata[i].checkin==0)
              continue;

              let week=d3.timeFormat("%A")(new Date(nodedata[i].checkin))
              let hour=d3.timeFormat("%H")(new Date(nodedata[i].checkin))

              if (data_in[week]==undefined)
                {
                  data_in[week]=[]
                }

              if (data_in[week][hour]==undefined)
                  {
                    data_in[week][hour]=0
                  }

              if (typeof data_in[week][hour] == 'number')
               { 
                data_in[week][hour]++;
              }


           if (nodedata[i].checkout==0)
              continue;
            week=d3.timeFormat("%A")(new Date(nodedata[i].checkout))
            hour=d3.timeFormat("%H")(new Date(nodedata[i].checkout))

            if (data_out[week]==undefined)
              {
                data_out[week]=[]
              }

            if (data_out[week][hour]==undefined)
                {
                  data_out[week][hour]=0
                }

            if (typeof data_out[week][hour] == 'number')
             { 
              data_out[week][hour]++;
            }
          }


          var data1=[];
          var counts=0;
          for (let key in data_in)
          {
            for (let keys in data_in[key])
            {
              counts+=data_in[key][keys];
              data1.push([get1(key),timerecord[keys],data_in[key][keys]])
            }
          }

          data1.forEach(function(item){
            item[2]=item[2]/counts*100
          })



          var data2=[];
          var counts=0;
          for (let key in data_out)
          {
            for (let keys in data_out[key])
            {
              counts+=data_out[key][keys];
              data2.push([get1(key),timerecord[keys],data_out[key][keys]])
            }
          }

          data2.forEach(function(item){
            item[2]=item[2]/counts*100
          })

          function get1(str)
          {
            switch(str)
            {
              case 'Saturday':return 0;
              case 'Friday':return 1;
              case 'Thursday':return 2;
              case 'Wednesday':return 3; 
              case 'Tuesday':return 4;
              case 'Monday':return 5;
              case 'Sunday':return 6;
            }
          }

          option = {
             color:['#F2959F','#5DB3DF'],
              textStyle:{
                color:"white"
              },
            legend: [
            {
             textStyle:{
                color:"white"
              },
              data: ['Check_in'],
              left: 'left'
            },
            {
             textStyle:{
                color:"white"
              },
              data: ['Check_out'],
              left: 'right'
            },
            ],
            polar: {},
            tooltip: {
              formatter: function (params) {
                return params.value[2].toFixed(2) + '%: ' + hours[params.value[1]] + ' in ' + days[params.value[0]];
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
              name: 'Check_in',
              type: 'scatter',
              coordinateSystem: 'polar',
              symbolSize: function (val) {
                return val[2] * 2;
              },
              data: data1,
              normal:{color:'white'},
              animationDelay: function (idx) {
                return idx * 5;
              }

            },
            {
              name: 'Check_out',
              type: 'scatter',
              coordinateSystem: 'polar',
              symbolSize: function (val) {
                return val[2] * 2;
              },
              data: data2,
              normal:{color:'white'},
              animationDelay: function (idx) {
                return idx * 5;
              }
            }]
          };;
          if (option && typeof option === "object") {
            myChart.setOption(option, true);
          }
          }
    },
    computed:{
    },
    mounted (){
     
    }
  }
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

</style>