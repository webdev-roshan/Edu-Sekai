export default async function LoginPage({
    params,
}: {
    params: Promise<{ domain: string }>;
}) {
    const { domain } = await params;
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
                <h1 className="text-xl font-bold text-center mb-6">Login to {domain}</h1>
                {/* Login form will go here */}
                <p className="text-center text-gray-500">Form placeholder</p>
            </div>
        </div>
    );
}
