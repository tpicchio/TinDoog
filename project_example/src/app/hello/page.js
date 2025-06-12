import { Counter } from "@/components/counter";
import { LoginPage } from "@/components/login-page";

export default function Hello() {


  return (
    <div className="h-full">
      <LoginPage appTitle="Tindoog"></LoginPage>
      <Counter />
    </div>
  );
}
