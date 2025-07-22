import mysql from 'mysql2/promise';
import type { ReservaRepository } from '../../domain/repositories/ReservaRepository';

export class ReservaMySQLDataSource implements ReservaRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: 'localhost', // Cambia esto si tu host es diferente
      user: 'root',
      password: '0000',
      database: 'reservas_restaurante',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async cancelReservation(reservationNumber: string): Promise<boolean> {
    const [result] = await this.pool.execute(
      'UPDATE reservas SET estado = ? WHERE numero_reserva = ?',
      ['Cancelada', reservationNumber]
    );
    // @ts-ignore
    return result.affectedRows > 0;
  }

  // Puedes agregar aquí otros métodos del repositorio si los necesitas
}
