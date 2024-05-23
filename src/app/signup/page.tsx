'use client'

import Link from "next/link";
import { FormEvent } from "react";

export default function Page() {

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            firstName: { value: string },
            lastName: {value: string},
            email: {value: string},
            password: {value: string},
        };
        const res = await fetch('api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                firstname: target.firstName.value,
                lastname: target.lastName.value,
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
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
                        <input type="text" id="first_name" name="firstName" className="input w-full input-secondary" placeholder="John" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                        <input type="text" id="last_name" name="lastName" className="input w-full input-secondary" placeholder="Smith" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="text" id="email" name="email" className="input w-full input-secondary" placeholder="john@example.com" required />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" id="password" name="password" className="input w-full input-secondary" placeholder="•••••••••" required />
                    </div>
                    <div className="w-full grid place-items-center grid-cols-2">
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <Link href="/login" className="btn btn-link">log in</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}