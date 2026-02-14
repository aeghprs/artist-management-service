import { Grid, Stack } from "@mantine/core";
import { DSInput } from "components/ui/input";
import { DSPasswordInput } from "components/ui/passwordInput";
import { DSSelect } from "components/ui/select";

import type { UseFormReturnType } from "@mantine/form";
import type { UserFormValues, RegisterUser } from "types/types";

interface UserFormProps<T extends UserFormValues> {
  form: UseFormReturnType<T>;
  editMode?: boolean;
}

const UserForm = <T extends UserFormValues>({
  form,
  editMode = false,
}: UserFormProps<T>) => {
  return (
    <Stack>
      <Grid>
        <Grid.Col span={6}>
          <DSInput
            label="First Name"
            placeholder="John"
            key={form.key("first_name")}
            {...form.getInputProps("first_name")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DSInput
            label="Last Name"
            placeholder="Doe"
            key={form.key("last_name")}
            {...form.getInputProps("last_name")}
          />
        </Grid.Col>
      </Grid>

      <DSInput
        label="Email"
        type="email"
        placeholder="john@example.com"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />

      {!editMode && (
        <PasswordFields form={form as unknown as UseFormReturnType<RegisterUser>} />
      )}

      <Grid>
        <Grid.Col span={6}>
          <DSInput
            label="Phone"
            placeholder="+1234567890"
            key={form.key("phone")}
            {...form.getInputProps("phone")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DSInput
            label="Date of Birth"
            type="date"
            key={form.key("dob")}
            {...form.getInputProps("dob")}
          />
        </Grid.Col>
      </Grid>

      <Grid>
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
        <Grid.Col span={6}>
          <DSSelect
            label="Role"
            placeholder="Select role"
            data={[
              { value: "super_admin", label: "Super Admin" },
              { value: "artist_manager", label: "Artist Manager" },
              { value: "artist", label: "Artist" },
            ]}
            key={form.key("role")}
            {...form.getInputProps("role")}
          />
        </Grid.Col>
      </Grid>

      <DSInput
        label="Address"
        placeholder="123 Main St"
        key={form.key("address")}
        {...form.getInputProps("address")}
      />
    </Stack>
  );
};

export default UserForm;

const PasswordFields = <T extends RegisterUser>({ form }: { form: UseFormReturnType<T> }) => {
  return (
    <Grid>
      <Grid.Col span={6}>
        <DSPasswordInput
          label="Password"
          placeholder="••••••••"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <DSPasswordInput
          label="Confirm Password"
          placeholder="••••••••"
          key={form.key("confirmPassword")}
          {...form.getInputProps("confirmPassword")}
        />
      </Grid.Col>
    </Grid>
  );
};
