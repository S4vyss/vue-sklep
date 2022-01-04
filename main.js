var eventBus = new Vue()

// Product
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: ` <!-- Cały produkt -->
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image">
            </div>
            <!-- Informacje na temat produktu -->
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p> <!-- Czy jest dostępne w magazynie -->
                <p v-else>Out of Stock</p>
                <p>Shipping: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details">{{ detail }}</li> <!-- Lista informacji w detalach -->
                </ul>

                <div v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor}"
                    @mouseover="updateProduct(index)"> <!-- Kolor zielony albo niebieski -->
                </div>

                <button @click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock}">Add to Cart</button> <!-- Zamawianie do koszyka -->
              
                <button @click="removeFromCart">
                    X
                </button>
            </div>
            
            <product-tabs :reviews="reviews"></product-tabs>
        
        </div>
        <!-- Cały produkt -->
`,
    data() {
        return  {
            brand: "S4vyss's",
            product: 'Socks',
            selectedVariant: 0,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);

            // | Napraw to |
        },
        updateProduct: function (index) {
            this.selectedVariant = index;
        },
        removeFromCart: function () {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        }
    },
    computed: {
        title() {
            return `${this.brand} ${this.product}`;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            }
            return `${10} PLN`;
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
    }
});
// Review
Vue.component('product-review', {
   template: `
     <form class="review-form" @submit.prevent="onSubmit">

     <p v-if="errors.length">
       <b>Proszę wypełnij wymagane pola:</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
     
     <p>
       <label for="name">Name:</label>
       <input id="name" v-model="name">
     </p>

     <p>
       <label for="review">Review:</label>
       <textarea id="review" v-model="review"></textarea>
     </p>

     <p>
       <label for="rating">Rating:</label>
       <select id="rating" v-model.number="rating">
         <option>5</option>
         <option>4</option>
         <option>3</option>
         <option>2</option>
         <option>1</option>
       </select>
     </p>

     <p>
       <input type="submit" value="Submit">
     </p>

     </form>
   `,
   data() {
       return {
           name: null,
           review: null,
           rating: null,
           errors: []
       }
   },
   methods: {
       onSubmit() {
           if (this.name && this.review && this.rating) {
               let productReview = {
                   name: this.name,
                   review: this.review,
                   rating: this.rating
               }
               eventBus.$emit('review-submitted', productReview);
               this.name = null;
               this.review = null;
               this.rating = null;
           } else {
               if(!this.name) this.errors.push("Brak podanego imienia!");
               if(!this.review) this.errors.push("Brak podanej opinii!");
               if(!this.rating) this.errors.push("Brak podanej oceny!");
           }
       }
   }
});

Vue.component('product-tabs', {
   props: {
     reviews: {
         type: Array,
         required: true
     }
   },
   template: `
     <div>
         <div>
                <span class="tab"
                      :class="{ activeTab: selectedTab === tab}"
                      v-for="(tab, index) in tabs" :key="index"
                      @click="selectedTab = tab">
                      {{ tab }}
                </span>
         </div>
    
         <div v-show="selectedTab === 'Reviews'">
           <p v-if="!reviews.length">There are no reviews yet.</p>
           <ul v-else>
             <li v-for="(review, index) in reviews" :key="index">
               <p>{{ review.name }}</p>
               <p>Rating: {{ review.rating }}</p>
               <p>{{ review.review }}</p>
             </li>
           </ul>
         </div>
    
         <!-- Opinie  -->
         <product-review v-show="selectedTab === 'Make a Review'" 
                         ></product-review>
     </div>
   `,
    data() {
       return {
           tabs: ['Reviews', 'Make a Review'],
           selectedTab: 'Reviews'
       }
    }
});

// app
var app = new Vue({
   el: '#app',
   data: {
       premium: false,
       cart: []
   },
   methods: {
       updateCart(id) {
           this.cart.push(id);
       },
       removeCart() {
           this.cart <= 0 ? this.cart = [] : this.cart.pop();
       }
   }
});