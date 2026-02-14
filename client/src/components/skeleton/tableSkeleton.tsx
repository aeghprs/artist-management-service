import { Table, Skeleton } from "@mantine/core";

interface DSTableSkeletonProps {
  rows?: number;
  columns?: number;
  withPagination?: boolean;
}

export const DSTableSkeleton: React.FC<DSTableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  withPagination = false,
}) => {
  return (
    <div className="space-y-4">
      <Table striped withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {Array.from({ length: columns }).map((_, index) => (
              <Table.Th key={index}>
                <Skeleton height={20} width="40%" />
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <Table.Tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Table.Td key={colIndex}>
                  <Skeleton height={20} />
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {withPagination && (
        <div className="flex justify-between">
          <Skeleton height={36} width={100} />{" "}
          <Skeleton height={36} width={300} />
        </div>
      )}
    </div>
  );
};
