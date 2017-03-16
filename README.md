# shopping-cart
1.	run npm install 
2.	run node ./seed/product-seeder to add product information into database
3.	run npm start to start the server
4.	The home page localhost:3000 will list all the products stored in the database
5.	Click User Management->sign up to create a admin account. Use admin@gmail.com as signup email. Use other email account to sign up as  a customer.
6.	Search tool could search the product based on the name or label.
7.	You could click the name to enter the detail page for the product. And Click the label below the product name you will enter the page which will show all the product having the same label.
8.	Click Add To Wishlist to add a product into the wishlist
9.	Click Add To Cart to add a product into the cart and redirect you to your cart. 
10.	The wishlist button in the menu will show the number of products in the wishlist. And click it will lead you to your wishlist page. In that page you could edit your wishlist.
11.	The Shopping Cart button in the menu will show the number of products in your cart. And click it will lead you to cart page. In that page you could edit your cart and then check out.
12.	In the check out page, you could enter you payment information to finish the payment. We use Stripe to manage all the payments received. In order to test, use 4242 4242 4242 4242 as a test credit card.
13.	After finishing payment, you will see you order in user profile page. If you have already signed in, you can go to the profile page by clicking user account button under User Account. Otherwise, you need to sign in first.
14.	If you signed in as admin@gmail.com, you could access to the page /product/post. In that page you could enter product information to post a new product to website. If you post a product successfully, it will lead you to the product detail page. 
