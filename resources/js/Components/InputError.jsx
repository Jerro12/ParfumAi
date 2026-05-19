export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-xs font-semibold text-destructive mt-1.5 ' + className}
        >
            {message}
        </p>
    ) : null;
}
