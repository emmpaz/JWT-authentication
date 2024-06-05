import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema, graphql } from 'graphql';
import { ruruHTML } from 'ruru/server';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { makeExecutableSchema } from '@graphql-tools/schema';

const pool = new pg.Pool({
    user: 'postgres',
    host: '192.168.64.10',
    password: 'my_password',
    database: 'resource',
    port: 5432
})

export const typeDefs = `
    type User{
        id: ID!
        name: String!
        email: String!
    }

    type Query{
        user: User
    }
`;

const resolvers = {
    Query: {
        user: async (_, __, context) => {
            const {user} = context;
            let result = await pool.query('SELECT * FROM resource_users WHERE id=$1', [user.id]);
            let resultedUser;
            
            resultedUser = result.rows[0];
            
            if(!resultedUser){
                result = await pool.query('INSERT INTO resource_users (id, name, email) VALUES ($1, $2, $3) RETURNING *', [user.id, user.name, user.email])
                resultedUser = result.rows[0];
            }
            
            
            return resultedUser;
        },
    }
}

const middleware = async (req, res, next) => {
    const key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

    let true_token;
    const both_tokens = req.headers.cookie;
    const access_part = both_tokens?.split(';')[0];
    true_token = access_part?.replace('__example_jt__=', '');


    if (!true_token) {
        return res.status(401).json({
            "errors": [
                {
                    "message": 'No access token',
                    "extensions": {
                        "code": "AUTHORIZATION_ERROR"
                    }
                }
            ]
        })
    }
    try {

        const decoded = jwt.verify(true_token, key);
        req.user = {...decoded};
        
    } catch (err) {
        return res.status(401).json({
            errors: [{
                message: 'Token Expired or invalid',
                extensions: {
                    code: 'TOKEN_EXPIRED or INVALID'
                },
                tes: err
            }]
        });
    }

    next();
}

const app = express();
app.use(cors({
    origin: 'https://localhost:3000',
    credentials: true,
}));

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

app.use(middleware);

app.use(express.json());

app.use(createHandler({
    schema,
    rootValue: null,
    context: (req) => {
        return {
            user: req.raw.user
        }
    }
}));

app.all('/graphql');

app.get('/', (_req, res) => {
    res.type('html');
    res.end(ruruHTML({ endpoint: '/graphql' }))
})

app.listen(4000, () => console.log('server running'));