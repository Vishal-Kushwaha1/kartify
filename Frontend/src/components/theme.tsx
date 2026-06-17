import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const Theme = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      {theme}
      <Button onClick={() => setTheme("light")}>Light Mode</Button>
      <Button onClick={() => setTheme("dark")}>dark Mode</Button>
    </div>
  );
};

export default Theme;
