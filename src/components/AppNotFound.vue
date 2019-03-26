<template lang="pug">
  div
    h1 Search not found
    p Sorry, we are unable to find #[span “keyword”] in  terra space.
    p Please input correct block number or transaction hash.
    img(src="../assets/images/earth.svg")
    router-link(to="/" exact): span Back to Home
</template>

<script>
export default {
  name: "app-not-found"
};
</script>

<style lang="stylus" scoped>
h1
  margin-top 220px
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
  line-height: 1.56;
  letter-spacing: -0.2px;
  text-align: center;
  color #2845ae

p span
  color: #5493f7;

img
  display block
  margin 60px auto

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

@media screen and (max-width: 900px)
  h1
    margin-top 90px
    margin-bottom 15px
    font-size 26px
  p
    font-size 15px
    padding 0 30px
    display inline-block

  img
    width 250px
</style>
