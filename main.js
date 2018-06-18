   //Create a new component for product-details with a prop of details. 

Vue.component('product-details', {
    props: {
      details: {
        type: Array,
        required: true
      }
    },
    template: `
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
    `
  })
  
  
  
  Vue.component('product', {
    props: {
      premium: {
        type: Boolean,
        required: true
      }
    },
    template: `
     <div class="product">
          
        <div class="product-image">
          <img :src="image" />
        </div>
  
        <div class="product-info">
            <h1>{{ product }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>
            <p>Shipping: {{ shipping }}</p>
  
            <product-details :details="details"></product-details>
  
            <div class="color-box"
                 v-for="(variant, index) in variants" 
                 :key="variant.variantId"
                 :style="{ backgroundColor: variant.variantColor }"
                 @mouseover="updateProduct(index)"
                 >
            </div> 
  
            <button v-on:click="addToCart" 
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
              >
            Add to cart
            </button>

            <product-tabs :reviews="reviews"></product-tabs>

         </div>  
      
      </div>
     `,
    data() {
      return {
          product: 'Socks',
          brand: 'Vue Mastery',
          selectedVariant: 0,
          details: ['80% cotton', '20% polyester', 'Gender-neutral'],
          variants: [
            {
              variantId: 2234,
              variantColor: 'green',
              variantImage:  'https://dl.dropboxusercontent.com/s/9zccs3f0pimj0wj/vmSocks-green-onWhite.jpg?dl=0',
              variantQuantity: 10     
            },
            {
              variantId: 2235,
              variantColor: 'blue',
              variantImage: 'https://dl.dropboxusercontent.com/s/t32hpz32y7snfna/vmSocks-blue-onWhite.jpg?dl=0',
              variantQuantity: 0     
            }
          ],
          reviews: []
      }
    },
      methods: {
        addToCart: function() {
            this.$emit('add-to-cart',this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function(index) {  
            this.selectedVariant = index
        },
        addReview(productReview){
            this.reviews.push(productReview)
        }
      },
      computed: {
          title() {
              return this.brand + ' ' + this.product  
          },
          image(){
              return this.variants[this.selectedVariant].variantImage
          },
          inStock(){
              return this.variants[this.selectedVariant].variantQuantity
          },
          shipping() {
            if (this.premium) {
              return "Free"
            }
              return 2.99
          }
      }
  })
  
  Vue.component('product-review', {
      template: `
      <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
        <ul>
            <li v-for="error in errors">{{ error }}</li>   
        </ul>

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
      data(){
          return {
              name: null,
              review: null,
              rating: null,
              errors: []
          }
      },
      methods: {
          onSubmit(){
              if(this.name && this.review && this.rating){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
              }
              else {
                  if(!this.name) this.errors.push("name required")
                  if(!this.review) this.errors.push("review required")
                  if(!this.rating) this.errors.push("rating required")

              }
          }
      }
  })

  Vue.component('product-tabs', {
      props: {
          reviews: {
              type: Array,
              required: true
          }
      },
      template: `
      <div>
      <span class="tab"
            :class="{ activeTab: selectedTab === tab}"    
            v-for="(tab, index) in tabs"
            :key="index"
            @click="selectedTab = tab">
            {{ tab }}</span>
      </div>

      <div v-show="selectedTab === 'Review'">
      <h2>Reviews</h2>
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
          <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>

          </li>
      </ul>    

   <product-review @review-submitted="addReview"></product-review>

      `,
      data() {
          return{
              tabs: ['Reviews', 'Make a Review'],
              selectedTab: 'Reviews'
          }
      }
  })

  var app = new Vue({
      el: '#app',
      data: {
        premium: false,
        cart: []
      },
      methods: {
          updateCart(id){
              this.cart.push(id)
          }
      }
  })