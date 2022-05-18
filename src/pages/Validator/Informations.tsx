import React from "react";
import { percent } from "../../scripts/math";
import Finder from "../../components/Finder";
import { TerraValidator } from "../../types/validator";
import format from "../../scripts/format";
import s from "./Informations.module.scss";
import { AccAddress } from "@terra-money/terra.js";

const Informations = (validator: TerraValidator) => {
  const { commission, operator_address } = validator;
  const { commission_rates, update_time } = commission;
  const { max_change_rate, max_rate } = commission_rates;
  /* render */
  const list = [
    {
      label: "Operator address",
      value: operator_address
    },
    {
      label: "Account address",
      value: (
        <Finder q="account">
          {AccAddress.fromValAddress(operator_address)}
        </Finder>
      )
    },
    {
      label: "Max commission rate",
      value: percent(max_rate)
    },
    {
      label: "Max daily commission change",
      value: percent(max_change_rate)
    },
    {
      label: "Last commission change",
      value: `${format.date(update_time)}`
    }
  ];

  return (
    <ul className={s.list}>
      {list.map(({ label, value }) => (
        <li key={label}>
          <h1>{label}</h1>
          <p>{value}</p>
        </li>
      ))}
    </ul>
  );
};

export default Informations;
