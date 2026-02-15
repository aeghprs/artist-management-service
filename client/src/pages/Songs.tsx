import { useState } from "react";
import { Group, Text, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";

import { deleteSong, fetchSongs } from "api/songs.api";

import { DSButton } from "components/ui/button";
import { DSCard } from "components/ui/card";
import { DSTable } from "components/ui/table";
import { DSBadge } from "components/ui/Badge";

import DeleteModal from "components/modal/DeleteModal";
import { DSNotification } from "components/ui/notifications";

import queryClient from "constant/queryClient";

import type { Song } from "types/types";

import { useAuth } from "contexts/AuthContext";
import { SongSkeleton } from "components/skeleton/SongsSkeleton";
import AddSongModal from "components/songs/AddSongModal";
import EditSongModal from "components/songs/EditSongModal";

const Songs = () => {
  const { user } = useAuth();
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [selectedRow, setSelectedRow] = useState<Omit<
    Song,
    "artist_name"
  > | null>(null);
  const [selectedAction, setSelectedAction] = useState<"edit" | "add" | null>(
    null,
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const deleteModalHandler = () => setDeleteModalVisible(false);

  const [songModalVisible, setSongModalVisible] = useState<boolean>(false);

  const songModalHandler = () => setSongModalVisible(false);

  const { data, isPending } = useQuery({
    queryKey: ["songs", user?.isArtistAssociated?.id, page, limit],
    queryFn: fetchSongs,
    enabled: !!user,
  });
  const mutation = useMutation({
    mutationFn: (id: number) => deleteSong(Number(id)),
    onSuccess: (data) => {
      DSNotification.success(data?.message, "");
      queryClient.invalidateQueries({ queryKey: ["songs"] });
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

  if (isPending) {
    return <SongSkeleton />;
  }

  const { songs, pagination } = data;

  return (
    <DSCard>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={3}>Songs</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Manage your songs
          </Text>
        </div>
        <DSButton
          leftIcon={"plus"}
          onClick={() => {
            setSelectedAction("add");
            setSongModalVisible(true);
          }}
          size="md"
        >
          Add Song
        </DSButton>
      </Group>
      <DSTable
        data={songs}
        columns={[
          {
            label: "Title",
            key: "title",
          },
          { label: "Album Name", key: "album_name" },
          {
            label: "Genre",
            key: "genre",
            render: (row: Omit<Song, "artist_name">) => (
              <DSBadge role={row.genre} />
            ),
          },
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
        loading={isPending}
        onEdit={(row) => {
          setSelectedRow(row);
          setSelectedAction("edit");
          setSongModalVisible(true);
        }}
        onDelete={(row) => {
          setSelectedRow(row);
          setDeleteModalVisible(true);
        }}
        userRole={user?.role}
        tableName="songs"
      />

      <DeleteModal
        deleteModalVisible={deleteModalVisible}
        onCloseHandler={deleteModalHandler}
        title={"Delete Song"}
        actionName={`${selectedRow?.title}`}
        deleteHandler={handleDelete}
        isPending={mutation.isPending}
      />

      <AddSongModal
        opened={selectedAction === "add" && songModalVisible}
        onClose={songModalHandler}
        artistId={user?.isArtistAssociated?.id}
      />

      <EditSongModal
        opened={selectedAction === "edit" && songModalVisible}
        onClose={songModalHandler}
        song={selectedRow}
      />
    </DSCard>
  );
};

export default Songs;
