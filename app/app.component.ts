import { HTTP_PROVIDERS } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';

@Component({
    selector: 'ui-shopicruit',
    templateUrl: 'app/app.component.html',
    providers: [
        HTTP_PROVIDERS,
        ProductService,
        OrderService
    ]
})

export class AppComponent implements OnInit {

    constructor(
        private ProductService: ProductService,
        private OrderService: OrderService
    ) { }

    // General variables
    errorMessage: string;

    // Product related variables
    totalWeight: number;
    totalPrice: number;

    // Order related variables
    orders: any;

    ngOnInit() {
        this.displayProducts();
        this.displayOrders();

    }

    displayProducts() {
        this.ProductService.findProducts().then(
            products => {
                this.totalWeight = products.totalWeight;
                this.totalPrice = products.totalPrice;
            },
            error => this.errorMessage = error
        );
    }

    displayOrders() {
        this.OrderService.orderSummary().then(
            orders => {
                this.orders = orders;
            },
            error => this.errorMessage = error
        );
    }
}