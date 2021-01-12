import React from "react";
// import s from "./FetchError.module.scss";
// import { Link } from "react-router-dom";
// import * as Sentry from "@sentry/browser";
import NotFound from "./NotFound";

// import { get } from "lodash";

type Props = {
  url: string;
  error?: Error;
};

const FetchError = ({ url, error }: Props) => {
  // let isOffline = false;
  // const statusCode = get(error, `response.status`);
  // const responseData = get(error, `response.data`);

  // if (statusCode !== 404) Sentry.captureException(error);
  // if (!error.response) {
  //   isOffline = true;
  // }

  const pathArray = url.split("/");
  const keyword = pathArray[pathArray.length - 1];
  return (
    <>
      {/* {statusCode === 404 ? ( */}
      <NotFound keyword={keyword} />
      {/* ) : (
        <div className={s.error}>
          <div>
            <i className="material-icons">sentiment_very_dissatisfied</i>
            <h1> Oops!</h1>
            <p>You have encountered an error.</p>
            <div>
              {isOffline ? (
                `You're offline right now. Check your connection.`
              ) : (
                <>
                  <br />
                  {`Error code: ${statusCode}`}
                  <br />
                  {`Message: ${JSON.stringify(responseData)}`}
                </>
              )}
            </div>
            <Link to="/">
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      )} */}
    </>
  );
};

export default FetchError;
