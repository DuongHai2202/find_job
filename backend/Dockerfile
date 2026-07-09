FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml ./
RUN mvn -q -B -DskipTests dependency:go-offline

COPY src/ src/
RUN mvn -q -B -DskipTests package

FROM eclipse-temurin:21-jre
ARG APP_HOME=/app
WORKDIR ${APP_HOME}

RUN groupadd --system spring && useradd --system --gid spring --create-home --home-dir ${APP_HOME} spring

COPY --from=build /app/target/*.jar app.jar

RUN chown -R spring:spring ${APP_HOME}

USER spring

EXPOSE 8080

ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -jar /app/app.jar"]
