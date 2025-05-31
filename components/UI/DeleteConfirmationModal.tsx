"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FaTimes } from "react-icons/fa";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting = false,
}: DeleteConfirmationModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--bg)] rounded-[var(--border-radius)] shadow-xl p-6 z-20">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold text-[var(--text)]">
              {title}
            </Dialog.Title>
            <Dialog.Close className="text-[var(--text)] hover:opacity-70 cursor-pointer">
              <FaTimes />
            </Dialog.Close>
          </div>

          <p className="text-[var(--text)] mb-6">{message}</p>

          <div className="flex gap-4">            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded-[var(--border-radius)] hover:bg-red-600 transition-colors flex-1 cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <Dialog.Close className="px-4 py-2 bg-[var(--bgSecondary)] border border-[var(--border-color)] text-[var(--text)] rounded-[var(--border-radius)] hover:opacity-90 transition-opacity cursor-pointer">
              Cancel
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};