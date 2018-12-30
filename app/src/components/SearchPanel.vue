<style lang="scss" scoped>
  .full-size {
    width: 100%;
    height: 100%;
  }

  .search-panel {
    height: 400px;

    .input {
      width: 100%;
    }

    .actions {
      width: 100%;
    }

    .button {
      width: 100%;
    }
  }
</style>

<template lang="pug">
  v-content
    v-layout.search-panel(align-center justify-center)
      v-flex(lg6 md8 sm10 xs12)
        v-form.form
          v-layout(column align-center)
            v-text-field.input.headline(
            single-line
            clearable
            height="48"
            placeholder="search gallery name"
            )
            v-layout.actions(justify-space-around)
              v-flex(lg4)
                v-btn.button(color="info") Search Now
              v-flex(lg4)
                v-btn.button(color="info") Random
    v-divider
</template>

<script>
  export default {
    name: "SearchPanel",
    props: {},
    computed: {},
    methods: {
      debug(params) {
        console.log(params)
      },
    },
    data() {
      return {};
    }
  }
</script>
