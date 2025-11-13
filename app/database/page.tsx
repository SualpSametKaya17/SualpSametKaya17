import Navigation from "@/components/Navigation";
import DatabaseSettings from "@/components/DatabaseSettings";

export default function DatabasePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <DatabaseSettings />
    </main>
  );
}
