import "@styles/components/header.css";
import RenderToggle from "@components/Page/RenderToggle";

export default function Header() {
  return (
    <header className="header">
      <div className="header-wrapper">
        <h1 className="header-logo">Lima</h1>
        <span className="header-slogan">Light manager</span>
      </div>
      <RenderToggle />
    </header>
  );
}
