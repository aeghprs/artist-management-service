import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";

import type { UpdateUser, User } from "types/types";

import UserModal from "./UserModal";
import UserForm from "./UserForm";
import { UserUpdateTitle } from "./UserTitle";
import { DSNotification } from "components/ui/notifications";

import queryClient from "constant/queryClient";
import { userUpdateSchema } from "schema/userSchema";
import { updateUser } from "api/user.api";

interface EditUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
}

const EditUserModal = ({ opened, onClose, user }: EditUserModalProps) => {
  const form = useForm<Omit<User, "password">>({
    mode: "uncontrolled",
    initialValues: {} as Omit<User, "password">,
    validate: zodResolver(userUpdateSchema),
  });

  useEffect(() => {
    if (user) {
      form.setValues(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateUser) => updateUser(Number(user!.id), data),
    onSuccess: (data) => {
      DSNotification.success(data.message, "");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
    onError: (err) => {
      DSNotification.error("", err?.response?.data?.message);
    },
  });

  const submitHandler = form.onSubmit((values) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...others } = values;
    mutate(others as UpdateUser);
  });

  return (
    <UserModal
      opened={opened}
      onClose={onClose}
      onPrimaryClick={submitHandler}
      primaryButtonLoading={isPending}
      title={<UserUpdateTitle />}
    >
      <form onSubmit={submitHandler}>
        <UserForm form={form} editMode />
      </form>
    </UserModal>
  );
};

export default EditUserModal;
