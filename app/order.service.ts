import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()

export class OrderService {

    /**
     * Initialization
     */
    constructor (
        private http: Http
    ) { }

    ordersUrl = 'app/orders.json';

    errorMessage: string;
    taxAmount: number = 0;
    subTotal: number = 0;
    total: number = 0;

    /**
     * Private Methods
     */
    private fetchProducts(): Promise<Response> {
        return this.http.get(this.ordersUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();

        if (body.data) {
            return body.data;
        }
        else {
            return { };
        }
    }

    private handleError (error: any) {
        let errMsg = error.message || 'Server error';
        console.error(errMsg);
        return Promise.reject(errMsg);
    }

    /**
     * Return details about order (sub total, tax and total amount)
     */
    public orderSummary() {
        return this.fetchProducts().then(
            orders => {
                var result = [];

                for (var i = 0; i < orders.length; i++) {

                    /**
                     * Calculate order's sub total based on order's price level
                     */
                    switch(orders[i]["price_level"]) {
                        case "free":
                            this.subTotal = 0;
                            break;
                        case "discount":
                            this.subTotal =  orders[i]["price"] - (
                                orders[i]["price"] * orders[i]["discount_percentage"]/100
                            );
                            break;
                        case "sale":
                            this.subTotal =  (orders[i]["price"] - orders[i]["markdown"]);
                            break;
                        default:
                            this.subTotal = orders[i]["price"];
                    }

                    /**
                     * Checks if tax is applicable for this particular order;
                     * if yes, sets the tax amount
                     */
                    if (orders[i]["taxes_applicable"]) {
                        this.taxAmount = orders[i]["tax"];
                    } else {
                        this.taxAmount = 0;
                    }

                    this.total = this.subTotal + this.taxAmount;

                    result.push({
                        subTotal: this.subTotal,
                        taxAmount: this.taxAmount,
                        total: this.total
                    });
                }
                return result;

            }
        )
    }
}