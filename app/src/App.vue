<style lang="scss">
  html {
    overflow-y: auto;
  }

  .container {
    padding: 0;

    main {
      padding: 0;
    }
  }
</style>

<template lang="pug">
  v-app
    //v-toolbar(app)
    v-container.container(fluid)
      keep-alive
        router-view(:key="$route.fullPath")
    //v-footer(app)
</template>
