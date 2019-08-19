import { useState } from "react";
import networksConfig from "../config/networks";

export default () => {
  const [network, setNetwork] = useState(networksConfig[0].key);
  return { network, setNetwork };
};
