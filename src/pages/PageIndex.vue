<template lang="pug">
  div(class='main-container')
    div(class='logo-container')
      img(src="../assets/images/logo.svg")
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
import { isNaN } from "lodash";
import TmFormGroup from "../components/TmFormGroup";
import TmFormStruct from "../components/TmFormStruct";
import TmBtn from "../components/TmBtn";
import TmField from "../components/TmField";

export default {
  name: "page-index",
  components: {
    TmFormGroup,
    TmFormStruct,
    TmBtn,
    TmField
  },
  data: () => ({
    query: ``
  }),
  methods: {
    search() {
      if (isNaN(Number(this.query))) {
        this.$router.push({ path: `/tx/${this.query}` });
      } else {
        this.$router.push({ path: `/blocks/${this.query}` });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.main-container
  width 100%
  height 100%
  position  relative
  background  #2043b5

.logo-container
  position absolute
  top 360px
  left 50%
  margin-left -132px

input:-webkit-autofill
  -webkit-text-fill-color #fff !important
  transition background-color 5000s ease-in-out 0s

.main-container .tm-form
  display block
  margin 0 auto
  width 640px
  top 50%

.main-container .tm-form-group__field
  position relative
  width 100%

.main-container .tm-form-group input
  border 0px
  border-bottom 1px solid #FFFFFF
  font-family Gotham
  font-size 22px
  height 45px
  line-height 45px
  color #FFFFFF
  background #2043b5


.main-container .tm-form-group input::-webkit-input-placeholder
  color #ffffff
  opacity 0.3
  letter-spacing -0.3px

.main-container .tm-form-group input:-moz-placeholder
  color #ffffff
  opacity 0.3
  letter-spacing -0.3px

.main-container .tm-form-group input::-moz-placeholder
  color #ffffff
  opacity 0.3
  letter-spacing -0.3px

.main-container .tm-form-group input:-ms-input-placeholder
  color #ffffff
  opacity 0.3
  letter-spacing -0.3px

.main-container .tm-btn
  position absolute
  right 14px
  top 18px

.main-container .tm-btn span
  background transparent

.main-container .tm-btn i
  font-size 24px
  height 30px

@media screen and (max-width: 375px)
  .main-container .tm-form-group input::-webkit-input-placeholder
    font-size 14px

  .main-container .tm-form-group input:-moz-placeholder
    font-size 14px

  .main-container .tm-form-group input::-moz-placeholder
    font-size 14px

  .main-container .tm-form-group input:-ms-input-placeholder
    font-size 14px
</style>
