// Wait for page to fully load
document.addEventListener("DOMContentLoaded", () => {
    loadCategories(); // Load top categories on page load

    // Clear recipe details if clicking outside a meal
    document.body.addEventListener("click", function(e){
        if(!e.target.closest(".meal")){
            clearRecipe(); // Reset recipe panel
        }
    });
});

let addMode = false;    // Tracks if "Add" mode is active
let removeMode = false; // Tracks if "Remove" mode is active

// Load selected categories from database
async function loadCategories(){
    const container = document.getElementById("categoryList");
    container.innerHTML = ""; // Clear previous categories

    try {
        const res = await fetch("php/getCategories.php"); // Fetch all categories
        const data = await res.json();

        // Show only selected categories, up to 6
        const selected = data.filter(cat => cat.selected == 1).slice(0,6);

        selected.forEach(cat => {
            const div = document.createElement("div"); // Create container div
            div.className = "categoryItem";           // Add styling class
            div.textContent = cat.strCategory;        // Display category name
            div.onclick = () => loadMeals(cat.strCategory); // Load meals on click
            container.appendChild(div);               // Add to DOM
        });
    } catch (err) {
        console.error("Error loading categories:", err);
    }
}

// Handle Add button click
document.getElementById("addBtn").onclick = async () => {
    const container = document.getElementById("categoryList");

    if (!addMode) {
        // First click → show unselected categories as checkboxes
        addMode = true;
        removeMode = false;           // Exit remove mode if active
        document.getElementById("removeBox")?.remove(); // Remove removeBox if exists

        try {
            const res = await fetch("php/getCategories.php"); // Fetch categories again
            const data = await res.json();
            const unselected = data.filter(cat => cat.selected == 0); // Only unselected

            if (unselected.length === 0) { // Nothing to add
                alert("No categories to add.");
                addMode = false;
                return;
            }

            const box = document.createElement("div");
            box.id = "addBox"; // Container for checkboxes

            // Create checkbox for each unselected category
            unselected.forEach(cat => {
                const label = document.createElement("label");
                label.innerHTML = `<input type="checkbox" data-id="${cat.idCategory}"> ${cat.strCategory}`;
                box.appendChild(label);
            });

            container.appendChild(box); // Append to category list
            document.getElementById("addBtn").textContent = "Confirm Add"; // Change button text

        } catch (err) {
            console.error("Error fetching categories:", err);
        }

    } else {
        // Second click → confirm add
        const checked = document.querySelectorAll("#addBox input:checked"); // Get selected checkboxes

        if (checked.length === 0) {
            alert("Please tick at least one category to add.");
            return;
        }

        try {
            // Send POST requests to update selected categories
            const requests = Array.from(checked).map(cb =>
                fetch("php/updateCategory.php", {
                    method: "POST",
                    headers: {"Content-Type":"application/x-www-form-urlencoded"},
                    body: `id=${cb.dataset.id}&selected=1`
                })
            );

            await Promise.all(requests);           // Wait for all updates
            document.getElementById("addBox")?.remove(); // Remove checkbox container
            addMode = false;
            document.getElementById("addBtn").textContent = "Add"; // Reset button text

            loadCategories(); // Refresh category list
        } catch (err) {
            console.error("Error updating categories:", err);
        }
    }
};

// Handle Remove button click
document.getElementById("removeBtn").onclick = async () => {
    const container = document.getElementById("categoryList");

    if (!removeMode) {
        // First click → show selected categories with checkboxes
        removeMode = true;
        addMode = false;                 // Exit add mode
        document.getElementById("addBox")?.remove(); // Remove addBox if exists

        try {
            const res = await fetch("php/getCategories.php"); // Fetch categories
            const data = await res.json();
            const selected = data.filter(cat => cat.selected == 1); // Only selected

            if (selected.length === 0) { // Nothing to remove
                alert("No categories to remove.");
                removeMode = false;
                return;
            }

            const box = document.createElement("div");
            box.id = "removeBox"; // Container for remove checkboxes

            selected.forEach(cat => {
                const label = document.createElement("label");
                label.innerHTML = `<input type="checkbox" data-id="${cat.idCategory}"> ${cat.strCategory}`;
                box.appendChild(label);
            });

            container.appendChild(box);
            document.getElementById("removeBtn").textContent = "Confirm Remove";

        } catch (err) {
            console.error("Error fetching categories:", err);
        }

    } else {
        // Second click → confirm remove
        const checked = document.querySelectorAll("#removeBox input:checked");

        if (checked.length === 0) {
            alert("Please tick at least one category to remove.");
            return;
        }

        try {
            const requests = Array.from(checked).map(cb =>
                fetch("php/updateCategory.php", {
                    method: "POST",
                    headers: {"Content-Type":"application/x-www-form-urlencoded"},
                    body: `id=${cb.dataset.id}&selected=0`
                })
            );

            await Promise.all(requests);                // Wait for all removals
            document.getElementById("removeBox")?.remove(); // Remove checkbox container
            removeMode = false;
            document.getElementById("removeBtn").textContent = "Remove";

            loadCategories(); // Refresh categories
        } catch (err) {
            console.error("Error updating categories:", err);
        }
    }
};

// Load meals for a given category
function loadMeals(category){
    clearRecipe(); // Clear previous recipe display

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("mealList");
        container.innerHTML = ""; // Clear previous meals

        if(!data.meals){
            container.innerHTML = "No meals found."; // Show message if none
            return;
        }

        // Show up to 6 meals
        data.meals.slice(0,6).forEach(meal => {
            const div = document.createElement("div");
            div.className = "meal"; // Add styling class
            div.innerHTML = `<img src="${meal.strMealThumb}"><p>${meal.strMeal}</p>`;

            // Click on meal → load recipe
            div.onclick = (e) => {
                e.stopPropagation(); // Prevent click from clearing recipe
                loadRecipe(meal.idMeal);
            };
            container.appendChild(div);
        });
    });
}

// Load recipe details for a selected meal
function loadRecipe(id){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        const box = document.getElementById("recipeDetails");

        let ingredients = "";
        for(let i=1;i<=20;i++){ // Loop through 20 ingredient slots
            let ing = meal["strIngredient"+i];
            let meas = meal["strMeasure"+i];
            if(ing && ing.trim() !== "") ingredients += `<li>${meas} ${ing}</li>`; // Only add non-empty
        }

        // Display recipe details
        box.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" width="200">
            <h4>Ingredients</h4>
            <ul>${ingredients}</ul>
            <h4>Instructions</h4>
            <p>${meal.strInstructions}</p>
        `;
    });
}

// Clear the recipe details panel
function clearRecipe(){
    document.getElementById("recipeDetails").innerHTML = `
        <h3>Recipe</h3>
        <p>Select a meal to view the recipe.</p>
    `;
}

// Example: dynamically creating a labeled checkbox (used in add/remove)
const label = document.createElement("label");
label.className = "categoryCheckbox"; // Styling class

const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.dataset.id = cat.idCategory; // Store category ID

label.appendChild(checkbox);
label.appendChild(document.createTextNode(" " + cat.strCategory)); // Text inline with checkbox
container.appendChild(label);