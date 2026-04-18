const {Client} = require('pg');
require('dotenv').config();

async function getClient() {
    const client = new Client({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        user: process.env.PG_USER,
        password: process.env.PG_PASS,
        database: process.env.PG_DB,
        ssl: !!process.env.DATABASE_URL,
    });

    await client.connect();

    client.on('error', (err) => {
        console.error('something bad has happened!', err.stack);
    });

    // walk over to server, unplug network cable
    // process output: 'something bad has happened!' followed by stacktrace :P

    return client;
}

module.exports = {
    getClient
}
