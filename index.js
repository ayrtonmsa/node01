const express = require('express');

const server = express();

server.use(express.json())

const users = ['Gabriel', 'João', 'Omara'];

server.use((req, res, next) => {
  console.log('Iniciou');
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd('Request');
  console.log('Finalizou');
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({error: 'User name is required.'});
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({error: 'User does not exists.'});
  }

  req.user = user;

  return next();
}

// server.get('/users/:id', (req, res) => {
//   const nome = req.query.nome;
//   const { id } = req.params;
//
//  return res.json({
//    message: `Hello ${nome}!`,
//    user: id
//  });
// });

// CRUD - create, read, update, delete

server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
  const {name} = req.body;
  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const {index} = req.params;
  const {name} = req.body;
  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const {index} = req.params;
  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
