"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var ProductService = (function () {
    /**
     * Initialization
     */
    function ProductService(http) {
        this.http = http;
        this.shopifyUrl = 'app/products.json';
        this.totalPrice = 0;
        this.totalWeight = 0;
    }
    /**
     * Private Methods
     */
    ProductService.prototype.fetchProducts = function () {
        return this.http.get(this.shopifyUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ProductService.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        if (body.data) {
            return body.data;
        }
        else {
            return {};
        }
    };
    ProductService.prototype.handleError = function (error) {
        var errMsg = error.message || 'Server error';
        console.error(errMsg);
        return Promise.reject(errMsg);
    };
    ProductService.prototype.filterProductVariants = function (list, archetype) {
        var result = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].product_type === archetype) {
                for (var j = 0; j < list[i].variants.length; j++) {
                    result.push(list[i].variants[j]);
                }
            }
        }
        return result;
    };
    ProductService.prototype.sortProductVariantByPrice = function (list) {
        return list.sort(function (a, b) {
            return a.price - b.price;
        });
    };
    /**
     * Public Methods
     */
    ProductService.prototype.findProducts = function () {
        var _this = this;
        return this.fetchProducts().then(function (products) {
            var computerSortedList = _this.sortProductVariantByPrice(_this.filterProductVariants(products, 'Computer')), keyboardSortedList = _this.sortProductVariantByPrice(_this.filterProductVariants(products, 'Keyboard')), iterationIndex = 0;
            /**
             * This conditional statement sets the iterationIndex which will be set
             * to the length of the shortest object to make sure that when selecting
             * computer and keyboard variants, an equal and unique number of variants
             * will be selected and bought.
             */
            if (computerSortedList.length <= keyboardSortedList.length) {
                iterationIndex = computerSortedList.length;
            }
            else {
                iterationIndex = keyboardSortedList.length;
            }
            for (var i = 0; i < iterationIndex; i++) {
                _this.totalPrice += parseFloat(computerSortedList[i].price) +
                    parseFloat(keyboardSortedList[i].price);
                _this.totalWeight += parseFloat(computerSortedList[i].grams) +
                    parseFloat(keyboardSortedList[i].grams);
            }
            return {
                totalPrice: _this.totalPrice,
                totalWeight: _this.totalWeight
            };
        }, function (error) { return _this.errorMessage = error; });
    };
    ProductService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ProductService);
    return ProductService;
}());
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map