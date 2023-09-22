import { getSession } from "next-auth/react";
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function obtenerInfo(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'GET') {
        try {
            const session = await getSession({ req });

            // Verifico si el usuario está autenticado
            if (!session || !session.user) {
                return res.status(401).json({
                    msg: 'Usuario no autenticado',
                    error: true,
                });
            }

            // Consulto la db
            const infoData = await prisma.info.findMany({
                where: {
                    userId: session.user.id,
                },
            });

            res.status(200).json({
                msg: 'Información recuperada correctamente',
                error: false,
                data: infoData,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                msg: 'Error al recuperar la información de la base de datos',
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
