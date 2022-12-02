import BaseTransformer from "./base-transformer";

export default class EvergreeenTransformer implements BaseTransformer {
    public async transform(html: string): Promise<string> {
        return html;
    }
}