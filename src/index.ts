import Ajv, {ErrorObject, JSONSchemaType, Schema} from "ajv"

const cloneDeep = require("lodash.clonedeep");

interface IOptions {
    configDir?: string
}

export type AjvSchema<T> = JSONSchemaType<T> | Schema;

function createErrorMessage(errors: ErrorObject[]) {
    let message = "Config ";
    if(errors[0]?.instancePath) {
        const path = errors[0].instancePath
            .split("/")
            .filter(p => p.length > 0)
            .join(".");
        message += path + " ";
    }
    message += errors[0]?.message;

    return new Error(message);
}

export default function getConfig<T>(schema: AjvSchema<unknown>, options?: IOptions): T {
    const ajv = new Ajv();

    const validate = ajv.compile(schema);

    if(options?.configDir) {
        process.env.NODE_CONFIG_DIR = options.configDir;
    }

    const configLib = require("config");

    const config = cloneDeep(configLib);

    if(!validate(config)) {
        throw createErrorMessage(validate.errors!);
    }

    return <T>config;
}