'use client'

import { get_users } from "@/actions/graphql/test";
import { getUser, signOut } from "@/actions/user";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";


export default function Home() {
  
  
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  
  useEffect(() => {
    getUser().then((res : string) => setName(res));
    get_users().then((res) => setList(res));
  }, []);


  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="grid grid-rows-2 place-items-center">
          <p className="">hello : {name}</p>
          {list && list.map((user : {
            id: number,
            name: string,
            email: string
          }) => (
            <li key={user.id}>{user.name}</li>
          ))
 
          }
          <div className="w-full grid place-items-center grid-cols-2">
            <button onClick={() => signOut()} className="btn btn-primary">Sign out</button>
          </div>
        </div>
      </main>
  );
}
