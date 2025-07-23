import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-neutral-600">
          Welcome to Kracada
        </h1>
        <p className="text-center text-neutral-500 mt-4 max-w-2xl mx-auto">
          One stop shop for everything important to you. Explore jobs, news,
          lifestyle, entertainment, and CV optimization.
        </p>
      </div>
    </MainLayout>
  );
}
