<template lang="pug">
#app
  #app-content
    router-view
    app-footer
</template>

<script>
import AppFooter from "./components/AppFooter";

export default {
  name: "app",
  components: {
    AppFooter
  }
};
</script>

<style lang="stylus" src="./styles/app.styl"></style>
