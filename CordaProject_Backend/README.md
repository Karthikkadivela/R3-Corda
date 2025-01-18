# Backend Source Code of R3CORDA-AIF
This module contains the source code of R3CORDA-AIF UI 

## Setup 
Step 1 : Clone the repo in to your local system
```
https://github.com/GD-MSRIT/R3Corda-AIF.git
```

Step 2 : Go to `CordaProject_Backend` folder
```
cd CordaProject_Backend
```

Step 3 : Install the dependencies
```
npm install
```

Step 4 : Run the React server
```
npm start
```
<b>Note : The server will be listening to port 5000 by default</b><br>
<b>An .env file should be created before running the server</b>

```
seed_phrase=
alchemy_url=

DATABASE_HOST = 
DATABASE_USER = 
DATABASE_PASSWORD = 
DATABASE_DB_NAME =

COMPANY_NODE1 = 
COMPANY_NODE2 = 
TRUSTEE_NODE = 
INVESTOR_NODE1 = 
INVESTOR_NODE2 =
INVESTOR_NODE3 = 
```