import { Group } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { handleArtistCSVExport } from "api/artists.api";
import { DSButton } from "components/ui/button";
import { DSNotification } from "components/ui/notifications";
import type { Role } from "constant/userDefaultValues";

const ArtistBatch = ({ role }: { role: Role | undefined }) => {
  const exportMutation = useMutation<Blob, Error, void>({
    mutationFn: async () => {
      return await handleArtistCSVExport();
    },
  });

  if (role != "artist_manager") return null;

  const handleExport = async () => {
    try {
      const blob = await exportMutation.mutateAsync();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "artists_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      DSNotification.success("", "Artist data exported successfully");
    } catch (err) {
      console.error("CSV export failed:", err);
      DSNotification.error("CSV export failed:", "Unexpected error occurred");
    }
  };

  return (
    <Group>
      <DSButton
        leftIcon={"upload"}
        onClick={() => {
          //   setSelectedAction("add");
          //   setArtistModalVisible(true);
        }}
        size="md"
        color="secondary.3"
        variant="outline"
      >
        Import
      </DSButton>
      <DSButton
        leftIcon="download"
        onClick={handleExport}
        size="md"
        color="secondary.3"
        variant="outline"
        loading={exportMutation.isPending}
      >
        Export
      </DSButton>
    </Group>
  );
};

export default ArtistBatch;
