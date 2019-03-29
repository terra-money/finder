<template>
  <div :class="[pageClass]">
    <ul>
      <li class="disabled v-pagination__list" v-if="pageSizeMenu">
        <span>Show</span>
        <select @change="switchLength" v-model="pageSize" :disabled="disabled">
          <option :key="index" v-for="(len, index) in pageSizeMenu">{{
            len
          }}</option>
        </select>
      </li>

      <li :class="{ disabled: currentPage === 1 || disabled }">
        <a href="javascript:void(0);" @click="switchPage('first')"
          ><i class="material-icons">first_page</i></a
        >
      </li>
      <li :class="{ disabled: currentPage === 1 || disabled }">
        <a href="javascript:void(0);" @click="switchPage('previous')"
          ><i class="material-icons">chevron_left</i></a
        >
      </li>
      <li class="disabled info" v-if="info">
        <a>
          {{
            pageInfo
              .replace("#pageNumber#", currentPage)
              .replace("#totalPage#", totalPage)
              .replace("#totalRow#", totalRow)
          }}
        </a>
      </li>
      <li :class="{ disabled: currentPage === totalPage || disabled }">
        <a href="javascript:void(0);" @click="switchPage('next')"
          ><i class="material-icons">chevron_right</i></a
        >
      </li>
      <li :class="{ disabled: currentPage === totalPage || disabled }">
        <a href="javascript:void(0);" @click="switchPage('last')"
          ><i class="material-icons">last_page</i></a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "app-page",
  props: {
    totalRow: {
      type: Number,
      default: 0
    },
    info: {
      type: Boolean,
      default: true
    },
    pageSizeMenu: {
      type: [Array, Boolean],
      default: function() {
        return [10, 20, 50, 100];
      }
    },
    align: {
      type: String,
      default: "right"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pageSize:
        typeof this.pageSizeMenu === "boolean" ? 10 : this.pageSizeMenu[0],
      totalPage: 0,
      currentPage: 0,
      pageNumberSize: 3,
      pageClass: {
        "v-pagination": true,
        "v-pagination--no-border": !this.border,
        "v-pagination--right": this.align === "right",
        "v-pagination--center": this.align === "center"
      },
      pageInfo: "#pageNumber# of #totalPage#"
    };
  },
  computed: {
    pageNumbers: function() {
      let start,
        end,
        nums = [],
        half = Math.floor(this.pageNumberSize / 2);
      if (this.totalPage < this.pageNumberSize) {
        start = 1;
        end = this.totalPage;
      } else if (this.currentPage <= half) {
        start = 1;
        end = this.pageNumberSize;
      } else if (this.currentPage >= this.totalPage - half) {
        start = this.totalPage - this.pageNumberSize + 1;
        end = this.totalPage;
      } else {
        start = this.currentPage - half;
        end = start + this.pageNumberSize - 1;
      }
      for (let i = start; i <= end; i++) {
        nums.push(i);
      }
      return nums;
    }
  },
  watch: {
    totalRow() {
      this.calcTotalPage();
    }
  },
  methods: {
    goPage(pNum) {
      this.currentPage = pNum;
      this.$emit("page-change", {
        pageNumber: pNum,
        pageSize: Number(this.pageSize)
      });
      this.calcTotalPage();
    },
    calcTotalPage() {
      this.totalPage = Math.ceil(this.totalRow / this.pageSize);
    },
    switchPage(pNum) {
      if (this.disabled) return;
      let num = 1;
      if (typeof pNum === "string") {
        switch (pNum) {
          case "first":
            if (this.currentPage === 1) return;
            if (this.currentPage !== 1) num = 1;
            break;
          case "previous":
            if (this.currentPage === 1) return;
            if (this.currentPage !== 1) num = this.currentPage - 1;
            break;
          case "next":
            if (this.currentPage === this.totalPage) return;
            if (this.currentPage !== this.totalPage) num = this.currentPage + 1;
            break;
          case "last":
            if (this.currentPage === this.totalPage) return;
            if (this.currentPage !== this.totalPage) num = this.totalPage;
            break;
        }
      } else if (typeof pNum === "number") num = pNum;
      this.goPage(num);
    },
    switchLength() {
      this.goPage(1);
    }
  },
  mounted() {
    this.goPage(1);
  }
};
</script>

<style>
div.v-pagination {
  margin: 0;
  display: block;
}
div.v-pagination.v-pagination--right {
  text-align: right;
}
div.v-pagination.v-pagination--center {
  text-align: center;
}

div.v-pagination > ul > li {
  text-align: center;
  margin: 0;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  vertical-align: middle;
}
div.v-pagination > ul > li.info a {
  background-color: #2043b5 !important;
  border-color: #2043b5;
  line-height: 40px;
  color: #ffffff !important;
  font-weight: 300;
  position: relative;
  cursor: default;
  pointer-events: none;
  z-index: 2;
}

div.v-pagination > ul > li:nth-child(2) > a {
  border-radius: 3px 0 0 3px;
}

div.v-pagination > ul > li:last-child > a {
  border-radius: 0 3px 3px 0;
}

div.v-pagination > ul > li:nth-child(3) > a {
  border-right: 0;
}

div.v-pagination > ul > li:nth-child(5) > a {
  border-left: 0;
}

div.v-pagination > ul > li > a {
  height: 40px;
  line-height: 40px;
  margin: 0 0 0 -1px;
  position: relative;
  border: solid 1px #d8ddf0;
  border-radius: 0;
  padding: 0 12px;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  background-color: white;
  font-size: 12px;
  float: left;
  text-decoration: none;
  color: #333;
  transition: .1s;
  color: #2043b5;
}
div.v-pagination > ul > li > a i {
  display: inline-block;
  vertical-align: middle;
  margin-top: -3px;
}
div.v-pagination > ul > li > a:hover {
  background-color: rgba(32, 67, 181, .1);
}
div.v-pagination > ul > li.disabled > a {
  cursor: default;
  background-color: #fff;
  color: rgba(32, 67, 181, .3);
}

div.v-pagination > ul > li.v-pagination__list {
  display: inline-block;
  position: relative;
}
div.v-pagination > ul > li.v-pagination__list span {
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: -0.3px;
  color: #2043b5;
  line-height: 40px;
}

div.v-pagination > ul > li.v-pagination__list a {
  line-height: 1.4;
}
div.v-pagination > ul > li.v-pagination__list select {
  margin-left: 5px;
  font-size: 12px;
  padding: 0;
  display: inline-block;
  color: #333;
  outline: 0;
  height: 40px;
  width: 55px;
  border-radius: 3px;
  border: solid 1px #d8ddf0;
  background: #ffffff;
  color: #2043b5;
  margin-right: 20px;
  appearance: none;
  padding: 0 10px;
  position: relaitve;
  outline: 0;
}
 div.v-pagination > ul > li.v-pagination__list:after {
  position: absolute;
  right: 25px;
  top: 50%;
  margin-top: -8px;
  pointer-events: none;
  content: 'arrow_drop_down';
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 16px;  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  z-index: 2;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;

  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
 }
div.v-pagination > ul > li.v-pagination__list select[disabled] {
  color: rgba(32, 67, 181, .3);
}
div.v-pagination.v-pagination--no-border > ul {
  box-shadow: none;
}
div.v-pagination.v-pagination--no-border > ul > li > a {
  border: 0;
}

@media screen and (max-width: 900px) {
}
</style>
