import { Request, Response } from "express";
import { parse } from "json2csv";
import ArtistBatchService from "../services/artistBatch.services";

const artistBatchService = new ArtistBatchService();

class ArtistBatchController {
  public async exportCSV(
    req: Request,
    res: Response,
  ): Promise<Response | void> {
    try {
      const artists = await artistBatchService.exportArtists();

      const fields = [
        "name",
        "dob",
        "gender",
        "address",
        "first_release_year",
        "no_of_albums_released",
      ];

      const csvData = parse(artists, { fields });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=artists_export.csv",
      );

      return res.status(200).send(csvData);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error exporting CSV",
      });
    }
  }

  async importCSV(req: Request, res: Response): Promise<Response> {
    try {
      const validatedArtists = req.body.validatedArtists;

      const inserted =
        await artistBatchService.batchInsertArtists(validatedArtists);

      return res.status(200).json({
        success: true,
        message: "All artists imported successfully",
        summary: {
          total: validatedArtists.length,
          successful: inserted.length,
          failed: 0,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error exporting CSV",
      });
    }
  }
}

export default ArtistBatchController;
