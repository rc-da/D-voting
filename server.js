const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'client')));

app.get('/database', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'database', 'data.json');
    let jsonData = {};

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      jsonData = JSON.parse(data);
    }

    res.json(jsonData);
  } catch (error) {
    console.error("Error reading the data file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/database', (req, res) => {
    try {
      const newData = req.body;
  
      const filePath = path.join(__dirname, 'database', 'data.json');
      let jsonData = {};
  
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        jsonData = JSON.parse(data);
      }
  
      if (!jsonData.allgroup) {
        jsonData.allgroup = [];
      }
  
      jsonData.allgroup.push(newData);
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
  
      res.json(jsonData);
    } catch (error) {
      console.error("Error updating the data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
