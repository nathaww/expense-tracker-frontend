import { twMerge } from "tailwind-merge";

type ButtonProps = {
  text?: string;
  icon?: React.ReactNode;
  className?: string;
  iconPosition?: "left" | "right";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ text, icon, className, iconPosition = "left", ...props }) => {
  return (
    <button
      className={twMerge(
        "text-text active:scale-95 transition-all flex items-center justify-center", 
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {text && <span>{text}</span>}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;
