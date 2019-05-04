import { AuthService } from './../services/auth.service';
import { ShoppingCartService } from './../services/shopping-cart.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCart } from '../models/shopping-cart';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, OnDestroy {
  shipping = {};
  cart: ShoppingCart;
  userId: string;
  cartSubscription: Subscription;
  userSubscription: Subscription;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private authService: AuthService
    ) { }

  async ngOnInit() {
    const cart$ = await this.shoppingCartService.getCart();
    this.cartSubscription = cart$.subscribe(cart => this.cart = cart);
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user.uid);
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  placeOrder() {
    const order = new Order(this.userId, this.shipping, this.cart);
    this.orderService.placeOrder(order);
  }
}
