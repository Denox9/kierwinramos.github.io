import Link from "next/link";
import Bb from "@/components/Bb";

export default function NotFound() {
  return (
    <section className="nf">
      <span className="label">ERROR // <Bb text="babala" bold /></span>
      <h1 className="nf__code">404</h1>
      <p className="label">MODULE NOT FOUND. GO STRAIGHT OR RIGHT.</p>
      <Link href="/work" className="btn btn--accent">RETURN TO ARCHIVE &gt;&gt;&gt;</Link>
    </section>
  );
}
