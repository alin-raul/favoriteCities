const CustomCard = ({ children }) => {
  return (
    <div className="p-4 bg-dynamic border rounded-2xl shadow-lg relative hover:scale-110 transition-all">
      {children}
    </div>
  );
};

export default CustomCard;
