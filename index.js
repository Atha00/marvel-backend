require("dotenv").config();
const express = require("express"); // import du package express
const app = express(); // création du serveur
const axios = require("axios");
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur le serveur Marvel");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/characters", async (req, res) => {
  try {
    let limit = 100;

    // le serveur peut recevoir les query skip, limit et name du front
    console.log("query =>", req.query); // { name: 'spider' }

    // mise en place des query "skip", "limit" et "name"
    let filters = "";
    if (req.query.name) {
      filters += `&name=${req.query.name}`;
    }
    if (req.query.limit) {
      limit = req.query.limit;
    }
    if (req.query.page) {
      filters += `&skip=${(req.query.page - 1) * limit}`;
    }
    // appel à l'api avec le paramètre query apiKey : grâce au client axios
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}${filters}&limit=${limit}`
    );
    // console.log(Object.keys(response.data)); // [ 'count', 'limit', 'results' ]

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comics", async (req, res) => {
  try {
    let limit = 100;

    // le serveur peut recevoir les query skip, limit et name du front
    console.log("query =>", req.query); // { title: 'spider' }

    // mise en place des query "skip", "limit" et "name"
    let filters = "";
    if (req.query.title) {
      filters += `&title=${req.query.title}`;
    }
    if (req.query.limit) {
      limit = req.query.limit;
    }
    if (req.query.page) {
      filters += `&skip=${(req.query.page - 1) * limit}`;
    }
    // appel à l'api avec le paramètre query apiKey : grâce au client axios
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}${filters}&limit=${limit}`
    );
    // console.log(Object.keys(response.data)); // [ 'count', 'limit', 'results' ]

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comics/:characterId", async (req, res) => {
  try {
    console.log(req.params);
    const response = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/comics/" +
        req.params.characterId +
        "?apiKey=" +
        process.env.API_KEY
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  // Mon serveur va écouter le port 3000
  console.log("Server has started 🦸‍♂️"); // Quand je vais lancer ce serveur, la callback va être appelée
});
