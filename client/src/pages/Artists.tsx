import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group, Text, Title } from "@mantine/core";
import { useQuery, useMutation } from "@tanstack/react-query";

import type { Artist } from "types/types";

import {
  fetchArtists,
  deleteArtist,
  fetchUsersForArtistRole,
} from "api/artists.api";

import { useAuth } from "contexts/AuthContext";

import { DSButton } from "components/ui/button";
import { DSCard } from "components/ui/card";
import { DSTable } from "components/ui/table";
import { DSNotification } from "components/ui/notifications";

import DeleteModal from "components/modal/DeleteModal";
import AddArtistModal from "components/artist/AddArtistModal";
import EditArtistModal from "components/artist/EditArtistModal";
import ArtistBatch from "components/artist/BatchInput/ArtistBatch";

import { ArtistSkeleton } from "components/skeleton/ArtistSkeleton";

import queryClient from "constant/queryClient";

import { formatGender } from "utils/formatGender";
import { getErrorMessage } from "utils/errorHandler";

const Artists = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<Artist | null>(null);
  const [selectedAction, setSelectedAction] = useState<"edit" | "add" | null>(
    null,
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [artistModalVisible, setArtistModalVisible] = useState(false);

  const deleteModalHandler = () => setDeleteModalVisible(false);
  const artistModalHandler = () => setArtistModalVisible(false);

  // Fetch artists
  const { data, isLoading } = useQuery({
    queryKey: ["artists", page, limit],
    queryFn: fetchArtists,
  });

  // Fetch users for dropdown in Artist modals
  const {
    data: associatedUserArtistRole,
    isLoading: isDropdownOptionsLoading,
  } = useQuery({
    queryKey: ["fetchUsersForArtist"],
    queryFn: fetchUsersForArtistRole,
  });

  // Delete mutation
  const mutation = useMutation({
    mutationFn: (id: number) => deleteArtist(id),
    onSuccess: (data) => {
      DSNotification.success(data?.message, "");
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["fetchUsersForArtist"] });
      setDeleteModalVisible(false);
    },
    onError: (err) => {
      DSNotification.error(getErrorMessage(err), "");
    },
  });

  const handleDelete = () => {
    if (selectedRow?.id) mutation.mutate(Number(selectedRow.id));
  };

  if (isLoading || isDropdownOptionsLoading) return <ArtistSkeleton />;

  const { data: paginatedArtistsData, pagination } = data;

  return (
    <DSCard>
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={3}>Artists</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Manage artist records and their music
          </Text>
        </div>

        <Group>
          <ArtistBatch
            role={user?.role}
            firstName={user?.first_name}
            lastName={user?.last_name}
          />

          {user?.role === "artist_manager" && (
            <DSButton
              leftIcon="plus"
              onClick={() => {
                setSelectedAction("add");
                setArtistModalVisible(true);
              }}
              size="md"
            >
              Add Artists
            </DSButton>
          )}
        </Group>
      </Group>

      {/* Artists Table */}
      <DSTable
        data={paginatedArtistsData}
        columns={[
          { label: "Associated User Name", key: "associatedUserName" },
          {
            label: "Full Name",
            key: "name",
            render: (row: Artist) => row.name,
          },
          { label: "Date of Birth", key: "dob" },
          {
            label: "Gender",
            key: "gender",
            render: (row) => formatGender(row.gender),
          },
          { label: "Address", key: "address" },
          { label: "First Release Year", key: "first_release_year" },
          { label: "Albums", key: "no_of_albums_released" },
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
          setArtistModalVisible(true);
        }}
        onDelete={(row) => {
          setSelectedRow(row);
          setDeleteModalVisible(true);
        }}
        onView={(row) => row?.id && navigate(`${row.id}/songs`)}
        userRole={user?.role}
        tableName="artists"
      />

      {/* Delete Modal */}
      <DeleteModal
        deleteModalVisible={deleteModalVisible}
        onCloseHandler={deleteModalHandler}
        title="Delete Artist"
        actionName={selectedRow?.name || ""}
        deleteHandler={handleDelete}
        isPending={mutation.isPending}
        note="Note: Deleting this artist will permanently delete all associated songs."
      />

      {/* Add/Edit Artist Modals */}
      <AddArtistModal
        opened={selectedAction === "add" && artistModalVisible}
        onClose={artistModalHandler}
        associatedUserArtistRole={associatedUserArtistRole}
      />
      <EditArtistModal
        opened={selectedAction === "edit" && artistModalVisible}
        onClose={artistModalHandler}
        artist={selectedRow}
        associatedUserArtistRole={associatedUserArtistRole}
      />
    </DSCard>
  );
};

export default Artists;
