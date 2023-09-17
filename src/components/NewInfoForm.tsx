import { useSession } from "next-auth/react";
import { useState, FormEvent } from "react";
import axios from 'axios';
import { Alert } from "./Alert";
import { useRouter } from "next/router";

interface AlertType {
    msg: string;
    error: boolean;
}

export function NewInfoForm() {
    const router = useRouter();
    const session = useSession();
    const userId = session.data?.user.id;

    const [nombre, setNombre] = useState<string>('');
    const [cedula, setCedula] = useState<string>('');
    const [telefono, setTelefono] = useState<string>('');
    const [direccion, setDireccion] = useState<string>('');
    const [salario, setSalario] = useState<string>('');
    const [alert, setAlert] = useState<AlertType>({ msg: '', error: false });

    if(session.status !== 'authenticated') return;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if([nombre, cedula, telefono, direccion, salario].includes('')) {
            setAlert({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        if(parseInt(salario) <= 0) {
            setAlert({
                msg: 'El Salario no puede ser cero o negativo',
                error: true
            })
            return
        } 

        setAlert({ msg: '', error: false });

        // Crear el usuario en la API
        try {
            // TODO: Mover hacia un cliente AXIOS

            const { data } = await axios.post('http://localhost:3000/api/crearInfo', {nombre, cedula, telefono, direccion, salario, userId})

            setAlert({
                msg: data.msg,
                error: false
            })

            setNombre('');
            setCedula('');
            setTelefono('');
            setDireccion('');
            setSalario('');

            setTimeout(() => {
                router.reload();
            }, 3000);

        } catch (error: any) {
            setAlert({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alert;

    return <div className='container mx-auto md:flex md:justify-center'>
                <div className='md:w-2/3 lg:w-2/5'>

                    <form className="my-10 bg-white shadow rounded-lg p-10"
                        onSubmit={handleSubmit}
                    >
                        <div className="my-5">
                            <label htmlFor="nombre" className="uppercase text-gray-600 block text-xl font-bold">Nombre</label>
                            <input id="nombre" name="name" type="text" placeholder="Nombre" className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="my-5">
                            <label htmlFor="cedula" className="uppercase text-gray-600 block text-xl font-bold">Cédula</label>
                            <input id="cedula" name="cedula" type="number" placeholder="Cédula" className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                                value={cedula}
                                onChange={e => setCedula(e.target.value)}
                            />
                        </div>
                        <div className="my-5">
                            <label htmlFor="telefono" className="uppercase text-gray-600 block text-xl font-bold">Teléfono</label>
                            <input id="telefono" name="telefono" type="number" placeholder="Teléfono" className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                                value={telefono}
                                onChange={e => setTelefono(e.target.value)}
                            />
                        </div>
                        <div className="my-5">
                            <label htmlFor="direccion" className="uppercase text-gray-600 block text-xl font-bold">Dirección</label>
                            <input id="direccion" name="direccion" type="text" placeholder="Dirección" className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                                value={direccion}
                                onChange={e => setDireccion(e.target.value)}
                            />
                        </div>
                        <div className="my-5">
                            <label htmlFor="salario" className="uppercase text-gray-600 block text-xl font-bold">Salario</label>
                            <input id="salario" name="salario" type="number" placeholder="Salario" className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                                value={salario}
                                onChange={e => setSalario(e.target.value)}
                            />
                        </div>

                        {msg && <Alert alert={alert}/>}

                        <input type="submit" value="Crear" className="mb-5 bg-black w-full py-3 text-white uppercase font-bold rounded-md hover:cursor-pointer hover:bg-gray-700 transition-colors"/>
                    </form>
                </div>
            </div>
}