#Slyce Test

## Requirements

- Node 5.4.0
- NPM 2.14.15
- MySQL 5.7.10

Check if npm is installedwith: ```npm -v```

Check if Node is installedwith: ```node -v```
Install Node.js [HERE](https://nodejs.org/en/)

Check if MySQL is installed with: ```which mysql```
To install Mysql run ```brew install mysql```

## Installing Dependencies

From the command line run:
```npm install```

## Development

To start the mysql server run the following in the command line:
```mysql.server start```

Load the schema into mysql by typing the following command:
```mysql -u root < server/db/schema.sql```

Log in to mysql as root user with the following command:
```mysql -u root```

Run local server with the following command: 
```nodemon server/basic-server.js``` or ```npm start```

Local Server is connected to: http://localhost:8080/

### Basic MySQL command lines:

- To view current databases and/or make sure the schema was loaded, run:
  - ```show databases;```
- To utilize a database use the following command:
  - ```use NAME_OF_DATABASE_HERE;```
- To view the tables in a database after the previous command, use:
  - ```show tables;```

Here is a great resource for more MySQL queries:
https://gist.github.com/hofmannsven/9164408

