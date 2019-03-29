<template lang="pug">
  div
    app-header
    div(v-if="!tx.txsLoaded && tx.txsLoading")
      app-loading
    div(class="txs-container" v-else-if="tx.txsLoaded && !tx.txsLoading && !isEmpty(txs)")
      h2 Transactions
        span for Block {{ `#${$route.params.block}` }}
        p
          span.total A total of {{ txs.length }} transactions found
          app-page(:totalRow="txs.length", v-if="(txs.length) > 10" class="appPage")

      ul.tx-table
        li.title
          ul.row
            li
              p.txhash {{ `TxHash` }}
            li
              p.type {{ `Type`}}
            li
              p.txfee {{ `Fee`}}
            li
              p.block {{ `Height` }}
            li
              p.time {{ `Time` }}
        li(v-for="tx in txs")
          ul.row
            li
              router-link.txhash(:to="{ name: 'tx', params: { hash: tx.txhash }}") {{ tx.txhash }}
            li
              p.type
                span {{ tx.tx.type }}
            li
              p.txfee {{ tx.tx.value.fee.amount[0].amount }}
            li
              router-link.block(:to="{ name: 'block', params: { block: tx.height }}") {{ tx.height }}
            li
              p.time {{ fromNow(blockTime) }}

      app-page(:totalRow="txs.length", v-if="(txs.length) > 10" class="appPage")

    template(v-else)
      app-not-found
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { isEmpty } from "lodash";
import AppHeader from "../components/AppHeader";
import AppPage from "../components/AppPage";
import AppNotFound from "../components/AppNotFound";
import AppLoading from "../components/AppLoading";
import utility from "../scripts/utility";

const { txToHash, fromNow } = utility;

export default {
  beforeCreate: function() {
      document.body.className = 'page';
  },
  name: "page-Txs",
  components: {
    AppHeader,
    AppPage,
    AppNotFound,
    AppLoading
  },
  computed: {
    ...mapGetters(["tx", "block"]),
    txs() {
      const blockHeight = this.$route.params.block;
      const txs = [];

      if (this.block.blocks[blockHeight]) {
        const blockData = this.block.blocks[blockHeight].block;

        const len = blockData.data.txs.length || 0;
        for (let i = 0; i < len; i++) {
          let hash = txToHash(blockData.data.txs[i]);

          txs.push(this.tx.txs[hash]);
        }
      }

      return txs;
    },
    blockMeta() {
      const blockHeight = this.$route.params.block;

      return this.block.blocks[blockHeight].block_meta;
    },
    blockTime() {
      return this.blockMeta.header.time;
    }
  },
  methods: {
    ...mapActions(["queryTxs", "fetchBlock"]),
    fromNow,
    isEmpty
  },
  async mounted() {
    const blockHeight = this.$route.params.block;
    if (!this.block.blocks[blockHeight]) {
      await this.fetchBlock(blockHeight);
    }
    await this.queryTxs(this.block.blocks[blockHeight].block);
  },
  watch: {
    // eslint-disable-next-line
    $route(to, from) {
      this.queryTxs(this.block.blocks[this.$route.params.block]);
    }
  }
};
</script>

<style lang="stylus">
@require '../styles/variables'

.txs-container
  width 100%
  max-width 1440px
  margin 0 auto
  padding 40px
  color #2043b5 !important

.txs-container h2
  font-size 24px
  font-weight 500
  margin-bottom 20px

.txs-container h2 span
  font-weight 300
  font-size 23px
  padding-left 6px

.txs-container h2
  font-size 24px
  font-weight 500
  margin-bottom 20px

.txs-container h2 p
  margin-top 20px
  height 40px
  display block
  position relative

.txs-container h2 p span.total
  position: absolute;
  font-weight: 400;
  top: 0;
  left: 0;
  font-size 15px
  height 40px
  line-height 40px

.txs-container .appPage
  height 40px;
  line-height 40px;
  font-size: 0;

.txs-container .row
  display table
  font-size 14px
  min-height 60px
  border-top solid 1px #d8ddf0
  width 100%
  table-layout fixed
  min-width: 850px

.txs-container .row li
  padding 15px
  display table-cell
  vertical-align middle
  line-height 1

.txs-container .row li:first-child
  padding-left 30px

.txs-container .row li:last-child
  padding-left 30px

.txs-container .row li
  width 13%

.txs-container .row li:first-child
  width 48%

.txs-container .tx-table .title
  border-radius 3px 3px 0 0
  font-weight 500

 .txs-container .tx-table .title .row
  border-top 0
  background-color rgba(84, 147, 247, 0.1)

.txs-container .txhash, .block, .time, .type, .txfee
  display inline-block
  text-overflow ellipsis
  white-space nowrap
  overflow hidden
  width 100%

.txs-container .type span
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
  vertical-align middle

.txs-container .tx-table
  border-radius 5px
  border solid 1px #d8ddf0
  width 100%
  margin-bottom 30px
  background #fff
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  min-width unset

@media screen and (max-width: 1280px)
  .txs-container .row li
    width 15%

  .txs-container .row li:first-child
    width 40%

  .txs-container .type span
    font-size 11px
    padding 0 10px

@media screen and (max-width: 1024px)
  .txs-container .row
    min-height 50px
    font-size 13px
    
  .txs-container .row li
    width 15%

  .txs-container .row li:first-child
    width 40%

  .txs-container .type span
    font-size 11px
    padding 0 10px

  .txs-container .row li
    padding 10px

  .txs-container .row li:first-child
    padding-left 20px

  .txs-container .row li:last-child
    padding-left 20px

@media screen and (max-width: 767px)
  .txs-container
    padding 50px 15px

  .txs-container h2
    padding 40px 0 30px
    margin 0

  .txs-container h2 span
    display block
    padding 0

  .txs-container h2 p
    height auto

  .txs-container h2 p span.total
    position static
    display block
    padding 0
    top: unset;
    left: unset;
    font-size: 14px;
    height: auto;
    line-height: 1.3;

  div.v-pagination > ul
    margin-top 50px
    position relative

  div.v-pagination > ul > li.v-pagination__list
    position absolute
    left 0
    top 0

  div.v-pagination > ul > li.v-pagination__list span
    position absolute
    top: -15px;
    left: 0;
    font-size: 9px;
    line-height: 12px;

  div.v-pagination > ul > li.v-pagination__list select
    margin 0

  div.v-pagination > ul > li.v-pagination__list:after
    right: unset;
    left: 35px;

  .txs-container .tx-table .title .row
    border-top 0

  .txs-container .row li
    width 18%

  .txs-container .row li:nth-child(2)
    width 20%

  .txs-container .row li:first-child
    width 26%
</style>
