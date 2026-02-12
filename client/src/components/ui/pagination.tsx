import { Pagination, type PaginationProps } from "@mantine/core";

interface DSPaginationProps extends PaginationProps {
  total: number;
  value: number;
  onChange: (page: number) => void;
}

export const DSPagination: React.FC<DSPaginationProps> = ({
  total,
  value,
  onChange,
  ...props
}) => {
  return (
    <Pagination
      total={total}
      value={value}
      onChange={onChange}
      color="primary"
      size="md"
      {...props}
    />
  );
};
