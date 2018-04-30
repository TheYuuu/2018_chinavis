<template>
    <div id="inf" style="height:100%;width:100%">
        <p style="color:white;font-size: 2em">选中节点:{{my_node.name}}</p>
        <p style="color:white;font-size: 2em">时间范围:{{my_timerange[0]}}~{{my_timerange[1]}}</p>
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
