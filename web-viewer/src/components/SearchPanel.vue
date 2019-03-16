<style lang="scss" scoped>
  .full-size {
    width: 100%;
    height: 100%;
  }

  .search-panel {
    height: 320px;

    .container {
      height: 100%;
      width: 100%;
    }

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
  div.search-panel.px-2.py-4
    v-layout.container(align-center justify-center)
      v-flex(lg8 md10 sm10 xs12)
        h4.display-1 View Images In Your Computer
        v-form.form
          v-layout(column align-center)
            v-text-field.input.headline(
            v-model="filter.name"
            single-line
            clearable
            height="48"
            placeholder="search collection name"
            )
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {State} from 'vuex-class';
  import {HOME_STORE_NAME} from '@/stores/home';

  @Component({})
  export default class SearchPanel extends Vue {
    @State('filter', {namespace: HOME_STORE_NAME}) public filter!: object;
  }
</script>
