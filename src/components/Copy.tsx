import React, { useState, ReactNode } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import s from "./Copy.module.scss";

type Props = {
  classNames?: {
    container?: string;
    text?: string;
    button?: string;
    wrapper?: string;
  };
  text: string;
  buttonLabel?: string;
  children?: ReactNode;
  tooltip?: ReactNode;
  style?: object;
};

const Copy = (props: Props) => {
  const {
    classNames = {},
    text,
    buttonLabel,
    children,
    tooltip,
    style
  } = props;
  const [copied, setCopied] = useState(false);

  const showTooltip = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={classNames.container} style={style}>
      {children && <div className={classNames.text}>{children}</div>}

      <section className={classNames.wrapper ?? s.wrapper}>
        <CopyToClipboard text={text} onCopy={showTooltip}>
          <button className={classNames.button} type="button">
            {buttonLabel}
            <Icon name="filter_none" size={12} />
          </button>
        </CopyToClipboard>

        {copied && (tooltip || <Tooltip content="Copied!"></Tooltip>)}
      </section>
    </div>
  );
};

export default Copy;
