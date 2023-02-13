import dayjs from 'dayjs';
import db from '../config/database.js';
import aluguelSchema from '../schemas/aluguelSchema.js';

const validData = (schema, data) => !schema.validate(data).error;

export async function listarAlugueis(req, res) {
    try {
        const alugueis = await db.query(`
        SELECT rentals.*,
          JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer,
          JSON_BUILD_OBJECT('id', games.id, 'name', games.name) AS game
        FROM rentals 
        JOIN customers ON rentals."customerId" = customers."id"
        JOIN games ON rentals."gameId" = games."id"
      `);
        return res.send(alugueis.rows);
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function inserirAluguel(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    try {
        if (!validData(aluguelSchema, req.body)) {
            return res.sendStatus(400);
        }

        let cliente = await db.query('SELECT * FROM customers WHERE "id" = $1', [customerId]);
        cliente = cliente.rows[0];
        if (!cliente) {
            return res.sendStatus(409);
        }


        let jogo = await db.query('SELECT * FROM games WHERE "id" = $1', [gameId]);
        jogo = jogo.rows[0];
        if (!jogo) {
            return res.sendStatus(409);
        }
        const jogosAlugados = await db.query('SELECT count(id) as quantity FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL', [jogo.id]);

        if (jogo.stockTotal <= jogosAlugados.rows[0].quantity) {
            return res.sendStatus(400);
        }
        const preco = daysRented * jogo.pricePerDay;

        await db.query(
            'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, null, $5, null)',
            [customerId, gameId, dayjs().format(), daysRented, preco],
        );

        return res.sendStatus(201);
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function finalizarAluguel(req, res) {
    const { id } = req.params;

    try {
        let aluguel = await db.query('SELECT * FROM rentals WHERE "id" = $1', [id]);
        aluguel = aluguel.rows[0];

        if (aluguel.returnDate) {
            return res.sendStatus(400);
        }

  

        const dataRetorno = dayjs().format();
        const dataExpiracao = dayjs(aluguel.rentDate).add(aluguel.daysRented, 'day');
        const diasMulta = dayjs().diff(dataExpiracao, 'day');
        let multa;


        if (diasMulta > 0) {
            multa = diasMulta * (aluguel.originalPrice / aluguel.daysRented);
        }

        await db.query('UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE "id" = $3', [dataRetorno, multa, id]);

        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).send(err);
    }
}


export async function apagarAluguel(req, res) {
    const { id } = req.params;

    try {
        let aluguel = await db.query('SELECT * FROM rentals WHERE "id" = $1', [id]);
        aluguel = aluguel.rows[0];

        if (!aluguel.returnDate) {
            return res.sendStatus(400);
        }

        if (!aluguel) {
            return res.sendStatus(404);
        }

        await db.query('DELETE FROM rentals WHERE "id" = $1', [id]);
        return res.sendStatus(200);
    } catch (err) {
        return res.sendStatus(500);
    }
}

