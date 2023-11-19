const express = require("express");
const app = express();
const fs = require('fs').promises;
const path = require('path');


app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));


const dataFilePath = path.join(__dirname, 'database', 'data.json');

app.get('/database', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (error) {
    console.error( error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/build/contracts', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'build/contracts', 'voteContract.json'), 'utf8');
    const abiData = JSON.parse(data);
    res.json(abiData);
  } catch (error) {
    console.error( error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/database', async (req, res) => {
  try {
    const { jsonContent, textContent } = req.body;

    let jsonData = {};
    try {
      const data = await fs.readFile(dataFilePath, 'utf8');
      jsonData = JSON.parse(data);
    } catch (readError) {
      console.log("File not found ")
    }

    if (!jsonData.allgroup) {
      jsonData.allgroup = {};
    }
    console.log(textContent, jsonContent)
    jsonData.allgroup[textContent] = jsonContent;

    try {
      await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
      res.json(jsonData);
    } catch (writeError) {
      console.error("Error writing to the data file:", writeError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error handling POST request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});