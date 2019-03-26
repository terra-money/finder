import axios from "axios";

const instance = axios.create({
  timeout: 15000
});
export default instance;
