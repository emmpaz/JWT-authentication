'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";


type formInput = {
    firstName: { value: string },
    lastName: { value: string },
    email: { value: string },
    password: { value: string },
};

export default function Page() {

    const router = useRouter();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const target = event.target as typeof event.target & formInput;
        const res = await fetch('api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                firstname: target.firstName.value,
                lastname: target.lastName.value,
                email: target.email.value,
                password: target.password.value
            })
        })
        if(res.ok) router.push('/login');

    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className=" w-1/2 max-w-sm min-w-72">
                <form onSubmit={handleSubmit}>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">What is your first name?</span>
                        </div>
                        <input type="text" placeholder="Type here" name="firstName" className="input input-bordered w-full" required />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">What is your last name?</span>
                        </div>
                        <input type="text" placeholder="Type here" name="lastName" className="input input-bordered w-full " required/>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">What is your email?</span>
                        </div>
                        <input type="text" placeholder="Type here" name="email" className="input input-bordered w-full" required/>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">enter password</span>
                        </div>
                        <input type="password" placeholder="Type here" name="password" className="input input-bordered w-full" required />
                    </label>
                    <div className="w-full grid place-items-center grid-cols-2 mt-5">
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <Link href="/login" className="btn btn-link">log in</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}