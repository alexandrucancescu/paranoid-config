import Ajv from "ajv";
import cloneDeep from "lodash.clonedeep";
function createErrorMessage(errors) {
    let message = "Config ";
    if (errors[0]?.instancePath) {
        const path = errors[0].instancePath
            .split("/")
            .filter(p => p.length > 0)
            .join(".");
        message += path + " ";
    }
    message += errors[0]?.message;
    return new Error(message);
}
export default function getConfig(schema, options) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (options?.configDir) {
        process.env.NODE_CONFIG_DIR = options.configDir;
    }
    const configLib = require("config");
    const config = cloneDeep(configLib);
    if (!validate(config)) {
        throw createErrorMessage(validate.errors);
    }
    return config;
}
