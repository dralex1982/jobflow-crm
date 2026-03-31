import './globals.css';
import {ReactNode} from 'react';
import {AuthProvider} from '@/app/providers/auth-provider';
import {Header} from "@/widgets/header/header";

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>

        <AuthProvider>
            <Header/>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}