import React from "react";
import { Link, useParams } from "react-router-dom";

import s from "./NotFound.module.scss";
import earth from "../images/earth.svg";

type Props = {
  keyword?: string;
};

const NotFound = ({ keyword }: Props) => {
  const { keyword: param } = useParams();
  const word = keyword || param;

  return (
    <div className={s.container}>
      <div>
        {word ? (
          <>
            <h1>Search not found</h1>
            <p>
              Sorry, we couldn't find any results for <span>{word}</span>
            </p>
            <p>
              Please input the correct block number, transaction hash or account
              address.
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
