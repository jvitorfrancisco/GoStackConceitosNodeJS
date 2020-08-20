const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { url, title, techs } = request.body;

    const repository = {
      id: uuid(),
      url,
      title,
      techs,
      likes: 0
    }

    repositories.push(repository);

    return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const { url, title, techs } = request.body;

  const index = repositories.findIndex(r => r.id === id);

  if(index < 0)
      return response.status(400).json({message: 'Id not found'});

  const repository = { 
    id, 
    title, 
    url, 
    techs, 
    likes: repositories[index].likes
  }

  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(r => r.id === id);

  if(index < 0)
    return response.status(400).json({ message: 'Repository not found' });

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(r => r.id === id);

  if(index < 0)
    return response.status(400).json({ message: 'Repository not found'});

  repositories[index].likes++;

  return response.status(201).json(repositories[index]);
});

module.exports = app;
