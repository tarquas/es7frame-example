# es7frame-example

Example of easy configurable REST API Microservices built upon `es7frame`.

## Microservices

Following microservices are represented by this example:

| NODE_APP_SERVICE_ID | NODE_APP_SERVICE  | Directory            |
|---                  |---                |---                   |
|                   1 | auth              | `./services/auth`    |
|                   2 | restapi           | `./services/restapi` |

On backend microservices are accessible via common SDK (`./services/sdk`)

## Backing services

Following services need to be installed on the same host with this example:

* `MongoDB` (recommended version is >= 3.4.6; maintains databases with name of format `dev_es7frame_example_${NODE_APP_SERVICE}`);

* `RabbitMQ` (recommended version is >= 3.6.10; maintains queues and exchanges with name of format `dev_es7frame_example_${queue_name}` upon `/` virtual host).

Default out-of-box configurations of these services are sufficient to run this example.

## Install

It's sufficient to install common to all microservices NPM dependencies from root directory of this example.
Installation of individual NPM dependencies under (`./services/${NODE_APP_SERVICE}`) is not required.

```
npm i
```

## Run

Following runtime environments need to be installed:

* `Node.js` (recommended version is >= 8.1.4).

Default configuration is `NODE_ENV=dev` which conforms to default configurations of backing services.
Below are typical startup examples with this configuration, which specific syntax may be combined to achieve more advanced startup modes.
NPM start script (`npm start`) may be used instead of `node .` for these examples.

### Single instance of every service. HTTP is bound to different ports

```
node .
```

HTTP web services are bound to ports `3000 + NODE_APP_SERVICE_ID`.
Profile API of `auth` is accessible on `http://127.0.0.1:3001/profile`.

### Single instance of every service; HTTP is bound to same port

```
node run-multi
```

HTTP web services are bound to port `3000` under different prefix paths `/${NODE_APP_SERVICE}`.

This startup mode is useful when all microservices are hosted on same VM, but platform allows only one HTTP port for that VM.

### Single persistant instance of every service

```
NODE_CLUSTER_SIZE=1 node .
```

Specifying `NODE_CLUSTER_SIZE` makes application run in local horizontal scaling cluster.

Persistent means that worker is restarted if it gets terminated with critical error.

Signals `SIGINT`, `SIGHUP`, and `SIGTERM` preform clean shut down of worker or whole cluster without restart.
Any other signal causes restart of failed worker.

### 4 persistant instances of every service

```
NODE_CLUSTER_SIZE=4 node .
```

### Single instance of `auth` service

```
node services/auth
```

### 2 persistant instances of `restapi` service

```
NODE_CLUSTER_SIZE=2 node services/restapi
```

### Single instance of every service. HTTP is bound to non-default ports

```
WEB_BASE_HTTP=4000 node .
```

`auth` HTTP is bound to 4001, `restapi` to 4002.

### Single instance of every service. HTTP is bound to same non-default port

```
WEB_BASE_HTTP=4000 node run-multi
```

### Single instance of every service. HTTP is bound to different ports with custom path prefix

```
WEB_BASE_PREFIX=/api node .
```

Profile API of `auth` is accessible on `http://127.0.0.1:3001/api/profile`.

### Single instance of every service. HTTP is bound to same port

```
WEB_BASE_HTTP=5000 WEB_BASE_PREFIX=/api node run-multi
```

Profile API of `auth` is accessible on `http://127.0.0.1:5000/api/auth/profile`.

### 8 persistant instances of every service with delayed restart

```
NODE_CLUSTER_SIZE=8 NODE_CLUSTER_RESTART_DELAY=5000 node .
```

Restart of a worker will occur in 5 seconds after its critical failure.

## Deployment

Create or customize existing (`prod`) configurations of microservices (in `./services/${NODE_APP_SERVICE}/config` directory) for your production.
Example `NODE_ENV=prod` configuration is given for deployment on Heroku platform with CloudAMQP and mLab add-ons.

*Heroku > Settings > Config Variables*

| Key                 | Value          |
|---                  |---             |
| `CLOUDAMQP_URL`     | autoconfigured |
| `MONGOLAB_URI`      | autoconfigured |
| `NODE_CLUSTER_RESTART_DELAY` | 3000  |
| `NODE_CLUSTER_SIZE` | 2              |
| `NODE_ENV`          | `prod`         |

### Horizontal scaling of placing microservices in different VMs.

Each microservice may be source-controlled in different repo and hosted on different VM.
For each microservice you'll need only `${NODE_APP_SERVICE}` and `sdk` directories (originated in `./services`) placed under the same root directory with individual NPM dependency installations.
Another option is to deploy whole root repo but run only individual service on it.
Microservices may use different MongoDB instances, but must use only one and the same RabbitMQ instance, accessible from every microservice.
