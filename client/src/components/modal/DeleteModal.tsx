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
  note?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isPending,
  actionName,
  title,
  deleteModalVisible,
  onCloseHandler,
  deleteHandler,
  note,
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
        <Text
          color="danger.5"
          style={{ fontStyle: "italic", fontWeight: 500, fontSize: 14 }}
        >
          {note}
        </Text>
      </DSModal>
    </div>
  );
};

export default DeleteModal;
