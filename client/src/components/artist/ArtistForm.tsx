import { Grid, Stack } from "@mantine/core";

import type { UseFormReturnType } from "@mantine/form";
import type { ArtistFormValues } from "types/types";

import { DSInput } from "components/ui/input";
import { DSSelect } from "components/ui/select";
import { DSNumberInput } from "components/ui/NumberInput";

interface ArtistFormProps<T extends ArtistFormValues> {
  form: UseFormReturnType<T>;
}

const ArtistForm = <T extends ArtistFormValues>({
  form,
}: ArtistFormProps<T>) => {
  return (
    <Stack>
      <DSInput
        label="Full Name"
        placeholder="John"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />

      <Grid>
        <Grid.Col span={6}>
          <DSInput
            label="Date of Birth"
            type="date"
            key={form.key("dob")}
            {...form.getInputProps("dob")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DSSelect
            label="Gender"
            placeholder="Select gender"
            data={[
              { value: "m", label: "Male" },
              { value: "f", label: "Female" },
              { value: "o", label: "Other" },
            ]}
            key={form.key("gender")}
            {...form.getInputProps("gender")}
          />
        </Grid.Col>
      </Grid>

      <DSInput
        label="Address"
        placeholder="123 Main St"
        key={form.key("address")}
        {...form.getInputProps("address")}
      />

      <Grid>
        <Grid.Col span={6}>
          <DSNumberInput
            label="First Release Year"
            placeholder="2026"
            key={form.key("first_release_year")}
            {...form.getInputProps("first_release_year")}
            max={2100}
            allowNegative={false}
            allowDecimal={false}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <DSNumberInput
            label="No. of Albums Released"
            placeholder="5"
            key={form.key("no_of_albums_released")}
            {...form.getInputProps("no_of_albums_released")}
            allowNegative={false}
            allowDecimal={false}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default ArtistForm;
