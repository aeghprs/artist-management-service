import { Modal, type ModalProps } from "@mantine/core";
import { DSButton } from "./button";

interface DSModalProps extends Omit<ModalProps, "onClose"> {
  opened: boolean;
  onClose: () => void;
  title: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryButtonLoading?: boolean;
  secondaryButtonLoading?: boolean;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
  hidePrimaryButton?: boolean;
  hideSecondaryButton?: boolean;
  children: React.ReactNode;
}

export const DSModal: React.FC<DSModalProps> = ({
  opened,
  onClose,
  title,
  primaryButtonText = "Confirm",
  secondaryButtonText = "Cancel",
  onPrimaryClick,
  onSecondaryClick,
  primaryButtonLoading = false,
  secondaryButtonLoading = false,
  primaryButtonDisabled = false,
  secondaryButtonDisabled = false,
  hidePrimaryButton = false,
  hideSecondaryButton = false,
  children,
  ...props
}) => {
  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      onClose();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered {...props}>
      <div className="mb-6">{children}</div>

      <div className="flex justify-end gap-3">
        {!hideSecondaryButton && (
          <DSButton
            variant="outline"
            color="secondary"
            onClick={handleSecondaryClick}
            loading={secondaryButtonLoading}
            disabled={secondaryButtonDisabled}
          >
            {secondaryButtonText}
          </DSButton>
        )}

        {!hidePrimaryButton && (
          <DSButton
            variant="filled"
            color="danger.4"
            onClick={handlePrimaryClick}
            loading={primaryButtonLoading}
            disabled={primaryButtonDisabled}
          >
            {primaryButtonText}
          </DSButton>
        )}
      </div>
    </Modal>
  );
};
