import { Text, Title } from "@mantine/core";

export const UserRegisterTitle = () => {
  return (
    <div>
      {" "}
      <Title order={4} ta="center" mb={4}>
        Create an account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="lg">
        Register an user
      </Text>
    </div>
  );
};

export const UserUpdateTitle = () => {
  return (
    <div>
      {" "}
      <Title order={4} ta="center" mb={4}>
        User Details
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="lg">
        Update necessary fields
      </Text>
    </div>
  );
};
