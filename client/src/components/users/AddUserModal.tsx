import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";

import type {
  Gender,
  RegisterUser,
  UserRole,
  ValidationError,
} from "types/types";

import UserModal from "./UserModal";
import UserForm from "./UserForm";
import { UserRegisterTitle } from "./UserTitle";
import { DSNotification } from "components/ui/notifications";

import { USER_DEFAULT_VALUES } from "constant/userDefaultValues";
import queryClient from "constant/queryClient";
import { userRegistrationSchema } from "schema/userSchema";
import { register } from "api/auth.api";
import { getErrorMessage } from "utils/errorHandler";
import type { AxiosError } from "axios";

interface AddUserModalProps {
  opened: boolean;
  onClose: () => void;
}

const AddUserModal = ({ opened, onClose }: AddUserModalProps) => {
  const form = useForm<RegisterUser>({
    mode: "uncontrolled",
    initialValues: {
      ...USER_DEFAULT_VALUES,
      confirmPassword: "",
    },
    validate: zodResolver(userRegistrationSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      DSNotification.success(data.message, "");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      form.reset();
      onClose();
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<{
        message?: string;
        errors?: ValidationError[];
      }>;

      // If response data exists and has validation errors
      const errorData = axiosError.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((validationError) => {
          DSNotification.error(
            validationError.field.toUpperCase(),
            validationError.message,
          );
        });
        return;
      }

      DSNotification.error(getErrorMessage(err), "");
    },
  });

  const submitHandler = form.onSubmit((values) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, role, gender, ...rest } = values as RegisterUser;

    mutate({
      ...rest,
      gender: gender as Gender,
      role: role as UserRole,
    });
  });

  return (
    <UserModal
      opened={opened}
      onClose={onClose}
      onPrimaryClick={submitHandler}
      primaryButtonLoading={isPending}
      title={<UserRegisterTitle />}
    >
      <form onSubmit={submitHandler}>
        <UserForm form={form} editMode={false} />
      </form>
    </UserModal>
  );
};

export default AddUserModal;
