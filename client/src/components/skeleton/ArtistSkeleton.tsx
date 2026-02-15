import { Card, Flex, Group, Skeleton, Stack } from "@mantine/core";

import { DSTableSkeleton } from "./tableSkeleton";

export const ArtistSkeleton: React.FC = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        <Flex gap="lg" justify="space-between" align="center">
          <Skeleton height={40} radius="md" width="50%" />

          <Group >
            <Skeleton height={40} radius="sm" width={100} />
            <Skeleton height={40} radius="sm" width={100} />
            <Skeleton height={40} radius="sm" width={100} />
          </Group>
        </Flex>

        <DSTableSkeleton columns={5} rows={10} withPagination />
      </Stack>
    </Card>
  );
};