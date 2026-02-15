import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { RegisterSong, Song, ValidationError } from "types/types";

import SongForm from "./SongForm";
import { SongRegisterTitle } from "./SongTitle";

import AddEditModal from "components/modal/AddOrEditModal";
import { DSNotification } from "components/ui/notifications";

import { SONG_VALUES } from "constant/songDefaultValue";
import queryClient from "constant/queryClient";

import { songRegistrationSchema } from "schema/songSchema";

import { createNewSong } from "api/songs.api";

import { getErrorMessage } from "utils/errorHandler";

interface AddSongModalProps {
  opened: boolean;
  onClose: () => void;
  artistId: number | undefined;
}

const AddSongModal = ({ opened, onClose, artistId }: AddSongModalProps) => {
  const form = useForm<RegisterSong>({
    mode: "uncontrolled",
    initialValues: {
      ...SONG_VALUES,
    },
    validate: zodResolver(songRegistrationSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createNewSong,
    onSuccess: (data) => {
      DSNotification.success(data.message, "");
      queryClient.invalidateQueries({ queryKey: ["songs"] });

      form.reset();
      onClose();
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<{
        message?: string;
        errors?: ValidationError[];
      }>;

      // If response data exists and has validation errors
      const errorData = axiosError.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((validationError) => {
          DSNotification.error(
            validationError.field.toUpperCase(),
            validationError.message,
          );
        });
        return;
      }

      DSNotification.error(getErrorMessage(err), "");
    },
  });

  const submitHandler = form.onSubmit((values) => {
    if (!artistId) return;

    mutate({
      ...values,
      artist_id: artistId,
    } as Omit<Song, "id">);
  });

  return (
    <AddEditModal
      opened={opened}
      onClose={onClose}
      onPrimaryClick={submitHandler}
      primaryButtonLoading={isPending}
      title={<SongRegisterTitle />}
    >
      <form onSubmit={submitHandler}>
        <SongForm form={form} />
      </form>
    </AddEditModal>
  );
};

export default AddSongModal;
