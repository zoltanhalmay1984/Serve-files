import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
const dataRoute = './users.json';

const __filename = fileURLToPath(import.meta.url); //ez csak ahhoz kell, hogy létre tudjam hozni a __dirname -t
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/pub', express.static(path.join(__dirname, 'client', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/users', async (req, res) => {
    const data = await fs.readFile('./users.json', 'utf8');
    const users = JSON.parse(data).users;
    return res.send(users);
});

app.get('/users/:userId', async (req, res) => {
    const data = await fs.readFile('./users.json', 'utf8');
    const { users /*, age, id */ } = JSON.parse(data); // a JSON.parse(data) users key value-ját menti ki users változóba (data destructuring)
    const userId = parseInt(req.params.userId);
    const user = users.find(user => user.id === userId);
    if (user) {
        return res.send(user);
    } else {
        return res.status(404).send({ state: 'User not found' });
    }
});

app.patch('/users/:userId', async (req, res) => {
    const data = await fs.readFile(dataRoute, 'utf8');
    const { users /*, age, id */ } = JSON.parse(data); // a JSON.parse(data) users key value-ját menti ki users változóba (data destructuring)
    const userId = parseInt(req.params.userId);
    const user = users.find(user => user.id === userId);
    if (user) {
        user.name = req.body.name;
        await fs.writeFile(dataRoute, JSON.stringify({ users }), 'utf8');
        return res.send({ state: "DONE" });
    } else {
        return res.status(404).send({ state: 'User not found' });
    }
});

app.listen(3000, () => {
    console.log(`guild navigators are channeling http://127.0.0.1:3000 to your browser`);
});