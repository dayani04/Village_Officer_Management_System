const express = require("express");
const dotenv = require("dotenv");
const villagerRoutes = require("./src/routes/villager/villagerRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/villagers", villagerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});