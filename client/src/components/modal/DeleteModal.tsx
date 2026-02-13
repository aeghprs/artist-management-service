import type React from "react";
import { Text } from "@mantine/core";

import { DSModal } from "components/ui/modal";


interface DeleteModalProps {
  isPending: boolean;
  actionName: string;
  title: string;
  deleteModalVisible: boolean;
  onCloseHandler: () => void;
  deleteHandler: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isPending,
  actionName,
  title,
  deleteModalVisible,
  onCloseHandler,
  deleteHandler,
}) => {

  return (
    <div>
      <DSModal
        title={title}
        opened={deleteModalVisible}
        onClose={onCloseHandler}
        onPrimaryClick={deleteHandler}
        onSecondaryClick={onCloseHandler}
        primaryButtonLoading={isPending}
      >
        <Text>
          Are you sure you want to delete {actionName} ? This action can't be
          undone.
        </Text>
      </DSModal>
    </div>
  );
};

export default DeleteModal;
