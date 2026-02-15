import { Text, Title } from "@mantine/core";

export const SongRegisterTitle = () => {
  return (
    <div>
      {" "}
      <Title order={4} ta="center" mb={4}>
        Create Song
      </Title>
    </div>
  );
};

export const SongUpdateTitle = () => {
  return (
    <div>
      {" "}
      <Title order={4} ta="center" mb={4}>
        Song Details
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="lg">
        Update necessary fields
      </Text>
    </div>
  );
};
