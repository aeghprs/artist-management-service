import { query, queryOne } from "../config/db";
import { IRegisterMusic, IUpdateMusic } from "../schemas/music.schema";
import { Music } from "../types/music.types";
import { AppError } from "../utils/errorHandler";

class MusicService {
  public async getSongById(songId: string): Promise<Music | null> {
    const songs = await queryOne<Music>(
      `SELECT s.id, s.artist_id, s.title, s.album_name, s.genre,
              s.created_at, s.updated_at, a.name as artist_name
       FROM songs s
       JOIN artists a ON s.artist_id = a.id
       WHERE s.id = $1`,
      [songId],
    );

    if (!songs) throw new AppError("Song not found", 404);

    return songs;
  }

  public async createSong(artistId: string, data: IRegisterMusic) {
    const artist = await queryOne<{ id: number }>(
      "SELECT id FROM artists WHERE id = $1 and is_active = $2",
      [artistId, true],
    );
    if (!artist) throw new AppError("Provided artist_id not found", 404);

    const result = await queryOne<{ id: number }>(
      `INSERT INTO songs (artist_id, title, album_name, genre)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [artistId, data.title, data.album_name, data.genre],
    );

    return this.getSongById(String(result?.id));
  }

  public async updateSong(
    songId: string,
    data: IUpdateMusic,
  ): Promise<Music | null> {
    const existing = await queryOne<{ id: number }>(
      "SELECT id FROM songs WHERE id = $1 and is_active = $2",
      [songId, true],
    );
    if (!existing) throw new AppError("Song not found for given id", 404);

    const updates: string[] = [];
    const values = [];
    let param = 1;

    if (data.title) {
      updates.push(`title = $${param++}`);
      values.push(data.title);
    }

    if (data.album_name) {
      updates.push(`album_name = $${param++}`);
      values.push(data.album_name ?? null);
    }

    if (data.genre) {
      updates.push(`genre = $${param++}`);
      values.push(data.genre);
    }

    if (updates.length === 0) {
      throw new AppError("No valid fields provided for update", 400);
    }

    values.push(songId);

    await query(
      `UPDATE songs SET ${updates.join(", ")} WHERE id = $${param}`,
      values,
    );

    return this.getSongById(songId);
  }

  public async deleteSong(songId: string): Promise<boolean> {
    const existing = await queryOne<{ id: number }>(
      "SELECT id FROM songs WHERE id = $1 and is_active = $2",
      [songId, true],
    );
    if (!existing) throw new AppError("Song not found for given id", 404);

    await query("DELETE FROM songs WHERE id = $1", [songId]);
    return true;
  }

  public async getSongsByArtist(artistId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const artist = await queryOne<{ id: number; name: string }>(
      "SELECT id, name FROM artists WHERE id = $1 and is_active = $2",
      [artistId, true],
    );
    if (!artist) throw new AppError("Artist not found for given id", 404);

    const countResult = await queryOne<{ total: string }>(
      "SELECT COUNT(*) as total FROM songs WHERE artist_id = $1 and is_active = $2",
      [artistId, true],
    );

    const total = parseInt(countResult?.total || "0");

    const songs = await query<Music>(
      `SELECT id, artist_id, title, album_name, genre, created_at, updated_at
       FROM songs
       WHERE artist_id = $1 and is_active = $4
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [artistId, limit, offset, true],
    );

    return {
      artist,
      songs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default MusicService;
