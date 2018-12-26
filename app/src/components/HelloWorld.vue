<style scoped lang="scss">

</style>

<template lang="pug">
  v-container
    v-layout(
    text-xs-center
    wrap
    )
      v-flex(xs12)
        v-img.my-3(
        :src="require('../assets/logo.svg')"
        contain
        height="200"
        )
      v-flex(mb-4)
        h1.display-2.font-weight-bold.mb-3 Welcome to Vuetify
        p.subheading.font-weight-regular For help and collaboration with other Vuetify developers,
          br
          | please join our online
          a(href="https://community.vuetifyjs.com" target="_blank") &nbsp;Discord Community
      v-flex(
      mb-5
      xs12
      )
        h2.headline.font-weight-bold.mb-3 What's next?

        v-layout(justify-center)
          a.subheading.mx-3(
          v-for="(next, i) in whatsNext"
          :key="i"
          :href="next.href"
          target="_blank"
          ) {{ next.text }}

      v-flex(
      xs12
      mb-5
      )
        h2.headline.font-weight-bold.mb-3 Important Links
        v-layout.subheading.mx-3(justify-center)
          a(
          v-for="(link, i) in importantLinks"
          :key="i"
          :href="link.href"
          target="_blank"
          ) {{ link.text }}

      v-flex(
      xs12
      mb-5
      )
        h2.headline.font-weight-bold.mb-3 Ecosystem
        v-layout(justify-center)
          a.subheading.mx-3(
          v-for="(eco, i) in ecosystem"
          :key="i"
          :href="eco.href"
          target="_blank"
          )  {{ eco.text }}
</template>

<script>
  export default {
    data: () => ({
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuetifyjs.com',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer',
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/layout/pre-defined',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
    }),
  }
</script>

