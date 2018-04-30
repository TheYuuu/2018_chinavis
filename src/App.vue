<template>
  <div id="app">
    <div id="main_view">
      <my_main  @nodeselect="nodeselect"></my_main>
    </div>
    <div id="Inf_view">
      <Inf :my_node="node" :my_timerange="my_timerange"></Inf>
    </div>
    <div id="timeline">
      <timeline  @timechange="timechange" :Timedatax="timerange"></timeline>
    </div>
  </div>
</template>

<script>
import timeline from './components/timeline'
import my_main from './components/main'
import Inf from './components/Inf'

export default {
  name: 'App',
  data(){
    return {
      node:{},
      my_timerange:[],
      timerange:[{"date":"2017/11/02","mounts":100},{"date":"2017/11/03","mounts":98},{"date":"2017/11/04","mounts":28},{"date":"2017/11/05","mounts":80},{"date":"2017/11/08","mounts":207},{"date":"2017/11/09","mounts":24},{"date":"2017/11/10","mounts":35},{"date":"2017/11/11","mounts":51},{"date":"2017/11/12","mounts":239},{"date":"2017/11/13","mounts":130},{"date":"2017/11/14","mounts":449},{"date":"2017/11/15","mounts":657},{"date":"2017/11/16","mounts":171},{"date":"2017/11/17","mounts":157},{"date":"2017/11/18","mounts":718},{"date":"2017/11/19","mounts":149},{"date":"2017/11/20","mounts":60},{"date":"2017/11/21","mounts":65},{"date":"2017/11/22","mounts":4},{"date":"2017/11/23","mounts":92},{"date":"2017/11/25","mounts":20},{"date":"2017/11/26","mounts":64},{"date":"2017/11/27","mounts":69},{"date":"2017/11/28","mounts":78},{"date":"2017/11/29","mounts":70},{"date":"2017/11/30","mounts":40},{"date":"2017/12/01","mounts":34},{"date":"2017/12/02","mounts":29},{"date":"2017/12/03","mounts":353},{"date":"2017/12/04","mounts":236},{"date":"2017/12/05","mounts":244},{"date":"2017/12/06","mounts":135},{"date":"2017/12/07","mounts":356},{"date":"2017/12/08","mounts":327},{"date":"2017/12/09","mounts":231},{"date":"2017/12/10","mounts":224},{"date":"2017/12/11","mounts":37},{"date":"2017/12/12","mounts":268},{"date":"2017/12/13","mounts":5},{"date":"2017/12/18","mounts":389}]
    }
  },
  components:{
    timeline,
    "my_main":my_main,
    Inf
  },
  methods:{
    timechange(range){
      this.my_timerange=range
      console.log(range)
    },
    nodeselect(node){
      this.node=node
      console.log(node)
    }
  },
  computed:{
    getnode(){
      return this.node
    },
    gettimerange(){
      return this.my_timerange
    }
  },
  mounted(){
    console.log()
    this.timerange=[];
  }
}
</script>

<style>
body{
  background-color: #303243;
}
*{
  margin: 0px;
  padding: 0px;
}
#app{
/*  width: 1688px;
  height: 1000px;*/
  width: 99%;
  height: 800px;
}
#main_view{
  box-sizing: border-box;
  width: 60%;
  height: 70%;
  border: 1px solid  #9A2EFE;
  float:left;
}
#Inf_view{
  box-sizing: border-box;
  width: 40%;
  height: 70%;
  border: 1px solid  #9A2EFE;
  float:right;
}
#timeline{
  box-sizing: border-box;
  clear:both;
  width: 100%;
  height: 30%;
  border: 1px solid  #9A2EFE;
}
</style>
