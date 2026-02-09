import { Request, Response } from "express";
import { IRegisterArtist } from "../schemas/artist.schema";
import ArtistService from "../services/artist.services";

const artistService = new ArtistService();

class ArtistController {
  public async registerArtist(req: Request, res: Response) {
    try {
      const artistData: IRegisterArtist = req.body;

      const user = await artistService.registerArtist(artistData);

      res.status(201).json({
        success: true,
        message: "Artist Registration successful.",
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Artist registration failed",
      });
    }
  }

  public async getAllArtists(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await artistService.getAllArtists(page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve artists",
      });
    }
  }

  public async getArtist(req: Request, res: Response) {
    try {
      const artist = await artistService.getArtistById(req.params.id);
      if (!artist)
        return res
          .status(404)
          .json({ success: false, message: "Artist not found" });

      res.status(200).json({ success: true, data: artist });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve artist",
        error: error.message,
      });
    }
  }

  public async updateArtist(req: Request, res: Response) {
    try {
      const artist = await artistService.updateArtist(req.params.id, req.body);
      if (!artist)
        return res
          .status(404)
          .json({ success: false, message: "Artist not found or no updates" });

      res.status(200).json({
        success: true,
        message: "Artist updated successfully",
        data: artist,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update artist",
        error: error.message,
      });
    }
  }

  public async deleteArtist(req: Request, res: Response) {
    try {
      const success = await artistService.deleteArtist(req.params.id);
      if (!success)
        return res
          .status(404)
          .json({ success: false, message: "Artist not found" });

      res
        .status(200)
        .json({ success: true, message: "Artist deleted successfully" });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to delete artist",
        error: error.message,
      });
    }
  }
}

export default ArtistController;
