import FlowerMenu from "@/components/Global/list/flower-menu";
import {
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Twitch,
  Facebook,
} from "lucide-react";

import React from "react";
import { PointerHighlight } from "../ui/pointer-highlight";
import Link from "next/link";

const AboutUs = () => {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              About e2e
            </h2>

            <p className="text-md text-muted-foreground leading-relaxed">
              At e2e, our mission is to make{" "}
              <b>web automation intelligent, scalable, and production-grade</b>.
              We help organizations harness the power of AI while ensuring
              workflow reliability, security, and observability every step of
              the way.
            </p>

            <p className="text-md text-muted-foreground leading-relaxed">
              Our team brings together experts in{" "}
              <b>
                distributed systems, browser automation, and orchestration to
                deliver solutions that revolutionize how enterprises discover
                and automate web interactions. With a developer-first approach,
                we ensure that even sophisticated AI capabilities feel{" "}
              </b>
              intuitive, reliable, and maintainable.
            </p>

            <PointerHighlight
              rectangleClassName="bg-primary border-primary-700 leading-loose"
              pointerClassName="text-primary h-3 w-3"
              containerClassName="inline-block mx-1"
            >
              <Link href={"/about"} className="relative z-10 font-medium">
                Learn More About Us
              </Link>
            </PointerHighlight>
          </div>

          {/* Right side - FlowerMenu */}
          <div className="h-90 flex items-center justify-center">
            <FlowerMenu
              animationDuration={700}
              backgroundColor="rgba(0,0,0,0.4)"
              iconColor="#ffffff"
              menuItems={[
                { href: "https://github.com/MuhammadAliyan10", icon: Github },
                { href: "https://twitter.com/", icon: Twitter },
                { href: "https://instagram.com/", icon: Instagram },
                { href: "https://www.linkedin.com/", icon: Linkedin },
                { href: "https://www.youtube.com/", icon: Youtube },
                { href: "https://www.twitch.tv/", icon: Twitch },
                { href: "https://www.facebook.com/", icon: Facebook },
              ]}
              togglerSize={40}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
