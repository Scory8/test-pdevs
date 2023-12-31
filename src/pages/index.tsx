import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { NewInfoForm } from "~/components/NewInfoForm";
import axios from "axios";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

interface InfoDatos {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
  salario: string;
}

export default function Home() {
  const { data: session} = useSession()
  const user = session?.user
  const [form, setForm] = useState(false);
  const [infoData, setInfoData] = useState<InfoDatos[]>([]);
  const [buscar, setBuscar] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState<string>('nombre');

  // Funcion de obtener la data 
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/obtenerInfo');
      
      setInfoData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchData();
  }, []);
  

  // const handleEdit = (id: string) => {
  //   // Proceso para editar la informacion
  // };

  // const handleDelete = (id: string) => {
  //   // Proceso para eliminar la informacion
  // };

  const buscarInfo = () => {
    if (buscar.trim() === "") {
      // No hay búsqueda, mostrar todo
      return infoData;
    } else {
      // Búsqueda, filtrar la información según el tipo de búsqueda
      return infoData.filter((info) => {
        // Verificar si tipoBusqueda es una clave válida en InfoDatos
        if (tipoBusqueda in info) {
          const infoValue = info[tipoBusqueda as keyof InfoDatos] || "";
          // Verificar si el valor contiene el texto de búsqueda (sin importar si es número o texto)
          return (
            typeof infoValue === "string" &&
            infoValue.toLowerCase().includes(buscar.toLowerCase())
          );
        }
        return false;
      });
    }
  };
    
  const resultadoInfo = buscarInfo();
  // console.log(resultadoInfo);

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2 text-center">
        {user == null ? (
                <h1 className="mb-2 px-4 text-lg font-bold">Parkour Devs | Bienvenido</h1>
            ) : (
                <h1 className="mb-2 px-4 text-lg font-bold">Inicio</h1>
            )}
      </header>

      {user == null ? (
        <h1 className="text-center mb-5 px-4 text-4xl font-bold mt-5">Prueba Técnica | Alfri Medina</h1>
      ) : (
        <>
        { form !== false ? (
          <NewInfoForm />
        ) : (
          <div className="flex justify-center mt-10 mb-5">
            <input type="button" value="Agregar Nueva Información" className="mb-5 bg-black w-3/4 sm:w-2/4 md:w-1/4 py-2 text-white uppercase font-bold rounded-md hover:cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => setForm(true)}
            />
          </div>
        )}
        { form == true && 
          <div className="flex justify-center mt-10">
            <input type="button" value="Ver Listado" className="mb-10 bg-black w-2/5 py-3 text-white uppercase font-bold rounded-md hover:cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => setForm(false)}
              />
          </div>
        }
        { form == false && (
            <div className="container mx-auto my-5">
              <h1 className="text-center mb-2 px-4 text-xl font-bold border-b uppercase">Información</h1>
              <label htmlFor="buscar" className="uppercase text-gray-700 block text-xl font-bold text-center">Buscar</label>
              <div className="my-5 border-b flex items-center justify-center">
                <select
                  id="tipoBusqueda"
                  name="tipoBusqueda"
                  className="mr-2 p-3 border rounded-lg bg-gray-50"
                  value={tipoBusqueda}
                  onChange={(e) => setTipoBusqueda(e.target.value)}
                >
                  <option value="nombre">Nombre</option>
                  <option value="cedula">Cédula</option>
                  <option value="telefono">Teléfono</option>
                  <option value="direccion">Dirección</option>
                </select>
                <input
                  id="buscar"
                  type="text"
                  placeholder="Empieza a buscar"
                  className="w-2/5 p-3 border rounded-lg bg-gray-50"
                  value={buscar}
                  onChange={(e) => setBuscar(e.target.value)}
                />
              </div>
              {resultadoInfo.length > 0 ? (
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Cédula</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Teléfono</th>
                    <th className="px-4 py-2">Dirección</th>
                    <th className="px-4 py-2">Salario</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadoInfo.map((info, index) => (
                    <tr key={info.id}>
                      <td className="border px-4 py-2">{info.cedula}</td>
                      <td className="border px-4 py-2">{info.nombre}</td>
                      <td className="border px-4 py-2">{info.telefono}</td>
                      <td className="border px-4 py-2">{info.direccion}</td>
                      <td className="border px-4 py-2">${info.salario}.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              ) : (
                <h1 className="text-center mb-5 px-4 text-lg font-bold">No hay información aún</h1>
              )}
            </div>
        )}
        </>
      )}
    </>
  );
}
