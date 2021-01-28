import React from "react";
import Available from "./Available";

const AvailableList = ({ list }: { list: Balance[] }) => (
  <>
    {list.map((a, i) => (
      <Available {...a} key={i} />
    ))}
  </>
);

export default AvailableList;
