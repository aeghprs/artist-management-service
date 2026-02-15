import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";

import type {
  Artist,
  AssociatedUsersForArtist,
  RegisterArtist,
} from "types/types";

import AddEditModal from "components/modal/AddOrEditModal";
import ArtistForm from "./ArtistForm";
import { DSNotification } from "components/ui/notifications";
import { ArtistUpdateTitle } from "./ArtistTitle";

import queryClient from "constant/queryClient";
import { artistRegistrationSchema } from "schema/artistSchema";
import { updateArtist } from "api/artists.api";
import { transformToSelectOptions } from "utils/getAssociatedUserListFromUser";
import { getErrorMessage } from "utils/errorHandler";

interface EditArtistModalProps {
  opened: boolean;
  onClose: () => void;
  artist: Artist | null;
  associatedUserArtistRole: AssociatedUsersForArtist;
}

const EditArtistModal = ({
  opened,
  onClose,
  artist,
  associatedUserArtistRole,
}: EditArtistModalProps) => {
  const form = useForm<RegisterArtist>({
    mode: "uncontrolled",
    initialValues: {} as RegisterArtist,
    validate: zodResolver(artistRegistrationSchema),
  });

  const associatedUserList = transformToSelectOptions([
    ...associatedUserArtistRole,
    ...(artist
      ? [
          {
            id: Number(artist.user_id),
            first_name: artist.associatedUserName.split(" ")[0],
            last_name: artist.associatedUserName.split(" ")[1],
          },
        ]
      : []),
  ]);

  useEffect(() => {
    if (artist) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, user_id, ...others } = artist;

      form.setValues({ ...others, user_id: String(user_id) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterArtist) =>
      updateArtist(Number(artist!.id), data),
    onSuccess: (data) => {
      DSNotification.success(data.message, "");
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["fetchUsersForArtist"] });
      form.reset();
      onClose();
    },
    onError: (err) => {
       DSNotification.error(getErrorMessage(err), "");
    },
  });

  const submitHandler = form.onSubmit((values) => {
    const { user_id, ...others } = values;
    mutate({ ...others, user_id: Number(user_id) } as RegisterArtist);
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
        <ArtistForm form={form} associatedUserList={associatedUserList} />
      </form>
    </AddEditModal>
  );
};

export default EditArtistModal;
