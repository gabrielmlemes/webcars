import { ChangeEvent, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { FiTrash, FiUpload } from "react-icons/fi";
import Container from "../../../components/container";
import PanelHeader from "../../../components/panelheader";
import { useForm } from "react-hook-form";
import InputStyle from "../../../components/input-style";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidV4 } from "uuid";
import { storage } from "../../../services/firebaseConnection";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const schema = z.object({
  name: z.string().min(1, 'O campo "nome" é obrigatório'),
  model: z.string().min(1, "O modelo é obrigatório"),
  year: z.string().min(1, "O ano do carro é obrigatório"),
  km: z.string().min(1, "O KM do carro é obrigatório"),
  price: z.string().min(1, "O preço do carro é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  whatsapp: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Número de telefone inválido",
    }),
  description: z.string().min(1, "A descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface ImagemItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

const New = () => {
  const { user } = useContext(AuthContext);
  const [carImages, setCarImages] = useState<ImagemItemProps[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Submit do formulário
  function onSubmit(data: FormData) {
    console.log(data);
  }

  // Validação e envio da imagem para o storage
  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        alert("Arquivo inválido. Envie uma imagem jpeg ou png");
        return;
      }
    }
  }

  // Pegar dados da imagem recebida
  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUuid = user?.uid;
    const uuidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUuid}/${uuidImage}`);
    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uuidImage,
          uid: currentUuid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };
        setCarImages((images) => [...images, imageItem]);
      });
    });
  }

  // Deletar imagem 
  async function handleDeleteImage(item: ImagemItemProps) {
    const imagePath = `images/${item.uid}/${item.name}`
    
    const imageRef = ref(storage, imagePath)

    try {
      await  deleteObject(imageRef)
      setCarImages(carImages.filter((car) => car.url !== item.url))
      console.log('carro deletado');
      

    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <Container>
      <PanelHeader />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              className="opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>
        </button>

        {carImages.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button className="absolute" onClick={()=> handleDeleteImage(item)}>
              <FiTrash size={28} color="#fff" />
            </button>
            <img
              src={item.previewUrl}
              className="rounded-lg w-full h-32 object-cover"
              alt="Foto do carro"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col items-centergap-2 mt-2 sm:flex-row">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          {/* Nome do carro */}
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <InputStyle
              type="text"
              register={register}
              name="name"
              error={errors?.name?.message}
              placeholder="Ex: Onix"
            />
          </div>

          {/* Modelo do carro */}
          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <InputStyle
              type="text"
              register={register}
              name="model"
              error={errors?.model?.message}
              placeholder="Ex: 1.0/Flex/Manual"
            />
          </div>

          {/* Ano e Km*/}
          <div className="flex gap-4 w-full mb-3 flex-row items-center">
            {/* Ano */}
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <InputStyle
                type="text"
                register={register}
                name="year"
                error={errors?.year?.message}
                placeholder="Ex: 2023/2024"
              />
            </div>
            {/* Km */}
            <div className="w-full">
              <p className="mb-2 font-medium">Km rodados</p>
              <InputStyle
                type="text"
                register={register}
                name="km"
                error={errors?.km?.message}
                placeholder="Ex: 22.000 km"
              />
            </div>
          </div>

          {/* Contato e Cidade*/}
          <div className="flex gap-4 w-full mb-3 flex-row items-center">
            {/* Whatsapp */}
            <div className="w-full">
              <p className="mb-2 font-medium">Whatsapp</p>
              <InputStyle
                type="text"
                register={register}
                name="whatsapp"
                error={errors?.whatsapp?.message}
                placeholder="Ex: 61912345678"
              />
            </div>
            {/* Cidade */}
            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <InputStyle
                type="text"
                register={register}
                name="city"
                error={errors?.city?.message}
                placeholder="Ex: Brasília - DF"
              />
            </div>
          </div>

          {/* Preço */}
          <div className="mb-3">
            <p className="mb-2 font-medium">Preço - R$</p>
            <InputStyle
              type="text"
              register={register}
              name="price"
              error={errors?.price?.message}
              placeholder="Ex: 69.000"
            />
          </div>

          {/* Descrição */}
          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              {...register("description")}
              name="description"
              className="border-2 w-full rounded-md h-24 px-2 "
              id="description"
              placeholder="Digite a descrição completa do carro"
            >
              {errors.description && (
                <p className="mb-1 text-red-500">
                  {errors.description.message}
                </p>
              )}
            </textarea>
          </div>

          <button
            type="submit"
            className="rounded-md bg-zinc-900 text-white font-medium w-full h-10"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  );
};

export default New;
