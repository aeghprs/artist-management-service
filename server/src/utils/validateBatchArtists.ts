import { ArtistCSVRow, IBatchArtist } from "../types/artist.types";
import { GenderType } from "../types/user.types";

export interface ValidationError {
  row: number;
  errors: string[];
  data: ArtistCSVRow;
}

export interface ImportResponse {
  success: boolean;
  message: string;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
  errors?: ValidationError[];
}

/**
 * Validate a single artist row
 * Returns validation errors array (empty if valid)
 */
export const validateArtistRow = (data: any): string[] => {
  const errors: string[] = [];

  // Validate name
  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required");
  }

  // Validate dob
  if (!data.dob || data.dob.trim() === "") {
    errors.push("Date of birth is required");
  } else {
    const dobDate = new Date(data.dob);
    if (isNaN(dobDate.getTime())) {
      errors.push("Invalid date of birth format (use YYYY-MM-DD)");
    }
  }

  // Validate gender
  if (!data.gender || data.gender.trim() === "") {
    errors.push("Gender is required");
  } else {
    const validGenders = Object.values(GenderType);
    if (!validGenders.includes(data.gender.toLowerCase() as GenderType)) {
      errors.push("Gender must be one of: m, f, o");
    }
  }

  // Validate address
  if (!data.address || data.address.trim() === "") {
    errors.push("Address is required");
  }

  // Validate first_release_year
  if (!data.first_release_year || data.first_release_year.trim() === "") {
    errors.push("First release year is required");
  } else {
    const year = parseInt(data.first_release_year);
    const currentYear = new Date().getFullYear();
    if (isNaN(year)) {
      errors.push("First release year must be a number");
    } else if (year < 1900 || year > currentYear) {
      errors.push(`First release year must be between 1900 and ${currentYear}`);
    }
  }

  // Validate no_of_albums_released
  if (
    data.no_of_albums_released === undefined ||
    data.no_of_albums_released === null ||
    data.no_of_albums_released === ""
  ) {
    errors.push("Number of albums released is required");
  } else {
    const albums = parseInt(data.no_of_albums_released);
    if (isNaN(albums)) {
      errors.push("Number of albums must be a number");
    } else if (albums < 0) {
      errors.push("Number of albums must be non-negative");
    }
  }

  return errors;
};

export const transformToValidatedData = (data: ArtistCSVRow): IBatchArtist => {
  return {
    name: data.name.trim(),
    dob: data.dob.trim(),
    gender: data.gender.toLowerCase().trim(),
    address: data.address.trim(),
    first_release_year: parseInt(data.first_release_year),
    no_of_albums_released: parseInt(data.no_of_albums_released),
  };
};
