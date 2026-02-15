import { useState } from "react";
import { Group, Text, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";

import { deleteUser, fetchUsers } from "api/user.api";

import { UserSkeleton } from "components/skeleton/UserSkeleton";
import { DSButton } from "components/ui/button";
import { DSCard } from "components/ui/card";
import { DSTable } from "components/ui/table";
import { DSBadge } from "components/ui/Badge";
import AddUserModal from "components/users/AddUserModal";
import EditUserModal from "components/users/EditUserModal";
import DeleteModal from "components/modal/DeleteModal";
import { DSNotification } from "components/ui/notifications";

import queryClient from "constant/queryClient";

import { formatGender } from "utils/formatGender";
import type { User } from "types/types";

import { useAuth } from "contexts/AuthContext";

const Users = () => {
  const { user } = useAuth();
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [selectedRow, setSelectedRow] = useState<User | null>(null);
  const [selectedAction, setSelectedAction] = useState<"edit" | "add" | null>(
    null,
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const deleteModalHandler = () => setDeleteModalVisible(false);

  const [userModalVisible, setUserModalVisible] = useState<boolean>(false);

  const userModalHandler = () => setUserModalVisible(false);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: fetchUsers,
  });
  const mutation = useMutation({
    mutationFn: (id: string) => deleteUser(Number(id)),
    onSuccess: (data) => {
      DSNotification.success(data?.message, "");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteModalVisible(false);
    },
    onError: (err) => {
      DSNotification.error(
        "",
        err.response?.data?.message || "Something went wrong",
      );
    },
  });

  const handleDelete = () => {
    if (selectedRow?.id) {
      mutation.mutate(selectedRow.id);
    }
  };

  if (isLoading) {
    return <UserSkeleton />;
  }

  const { data: paginatedUserData, pagination } = data;

  return (
    <DSCard>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={3}>Users</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Manage system users and their roles
          </Text>
        </div>
        <DSButton
          leftIcon={"plus"}
          onClick={() => {
            setSelectedAction("add");
            setUserModalVisible(true);
          }}
          size="md"
        >
          Add User
        </DSButton>
      </Group>
      <DSTable
        data={paginatedUserData}
        columns={[
          {
            label: "Full Name",
            key: "first_name",
            render: (row: User) => `${row.first_name} ${row.last_name}`,
          },
          { label: "Email", key: "email" },
          { label: "Phone", key: "phone" },
          { label: "Date of Birth", key: "dob" },
          {
            label: "Gender",
            key: "gender",
            render: (row) => formatGender(row.gender),
          },

          {
            label: "Role",
            key: "role",
            render: (row) => <DSBadge role={row.role} />,
          },
          { label: "Address", key: "address" },
        ]}
        totalRecords={pagination.total}
        page={page}
        itemsPerPage={limit}
        onPageChange={setPage}
        onItemsPerPageChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
        withPagination
        loading={isLoading}
        onEdit={(row) => {
          setSelectedRow(row);
          setSelectedAction("edit");
          setUserModalVisible(true);
        }}
        onDelete={(row) => {
          setSelectedRow(row);
          setDeleteModalVisible(true);
        }}
        userRole={user?.role}
        tableName="users"
      />

      <DeleteModal
        deleteModalVisible={deleteModalVisible}
        onCloseHandler={deleteModalHandler}
        title={"Delete User"}
        actionName={`${selectedRow?.first_name} ${selectedRow?.last_name}`}
        deleteHandler={handleDelete}
        isPending={mutation.isPending}
      />

      <AddUserModal
        opened={selectedAction === "add" && userModalVisible}
        onClose={userModalHandler}
      />

      <EditUserModal
        opened={selectedAction === "edit" && userModalVisible}
        onClose={userModalHandler}
        user={selectedRow}
      />
    </DSCard>
  );
};

export default Users;
