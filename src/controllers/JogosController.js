import db from "../config/database.js";
import jogoSchema from "../schemas/jogoSchema.js";

const validData = (schema, data) => !schema.validate(data).error;

export async function listarJogos(req, res) {
    try {
        const jogos = await db.query('SELECT * FROM games');
        return res.send(jogos.rows)
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function inserirJogo(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
    try {
        if (!validData(jogoSchema, req.body)) {
            return res.sendStatus(400);
        }
        const checkGame = await db.query('SELECT * FROM games where "name" = $1',[name]);
        if(checkGame.rows.length != 0){
            return res.sendStatus(409);
        }
        await db.query('INSERT INTO games ("name", "image", "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)', [name, image, stockTotal, pricePerDay]);
        return res.sendStatus(201);
    } catch (err) {
        return res.sendStatus(500);
    }
}
