
CREATE DATABASE qa;

USE qa;

CREATE TABLE sessions (
  id int NOT NULL AUTO_INCREMENT,
  host_name varchar(20) NOT NULL,
  start_time varchar(40) NOT NULL,
  end_time varchar(40) NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE questions (
  id int NOT NULL AUTO_INCREMENT,
  asked_by_name  varchar(40)   NOT NULL,
  text varchar(200) NOT NULL,
  answered varchar(10) NOT NULL,
  sessionId int NOT NULL
  PRIMARY KEY (ID)
);

CREATE TABLE answer (
  id int NOT NULL AUTO_INCREMENT,
  answered_by_name  varchar(40)   NOT NULL,
  text  varchar(300)   NOT NULL,
  image  varchar(200)   NOT NULL,
  PRIMARY KEY (ID)
);

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/db/schema.sql
 *  to create the database and the tables.*/
