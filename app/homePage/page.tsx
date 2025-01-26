"use client";
import { createClient } from "@/lib/supabase/client"; // Use your custom client
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/lib/components/Header";
import "./home.css";

const topics = [
  {
    title: "ביטוח לאומי",
    icon: "/icons/onlyTitleStickers/national_insurance.svg",
    link: "/national_insurance",
  },
  { title: "מס הכנסה", icon: "/icons/onlyTitleStickers/tax.svg", link: "/tax" },
  {
    title: "פנסיה",
    icon: "/icons/onlyTitleStickers/pension.svg",
    link: "/pension",
  },
  {
    title: "ביטוחים",
    icon: "/icons/onlyTitleStickers/insurance.svg",
    link: "/insurance",
  },
  {
    title: "תלושי שכר",
    icon: "/icons/onlyTitleStickers/salary.svg",
    link: "/salary",
  },
  {
    title: "חשבון בנק",
    icon: "/icons/onlyTitleStickers/bank.svg",
    link: "/bank-account",
  },
];

const HomePage = () => {
  const supabase = createClient(); // Use your custom client

  const updateCurrentTopic = async (normalizedTopic: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.error("User session not found");
        return;
      }

      const userId = session.user.id;

      const { error } = await supabase
        .from("user_activity")
        .update({ curr_topic: normalizedTopic })
        .eq("id", userId);

      if (error) {
        console.error("Error updating current topic:", error);
      } else {
        console.log("Current topic updated successfully:", normalizedTopic);
      }
    } catch (error) {
      console.error("Error updating current topic:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="main-container">
        <div className="page-header">
          <h1 className="main-title">היי!</h1>
          <h2 className="sub-title">מה תרצי לעשות היום?</h2>
        </div>
        <div className="grid-container rtl">
          {topics.map((topic, index) => {
            const normalizedTopic = topic.link
              .replace(/-/g, "_")
              .replace("/", "");
            return (
              <Link
                href={topic.link}
                key={index}
                className="grid-item"
                onClick={() => updateCurrentTopic(normalizedTopic)}
              >
                <div className="icon-container">
                  <Image
                    src={topic.icon}
                    alt={topic.title}
                    fill
                    style={{ objectFit: "contain" }}
                    priority={index < 2}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default HomePage;
