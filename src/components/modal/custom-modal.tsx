import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode | ((closeModal: () => void) => React.ReactNode);
  title?: string;
  className?: string;
  bodyClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
   bodyClassName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const modalContent = ( 
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto z-50 max-h-screen">
      <div
        // ref={modalRef}
        className={cn(
          "bg-white rounded-lg shadow-xl w-fit min-w-md mt-12 mb-16 max-h-fit",
          className,
        )}
        // Ensure modal content handles propagation
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-2 py-1 ${bodyClassName}`}>
          {typeof children === "function" ? children(onClose) : children}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
