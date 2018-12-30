
<template lang="pug">
  div.home
    SearchPanel
    v-divider
    GalleryList
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import SearchPanel from '../components/SearchPanel.vue';
  import GalleryList from '../components/GalleryList.vue';

  @Component({
    components: {
      GalleryList,
      SearchPanel,
    },
  })
  export default class Home extends Vue {
  }
</script>
