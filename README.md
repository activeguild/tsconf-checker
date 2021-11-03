<h1 align="center">tsconf-checker ⚡ Welcome 😀</h1>

<p align="left">
  <a href="https://github.com/actions/setup-node"><img alt="GitHub Actions status" src="https://github.com/activeguild/classnames-generics/workflows/automatic%20release/badge.svg" style="max-width:100%;"></a>
</p>

# tsconf-checker

Validate the tsconfig.json file used in the typescript file and display a warning.
Supports TypeScript version 4.4.x.

## Install

```bash
npm i -D tsconf-checker
```

## Usage

For example, if the following tsconfig.json file exists.

```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "commonjs",
        "baseUrl": "./src",
        "resolveJsonModule": true,
        "outDir": "./dist",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "strictFunctionTypes": true,
        "skipLibCheck": true
    }
}
```

```bash
npx tsconf-checker index.ts
```

A warning is displayed as shown below.

```bash
Warning: strictFunctionTypes is implicitly true because 'strict' option is true.
Warning: 'skipLibCheck' option is officially recommended to be false.
Warning: 'esModuleInterop' option is officially recommended to be false.
Warning: 'forceConsistentCasingInFileNames' option is officially recommended to be false.
```

## Principles of conduct

Please see [the principles of conduct](https://github.com/activeguild/tsconf-checker/blob/master/.github/CONTRIBUTING.md) when building a site.

## License

This library is licensed under the [MIT license](https://github.com/activeguild/tsconf-checker/blob/master/LICENSE).
