import app from "./app.js";
import { connectDb } from "./config/db.js"

const PORT = process.env.PORT || 3000;


const startServer = async () => {
    try {
        await connectDb();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.log("Server start failed", error);
        process.exit(1);
    }
}


startServer();