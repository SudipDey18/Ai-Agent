function UserChat({ message }: { message: string }) {
    return (
        <>
            {message && <div className='max-w-[95%] min-w-2.5 text-left ml-auto bg-orange-400 p-2 px-4 border-0 rounded-2xl'>
                <p>{message}</p>
            </div>}
        </>
    )
}

export default UserChat