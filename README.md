# Toolbox

#### Purpose

This repo is made to be used as a toolbox.
It consists of a Nx monorepo with microservices including an Authentication system, a JWT securized CRUD, a chat. 
There is also a music module to display scales in the frontend part, but without technical value.
The frontend is made with Angular, the backend with Nestjs.


#### Apps Included

1. toolbox-client (Angular App)
2. toolbox-gateway (Nestjs API)
3. auth (Nestjs API + Microservice)
4. books (Nestjs Microservice)
5. chat (Nestjs Microservice)

#### How To Run

1. To install the dependencies like any other Node-based projects
```bash
$ npm install
```

2. To spin up all the services defined in the docker-compose.yml, run : 
```bash
$ docker compose up
```
To run the apps individually, run
```bash
$ nx run-many -t serve -p "auth,toolbox-client,toolbox-gateway,books,chat" --parallel
```

3. You can now access the individual app on localhost:4200

#### Notes
