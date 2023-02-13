import db from "../config/database.js";
import clienteSchema from "../schemas/clienteSchema.js";

const validData = (schema, data) => !schema.validate(data).error;

export async function listarClientes(req, res) {
    try {
        const clientes = await db.query('SELECT * FROM customers');
        return res.send(clientes.rows);
    } catch (err) {
        return res.sendStatus(500);;
    }
}

export async function buscarCLienteId(req, res) {
    const {id} = req.params;
    try {
        const cliente = await db.query('SELECT * FROM customers where "id" = $1', [id]);
        if (cliente.rows.length === 0) {
            return res.sendStatus(404);
        }
        return res.send(cliente.rows[0]);
    } catch (err) {
        return res.sendStatus(500);;
    }
}

export async function inserirCliente(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try{
        if(!validData(clienteSchema, req.body)) {
            return res.sendStatus(400);
        }
        const checkCliente = await db.query('SELECT * FROM customers where "cpf" = $1', [cpf] )
        if(checkCliente.rows.length != 0){
            return res.sendStatus(409);
        }
        await db.query('INSERT INTO customers ("name", "phone", "cpf", "birthday") VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        return res.sendStatus(201);
    }catch (err) {
        return res.sendStatus(500);;
    }
}

export async function atualizarCliente(req,res){
    const { name, phone, cpf, birthday } = req.body;
    const {id} = req.params;
    try{
        if(!validData(clienteSchema, req.body)) {
            return res.sendStatus(400);
        }
        const checkCpf = await db.query('SELECT id FROM customers WHERE "id" != $1 AND "cpf" = $2', [id, cpf]);
        if(checkCpf.rows.length != 0){
            return res.sendStatus(409);
        }
        await db.query('UPDATE customers SET "name" = $1, "phone" = $2, "cpf" = $3, "birthday" = $4 WHERE "id" = $5', [name, phone, cpf, birthday, id]);
        return res.sendStatus(200);
    }catch (err) {
        return res.sendStatus(500);
    }
}