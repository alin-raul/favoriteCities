const CustomCard = ({ children }) => {
  return (
    <div className="p-4 bg-dynamic border backdrop-blur-md rounded-2xl shadow-lg relative">
      {children}
    </div>
  );
};

export default CustomCard;
