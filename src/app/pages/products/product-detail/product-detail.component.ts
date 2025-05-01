import { Component, inject, input } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/store.interfaces';
import { CartStateService } from '../../../services/cart-state.service';
import Swal from 'sweetalert2';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export default class ProductDetailComponent {
  productService = inject(ProductService);
  cartState = inject(CartStateService).state;
  id = input.required<string>();
  rate = 0;

  //aqui el detalle
  productResource = rxResource({
    request: () => ({ id: this.id() }),
    loader: ({ request }) => {
      return  this.productService.getProduct(request.id).pipe(
        tap((resp) => {
          this.rate = Math.round(resp.rating.rate);
        }),
      );
    },
  });

  createRange(number: number) {
    return new Array(number).fill(0).map((n, index) => index + 1);
  }

  addToCart(product: Product) {
    this.cartState.add({
      product,
      quantity: 1,
    });
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Producto añadido al carrito',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
