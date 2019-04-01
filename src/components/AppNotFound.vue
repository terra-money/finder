<template lang="pug">
  div(class="not-found")
    div
      h1 Search not found
      p Sorry, we are unable to find #[span "{{ keyword }}"] in  terra space.
      p Please input correct block number or transaction hash.
      img(src="https://s3.ap-northeast-2.amazonaws.com/terra.money.home/static/finder/earth.svg")
      router-link(to="/" exact): span Back to Home
</template>

<script>
export default {
  beforeCreate: function() {
    document.body.className = "page"
  },
  name: "app-not-found",
  computed: {
    keyword() {
      const key = Object.keys(this.$route.params)[0]
      return this.$route.params[key]
    }
  }
}
</script>

<style lang="stylus" scoped>
.not-found
  height: calc(100vh - 140px);
  display: table;
  width: 100%;

.not-found > div
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  padding: 100px 15px;
  box-sizing: border-box;

h1
  margin-top: 0;
  margin-bottom 20px
  font-size 40px
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: -0.8px;
  text-align: center;
  color #2043b5

p
  font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: -0.2px;
  text-align: center;
  padding: 0;
  color #2845ae
  max-width 480px
  margin 0 auto
  word-break break-word

p span
  color: #5493f7;

img
  display block
  margin 60px auto 70px
  width 480px
  height 172px

a
  display block
  margin 0px auto
  width 187px
  height 50px
  line-height 50px
  text-align center
  border-radius 25px
  box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.1)
  background-color #5493f7
  font-size: 17px;
  color: #ffffff;
  text-decoration: none;

@media screen and (max-width: 767px)
  h1
    margin-top 0
    margin-bottom 15px
    font-size 26px
  p
    font-size 15px
    padding 0 20px

  img
    margin 35px auto 50px
    width 225px
    height 81px

  a
    width 176px
    font-size: 16px;
</style>
