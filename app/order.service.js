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
var OrderService = (function () {
    /**
     * Initialization
     */
    function OrderService(http) {
        this.http = http;
        this.ordersUrl = 'app/orders.json';
        this.taxAmount = 0;
        this.subTotal = 0;
        this.total = 0;
    }
    /**
     * Private Methods
     */
    OrderService.prototype.fetchProducts = function () {
        return this.http.get(this.ordersUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    OrderService.prototype.extractData = function (res) {
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
    OrderService.prototype.handleError = function (error) {
        var errMsg = error.message || 'Server error';
        console.error(errMsg);
        return Promise.reject(errMsg);
    };
    /**
     * Return details about order (sub total, tax and total amount)
     */
    OrderService.prototype.orderSummary = function () {
        var _this = this;
        return this.fetchProducts().then(function (orders) {
            var result = [];
            for (var i = 0; i < orders.length; i++) {
                /**
                 * Calculate order's sub total based on order's price level
                 */
                switch (orders[i]["price_level"]) {
                    case "free":
                        _this.subTotal = 0;
                        break;
                    case "discount":
                        _this.subTotal = orders[i]["price"] - (orders[i]["price"] * orders[i]["discount_percentage"] / 100);
                        break;
                    case "sale":
                        _this.subTotal = (orders[i]["price"] - orders[i]["markdown"]);
                        break;
                    default:
                        _this.subTotal = orders[i]["price"];
                }
                /**
                 * Checks if tax is applicable for this particular order;
                 * if yes, sets the tax amount
                 */
                if (orders[i]["taxes_applicable"]) {
                    _this.taxAmount = orders[i]["tax"];
                }
                else {
                    _this.taxAmount = 0;
                }
                _this.total = _this.subTotal + _this.taxAmount;
                result.push({
                    subTotal: _this.subTotal,
                    taxAmount: _this.taxAmount,
                    total: _this.total
                });
            }
            return result;
        });
    };
    OrderService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], OrderService);
    return OrderService;
}());
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map