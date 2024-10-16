'use client'

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 py-6 text-center text-white">
      <p>&copy; {new Date().getFullYear()} FarmersApp. All rights reserved.</p>
      <div className="mt-4">
        <a href="#" className="text-green-400 hover:text-green-600 mx-2">About Us</a>
        <a href="#" className="text-green-400 hover:text-green-600 mx-2">Contact</a>
        <a href="#" className="text-green-400 hover:text-green-600 mx-2">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
