import { Text, Title } from "@mantine/core";

export const AddArtistTitle = () => {
  return (
    <div>
      {" "}
      <Title order={4} ta="center" mb={4}>
        Create artist
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="lg">
        Add artist details
      </Text>
    </div>
  );
};

export const ArtistUpdateTitle = () => {
  return (
    <div>
      {" "}
      <Title order={4} ta="center" mb={4}>
        Artist Details
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="lg">
        Update necessary fields
      </Text>
    </div>
  );
};
