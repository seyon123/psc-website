import Header from "../components/Header";
import Footer from "../components/Footer";
import "../app/globals.css"; // Ensure you import the global styles

export const metadata = {
  title: "Pressure Systems Company Inc. - Pressure Washing Machines",
  description: "Explore powerful and reliable pressure washing machines for commercial and industrial cleaning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="bg-gray-50">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
