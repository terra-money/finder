import axios from "../axios";
import utility from "../../scripts/utility";
import { state as configState } from "./config";

const { txToHash } = utility;

const state = {
  txs: {},
  txsLoading: false,
  txsLoaded: false,
  txLoading: false,
  txLoaded: false,
  error: {}
};

const actions = {
  async queryTxs({ dispatch, commit }, block) {
    commit("setTxsLoading", true);

    try {
      const len = block.data.txs.length || 0;
      const promiseArr = [];
      for (let i = 0; i < len; i++) {
        let hash = await txToHash(block.data.txs[i]);
        await promiseArr.push(dispatch("queryTx", hash));
        // let txstring = atob(block.data.txs[i])

        // console.log(Buffer.from(txstring).toString('hex'))
      }
      await Promise.all(promiseArr);

      commit("setTxsLoading", false);
      commit("setTxsLoaded", true);
    } catch (error) {
      commit("setError", error);
      commit("setTxsLoading", false);
    }
  },
  async queryTx({ commit }, hash) {
    commit("setTxLoading", true);

    let url = `${configState.lcd}/txs/${hash}`;

    try {
      await axios.get(url).then(async json => {
        await commit("updateTx", {
          json
        });
      });
      commit("setTxLoaded", true);
      commit("setTxLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setTxLoading", false);
      throw error;
    }
  }
};

const mutations = {
  updateTx(state, { json }) {
    state.txs = { ...state.txs, [json.data.txhash]: json.data };
  },
  setTxsLoading(state, flag) {
    state.txsLoading = flag;
  },
  setTxsLoaded(state, flag) {
    state.txsLoaded = flag;
  },
  setTxLoading(state, flag) {
    state.txLoading = flag;
  },
  setTxLoaded(state, flag) {
    state.txLoaded = flag;
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
