import {
  Table,
  ScrollArea,
  Select,
  Group,
  Text,
  ActionIcon,
  Center,
} from "@mantine/core";
import { IconEdit, IconTrash, IconInbox, IconMusic } from "@tabler/icons-react";
import { DSPagination } from "./pagination";

interface Column<T> {
  label: string;
  key: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface DSTableProps<T> {
  data: T[];
  columns: Column<T>[];
  totalRecords?: number;
  page?: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (value: number) => void;
  withPagination?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  loading?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DSTable<T extends Record<string, any>>({
  data,
  columns,
  totalRecords = 0,
  page = 1,
  onPageChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  withPagination = false,
  onEdit,
  onDelete,
  onView,
  loading = false,
}: DSTableProps<T>) {
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <>
      <ScrollArea>
        <Table highlightOnHover withColumnBorders withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col.label}>{col.label}</Table.Th>
              ))}

              {(onEdit || onDelete) && <Table.Th ta="center">Actions</Table.Th>}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {!loading && data.length === 0 && (
              <Table.Tr h={50}>
                <Table.Td colSpan={columns.length + 1}>
                  <Center py="xl">
                    <div className="text-center space-y-2">
                      <IconInbox size={40} className="mx-auto opacity-40" />
                      <Text fw={500}>No records found</Text>
                      <Text size="sm" c="dimmed">
                        Try adjusting filters or add new data.
                      </Text>
                    </div>
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}

            {data.map((row, index) => (
              <Table.Tr key={index}>
                {columns.map((col) => (
                  <Table.Td key={String(col.key)}>
                    {col.render ? col.render(row) : row[col.key]}
                  </Table.Td>
                ))}

                {(onEdit || onDelete || onView) && (
                  <Table.Td>
                    <Group justify="center" gap="xs">
                      {onView && (
                        <ActionIcon
                          variant="light"
                          color="green"
                          onClick={() => onView(row)}
                        >
                          <IconMusic size={16} />
                        </ActionIcon>
                      )}

                      {onEdit && (
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => onEdit(row)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      )}

                      {onDelete && (
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => onDelete(row)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {withPagination && (
        <Group justify="space-between" mt="md">
          {onItemsPerPageChange && (
            <Select
              w={120}
              value={String(itemsPerPage)}
              onChange={(val) => onItemsPerPageChange(Number(val))}
              data={["10", "20", "50"]}
            />
          )}

          <DSPagination
            total={totalPages}
            value={page}
            onChange={onPageChange}
          />
        </Group>
      )}
    </>
  );
}
