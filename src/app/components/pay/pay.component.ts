import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { MessageService } from 'src/app/services/services/message.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css'],
})
export class PayComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initConfig();
  }
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId:
        'AZqWEA_v1-6SYBuDRv5JXtkD9BuQEvb6rzBxIoy8lcbcwn1jEImDDmShYF8OWPx6ijvcEP7acnFAntsb',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: '9.99',
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: '9.99',
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'EUR',
                    value: '9.99',
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );

        let message = 'The trip is payed';
        alert(message);
        this.router.navigateByUrl('/applicatons');
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.messageService.notifyMessage(
          'alert alert-danger',
          'The payment was cancelled '
        );
      },
      onError: (err) => {
        console.log('OnError', err);
        this.messageService.notifyMessage(
          'alert alert-danger',
          'Something went wrong with your paymennt '
        );
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        this.messageService.notifyMessage(
          'alert alert-info',
          'Waiting for paypal.. '
        );
      },
    };
  }
}
