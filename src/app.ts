import express from "express";
import userRoutes from "./routes/user.routes";
import establishmentRoutes from "./routes/establishment.routes";

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/establishments", establishmentRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

export default app;
