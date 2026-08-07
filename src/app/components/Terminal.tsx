"use client";

import { useState } from "react";


export default function Terminal() {

    const [input, setInput] = useState("");

    const [history, setHistory] = useState<string[]>([
        "================================",
        "          TERMINAL RPG",
        "================================",
        "",
        "Wpisz 'help' aby zobaczyć komendy.",
        ""
    ]);


    function executeCommand(command: string) {

        const cmd = command
            .trim()
            .toLowerCase();


        switch (cmd) {

            case "help":

                return [
                    "Dostępne komendy:",
                    "",
                    "help      - pokazuje listę komend",
                    "clear     - czyści terminal",
                    "about     - informacje o grze",
                    "test      - test działania"
                ];


            case "about":

                return [
                    "Terminal RPG",
                    "Tekstowa gra RPG tworzona w Next.js + TypeScript."
                ];


            case "test":

                return [
                    "System działa poprawnie."
                ];


            case "clear":

                setHistory([]);

                return [];


            case "":

                return [];


            default:

                return [
                    `Nieznana komenda: ${cmd}`,
                    "Wpisz 'help' aby zobaczyć dostępne komendy."
                ];
        }
    }



    function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();


        const result =
            executeCommand(input);


        setHistory(prev => [
            ...prev,
            `> ${input}`,
            ...result
        ]);


        setInput("");

    }



    return (

        <main
            className="
                min-h-screen
                bg-black
                text-green-400
                font-mono
                p-6
            "
        >

            <div
                className="
                    max-w-4xl
                    mx-auto
                    border
                    border-green-700
                    rounded-lg
                    p-5
                    min-h-[500px]
                    shadow-lg
                    shadow-green-900/20
                "
            >

                <div
                    className="
                        space-y-1
                        whitespace-pre-wrap
                    "
                >

                    {
                        history.map(
                            (line, index) => (

                                <p
                                    key={index}
                                >
                                    {line}
                                </p>

                            )
                        )
                    }

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="
                        flex
                        mt-4
                    "
                >

                    <span
                        className="
                            mr-2
                            text-green-500
                        "
                    >
                        {">"}
                    </span>


                    <input

                        autoFocus

                        value={input}

                        onChange={
                            e =>
                            setInput(
                                e.target.value
                            )
                        }

                        className="
                            flex-1
                            bg-transparent
                            outline-none
                            text-green-400
                            caret-green-400
                        "

                    />

                </form>

            </div>

        </main>

    );
}