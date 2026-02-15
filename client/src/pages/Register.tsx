import { Link, useNavigate } from "react-router-dom";
import {
  Anchor,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconMusic } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  Gender,
  RegisterUser,
  UserRole,
  ValidationError,
} from "types/types";

import UserForm from "components/users/UserForm";
import { UserRegisterTitle } from "components/users/UserTitle";
import { DSNotification } from "components/ui/notifications";
import { DSButton } from "components/ui/button";

import { USER_DEFAULT_VALUES } from "constant/userDefaultValues";
import { userRegistrationSchema } from "schema/userSchema";
import { register } from "api/auth.api";
import { getErrorMessage } from "utils/errorHandler";

const Register = () => {
  const navigate = useNavigate();

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
      DSNotification.success(data.message, "Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<{
        message?: string;
        errors?: ValidationError[];
      }>;

      const errorData = axiosError.response?.data;

      // Show field-level validation errors if any
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

  const handleRegistration = (data: RegisterUser) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, role, gender, ...userWithoutConfirm } = data;

    const userToSend = {
      ...userWithoutConfirm,
      gender: gender as Gender,
      role: role as UserRole,
    };

    mutate(userToSend as RegisterUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-xl">
        {/* Header */}
        <Group justify="center" mb="xl">
          <ThemeIcon size={48} radius="md" variant="filled">
            <IconMusic size={28} />
          </ThemeIcon>
          <div>
            <Title order={3}>AMS</Title>
            <Text
              size="xs"
              c="dimmed"
              tt="uppercase"
              style={{ letterSpacing: 2 }}
            >
              Artist Management
            </Text>
          </div>
        </Group>

        {/* Registration Form */}
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <UserRegisterTitle />

          <form
            onSubmit={form.onSubmit((values) =>
              handleRegistration(values as RegisterUser),
            )}
          >
            <Stack>
              <UserForm form={form} editMode={false} />
              <DSButton
                type="submit"
                fullWidth
                leftIcon="check"
                isPending={isPending}
              >
                Create Account
              </DSButton>
            </Stack>
          </form>

          {/* Login Link */}
          <Text ta="center" mt="lg" size="sm" c="dimmed">
            Already have an account?{" "}
            <Anchor component={Link} to="/login" size="sm">
              Sign in
            </Anchor>
          </Text>
        </Paper>
      </div>
    </div>
  );
};

export default Register;
