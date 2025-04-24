# Expense Tracker Web Application

A modern, feature-rich expense tracking application built with Next.js that helps users manage their finances efficiently with an intuitive interface and powerful features.

## Features

- **User Authentication**: Secure login, registration, and email verification system
- **Dashboard Overview**: Get a quick snapshot of your financial status with total balance, expenses, and budget utilization
- **Expense Management**: 
  - Add, edit, and delete expenses
  - Categorize expenses
  - Add notes and dates
  - Search and filter expenses
  - Natural language expense entry (e.g., "Spent $50 on groceries yesterday")
- **Money Sources**: 
  - Manage multiple money sources (wallet, bank accounts, credit cards)
  - Track balance and budget for each source
  - Set default money source
- **Categories**:
  - Create custom expense categories
  - Add emoji icons to categories
  - Set default categories
- **Theme Customization**:
  - 12+ built-in themes
  - Create custom themes with personalized colors
  - Customize fonts and border radius
- **Data Visualization**:
  - Weekly and monthly expense trends
  - Interactive charts and graphs
  - Budget utilization tracking
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technologies Used

- **Frontend**:
  - Next.js 15 (React Framework)
  - TypeScript
  - TailwindCSS for styling
  - Framer Motion for animations
  - Radix UI for accessible components
  - React Query for data fetching
  - Formik & Yup for form handling
  - Recharts for data visualization

- **Key Features**:
  - Server-side rendering
  - Client-side navigation
  - Type safety with TypeScript
  - Responsive and animated UI
  - Accessible components
  - Efficient state management
  - Real-time form validation

## Demo Account

You can use the following credentials to test the application:

```
Email: jane@example.com
Password: password123
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
