<template lang="pug">
  div
    app-header
    div(v-if="!tx.txLoaded && tx.txLoading")
      app-loading
    div(class="tx-container" v-else-if="tx.txLoaded && !tx.txLoading && !isEmpty(transaction)")
      h2 Transaction Details

      div(class="table")
        tm-list-item(dt="Transaction hash" :dd="transaction.txhash")
        tm-list-item.status(dt="Status")
          template(slot="dd")
            span SUCCESS | 100/100
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
              p.type {{ m.type }}
              p {{ `to ${m.value.to_address}` }}

    template(v-else)
      app-not-found
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { isEmpty } from "lodash";
import TmListItem from "../components/TmListItem";
import AppHeader from "../components/AppHeader";
import AppNotFound from "../components/AppNotFound";
import AppLoading from "../components/AppLoading";

export default {
  name: "page-Tx",
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
    isEmpty
  },
  async created() {
    await this.queryTx(this.$route.params.hash);
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
  padding 40px 80px
  color #2043b5 !important

.tx-container h2
  font-size 24px
  font-weight 500
  margin-bottom 20px

.tx-container .table
  border solid 1px #d8ddf0
  border-radius 3px

.tx-container .rawData .tm-li-dl,
.tx-container .rawData .tm-li-dt
  height auto
  align-items: stretch;

.tx-container .rawData .tm-li-dd.tm-li-dd-flush > div
  height auto
  display block
  border-radius: 2px;
  border: solid 1px #e6e6e6;
  background-color: #fafafa !important;
  margin: 30px 30px 30px 0;
  padding 15px
  overflow auto

.tx-container .rawData .tm-li-dd.tm-li-dd-flush > div.msgBox p
  height: 30px;
  line-height: 30px;


.tx-container .rawData .tm-li-dd.tm-li-dd-flush > div.msgBox p.type
  border-radius: 13px;
  background-color: rgba(253, 154, 2, 0.1);
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: -0.3px;
  color: #fd9a02;
  padding 10px
  margin-top 10px
  margin-bottom 10px

.tx-container .status .tm-li-dd span
  border-radius 15.5px
  background-color #1daa8e
  height 30px
  line-height 30px
  display inline-block
  letter-spacing -0.3px
  color #ffffff
  font-size: 13px;
  font-weight: 100;
  padding 0 20px

@media screen and (max-width: 900px)
  .tx-container
    padding 20px 15px

  .tx-container h2
    padding 30px 0
    border-bottom 1px solid #d8ddf0

  .tx-container .tm-li-dl
    flex-direction column
    height 90px
    line-height 45px
    align-items flex-start
    padding 0

  .tx-container .tm-li-dt
    background none
    padding-left 0px
    height 45px
    flex-grow 1

  .tx-container .table
    border 0

  .tx-container .tm-li-dd, .tm-li-dd.tm-li-dd-flush
    padding-left 0px
    flex-grow 1
    font-size 15px
    width 100%
    word-wrap break-word
    white-space unset

  .tx-container .rawData .tm-li-dd.tm-li-dd-flush > div.msgBox p
    height unset
    line-height unset
</style>
