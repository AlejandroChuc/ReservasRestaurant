import mysql from 'mysql2/promise';
export class ReservaMySQLDataSource {
    pool;
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
    async cancelReservation(reservationNumber) {
        const [result] = await this.pool.execute('UPDATE reservas SET estado = ? WHERE numero_reserva = ?', ['Cancelada', reservationNumber]);
        // @ts-ignore
        return result.affectedRows > 0;
    }
}
