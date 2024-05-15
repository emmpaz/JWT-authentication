'use client'

import { FormEvent } from "react";


export default function Page() {

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            email: {value: string},
            password: {value: string},
        };
        const res = await fetch('api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: target.email.value,
                password: target.password.value
            })
        })
        console.log(await res.json());
        
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className=" w-1/2 max-w-sm min-w-72">
            <form onSubmit={handleSubmit}>
        
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="text" id="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@example.com" required />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" id="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                </div>
                <div className="w-full grid place-items-center">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </div>
            </form>
        </div>
    </main>
    );
  }