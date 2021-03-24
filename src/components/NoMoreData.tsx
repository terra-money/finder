import s from "./NoMoreData.module.scss";

type Props = {
  context: string;
};

const NoMoreData = (props: Props) => {
  const { context } = props;
  return <div className={s.container}>No more {context}</div>;
};

export default NoMoreData;
