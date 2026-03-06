import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-grid">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[var(--bg-elevated)] border border-[var(--border)] shadow-none",
            headerTitle: "text-[var(--text-primary)]",
            headerSubtitle: "text-[var(--text-secondary)]",
            socialButtonsBlockButton: "bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-active)]",
            formFieldLabel: "text-[var(--text-secondary)]",
            formFieldInput: "bg-[var(--bg)] border-[var(--border)] text-[var(--text-primary)]",
            formButtonPrimary: "bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90",
            footerActionLink: "text-[var(--accent)]",
            identityPreviewEditButton: "text-[var(--accent)]",
          },
        }}
      />
    </div>
  );
}
