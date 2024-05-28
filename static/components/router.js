import products from './products.js';
import cart from './cart.js';
import account from './account.js';
import orders from './orders.js';
import search from './search.js';
import adminDashboard from './adminDashboard.js';
import sellerDashboard from './sellerDashboard.js';
import login from './login.js';
import signup from './signup.js';

const routes = [
{
    path: '/',
    component: products,
    name: 'Home',
},
{
    path: '/login',
    component: login,
    name: 'Login',
},
{
    path: '/signup',
    component: signup,
    name: 'Signup',
},
{
    path: '/search',
    component: search,
    name: 'Search',
}, 
{
    path: '/cart',
    component: cart,
    name: 'Cart',
},
{
    path: '/account',
    component: account,
    name: 'Account',
},
{
    path: '/orders',
    component: orders,
    name: 'Orders',
},
{
    path: '/admindashboard',
    component: adminDashboard,
    name: 'AdminDashboard',
},
{
    path: '/sellerdashboard',
    component: sellerDashboard,
    name: 'SellerDashboard',
}];

export default new VueRouter({
    routes
})