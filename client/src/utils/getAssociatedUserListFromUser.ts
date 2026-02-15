type User = {
  id: number;
  first_name: string;
  last_name: string;
};

export const transformToSelectOptions = (users: User[] = []) => {
  return users.map((user) => ({
    value: String(user.id),
    label: `${user.first_name} ${user.last_name}`,
  }));
};
