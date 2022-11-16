
# Code contribution guide

To contribute to this project's code, follow the [local development guide](local-development.md) first to get set up. If you're doing any large feature work, please make sure to have a discussion in an issue first – I'd rather not waste your time if it's not a feature I want to add to this project 🙂

I don't offer any guarantees on how long it will take me to review a PR or respond to an issue, [as outlined here](../contributing.md#what-you-can-expect-from-me).


## Table of Contents

  * [Branching](#branching)
  * [Committing](#committing)
  * [Linting](#linting)
  * [TypeScript](#typescript)
  * [Unit tests](#unit-tests)
  * [End-to-end tests](#end-to-end-tests)


## Branching

New work should happen on branches. Unless you're a core contributor you won't have write access to the repo so you'll need to [fork it first](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks).


## Committing

Commit messages must be written using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). This is how our [release system](https://github.com/googleapis/release-please#readme) knows what a given commit means.

```
<type>: <description>

[body]
```

The `type` can be any of `feat`, `fix`, `docs` or `chore`.

The prefix is used to calculate the [Semantic Versioning](https://semver.org/) release:

| **type**  | when to use                                            | release level |
| --------- | ------------------------------------------------------ | ------------- |
| feat      | a feature has been added                               | `minor`       |
| fix       | a bug has been patched                                 | `patch`       |
| docs      | a change to documentation                              | `patch`       |
| chore     | repo maintenance and support tasks                     | none          |

Indicate a breaking change by placing an `!` between the type name and the colon, e.g.

```
feat!: add a breaking feature
```

We use [commitlint](https://commitlint.js.org/) to enforce these commit messages.


## Linting

This project is linted using [ESLint](https://eslint.org/), configured in the way I normally write JavaScript. Please keep to the existing style.

ESLint errors will fail the build on any PRs. Most editors have an ESLint plugin which will pick up errors, but you can also run the linter manually with the following command:

```
npm run verify:eslint
```

## TypeScript

Although this project is written in JavaScript, it is checked with [TypeScript](https://www.typescriptlang.org/) to ensure type-safety. We also document all types with JSDoc so you should get type hints if your editor supports these.

Type errors will fail the build on any PRs. Most editors have a TypeScript plugin which will pick up errors, but you can also check types manually with the following command:

```
npm run verify:types
```


## Unit tests

This project has unit tests with good coverage, and failing unit tests will fail the build on any PRs. If you add or remove features, please update the existing tests to match.

You can run tests manually with the following command:

```
npm run test:unit
```

To test the coverage as well as running tests, run:

```
npm run test:coverage
```


## End-to-end tests

This project has end to end tests which use [Playwright](https://playwright.dev/), and these tests can fail the build on PRs. If you add or remove features, please update the tests to match.

You can run end-to-end tests manually with the following command:

```
npm run test:end-to-end
```

If you need to run Playwright in debug mode, you can do so with:

```
npm run test:end-to-end -- --debug
```

