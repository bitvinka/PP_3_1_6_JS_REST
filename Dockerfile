FROM openjdk:11
WORKDIR  /app
EXPOSE 8080
COPY target/spring-boot_security-demo-0.0.1-SNAPSHOT.jar ./myapp.jar
CMD ["java", "-jar", "myapp.jar"]