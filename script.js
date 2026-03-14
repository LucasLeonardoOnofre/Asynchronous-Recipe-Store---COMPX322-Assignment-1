// Wait for the document to load, then call the loadCategories function
document.addEventListener("DOMContentLoaded", loadCategories);

// Function to load categories from the database and display them as buttons
function loadCategories() {
    // Fetch categories from the PHP server
    fetch("php/getCategories.php")
        .then(res => {
            // If the response is not OK, throw an error
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json(); // Parse the response as JSON
        })
        .then(data => {
            // Get the container where we will place the category buttons
            const container = document.getElementById("categoryList");
            container.innerHTML = "";  // Clear any existing buttons

            // Loop through each category and create a button for it
            data.forEach(cat => {
                // Create a new button for each category
                const btn = document.createElement("button");
                btn.textContent = cat.strCategory;  // Set the button text as the category name
                btn.setAttribute('data-id', cat.idCategory);  // Store category ID in a data attribute

                // When a category button is clicked
                btn.onclick = () => {
                    // Remove the "selected" class from all category buttons
                    document.querySelectorAll("#categoryList button").forEach(b => {
                        b.classList.remove("selected");
                    });

                    // Add "selected" class to the clicked button
                    btn.classList.add("selected");

                    // Load meals for the selected category
                    loadMeals(cat.strCategory);
                };

                // Append the button to the container
                container.appendChild(btn);
            });

            // Rebind the add and delete category buttons after categories are loaded
            bindCategoryButtons();
        })
        .catch(err => console.error("Error loading categories:", err)); // Handle fetch errors
}

// Function to load meals for the selected category
function loadMeals(category) {
    // Clear any previous recipe details
    document.getElementById("recipeDetails").innerHTML = "";

    // Fetch meals for the selected category from an external API
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`)
        .then(res => {
            // If the response is not OK, throw an error
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json(); // Parse the response as JSON
        })
        .then(data => {
            // Get the container where meal items will be listed
            const container = document.getElementById("mealList");
            container.innerHTML = "";  // Clear any existing meals

            // If no meals were found, display a message
            if (!data.meals) {
                container.innerHTML = "No recipes found for this category.";
                return;
            }

            // Loop through the meals and display each one
            data.meals.forEach(meal => {
                // Create a div element for each meal item
                const div = document.createElement("div");
                div.className = "mealItem"; // Add a class for styling

                // Add the meal image and name to the div
                div.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <p>${meal.strMeal}</p>
                `;

                // When the meal is clicked, load the full recipe
                div.onclick = () => loadRecipe(meal.idMeal);

                // Append the meal item to the container
                container.appendChild(div);
            });
        })
        .catch(err => console.error("Error loading meals:", err)); // Handle fetch errors
}

// Function to load the full recipe details for a selected meal
function loadRecipe(id) {
    // Fetch the full recipe details for the selected meal from an external API
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => {
            // If the response is not OK, throw an error
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json(); // Parse the response as JSON
        })
        .then(data => {
            const meal = data.meals[0];  // Get the first (and only) meal from the response
            const container = document.getElementById("recipeDetails");

            // Build the ingredients list
            let ingredients = "";
            for (let i = 1; i <= 20; i++) {
                const ing = meal["strIngredient" + i];
                const meas = meal["strMeasure" + i];
                // If an ingredient exists, add it to the list
                if (ing && ing.trim() !== "") {
                    ingredients += `<li>${meas} ${ing}</li>`;
                }
            }

            // Display the recipe details in the container
            container.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h4>Ingredients</h4>
                <ul>${ingredients}</ul>
                <h4>Method</h4>
                <p>${meal.strInstructions}</p>
            `;
        })
        .catch(err => console.error("Error loading recipe:", err)); // Handle fetch errors
}

// Function to bind the Add and Delete category button logic
function bindCategoryButtons() {
    // Add new category button click event
    document.getElementById("addCategoryBtn").onclick = function () {
        selectButton(this);  // Mark the button as selected

        // Prompt the user for the new category name
        const newCategory = prompt("Enter the name of the new category:");
        
        // If the user entered a category name
        if (!newCategory || newCategory.trim() === "") {
            alert("Category name cannot be empty"); // Display an alert if the name is empty
            return;
        }

        // Add the new category
        addCategory(newCategory.trim());
    };

    // Function to add a new category
    function addCategory(categoryName) {
        // Send a request to add the category to the database
        fetch("php/addCategory.php", {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `categoryName=${encodeURIComponent(categoryName)}`
        })
        .then(res => res.json())
        .then(data => {
            // If the category was added successfully, reload categories
            if (data.status === "success") {
                loadCategories();
            } else {
                alert("Failed to add new category: " + data.message); // Show error message
            }
        })
        .catch(err => alert("Network error: " + err)); // Handle network errors
    }

    // Delete category button click event
    document.getElementById("deleteCategoryBtn").onclick = function () {
        selectButton(this);  // Mark the button as selected

        // Prompt the user for the category to delete
        const categoryToDelete = prompt("Enter the name of the category to delete:");
        
        // If the user entered a category name
        if (!categoryToDelete || categoryToDelete.trim() === "") {
            alert("Category name cannot be empty");
            return;
        }

        // Find the category button by exact text
        const categoryButton = [...document.querySelectorAll('#categoryList button')]
            .find(button => button.textContent === categoryToDelete.trim());

        // If the category exists, delete it
        if (categoryButton) {
            const categoryId = categoryButton.getAttribute('data-id');
            deleteCategory(categoryId);
        } else {
            alert("Category not found!"); // Show an alert if the category was not found
        }
    };

    // Function to delete a category
    function deleteCategory(categoryId) {
        // Send a request to delete the category from the database
        fetch("php/deleteCategory.php", {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${encodeURIComponent(categoryId)}`
        })
        .then(res => res.json())
        .then(data => {
            // If the category was deleted successfully, reload categories
            if (data.status === "success") {
                loadCategories();
            } else {
                alert("Failed to delete category: " + data.message); // Show error message
            }
        })
        .catch(err => alert("Network error: " + err)); // Handle network errors
    }
}

// Helper function to select a category button
function selectButton(button) {
    // Remove the "selected" class from all category buttons
    document.querySelectorAll("#categoryList button").forEach(btn => {
        btn.classList.remove("selected");
    });
    // Add the "selected" class to the clicked button
    button.classList.add("selected");
}