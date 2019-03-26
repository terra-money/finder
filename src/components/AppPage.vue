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
div.v-pagination > ul {
  display: flex;
  flex-direction: row;
  list-style: none;
  align-items: flex-start;
  margin: 0;
  padding: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
}
div.v-pagination > ul > li {
  text-align: center;
  margin: 0;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  display: flex;
  align-items: center;
}
div.v-pagination > ul > li.info a {
  background-color: #2043b5;
  line-height: 40px;
  color: #ffffff !important;
  font-weight: lighter;
}
div.v-pagination > ul > li > a {
  height: 40px;
  line-height: 40px;
  margin: 0 0 0 -1px;
  position: relative;
  border: solid 1px #d8ddf0;
  border-radius: 2px;
  padding: 6px 12px;
  line-height: 1.4;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  background-color: white;
  font-size: 14px;
  float: left;
  text-decoration: none;
  color: #333;
  -webkit-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1);
}
div.v-pagination > ul > li > a:hover {
  z-index: 2;
  -webkit-box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}
div.v-pagination > ul > li.disabled > a {
  color: #2043b5;
  cursor: default;
  display: flex;
  justify-content: center;
  align-items: center;
}

div.v-pagination > ul > li.active > a,
div.v-pagination > ul > li.active > span {
  cursor: default;
  color: #999;
  background-color: #eee;
}
div.v-pagination > ul > li.active > a:hover,
div.v-pagination > ul > li.active > span:hover {
  box-shadow: none;
}
div.v-pagination > ul > li:first-child > a,
div.v-pagination > ul > li:first-child > span {
  border-left-width: 1px;
  border-bottom-left-radius: 2px;
  border-top-left-radius: 2px;
  -webkit-border-bottom-left-radius: 2px;
  -webkit-border-top-left-radius: 2px;
  -moz-border-radius-bottomleft: 2px;
  -moz-border-radius-topleft: 2px;
}
div.v-pagination > ul > li:last-child > a,
div.v-pagination > ul > li:last-child > span {
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  -webkit-border-bottom-right-radius: 2px;
  -webkit-border-top-right-radius: 2px;
  -moz-border-radius-bottomright: 2px;
  -moz-border-radius-topright: 2px;
}
div.v-pagination > ul > li.v-pagination__list {
  float: left;
  display: flex;
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
  width: auto !important;
  font-size: 13px;
  padding: 0;
  display: inline-block;
  color: #333;
  outline: 0;
  height: 40px;
  width: 50px;
  border-radius: 2px;
  border: solid 1px #d8ddf0;
  background: #ffffff;
  color: #2043b5;
  margin-right: 20px;
}
div.v-pagination > ul > li.v-pagination__list select:hover {
  -webkit-box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}
div.v-pagination > ul > li.v-pagination__list select[disabled] {
  color: #999;
}
div.v-pagination.v-pagination--no-border > ul {
  box-shadow: none;
}
div.v-pagination.v-pagination--no-border > ul > li > a {
  border: 0;
}

@media screen and (max-width: 900px) {
  div.v-pagination.v-pagination--right {
    justify-content: flex-start;
  }
  div.v-pagination > ul > li.v-pagination__list select {
    margin-left: 0px;
  }
}
</style>
