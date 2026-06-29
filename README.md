Proyecto Farmacia: Sistema de Gestión y Control de Narcóticos
Este documento contiene la guía completa de instalación, configuración de entorno y arquitectura de microservicios. El sistema utiliza una arquitectura distribuida basada en JHipster, Spring Boot, Consul y PostgreSQL.
1. Requisitos e Instalación del Entorno
Para garantizar la mayor compatibilidad con las herramientas y scripts de despliegue, se recomienda utilizar Ubuntu 22.04 LTS como sistema operativo principal, ya que la mayoría de los manuales de referencia y entornos de desarrollo están optimizados para plataformas Linux.
Actualización Inicial del Sistema
Antes de comenzar con las instalaciones, asegúrese de tener el índice de paquetes y el sistema completamente actualizados:
sudo apt update && sudo apt upgrade -y

1.1 Java JDK 17
Instalación del entorno de ejecución y desarrollo de Java indispensable para Spring Boot y JHipster:
sudo apt install openjdk-17-jdk -y

Verifique la instalación correcta de la herramienta:
java -version

Configuración de JAVA_HOME:
Para evitar conflictos de versiones y asegurar que la versión 17 permanezca como principal al compilar el proyecto, configure la variable de entorno en su archivo .bashrc:
nano ~/.bashrc

Agregue las siguientes líneas al final del archivo:
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

Guarde los cambios (Ctrl + O, Enter) y salga del editor (Ctrl + X). Posteriormente, aplique los cambios en la sesión activa de la terminal y verifique la variable:
source ~/.bashrc
echo $JAVA_HOME

1.2 Node Version Manager (NVM) & Node.js
Instale las dependencias de compilación requeridas y el gestor de versiones de Node de forma segura:
sudo apt update
sudo apt install curl build-essential -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

Recargue la configuración del entorno para habilitar el comando nvm:
source ~/.bashrc
nvm --version

Proceda con la instalación y configuración de Node v22 de manera predeterminada:
nvm install 22
nvm use 22
nvm alias default 22

Verifique que Node y npm se ejecuten con las versiones deseadas:
node -v
npm -v

1.3 Docker Engine
Instale los paquetes necesarios para la comunicación segura sobre repositorios HTTPS:
sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release -y

Agregue la clave criptográfica oficial GPG del repositorio oficial de Docker:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

Incorpore el repositorio estable de Docker según la arquitectura del procesador:
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

Proceda con la actualización de repositorios e instalación de los componentes del motor de Docker:
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y

Verifique el correcto funcionamiento del motor de contenedores ejecutando la imagen de prueba e inicie el servicio de forma persistente:
sudo docker run hello-world
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl status docker

1.4 Git
Instale la herramienta de control de versiones Git y configure su identidad global para los commits en repositorios de GitHub/GitLab:
sudo apt install git -y
git --version
git config --global user.name "Tu Nombre"
git config --global user.email "correo@example.com"

1.5 PostgreSQL & pgAdmin4
Instalación del gestor de bases de datos relacionales PostgreSQL junto con sus utilidades adicionales:
sudo apt update && sudo apt upgrade -y
sudo apt install postgresql postgresql-contrib -y
sudo systemctl status postgresql
sudo systemctl start postgresql
sudo systemctl enable postgresql

Configuración de Usuario y Permisos Administrativos:
Acceda al prompt interactivo de la base de datos bajo el usuario root del sistema de archivos:
sudo -i -u postgres psql

Ejecute las siguientes sentencias SQL dentro del prompt interactivo de psql (ajuste el nombre de la base de datos según sus necesidades específicas):
CREATE USER xavier WITH ENCRYPTED PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE miproyecto TO xavier;
\q

Instalación del entorno gráfico pgAdmin 4 para la administración visual de bases de datos:
curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | \
sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg
echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" | \
sudo tee /etc/apt/sources.list.d/pgadmin4.list
sudo apt update
sudo apt install pgadmin4-desktop -y

1.6 JHipster
Instale de manera global el generador de aplicaciones empresariales JHipster:
npm install -g generator-jhipster
jhipster --version

2. Creación y Configuración del Proyecto
2.1 Generación del Gateway
El Gateway actuará como la entrada perimetral principal y el balanceador de carga del ecosistema de microservicios:
mkdir proyecto
cd proyecto
jhipster

Nota importante: Responda a la encuesta interactiva seleccionando la arquitectura basada en microservicios y defina este módulo específico como el Gateway de la aplicación.
Ajuste del Archivo consul.yml
Ruta de referencia: /src/main/docker/consul.yml
Establezca de manera explícita el uso estricto de la versión de Consul 1.22 para asegurar compatibilidad absoluta con los cargadores de configuración:
name: gateway
services:
  consul:
    image: docker.io/hashicorp/consul:1.22
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

Ajuste del Archivo bootstrap.yml
Ruta de referencia: /src/main/resources/config/bootstrap.yml
spring:
  application:
    name: gateway
  cloud:
    consul:
      config:
        fail-fast: false
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

2.2 Generación de un Microservicio Independiente
Salga del directorio del Gateway y proceda a crear la estructura dedicada a la lógica de negocio aislada:
cd ..
mkdir microservicio
cd microservicio
jhipster

Selección en la encuesta interactiva: Al responder a la pregunta 'Which client framework do you want to use?', elija estrictamente 'No client', ya que las vistas del lado de cliente serán servidas centralizadamente por el Gateway.
Importación de Entidades vía JDL
Una vez completada la estructura base del microservicio, implemente las entidades de negocio utilizando los modelos declarados previamente:
jhipster import-jdl microservicio

