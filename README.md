Asynchronous Recipe Store – COMPX322-26A Assignment One

This project is the first assignment for COMPX322-26A, where a single-page web application is created to display recipes asynchronously based on meal categories fetched from a MySQL database.

Overview

The Asynchronous Recipe Store allows users to:

View meal categories fetched from a MySQL database.

Browse meals for a selected category using TheMealDB API.

View detailed recipes, including ingredients and cooking instructions.

Add or remove meal categories asynchronously without refreshing the page.

All functionality occurs on a single HTML page using asynchronous JavaScript (Fetch API) and DHTML, with a MySQL backend.

Features

Category Browsing: Meal categories are fetched from the MySQL menuCategories table, only showing categories marked as selected = 1.

Meal Display: Clicking a category shows meals (image + title) fetched from TheMealDB API. If no meals are found, a message is shown.

Recipe Display: Clicking on a meal shows full recipe details (ingredients and method).

Category Management: Users can add or remove categories, with updates made asynchronously without page reloads.

Single-Page Application: All data is updated dynamically with JavaScript without the need for a page refresh.

Technologies Used

HTML5 – Semantic markup for structured content.

CSS3 – Styling and responsive layout.

JavaScript – Handles asynchronous requests and dynamic content updates.

PHP – Server-side scripts for database operations.

MySQL – Database for storing meal categories.

TheMealDB API – External API used to fetch meal data.
