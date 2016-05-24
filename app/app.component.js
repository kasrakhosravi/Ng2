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
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
var product_service_1 = require('./product.service');
var order_service_1 = require('./order.service');
var AppComponent = (function () {
    function AppComponent(ProductService, OrderService) {
        this.ProductService = ProductService;
        this.OrderService = OrderService;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.displayProducts();
        this.displayOrders();
    };
    AppComponent.prototype.displayProducts = function () {
        var _this = this;
        this.ProductService.findProducts().then(function (products) {
            _this.totalWeight = products.totalWeight;
            _this.totalPrice = products.totalPrice;
        }, function (error) { return _this.errorMessage = error; });
    };
    AppComponent.prototype.displayOrders = function () {
        var _this = this;
        this.OrderService.orderSummary().then(function (orders) {
            _this.orders = orders;
        }, function (error) { return _this.errorMessage = error; });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'ui-shopicruit',
            templateUrl: 'app/app.component.html',
            providers: [
                http_1.HTTP_PROVIDERS,
                product_service_1.ProductService,
                order_service_1.OrderService
            ]
        }), 
        __metadata('design:paramtypes', [product_service_1.ProductService, order_service_1.OrderService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map