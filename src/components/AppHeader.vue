<template lang="pug">
  div(class='header')
    div(class='logo-container')
      router-link(to="/" exact): img(src="../assets/images/logo.svg")
    tm-form-struct(:submit="search")
      tm-form-group
        .tm-modal-search
          tm-field#search-input(
            type="text"
            placeholder="Search by block number, transaction hash"
            required
            v-model="query"
            autocomplete="off"
            title="1 to 60 characters")
          tm-btn(type="submit" icon="search")
</template>

<script>
import { mapGetters } from "vuex";
import TmFormGroup from "./TmFormGroup";
import TmFormStruct from "./TmFormStruct";
import TmBtn from "./TmBtn";
import TmField from "./TmField";
export default {
  name: "app-header",
  components: {
    TmFormGroup,
    TmFormStruct,
    TmBtn,
    TmField
  },
  data: () => ({
    query: ``
  }),
  computed: {
    ...mapGetters(["config"])
  },
  methods: {
    search() {
      if (isNaN(Number(this.query))) {
        this.$router.push({ path: `/transaction/${this.query}` });
      } else {
        this.$router.push({ path: `/blocks/${this.query}` });
      }
    }
  },
  mounted() {}
};
</script>

<style lang="stylus">
@require '../styles/variables'

.header
  position relative
  background #2043b5

.header .logo-container
  padding 26px 40px
  display inline-block

.header .logo-container img
  width 160px
  height 25px

.header .tm-form
  position absolute
  top 20px
  right 40px
  display inline-flex
  height 40px

.header .tm-form-group__field
  position relative

.header .tm-form-group
  padding 0

.header .tm-form-group input::-webkit-input-placeholder
  color #ffffff
  opacity 0.3

.header .tm-form-group input:-moz-placeholder
  color #ffffff
  opacity 0.3

.header .tm-form-group input::-moz-placeholder
  color #ffffff
  opacity 0.3

.header .tm-form-group input:-ms-input-placeholder
  color #ffffff
  opacity 0.3

.header .tm-form-group input
  border 0px
  border-bottom 1px solid #FFFFFF
  font-family Gotham
  font-size 16px
  height 40px
  line-height 40px
  color #FFFFFF
  background #2043b5

.header .tm-btn
  position absolute
  right: 10px;
  bottom: 1px;

.header .btn__container
  background-color: #ffffff !important

@media screen and (max-width: 900px)
  .header
    display flex
    flex-direction column

  .header .logo-container
    display block

  .header .tm-form-group input
    border-bottom : solid 1px #2043b5;

  .header .tm-form
    top 80px


  .header .tm-form-group input::-webkit-input-placeholder
    color: #2043b5;

  .header .tm-form-group input:-moz-placeholder
    color: #2043b5;

  .header .tm-form-group input::-moz-placeholder
    color: #2043b5;

  .header .tm-form-group input:-ms-input-placeholder
    color: #2043b5;

  .header
    background #ffffff

  .header .logo-container
    height 45px
    line-height 45px
    padding 0
    display flex
    flex-direction row
    justify-content center
    align-items center
    background #2043b5

  .header .logo-container img
    height 18px
    width 115px

  .header .tm-form
    position inherit
    top 0
    right 0
    justify-self center
    align-self center
    padding 20px 15px

@media screen and (min-width: 900px)
  .header .tm-form
    width 640px
</style>
