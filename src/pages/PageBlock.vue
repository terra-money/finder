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
            a(v-else class="transactions none")
              span {{ blockData.header.num_txs }} Transactions

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
  beforeCreate: function() {
      document.body.className = 'page';
  },
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
  width 100%
  max-width 1440px
  margin 0 auto
  padding 40px
  color #2043b5 !important

.block-container h2
  font-size 24px
  font-weight 500
  margin-bottom 20px

.block-container h2 span
  font-weight 300
  font-size 23px
  padding-left 6px

.block-container .table
  border solid 1px #d8ddf0
  border-radius 5px
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
 
.block-container .table .tm-li-dl
  display table
  table-layout fixed
  width 100%
  min-height 60px

.block-container .table .tm-li-dl .tm-li-dt
  display table-cell
  vertical-align middle

.block-container .table .tm-li-dl .tm-li-dd
  display table-cell
  padding 15px 30px
  vertical-align middle
  white-space normal
  text-overflow unset
  word-break break-all
  line-height 1.5

.block-container a.transactions
  display inline-block
  position relative
  cursor pointer
  font-size 15px
  box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.1)
  line-height 30px
  height 30px
  border-radius 15px
  background-color #5493f7
  padding-left 20px
  padding-right: 46px
  color #ffffff
  text-decoration none
  transition background-color .1s


.block-container a.transactions:hover
  text-decoration none
  background-color #2845AE

.block-container a.none
  background-color rgba(84, 147, 247,.5);
  padding 0 20px
  cursor default


.block-container .transactions i
  margin-left 15px
  font-size 20px
  position: absolute
  top: 6px

.block-container .height span
  margin-right 10px
  display inline-block
  vertical-align middle

.block-container .height a
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

.block-container .height a:hover
  color #fff
  background #2845AE

.block-container .height a i
  line-height 22px

@media screen and (max-width: 767px)
  .block-container
    padding 50px 15px

  .block-container h2
    padding 40px 0 30px
    border-bottom 1px solid #d8ddf0
    margin 0

  .block-container .table
    box-shadow none
    border 0

  .block-container .table .tm-li-dl
    display block
    padding 0
    height auto
    line-height 1.5

  .block-container .table .tm-li-dl .tm-li-dt
    display block
    background transparent
    padding 20px 0 10px
    word-wrap break-word
    white-space unset
    font-size 15px

  .block-container .table .tm-li-dl .tm-li-dd, .tm-li-dd.tm-li-dd-flush
    display block
    padding 0 0 20px
    font-size 15px
    word-wrap break-word
    white-space unset

  .block-container a.transactions
    font-size 14px

  .block-container .tm-li
    border-bottom 1px solid #d8ddf0
</style>
