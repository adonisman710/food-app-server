import app from "./app";
import mongoose from "mongoose";

// Connected With MongoDb
const url = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
// Database Connection
mongoose.connect(`${url}`).then(() => console.log(`Db Connected`));
// Server Listing
app.listen(port, () => console.log(`Server Listing Port ${port}`));