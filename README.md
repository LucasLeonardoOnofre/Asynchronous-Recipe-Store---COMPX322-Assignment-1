Asynchronous Recipe Store – COMPX322-26A Assignment One

This project is the first assignment for COMPX322-26A, where we create a single-page web application that displays recipes asynchronously based on stored meal categories.

Table of Contents

Overview

Features

Technologies Used

Setup Instructions

How to Use

Project Structure

Assignment Notes

Assessment Criteria

Overview

The Asynchronous Recipe Store allows users to:

View meal categories fetched from a MySQL database.

Browse meals for a selected category using data from TheMealDB API.

View detailed recipes, including ingredients and cooking instructions.

Add or remove meal categories asynchronously without refreshing the page.

All functionality occurs on a single HTML page, leveraging asynchronous JavaScript (Fetch API) and DHTML, with a MySQL database backend.

Features
Category Browsing

Meal categories are fetched asynchronously from the MySQL menuCategories table.

Only categories marked as selected = 1 are displayed.

Meal Display

Clicking a category shows a list of meals (image and title) fetched from TheMealDB API.

Handles cases where no meals are returned.

Recipe Display

Clicking on a meal shows the full recipe details including ingredients and method.

Category Management

Users can add or remove categories.

Category changes are made asynchronously, updating the database without a page reload.

Single-Page App

All updates and changes happen without the page reloading.

JavaScript handles asynchronous requests and dynamic DOM updates.

Technologies Used

HTML5 – Semantic markup for structured content.

CSS3 – Styling and responsive layout.

JavaScript – Dynamic DOM manipulation and asynchronous fetch requests.

PHP – Server-side scripts to handle database operations.

MySQL – Stores meal categories.

TheMealDB API – External API to fetch meal data.
