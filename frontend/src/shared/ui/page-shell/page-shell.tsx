interface PageShellProps {
    children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
    return <main className="p-6 space-y-6">{children}</main>;
}