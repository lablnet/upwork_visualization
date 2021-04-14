<template>
  <div class="">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  watch: {
    $route (to, from) {
      let title = "Upwork Visualization"
      if (typeof to.meta.title == "string")
        title = `${to.meta.title} - Upwork Visualization`
      else if (typeof to.meta.title == "function")
        title = `${to.meta.title(to)} - Upwork Visualization`
      document.title = title
    },
  },
  data() {
    return {
      top: false
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    scrollTop() {
      window.scrollTo(0, 0);
    },
    handleScroll(event) {
      if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
        this.top = true
      } else {
        this.top = false
      }
    },
  }
}
</script>
g