import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function SideNav() {
    const { data: session} = useSession()
    const user = session?.user
    return <nav className="sticky top-0 px-2 py-4">
        <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
            <li>
                <Link href={"/"} className="font-bold text-xl">Inicio</Link>
            </li>
            {user != null && (
                <p className="text-xl">Hola: <span className="font-bold text-md">{user.name}</span></p>
            )}
            {user == null ? (
                <li>
                    <button className="text-xl font-bold" onClick={() => void signIn()}>Iniciar Sesión</button>
                </li>
            ) : (
                <li>
                    <button className="text-xl font-bold" onClick={() => void signOut()}>Cerrar Sesión</button>
                </li>
            )}
        </ul>
    </nav>;
}