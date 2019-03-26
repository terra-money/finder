<template lang="pug">
  div
    app-header
    div(v-if="!tx.txsLoaded && tx.txsLoading")
      app-loading
    div(class="txs-container" v-else-if="tx.txsLoaded && !tx.txsLoading && !isEmpty(txs)")
      h2 Transactions
        span for Block {{ `#${$route.params.block}` }}
        p
          span A total of {{ txs.length }} transactions found
          app-page(:totalRow="txs.length", class="appPage")

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

      app-page(:totalRow="txs.length", class="appPage")

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
  color #2043b5 !important
  padding 40px 80px

.txs-container .row
  display flex
  align-items flex-start
  font-size 14px
  height 60px
  border-top solid 1px #d8ddf0

.txs-container .row li
  height 60px
.txs-container .title
  background-color #d8ddf0
  height 60px
  line-height 60px
  background-color rgba(84, 147, 247, 0.1)
  font-weight 500

.txs-container .txhash, .block, .time, .type, .txfee
  display inline-block
  text-overflow ellipsis
  white-space nowrap
  overflow hidden
  padding-left 30px

.txs-container .txhash
  width 470px

.txs-container .block
  width 190px

.txs-container .time
  width 190px

.txs-container .type
  width 230px

.txs-container .txfee
  width 220px

.txs-container .txhash a
  letter-spacing -0.3px
  color #5493f7

.txs-container .type span
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

.txs-container .tx-table
  border-radius 3px
  border solid 1px #d8ddf0
  line-height 60px
  min-width 1300px
  margin-bottom 30px

.txs-container h2
  font-size 24px
  font-weight 500
  margin-bottom 20px

.txs-container h2 > span
  font-weight lighter
  padding-left 6px

.txs-container h2 p
  margin-top 20px
  height 40px
  display flex
  flex-direction row
  justify-content flex-start
  align-items center

.txs-container h2 p span
  font-weight lighter
  font-size 15px
  height 40px
  line-height 40px


.txs-container .appPage
  display flex
  flex-direction row
  flex-grow 1
  justify-self flex-end
  justify-content flex-end

  height 40px
  line-height 40px

@media screen and (max-width: 900px)
  .txs-container
    padding 20px 15px

  .txs-container h2
    padding 30px 0
    padding-bottom: 120px;
    margin-bottom 10px

  .txs-container h2 span
    display block

  .txs-container h2 p
    display block

  div.v-pagination > ul
    margin-top 50px

  div.v-pagination > ul > li.v-pagination__list
    position relative

  div.v-pagination > ul > li.v-pagination__list span
    position absolute
    top: -40px;

  .txs-container .tx-table
    width: 100%;
    overflow-x: auto;
    min-width unset
    margin-bottom 10px

  .txs-container .txhash
    width 220px

  .txs-container .block
    width 150px

  .txs-container .time
    width 150px

  .txs-container .type
    width 170px

  .txs-container .txfee
    width 170px

  .txs-container .title
    width 860px

  .txs-container .row
    width 860px
</style>
