import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Container from "../../components/container";
import { useState, useEffect } from "react";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";

export interface CarProps {
  id: string;
  name: string;
  model: string;
  km: string;
  price: string | number;
  city: string;
  images: CarImageProps[];
  uid: string;
  year: string | number
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

const Home = () => {
  const [carInfo, setCarInfo] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);

  useEffect(() => {
    function loadCars() {
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, orderBy("created", "desc"));

      getDocs(queryRef).then((snapshot) => {
        const carsList = [] as CarProps[];

        snapshot.forEach((doc) => {
          carsList.push({
            id: doc.id,
            images: doc.data().images,
            name: doc.data().name,
            model: doc.data().model,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            uid: doc.data().uid,
            year: doc.data().year
          });
        });

        setCarInfo(carsList);
      });
    }

    loadCars();
  }, []);

  // Função para evitar layout shift das imagens
  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex items-center justify-center gap-2">
        <input
          className="w-full border-2 rounded-lg px-3 h-9 outline-none"
          placeholder="Digite o nome do carro..."
        />
        <button className="bg-red-500 h-8 text-white font-medium px-8 py-1 rounded-lg">
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center text-2xl mb-4 mt-6">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 py-2">
        {carInfo.map((car) => (
          <Link to={`/car/${car.id}`}>
            <section
              className="w-full rounded-lg overflow-hidden border border-slate-300"
              key={car.name}
            >
              {/* Div para evitar o layoutshift da imagem */}
              <div
                className="w-full rounded-lg h-72 bg-slate-200"
                style={{
                  display: loadImages.includes(car.id) ? "none" : "block",
                }}
              ></div>
              <img
                src={car.images[0].url}
                alt="Imagem carro"
                className=" w-full mb-2 max-h-72 hover:scale-105 transition-all"
                onLoad={() => handleImageLoad(car.id)}
              />

              <div className="flex flex-col pt-1 ">
                <p className="font-bold pl-2">{car.name}</p>
                <p className="text-sm pl-2 text-zinc-700 font-medium mb-4">
                  {car.year} | {car.km}km
                </p>
                <strong className=" border-b pl-2 font-medium pb-1">
                  R$ {car.price}
                </strong>
                <p className="text-sm pl-2 text-zinc-700 font-medium py-1">
                  {car.city}
                </p>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
};

export default Home;
