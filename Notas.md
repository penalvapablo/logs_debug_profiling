# Notas

servidor individual en 8080

pm2 start server.js --name="server1" --watch -- 8080

Redirigir todas las consultas a */api/randoms* a un cluster de servidores escuchando en el puerto 8081. El cluster será creado desde node utilizando el módulo nativo *cluster*.

pm2 start server.js --name="server2" --watch -- 8081 cluster

Luego, modificar la configuración para que todas las consultas a */api/randoms* sean redirigidas a un cluster de servidores gestionado desde nginx, repartiéndolas equitativamente entre 4 instancias escuchando en los puertos 8082, 8083, 8084 y 8085 respectivamente.

pm2 start server.js --name="server1" --watch -- 8080

pm2 start server.js --name="server2" --watch -- 8082

pm2 start server.js --name="server3" --watch -- 8083

pm2 start server.js --name="server4" --watch -- 8084

pm2 start server.js --name="server5" --watch -- 8085

luego ejecutar nginx.exe

localhost/api/randoms