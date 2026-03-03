import { randomUUID } from "node:crypto";

export class DatabasePostgres{

    #videos = new Map();

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

    create(video) {

        const videoId = randomUUID()

        this.#videos.set(videoId, video);
    }

    update(id, video) {
        this.#videos.set(id, video);
    }

    delete(id) {
        this.#videos.delete(id);
    }


}