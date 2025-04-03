const express = require('express');
const bodyParser = require('body-parser');
const villagerRouter = require('./src/routes/villager/villagerRoutes');  // Adjust the path if needed

// Environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(bodyParser.json()); // For parsing JSON request bodies

// Use the villager routes
app.use("/api/admin/villager", require("./src/routes/villager/villagerRoutes"));
app.use('/api/villager', villagerRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
