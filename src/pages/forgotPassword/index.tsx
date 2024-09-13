import Container from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import InputStyle from "../../components/input-style";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "../../services/firebaseConnection";
import { useEffect, useState } from "react";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .min(1, "O campo email é obrigatório"),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
      console.log("Logout feito com sucesso");
    }

    handleLogout();
  }, []);

  const formSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success(
        "Se este email estiver cadastrado, enviaremos um link para recuperação de senha neste email."
      );
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao enviar o email de recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="w-full min-h-screen gap-4 flex items-center flex-col justify-center">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img src={logoImg} alt="Logo" className="w-full" />
        </Link>

        <form
          className="bg-white max-w-xl rounded-lg w-full p-4"
          onSubmit={handleSubmit(formSubmit)}
        >
          <div className="mb-3">
            <InputStyle
              type="email"
              placeholder="Digite seu email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="bg-zinc-900 text-white w-full rounded-md h-10 font-medium"
            disabled={loading} // Desabilita o botão se estiver carregando
          >
            {loading ? "Enviando..." : "Enviar senha de recuperação"}{" "}
          </button>
        </form>
      </div>
    </Container>
  );
};

export default ForgotPassword;
