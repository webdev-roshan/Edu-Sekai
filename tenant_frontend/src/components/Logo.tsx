import Image from "next/image";

export default function Logo({ width, height }: { width: number; height: number }) {
    return (
        <Image
            src="/assets/images/Edu_Sekai_Logo.png"
            alt="EduSekai Logo"
            width={width}
            height={height}
            unoptimized
        />
    );
}
