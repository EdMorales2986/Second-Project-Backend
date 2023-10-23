import app from "./app";
import "./database";

// Start
app.listen(app.get("port"));
console.log(`http://localhost:${app.get("port")}`);
