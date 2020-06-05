<h1 align="center">
    <img alt="NextLevelWeek - Ecoleta" title="#NextLevelWeek - Ecoleta" src="capa.png" />
</h1>

## 🤔 Next Level Week?

[NLW](https://nextlevelweek.com/) is an intensive one week long event where we develop a whole application from scratch.

## 🤓 Project

Since the event took place during the environment week, the project was a marketplace to connect collection centers and people.

The web application is where we register collection centers, and the mobile application is how we find centers around us.

## 😍 Technologies

- [Node.js]([node_url])
- [React][react_url]
- [React Native][react_native_url]
- [TypeScript][typescript_url]
- [ExpressJS][express_url]
- [Expo][expo_url]

## 🙃 Installation

After cloning this repository, just install the packages and run each of them.

```bash
$ git clone https://github.com/cleiver/Rocketseat-NLW01-Ecoleta.git ecoleta
```

### Backend

```bash
$ cd ecoleta/api

# Install dependencies
$ yarn install

# Create database tables (sqlite3)
$ yarn knex:migrate

# Create default values
$ yarn knex:seed

# Start server
$ yarn dev
```

### Frontend

```bash
$ cd ecoleta/web

# Install dependencies
$ yarn install

# Run
$ yarn start
```

You can access through the URL [localhost:3000](localhost:3000).

### Mobile

```bash
$ cd ecoleta/mobile

# Install dependencies
$ yarn install

# Run
$ yarn start
```

A window will open, scan the qrcode using the [Expo App](https://play.google.com/store/apps/details?id=host.exp.exponent).

## 😓 Known issues
You may have trouble showing the images as the api has an IP fixed in the code. While I don't update this to be more dynamic, you can update the API code with your own local IP address.

To do it, just update the file [/src/controllers/CentersController.ts](https://github.com/cleiver/Rocketseat-NLW01-Ecoleta/blob/master/api/src/controllers/CentersController.ts), lines [61](https://github.com/cleiver/Rocketseat-NLW01-Ecoleta/blob/master/api/src/controllers/CentersController.ts#L61) and [103](https://github.com/cleiver/Rocketseat-NLW01-Ecoleta/blob/master/api/src/controllers/CentersController.ts#L103).


[node_url]: https://nodejs.org
[react_url]: https://reactjs.org
[react_native_url]: https://facebook.github.io/react-native
[typescript_url]: https://www.typescriptlang.org
[express_url]: typescript_url
[expo_url]: https://expo.io
