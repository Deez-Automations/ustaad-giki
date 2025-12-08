/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import SOSModal from "@/components/sos/SOSModal";

export default function SOSButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating SOS Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-full shadow-2xl hover:shadow-red-500/50 transition-all flex items-center gap-2 group"
            >
                <Zap className="w-6 h-6 fill-current animate-pulse" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
                    Emergency SOS
                </span>
            </motion.button>

            {/* SOS Modal */}
            <SOSModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
