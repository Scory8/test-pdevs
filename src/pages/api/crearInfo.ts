import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function crearInfo(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        const { nombre, cedula, telefono, direccion, salario, userId } = req.body;

        try {
            const nuevaInfo = await prisma.info.create({
                data: {
                    nombre,
                    cedula,
                    telefono,
                    direccion,
                    salario,
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                },
            });

            res.status(201).json({
                msg: 'Información guardada correctamente',
                error: false,
                data: nuevaInfo,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: 'Error al guardar la información en la base de datos',
                error: true,
            });
        }
    } else {
        res.status(405).json({
            msg: 'Método no permitido',
            error: true,
        });
    }
}
