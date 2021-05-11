import React, { useContext } from "react";
import CurrencyContext from "../../contexts/CurrencyContext";
import { useRequest } from "../../HOCs/WithFetch";
import Available from "./Available";

const AvailableList = ({ list }: { list: Balance[] }) => {
  const { currency } = useContext(CurrencyContext);
  const response = useRequest({
    url: `/v1/market/swaprate/${currency}`
  });

  return (
    <>
      {list.map((a, i) => (
        <Available {...a} key={i} currency={{ response, currency }} />
      ))}
    </>
  );
};

export default AvailableList;
