<style lang="scss">
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
      router-view
    //v-footer(app)
</template>
