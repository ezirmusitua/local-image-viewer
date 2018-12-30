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
  import { SessionAPIs, SessionResource } from '@/resources/session';

  @Component({
    components: {
      GalleryList,
      SearchPanel,
    },
  })
  export default class Home extends Vue {
    mounted() {
      this.debug();
    }

    async debug() {
      const sessions = await SessionResource.request(SessionAPIs.LIST)
      console.log(sessions)
    }
  }
</script>