Vinculación de Entidades en el Gateway:
1. Acceda de nuevo al directorio de su Gateway.
2. Ejecute el comando jhipster entity <NombreEntidad>.
3. Al solicitar la ubicación del microservicio, proporcione la ruta absoluta del proyecto. Puede obtener esta ruta ejecutando el comando pwd desde el directorio del microservicio.
3. Conexión y Consumo de APIs en Red Local (Multi-Máquina)
Para entablar comunicaciones e interconexiones de APIs entre dos computadoras independientes dentro de un ecosistema distribuido, verifique que ambos dispositivos coexistan en el mismo segmento de red física o inalámbrica compartiendo el prefijo clásico 192.168.*.*.
Comandos de diagnóstico IP por plataforma:
•	Linux: ip a
•	macOS: ifconfig
•	Windows: ipconfig
3.1 Configuración de la Máquina 1 (Servidor Principal / Gateway)
Modifique el archivo application-dev.yml ubicado en la configuración de desarrollo para inyectar las direcciones de red reales en reemplazo del localhost predeterminado:
logging:
  level:
    ROOT: DEBUG
    tech.jhipster: DEBUG
    org.hibernate.SQL: DEBUG

management:
  zipkin:
    tracing:
      endpoint: http://localhost:9411/api/v2/spans
  tracing:
    sampling:
      probability: 1.0

spring:
  devtools:
    restart:
      enabled: true
      additional-exclude: static/**
    livereload:
      enabled: false
  jackson:
    serialization:
      indent-output: true
  cloud:
    consul:
      config:
        fail-fast: false
        format: yaml
        profile-separator: '-'
      discovery:
        prefer-ip-address: true 
        instance-ip-address: 192.168.1.143 # Dirección IP de la máquina local
        service-name: gateway
        tags:
          - profile=${spring.profiles.active}
          - version='@project.version@'
          - git-version=${git.commit.id.describe:}
          - git-commit=${git.commit.id.abbrev:}
          - git-branch=${git.branch:}
      host: 192.168.1.143 # Dirección IP expuesta del agente de Consul
      port: 8500
  liquibase:
    contexts: dev, faker
    url: jdbc:postgresql://localhost:5432/gateway
  mail:
    host: localhost
    port: 25
    username: postgres
    password: 123
  messages:
    cache-duration: PT1S
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/gateway
    username: postgres
    password: 123
  thymeleaf:
    cache: false

server:
  port: 8080
  forward-headers-strategy: native

jhipster:
  gateway:
    rate-limiting:
      enabled: false
      limit: 100000
      duration-in-seconds: 3600
  cors:
    # Inclusión explícita de los puertos y orígenes cruzados de la Máquina 2
    allowed-origins: 'http://localhost:8100,https://localhost:8100,http://localhost:9000,https://localhost:9000,http://localhost:9060,https://localhost:9060,http://192.168.1.143:8080,http://192.168.1.133:8082,http://192.168.1.133:8083'
    allowed-origin-patterns: 'https://*.githubpreview.dev'
    allowed-methods: '*'
    allowed-headers: '*'
    exposed-headers: 'Authorization,Link,X-Total-Count,X-${jhipster.clientApp.name}-alert,X-${jhipster.clientApp.name}-error,X-${jhipster.clientApp.name}-params'
    allow-credentials: true
    max-age: 1800
  security:
    authentication:
      jwt:
        # Secreto crítico compartido. Requerido idéntico en nodos externos para validar firmas de tokens
        base64-secret: ODFhZGFiNjZlMzRlZjU3YTI2YTQ1YWY4MjFmZTkwZGQxNWY3NmVjNDYwMTM2NGJlY2QzMjE4YTE0ZjM1MzA0ZjA2ODJhM2RhMWQ5MzcwYjEyOWU2M2M5NDg2MTE4MDBkMDJmM2ZiZjJmOTZkY2U4NDE2OWI3YTRjZjE4MDFiNWQ=
        token-validity-in-seconds: 86400
        token-validity-in-seconds-for-remember-me: 2592000
  mail:
    base-url: http://127.0.0.1:8080
  logging:
    use-json-format: false
    logstash:
      enabled: false
      host: localhost
      port: 5000
      ring-buffer-size: 512

Inicio Federado de Consul:
Ejecute el agente en red permitiendo el enlace de clientes distribuidos vinculándolo a la interfaz física de la máquina principal:
consul agent -dev -client=0.0.0.0 -bind=192.168.1.143

3.2 Configuración de la Máquina 2 (Nodo de Microservicio)
En la segunda máquina replicará los mismos cambios en el archivo de entorno, sustituyendo los campos de host 'localhost' por la dirección IP física asignada a la Máquina 1 (Servidor Central).
Arranque e inyección de Token de Seguridad:
Para que la federación de microservicios e intercambio de peticiones sea exitosa, inicie el ciclo de ejecución Maven inyectando explícitamente el mismo secreto base64 criptográfico:
./mvnw -DskipTests -Djhipster.security.authentication.jwt.base64-secret=ODFhZGFiNjZlMzRlZjU3YTI2YTQ1YWY4MjFmZTkwZGQxNWY3NmVjNDYwMTM2NGJlY2QzMjE4YTE0ZjM1MzA0ZjA2ODJhM2RhMWQ5MzcwYjEyOWU2M2M5NDg2MTE4MDBkMDJmM2ZiZjJmOTZkY2U4NDE2OWI3YTRjZjE4MDFiNWQ=

