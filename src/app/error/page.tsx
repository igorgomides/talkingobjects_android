


import ErrorClientPage from './ErrorClientPage';

export default async function ErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string; type?: string }>
}) {
    const { message, type } = await searchParams
    return <ErrorClientPage message={message} type={type} />
}
