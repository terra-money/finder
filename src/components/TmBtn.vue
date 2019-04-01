<template lang="pug">
router-link.tm-btn(:to='to' v-if="type === 'link'" exact)
  span(:class='btnClass')
    i(v-if='icon', :class="'tm-btn__icon material-icons'" aria-hidden='true') {{ icon }}
    span.tm-btn__value(v-if='value') {{ value }}
a.tm-btn(v-else-if="type === 'anchor'")
  span(:class='btnClass')
    i(v-if='icon', :class="'tm-btn__icon material-icons'" aria-hidden='true') {{ icon }}
    span.tm-btn__value(v-if='value') {{ value }}
button.tm-btn(:type='type' v-else)
  span(:class='btnClass')
    i(v-if='icon', :class="'tm-btn__icon material-icons'" aria-hidden='true') {{ icon }}
    img(v-if='!icon && img', :src="img" :class="'tm-btn__img'" aria-hidden='true')
    span.tm-btn__value(v-if='value') {{ value }}
</template>

<script>
export default {
  name: "tm-btn",
  computed: {
    btnClass() {
      let value = "tm-btn__container";
      if (this.iconPos) value += ` tm-btn__icon-${this.iconPos}`;
      if (this.size) value += ` tm-btn--size-${this.size}`;
      if (this.theme) value += ` tm-btn--theme-${this.theme}`;
      if (this.color) value += ` tm-btn--${this.color}`;
      return value;
    }
  },
  props: [
    "value",
    "icon",
    "icon-pos",
    "img",
    "type",
    "size",
    "theme",
    "to",
    "color"
  ]
};
</script>

<style lang="stylus">
@require '../styles/variables'

.tm-btn
  padding 0
  border none
  background transparent
  text-decoration none !important
  -webkit-appearance none
  margin 0
  display inline-block
  font-size 16px

/* firefox fix - padding */
.tm-btn::-moz-focus-inner
  padding 0
  border 0

.tm-btn__container::before,
.tm-btn__container::after
  content ''
  flex 1 0 auto

.tm-btn__container
  font-family sans
  font-size 1rem
  font-weight 400
  height 2em
  line-height 1
  color #fff
  padding 0 10px
  margin 0
  border 0
  border-radius 0.25rem
  cursor pointer
  user-select none
  display flex
  justify-content center
  align-items center
  -webkit-appearance none

.tm-btn__container:hover:enabled
  color #2043b5
  text-decoration none
  border-color rgba(0,0,0,.05)
  background #fff

.tm-btn__icon
  font-size 1em
  line-height 1

.tm-btn__icon + .tm-btn__value, .tm-btn__img + .tm-btn__value
  padding-left 0.375em

.tm-btn__img
  height 1.6em

.tm-btn__value
  line-height 1.5
  white-space nowrap
  text-overflow ellipsis
  overflow hidden

/* disabled */
.tm-btn.disabled
.tm-btn[disabled]
  opacity 0.333
  user-select none
  color rgba(0,0,0,.3) !important

  &:focus:enabled
    outline none

.tm-btn.disabled .tm-btn__container
.tm-btn[disabled] .tm-btn__container
  cursor not-allowed

/* right aligned icons */
.tm-btn__container.tm-btn__icon-right
  flex-direction row-reverse

  .tm-btn__icon + .tm-btn__value
    padding-left 0
    padding-right 0.375em

/* sizes */
.tm-btn__container.tm-btn--size-sm
  font-size 0.75em
  height 1.5rem
  line-height 1rem
  padding 0 1rem

  i.fa, i.material-icons
    font-size 0.75rem
    line-height 1
  .tm-btn__value
    font-size 0.75rem

.tm-btn__container.tm-btn--size-lg
  font-size 1.125em !important
  font-weight normal
  padding 0 1rem

.tm-btn__container.tm-btn--primary
  background #0C3694
  border-color hsla(0,0,100%,0.15)
  i.fa, i.material-icons
    color hsla(0,0,100%,0.667)
  .tm-btn__value
    color #fff

.tm-btn__container.tm-btn--success
  border-color #1DAA8E
  .tm-btn__value
    color #fff

.tm-btn__container.tm-btn--warning
  border-color #FF5561
  .tm-btn__value
    color #fff

.tm-btn__container.tm-btn--danger
  border-color #FF5561
  .tm-btn__value
    color #fff
</style>
