# Toolbox

#### Purpose

This repo is made to be used as a toolbox.
It consists of a Nx monorepo with microservices including an Authentication system, and a JWT securized CRUD. 
The frontend is made with Angular, the backend with Nestjs.


#### Apps Included

1. toolbox-client (Angular App)
2. toolbox-gateway (Nestjs API)
3. auth (Nestjs API + Microservice)
4. books (Nestjs Microservice)

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
$ nx run-many -t serve -p "auth,toolbox-client,toolbox-gateway,books" --parallel
```

3. You can now access the individual app on localhost:4200

#### Notes

This repo is developed on a Windows machine. If there is anything that does not work on other OS like macOS, Linux, etc., please feel free to file an issue or even better, drop PR for it.