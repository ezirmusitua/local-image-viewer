<style lang="scss" scoped>
  @import '../styles/color';

  .progress-container {
    z-index: 1;
    position: fixed;
    height: 100%;
    width: 6px;
    background-color: transparent;

    .progress__inner {
      border-radius: inherit;
      background-color: $color-green__primary;
      width: inherit;
    }
  }
</style>

<template lang="pug">
  div.progress-container
    div.progress__inner(:style="{height: progressPercentage}")
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class VerticalProgress extends Vue {
    @Prop() private progressPercentage!: string;
  }
</script>
