export default async function DashboardPage({
    params,
}: {
    params: Promise<{ domain: string }>;
}) {
    const { domain } = await params;
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Welcome to {domain} Dashboard</h1>
            <p className="mt-4">This is a tenant specific page.</p>
        </div>
    );
}
