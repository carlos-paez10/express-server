const express = require('express');
var cors=require('cors'); 
const stripe = require('stripe')('sk_test_51MUHU2IFcedB1lSSBeuXYQqodylAoGL2sGOAN74YEgdcJwd9XSDuY4xFsC6ZEH4JK4HVY2oZq9Y03fhy6xc0a0Cc00PFTyEO3Z');


const app=express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// create a new endpoint for applying discount codes
app.post('/apply-coupon', async (req, res) => {
  try {
    const { couponCode } = req.body;
    const coupon = await stripe.coupons.retrieve(couponCode);
    res.json({ success: true, coupon });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

 app.post('/checkout', async (req,res)=>{
   
   if (!req.body.items) {
    res.json({ success: false, error: 'No items found in request body' });
    return;
  }
   console.log('This is the req.body');
   console.log(req.body);
   let items=req.body.items;
    console.log(req.body.items);
   
   let couponCode = req.body.couponCode;
   let coupon;
   if (couponCode) {
    try {
      // Retrieve the coupon from Stripe
      coupon = await stripe.coupons.retrieve(couponCode);
    } catch (error) {
      res.json({ success: false, error: error.message });
      return;
    }
  }
   
   
   let lineItems=[];
   items.forEach(item => {
      lineItems.push(
         {price:item.id,
         quantity:item.quantity
      }
      );

   });
   
   
   let paymentIntentData = {};
   console.log('COUPON CODE FROM FRONTEND FETCH BODY  '+couponCode);

   

  
  let sessionParams = {
         line_items: lineItems,
         mode: 'payment',
         success_url: 'https://escape-store-col.netlify.app/success',
         cancel_url: 'https://escape-store-col.netlify.app/cancel',
         discounts: coupon ? [{ coupon: coupon.id }] : []

      };
  

   const session = await stripe.checkout.sessions.create(sessionParams);
   res.send(JSON.stringify({
      url:session.url
   }));


})
const PORT = process.env.PORT; // specify port number here
app.listen(PORT, ()=>console.log(`Listening on PORT ${PORT}`));