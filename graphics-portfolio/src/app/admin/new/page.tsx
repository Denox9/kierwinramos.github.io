import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProject() {
  return (
    <section className="section">
      <header className="section__head">
        <span className="section__n">+</span>
        <h1 className="section__title">NEW PROJECT</h1>
      </header>
      <ProjectForm />
    </section>
  );
}
