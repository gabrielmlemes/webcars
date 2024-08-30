import { useContext, ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateProps {
  children: ReactNode;
}

// Protegendo as rotas
const Private = ({ children }: PrivateProps) => {
  const { loadingAuth, signed } = useContext(AuthContext);

  if (loadingAuth) {
    return <div><h1>Carregando</h1></div>;
  }

  if (!signed) {
    return <Navigate to='/login'/>
  }

  return children;
};
export default Private;
