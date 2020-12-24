import React, { ReactNode, useState } from "react";
import ReactModal from "react-modal";
import Icon from "./Icon";
import s from "./ModalWithButton.module.scss";

ReactModal.setAppElement("#root");

type Props = {
  modalContent: ReactNode;
  buttonLabel: string;
};

const ModalWithButton = ({ modalContent, buttonLabel }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const modal = {
    onAfterOpen: () => (document.body.style.overflow = "hidden"),
    onAfterClose: () => (document.body.style.overflow = "auto"),
    onRequestClose: close,
    className: s.content,
    overlayClassName: s.overlay,
    isOpen
  };

  return (
    <>
      <button onClick={open} className={s.button}>
        {buttonLabel}
      </button>

      <ReactModal {...modal}>
        <button className={s.close} onClick={close}>
          <Icon name="close" size={20} className={s.icon} />
        </button>

        {modalContent}
      </ReactModal>
    </>
  );
};

export default ModalWithButton;
