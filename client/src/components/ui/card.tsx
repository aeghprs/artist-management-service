import { Card, type CardProps } from "@mantine/core";

export const DSCard: React.FC<CardProps> = ({ children, ...props }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder {...props}>
      {children}
    </Card>
  );
};
