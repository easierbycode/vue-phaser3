<template>
  <div id="app">
    <img alt="Vue logo" src="./game/assets/vue-logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + Vuex + Phaser3 + TypeScript App"/>
    <Game />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import Game from './components/Game.vue';

@Component({
  components: {
    HelloWorld,
    Game,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
