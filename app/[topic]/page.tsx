"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import NavigationButton from "@/components/NavigationButton";
import Modal from "@/components/modal";
import Header from "@/lib/components/Header";
import dictionaryData from "@/public/dictionary.json";
import "./[topic].css";

interface Milestone {
  title: string;
  link: string;
}

interface TopicData {
  title: string;
  description: {
    male: string;
    female: string;
  };
  milestones: Milestone[];
}

const TopicPage = () => {
  const params = useParams();
  const { topic } = params as { topic: string };
  const normalizedTopic = topic.replace(/-/g, "_"); // Replace hyphens with underscores
  const data: TopicData = require(`@/lib/content/topics/${normalizedTopic}.json`);

  const [dictionary, setDictionary] = useState<{ [key: string]: string }>({});
  const [selectedTerm, setSelectedTerm] = useState<{
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const dict: { [key: string]: string } = {};
    dictionaryData.dictionary.forEach((entry) => {
      dict[entry.title] = entry.description;
    });
    setDictionary(dict);
  }, []);

  const processTextWithTerms = (text: string): string => {
    return text.replace(
      /<span data-term=['"]([^'"]+)['"]>([^<]+)<\/span>/g,
      (match, term, content) => {
        const cleanTerm = term.replace(/^ש?ב/, "");
        return `<span class="dictionary-term" data-term="${cleanTerm}">${content}</span>`;
      }
    );
  };

  const handleTermClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.hasAttribute("data-term")) {
      const term = target.getAttribute("data-term");
      if (term && dictionary[term]) {
        setSelectedTerm({
          title: term,
          description: dictionary[term],
        });
      }
    }
  };

  return (
    <>
      <Header />
      <div className="topic-page">
        <main className="topic-content">
          <h1 className="topic-title">{data.title}</h1>

          <div
            className="topic-description"
            onClick={handleTermClick}
            dangerouslySetInnerHTML={{
              __html: processTextWithTerms(data.description.female),
            }}
          />

          <div className="milestones-container">
            {data.milestones.map((milestone, index) => (
              <Link
                key={index}
                href={`/${topic}/${milestone.title}`}
                style={{ textDecoration: "none" }}
              >
                <button className="milestone-button">
                  <span className="milestone-text">{milestone.title}</span>
                </button>
              </Link>
            ))}
          </div>
        </main>

        <div className="nav-buttons">
          <NavigationButton label="תפריט" link="/burger_menu" position="left" />
          <NavigationButton label="מילון" link="/dictionary" position="right" />
        </div>

        <Modal
          isOpen={!!selectedTerm}
          onClose={() => setSelectedTerm(null)}
          title={selectedTerm?.title || ""}
        >
          <p>{selectedTerm?.description}</p>
        </Modal>
      </div>
    </>
  );
};

export default TopicPage;
