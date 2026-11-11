import Link from "next/link";
import Bb from "@/components/Bb";

export default function NotFound() {
  return (
    <section className="nf">
      <div className="nf__stripes stripes" aria-hidden="true" />
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="label red">■ Page fault</span>
        <span className="micro">//404</span>
      </div>
      <div>
        <h1 className="nf__code">404</h1>
        <p className="nf__msg">Page <span className="soft">not</span> found</p>
        <p className="row" style={{ gap: "0.5rem", marginBottom: "1.25rem" }}><Bb text="wala" bold /> <span className="micro">WALA — NOTHING HERE</span></p>
        <Link href="/work" className="btn red"><span>Return to archive</span><span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
