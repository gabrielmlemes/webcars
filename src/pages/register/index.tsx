import Container from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import InputStyle from "../../components/input-style";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function onSubmit(data: FormData) {
    console.log(data);
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
            Acessar
          </button>
        </form>

        <Link to="/login">Já possui uma conta? <strong>Faça login</strong></Link>
      </div>
    </Container>
  );
};

export default Register;
