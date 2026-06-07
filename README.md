Proyecto Farmacia: Sistema de gestión y control de narcóticos
 
Instalación de herramientas necesarias:

Ubuntu 22 (como sistema operativo  principal).

Se recomienda  un sistema Ubuntu 22 para asegurar la mayor compatibilidad de software. Ya que en la mayoría de manuales de referencia y ejemplos están hechos con linux .

Instalacion de java JDK.

Actualización de paquetes.

sudo apt update && sudo apt upgrade -y

Instalar de java JDK

sudo apt install openjdk-17-jdk -y

Verificar la instalación 

java —version

Se recomienda configurar Java_HOME para agregar la versión17 como principal ya que puede tener problemas  al momento de correr el proyecto.

Ingresamos al archivo bashrc 

nano ~/.bashrc

Agregamos la versión de java 

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

Ctrl + O <— para guardar 
Ctrl + X <— para salir 

Aplicamos los cambios 

source ~/.bashrc

Verificamos la versión de java 

echo $JAVA_HOME

————————————————————————————————————————————-

Instalar Node Version Manager 

Actualización del sistema 
sudo apt update

Instalar dependencias 
sudo apt install curl build-essential -y

Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

Recargamos terminal 
source ~/.bashrc 

Verificamos instalacion
nvm --version

Para instalar una versión especifica 
nvm install 22
nvm use 22

Establecer versión por defecto 
nvm alias default 22

Verificamos node y npm 
node -v
npm -v

—————————————————————————————————————————————————

Instalacion de docker 

Actualizar el sistema 
sudo apt update && sudo apt upgrade -y

Instalar dependencias 

sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release -y

Agregamos la clave oficial de docker 
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

Repositorio official
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

Actualizamos repositorios 
sudo apt update

Verificamos instalacion 
docker --version

Verificamos que docker funciona correctamente 
sudo docker run hello-world

Habilitar doker al iniciar el sistema
sudo systemctl enable docker
sudo systemctl start docker

Ver el estado de docker

sudo systemctl status docker


———————————————————————————————————————————————

Instalar Git en Ubuntu
Actualizar paquetes

sudo apt update
Verificar instalación

git --version
Configurar nombre de usuario

git config --global user.name "Tu Nombre"

Configurar correo de GitHub
git config --global user.email "correo@example.com"

———————————————————————————————————————————————
Instalar PostgreSQL en Ubuntu

Actualizar paquetes
sudo apt update && sudo apt upgrade -y

Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

Verificar instalación
psql --version

Verificar estado del servicio
sudo systemctl status postgresql

Iniciamos servicio
sudo systemctl start postgresql

Lo mantenemos activo
sudo systemctl enable postgresql

Acceder a PostgreSQL
sudo -i -u postgres
psql

Crear usuario
CREATE USER xavier WITH ENCRYPTED PASSWORD '123456';

Dar permisos
GRANT ALL PRIVILEGES ON DATABASE miproyecto TO xavier;
Salir 
\q

Instalacion de pg admin(entorno gráfico de postgresql)

Actualizar paquetes

sudo apt update
Instalar dependencias

sudo apt install curl ca-certificates gnupg -y
Agregar repositorio oficial de pgAdmin

curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | \
sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg

Crear repositorio
echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] \https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" | \
sudo tee /etc/apt/sources.list.d/pgadmin4.list

Actualizar repositorios
sudo apt update

Instalar pgAdmin
sudo apt install pgadmin4-desktop -y


———————————————————————————————————————————————

Instalar jHIpster
npm install -g generator-jhipster

Verificar instalación
jhipster --version

———————————————————————————————————————————————

Creación de proyecto en Jhipster

Primero debemos de crear la carpeta 

mkdir proyecto 

Generar proyecto con 
Jhipster

￼

Llenamos la encuesta de la siguiente manera para crear el Gateway esta será la entrada principal de nuestro proyecto.

Configuramos el archivo consult.yml (unicamente la versión de consult 1.22).
/Users/xavier/Downloads/infotec-farmacia/gateway/src/main/docker/consul.yml

