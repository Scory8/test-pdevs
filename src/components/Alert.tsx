interface AlertProps {
    alert: {
        error: boolean;
        msg: string;
    };
}

export function Alert({ alert }: AlertProps) {
    return (
        <div className={`${alert.error ? 'from-red-400 to-red-600' : 'from-sky-400 to-sky-600'} bg-gradient-to-br text-center p-3 rounded-lg uppercase text-white font-bold text-sm my-10`}>
            {alert.msg}
        </div>
    );
}