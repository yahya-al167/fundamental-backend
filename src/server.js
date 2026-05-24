import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import errorHandler from "./middleware/errorHandler.js";

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
