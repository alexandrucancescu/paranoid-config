import Ajv, { JSONSchemaType, Schema } from 'ajv'
import cloneDeep from 'lodash.clonedeep'
import formatError from 'better-ajv-errors'

interface IOptions {
	configDir?: string
}

export type AjvSchema<T> = JSONSchemaType<T> | Schema

export default async function getConfig<T>(
	schema: AjvSchema<unknown>,
	options?: IOptions
): Promise<T> {
	const ajv = new Ajv()

	const validate = ajv.compile(schema)

	if (options?.configDir) {
		process.env.NODE_CONFIG_DIR = options.configDir
	}

	const { default: configLib } = await import('config')

	const config = { ...cloneDeep(configLib) }

	if (!validate(config))
		throw new Error(formatError(schema, config, validate.errors!))

	return <T>config
}
