<template lang="pug">
  div.home
    SearchPanel
    HelloWorld
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import HelloWorld from '../components/HelloWorld.vue';
  import SearchPanel from '../components/SearchPanel.vue';

  @Component({
    components: {
      HelloWorld,
      SearchPanel,
    },
  })
  export default class Home extends Vue {
  }
</script>
