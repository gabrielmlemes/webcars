import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import { FiUser, FiLogIn } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {

  const {signed, loadingAuth} = useContext(AuthContext)
  
  return (
    <div className="w-full drop-shadow mb-4 bg-white flex items-center justify-center h-16">
      <header className="flex w-full max-w-7xl px-4 mx-auto items-center justify-between">
        <Link to="/">
          <img src={logoImg} alt="Logo Header" />
        </Link>

        {signed && !loadingAuth && (
          <Link to="/dashboard">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiUser size={22} color="#000" />
            </div>
          </Link>
        )}

        {!signed && !loadingAuth && (
          <Link to="/login">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiLogIn size={22} color="#000" />
            </div>
          </Link>
        )}
      </header>
    </div>
  );
};

export default Header;
