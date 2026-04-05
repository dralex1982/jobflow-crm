interface ErrorMessageProps {
    message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {message}
        </div>
    );
}