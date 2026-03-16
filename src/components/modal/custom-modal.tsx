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

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isModalOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isModalOpen, onClose]);

  if (!isModalOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-0 sm:p-6 md:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-lg sm:my-8 rounded-t-xl sm:rounded-lg border border-border bg-background shadow-xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 max-h-[90vh] sm:max-h-none overflow-y-auto",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn("p-4 sm:p-6", bodyClassName)}>
          {typeof children === "function" ? children(onClose) : children}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
