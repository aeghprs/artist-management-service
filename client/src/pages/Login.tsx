import { Link, useNavigate } from "react-router-dom";
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  ThemeIcon,
  Anchor,
} from "@mantine/core";
import { IconMusic } from "@tabler/icons-react";
import { DSInput } from "../components/ui/input";
import { DSPasswordInput } from "../components/ui/passwordInput";
import { DSButton } from "../components/ui/button";
import { userLoginSchema } from "../schema/userSchema";
import { LOGIN_DEFAULT_VALUES } from "../constant/userDefaultValues";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth.api";
import type { LoginUser } from "../types/types";
import { DSNotification } from "../components/ui/notifications";
import useLocalStorage from "../hook/useLocalStorage";
import { useLoadUser } from "../hook/useFetchUser";

const Login = () => {
  const { setToken } = useLocalStorage();
  const { refetch: fetchUser } = useLoadUser();
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      ...LOGIN_DEFAULT_VALUES,
    },

    validate: zodResolver(userLoginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      setToken("accessToken", data.data.accessToken);
      setToken("refreshToken", data.data.refreshToken);


      DSNotification.success(
        data.message,
        `Redirecting to dashboard in 3 seconds...`,
      );

      await fetchUser();
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    },
    onError: (err) => {
      DSNotification.error("", err.response.data.message);
    },
  });

  const handleLogin = (data: LoginUser) => mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
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
              Artist Management System
            </Text>
          </div>
        </Group>

        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Title order={4} ta="center" mb={4}>
            Welcome back
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb="lg">
            Sign in to your account
          </Text>

          <form onSubmit={form.onSubmit(handleLogin)}>
            <Stack>
              <DSInput
                label="Email"
                placeholder="admin@ams.com"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />

              <DSPasswordInput
                label="Password"
                placeholder="••••••••"
                key={form.key("password")}
                {...form.getInputProps("password")}
              />

              <DSButton type="submit" fullWidth isPending={isPending}>
                Sign In
              </DSButton>
            </Stack>
          </form>

          <Text ta="center" mt="lg" size="sm" c="dimmed">
            Don't have an account?{" "}
            <Anchor component={Link} to="/register" size="sm">
              Register here
            </Anchor>
          </Text>
        </Paper>
      </div>
    </div>
  );
};

export default Login;
