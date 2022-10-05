## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

In addition, the deployment can be found [here](https://opn-th-front-end-challenges-s-nuttapong.vercel.app/cards/1)

Done:
- [x] basic CRUD functionality
- [x] SEO
- [x] Re-render optimization
- [x] FCP, LCP optimization; 
- [x] code documentation

To do:
- [] infinite scroll to optimize image render, might need to check with design team  
- [] unit testings
- [] redefine the users journey, and see if how "real time" we need the market to be, in case of fully live market, the web socket would be very viable solution, but might need to check with BE if it's possible
- [] check the business insight on card stock / inventory, whether it would be a good idea to expose those data to users, as it could potentially cause out of sync data on client and server, and add extra effort on FE to maintain users cart data on client until users actually complete the payment.  
- [] once the business insight is clear, we may re-assess the rendering pattern, to see what would be the best option, atm we are using ISR but never revalidate, so technically it's ISG
