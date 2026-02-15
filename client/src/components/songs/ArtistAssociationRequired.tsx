import { useNavigate } from "react-router-dom";

import { Title, Text, Stack } from "@mantine/core";

import { useAuth } from "contexts/AuthContext";

const ArtistAssociationRequired = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.isArtistAssociated) navigate("/dashboard");

  return (
    <Stack align="center" gap="sm" mt={50}>
      <Title order={2}>Artist Profile Not Linked</Title>

      <Text ta="center" c="dimmed">
        Hi {user?.first_name}, your account is registered as an artist, but it
        is not yet associated with an artist profile.
      </Text>

      <Text ta="center">
        Please contact the administrator to link your account with an artist
        profile.
      </Text>
    </Stack>
  );
};

export default ArtistAssociationRequired;
