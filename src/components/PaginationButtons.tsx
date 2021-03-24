import s from "./PaginationButtons.module.scss";

type Props = {
  offset?: number;
  next?: (offset: number) => void;
};

const PaginationButtons = ({ offset, next }: Props) => {
  const renderAction = (key: string, children: string, disabled: boolean) =>
    disabled ? (
      <span className={s[key]}>{children}</span>
    ) : (
      <button onClick={() => next && offset && next(offset)} className={s[key]}>
        {children}
      </button>
    );

  return offset ? (
    <div className={s.wrapper}>
      <div className={s.component}>{renderAction("next", "›", !offset)}</div>
    </div>
  ) : null;
};

export default PaginationButtons;
