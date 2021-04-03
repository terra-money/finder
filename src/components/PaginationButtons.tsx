import s from "./PaginationButtons.module.scss";

type Props = {
  action?: (offset: number) => void;
  offset?: number;
};

const PaginationButtons = ({ action, offset }: Props) => {
  const renderAction = (key: string, children: string, disabled: boolean) =>
    disabled ? (
      <span className={s[key]}>{children}</span>
    ) : (
      <button
        onClick={() => action && offset && action(offset)}
        className={s[key]}
      >
        {children}
      </button>
    );

  return (
    <div className={s.wrapper}>
      <div className={s.component}>{renderAction("next", "›", !offset)}</div>
    </div>
  );
};

export default PaginationButtons;
