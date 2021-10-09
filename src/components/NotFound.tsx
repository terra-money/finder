import React from "react";
import { Link } from "react-router-dom";

import s from "./NotFound.module.scss";
import earth from "../images/earth.svg";

type Props = {
  keyword?: string;
};

const NotFound = ({ keyword }: Props) => {
  return (
    <div className={s.container}>
      <div>
        {keyword ? (
          <>
            <h1>Search not found</h1>
            <p>
              Sorry, we couldn't find any results for <span>{keyword}</span>
            </p>
            <p>
              Please input the correct block number or transaction hash or
              account address.
            </p>
          </>
        ) : (
          <>
            <h1>Page not found</h1>
            <p>The page you were looking for doesn't exist.</p>
          </>
        )}

        <img src={earth} alt="earth" />
        <Link to="/">
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
