
const RoundedButton = ({ onClick, children }: { onClick: () => void, children: string | JSX.Element }) => {
    return (
        <button
            className="rounded-full border-blue-500 border flex justify-center items-center hover:bg-blue-500 hover:text-white text-sm text-blue-500"
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default RoundedButton