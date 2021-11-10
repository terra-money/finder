import React from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import WithFetch from "../../HOCs/WithFetch";
import Account from "./Account";
import Contract from "./Contract";

const Address = () => {
  const { address = "" } = useParams();

  return (
    <WithFetch
      url={`/wasm/contracts/${address}`}
      loading={<Loading />}
      renderError={() => <Account />}
    >
      {data => <Contract {...data.result} />}
    </WithFetch>
  );
};

export default Address;
