const Search = document.getElementById('Search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const resultHeading = document.getElementById('meal-result-heading');
const mealsE1 = document.getElementById('meals');
const single_mealE1 = document.getElementById('single-meal-container');

function findMeal(e) {
    e.preventDefault();
    const item = Search.value;
    if (item.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                resultHeading.innerHTML = `Search Result for ${item}`;
                if (data.meals === null) {
                    resultHeading.innerHTML = `Oops !! No result for meal ${item}`;
                } else {
                    mealsE1.innerHTML = data.meals.map((meal) => `
                        <div class='meal'>
                            <img src='${meal.strMealThumb}' alt='${meal.strMeal}'>
                            <div class="meal-info" data-mealId="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>`).join('');
                }
            });
    } else {
        alert('Please enter an item name');
    }
}
//function to get meal id
function getsingleItemID(mealID) {
    //cleardata
    mealsE1.innerHTML = '';
    resultHeading.innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then((res) => res.json())
        .then((data) => {
            // console.log(data);
            const meal = data.meals[0];
            // console.log(meal)
            addMealToDOM(meal)
        });
}
///function to random meals
function getRandomData(){
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res)=>res.json())
    .then((data)=>{
        const meal=data.meals[0];
        addMealToDOM(meal)

    })
}




//function to  'addMealToDOM'
function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]} `);
        } else {
            break;
        }
    }
    // console.log(ingredients)
    single_mealE1.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <div class="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
</div>
<img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
<div class="main">
    <h2>Ingredients</h2>
    <ul>
        ${ingredients.map((ingr)=>
            `<li>${ingr}</li>`).join('')}

    </ul>
    <h2>Instructions</h2>
    <p>${meal.strInstructions}</p>
</div>

</div>`;
}
submit.addEventListener('submit', findMeal);
//random data
random.addEventListener('click' , getRandomData)
//Single meal click
mealsE1.addEventListener('click', (e) => {
    const mealInfo = e.composedPath().find((single_item) => {
        if (single_item.classList) {
            return single_item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealId');
        getsingleItemID(mealID);
    }
});