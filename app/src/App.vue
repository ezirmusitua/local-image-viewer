<template lang="pug">
  v-app
    v-toolbar(app)
    v-content
      v-container(fluid)
        router-view
    v-footer(app)
</template>

<script>
  import HelloWorld from './components/HelloWorld'

  export default {
    name: 'App',
    components: {HelloWorld},
    data() {
      return {
        //
      }
    },
  }
</script>
