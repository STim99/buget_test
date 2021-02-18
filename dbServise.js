import mysql from 'mysql2';

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'example',
    database: 'buget',
    typeCast: function castField(field, useDefaultTypeCasting) {
        if ((field.type === "BIT") && (field.length === 1)) {
            var bytes = field.buffer();
            return (bytes[0] === 1);
        }
        return (useDefaultTypeCasting());
    }
})

db.ping((err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('DB is connect')
    initDB()
})

function initDB() {
    db.query('CREATE TABLE IF NOT EXISTS account( id int AUTO_INCREMENT, name varchar(255) NOT NULL, value integer NOT NULL, block bit NOT NULL DEFAULT 0, PRIMARY KEY (id))', (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('Table Account is created');
    });
    db.query('CREATE TABLE IF NOT EXISTS transactions ( id int AUTO_INCREMENT, account_id int NOT NULL, value integer NOT NULL, date datetime NOT NULL, PRIMARY KEY (id), FOREIGN KEY (account_id) REFERENCES account (id) );', (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('Table transactions is created');
    });
}


class DbService {
    async getAllAccount() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM account;";

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async addAccount(name, value) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                let account = { name: name, value: value };
                const query = `INSERT INTO account SET ?`;

                db.query(query, account, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id: insertId,
                name: name,
                value: value
            };
        } catch (error) {
            console.log(error);
        }
    }

    async getAccountFromId(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM account WHERE id = ${id}`;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results[0]);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllTransactionFromId(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM transactions WHERE account_id = ${id}`;

                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async addTransaction(account_id, value) {
        try {
            await new Promise((resolve, reject) => {
                const transaction = {
                    account_id: account_id,
                    value: value,
                    date: new Date
                }
                this.getAccountFromId(account_id)
                    .then(account => {
                        let newBalance = account.value + parseInt(value, 10)
                        if (!account.block && newBalance >= 0) {
                            let query = `INSERT INTO transactions SET ?`;

                            db.query(query, transaction, (err, result) => {
                                if (err) reject(new Error(err.message));

                                query = "UPDATE account SET value = ? WHERE id = ?";

                                db.query(query, [newBalance, account_id], (err, result) => {
                                    if (err) reject(new Error(err.message));
                                    resolve(result);
                                })
                            })
                        } else {
                            reject(new Error('Transaction rejected'))
                        }
                    });
            });
            return {
                account_id: account_id,
                value: value
            };

        } catch (error) {
            console.log(error);
        }
    }
}

export default DbService;