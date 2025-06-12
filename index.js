require("dotenv").config();
// NE PAS OUBLIER (pas comme moi) d'utiliser cors :
const cors = require("cors");
const express = require("express");
const axios = require("axios");
const app = express();
// permet de contacter le back depuis le front :
app.use(cors());

// console.log(process.env.MARVEL_API_KEY); // OK
// etapes à suivre pour le déploiement :
// 1 : créer le repo GitHub
// 2 : créer le fichier .env (ne pas oublier l'import => cf. documentation sur npm)
// 3 : mettre dans le .env toutes les données sensibles
// 4 : remplacer toutes les apparitions des données sensibles par "process.env.LA_CLEF_MISE_DANS_LE_.ENV"
// 5 : créer le fichier .gitignore
// 6 : NE PAS OUBLIER d'ajouter .env et node_modules dans le fichier .gitignore
// 7 : ajouter le script "start" dans package.json pour démarrer le serveur sur NorthFlank
// 8 : remplacer le PORT du server
// 9 : accomplir la procédure github pour envoyer le code sur la plateforme GitHub !
// 10 : ligne ajoutée pour que notre ami NorthFlank (AVEUGLE_MAN) détecte bien le changement dans le projet !!

// permet de lire les paramètres body :
app.use(express.json());

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur le serveur marvel ! 🦸‍♂️");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// route récupérant la liste de tous les personnages
app.get("/characters", async (req, res) => {
  try {
    // commencer par vérifier que je recois tous les paramètres qui vont être utiles à cette route :
    // le paramètre name pour le recherche
    // les paramètres skip et limit, pour la pagination :
    console.log(req.query); // { name: 'spider', limit: '40', skip: '0' }
    let name = "";
    if (req.query.name) {
      name = req.query.name;
    }

    let limit = 100; // on met une valeur par défaut
    if (req.query.limit) {
      // si une query limit est reçue,
      // alors on change cette valeur
      limit = req.query.limit;
    }

    // récupérer les paramètres query pour les inclure à la requete axios :
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}&name=${name}&limit=${limit}&skip=${req.query.skip}`
    );
    // console.log(response.data);
    // envoyer la réponse de l'API (récupérée grâce à axios), au front :
    return res.status(200).json(response.data);
  } catch (error) {
    // si l'erreur est "rapportée" par axios, alors il y aura une clef response dans l'objet error
    if (error.response) {
      return res.status(500).json({ message: error.response.data });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
});

// route permettant de récupérer tous les comics liés à un personnage
app.get("/comics/:characterId", async (req, res) => {
  try {
    // vérification des paramètres recus :
    console.log(req.params); // { characterId: '5fcf9499d8a2480017b918fb' }
    // envoyer la requête à l'API via axios :
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    // console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(500).json({ message: error.response.data });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
});

// route récupérant la liste de tous les comics
app.get("/comics", async (req, res) => {
  try {
    // commencer par vérifier que je recois tous les paramètres qui vont être utiles à cette route :
    // le paramètre name pour le recherche
    // les paramètres skip et limit, pour la pagination :
    console.log(req.query); // { title: 'spider', limit: '40', skip: '0' }
    let title = "";
    if (req.query.title) {
      title = req.query.title;
    }

    let limit = 100; // on met une valeur par défaut
    if (req.query.limit) {
      // si une query limit est reçue,
      // alors on change cette valeur
      limit = req.query.limit;
    }

    // console.log("title =>", title);
    // récupérer les paramètres query pour les inclure à la requete axios :
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}&title=${title}&limit=${limit}&skip=${req.query.skip}`
    );
    // console.log(response.data);
    // envoyer la réponse de l'API (récupérée grâce à axios), au front :
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(500).json({ message: error.response.data });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
});

// BONUS : route permettant de récupérer les détails d'un comic en particulier

app.all(/.*/, (req, res) => {
  res.status(404).json("Not found");
});

const PORT = process.env.PORT || 3000;

// on oublie pas le app.listen pour démarrer le serveur :
app.listen(PORT, () => {
  console.log("Serveur started on port " + PORT + " 🔥");
});
