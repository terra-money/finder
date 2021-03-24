import React, { ReactNode } from "react";
import { plus } from "../scripts/math";
import NoMoreData from "./NoMoreData";

import OldPaginationButtons from "./OldPaginationButtons";

export type OldPaginationProps = {
  count: number;
  page: number;
  limit: number;
  title: string;
  link?: (page: string) => { pathname: string; search: string };
  action?: (page: string) => void;
  children: ReactNode;
};

const OldPagination = (props: OldPaginationProps) => {
  const { page } = props;
  const { count, title, link, action, children } = props;

  const getLinks = () =>
    link && {
      next: link(plus(page, 1))
    };

  const getActions = () =>
    action && {
      next: () => action(plus(page, 1))
    };

  return count > 0 ? (
    <>
      {children}
      <OldPaginationButtons links={getLinks()} actions={getActions()} />
    </>
  ) : (
    <NoMoreData context={title} />
  );
};

export default OldPagination;
