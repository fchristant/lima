import "@styles/components/header.css";
import RenderToggle from "@components/Page/RenderToggle";

export default function Header() {
  return (
    <header className="header">
      <div className="header-wrapper">
        <a href="/" className="header-link">
          <h1 className="header-logo">
            <i>L</i>I<i>M</i>A
          </h1>
          <span className="header-slogan">light manager</span>
        </a>
      </div>
      <RenderToggle />
    </header>
  );
}
