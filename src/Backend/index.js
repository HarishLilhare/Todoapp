const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Harish@97',
  database: 'todo',
});

//Get all task...
app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM tasks";
  db.query(sqlGet, (error, result) => {
    res.send(result);
  });
});

//post a task...
app.post("/api/Post", (req, res) => {
  const { task  } = req.body;
  const sqlInsert = "INSERT INTO tasks (task) VALUES (?)";
  db.query(sqlInsert, [task], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Error adding task" });
    } else {
      res.send(result);
    }
  });
});

// Get a task by using id...
app.get("/api/get/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM tasks WHERE id=?";
  db.query(sqlGet, id, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Error getting task" });
    } else {
      res.send(result);
    }
  });
});


  
// Delete a Task by using id...
app.delete("/api/delete/:id", (req, res) => {
  const { id } = req.params;
  const sqlDelete = "DELETE FROM tasks WHERE id = ?";
  db.query(sqlDelete, id, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Error deleting task" });
    } else {
      res.send(result);
    }
  });
});



app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
