import { getDoc, getDocs } from "@/data/content";

export const getCaseStudies = () => getDocs("projects");
export const getCaseStudy = (slug: string) => getDoc("projects", slug);

export const getWorkStudies = () => getDocs("work");
export const getWorkStudy = (slug: string) => getDoc("work", slug);
