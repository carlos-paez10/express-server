const express = require('express');
var cors=require('cors'); 
const stripe = require('stripe')('sk_test_51MUHU2IFcedB1lSSBeuXYQqodylAoGL2sGOAN74YEgdcJwd9XSDuY4xFsC6ZEH4JK4HVY2oZq9Y03fhy6xc0a0Cc00PFTyEO3Z');

const app=express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());


app.post('/checkout', async (req,res)=>{
   
   console.log(req.body);
   items=req.body.items;
   lineItems=[];
   items.forEach(item => {
      lineItems.push(
         {price:item.id,
         quantity:item.quantity
      }
      );

   });

   const session = await stripe.checkout.sessions.create({
      line_items:lineItems,
      mode:'payment',
      success_url:'http://localhost:3000/success',
      cancel_url:'http://localhost:3000/cancel'       
   });

   res.send(JSON.stringify({
      url:session.url

   }));

})

app.listen(9000, ()=>console.log('Listening on PORT 9000 !'));