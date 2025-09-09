# E-Commerce Price Tracker & Alerter

An automated bot that monitors product prices on your favorite e-commerce sites and sends you a notification when a price drops below your target. Stop wasting time manually checking for sales and let the code find the best deals for you.

## 🎯 The Problem

Have you ever decided to buy a new laptop, smartphone, or any specific item, but wanted to wait for the perfect price? The manual process of tracking prices is often a frustrating and inefficient experience.

You probably find yourself:

- Visiting the same 3-4 websites **every single day** to check on a product.
- Trying to remember what the price was yesterday or last week to know if the current price is a good deal.
- Creating messy spreadsheets or notes just to keep track of different URLs and prices.

This approach is not only tedious but also highly ineffective. Flash sales can last for just a few hours, and by the time you manually check the page, **the opportunity is gone**. You might end up paying more than you should, or worse, giving up on the purchase altogether.

The core issues with manual price tracking are:

- **It's Time-Consuming:** It requires significant and repetitive daily effort.
- **You Miss Opportunities:** It's nearly impossible to catch short-lived deals and sudden price drops.
- **There's No Historical Data:** Without tracking prices over time, you can't be sure if a "sale" is genuinely a good deal or just a return to the standard price after a temporary increase.

## 💡 The Solution

This project solves the problem by providing a fully automated solution. It acts as your personal shopping assistant that works 24/7.

Here's how it works:

1.  **You Provide a List:** You give the application a list of product URLs you want to track, along with your desired target price for each. The URL should be either from Amazon or Ebay.
2.  **It Scrapes the Data:** The system automatically visits each URL on a set schedule (e.g., once or twice a day) and extracts the current price and product name.
3.  **It Stores the History:** Every price check is saved to a database, building a valuable price history for each item.
4.  **It Sends an Alert:** If the current price drops below your target price, the system immediately sends you a notification via email, so you can act fast and secure the deal.

This turns a manual, frustrating task into an efficient, set-and-forget process.

## ✨ Features

- **Multi-Store Scraping:** Track products from Amazon or Ebay e-commerce websites.
- **Target Price Alerts:** Get notified the moment a product's price hits your desired level.
- **Historical Price Tracking:** View the price history of a product to make informed buying decisions.
- **Web Interface:** A simple UI to easily add, view, and manage your tracked products.

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd price-tracker
   ```
3. Install the dependencies for the backend project:
   ```bash
   cd backend && npm install
   ```
4. Install the dependencies for the frontend project:
   ```bash
   cd frontend && npm install
   ```
5. Set up your environment variables by copying `.env.example` to `.env` and filling in the required values.

## 🚀 Usage

To start the application, run both the backend and frontend.

To run the backend, use:

```bash
cd backend && npm run dashboard-api:run
```

To run the frontend, use:

```bash
cd frontend && npm run start
```

## 🧪 Testing

To run the tests, use:

```bash
npm test
```

## Swagger Documentation

To access the swagger documentation for the API, access `http://localhost:3000/api-docs`.

## 📄 License

This project is licensed under the ISC License.
