import LogoLoop from "./LogoLoop/LogoLoop";

// Alternative with image sources
const imageLogos = [
    { src: "kolaborator/pertamina.webp", alt: "Company 1", href: "#example" },
    { src: "kolaborator/kemenag.webp", alt: "Company 1", href: "#example" },
    { src: "kolaborator/kemendik.webp", alt: "Company 1", href: "#example" },
    { src: "kolaborator/jnt.webp", alt: "Company 1", href: "#example" },
    { src: "kolaborator/sumsel.webp", alt: "Company 1", href: "#example" },
    { src: "kolaborator/unilever.webp", alt: "Company 1", href: "#example" }
];

export default function Logo(){
    return (
    <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}} className="mt-5">
        {/* Basic horizontal loop */}
        <LogoLoop
        logos={imageLogos}
        speed={100}
        direction="left"
        logoHeight={50}
        gap={80}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
        />
    </div>
    );
}