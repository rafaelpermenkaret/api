const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;
app.enable("trust proxy");
app.set("json spaces", 2);


// Log Info
const messages = {
  error: {
    status: 404,
    creator: "Rafael",
    result: "Error, Service Unavailable",
  },
  notRes: {
    status: 404,
    creator: "Rafael",
    result: "Error, Invalid JSON Result",
  },
  query: {
    status: 400,
    creator: "Rafael",
    result: "Please input parameter query!",
  },
  url: {
    status: 400,
    creator: "Rafael",
    result: "Please input parameter URL!",
  },
  notUrl: {
    status: 404,
    creator: "Rafael",
    result: "Error, Invalid URL",
  },
};

// Middleware untuk CORS
app.use(cors());



// Endpoint untuk servis dokumen HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/api/tiktok", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json(messages.url);

  try {
  const { tiktokdl } = require("tiktokdl")
    const data = await tiktokdl(url);
    if (!data) return res.status(404).json(messages.notRes);
    res.json({ status: true, creator: "Rafael", result: data });
  } catch (e) {
    res.status(500).json(messages.error);
  }
});


// Handle 404 error
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Handle error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app
