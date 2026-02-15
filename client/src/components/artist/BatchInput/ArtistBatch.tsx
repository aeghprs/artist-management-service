import { FileButton, Group } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import api from "api/api";
import { handleArtistCSVExport } from "api/artists.api";
import { DSButton } from "components/ui/button";
import { DSNotification } from "components/ui/notifications";
import queryClient from "constant/queryClient";
import type { Role } from "constant/userDefaultValues";
import { useState } from "react";
import { getErrorMessage } from "utils/errorHandler";

const ArtistBatch = ({
  role,
  firstName,
  lastName,
}: {
  role: Role | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}) => {
  // eslint-disable-next-line react-hooks/purity
  const [inputKey, setInputKey] = useState(Date.now()); // key to reset FileButton
  const exportMutation = useMutation<Blob, Error, void>({
    mutationFn: async () => {
      return await handleArtistCSVExport();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/artist/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: (data) => {
      console.log("Upload successful:", data);
      DSNotification.success(data.message, "");
      setInputKey(Date.now());
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["fetchUsersForArtist"] });
    },
    onError: (error) => {
      console.error("Upload failed:", error);
       DSNotification.error(getErrorMessage(error), "");
      setInputKey(Date.now());
    },
  });

  if (role != "artist_manager" || !firstName || !lastName) return null;

  const handleExport = async () => {
    try {
      const blob = await exportMutation.mutateAsync();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${firstName} ${lastName} artists_export.csv`,
      );
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
      <FileButton
        key={inputKey}
        onChange={(file) => {
          if (file) uploadMutation.mutate(file);
        }}
        accept=".xls,.xlsx,.csv"
      >
        {(props) => (
          <DSButton
            {...props}
            leftIcon="upload"
            size="md"
            color="secondary.3"
            variant="outline"
            loading={uploadMutation.isPending}
          >
            Import
          </DSButton>
        )}
      </FileButton>
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
