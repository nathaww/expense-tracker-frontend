const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer className="p-4 flex justify-between border-t border-[var(--text)] items-center">
      <p>Expense tracker</p>
      <p>{date}</p>
    </footer>
  );
};

export default Footer;
