export const transformToSelectOptions = (
  users:
    | {
        first_name: string;
        last_name: string;
        id: number;
      }[]
    | [],
) => {
  if (!users.length) return [];

  return users.map((user) => ({
    value: String(user.id),
    label: `${user.first_name} ${user.last_name}`,
  }));
};
