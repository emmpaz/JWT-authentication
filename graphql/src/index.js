import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import { ruruHTML } from 'ruru/server';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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
        age: Int
        posts: [Post!]!
    }

    type Post{
        id: ID!
        title: String!
        content: String!
        author: User!
    }

    type Query{
        users(limit: Int, offset: Int): [User!]!
        user(id: ID!): User
        userByEmail(email: String!): User
        posts(limit: Int, offset: Int): [Post!]!
        post(id: ID!): Post
    }

    type Mutation{
        createUser(name: String!, email: String!): User!
        updateUser(id: ID!, name: String, email: String): User!
        deleteUser(id: ID!): Boolean!
        createPost(title: String!, content: String!, authorId: ID!): Post!
        updatePost(id: ID!, title: String, content: String): Post!
        deletePost(id: ID!): Boolean!
    }
`);

export const root = {
    users: async ({limit = 10, offset = 0}) => {
        const result = await pool.query('SELECT * FROM user_table LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows;
    },
    user: async ({ id }) => {
        const result = await pool.query('SELECT * FROM user_table WHERE id=$1', [id]);
        return result.rows[0];
    },
    userByEmail: async ({email}) => {
        const result = await pool.query('SELECT * FROM user_table WHERE email=$1', [email]);
        return result.rows[0];
    },
    posts: async ({limit = 10, offset = 0}) => {
        const result = await pool.query('SELECT * FROM post LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows;
    },
    post: async ({ id }) => {
        const result = await pool.query('SELECT * FROM post WHERE id=$1', [id]);
        return result.rows[0];
    },
    createUser: async ({ name, email, age}) => {
        const result = await pool
            .query(`INSERT INTO user_table 
                (name, email, age) VALUES ($1, $2, $3)
                RETURNING *`, [name, email, age]);
        return result.rows[0];
    }
}

const middleware = (req, res, next) => {
    const key = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

    let true_token;

    if(process.env.TESTING){
        const both_tokens = req.headers.cookie;
        const access_part = both_tokens?.split(';')[0];
        true_token = access_part?.replace('__example_jt__=', '');
    }else{
        true_token = req.headers.cookie
    }

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
        jwt.verify(true_token, key);
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
app.use(middleware);

app.all('/graphql', createHandler({
    schema: schema,
    rootValue: root
}));

app.get('/', (_req, res) => {
    res.type('html');
    res.end(ruruHTML({ endpoint: '/graphql' }))
})

app.listen(4000, () => console.log('server running'));