import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";

const PanelHeader = () => {
  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="w-full items-center mb-4 h-10 gap-4 bg-red-500 px-3 flex rounded-lg font-medium text-white">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/dashboard/new">Novo carro</Link>

      <button className="ml-auto" onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  );
};

export default PanelHeader;
