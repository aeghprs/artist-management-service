import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import type { ArtistSongsResponse, SongListItem } from "types/types";

import { getSongsByArtistId } from "api/artists.api";

import { DSButton } from "components/ui/button";
import { DSCard } from "components/ui/card";
import { DSTable } from "components/ui/table";
import { ArtistSongsSkeleton } from "components/skeleton/ArtistSongsSkeleton";

import { transformSongs } from "utils/formatSongs";
import { DSBadge } from "components/ui/Badge";

const SongsByArtist = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();

  const id = Number(artistId);

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const { data: paginatedSongsData, isLoading } = useQuery<ArtistSongsResponse>(
    {
      queryKey: ["songsByArtistId", id, page, limit],
      queryFn: () => getSongsByArtistId(id, page, limit),
      enabled: !!artistId,
    },
  );

  const songsForTable = transformSongs(paginatedSongsData);

  if (isLoading) {
    return <ArtistSongsSkeleton />
  }

  return (
    <DSCard>
      <Stack mb="lg">
        <DSButton
          variant="outline"
          color="secondary.3"
          leftIcon={"arrowLeft"}
          onClick={() => {
            navigate("/artists");
          }}
          style={{ width: "fit-content" }}
        >
          Back To Artists
        </DSButton>
        <div>
          <Title order={3}>Songs</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {paginatedSongsData?.artist?.name} — Songs
          </Text>
        </div>
      </Stack>
      <DSTable
        data={songsForTable}
        columns={[
          {
            label: "Name",
            key: "artist_name",
          },
          { label: "Song Name", key: "title" },
          {
            label: "Album Name",
            key: "album_name",
          },
          {
            label: "Genre",
            key: "genre",
            render: (row: SongListItem) => <DSBadge role={row.genre} />
          },
        ]}
        totalRecords={paginatedSongsData?.pagination.total}
        page={page}
        itemsPerPage={limit}
        onPageChange={setPage}
        onItemsPerPageChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
        withPagination
        loading={isLoading}
        tableName="songsPerArtist"
      />
    </DSCard>
  );
};

export default SongsByArtist;
