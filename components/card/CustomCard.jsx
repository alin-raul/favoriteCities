const CustomCard = ({ children, className }) => {
  return (
    <div
      className={`p-4 bg-dynamic border backdrop-blur-md rounded-2xl shadow-lg relative ${className}`}
    >
      {children}
    </div>
  );
};

export default CustomCard;
