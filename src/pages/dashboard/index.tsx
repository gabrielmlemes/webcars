import { useContext, useEffect, useState } from "react";
import Container from "../../components/container";
import PanelHeader from "../../components/panelheader";
import { FiTrash2 } from "react-icons/fi";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { CarProps } from "../home";
import { db, storage } from "../../services/firebaseConnection";
import { deleteObject, ref } from "firebase/storage";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [cars, setCars] = useState<CarProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadCars() {
      if (!user?.uid) {
        return;
      }

      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uid", "==", user.uid));

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
            year: doc.data().year,
          });
        });

        setCars(carsList);
      });
    }

    loadCars();
  }, [user]);

  async function handleDelete(car: CarProps) {
    // deletar carro do banco de dados
    const itemCar = car;

    const docRef = doc(db, "cars", itemCar.id);
    await deleteDoc(docRef);
    toast.success("Anúncio deletado com sucesso!")

    //deletar a imagem do storage
    itemCar.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath);

      try {
        await deleteObject(imageRef);
        setCars(cars.filter((car) => car.id !== itemCar.id));
      } catch (error) {
        console.log("ERRO AO DELETAR ", error);
      }
    });
  }

  return (
    <Container>
      <PanelHeader />

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section className="w-full bg-white rounded-lg relative" key={car.id}>
            <button
              onClick={() => handleDelete(car)}
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
            >
              <FiTrash2 size={26} color="#000" />
            </button>
            <img
              src={car.images[0].url}
              alt="Imagem do carro"
              className="w-full rounded-lg max-w-70 max-h-[255px]"
            />
            <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700">
                {car.year} | {car.km}km
              </span>
              <strong className="text-black font-bold mt-4">
                R${car.price}
              </strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>

            <div className="px-2 pb-2">
              <span className="text-black">{car.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
};

export default Dashboard;
