import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';

// __dirname workaround per moduli ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crea un server livereload che monitora la cartella "public"
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

// Forza il refresh del browser quando i file cambiano
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const app = express();

// Usa connect-livereload per iniettare lo script livereload nel file HTML
app.use(connectLivereload());

// Servi i file statici dalla cartella "public"
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
