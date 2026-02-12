import { Table, ScrollArea, Pagination } from "@mantine/core";
import { useState } from "react";

interface TableData {
  [key: string]: string | number;
}

interface DSTableProps {
  data: TableData[];
  itemsPerPage?: number;
  withPagination?: boolean;
}

export const DSTable: React.FC<DSTableProps> = ({
  data,
  itemsPerPage = 5,
  withPagination = false,
}) => {
  const [activePage, setActivePage] = useState(1);

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">No data available</div>
    );
  }

  const headers = Object.keys(data[0]);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = withPagination
    ? data.slice(startIndex, endIndex)
    : data;

  const rows = paginatedData.map((row, index) => (
    <Table.Tr key={index}>
      {headers.map((header) => (
        <Table.Td key={header}>{row[header]}</Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <div className="space-y-4">
      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              {headers.map((header) => (
                <Table.Th key={header} className="capitalize">
                  {header.replace(/([A-Z])/g, " $1").trim()}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      {withPagination && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setActivePage}
            color="primary"
            size="md"
          />
        </div>
      )}
    </div>
  );
};
