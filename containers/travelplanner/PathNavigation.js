import Link from "next/link";
import { IoMdArrowDropright } from "react-icons/io";
import media from "../../components/media";

const ORIGIN = "https://thetarzanway.com";

const capitalizeFirstLetter = (string) =>
  string
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function PathNavigation(props) {
  let isPageWide = media("(min-width: 768px)");

  // Derive the crumbs during render (NOT in useEffect) so the breadcrumb and its
  // links are present in the server-rendered HTML — otherwise crawlers see nothing.
  const link = props?.path ? props.path.split("/").filter(Boolean) : [];

  if (!link.length) return null;

  // Cumulative self-referencing href for each crumb level, e.g.
  // ["asia","india","kerala"] -> /asia, /asia/india, /asia/india/kerala
  const hrefFor = (index) => "/" + link.slice(0, index + 1).join("/");

  // BreadcrumbList structured data (absolute URLs) so Google renders the trail.
  const crumbs = [
    { name: "All Destinations", url: `${ORIGIN}/destinations` },
    ...link.map((value, index) => ({
      name: capitalizeFirstLetter(value),
      url: ORIGIN + hrefFor(index),
    })),
  ];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <div className={`${!isPageWide && "ml-3"} mt-[3.5rem] text-sm text-blue`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <span>
        <Link href="/destinations" className="cursor-pointer hover:underline">
          All Destinations
        </Link>
        <IoMdArrowDropright className="inline" />
      </span>
      {link.map((value, index) => (
        <span key={index}>
          <Link href={hrefFor(index)} className="cursor-pointer hover:underline">
            {capitalizeFirstLetter(value)}
          </Link>
          {index < link.length - 1 && (
            <IoMdArrowDropright className="inline" />
          )}
        </span>
      ))}
    </div>
  );
}
