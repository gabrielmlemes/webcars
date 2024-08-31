import Container from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import InputStyle from "../../components/input-style";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "../../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve conter no mínimo 6 caracteres")
    .nonempty("O campo senha é obrigatório"),
  completeName: z.string().nonempty("O nome completo é obrigatório"),
});

type FormData = z.infer<typeof schema>;

const Register = () => {
  const navigate = useNavigate();
  const { handleInfoUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // se o usuário logado acessar a página de cadastro, automaticamente ele é deslogado
  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  // Salvar os dados do usuário após o submit no formulário
  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      // salvar o nome do usuário no displayname no firebase
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.completeName,
        });

        // atualizando dados do usuário
        handleInfoUser({
          name: data.completeName,
          email: data.email,
          uid: user.user.uid,
        });

        navigate("/dashboard", { replace: true });
        console.log("CADASTRADO COM SUCESSO");
      })

      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Container>
      <div className="w-full min-h-screen gap-4 flex items-center flex-col justify-center">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img src={logoImg} alt="Logo" className="w-full" />
        </Link>
        <form
          className="bg-white max-w-xl rounded-lg w-full p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <InputStyle
              type="text"
              placeholder="Digite seu nome completo..."
              name="completeName"
              error={errors.completeName?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <InputStyle
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <InputStyle
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="bg-zinc-900 text-white w-full rounded-md h-10 font-medium"
          >
            Cadastrar
          </button>
        </form>

        <Link to="/login">
          Já possui uma conta? <strong>Faça login</strong>
        </Link>
      </div>
    </Container>
  );
};

export default Register;
