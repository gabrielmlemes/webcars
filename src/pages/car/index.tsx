import { useParams } from "react-router-dom";

const CarDetail = () => {
  const {id} = useParams()

  return (
    <div className="min-h-screen">
      <h1>pagina detalhes: {id}</h1>
      
    </div>
  );
};

export default CarDetail;
