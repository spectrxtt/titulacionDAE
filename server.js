const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Sirve los archivos estáticos de la carpeta 'build'
app.use(express.static(path.join(__dirname, 'build')));

// Para cualquier otra ruta, devuelve el index.html de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor en producción ejecutándose en el puerto ${PORT}`);
});
