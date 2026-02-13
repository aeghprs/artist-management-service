import { Link, useNavigate } from "react-router-dom";
import {
  Paper,
  Title,
  Text,
  Group,
  ThemeIcon,
  Anchor,
  Grid,
  Stack,
} from "@mantine/core";
import { IconMusic } from "@tabler/icons-react";
import { userRegistrationSchema } from "../schema/userSchema";
import { DSInput } from "../components/ui/input";
import { DSButton } from "../components/ui/button";
import { DSPasswordInput } from "../components/ui/passwordInput";
import { DSSelect } from "../components/ui/select";
import { useForm } from "@mantine/form";
import { USER_DEFAULT_VALUES } from "../constant/userDefaultValues";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth.api";
import { DSNotification } from "../components/ui/notifications";
import type {
  Gender,
  RegisterUser,
  UserRole,
  ValidationError,
} from "../types/types";

const Register = () => {
  const navigate = useNavigate();
  const form = useForm({
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
      DSNotification.success(
        data.message,
        `Redirecting to login in 3 seconds...`,
      );

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
    mutate(userToSend);
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
          <Title order={4} ta="center" mb={4}>
            Create an Account
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb="lg">
            Register an user
          </Text>

          <form
            onSubmit={form.onSubmit((values) => {
              handleRegistration(values as RegisterUser);
            })}
          >
            <Stack>
              <Grid>
                <Grid.Col span={6}>
                  <DSInput
                    label="First Name"
                    placeholder="John"
                    key={form.key("first_name")}
                    {...form.getInputProps("first_name")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DSInput
                    label="Last Name"
                    placeholder="Doe"
                    key={form.key("last_name")}
                    {...form.getInputProps("last_name")}
                  />
                </Grid.Col>
              </Grid>

              <DSInput
                label="Email"
                type="email"
                placeholder="john@example.com"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />

              <Grid>
                <Grid.Col span={6}>
                  <DSPasswordInput
                    label="Password"
                    placeholder="••••••••"
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DSPasswordInput
                    label="Confirm Password"
                    placeholder="••••••••"
                    key={form.key("confirmPassword")}
                    {...form.getInputProps("confirmPassword")}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <DSInput
                    label="Phone"
                    placeholder="+1234567890"
                    key={form.key("phone")}
                    {...form.getInputProps("phone")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DSInput
                    label="Date of Birth"
                    type="date"
                    key={form.key("dob")}
                    {...form.getInputProps("dob")}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <DSSelect
                    label="Gender"
                    placeholder="Select gender"
                    data={[
                      { value: "m", label: "Male" },
                      { value: "f", label: "Female" },
                      { value: "o", label: "Other" },
                    ]}
                    key={form.key("gender")}
                    {...form.getInputProps("gender")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DSSelect
                    label="Role"
                    placeholder="Select role"
                    data={[
                      { value: "super_admin", label: "Super Admin" },
                      { value: "artist_manager", label: "Artist Manager" },
                      { value: "artist", label: "Artist" },
                    ]}
                    key={form.key("role")}
                    {...form.getInputProps("role")}
                  />
                </Grid.Col>
              </Grid>

              <DSInput
                label="Address"
                placeholder="123 Main St"
                key={form.key("address")}
                {...form.getInputProps("address")}
              />

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
