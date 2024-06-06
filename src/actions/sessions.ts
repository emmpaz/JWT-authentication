'use server'

import { query } from "./db"


export const create_session = async ({
    user_id,
    ip_address,
    user_agent
} : {
    user_id: string,
    ip_address: string,
    user_agent: string,
}) => {
    const session_result = await query('INSERT into sessions (user_id, ip_address, user_agent) VALUES ($1, $2, $3) RETURNING *', [user_id, ip_address,user_agent]);
    
    
    const session = session_result.rows[0] as {
        id: string,
        user_id: string,
        created_at: Date,
        ip_address: string,
        user_agent: string,
    }
    
    return session.id;
}

export const refresh_token_in_session = async (session_id : string, refresh_token : string) => {
    await query('UPDATE sessions set refresh=$1 WHERE id=$2', [refresh_token, session_id]);
}

export const delete_session = async (session_id : string) => {
    const res = await query('DELETE FROM sessions WHERE id=$1', [session_id]);
}

export const delete_session_by_refresh = async (refresh: string) => {
    await query('DELETE FROM sessions WHERE refresh=$1', [refresh]);
}