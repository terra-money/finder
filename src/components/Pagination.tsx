import React, { ReactNode } from "react";
import PaginationButtons from "./PaginationButtons";

export type PaginationProps = {
  title: string;
  offset?: number;
  next?: (offset: number) => void;
  children: ReactNode;
};

const Pagination = (props: PaginationProps) => {
  const { children, offset, next } = props;

  return (
    <>
      {children}
      <PaginationButtons next={next} offset={offset} />
    </>
  );
};

export default Pagination;
