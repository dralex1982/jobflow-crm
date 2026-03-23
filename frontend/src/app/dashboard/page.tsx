'use client';

import { useEffect, useState } from 'react';
import { getHealth } from '@/shared/api/api';

export default function DashBoardPage() {
    const [status, setStatus] = useState("loading...");
    const [error, setError] = useState('');

    useEffect(()=> {
        async function loadHealth(){
            try {
                const data = await getHealth();
                setStatus(data.status);
            } catch (err){
                setError('Failed to connect to backend');
            }
        }
        loadHealth();
    }, [])
    return (
        <main className={"p-6"}>
            <h1 className={"text-2xl font-bold"}>JobFlow Dashboard</h1>
            <p className="mt-2">Backend status: {status}</p>
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </main>
    )
}
