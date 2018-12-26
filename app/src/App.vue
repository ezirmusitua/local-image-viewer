<template lang="pug">
  v-app
    v-toolbar(app)
      v-toolbar-title(class="headline text-uppercase")
        span Vuetify
        span(class="font-weight-light") MATERIAL DESIGN
      v-spacer
      v-btn(flat)
        router-link(to="/") Home
      v-btn(flat)
        router-link(to="/about") About
      v-btn(
      flat
      href="https://github.com/vuetifyjs/vuetify/releases/latest"
      target="_blank"
      )
        span(class="mr-2") Latest Release
        v-icon mdi-open-in-new
    v-content
      router-view
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
