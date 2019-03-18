// same as: import express from 'express'
const express = require('express');

const server = express();

const db = require('./data/db.js');
// Or you can destructure...
// const { hubs } = require('.data/db.js');

server.use(express.json()); // *** add this to make POST and PUT work ***

server.get('/', (req, res) => {
    res.send('Hello WEBXVII');
})

server.get('/now', (req, res) => {
    res.send(`Current Time: ${Date.now()}`, )
})

// The 'R' in CRUD:
server.get('/hubs', (req, res) => {
    db.hubs.find()
        .then(hubs => {
            // 200-299 === success
            // 300-399 === redirect
            // 400-499 === client error
            // 500-599 === server error
            res.status(200).json(hubs);
        })
        .catch(err => {
            // Handle it
            res.status(500).json({ message: 'error retrieving hubs'})
        })
})

// The 'C' in CRUD:
server.post('/hubs', (req, res) => {
    // read the data for the hub
    const hubInfo = req.body;

    // add the hub to our db
    db.hubs
    .add(hubInfo)
    .then(hub => {
        res.status(201).json(hub);
    })
    .catch(err => {
        // Handle it
        res.status(500).json({ message: 'error creating the hub'})
    })
})

server.delete('/hubs/:id', (req, res) => {
    const id = req.params.id;

    db.hubs.remove(id)
        .then(deleted => {
            res.status(204).end(); // --> tells the client the request is done
        })
        .catch(err => {
            res.status(500).json({ message: 'error deleting the hub' });
        })
})

server.put('/hubs/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db.hubs.update(id, changes)
        .then(updated => {
            if (updated) {
                res.status(200).json(updated)
            } else {
                res.status(404).json({ message: 'hub not found' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'error updating the hub' })
        })
})

server.listen(4000, () => {
    console.log(`** API up and running on port 4000 **`);
})