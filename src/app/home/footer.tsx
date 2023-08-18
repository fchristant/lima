import './footer.css'

export default function Footer() {
  return (
      <footer className="layout-footer">
         <p><small>{process.env.NEXT_PUBLIC_HUE_API_USERNAME}@{process.env.NEXT_PUBLIC_HUE_API_ADDRESS}</small></p>
      </footer>
  )
}
