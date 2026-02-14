import { Link, useNavigate } from "react-router-dom";
import { Paper, Title, Text, Group, ThemeIcon, Anchor, Stack } from "@mantine/core";
import { IconMusic } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";

import type { Gender, RegisterUser, UserRole, ValidationError } from "types/types";

import UserForm from "components/users/UserForm";
import { UserRegisterTitle } from "components/users/UserTitle";
import { DSNotification } from "components/ui/notifications";
import { DSButton } from "components/ui/button";

import { USER_DEFAULT_VALUES } from "constant/userDefaultValues";
import { userRegistrationSchema } from "schema/userSchema";
import { register } from "api/auth.api";

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
      DSNotification.success(data.message, `Redirecting to login...`);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (err) => {
      const errorData = err?.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((validationError: ValidationError) => {
          // Capitalize field name for better readability
          const fieldName = validationError.field.replace("_", " ");

          DSNotification.error(
            `${fieldName.toUpperCase()}`,
            validationError.message,
          );
        });
      } else {
        DSNotification.error("", err?.response?.data?.message);
      }
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

        <Paper shadow="md" p="xl" radius="md" withBorder>
          <UserRegisterTitle />

          <form
            onSubmit={form.onSubmit((values) => {
              console.log(values)
              handleRegistration(values as RegisterUser);
            })}
          >
            <Stack>
              <UserForm form={form} editMode={false} />

              <DSButton
                type="submit"
                fullWidth
                leftIcon={"check"}
                isPending={isPending}
              >
                Create Account
              </DSButton>
            </Stack>
          </form>

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
