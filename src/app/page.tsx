"use client";

import Bridge from "@components/Bridge/Bridge";
import Groups from "@components/Group/GroupList";
import Header from "@components/Page/Header";
import Footer from "@components/Page/Footer";
import { RenderProvider } from "@components/Page/RenderProvider";

export default function Home() {
  return (
    <RenderProvider>
      <Header />
      <main className="layout-content">
        <Bridge>
          <Groups />
        </Bridge>
      </main>
      <Footer />
    </RenderProvider>
  );
}
