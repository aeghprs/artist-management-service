export const formatGender = (gender: string) => {
  const map: Record<string, string> = {
    m: "Male",
    f: "Female",
    o: "Other",
  };

  return map[gender] || gender;
};
