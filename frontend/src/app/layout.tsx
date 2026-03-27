import './globals.css';
import {ReactNode} from 'react';
import {AuthProvider} from '@/app/providers/auth-provider';

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <AuthProvider>{children}</AuthProvider>
        </body>
        </html>
    );
}