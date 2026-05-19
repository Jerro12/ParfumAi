export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
