"use client";
import { useState } from "react";
import { useField } from "formik";

export default function PasswordFieldFormik({ label, nameField, type, placeholder }:
    { label: string, nameField: string, type: string, placeholder: string }) {
    const [field, meta] = useField(nameField);
    const [showRules, setShowRules] = useState(false);

    const password = field.value || "";

    const rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
    };

    return (
        <div className="flex flex-col items-center mx-3 text-black">

            <div className="flex md:flex-row flex-col md:w-full mb-1 mt-5 justify-between  ">
                <label className="font-bold mr-3 flex self-start">{label}</label>
                <input
                    {...field}
                    type={type}
                    placeholder={placeholder}
                    className={`border border-black p-2 rounded-2xl w-80 focus:ring-2 
        ${meta.error && meta.touched ? "border-red-500" : "focus:ring-orange-500"}`}
                    onFocus={() => setShowRules(true)}
                    onBlur={() => setShowRules(false)}
                />
            </div>

            {meta.touched && meta.error && (
                <span className="text-red-500 text-xs">{meta.error}</span>
            )}

            {showRules && (
                <div className="mt-2 p-4 border rounded-xl bg-white shadow-sm text-sm">
                    <p className="mb-2 text-gray-700">La contraseña debe contener como mínimo:</p>

                    <ul className="grid grid-cols-2 gap-1">
                        <Rule ok={rules.length} text="8 caracteres" />
                        <Rule ok={rules.uppercase} text="1 mayúscula" />
                        <Rule ok={rules.lowercase} text="1 minúscula" />
                        <Rule ok={rules.number} text="1 número" />
                        <Rule ok={rules.symbol} text="1 carácter especial" />
                    </ul>
                </div>
            )}
        </div>
    );
}

function Rule({ ok, text }: { ok: boolean, text: string }) {
    return (
        <li
            className={`flex items-center gap-2 ${ok ? "text-orange-500" : "text-gray-600"
                }`}
        >
            <span
                className={`w-2 h-2 rounded-full border ${ok ? "bg-orange-600 border-orange-500" : "border-gray-500"
                    }`}
            ></span>
            {text}
        </li>
    );
}
