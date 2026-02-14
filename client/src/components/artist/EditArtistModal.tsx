import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";

import type { Artist, RegisterArtist } from "types/types";

import AddEditModal from "components/modal/AddOrEditModal";
import ArtistForm from "./ArtistForm";
import { DSNotification } from "components/ui/notifications";
import { ArtistUpdateTitle } from "./ArtistTitle";

import queryClient from "constant/queryClient";
import { artistRegistrationSchema } from "schema/artistSchema";
import { updateArtist } from "api/artists.api";

interface EditArtistModalProps {
  opened: boolean;
  onClose: () => void;
  artist: Artist | null;
}

const EditArtistModal = ({ opened, onClose, artist }: EditArtistModalProps) => {
  const form = useForm<RegisterArtist>({
    mode: "uncontrolled",
    initialValues: {} as RegisterArtist,
    validate: zodResolver(artistRegistrationSchema),
  });

  useEffect(() => {
    if (artist) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...others } = artist;
      form.setValues(others);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterArtist) =>
      updateArtist(Number(artist!.id), data),
    onSuccess: (data) => {
      DSNotification.success(data.message, "");
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      onClose();
    },
    onError: (err) => {
      DSNotification.error("", err?.response?.data?.message);
    },
  });

  const submitHandler = form.onSubmit((values) => {
    mutate(values as RegisterArtist);
  });

  return (
    <AddEditModal
      opened={opened}
      onClose={onClose}
      onPrimaryClick={submitHandler}
      primaryButtonLoading={isPending}
      title={<ArtistUpdateTitle />}
    >
      <form onSubmit={submitHandler}>
        <ArtistForm form={form} />
      </form>
    </AddEditModal>
  );
};

export default EditArtistModal;
