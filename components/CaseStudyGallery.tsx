"use client";

import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/lib/case-studies";
import { Icon } from "./Icons";
import { ServiceCarousel } from "./ServiceCarousel";
import styles from "./CaseStudyGallery.module.css";

export function CaseStudyGallery() {
  return (
    <ServiceCarousel className={styles.gallery} label="Casi reali" variant="dots">
      {caseStudies.map((study) => (
        <article className={styles.card} key={study.id} aria-labelledby={`case-${study.id}-title`}>
          <div className={styles.card__top}>
            <div className={styles.card__brand}>
              {study.logo ? (
                <Image
                  unoptimized
                  src={study.logo.src}
                  alt={study.logo.alt}
                  width={study.logo.width}
                  height={study.logo.height}
                />
              ) : (
                <Icon name={study.icon ?? "check"} size={24} />
              )}
            </div>
            <span className={styles.card__region}>{study.region}</span>
          </div>
          <p className={styles.card__client}>
            {study.clientUrl ? (
              <Link href={study.clientUrl} target="_blank" rel="noopener noreferrer">
                {study.client}
              </Link>
            ) : (
              study.client
            )}
          </p>
          <h3 id={`case-${study.id}-title`}>{study.title}</h3>
          <ul className={styles.card__highlights}>
            {study.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.card__outcome}>{study.outcome}</p>
        </article>
      ))}
    </ServiceCarousel>
  );
}
