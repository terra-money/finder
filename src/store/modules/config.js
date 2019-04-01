export const state = {
  activeMenu: "",
  blockchainSelect: false,
  desktop: false,
  localDev: process.env.VUE_APP_LOCAL_DEV !== undefined,
  rpc:
    process.env.VUE_APP_LOCAL_DEV !== undefined
      ? "http://localhost:26657"
      : "https://soju.terra.money:36657",
  lcd: "https://soju.terra.money:1317",
  wss:
    process.env.VUE_APP_LOCAL_DEV !== undefined
      ? "ws://localhost:26657"
      : "wss://soju.terra.money:36657"
}

const mutations = {
  SET_CONFIG_BLOCKCHAIN_SELECT(state, value) {
    state.blockchainSelect = value
  },
  setActiveMenu(state, value) {
    state.activeMenu = value
  },
  SET_CONFIG_DESKTOP(state, value) {
    state.desktop = value
  }
}

export default {
  state,
  mutations
}
