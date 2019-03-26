import axios from "../axios";
import { state as configState } from "./config";

const state = {
  blocks: {},
  loading: false,
  loaded: false,
  error: {}
};

const actions = {
  async fetchBlock({ state, commit }, blockHeight) {
    commit("setLoading", true);
    try {
      if (configState.localDev) {
        let url = `${configState.rpc}/block?height=${blockHeight}`;
        let json = await axios.get(url);
        state.blocks[blockHeight] = {};
        state.blocks[blockHeight].block_meta = json.data.result.block_meta;
        state.blocks[blockHeight] = json.data.result.block;
        return;
      }
      let url = `${configState.lcd}/blocks/${blockHeight}`;
      let json = await axios.get(url);
      await commit("updateBlock", {
        blockHeight,
        json
      });
    } catch (error) {
      await commit("setError", error);
      commit("setLoading", false);
    }

    commit("setLoaded", true);
    commit("setLoading", false);
  },
  setBlockLoadedFalse({ commit }) {
    commit("setLoaded", false);
  }
};

const mutations = {
  updateBlock(state, { blockHeight, json }) {
    const newBlock = {};
    newBlock.block_meta = json.data.block_meta;
    newBlock.block = json.data.block;
    state.blocks = { ...state.blocks, [blockHeight]: newBlock };
  },
  setLoading(state, flag) {
    state.loading = flag;
  },
  setLoaded(state, flag) {
    state.loaded = flag;
  },
  setError(state, error) {
    state.error = error;
  }
};

export default {
  state,
  actions,
  mutations
};
