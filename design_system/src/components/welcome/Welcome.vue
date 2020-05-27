<template>
<div>
    <marquee behavior="scroll" scrollamount="20">{{text}}</marquee>
       <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div id="main3"></div>
   
</div>
</template>

<script>
import './Welcome.css'
import Welcome from './Welcome'
export default Welcome
</script>
