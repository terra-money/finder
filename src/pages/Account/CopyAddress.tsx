import React from "react";
import Copy from "../../components/Copy";
import Card from "../../components/Card";
import s from "../Account/Account.module.scss";

const CopyAddress = ({ children }: { children: string }) => (
  <Card title="Address" bordered headerClassName={s.cardTitle}>
    {children}
    <Copy text={children} style={{ display: "inline-block" }}></Copy>
  </Card>
);

export default CopyAddress;
