"use client";

import { ComponentType, ReactElement, useState } from "react";
import Modal from "~/ui/modals";

interface WithModalProps {
  children?: any;
  className?: string;
  isOpen?: boolean;
  size?: string;
  center?: boolean;
  title?: string;
  closeBtn?: ReactElement;
  onClose?: () => void;
  render?: (closeModal: () => void) => ReactElement;
  [key: string]: any; // To accommodate any additional props
}

function withModalState<P>(
  Component: ComponentType<P & { onClick: () => void }>
) {
  return function WrappedWithModal({
    children = <></>,
    className = "",
    isOpen = false,
    size,
    center = false,
    title = "",
    closeBtn = <></>,
    onClose = () => {},
    render = () => null,

    ...rest
  }: WithModalProps & P) {
    const [modal, setModal] = useState({ isOpen });

    const openModal = () => setModal({ isOpen: true });
    const closeModal = () => setModal({ isOpen: false });

    return (
      <>
        <Component onClick={openModal} {...(rest as P)}>
          {children}
        </Component>
        <Modal
          className={className}
          isOpen={modal.isOpen}
          center={center}
          size={size}
          title={title}
          onClose={closeModal}
        >
          {render(closeModal)}
        </Modal>
      </>
    );
  };
}

export default withModalState;
