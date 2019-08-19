import React, { ReactNode } from "react";
import s from "./Page.module.scss";

type Props = { title: string; action?: ReactNode; children: ReactNode };
const Page = ({ title, action, children }: Props) => (
  <article className={s.article}>
    <header className={s.header}>
      <h1 className={s.title}>{title}</h1>
      {action}
    </header>

    {children}
  </article>
);

export default Page;
