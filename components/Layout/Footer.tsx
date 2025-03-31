import React from 'react'

const Footer = () => {
    const year = new Date().getFullYear()
  return (
    <footer className='p-4 w-full bg-bg flex justify-between items-center'>
        <p>Expense Tracker</p>
        <p>{year}</p>
    </footer>
  )
}

export default Footer