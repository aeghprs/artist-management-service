import React from "react";

import { DSModal } from "components/ui/modal";

interface AddEditModalProps {
  opened: boolean;
  onClose: () => void;
  onPrimaryClick: () => void;
  primaryButtonLoading?: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
}

const AddEditModal: React.FC<AddEditModalProps> = ({
  opened,
  onClose,
  onPrimaryClick,
  primaryButtonLoading,
  title,
  children,
}) => {
  return (
    <DSModal
      opened={opened}
      onClose={onClose}
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onClose}
      primaryButtonLoading={primaryButtonLoading}
      isDestructiveModal={false}
      size="lg"
    >
      {title}
      {children}
    </DSModal>
  );
};

export default AddEditModal;
