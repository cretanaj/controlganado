require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

const getDbUser = () => {
    const dbHost = process.env.DB_HOST || 'test1server.mysql.database.azure.com';
    const dbServerName = dbHost.split('.')[0];
    const dbUserBase = process.env.DB_USER || 'mysqldb';
    const shouldAppendAzureServer = process.env.DB_USER_APPEND_SERVER === 'true';

    if (shouldAppendAzureServer && dbHost.includes('.mysql.database.azure.com') && !dbUserBase.includes('@')) {
        return `${dbUserBase}@${dbServerName}`;
    }

    return dbUserBase;
};

const buildDbConfig = () => {
    const config = {
        host: process.env.DB_HOST || 'test1server.mysql.database.azure.com',
        user: getDbUser(),
        password: process.env.DB_PASSWORD || '',
        port: Number(process.env.DB_PORT || 3306),
        database: process.env.DB_NAME || 'ganadodb'
    };

    if (process.env.DB_SSL === 'true') {
        config.ssl = {
            rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
        };

        if (process.env.DB_SSL_CA_PATH) {
            config.ssl.ca = fs.readFileSync(process.env.DB_SSL_CA_PATH, 'utf8');
        }
    }

    return config;
};

const main = async () => {
    const dbConfig = buildDbConfig();

    console.log('DB check config:', {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        database: dbConfig.database,
        ssl: Boolean(dbConfig.ssl)
    });

    const conn = await mysql.createConnection(dbConfig);

    const [[ping]] = await conn.query('SELECT 1 AS ok');
    const [[animalCount]] = await conn.query('SELECT COUNT(*) AS total FROM animal');
    const [[viewCount]] = await conn.query('SELECT COUNT(*) AS total FROM _vw_ganado');

    console.log('Ping:', ping.ok);
    console.log('Rows animal:', animalCount.total);
    console.log('Rows _vw_ganado:', viewCount.total);

    if (Number(animalCount.total) > 0 && Number(viewCount.total) === 0) {
        console.log('Warning: animal has rows but _vw_ganado is empty. Verify the view definition.');
    }

    await conn.end();
};

main().catch((error) => {
    console.error('DB check failed:', error.message);
    process.exit(1);
});
