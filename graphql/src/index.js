import express from 'express';
import {createHandler} from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import {ruruHTML} from 'ruru/server';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

const pool = new pg.Pool({
    user: 'postgres',
    host: '192.168.64.10',
    password: 'my_password',
    database: 'resource',
    port: 5432
})

export const schema = buildSchema(`
    type User{
        id: ID!
        name: String!
        email: String!
    }

    type Query{
        users: [User!]!
        user(id: ID!): User
    }

    type Mutation{
        createUser(name: String!, email: String!): User!
        updateUser(id: ID!, name: String, email: String): User!
        deleteUser(id: ID!): Boolean!
    }
`);

export const root = {
    hello: () => "hello! world",
    users: async () => {
        const result = await pool.query('SELECT * FROM user_table');
        return result.rows;
    },
    user: async ({id}) => {
        const result = await pool.query('SELECT * FROM user_table WHERE id=$1', [id]);
        return result.rows[0];
    },
    createUser: async ({name, email}) => {
        const result = await pool
        .query(`INSERT INTO user_table 
                (name, email) VALUES ($1, $2)
                RETURNING *`, [name, email]);
        return result.rows[0];
    }
}

const middleware = (req, res, next) => {
    const token = req.headers.cookie;
    console.log(token);
    if(typeof req.headers.cookie == 'undefined'){
        return res.status(401).json({
            "errors": [
                {
                "message": 'No access token',
                "extensions" : {
                    "code" : "AUTHORIZATION_ERROR"
                }
                }
            ]
        })
    }
    next();
}

const app = express();
app.use(cors({
    origin: 'https://localhost:3000',
    credentials: true,
}));
app.use(middleware);

app.all('/graphql', createHandler({
    schema: schema,
    rootValue: root
}));

app.get('/', (_req, res) => {
    res.type('html');
    res.end(ruruHTML({endpoint: '/graphql'}))
})

app.listen(4000, () => console.log('server running'));