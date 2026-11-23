let initialProducts =[
    {id:1, name:"Wireless Earbuds", price: 499},
    {id:2, name:"Gaming Headset", price: 1550},
    {id:3, name:"Mechanical Keyboard", price:3500},
    {id:4, name:"Rechargeable Electric Fan",price: 350},
    {id:5, name:"Office Chair",price: 1200},
    {id:6,name:"Car Shampoo",price: 750},
    {id:7,name:"Evander's Book of Math",price: 150}
];

//Set a localStorage
const myStorage = "storage";
    if (localStorage.getItem(myStorage)=== null){
        localStorage.setItem(myStorage, JSON.stringify(initialProducts));
    }




//create functions that can be used when needed, get all products, add product, and delete product
//get all saved products
function getProducts(){
    const savedData = localStorage.getItem(myStorage);
    return savedData ? JSON.parse(savedData) : [];
}

//add a product
function addProduct(item){
    const products = getProducts();
    products.push({
       id: item.id,
       name: item.name,
       price: item.price 
    });
    localStorage.setItem(myStorage, JSON.stringify(products));
}

//remove a product
function removeProduct(id){
    const products = getProducts();
    const updated = products.filter(item => item.id !== id);
    localStorage.setItem(myStorage, JSON.stringify(updated));
}

//Function for update products
function updateProduct({id, newName, newPrice}){
    const products = getProducts();
    const edited = products.map(item => item.id === id ? {...item, name: newName, price: newPrice}: item);
    localStorage.setItem(myStorage, JSON.stringify(edited));
}

//function for generating product ID
function getNextId(){
    const products = getProducts();
    return products.length ? Math.max(...products.map(p => p.id)) +1 : 1;
}

//function for redering products
function renderProducts(){
    //clear product grid
    mainElement.innerHTML = "";
    //rebuild products from local storage
    const products = getProducts();
    products.forEach((product)=>{
        mainElement.append(createCard(product));
    });
}

//function for reseting forms
function resetForm(){
    formInputName.value = "";
    formInputPrice.value = "";
    formAddBtn.textContent = "Add Product";
    cancelBtn.style.display = "none";
    editingID = null;
}


const searchInput=document.querySelector('#searchInput');
const mainElement=document.querySelector('.product-grid');
const matchResult=document.querySelector('#no-results');
const formInputName=document.querySelector('#productName');
const formInputPrice=document.querySelector('#productPrice')
const formAddBtn=document.querySelector('.add-btn');
const cancelBtn=document.querySelector('#cancel-btn');
let editingID = null;



//write the new element inside html by looping through the products

renderProducts();

//add product onclick event listener

formAddBtn.addEventListener('click', (event)=>{
    //this somehow stops the browser reading the button as submit because its inside a form tag
    event.preventDefault();
    const price = Number(formInputPrice.value);
    const name = formInputName.value.trim();
    
    //check inputs before adding to the array
    if(name === ""){
        alert("Please enter a name for the product");
        formInputName.focus();
        return;
    }

    
    if (!(price > 0)){
        alert("Please enter a valid positive number for the price");
        formInputPrice.select();
        return;
    }

    //declare a variable that will contain id, name, and price of product.
    // const addNew ={id:getNextId(), name: formInputName.value.trim(), price: price};  
    // const editItem = {id: editingID, newName: formInputName.value.trim(), newPrice: price};

    if(editingID !== null){
        //call updateProducts function
        updateProduct({id: editingID, newName: name, newPrice: price});
    }else{
        //push new product to products array
        addProduct({id: getNextId(), name: name, price: price});
    }
    renderProducts();
    resetForm();
    filterCards();
    

});



// //create a function that searches the cards after adding or deleting a product
function filterCards(){
    //transfered here so that the allCards gets called during search event
    const allCards=document.querySelectorAll('.card');
    
    //check the input search
    const searchName = searchInput.value.toLowerCase();
    let counter = 0;
    
    //go through each cards
    allCards.forEach((card)=> {    
        
        const h3 = card.querySelector('h3').textContent.toLowerCase();

    //check if the typed name matches any product *returns true or false   
        const typeCheck = searchName.split(" ").every(word=> h3.includes(word));       
        
    //hide/show cards if the typed name matches the cards
        if(!typeCheck){
            card.style.display = "none"; 
        }else{
            card.style.display = "";
            counter++;  
        }    
              
    });
        if(counter === 0){
            matchResult.style.display="block";
        }else{
            matchResult.style.display="none";
        }

}

//test writing an html element with a function //success
function createCard(item){
    
    const newElement=document.createElement('div');
        newElement.classList.add('card');
    
        newElement.innerHTML=`
        <div class="img-box">IMAGE</div>
        <h3></h3>
        <p class="price">${item.price.toLocaleString('en-PH',{style:'currency', currency: 'PHP'})}</p>
        <button class="add-cart-btn">Add to Cart</button>
        <button class="delete-btn">Delete</button>
        <button class="edit-btn">Edit</button>`;
        
        newElement.querySelector('h3').textContent = item.name;

       

    //Delete product.....    
    const deleteBtn = newElement.querySelector('.delete-btn');

    //delete the product from the array and from the page
    deleteBtn.addEventListener('click', ()=>{
        
        removeProduct(item.id);
        renderProducts();
        filterCards();

        if(editingID === item.id){
            resetForm(); 
        }
         
    });

    //Edit product.....
    const editBtn = newElement.querySelector('.edit-btn');

    editBtn.addEventListener('click', ()=>{
        formInputName.value = item.name;
        formInputPrice.value = item.price;
        editingID = item.id;
       
        formAddBtn.textContent = "Update Product";
        
        formInputName.focus();
        cancelBtn.style.display = "block";
    });

    
    return newElement;
}

//cancel update event listener
cancelBtn.addEventListener('click', ()=>{
    resetForm();
})


//add eventlistener for input

searchInput.addEventListener('input', filterCards);

