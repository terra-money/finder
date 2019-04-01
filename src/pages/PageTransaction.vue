<template lang="pug">
  div
    app-header
    div(v-if="!tx.txLoaded && tx.txLoading")
      app-loading
    div(class="tx-container" v-else-if="tx.txLoaded && !tx.txLoading && !isEmpty(transaction)")
      h2 Transaction Details

      div(class="table")
        tm-list-item(dt="Transaction hash")
          template(slot="dd")
            span {{ transaction.txhash }}
            span.copy(:data-clipboard-text="transaction.txhash" v-on:click="copy")
              i.material-icons filter_none
              span.copied(:class="{ on: clicked }" )
        tm-list-item.status(dt="Status")
          template(slot="dd")
            span.title Success
            span.divider
            span 100/100
        tm-list-item(dt="Block")
          template(slot="dd")
            router-link(:to="{ name: 'block', params: { block: transaction.height }}") {{ transaction.height }}
        tm-list-item(dt="Timestamp" :dd="`2019.02.28 15:06:58`")
        //- tm-list-item(dt="Sender" :dd="transaction.tx.value.msg[0].value.from_address")
        //- tm-list-item(dt="Receiver" :dd="transaction.tx.value.msg[0].value.to_address")
        tm-list-item(dt="Transaction fee" :dd="`${transaction.tx.value.fee.amount[0].amount} ${transaction.tx.value.fee.amount[0].denom}`")
        tm-list-item(dt="Gas (Used/Requested)" :dd="`${parseInt(transaction.gas_used).toLocaleString()}/${parseInt(transaction.gas_wanted).toLocaleString()}`")
        tm-list-item.rawData(dt="Message")
          template(slot="dd" v-for="m in transaction.tx.value.msg")
            //- vue-json-pretty(:data="transaction.tx")
            div.msgBox
              p {{ m.value.from_address}}
              div.type
                p {{ m.type }}
              p {{ `to ${m.value.to_address}` }}

    template(v-else-if="tx.error && !tx.txLoading")
      app-not-found
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { isEmpty } from "lodash";
import Clipboard from "clipboard";
import TmListItem from "../components/TmListItem";
import AppHeader from "../components/AppHeader";
import AppNotFound from "../components/AppNotFound";
import AppLoading from "../components/AppLoading";
import { setTimeout } from "timers";

export default {
  beforeCreate: function() {
    document.body.className = "page";
  },
  name: "page-Tx",
  data: () => ({
    clicked: false
  }),
  components: {
    AppHeader,
    TmListItem,
    AppNotFound,
    AppLoading
  },
  computed: {
    ...mapGetters(["tx", "block"]),
    transaction() {
      const hash = this.$route.params.hash;

      return this.tx.txs[hash];
    }
  },
  methods: {
    ...mapActions(["queryTx"]),
    isEmpty,
    copy() {
      this.clicked = true;
      setTimeout(() => {
        this.clicked = false;
      }, 1500);
    }
  },
  async created() {
    await this.queryTx(this.$route.params.hash);
  },
  mounted() {
    new Clipboard(".copy");
  },
  watch: {
    // eslint-disable-next-line
    $route(to, from) {
      this.queryTx(this.$route.params.hash);
    }
  }
};
</script>

<style lang="stylus">
@require '../styles/variables'
.tx-container
  width 100%
  max-width 1440px
  margin 0 auto
  padding 40px
  color #2043b5 !important

.tx-container h2
  font-size 24px
  font-weight 500
  margin-bottom 20px

.tx-container h2 span
  font-weight 300
  font-size 23px
  padding-left 6px

.tx-container .table
  border solid 1px #d8ddf0
  border-radius 5px
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
 
.tx-container .table .tm-li-dl
  display table
  table-layout fixed
  width 100%
  min-height 60px

.tx-container .table .tm-li-dl .tm-li-dt
  display table-cell
  vertical-align middle

