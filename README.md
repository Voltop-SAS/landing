# Katapult clean architecture scaffolding

## Requirements
- node 18.18.0
- docker
- docker compose
## Getting Started

First, install dependencies:

``` bash
npm run install
```
 to run the development server:

```bash
docker-compose up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Control version
This project uses [Commitizen](https://www.npmjs.com/package/commitizen) as commit assistant and [Husky](https://www.npmjs.com/package/husky) as pre-commit hook.

To get Commitizen configuration use:
```bash
npx commitizen init cz-emoji-conventional --save-dev --save-exact
```

To make a commit:
```bash
npn run cm
```

For convenience, you can use the **commit** bin file to add all changed files to git staging area and start Commitizen, both with a single terminal command:
```bash
. bin/commit
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.