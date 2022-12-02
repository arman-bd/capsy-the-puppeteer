
export default interface BaseTransformer {
    transform(html: string): Promise<string>;
}