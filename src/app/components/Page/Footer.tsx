import "@styles/components/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        <small>
          {process.env.NEXT_PUBLIC_HUE_API_USERNAME}@
          {process.env.NEXT_PUBLIC_HUE_API_ADDRESS}
        </small>
      </p>
      <p>
        A project by{" "}
        <a href="https://www.ferdychristant.com" target="new">
          Ferdy Christant
        </a>
      </p>
    </footer>
  );
}
