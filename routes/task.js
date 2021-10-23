const express = require('express');
const { readFile, writeFile } = require('fs').promises;
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');


const taskRouter = express.Router();
taskRouter.use(express.json());
taskRouter.use(cors());

const FILE_NAME = './data/todoList.json';

// function to read from json file and Parse to object
async function readAndParse() {
  try {
    const data = await readFile(FILE_NAME, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
}

const options = {
  definition: {
    openapi : '3.0.0',
    info : {
      title: 'Node JS API Project for To Do application',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:3000',
      }
    ],
  },
  apis: ['./routes/task.js']
};

const swaggerSpec = swaggerJSDoc(options);
taskRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 *   components:
 *          schemas:
 *              Task:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: integer
 *                      title:
 *                          type: string
 */

taskRouter
    /**
     * @swagger
     * /todo/showAll:
     *   get:
     *       summary: To get all tasks from json file
     *       description: This API is used to fetch data from json file
     *       responses:
     *          200:
     *              description: This API is used to fetch data from json file
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items:
     *                              $ref: '#components/schemas/Task'
     */
  .get('/showAll', async (req, res) => {
    const parsedData = await readAndParse();

    res.send(parsedData);
  })
    /**
     * @swagger
     * /todo/addTask:
     *   post:
     *       summary: Used to insert data to json file
     *       description: This API is used to insert data
     *       requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#components/schemas/Task'
     *       responses:
     *          200:
     *              description: Added successfully
     */
  .post('/addTask', async (req, res) => {
    const parsedData = await readAndParse();
    parsedData.map((task, i) => {
      task.id = i + 1;
    })
    const index = parsedData.length + 1;
    const task = {
      title: req.body.title,
      isDone: false,
      id: index,
    };
    parsedData.push(task);
    await writeFile(FILE_NAME, JSON.stringify(parsedData));

    res.send(task);
  })
    /**
     * @swagger
     * /todo/tasks/{id}:
     *   put:
     *       summary: Used to update data to json file
     *       description: This API is used to update data
     *       parameters:
     *              - in: path
     *                name: id
     *                required: true
     *                description: Numeric ID required
     *                schema:
     *                    type: integer
     *       requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#components/schemas/Task'
     *       responses:
     *          200:
     *              description: Updated successfully
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items:
     *                              $ref: '#components/schemas/Task'
     */
  .put('/tasks/:id', async (req, res) => {
    const data = await readFile(FILE_NAME, 'utf8');
    const parsedData = JSON.parse(data);
    const task = parsedData.find((t) => t.id === Number(req.params.id));
    if (!task) res.status(404).send('Task not found');

    task.title = req.body.title;
    await writeFile(FILE_NAME, JSON.stringify(parsedData));

    res.send(task);
  })
    /**
     * @swagger
     * /todo/tasks/{id}:
     *   put:
     *       summary: Used to update data to json file
     *       description: This API is used to update data
     *       parameters:
     *              - in: path
     *                name: id
     *                required: true
     *                description: Numeric ID required
     *                schema:
     *                    type: integer
     *       requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#components/schemas/Task'
     *       responses:
     *          200:
     *              description: Updated successfully
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items:
     *                              $ref: '#components/schemas/Task'
     */
  .put('/tasks/isDone/:id', async (req, res) => {
    const parsedData = await readAndParse();
    parsedData.map((task, i) => {
      task.id = i + 1;
    })
    const task = parsedData.find((t) => t.id === Number(req.params.id));
    if (!task) res.status(404).send('Task not found');

    task.isDone = !task.isDone;
    await writeFile(FILE_NAME, JSON.stringify(parsedData));

    res.send(task);
  })
    /**
     * @swagger
     * /todo/tasks/{id}:
     *   delete:
     *       summary: Used to delete record from json file
     *       description: Delete record from json file
     *       parameters:
     *              - in: path
     *                name: id
     *                required: true
     *                description: Numeric ID required
     *                schema:
     *                    type: integer
     *       responses:
     *          200:
     *              description: Data is deleted
     */
  .delete('/tasks/:id', async (req, res) => {
    const parsedData = await readAndParse();
    const task = parsedData.find((t) => t.id === Number(req.params.id));
    if (!task) res.status(404).send('Task not found');

    const index = parsedData.indexOf(task);
    parsedData.splice(index, 1);
    await writeFile(FILE_NAME, JSON.stringify(parsedData));

    res.send(task);
  });

module.exports = {
  taskRouter,
};
