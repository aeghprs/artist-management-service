import { Request, Response } from "express";
import MusicService from "../services/music.services";
import { AppError } from "../utils/errorHandler";

const musicService = new MusicService();

class MusicController {
  public async registerMusic(req: Request, res: Response) {
    try {
      const song = await musicService.createSong(req.params.artistId, req.body);

      res.status(201).json({
        success: true,
        message: "Song created successfully",
        data: song,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create song",
      });
    }
  }

  public async updateMusic(req: Request, res: Response) {
    try {
      const song = await musicService.updateSong(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "Song updated successfully",
        data: song,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(400).json({
        success: false,
        message: "Failed to update song",
      });
    }
  }

  public async deleteMusic(req: Request, res: Response) {
    try {
      await musicService.deleteSong(req.params.id);

      res.status(200).json({
        success: true,
        message: "Song deleted successfully",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete Song",
      });
    }
  }

  public async getSong(req: Request, res: Response) {
    try {
      const song = await musicService.getSongById(req.params.id);

      res.status(200).json({ success: true, data: song });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to retrieve song",
      });
    }
  }

  public async getSongsByArtist(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await musicService.getSongsByArtist(
        req.params.artistId,
        page,
        limit,
      );

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to retrieve songs",
      });
    }
  }
}

export default MusicController;
