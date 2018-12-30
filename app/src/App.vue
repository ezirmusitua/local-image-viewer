<style lang="scss">
  main {
    padding: 0;
  }
</style>

<template lang="pug">
  v-app
    v-toolbar(app)
    v-content
      v-container(fluid)
        router-view
    v-footer(app)
</template>

<script>
  import { Component, Vue } from 'vue-property-decorator';

  @Component({})
  export default class App extends Vue {
  }
</script>
