import { PoolClient } from "pg";
import { pool, query } from "../config/db";
import { Artist } from "../types/artist.types";
import { AppError } from "../utils/errorHandler";

class ArtistBatchService {
  public async exportArtists(): Promise<Artist[]> {
    const result = await query<Artist>(`
        SELECT 
          name,
          TO_CHAR(dob, 'YYYY-MM-DD') as dob,
          gender,
          address,
          first_release_year,
          no_of_albums_released
        FROM artists
        ORDER BY id
      `);
    if (!result) throw new AppError("Artist not available for export", 404);
    return result;
  }

  async batchInsertArtists(validatedData: Artist[]): Promise<Artist[]> {
    const client: PoolClient = await pool.connect();
    const insertedArtists: Artist[] = [];

    try {
      await client.query("BEGIN");

      for (const data of validatedData) {
        const userCheckQuery = `
        SELECT u.id
        FROM users u
        WHERE u.id = $1
          AND u.role = 'artist'
          AND u.is_active = TRUE
          AND NOT EXISTS (
            SELECT 1
            FROM artists a
            WHERE a.user_id = u.id
             
          )
      `;

        const userCheckResult = await client.query<{ id: number }>(
          userCheckQuery,
          [data.user_id],
        );

        if (userCheckResult.rowCount === 0) {
          throw new Error(
            `User with id ${data.user_id} either does not exist, is not an artist, or is already assigned to another active artist.`,
          );
        }

        const query = `
          INSERT INTO artists (
            name, 
            dob, 
            gender, 
            address, 
            first_release_year, 
            no_of_albums_released,
            user_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;

        const values = [
          data.name,
          data.dob,
          data.gender,
          data.address,
          data.first_release_year,
          data.no_of_albums_released,
          data.user_id,
        ];

        const result = await client.query<Artist>(query, values);
        insertedArtists.push(result.rows[0]);
      }

      await client.query("COMMIT");
      return insertedArtists;
    } catch (error: any) {
      await client.query("ROLLBACK");
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Failed to insert artists: ${error.message || "Unknown error"}`,
        500,
      );
    } finally {
      client.release();
    }
  }
}

export default ArtistBatchService;