# This configuration is intended for development purpose, it's **your** responsibility to harden it for production
name: gateway
services:
  consul:
    image: docker.io/hashicorp/consul:1.22
    # If you want to expose these ports outside your dev PC,
    # remove the "127.0.0.1:" prefix
    ports:
      - 127.0.0.1:8300:8300
      - 127.0.0.1:8500:8500
      - 127.0.0.1:8600:8600
    command: consul agent -dev -ui -client 0.0.0.0 -log-level=INFO

  consul-config-loader:
    image: jhipster/consul-config-loader:v0.4.1
    volumes:
      - ./central-server-config:/config
    environment:
      - INIT_SLEEP_SECONDS=5
      - CONSUL_URL=consul
      - CONSUL_PORT=8500
      # Uncomment to load configuration into Consul from a Git repository
      # as configured in central-server-config/git2consul.json
      # Also set SPRING_CLOUD_CONSUL_CONFIG_FORMAT=files on your apps
      # - CONFIG_MODE=git


Configuramos el archivo boopstrap.yml
/Users/xavier/Downloads/infotec-farmacia/gateway/src/main/resources/config/boopstrap.yml

# ===================================================================
# Spring Cloud Consul Config bootstrap configuration for the "dev" profile
# In prod profile, properties will be overwritten by the ones defined in bootstrap-prod.yml
# ===================================================================

spring:
  application:
    name: gateway
  #profiles:
    # The commented value for `active` can be replaced with valid Spring profiles to load.
    # Otherwise, it will be filled in by maven when building the JAR file
    # Either way, it can be overridden by `--spring.profiles.active` value passed in the commandline or `-Dspring.profiles.active` set in `JAVA_OPTS`
  #  active: '@spring.profiles.active@'
  cloud:
    consul:
      config:
        fail-fast: false # if not in "prod" profile, do not force to use Spring Cloud Config
        format: yaml
        profile-separator: '-'
      discovery:
        tags:
          - profile=${spring.profiles.active}
          - version='@project.version@'
          - git-version=${git.commit.id.describe:}
          - git-commit=${git.commit.id.abbrev:}
          - git-branch=${git.branch:}
          - context-path=${server.servlet.context-path:}

      host: localhost
      port: 8500


Para crear el microservicio 
Creamos la carpeta con el comando (esta carpeta se creara afuera de la carpeta de Gateway)
Mkdir microservicio

Ejecutamos el comando jhipster

￼
Llenamos el formulario para microservicio
Se crearan los archivos automáticamente (en la pregunta which framework) es no client.

Una vez creado ejecutamos el comando (jhipster import-jdl microservicio)


Ingresar a la carpeta Gateway y creamos la entidad 
￼

Agregamos la dirección donde se encuentre el microservicio para ver el directorio ejecutamos el comando pwd.


—————————————————————————————————————————————————————

Conexión y consumo de apis entre dos proyectos distintos.

Para esto debemos de saber cual es la dirección ip de ambas maquinas (1 y 2 ) 

Comando  linux (ip a) Mac (ifconfig) windows (ipconfig) debemos tener el rango de red 192.168.*.* 

Debe de aparecer algo así 
￼


En la maquina uno debemos de configurar el archivo prod-dev-yml 
# ===================================================================
# Spring Boot configuration for the "dev" profile.
#
# This configuration overrides the application.yml file.
#
# More information on profiles: https://www.jhipster.tech/profiles/
# More information on configuration properties: https://www.jhipster.tech/common-application-properties/
# ===================================================================

# ===================================================================
# Standard Spring Boot properties.
# Full reference is available at:
# http://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html
# ============================================

logging:
  level:
    ROOT: DEBUG
    tech.jhipster: DEBUG
    org.hibernate.SQL: DEBUG
    #com.mycompany.myapp: DEBUG

management:
  zipkin: # Use the "zipkin" Maven profile to have the Spring Cloud Zipkin dependencies
    tracing:
      endpoint: http://localhost:9411/api/v2/spans
  tracing:
    sampling:
      probability: 1.0 # report 100% of traces

