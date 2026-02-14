import React from "react";
import { DSModal } from "components/ui/modal";

interface UserModalProps {
  opened: boolean;
  onClose: () => void;
  onPrimaryClick: () => void;
  primaryButtonLoading?: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
}

const UserModal: React.FC<UserModalProps> = ({
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

export default UserModal;
