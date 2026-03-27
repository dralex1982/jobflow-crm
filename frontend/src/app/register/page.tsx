'use client';

import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {register} from '@/shared/api/auth';

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            await register({
                email,
                password,
                firstName: firstName || undefined,
                lastName: lastName || undefined,
            });

            setSuccessMessage('Account created successfully');

            setTimeout(() => {
                router.push('/login');
            }, 800);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Registration failed';

            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
                <h1 className="text-2xl font-bold">Create account</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Register to start using JobFlow CRM
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">First name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            className="w-full rounded-lg border px-3 py-2 outline-none"
                            placeholder="Alex"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Last name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            className="w-full rounded-lg border px-3 py-2 outline-none"
                            placeholder="Developer"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-lg border px-3 py-2 outline-none"
                            placeholder="alex@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-lg border px-3 py-2 outline-none"
                            placeholder="Minimum 6 characters"
                            required
                        />
                    </div>

                    {errorMessage ? (
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    ) : null}

                    {successMessage ? (
                        <p className="text-sm text-green-600">{successMessage}</p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {isLoading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
            </div>
        </main>
    );
}