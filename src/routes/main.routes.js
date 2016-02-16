"use strict";
// Import node module
import express from 'express';
var pgp = require('pg-promise')();//necessary because it need options or it gets very angry

const router = express.Router();

// Arrow functions
router.get('/', (req, res) => {
	var db = pgp("postgres://postgres:123456@localhost:1234/test");
	db.manyOrNone("SELECT * from test")
    .then(function (data) {
        res.send(data[0])
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });

	// res.send({message: 'kebab!'});
});
// Exporting an object as the default import for this module
export default router;
