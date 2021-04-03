import React, { ReactNode } from "react";
import PaginationButtons from "./PaginationButtons";

export type PaginationProps = {
  title: string;
  next?: number;
  action?: (offset: number) => void;
  children: ReactNode;
};

const Pagination = (props: PaginationProps) => {
  const { children, action, next } = props;

  return (
    <>
      {children}
      <PaginationButtons action={action} offset={next} />
    </>
  );
};

export default Pagination;
