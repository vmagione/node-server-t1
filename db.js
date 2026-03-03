import "dotenv/config";
import { postgres } from "postgres";



require("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

export default sql