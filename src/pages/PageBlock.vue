<template lang="pug">
  div
    app-header
    div(v-if="!block.loaded && block.loading")
      app-loading
    div(class="block-container" v-else-if="block.loaded && !block.loading && !isEmpty(blockData.header)")
      h2 Block
        span {{ `#${blockData.header.height}` }}

      div(class="table")
        tm-list-item(dt="Block height", class="height")
          template(slot="dd")
            span {{ blockData.header.height }}
            router-link(v-if="blockData.header.height > 1" :to="{ name: 'block', params: { block: parseInt(blockData.header.height) - 1 }}"): i.material-icons chevron_left
            router-link(:to="{ name: 'block', params: { block: parseInt(blockData.header.height) + 1 }}"): i.material-icons chevron_right
        tm-list-item(dt="Timestamp" :dd="`${format(blockData.header.time)} (UTC)`")
        tm-list-item(dt="Transactions")
          template(slot="dd")
            router-link(v-if="parseInt(blockData.header.num_txs) > 0" class="transactions" :to="{ name: 'txs', params: { block: parseInt(blockData.header.height) }}")
              span {{ blockData.header.num_txs }} Transactions
                i.material-icons keyboard_arrow_right
            a(v-else class="transactions")
              span {{ blockData.header.num_txs }} Transactions
                i.material-icons keyboard_arrow_right

        tm-list-item(dt="Validator" :dd="blockData.header.validators_hash")
        //- tm-list-item(dt="Block reward" :dd="`0.8888 luna`")
        //- tm-list-item(dt="Size" :dd="`8,888 bytes`")
        tm-list-item(dt="Block hash" :dd="blockMeta.block_id.hash")
        tm-list-item(dt="Parent hash")
          template(slot="dd")
            router-link(:to="{ name: 'block', params: { block: parseInt(blockData.header.height) - 1 }}") {{ blockData.last_commit.block_id.hash }}

    template(v-else)
      app-not-found
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { isEmpty } from "lodash";
import utility from "../scripts/utility";
import TmListItem from "../components/TmListItem";

import AppHeader from "../components/AppHeader";
import AppNotFound from "../components/AppNotFound";
import AppLoading from "../components/AppLoading";

const { format } = utility;

export default {
  name: "page-block",
  components: {
    TmListItem,
    AppHeader,
    AppNotFound,
    AppLoading
  },
  computed: {
    ...mapGetters(["block"]),
    blockData() {
      return (
        (this.block.blocks[this.$route.params.block] &&
          this.block.blocks[this.$route.params.block].block) || {
          last_commit: {
            block_id: {}
          },
          header: {}
        }
      );
    },
    blockMeta() {
      return (
        (this.block.blocks[this.$route.params.block] &&
          this.block.blocks[this.$route.params.block].block_meta) || {
          block_id: {
            hash: ``
          }
        }
      );
    }
  },
  async created() {
    await this.fetchBlock(this.$route.params.block);
  },
  methods: {
    ...mapActions(["fetchBlock", "setBlockLoadedFalse"]),
    format,
    isEmpty
  },
  watch: {
    // eslint-disable-next-line
    $route(to, from) {
      this.setBlockLoadedFalse();
      this.fetchBlock(this.$route.params.block);
    }
  }
};
</script>

<style lang="stylus">
@require '../styles/variables'
.block-container
  padding 40px 80px
  color #2043b5 !important

.block-container h2
  font-size 24px
  font-weight 500
  margin-bottom 20px

.block-container h2 span
  font-weight lighter
  padding-left 6px

.block-container .table
  border solid 1px #d8ddf0
  border-radius 3px

.block-container a.transactions
  display flex
  position relative

.block-container .transactions span
  line-height 30px
  height 30px
  border-radius 15.5px
  box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.1)
  background-color #5493f7
  padding-left 20px
  padding-right: 50px
  color #ffffff
  font-weight lighter

.block-container .transactions i
  margin-left 20px
  font-size 20px
  position: absolute
  top: 6px

.block-container .height span
  margin-right 10px

.block-container .height a
  position relative
  width 20px
  height 20px
  display inline-block

.block-container .height i
  border-radius 10px
  background-color #edf4fe
  position absolute
  top 6px

@media screen and (max-width: 900px)
  .block-container h2
    padding 30px 0
    border-bottom 1px solid #d8ddf0

  .block-container .tm-li-dl
    flex-direction column
    height 90px
    line-height 45px
    align-items flex-start
    padding 0

  .block-container .tm-li-dt
    background none
    padding-left 0px
    height 45px
    flex-grow 1

  .block-container .table
    border 0

  .block-container .tm-li-dd, .tm-li-dd.tm-li-dd-flush
    padding-left 0px
    flex-grow 1
    font-size 15px
    width 100%
    word-wrap break-word
    white-space unset

  .block-container
    padding 20px 15px

  .block-container .tm-li
    border-bottom 1px solid #d8ddf0
</style>
