<style scoped lang="scss">
  @import './styles/color.scss';

  .container {
    padding: 0;
    background-image: linear-gradient(120deg, $color-bg-grey__primary, $color-bg-grey__secondary);

    main {
      padding: 0;
    }
  }
</style>

<template lang="pug">
  v-app(dark)
    v-toolbar(app)
      v-breadcrumbs(large :items="navBreadcrumb" divider=">")
    v-container.container(fluid)
      keep-alive
        router-view(:key="$route.fullPath")
    //v-footer(app)
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';

  @Component({})
  export default class App extends Vue {
    private navBreadcrumb = [];

    @Watch('$route', {immediate: true, deep: true})
    onRouteChanged(newRoute) {
      this.navBreadcrumb = newRoute.meta.breadcrumb;
    }
  }
</script>

