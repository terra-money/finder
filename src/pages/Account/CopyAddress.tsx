import React from "react";
import Copy from "../../components/Copy";
import Card from "../../components/Card";
import Flex from "../../components/Flex";
import s from "./CopyAddress.module.scss";

const CopyAddress = ({ children }: { children: string }) => (
  <Card title="Address" bordered headerClassName={s.cardTitle}>
    <Flex>
      {children}
      <Copy text={children} />
    </Flex>
  </Card>
);

export default CopyAddress;
