'use client';

import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import {login} from '@/shared/api/auth';
import {setAccessToken} from '@/shared/lib/auth-token';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const response = await login({email, password});

            setAccessToken(response.accessToken);
            router.push('/dashboard');
        } catch (error) {
            setErrorMessage('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Sign in to JobFlow CRM
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                            placeholder="******"
                            required
                        />
                    </div>

                    {errorMessage ? (
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        </main>
    );
}