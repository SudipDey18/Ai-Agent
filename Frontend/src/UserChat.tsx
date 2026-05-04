function UserChat({ message }: { message: string }) {
    return (
        <>
            {message && <div className='max-w-[90%] max-sm:max-w-[98%] min-w-2.5 text-left ml-auto bg-orange-400 p-2 px-4 border-0 rounded-2xl mb-2'>
                <p>{message}</p>
            </div>}
        </>
    )
}

export default UserChat