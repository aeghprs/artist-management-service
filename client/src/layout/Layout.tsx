import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  AppShell,
  Avatar,
  Burger,
  Flex,
  Group,
  NavLink,
  ScrollArea,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMusic } from "@tabler/icons-react";

import { DSButton } from "components/ui/button";

import { USER_ROLES } from "constant/userDefaultValues";
import { NAV_ITEMS } from "constant/navItems";

import { useAuth } from "contexts/AuthContext";

import type { UserRole } from "../types/types";
export function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const { user } = useAuth();

  if (!user) return null;

  const { first_name, last_name, role, email } = user;

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" gap="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="md"
            color="primary.5"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="md"
            color="primary.5"
          />
          <Flex
            gap="md"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <ThemeIcon size={36} radius="md" variant="filled">
              <IconMusic size={28} />
            </ThemeIcon>
            <Text
              size="md"
              tt="uppercase"
              style={{ letterSpacing: 2 }}
              color="primary.5"
            >
              Artist Management System
            </Text>
          </Flex>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        <AppShell.Section grow my="md" component={ScrollArea}>
          {NAV_ITEMS.filter((item) => item.roles.includes(role)).map(
            (item) => (
              <NavLink
                key={item.label}
                label={item.label}
                leftSection={<item.icon size={24} stroke={1.5} />}
                active={location.pathname === item.link}
                onClick={() => navigate(item.link)}
                mb="xs"
              />
            ),
          )}
        </AppShell.Section>
        <AppShell.Section>
          <Group>
            <Avatar radius="xl" color="blue">
              {first_name.charAt(0).toUpperCase()}
              {last_name.charAt(0).toUpperCase()}
            </Avatar>

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={100}>
                {first_name} {last_name} | {USER_ROLES[role] as UserRole}
              </Text>

              <Text c="dimmed" size="sm">
                {email}
              </Text>
            </div>
          </Group>
        </AppShell.Section>

        <AppShell.Section p="sm">
          <DSButton leftIcon="logout" fullWidth color="danger.2">
            Logout
          </DSButton>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
