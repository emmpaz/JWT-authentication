'use client'

import { getUser } from "@/actions/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";


export default function Page() {

    const router = useRouter();

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
        if(res.ok) router.push('/');
    }
        

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className=" w-1/2 max-w-sm min-w-72">
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="text" id="email" name="email" className="input w-full input-secondary" placeholder="john@example.com" required />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" id="password" autoComplete="current-password" name="password" className="input input-secondary w-full" placeholder="•••••••••" required />
                </div>
                <div className="w-full grid place-items-center grid-cols-2">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <Link href='/signup'>
                        <button className="btn btn-link">sign up</button>
                    </Link>
                </div>
            </form>
        </div>
    </main>
    );
  }