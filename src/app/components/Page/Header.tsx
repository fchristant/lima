import "@styles/components/header.css";
import RenderToggle from "@components/Page/RenderToggle";

export default function Header() {
  return (
    <header className="header">
      <h1>Lima</h1>
      <RenderToggle />
    </header>
  );
}
