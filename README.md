# buget_test

Create mysql: 
```bash
$ docker-compose up
```
  Install dependencies:

```bash
$ npm install
```

  Start the server:

```bash
$ npm start
```

# Create Account

**URL** : `/addAccount/`

**Method** : `POST`

**Formdata**

Provide name of accouhnt and value to be created.
Examle:
```json
name:John
value:350
```
# Get Account from id

**URL** : `/getAccount/:id`

**Method** : `GET`

# Create Transaction

**URL** : `/addAccount/`

**Method** : `POST`

**Formdata**

Change account value
Examle:
```json
account_id:1
value:350
```
