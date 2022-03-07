const { io } = require('../index');


// Mensaje de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.on('disconnect', () => { console.log("Cliente desconectado")});

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje desde Backend' });

    });

    //client.on('emitir-mensaje', ( payload ) => {
    //    io.emit( 'nuevo-mensaje', payload ); //emite a todos
    //    client.broadcast.emit('nuevo-mensaje', payload); //Emite a todos menos al emisor
    //});

  
        
       

    


    


});