spring:
  devtools:
    restart:
      enabled: true
      additional-exclude: static/**
    livereload:
      enabled: false # we use Webpack dev server + BrowserSync for livereload
  jackson:
    serialization:
      indent-output: true
  cloud:
    consul:
      config:
        fail-fast: false # if not in "prod" profile, do not force to use Spring Cloud Config
        format: yaml
        profile-separator: '-'
      discovery:
        prefer-ip-address: true 
        instance-ip-address: 192.168.1.143 # agregamos la dirección IP de la máquina local maquina local
        service-name: gateway # el nombre del servicio que se registrará en Consul 
        tags:
          - profile=${spring.profiles.active}
          - version='@project.version@'
          - git-version=${git.commit.id.describe:}
          - git-commit=${git.commit.id.abbrev:}
          - git-branch=${git.branch:}
      host: 192.168.1.143 # la dirección IP del agente de Consul  dirección ip de red
      port: 8500
  liquibase:
    # Remove 'faker' if you do not want the sample data to be loaded automatically
    contexts: dev, faker
    url: jdbc:postgresql://localhost:5432/gateway
  mail:
    host: localhost
    port: 25
    username: postgres
    password: 123
  messages:
    cache-duration: PT1S # 1 second, see the ISO 8601 standard
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/gateway
    username: postgres
    password: 123
  thymeleaf: 
    cache: false

server:
  port: 8080
  # make sure requests the proxy uri instead of the server one
  forward-headers-strategy: native

# ===================================================================
# JHipster specific properties
#
# Full reference is available at: https://www.jhipster.tech/common-application-properties/
# ===================================================================

jhipster:
  gateway:
    rate-limiting:
      enabled: false
      limit: 100000
      duration-in-seconds: 3600
  # CORS is only enabled by default with the "dev" profile
  cors:
    # Allow Ionic for JHipster by default (* no longer allowed in Spring Boot 2.4+)
    allowed-origins: 'http://localhost:8100,https://localhost:8100,http://localhost:9000,https://localhost:9000,http://localhost:9060,https://localhost:9060,http://192.168.1.143:8080,http://192.168.1.133:8082,http://192.168.1.133:8083'  agregamos la dirección ip de la maquina 2 y el puerto del microservicio 
    # ... resto de la configuración'
    # Enable CORS when running in GitHub Codespaces
    allowed-origin-patterns: 'https://*.githubpreview.dev'
    allowed-methods: '*'
    allowed-headers: '*'
    exposed-headers: 'Authorization,Link,X-Total-Count,X-${jhipster.clientApp.name}-alert,X-${jhipster.clientApp.name}-error,X-${jhipster.clientApp.name}-params'
    allow-credentials: true
    max-age: 1800
  security:
    authentication:
      jwt:
        # This token must be encoded using Base64 and be at least 256 bits long (you can type `openssl rand -base64 64` on your command line to generate a 512 bits one)
        base64-secret: ODFhZGFiNjZlMzRlZjU3YTI2YTQ1YWY4MjFmZTkwZGQxNWY3NmVjNDYwMTM2NGJlY2QzMjE4YTE0ZjM1MzA0ZjA2ODJhM2RhMWQ5MzcwYjEyOWU2M2M5NDg2MTE4MDBkMDJmM2ZiZjJmOTZkY2U4NDE2OWI3YTRjZjE4MDFiNWQ=  este es importante es el código de seguridad donde debe ingresar la maquina 2
        # Token is valid 24 hours
        token-validity-in-seconds: 86400
        token-validity-in-seconds-for-remember-me: 2592000
  mail: # specific JHipster mail property, for standard properties see MailProperties
    base-url: http://127.0.0.1:8080
  logging:
    use-json-format: false # By default, logs are not in Json format
    logstash: # Forward logs to logstash over a socket, used by LoggingConfiguration
      enabled: false
      host: localhost
      port: 5000
      ring-buffer-size: 512
# ===================================================================
# Application specific properties
# Add your own application properties here, see the ApplicationProperties class
# to have type-safe configuration, like in the JHipsterProperties above
#
# More documentation is available at:
# https://www.jhipster.tech/common-application-properties/
# ===================================================================

# application:


Una vez configurados este archivo podemos levantar el consul para conectar otros dispositivos  con el siguiente comando 
consul agent -dev -client=0.0.0.0 -bind=192.168.1.143  

Y en la maquina dos hacemos los mismos cambios solo que en localhost agregamos la ip de la maquina 1 (servidor principal )
Y el comando es el siguiente 
comando para microservicios (union de dos maquinas mediante un cónsul)
./mvnw -DskipTests -Djhipster.security.authentication.jwt.base64-secret=ODFhZGFiNjZlMzR
lZjU3YTI2YTQ1YWY4MjFmZTkwZGQxNWY3NmVjNDYwM
TM2NGJlY2QzMjE4YTE0ZjM1MzA0ZjA2ODJhM2RhMWQ5MzcwYjEyOWU2M2M5NDg2MT
E4MDBkMDJmM2ZiZjJmOTZkY2U4NDE2OWI3YTRjZjE4MDFiNWQ=

Agregamos el token de seguridad para que la conexión sea exitosa.
 







