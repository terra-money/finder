import { ReactNode } from "react";
import PaginationButtons from "./PaginationButtons";

export type PaginationProps = {
  title: string;
  next?: number;
  action?: (offset: number) => void;
  loading?: boolean;
  children: ReactNode;
};

const Pagination = (props: PaginationProps) => {
  const { children, action, next, loading } = props;

  return (
    <>
      {children}
      <PaginationButtons action={action} offset={next} loading={loading} />
    </>
  );
};

export default Pagination;
