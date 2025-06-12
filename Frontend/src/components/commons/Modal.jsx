import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { Button } from "@/components/commons";
import { CancelIcon } from "@/assets/icons";
import { useEffect, useState } from "react";

function Modal({
  isShow = false,
  submitting = false,
  title,
  children,
  onClose,
  handleEvent,
  buttonRightContent = "",
  noBorder = false,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isShow) return null;

  return createPortal(
    <div
      tabIndex="-1"
      className="fixed inset-0 z-[9998] flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-80 dark:bg-opacity-80 overflow-y-auto transition-all duration-300 ease-in-out"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-slate-800">
          <div className={`flex items-center justify-between p-4 md:p-5 ${noBorder? "":"border-b"} rounded-t dark:border-gray-600`}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            <Button content={<CancelIcon />} handleEvent={onClose} className="text-gray-500 dark:text-white" />
          </div>

          <div className="p-5 pr-2.5 space-y-4">{children}</div>

          {handleEvent && (
            <div className="flex items-center justify-end gap-3 p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <Button
                content="Cancel"
                handleEvent={onClose}
                className="text-gray-900 bg-white border font-medium border-gray-300 text-nowrap text-sm hover:bg-gray-100 rounded-lg px-5 py-3 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-60"
              />
              <Button
                content={buttonRightContent}
                isSubmitting={submitting}
                disabled={submitting}
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                handleEvent={handleEvent}
              />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

Modal.propTypes = {
  isShow: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  handleEvent: PropTypes.func,
  buttonRightContent: PropTypes.string,
  noBorder: PropTypes.bool,
};

export default Modal;
