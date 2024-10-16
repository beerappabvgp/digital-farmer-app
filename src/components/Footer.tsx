'use client'

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 py-6 text-center text-white text-xl">
      <p>&copy; {new Date().getFullYear()} FarmersApp. All rights reserved.</p>
      <div className="mt-4">
        <a href="#" className="mx-2">About Us</a>
        <a href="#" className="mx-2">Contact</a>
        <a href="#" className="mx-2">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
