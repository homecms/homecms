
# Local development guide

This guide explains how to get the repo running on your local machine so that you can start contributing to Home CMS. It also explains common tasks you'll need to complete while running the app.

## Table of Contents

  * [Setup](#setup)
    * [Requirements](#requirements)
    * [Clone and install dependencies](#clone-and-install-dependencies)
    * [Set up the databases](#set-up-the-databases)
    * [Run the app](#run-the-app)
  * [Maintenance](#maintenance)
    * [Reinstalling dependencies](#reinstalling-dependencies)
    * [Performing database migrations](#performing-database-migrations)
  * [Next steps](#next-steps)


## Setup

### Requirements

Before you can get started, you'll need to have the following software installed and ready to go:

  * [Node.js](https://nodejs.org/) v18.0.0+ (we recommend using [Volta](https://volta.sh/) for this so that you're using the exact same Node.js versions as the core contributors)

  * [PostgreSQL](https://www.postgresql.org/) v14.5

### Clone and install dependencies

[Clone the repo](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories) somewhere on your machine and `cd` into it.

You can install dependencies:

```
npm install
```

### Set up the databases

If you don't want to mess around with managing your own configuration, it's easiest if PostgreSQL is accessible on your local machine on the default port. The rest of this guide assumes this is true. It also assumes the `createdb` command is in your `$PATH`.

This command creates `homecms-dev` and `homecms-test` databases:

```
npm run create:db
```

Now that you've got the database created, you can run the migration script to set up the database schema:

```
npm run migrate
```

If you want to add some demo data to the database to avoid having to create lots of content manually, you can do so with:

```
npm run seed demo
```

### Run the app

You can run the app normally with the following command:

```
npm start
```

You can run the app with [Nodemon](https://www.npmjs.com/package/nodemon) which means that it'll auto-restart if you make changes:

```
npm run start:dev
```

By default, both of these will make the app available on [http://localhost:3000/](http://localhost:3000/).


## Maintenance

Some common maintenance tasks you may need to perform in day-to-day running of the app.

### Reinstalling dependencies

If something's not working when you pull changes from GitHub, you may need to reinstall dependencies with:

```
npm install
```

### Performing database migrations

If the database schema has changed (or needs to change) you can run database migrations on your local copy of the database with the following.

Migrate to the latest version of the database schema:

```
npm run migrate
```

Perform the next unapplied migration:

```
npm run migrate:up
```

Roll back the last applied migration:

```
npm run migrate:down
```


## Next steps

  * If you want to contribute code, [read the contributing code guide](contributing/code.md)
