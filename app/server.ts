const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(server);

    // Configurer les sockets ici
    io.on("connection", (socket) => {
        console.log("Un client s'est connecté :", socket.id);

        socket.on("disconnect", () => {
            console.log("Un client s'est déconnecté :", socket.id);
        });
    });

    server.listen(3000, () => {
        console.log("> Serveur prêt sur http://localhost:3000");
    });
});
