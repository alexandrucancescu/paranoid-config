import { JSONSchemaType, Schema } from "ajv";
interface IOptions {
    configDir?: string;
}
export declare type AjvSchema<T> = JSONSchemaType<T> | Schema;
export default function getConfig<T>(schema: AjvSchema<unknown>, options?: IOptions): T;
export {};
