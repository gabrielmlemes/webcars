import Container from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import InputStyle from "../../components/input-style";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .min(1, "O campo email é obrigatório"),
  password: z.string().min(1, "O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
      console.log("Logout feito com sucesso");
    }

    handleLogout();
  }, []);

  // Login do usuário
  async function onSubmit(data: FormData) {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password).then(
        () => {
          toast.success("Login realizado com sucesso!");
          navigate("/dashboard", { replace: true });
        }
      );
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/too-many-requests") {
          alert(
            "Muitas tentativas falhas. Esqueceu sua senha? Você pode redefinir abaixo do formulário"
          );
        } else if (error.code === "auth/invalid-credential") {
          toast.error(
            "Usuário e/ou senha incorretas, verifique suas credenciais"
          );
        }
      } else {
        console.log(error);
        toast.error("Erro desconhecido. Tente novamente mais tarde.");
      }
    }
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
            Acessar
          </button>
        </form>

        <Link to="/register">
          Ainda não possui uma conta? <strong>Cadastre-se</strong>
        </Link>
        <Link to="/forgot">
          Esqueceu a senha? <strong>Clique aqui</strong>
        </Link>
      </div>
    </Container>
  );
};

export default Login;
