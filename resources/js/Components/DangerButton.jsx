export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-full border border-transparent bg-destructive px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-destructive-foreground shadow-lg shadow-destructive/25 transition duration-200 hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
