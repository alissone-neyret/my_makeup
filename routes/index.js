/* eslint-disable */
import express from 'express';
import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database : 'my_makeup'
});

connection.connect(err => {
  if(err){
    console.log('Error : ', err);
  } else {
    console.log('Connecté');
  }
});

const router = express.Router();

/* GET- Récupération de toutes les données de la table */

router.get('/', (request, response) => {
  connection.query('SELECT * FROM articles', (err, results) => {
      if (err) {
          response.status(500).send('Erreur lors de la récupération des articles');
      } else {
          response.json(results);
      }
  })
});

/* GET - Récupération de quelques champs spécifiques */

router.get('/nom', (request, response) => {
  connection.query('SELECT nom FROM articles', (err, results) => {
      if (err) {
          response.status(500).send(`Erreur lors de la récupération de l'article`);
      } else {
          response.json(results);
      }
  })
});

router.get('/image', (request, response) => {
  connection.query('SELECT image FROM articles', (err, results) => {
    if (err) {
      response.status(500).send(`Erreur lors de la récupération de l'article`) ;
    } else {
      response.json(results);
    }
  })
});

/* GET - Récupération de données en fonction de filtres (un filtre "contient", un filtre "commence par", un filtre "supérieur à") - une route par filtre */

/* GET - filtre "contient" */

router.get('/:nom', (request, response) => {
  connection.query(`SELECT * FROM articles WHERE 
  nom='${request.params.nom}' `, (err, results) => {
    if (err) {
      response.status(500).send(`Erreur lors de la récupération de l'article`)
    } else {
      response.json(results);
    }
  })
});

/* GET - filtre "commence par" */

router.get('/:marque', (request, response) => {
  connection.query(`SELECT * FROM articles WHERE 
  marque LIKE '${request.params.marque}%' `, (err, results) => {
    if (err) {
      response.status(500).send(`Erreur lors de la récupération de l'article`)
    } else {
      response.json(results);
    }
  })
});


/* GET - filtre "supérieur à" */

router.get('/quant', (request, response) => {
  connection.query(`SELECT * FROM articles WHERE quant>200`, (err, results) => {
    if (err) {
      console.log(err)
      response.status(500).send(`Erreur lors de la récupération de l'article`)
    } else {
      response.json(results);
    }
  })
});

/* GET - récupération de données ordonnées */

router.get('/ord', (request, response) => {
  connection.query(`SELECT * FROM articles ORDER BY date DESC`, (err, results) => {
    if (err) {
      response.status(500).send(`Erreur lors de la récupération de l'article`)
    } else {
      response.json(results);
    }
  })
});

/* POST - sauvegarde d'une nouvelle entité */

router.post('/articles', (request, response) => {
  const formData = request.body;
  connection.query(`INSERT INTO articles SET ?`, formData, (err, results) => {
    if (err) {
      response.status(500).send(`Erreur lors l'ajout`)
    } else {
      response.sendStatus(200);
    }
  })
});

/* PUT - modifier une entité */

router.put('/articles/:id', (request, response) => {
  const idArticle = request.params.id;
  const formData = request.body;
  connection.query(`UPDATE articles SET ? WHERE id=?`, [formData, idArticle], (err, response) => {
    if (err) {
      response.status(500).send(`Erreur lors la modification d'un article`)
    } else {
      response.sendStatus(200);
    }
  })
});

/* PUT - toggle du booléen */

router.put('/vegan/:id', (request, response) => {
  const idArticle = request.params.id;
  const formData = request.body;
  connection.query(`UPDATE articles SET vegan= ? WHERE id = ?`, [idArticle, formData], (err, response) => {
    if (err) {
      response.status(500).send(`Erreur lors la modification du booléen`)
    } else {
      response.sendStatus(200);
    }
  })
});

/* DELETE - suppression d'une entité */

router.delete(`/delete/:id`, (request, response) => {
  const idArticle = request.params.id;
  connection.query(`DELETE from articles WHERE id = ?`, idArticle, err => {
    if (err) {
      response.status(500).send(`Erreur lors la suppression d'un article`)
    } else {
      response.sendStatus(200);
    }
  })
});

/* DELETE - suppression de toutes les entités dont le booléen en false */

router.delete(`/delete/novegan`, (request, response) => {
  connection.query(`DELETE * from articles WHERE vegan=0`, (err, response) => {
    if (err) {
      response.status(500).send(`Erreur lors de la suppression de l'article`)
    } else {
      response.sendStatus(200).send('Article non vegan supprimé!')
    }
  })
});

export default router;
