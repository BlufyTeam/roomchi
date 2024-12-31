import Modal from "~/ui/modals";
export default function withModal(Component) {
  return function WrappedwithModal({
    children,
    isOpen,
    size,
    center = false,
    title = "",
    onClose = () => {},
    columns = [],
    data = [],
    ...rest
  }) {
    return (
      <>
        <Component {...{ columns, data, ...rest }} />

        <Modal {...{ isOpen, center, size, title, onClose }}>
          <div
            dir="rtl"
            className="flex h-full w-full flex-grow justify-center overflow-y-auto"
          >
            <div className="flex h-full w-full flex-1  flex-grow items-start justify-center px-10">
              {children}
            </div>
          </div>
        </Modal>
      </>
    );
  };
}
