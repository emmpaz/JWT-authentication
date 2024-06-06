'use client'

import { get_users } from "@/actions/graphql/queries";
import { signOut } from "@/actions/user";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";


export default function Home() {
  
  const {loading, user} = useContext(AuthContext)!;

  const [list, setList] = useState([]);
  
  useEffect(() => {
    //get_users().then((res) => setList(res));
  }, []);

  if(loading) return <div className="w-full h-screen flex justify-center items-center">Loading...</div>

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="grid grid-rows-2 place-items-center">
          <p className="">hello : {user?.name}</p>
          {/* {list && list.map((user : {
            id: number,
            name: string,
            email: string
          }) => (
            <li key={user.id}>{user.name}</li>
          ))
 
          } */}
          <div className="w-full grid place-items-center grid-cols-2">
            <button onClick={() => signOut()} className="btn btn-primary">Sign out</button>
          </div>
        </div>
      </main>
  );
}
