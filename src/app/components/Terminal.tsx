"use client";

import { useState } from "react";
import { PlayerStatsInfo } from "@/app/components/GameEngine/PlayerSats";


export default function Terminal() {

    const [input, setInput] = useState("");

    const [history, setHistory] = useState<string[]>([
        "================================",
        "          TERMINAL RPG",
        "================================",
        "",
        "Wpisz 'help' aby zobaczyć dostępne komendy.",
        ""
    ]);


    function executeCommand(command: string): string {

        const cmd = command.trim().toLowerCase();


        switch (cmd) {

            case "help":

                return [
                    "Dostępne komendy:",
                    "",
                    "help      - pokazuje listę komend",
                    "stats     - pokazuje statystyki gracza",
                    "clear     - czyści terminal",
                    "about     - informacje o grze",
                    "test      - sprawdza działanie systemu"
                ].join("\n");


            case "stats":

                console.log("Wykonanie testu stats");
                console.log(PlayerStatsInfo());

                return PlayerStatsInfo();


            case "about":

                return [
                    "Terminal RPG",
                    "Tekstowa gra RPG tworzona w Next.js + TypeScript."
                ].join("\n");


            case "test":

                return "System działa poprawnie.";


            case "clear":

                return "";


            case "":

                return "";


            default:

                return [
                    `Nieznana komenda: ${cmd}`,
                    "Wpisz 'help' aby zobaczyć dostępne komendy."
                ].join("\n");
        }
    }


    function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        const command = input.trim();

        if (command.toLowerCase() === "clear") {

            setHistory([]);

            setInput("");

            return;
        }


        const result = executeCommand(command);


        if (command !== "") {

            setHistory(prev => [
                ...prev,
                `> ${command}`,
                ...result.split("\n")
            ]);
        }


        setInput("");
    }


    return (

        <main className="min-h-screen bg-black text-green-400 font-mono p-6">

            <div className="max-w-4xl mx-auto min-h-[500px] border border-green-700 rounded-lg p-5 shadow-lg shadow-green-900/20">

                <div className="text-left">

                    {history.map((line, index) => (

                        <div
                            key={index}
                            className="whitespace-pre-wrap"
                        >
                            {line}
                        </div>

                    ))}

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="flex mt-4"
                >

                    <span className="mr-2 text-green-500">
                        &gt;
                    </span>


                    <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
                    />

                </form>

            </div>

        </main>
    );
}