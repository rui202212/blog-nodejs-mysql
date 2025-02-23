**Mini projet de Blog API en Node.js avec Express, une base de données MySQL sous Docker et une authentification avec JWT**

- Voici la configuration de MySQL sous Docker

```bash
docker run --name mysql-container
-e MYSQL_ROOT_PASSWORD=yourpassword
-e MYSQL_DATABASE=blogdb
-e MYSQL_USER=user
-e MYSQL_PASSWORD=userpassword
-p 3310:3306
-v /d/mySQL:/var/lib/mysql
-d mysql:latest
```

- Pour lancer le projet, exécuter dans le terminal

```bash
node server.js
```

- Le dossier _scripts_ comprend une copie dumpée de la base de donnée `blogdb`.

- Le dossier _tests_routes_postman_ comprend une copie d'export des tests des routes.
