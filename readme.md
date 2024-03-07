## paranoid-config

#### Config loader with type safety and validations

### About

This package is based on [config]("https://www.npmjs.com/package/node-config"), so you should already
be familiar with it. This package is best used with typescript
and [@sinclair/typebox](https://www.npmjs.com/package/@sinclair/typebox) for schema
definition as it also provides types.

**Warning:** This package is native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and doesn't provide a CommonJS export. If your project uses CommonJS, you will have to [convert to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

### Usage
```shell
npm install --save paranoid-config @sinclair/typebox
```

In your project **config/local.json**:
```json
{
  "db": {
    "host": "localhost",
    "port": 3000,
    "credentials": {}
  }
}
```

**config.ts**

```typescript
import {Static, Type} from "@sinclair/typebox"
import getConfig from "paranoid-config";

const schema = Type.Object({
    db: Type.Object({
        host: Type.String(),
        port: Type.Number({minimum: 0}),
        credentials: Type.Object({
            user: Type.String(),
            pass: Type.String()
        })
    })
})

type ConfigType = Static<typeof schema>

export default getConfig<ConfigType>(schema);
```

`getConfig` will validate the configuration object
provided by **config** package and you can be sure
your application does not fail because of missing
required configurations.

Using typebox you also benefit from having types
extracted from your schema.

You can also add defaults and other validations 
using **typebox**
```typescript
import {Type} from "@sinclair/typebox"

Type.String({
    minLength: 3,
    default: "localhost"
})
```
