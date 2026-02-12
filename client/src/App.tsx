import { useState } from "react";
import { DSButton } from "./components/ui/button";
import { DSInput } from "./components/ui/input";
import { DSModal } from "./components/ui/modal";
import { DSNotification } from "./components/ui/notifications";
import { DSPasswordInput } from "./components/ui/passwordInput";
import { DSSelect } from "./components/ui/select";
import { DSTable } from "./components/ui/table";
import { DSCard } from "./components/ui/card";
import { DSCardSkeleton } from "./components/skeleton/cardSkeleton";
import { DSTableSkeleton } from "./components/skeleton/tableSkeleton";

function App() {
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);

  return (
    <div className="w-2xl mx-auto my-3">
      <DSTable
        data={[
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "Admin",
            status: "Active",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "User",
            status: "Active",
          },
          {
            id: 3,
            name: "Bob Johnson",
            email: "bob@example.com",
            role: "Editor",
            status: "Active",
          },
          {
            id: 4,
            name: "Alice Williams",
            email: "alice@example.com",
            role: "User",
            status: "Inactive",
          },
          {
            id: 5,
            name: "Charlie Brown",
            email: "charlie@example.com",
            role: "User",
            status: "Active",
          },
          {
            id: 6,
            name: "Diana Prince",
            email: "diana@example.com",
            role: "Admin",
            status: "Active",
          },
          {
            id: 7,
            name: "Ethan Hunt",
            email: "ethan@example.com",
            role: "Editor",
            status: "Active",
          },
          {
            id: 8,
            name: "Fiona Green",
            email: "fiona@example.com",
            role: "User",
            status: "Inactive",
          },
          {
            id: 9,
            name: "George Martin",
            email: "george@example.com",
            role: "User",
            status: "Active",
          },
          {
            id: 10,
            name: "Hannah Lee",
            email: "hannah@example.com",
            role: "Editor",
            status: "Active",
          },
          {
            id: 11,
            name: "Ivan Petrov",
            email: "ivan@example.com",
            role: "User",
            status: "Active",
          },
          {
            id: 12,
            name: "Julia Roberts",
            email: "julia@example.com",
            role: "Admin",
            status: "Active",
          },
        ]}
        itemsPerPage={5}
        withPagination
      />

      <DSTableSkeleton rows={5} columns={5} withPagination />

      <div className="card mt-2 mx-2  flex justify-center">
        <div className="flex flex-col gap-3 mt-2">
          <DSButton color="primary" size="sm">
            Small
          </DSButton>
          <DSInput
            label="Email"
            placeholder="your.email@example.com"
            leftIcon="mail"
            className="mt-4"
            color="secondary"
          />
          <DSPasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            className="mt-4"
          />
          <DSSelect
            label="Choose Framework"
            placeholder="Select a framework"
            data={[
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
              { value: "angular", label: "Angular" },
              { value: "svelte", label: "Svelte" },
            ]}
            value={""}
            onChange={() => {}}
          />

          <DSButton
            color="primary"
            onClick={() =>
              DSNotification.success(
                "Success!",
                "Operation completed successfully",
              )
            }
          >
            Success Notification
          </DSButton>

          <DSButton color="primary" onClick={() => setConfirmModalOpened(true)}>
            Confirmation Modal
          </DSButton>

          <DSModal
            opened={confirmModalOpened}
            onClose={() => setConfirmModalOpened(false)}
            title="Confirm Action"
            primaryButtonText="Confirm"
            secondaryButtonText="Cancel"
            onPrimaryClick={() => {
              DSNotification.success(
                "Confirmed",
                "Action confirmed successfully!",
              );
              setConfirmModalOpened(false);
            }}
          >
            <p className="text-gray-700">
              Are you sure you want to proceed with this action? This modal has
              both primary and secondary buttons. The secondary button will
              close the modal by default.
            </p>
          </DSModal>

          <DSCard>
            <div className="space-y-3">
              <DSInput placeholder="Enter your name" label="Name" />
              <DSInput placeholder="Enter your email" label="Email" />
              <div className="flex gap-2 pt-2">
                <DSButton color="primary" size="sm" fullWidth>
                  Submit
                </DSButton>
                <DSButton
                  color="secondary"
                  variant="outline"
                  size="sm"
                  fullWidth
                >
                  Reset
                </DSButton>
              </div>
            </div>
          </DSCard>

          <DSCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export default App;
