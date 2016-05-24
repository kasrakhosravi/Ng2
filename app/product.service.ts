import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()

export class ProductService {

    /**
     * Initialization
     */
    constructor (
        private http: Http
    ) {}

    shopifyUrl = 'app/products.json';

    errorMessage: string;
    totalPrice: number = 0 ;
    totalWeight: number = 0;

    /**
     * Private Methods
     */
    private fetchProducts(): Promise<Response> {
        return this.http.get(this.shopifyUrl)
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

    private filterProductVariants(list, archetype) {
        var result = [];

        for (var i = 0; i < list.length; i++) {
            if (list[i].product_type === archetype) {
                for (var j = 0; j < list[i].variants.length; j++) {
                    result.push(list[i].variants[j]);
                }
            }
        }
        return result;
    }

    private sortProductVariantByPrice(list) {

        return list.sort(function(a, b) {
            return a.price - b.price;
        });
    }

    /**
     * Public Methods
     */
    public findProducts() {
        return this.fetchProducts().then(
                products => {
                    var computerSortedList = this.sortProductVariantByPrice(
                        this.filterProductVariants(products, 'Computer')
                        ),
                        keyboardSortedList = this.sortProductVariantByPrice(
                            this.filterProductVariants(products, 'Keyboard')
                        ),
                        iterationIndex = 0;

                    /**
                     * This conditional statement sets the iterationIndex which will be set
                     * to the length of the shortest object to make sure that when selecting
                     * computer and keyboard variants, an equal and unique number of variants
                     * will be selected and bought.
                     */

                    if (computerSortedList.length <= keyboardSortedList.length) {
                        iterationIndex = computerSortedList.length;
                    } else {
                        iterationIndex = keyboardSortedList.length;
                    }

                    for (var i = 0; i < iterationIndex; i++) {
                        this.totalPrice += parseFloat(computerSortedList[i].price) +
                                           parseFloat(keyboardSortedList[i].price);

                        this.totalWeight += parseFloat(computerSortedList[i].grams) +
                                            parseFloat(keyboardSortedList[i].grams);
                    }

                    return {
                        totalPrice: this.totalPrice,
                        totalWeight: this.totalWeight
                    };

                },
                error => this.errorMessage = <any>error
            )
    }
}