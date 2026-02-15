import {
  Avatar,
  Badge,
  Box,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

import { DSBadge } from "components/ui/Badge";

import { DUMMY_STATS } from "constant/mockData";

import { useAuth } from "contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      {" "}
      <Stack gap="xl">
        {/* Welcome header */}
        <Paper
          p="xl"
          radius="lg"
          withBorder
          style={{
            background:
              "linear-gradient(135deg, var(--mantine-color-teal-9) 0%, var(--mantine-color-cyan-9) 100%)",
          }}
        >
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="sm" c="white" opacity={0.8}>
                Welcome back
              </Text>
              <Title order={2} c="white" mt={4}>
                {user?.first_name} {user?.last_name}
              </Title>
              <Group mt="sm" gap="xs">
                <Badge
                  variant="white"
                  color="dark"
                  size="lg"
                  leftSection={
                    <Box
                      component={IconUser}
                      style={{ width: 14, height: 14 }}
                    />
                  }
                >
                  {<DSBadge role={user?.role} />}
                </Badge>
                <Badge variant="light" color="white" size="lg">
                  {user?.email}
                </Badge>
              </Group>
            </div>
            <Avatar
              radius="xl"
              size={64}
              color="primary.6"
              variant="filled"
              style={{ color: "var(--mantine-color-teal-7)" }}
            >
              {user?.first_name[0]}
              {user?.last_name[0]}
            </Avatar>
          </Group>
        </Paper>

        {/* Stat cards */}
        <SimpleGrid cols={{ base: 2, sm: 2, lg: 4 }}>
          {DUMMY_STATS.map((stat) => (
            <Paper key={stat.label} p="lg" radius="md" withBorder>
              <Group justify="space-between" align="flex-start">
                <ThemeIcon
                  size={44}
                  radius="lg"
                  variant="light"
                  color={stat.color}
                >
                  <stat.icon size={22} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" ta="right" maw={80}>
                  {stat.desc}
                </Text>
              </Group>
              <Title order={2} mt="md">
                {stat.value}
              </Title>
              <Text size="sm" c="dimmed" mt={2}>
                {stat.label}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Stack>
    </div>
  );
};

export default Dashboard;
