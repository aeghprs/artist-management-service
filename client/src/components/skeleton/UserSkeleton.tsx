import { Card, Flex, Skeleton, Stack } from "@mantine/core";
import { DSTableSkeleton } from "./tableSkeleton";

export const UserSkeleton: React.FC = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        <Flex gap="lg" justify="space-between" align="center">
          <Skeleton height={40} radius="md" width="50%" />

          <Skeleton height={40} radius="md" width="10%" />
        </Flex>
        <DSTableSkeleton columns={5} rows={10} withPagination />
      </Stack>
    </Card>
  );
};
