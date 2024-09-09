import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import Container from "../../components/container";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Swiper, SwiperSlide } from "swiper/react";

interface CarProps {
  id: string;
  name: string;
  model: string;
  km: string;
  price: string | number;
  city: string;
  images: CarImageProps[];
  uid: string;
  year: string | number;
  description: string;
  created: string;
  owner: string;
  whatsapp: string;
}

interface CarImageProps {
  uid: string;
  name: string;
  url: string;
}

const CarDetail = () => {
  const [car, setCar] = useState<CarProps>();
  const { id } = useParams();
  const [sliderPreview, setSliderPreview] = useState<number>(2);
  const navigate = useNavigate();

  // Pegar dados do carro no banco
  useEffect(() => {
    async function loadCar() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "cars", id);

      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          navigate("/");
        }

        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          model: snapshot.data()?.model,
          km: snapshot.data()?.km,
          price: snapshot.data()?.price,
          city: snapshot.data()?.city,
          images: snapshot.data()?.images,
          uid: snapshot.data()?.uid,
          year: snapshot.data()?.year,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          owner: snapshot.data()?.owner,
          whatsapp: snapshot.data()?.whatsapp,
        });
      });
    }

    loadCar();
  }, [id]);

  useEffect(() => {
    function handleResizer() {
      if (window.innerWidth < 720) {
        setSliderPreview(1);
      } else {
        setSliderPreview(2);
      }
    }

    handleResizer();
    window.addEventListener("resize", handleResizer);

    return () => {
      window.removeEventListener("resize", handleResizer);
    };
  }, []);

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPreview}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map((image) => (
            <SwiperSlide key={image.name}>
              <img
                src={image.url}
                alt={car.name}
                className="w-full h-96 cursor-grab object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4 ">
          <div className="flex flex-col items-center justify-between sm:flex-row mb-4">
            <h1 className="font-bold text-3xl">{car?.name}</h1>
            <p className="font-bold text-3xl">R${car?.price}</p>
          </div>

          <p>{car.model}</p>

          <div className="flex gap-6 my-4 w-full items-start">
            <div className="flex flex-col">
              <p className="text-zinc-500">Cidade</p>
              <p className="font-bold">{car.city}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-zinc-500">Ano</p>
              <p className="font-bold">{car.year}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-zinc-500">Câmbio</p>
              <p className="font-bold">Automático</p>
            </div>
            <div className="flex flex-col">
              <p className="text-zinc-500">KM</p>
              <p className="font-bold">{car.km}</p>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="font-bold">Descrição</h2>
            <p>{car.description}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-bold">Proprietário</h3>
            <p>{car.owner}</p>
          </div>

          <a
          target="_blank"
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, vi esse ${car.name} no anúncio do Web Carros!`}
            className="cursor-pointer flex items-center justify-center gap-2 bg-green-700 w-full text-white font-medium h-9 rounded-md mt-4"
          >
            Enviar mensagem no whatsapp
            <FaWhatsapp />
          </a>
        </main>
      )}
    </Container>
  );
};

export default CarDetail;
