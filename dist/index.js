import Ajv from 'ajv';
import cloneDeep from 'lodash.clonedeep';
function throwError(errors) {
    let message = 'Config ';
    if (errors[0]?.instancePath) {
        const path = errors[0].instancePath
            .split('/')
            .filter((p) => p.length > 0)
            .join('.');
        message += `'${path}' `;
    }
    message += errors[0]?.message;
    throw new Error(message);
}
export default async function getConfig(schema, options) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (options?.configDir) {
        process.env.NODE_CONFIG_DIR = options.configDir;
    }
    const { default: configLib } = await import('config');
    const config = cloneDeep(configLib);
    if (!validate(config)) {
        throwError(validate.errors);
    }
    return config;
}
