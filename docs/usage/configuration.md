
# Configuration guide

This guide explains how to configure Home CMS to work best for you.


## Table of Contents

  * [Where configurations live](#where-configurations-live)
  * [File format](#file-format)
  * [`config.baseURL`](#configbaseurl)
  * [`config.environment`](#configenvironment)
  * [`config.databaseURL`](#configdatabaseurl)
  * [`config.logLevel`](#configloglevel)
  * [`config.port`](#configport)
  * [`config.theme`](#configtheme)
    * [Published themes](#published-themes)
    * [Local themes](#local-themes)


## Where configurations live

Home CMS is configured with a mix of [environment variables](https://en.wikipedia.org/wiki/Environment_variable) and a file in the root of the repo with one of the following names (in order of preference):

```
homecms.config.js
homecms.config.json
homecms.js
homecms.json
```

The default configurations for Home CMS aim to work in the majority of use cases, and so hopefully you shouldn't need to make too many changes.

The rest of this guide assumes you're using JavaScript for configuration.


## File format

The configurations must be exported as an object. You can get some nice type hints in your code editor:

```js
/**
 * @type {import('homecms').Config}
 */
module.exports = {
    // Configurations go here
};
```


## `config.baseURL`

`String`. The base URL where requests will go to, used to provide absolute URLs in the application.

This defaults to `http://localhost:<port>/` where `<port>` is the value of the [`port` configuration](#configport).


## `config.environment`

`String`. The environment the app is running in, one of `"production"`, `"development"`, or `"ci"`. Production mode should always be used in production environments, and development mode makes it easier to work on your website locally if you need to make any code changes.

This defaults to the value of the `NODE_ENV` environment variable, or `"development"` if it's not set.


## `config.databaseURL`

`String`. The [PostgreSQL connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING) the app should use to connect to the database.

This defaults to the value of the `DATABASE_URL` environment variable, or `"postgresql://localhost/homecms"` if it's not set.


## `config.logLevel`

`String`. The maximum log level to output when the app is running. Less critical log levels than the chose one will not be output. Must be one of:

  * `"debug"` - output all logs
  * `"info"` - output all logs except debug level
  * `"warn"` - output all logs except info and debug level
  * `"error"` - output only error and fatal level logs
  * `"fatal"` - output only fatal level logs

This defaults to the value of the `LOG_LEVEL` environment variable, or `"info"` if it's not set.


## `config.port`

`Number`. The HTTP port the application should run on.

This defaults to the value of the `PORT` environment variable, or `3000` if it's not set.


## `config.theme`

`String`. The theme to use to change the presentation of the website. Themes are [npm](https://www.npmjs.com/) packages, and can either be a published package or a local folder.

Either way, a theme must have a valid `package.json` file with an `engines.homecms` entry set to a string. This must be a [semver](https://semver.org/) range describing which versions of Home CMS the theme is compatible with.

The theme defaults to `@homecms/limelight`.

### Published themes

If a theme you want to use is published to npm, you can install it locally with:

```
npm install <theme>
```

Then you can use it on your site by setting the `theme` option to the name of the package, e.g.

```js
module.exports = {
    theme: '@homecms/limelight'
};
```

### Local themes

You can also have your own theme set up in a local folder alongside your configuration. To do this, you need to provide an absolute path to the folder, e.g.

```js
module.exports = {
    theme: `${__dirname}/theme`
};
```
