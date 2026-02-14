import { query, queryOne } from "../config/db";
import { IRegisterArtist, IUpdateArtist } from "../schemas/artist.schema";
import { Artist, IBatchArtist } from "../types/artist.types";
import { PaginatedResponse } from "../types/pagination.types";
import { normalizeDate } from "../utils/formatDate";

class ArtistService {
  public async registerArtist(
    artistData: IRegisterArtist,
  ): Promise<IRegisterArtist & { id: number }> {
    const formattedDateOfBirth = normalizeDate(artistData.dob, "date");

    const sql = `
      INSERT INTO artists 
      (name, dob, gender, address, first_release_year, no_of_albums_released)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const result = await queryOne<{ id: number }>(sql, [
      artistData.name,
      formattedDateOfBirth,
      artistData.gender ?? "o",
      artistData.address,
      artistData.first_release_year,
      artistData.no_of_albums_released,
    ]);

    return {
      id: result!.id,
      ...artistData,
    };
  }

  public async getAllArtists(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Artist>> {
    const offset = (page - 1) * limit;

    const countResult = await queryOne<{ total: string }>(
      "SELECT COUNT(*) as total FROM artists WHERE is_active = $1",
      [true],
    );

    const total = Number(countResult?.total ?? 0);

    const artists = await query<Artist>(
      `
      SELECT id, name, dob, gender, address,
             first_release_year, no_of_albums_released
      FROM artists
      WHERE is_active = $3
      ORDER BY id DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset, true],
    );

    return {
      data: artists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getArtistById(id: string): Promise<Artist | null> {
    return queryOne<Artist>(
      `SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at
       FROM artists WHERE id = $1 AND is_active = $2`,
      [id, true],
    );
  }

  public async updateArtist(
    id: string,
    data: IUpdateArtist,
  ): Promise<Artist | null> {
    const existingArtist = await queryOne<Artist>(
      "SELECT id FROM artists WHERE id = $1 AND is_active = $2",
      [id, true],
    );
    if (!existingArtist) return null;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.dob !== undefined) {
      updates.push(`dob = $${paramCount++}`);
      values.push(data.dob || null);
    }
    if (data.gender) {
      updates.push(`gender = $${paramCount++}`);
      values.push(data.gender);
    }
    if (data.address !== undefined) {
      updates.push(`address = $${paramCount++}`);
      values.push(data.address || null);
    }
    if (data.first_release_year !== undefined) {
      updates.push(`first_release_year = $${paramCount++}`);
      values.push(data.first_release_year || null);
    }
    if (data.no_of_albums_released !== undefined) {
      updates.push(`no_of_albums_released = $${paramCount++}`);
      values.push(data.no_of_albums_released);
    }

    if (updates.length === 0) return existingArtist;

    values.push(id);
    await query(
      `UPDATE artists SET ${updates.join(", ")} WHERE id = $${paramCount}`,
      values,
    );

    return this.getArtistById(id);
  }

  public async deleteArtist(id: string): Promise<boolean> {
    const existingArtist = await queryOne<Artist>(
      "SELECT id FROM artists WHERE id = $1 AND is_active = $2",
      [id, true],
    );
    if (!existingArtist) return false;

    await query("UPDATE artists SET is_active = $1 WHERE id = $2", [false, id]);
    return true;
  }
}

export default ArtistService;
