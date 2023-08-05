require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur le back Marvel !");
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// faire la liste des personnages + filtres
// https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=YOUR_API_KEY
app.get("/characters", async (req, res) => {
  try {
    // console.log(req.query); // { page: '2', name: 'spider' }

    let filters = "";
    if (req.query.name) {
      filters += `&name=${req.query.name}`;
    }
    if (req.query.page) {
      const skip = (req.query.page - 1) * 100;
      filters += `&skip=${skip}`;
    }
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}${filters}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// faire une requete avec id personnages pour recup comics
// https://lereacteur-marvel-api.herokuapp.com/comics/5fc8ba1fdc33470f788f88b3?apiKey=YOUR_API_KEY
app.get("/comics/:characterId", async (req, res) => {
  try {
    // console.log(req.params.characterId); // 5fcf9519d8a2480017b919cd
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// recup tous les comics + filtres
// https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=YOUR_API_KEY
app.get("/comics", async (req, res) => {
  try {
    let filters = "";
    if (req.query.title) {
      filters += `&title=${req.query.title}`;
    }
    if (req.query.page) {
      const skip = (req.query.page - 1) * 100;
      filters += `&skip=${skip}`;
    }
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}${filters}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(404).json({ message: "Cette route n'existe pas... 🥲" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Serveur marvel started on port " + PORT + " 🚀");
});
