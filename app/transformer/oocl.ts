import BaseTransformer from "./base-transformer";
const x = require('x-ray')();

export default class EvergreeenTransformer implements BaseTransformer {
    public async transform(html: string): Promise<any> {
        if(html.indexOf('No information on Container No') > -1) {
            return {
                status: 'error',
                message: 'No information on Container No'
            }
        } else {
            var data = await x(html, {
                container: 'table:nth-child(6) > tbody > tr:nth-child(3) > td:nth-child(1)',
                size: 'table:nth-child(6) > tbody > tr:nth-child(3) > td:nth-child(2)',
                date: 'table:nth-child(6) > tbody > tr:nth-child(3) > td:nth-child(3)',
                container_moves: 'table:nth-child(6) > tbody > tr:nth-child(3) > td:nth-child(4)'
            });

            // Remove HTML Tags and Whitespace in Dictionary "data"
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    data[key] = data[key].toString().replace(/(<([^>]+)>)/ig, '').trim();
                }
            }

            return {
                status: 'success',
                message: 'Container Found',
                data: data
            }
        }
    }
}