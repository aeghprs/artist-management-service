import { Request, Response, NextFunction } from "express";
import csv from "csv-parser";
import { Readable } from "stream";
import {
  transformToValidatedData,
  validateArtistRow,
} from "../utils/validateBatchArtists";

export const validateArtistCsv = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "CSV file is required",
    });
  }

  const rows: any[] = [];
  const errors: any[] = [];

  const stream = Readable.from(req.file.buffer).pipe(csv());

  stream.on("data", (row) => {
    rows.push(row);
  });

  stream.on("end", () => {
    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty",
      });
    }

    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      const rowErrors = validateArtistRow(row);

      if (rowErrors.length > 0) {
        errors.push({
          row: rowNumber,
          errors: rowErrors,
          data: row,
        });
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Validation failed for ${errors.length} row(s)`,
        summary: {
          total: rows.length,
          successful: 0,
          failed: errors.length,
        },
        errors,
      });
    }

    req.body.validatedArtists = rows.map(transformToValidatedData);
    next();
  });

  stream.on("error", () => {
    res.status(400).json({
      success: false,
      message: "Invalid CSV format",
    });
  });
};
