import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group, Text, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";

import type { Artist } from "types/types";

import { fetchArtists, deleteArtist } from "api/artists.api";

import AddArtistModal from "components/artist/AddArtistModal";
import EditArtistModal from "components/artist/EditArtistModal";
import DeleteModal from "components/modal/DeleteModal";
import { ArtistSkeleton } from "components/skeleton/ArtistSkeleton";
import { DSButton } from "components/ui/button";
import { DSCard } from "components/ui/card";
import { DSTable } from "components/ui/table";
import { DSNotification } from "components/ui/notifications";

import queryClient from "constant/queryClient";

import { formatGender } from "utils/formatGender";
import ArtistBatch from "components/artist/BatchInput/ArtistBatch";

const Artists = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [selectedRow, setSelectedRow] = useState<Artist | null>(null);
  const [selectedAction, setSelectedAction] = useState<"edit" | "add" | null>(
    null,
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const deleteModalHandler = () => setDeleteModalVisible(false);

  const [artistModalVisible, setArtistModalVisible] = useState<boolean>(false);

  const artistModalHandler = () => setArtistModalVisible(false);

  const { data, isLoading } = useQuery({
    queryKey: ["artists", page, limit],
    queryFn: fetchArtists,
  });

  const mutation = useMutation({
    mutationFn: (id: number) => deleteArtist(id),
    onSuccess: (data) => {
      DSNotification.success(data?.message, "");
      queryClient.invalidateQueries({ queryKey: ["artists"] });
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
      mutation.mutate(Number(selectedRow.id));
    }
  };

  if (isLoading) {
    return <ArtistSkeleton />;
  }

  const { data: paginatedArtistsData, pagination } = data;

  return (
    <DSCard>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={3}>Artists</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Manage artist records and their music
          </Text>
        </div>

        <Group>
        <ArtistBatch />

        <DSButton
          leftIcon={"plus"}
          onClick={() => {
            setSelectedAction("add");
            setArtistModalVisible(true);
          }}
          size="md"
        >
          Add Artists
        </DSButton>
        </Group>
      </Group>
      <DSTable
        data={paginatedArtistsData}
        columns={[
          {
            label: "Full Name",
            key: "name",
            render: (row: Artist) => `${row.name}`,
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
        onView={(row) =>{
          if (row?.id) navigate(`${row.id}/songs`)
        }}
      />

      <DeleteModal
        deleteModalVisible={deleteModalVisible}
        onCloseHandler={deleteModalHandler}
        title={"Delete Artist"}
        actionName={`${selectedRow?.name}`}
        deleteHandler={handleDelete}
        isPending={mutation.isPending}
      />

      <AddArtistModal
        opened={selectedAction === "add" && artistModalVisible}
        onClose={artistModalHandler}
      />

      <EditArtistModal
        opened={selectedAction === "edit" && artistModalVisible}
        onClose={artistModalHandler}
        artist={selectedRow}
      />
    </DSCard>
  );
};

export default Artists;
