import { Redis } from "@upstash/redis";


export const redis = Redis.fromEnv()

export function add_ID_to_DB(id: string){

    if(id === "") return;

    redis.set(id, '1', {
        ex: parseInt(process.env.NEXT_PUBLIC_UPSTASH_EXPIRATION as string)
    })
}

export async function isBlacklisted(id: string){
    const check = await redis.exists(id);

    return !check ? false : true;
}