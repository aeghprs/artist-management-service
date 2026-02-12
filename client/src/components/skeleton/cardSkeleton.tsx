import { Card, Skeleton } from "@mantine/core";

export const DSCardSkeleton: React.FC = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <div className="mt-4 space-y-3">
        <Skeleton height={48} />
      </div>
    </Card>
  );
};
