const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// 1. PATRON SINGLETON: Conexión unica a la Base de Datos

class Database {
    constructor() {
        if (!Database.instance) {
            this.connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',      // Laragon usa 'root' por defecto
                password: '',      // Laragon no tiene clave por defecto
                database: 'hotel_bd'
            });

            this.connection.connect((err) => {
                if (err) {
                    console.error('Error conectando a MySQL:', err.message);
                    return;
                }
                console.log('¡Conectado al Singleton de la BD en Laragon!');
            });

            Database.instance = this;
        }
        return Database.instance;
    }

    getConnection() {
        return this.connection;
    }
}

const db = new Database().getConnection();



// 2. PATRON ESTRATEGIA (Strategy): Procesamiento de Pagos
class EstrategiaPago {
    procesar(numeroHabitacion) {
        throw new Error("El método procesar() debe ser implementado");
    }
}

class PagoTarjeta extends EstrategiaPago {
    procesar(numeroHabitacion) {
        console.log(`[Strategy] Transacción bancaria aprobada para la habitación ${numeroHabitacion}`);
        return "Pago procesado exitosamente con Tarjeta de Crédito.";
    }
}

class PagoEfectivo extends EstrategiaPago {
    procesar(numeroHabitacion) {
        console.log(`[Strategy] Registro de pago en efectivo creado para la habitación ${numeroHabitacion}`);
        return "Reserva registrada. El cliente cancelará en Efectivo en recepción.";
    }
}

class PagoPayPal extends EstrategiaPago {
    procesar(numeroHabitacion) {
        console.log(`[Strategy] Token de seguridad PayPal validado para la habitación ${numeroHabitacion}`);
        return "Pago procesado exitosamente a través de PayPal.";
    }
}

class ProcesadorPagos {
    constructor() {
        this.estrategia = null;
    }
    setEstrategia(estrategia) {
        this.estrategia = estrategia;
    }
    ejecutarPago(numeroHabitacion) {
        if (!this.estrategia) throw new Error("No se ha seleccionado ninguna estrategia.");
        return this.estrategia.procesar(numeroHabitacion);
    }
}



// 3. RUTAS DE LA API 

app.get('/api/habitaciones', (req, res) => {
    db.query('SELECT * FROM habitaciones', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/reservar', (req, res) => {
    const { numero, pago, nombre, apellido, rut, telefono, fecha_ingreso } = req.body;
    const procesador = new ProcesadorPagos();

    if (pago === 'tarjeta') procesador.setEstrategia(new PagoTarjeta());
    else if (pago === 'efectivo') procesador.setEstrategia(new PagoEfectivo());
    else if (pago === 'paypal') procesador.setEstrategia(new PagoPayPal());
    else return res.status(400).json({ success: false, error: 'Método de pago no válido.' });

    db.query('SELECT disponible FROM habitaciones WHERE numero = ?', [numero], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al consultar disponibilidad' });
        if (results.length === 0) return res.status(404).json({ success: false, error: 'Habitación no existe.' });

        if (results[0].disponible === 1) {
            db.query('UPDATE habitaciones SET disponible = FALSE WHERE numero = ?', [numero], (err2) => {
                if (err2) return res.status(500).json({ error: 'Error al actualizar habitación' });
                
                const detallePago = procesador.ejecutarPago(numero);

                // CORRECCIÓN AQUÍ: Adaptamos los nombres de las columnas para que no fallen
                const sqlInsert = `
                    INSERT INTO reservas (numero, pago, nombre, apellido, rut, telefono, fecha_ingreso) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                const valoresInsert = [numero, pago, nombre, apellido, rut, telefono, fecha_ingreso];

                db.query(sqlInsert, valoresInsert, (err3, resultadoQuery) => {
                    if (err3) {
                        console.error("Error exacto de MySQL:", err3.message);
                        db.query('UPDATE habitaciones SET disponible = TRUE WHERE numero = ?', [numero]);
                        return res.status(500).json({ error: 'Error crítico al registrar los datos de la reserva' });
                    }

                    res.json({ 
                        success: true, 
                        mensaje: `${nombre}, la habitación ${numero} ha sido reservada de forma segura para el ${fecha_ingreso}.`,
                        pagoInfo: detallePago
                    });
                });
            });
        } else {
            res.json({ success: false, error: 'La habitación acaba de ser reservada por alguien más.' });
        }
    });
});


// NUEVAS RUTAS PARA EL PANEL DE ADMINISTRACIÓN

app.get('/api/reservas', (req, res) => {
    db.query('SELECT * FROM reservas ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error("Error al leer reservas:", err.message);
            return res.status(500).json({ error: 'Error al traer las reservas desde MySQL' });
        }
        res.json(results);
    });
});

app.post('/api/liberar', (req, res) => {
    const numeroHabitacion = req.body.numero;
    const idReserva = req.body.id;

    db.query('UPDATE habitaciones SET disponible = TRUE WHERE numero = ?', [numeroHabitacion], (err1) => {
        if (err1) return res.status(500).json({ success: false, error: 'Error al actualizar estado' });

        db.query('DELETE FROM reservas WHERE id = ?', [idReserva], (err2) => {
            if (err2) return res.status(500).json({ success: false, error: 'Falló eliminar registro' });
            res.json({ success: true, mensaje: `La Habitación ${numeroHabitacion} ha sido liberada correctamente.` });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});