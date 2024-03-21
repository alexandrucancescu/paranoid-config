import Ajv from 'ajv';
import cloneDeep from 'lodash.clonedeep';
import formatError from 'better-ajv-errors';
export default async function getConfig(schema, options) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (options?.configDir) {
        process.env.NODE_CONFIG_DIR = options.configDir;
    }
    const { default: configLib } = await import('config');
    const config = cloneDeep(configLib);
    if (!validate(config))
        throw new Error(formatError(schema, config, validate.errors));
    return config;
}
