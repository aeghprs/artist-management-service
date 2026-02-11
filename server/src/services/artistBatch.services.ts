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
        const query = `
          INSERT INTO artists (
            name, 
            dob, 
            gender, 
            address, 
            first_release_year, 
            no_of_albums_released
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;

        const values = [
          data.name,
          data.dob,
          data.gender,
          data.address,
          data.first_release_year,
          data.no_of_albums_released,
        ];

        const result = await client.query<Artist>(query, values);
        insertedArtists.push(result.rows[0]);
      }

      await client.query("COMMIT");
      return insertedArtists;
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(
        `Failed to insert artists: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      client.release();
    }
  }
}

export default ArtistBatchService;
