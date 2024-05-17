'use client'

import { getUser, signOut } from "@/actions/user";
import { useEffect, useState } from "react";


export default function Home() {

  const [name, setName] = useState("");

  useEffect(() => {
    getUser().then((res : string) => setName(res));
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <p className="">hello : {name}</p>
        <div className="w-full grid place-items-center">
          <button onClick={() => signOut()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign out</button>
        </div>
      </div>
    </main>
  );
}
