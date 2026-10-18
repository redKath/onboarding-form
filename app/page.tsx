import { OnboardingForm } from "@/components/form/OnboardingForm";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">
        Employee onboarding
      </h1>
      <OnboardingForm />
    </main>
  );
}
