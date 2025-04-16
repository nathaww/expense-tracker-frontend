const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer className="p-12 flex justify-between items-center">
      <p>Expense tracker</p>
      <p>{date}</p>
    </footer>
  );
};

export default Footer;
