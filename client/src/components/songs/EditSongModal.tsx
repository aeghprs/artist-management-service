import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";

import type { RegisterSong, Song } from "types/types";

import SongForm from "./SongForm";
import { SongUpdateTitle } from "./SongTitle";

import AddEditModal from "components/modal/AddOrEditModal";
import { DSNotification } from "components/ui/notifications";

import queryClient from "constant/queryClient";

import { songRegistrationSchema } from "schema/songSchema";

import { updateSong } from "api/songs.api";

import { getErrorMessage } from "utils/errorHandler";

interface EditSongModalProps {
  opened: boolean;
  onClose: () => void;
  song: Song | null;
}

const EditSongModal = ({ opened, onClose, song }: EditSongModalProps) => {
  const form = useForm<RegisterSong>({
    mode: "uncontrolled",
    initialValues: {} as RegisterSong,
    validate: zodResolver(songRegistrationSchema),
  });

  useEffect(() => {
    if (song) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, artist_id, ...others } = song;

      form.setValues({ ...others });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterSong) => updateSong(Number(song!.id), data),
    onSuccess: (data) => {
      DSNotification.success(data.message, "");
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      form.reset();
      onClose();
    },
    onError: (err) => {
       DSNotification.error(getErrorMessage(err), "");
    },
  });

  const submitHandler = form.onSubmit((values) => {
    mutate(values as RegisterSong);
  });

  return (
    <AddEditModal
      opened={opened}
      onClose={onClose}
      onPrimaryClick={submitHandler}
      primaryButtonLoading={isPending}
      title={<SongUpdateTitle />}
    >
      <form onSubmit={submitHandler}>
        <SongForm form={form} />
      </form>
    </AddEditModal>
  );
};

export default EditSongModal;
