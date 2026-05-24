import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool();

const test = async () => {
    try {
        const res = await pool.query("SELECT current_database()");
        console.log("CONNECTED TO:", res.rows);
    } catch (err) {
        console.error("ERROR:", err.message);
    }
};

test();
