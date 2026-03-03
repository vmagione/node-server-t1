import { randomUUID } from "node:crypto";
import sql from "./db.js";

export class DatabasePostgres{

    async list(search){
        if (search) {
            const videos = await sql`
                SELECT id, title, description, duration
                FROM videos
                WHERE title ILIKE ${`%${search}%`}
                ORDER BY title
            `;
            return videos;
        } else {
            const videos = await sql`
                SELECT id, title, description, duration
                FROM videos
                ORDER BY title
            `;
            return videos;
        }
    }

    async create(video) {

        const videoId = randomUUID();

        await sql`
            INSERT INTO videos (id, title, description, duration)
            VALUES (${videoId}, ${video.title}, ${video.description}, ${video.duration})
        `;

        return videoId;
    }

    async update(id, video) {
        await sql`
            UPDATE videos
            SET title = ${video.title},
                description = ${video.description},
                duration = ${video.duration}
            WHERE id = ${id}
        `;
    }

    async delete(id) {
        await sql`
            DELETE FROM videos
            WHERE id = ${id}
        `;
    }


}
