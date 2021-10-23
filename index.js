const express = require('express');
const { taskRouter } = require('./routes/task');

const index = express();

index.use(express.json());
index.use(express.static('public'));
index.use('/todo', taskRouter);

index.listen(3000);