.tx-container .table .tm-li-dl .tm-li-dd
  display table-cell
  padding 15px 30px
  vertical-align middle
  white-space normal
  text-overflow unset
  word-break break-all
  line-height 1.5

.tx-container .tx-hash span
  margin-right 10px
  display inline-block
  vertical-align middle

.tx-container .tx-hash a
  position relative
  width 22px
  height 22px
  display inline-block
  color #2845AE
  vertical-align middle
  margin-top -2px
  margin-right 6px;
  border-radius 50%
  background-color #edf4fe
  text-align center
  transition .1s

.tx-container .tx-hash a:hover
  color #fff
  background #2845AE

.tx-container .tx-hash a i
  line-height 22px

.tx-container .rawData .tm-li-dd.tm-li-dd-flush > div
  height auto
  display block
  border-radius: 5px;
  border: solid 1px #D8DDF0;
  background-color: #FBFDFF !important;
  margin: 10px 0;
  padding 13px 20px
  overflow auto
  font-size 15px

.tx-container .rawData .tm-li-dd.tm-li-dd-flush > div.msgBox p
  line-height: 1.5;
  margin: 7px 0 8px;
  min-height 20px

.tx-container .rawData .tm-li-dd.tm-li-dd-flush > div.msgBox div.type
  padding-left 0
  display block

.tx-container .rawData .tm-li-dd.tm-li-dd-flush > div.msgBox div.type p
  border-radius: 13px;
  height: 26px;
  overflow: hidden;
  background-color: rgba(253, 154, 2, 0.1);
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 26px;
  letter-spacing: -0.3px;
  color: rgba(253, 154, 2, 1);
  padding 0 15px
  display inline-block

.tx-container .status span
  color #1daa8e

.tx-container .status .title
  font-weight 500

.tx-container .status .divider
  display inline-block
  background-color: #D8DDF0;
  width: 1px;
  height: 16px;
  vertical-align: middle;
  margin -2px 8px 0

.copy
  position relative
  display inline-block
  width 22px
  height 22px
  margin-top -2px
  margin-left 6px;

.copy i
  position relative
  width 22px
  height 22px
  display block
  color #2845AE
  vertical-align middle
  border-radius 50%
  background-color #edf4fe
  text-align center
  transition .1s
  font-size 12px
  line-height 22px
  cursor pointer

.copied
  position absolute
  top -24px
  left 50%
  margin-left: -28px
  width 56px
  height 22px
  text-align center
  background #1daa8e
  line-height 20px
  font-size 11px
  color #fff
  border-radius 2px
  z-index 100
  opacity 0
  transition .2s
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  pointer-events none

.copied.on
  opacity 1

.copied:after
  content 'Copied!'

.copied:before
  content ''
  display block
  position absolute
  background #1daa8e
  width 10px
  height 10px
  top 14px
  left 50%
  margin-left -5px
  z-index -1
  transform rotate(45deg)
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);

.tm-li-dd.tm-li-dd-flush
  overflow visible

@media screen and (max-width: 900px)
  .tx-container
    padding 50px 15px

  .tx-container h2
    padding 40px 0 30px
    border-bottom 1px solid #d8ddf0
    margin 0

  .tx-container .table
    box-shadow none
    border 0

  .tx-container .table .tm-li-dl
    display block
    padding 0
    height auto
    line-height 1.5

  .tx-container .table .tm-li-dl .tm-li-dt
    display block
    background transparent
    padding 20px 0 10px
    word-wrap break-word
    white-space unset
    font-size 15px

  .tx-container .table .tm-li-dl .tm-li-dd, .tm-li-dd.tm-li-dd-flush
    display block
    padding 0 0 20px
    font-size 15px
    word-wrap break-word
    white-space unset

  .tx-container .rawData .tm-li-dd.tm-li-dd-flush > div.msgBox p
    height unset
    line-height unset
</style>
