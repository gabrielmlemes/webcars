import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputStyleProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string
  rules?: RegisterOptions
}

const InputStyle = ({ type, placeholder, name, register, rules, error }: InputStyleProps) => {
  return (
    <div>
      <input
        placeholder={placeholder}
        {...register(name, rules)}
        type={type}
        id={name}
        className="px-2 rounded-lg h-11 outline-none w-full border-2"
      />
      {error && <p className="my-1 text-red-500">{error}</p>}
    </div>
  );
};

export default InputStyle;
