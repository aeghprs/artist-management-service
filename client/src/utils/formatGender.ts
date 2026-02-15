type GenderKey = "m" | "f" | "o";

export const formatGender = (gender: string) => {
  const map: Record<GenderKey, string> = {
    m: "Male",
    f: "Female",
    o: "Other",
  };

  return map[gender as GenderKey] ?? gender;
};
