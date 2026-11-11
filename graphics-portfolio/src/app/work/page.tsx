import type { Metadata } from "next";
import WorkFilter from "@/components/WorkFilter";
import SecHead from "@/components/SecHead";
import { getPublishedProjects } from "@/lib/data";

export const metadata: Metadata = { title: "Work" };

type Props = { searchParams: Promise<{ cat?: string }> };

export default async function WorkPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const projects = await getPublishedProjects();
  return (
    <section className="sec">
      <SecHead idx="02" soft="The" title="Work" side="talaan ng likha" meta="PRESENTATIONS · LOGOS · INFOGRAPHICS · SYSTEMS" ghost="likha" as="h1" />
      <WorkFilter projects={projects} initial={cat ?? "all"} />
    </section>
  );
}
