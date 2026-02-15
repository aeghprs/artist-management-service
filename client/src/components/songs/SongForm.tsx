import { Stack } from "@mantine/core";
import { DSInput } from "components/ui/input";

import { DSSelect } from "components/ui/select";

import type { UseFormReturnType } from "@mantine/form";
import type { SongFormValues } from "types/types";

interface SongFormProps<T extends SongFormValues> {
  form: UseFormReturnType<T>;
}

const SongForm = <T extends SongFormValues>({ form }: SongFormProps<T>) => {
  return (
    <Stack>
      <DSInput
        label="Title"
        placeholder="Song Name"
        key={form.key("title")}
        {...form.getInputProps("title")}
      />

      <DSInput
        label="Album Name"
        placeholder="Your album name"
        key={form.key("album_name")}
        {...form.getInputProps("album_name")}
      />

      <DSSelect
        label="Genre"
        placeholder="Select Genre"
        data={[
          { value: "rnb", label: "RNB" },
          { value: "country", label: "Country" },
          { value: "classic", label: "Classic" },
          { value: "rock", label: "Rock" },
          { value: "jazz", label: "Jazz" },
        ]}
        key={form.key("genre")}
        {...form.getInputProps("genre")}
      />
    </Stack>
  );
};

export default SongForm;
