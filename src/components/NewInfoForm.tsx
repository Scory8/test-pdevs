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
    const [tipoCedula, setTipoCedula] = useState<string>('nacional');
    const [telefono, setTelefono] = useState<string>('');
    const [direccion, setDireccion] = useState<string>('');
    const [salario, setSalario] = useState<string>('');
    const [alert, setAlert] = useState<AlertType>({ msg: '', error: false });

    if(session.status !== 'authenticated') return;

    const validarNombre = (nombre: string): boolean => {
        const nombreExpresion = /^[a-zA-Z\s'ñÑ]+$/;
        return nombreExpresion.test(nombre);
    };

    const validarCedula = (cedula: string): boolean => {
        let cedulaExpresion: RegExp;
        if (tipoCedula === 'nacional') {
            cedulaExpresion = /^(10-\d{2,4}-\d{3,5}|[1-9]-\d{2,4}-\d{3,5})$/;
        } else if (tipoCedula === 'extranjero') {
            cedulaExpresion = /^E-[1-9]{1}-\d{4,6}$/;
        } else {
            return false;
        }
        return cedulaExpresion.test(cedula);
    };

    const validarTelefono = (telefono: string): boolean => {
        const telefonoExpresion = /^(6\d{3}-\d{4}|[23479]\d{2}-\d{4})$/;
        return telefonoExpresion.test(telefono);
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if([nombre, cedula, telefono, direccion, salario].includes('')) {
            setAlert({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return;
        }

        if(nombre.length <= 2) {
            setAlert({
                msg: 'Nombre no válido',
                error: true
            })
            return;
        }

        if(direccion.length <= 8) {
            setAlert({
                msg: 'Ingrese una dirección más larga',
                error: true
            })
            return;
        }

        if(parseInt(salario) <= 0) {
            setAlert({
                msg: 'El Salario no puede ser cero o negativo',
                error: true
            })
            return;
        }

        if(!validarNombre(nombre)) {
            setAlert({
                msg: 'Nombre no válido',
                error: true
            });
            return;
        }

        if(!validarCedula(cedula)) {
            setAlert({
                msg: 'Cédula no válida',
                error: true
            });
            return;
        }

        if(!validarTelefono(telefono)) {
            setAlert({
                msg: 'Número de teléfono no válido',
                error: true
            });
            return;
        }

        setAlert({ msg: '', error: false });

        // Crear el usuario en la API
        try {
            // TODO: Mover hacia un cliente AXIOS

            const { data } = await axios.post('http://localhost:3000/api/crearInfo', {nombre, cedula: cedula, telefono, direccion, salario, userId})

            setAlert({
                msg: data.msg,
                error: false
            })

            setNombre('');
            setCedula('');
            setTelefono('');
            setDireccion('');
            setSalario('');
            setTipoCedula('nacional');

            setTimeout(() => {
                router.reload();
            }, 2000);

            // eslint-disable-next-line
        } catch (error: any) {
            setAlert({
                msg: error?.response?.data.msg,
                error: true
            })
        }
    }

    const { msg } = alert;

    let cedulaPlaceholder = '';

    if (tipoCedula === 'nacional') {
        cedulaPlaceholder = 'Ej: 1-2345-6789';
    } else if (tipoCedula === 'extranjero') {
        cedulaPlaceholder = 'Ej: E-8-123456';
    }

    return <div className='container mx-auto md:flex md:justify-center'>
                <div className='md:w-2/3 lg:w-2/5'>

                    <form className="my-10 bg-white shadow rounded-lg p-10"
                        onSubmit={e => {const submit = handleSubmit(e)}}
                    >
                        <div className="my-5">
                            <label htmlFor="nombre" className="uppercase text-gray-600 block text-xl font-bold">Nombre y Apellido</label>
                            <input id="nombre" name="name" type="text" placeholder="Nombre y Apellido" className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="my-5 flex items-center">
                            <label htmlFor="tipoCedula" className="uppercase text-gray-600 block text-xl font-bold mr-3">Tipo de Cédula</label>
                            <select
                                id="tipoCedula"
                                name="tipoCedula"
                                className="mt-3 p-3 w-full border rounded-lg bg-gray-50"
                                value={tipoCedula}
                                onChange={e => setTipoCedula(e.target.value)}
                            >
                                <option value="nacional">Nacional</option>
                                <option value="extranjero">Extranjero</option>
                            </select>
                        </div>
                        <div className="my-5">
                            <label htmlFor="cedula" className="uppercase text-gray-600 block text-xl font-bold">Cédula</label>
                            <input id="cedula" name="cedula" type="text" placeholder={cedulaPlaceholder} className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                                value={cedula}
                                onChange={e => setCedula(e.target.value)}
                            />
                        </div>
                        <div className="my-5">
                            <label htmlFor="telefono" className="uppercase text-gray-600 block text-xl font-bold">Teléfono</label>
                            <input id="telefono" name="telefono" type="text" placeholder="Ej: 6123-4567 | 212-3456" className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
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