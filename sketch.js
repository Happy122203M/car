var dog,happyDog,dogImg;
var database;
var foodS,foodStock;
var dog

function preload(){
dogImg = loadImage("images/dogImg.png");
happyDog = loadImage("images/dogImg1.png");
milk=loadImage("image/Milk.png");
}

function setup() {
  createCanvas(1000, 500);
  foodObj = new Food();

  db = firebase.database();
  dog = createSprite(800, 200, 10, 10);
  dog.addImage(dogImg);
  dog.scale = 0.2

  feed = createButton("FEED");
  feed.position(600, 30);
  feed.mousePressed(feedDog);

  addFood = createButton("ADD FOOD");
  addFood.position(700, 30);
  addFood.mousePressed(addFood);

foodStock = db.ref('Food');
foodStock.on("value", readStock);
}


function draw() {  
background(46,139,87)

if(keyWentDown(UP_ARROW)){
  writeStock(foodS);
  dog.addImage(happyDog);
}
  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("food remaning :"+foodS,170,200);
  textSize(13);
  text("note : press up_arrow key to feed milk to tom",130,10,300,20);

}
function readStock(data){
  foodS = data.val();
  }
  
  function writeStock(x){
    if(x <= 0){
      x = 0;
    }
    else{
      x = x-1;
    }
      database.ref("/").update({
        food : x,
      })
    }
    function draw() {
      currentTime=hour();
      if(currentTime==(lastFed+1)){
          update("Playing");
          foodObj.garden();
       }else if(currentTime==(lastFed+2)){
        update("Sleeping");
          foodObj.bedroom();
       }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
        update("Bathing");
          foodObj.washroom();
       }else{
        update("Hungry")
        foodObj.display();
       }
       
       if(gameState!="Hungry"){
         feed.hide();
         addFood.hide();
         dog.remove();
       }else{
        feed.show();
        addFood.show();
        dog.addImage(sadDog);
       }
     
      drawSprites();
    }
    
    //function to read food Stock
    function readStock(data){
      foodS=data.val();
      foodObj.updateFoodStock(foodS);
    }
    
    
    //function to update food stock and last fed time
    function feedDog(){
      dog.addImage(happyDog);
    
      foodObj.updateFoodStock(foodObj.getFoodStock()-1);
      database.ref('/').update({
        Food:foodObj.getFoodStock(),
        FeedTime:hour(),
        gameState:"Hungry"
      })
    }
    
    //function to add food in stock
    function addFoods(){
      foodS++;
      database.ref('/').update({
        Food:foodS
      })
    }
    
    //update gameState
    function update(state){
      database.ref('/').update({
        gameState:state
      })
    }