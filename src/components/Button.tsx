const Button = ({ sub = false, onClick, children }: { sub?: boolean, onClick: () => void, children: string | JSX.Element }) => {
    const buttonClass = sub ? 'bg-gray-300' : 'bg-blue-500 text-white'
    return (
        <button
            className={`py-2 px-6 rounded-lg flex justify-center items-center ${buttonClass}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button;
