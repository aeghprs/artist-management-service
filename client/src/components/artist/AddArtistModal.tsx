import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  AssociatedUsersForArtist,
  Gender,
  RegisterArtist,
  ValidationError,
} from "types/types";

import ArtistForm from "./ArtistForm";
import { AddArtistTitle } from "./ArtistTitle";

import AddEditModal from "components/modal/AddOrEditModal";
import { DSNotification } from "components/ui/notifications";

import { ARTIST_VALUES } from "constant/artistDefaultValues";
import queryClient from "constant/queryClient";

import { artistRegistrationSchema } from "schema/artistSchema";

import { createNewArtist } from "api/artists.api";

import { transformToSelectOptions } from "utils/getAssociatedUserListFromUser";
import { getErrorMessage } from "utils/errorHandler";

interface AddArtistModalProps {
  opened: boolean;
  onClose: () => void;
  associatedUserArtistRole: AssociatedUsersForArtist;
}

const AddArtistModal = ({
  opened,
  onClose,
  associatedUserArtistRole,
}: AddArtistModalProps) => {
  const form = useForm<RegisterArtist>({
    mode: "uncontrolled",
    initialValues: {
      ...ARTIST_VALUES,
    },
    validate: zodResolver(artistRegistrationSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createNewArtist,
    onSuccess: (data) => {
      DSNotification.success(data.message, "");
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["fetchUsersForArtist"] });

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
    const { gender, user_id, ...rest } = values as RegisterArtist;

    mutate({
      ...rest,
      user_id: Number(user_id),
      gender: gender as Gender,
    });
  });

  const associatedUserList = transformToSelectOptions(associatedUserArtistRole);

  return (
    <AddEditModal
      opened={opened}
      onClose={onClose}
      onPrimaryClick={submitHandler}
      primaryButtonLoading={isPending}
      title={<AddArtistTitle />}
    >
      <form onSubmit={submitHandler}>
        <ArtistForm form={form} associatedUserList={associatedUserList} />
      </form>
    </AddEditModal>
  );
};

export default AddArtistModal;
