import type { Metadata } from "next";
import WorkFilter from "@/components/WorkFilter";
import { getPublishedProjects } from "@/lib/data";
import Bb from "@/components/Bb";

export const metadata: Metadata = { title: "Work" };

type Props = { searchParams: Promise<{ cat?: string }> };

export default async function WorkPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const projects = await getPublishedProjects();
  return (
    <section className="section">
      <header className="page-head">
        <span className="label">// DESIGN ARCHIVE — <Bb text="talaan nang likha" bold /></span>
        <h1 className="page-head__title">WORK<span className="accent">.</span></h1>
        <p className="label">PRESENTATIONS / LOGOS / INFOGRAPHICS / SYSTEMS</p>
      </header>
      <WorkFilter projects={projects} initial={cat ?? "all"} />
    </section>
  );
}
