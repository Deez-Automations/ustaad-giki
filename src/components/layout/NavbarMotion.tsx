"use client";

import { motion } from "framer-motion";

export function NavbarMotion({ children }: { children: React.ReactNode }) {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 w-full z-50 glass border-b border-white/20"
        >
            {children}
        </motion.nav>
    );
}
