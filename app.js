const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5000; // Elige cualquier puerto disponible

app.use(cors());
app.use(bodyParser.json());

// Conectarse a MongoDB
mongoose.connect('mongodb://localhost:27017/tallerApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error en la conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB exitosamente!');
});

// Definir el esquema para los datos del servicio
const servicioSchema = new mongoose.Schema({
  orden: Number,
  estado: {
    type: String,
    enum: ['Servicio en Proceso', 'Servicio Terminado'],
    default: 'Servicio en Proceso',
  },
});
const ServicioModel = mongoose.model('Servicio', servicioSchema);

// Middleware para autenticación Basic Auth
const basicAuth = require('express-basic-auth');

const users = { user: 'password' };

app.use(
  basicAuth({
    users,
    challenge: true,
  })
);

// Endpoint para indicar el estado del servicio
app.put('/api/servicio/:orden', (req, res) => {
  const { orden } = req.params;
  const { estado } = req.body;

  if (!orden || !estado) {
    return res.status(400).json({ error: 'Orden y estado son campos requeridos.' });
  }

  ServicioModel.findOneAndUpdate(
    { orden: orden },
    { estado: estado },
    { new: true, upsert: true },
    (err, servicio) => {
      if (err) {
        console.error('Error al actualizar el estado del servicio:', err);
        res.status(500).json({ error: 'Error al actualizar el estado del servicio.' });
      } else {
        res.json({ mensaje: 'Estado del servicio actualizado exitosamente.', servicio });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
