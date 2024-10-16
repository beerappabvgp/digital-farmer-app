'use client'

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { selectTheme, toggleTheme } from "@/lib/slices/themeSlice";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch"

const ThemeToggle = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(selectTheme);
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);
    const handleToggle = () => {
        dispatch(toggleTheme());
    }
    return (
        <div>
            <Switch checked={theme === 'dark'} onCheckedChange={handleToggle}/>
            {/* <span className="ml-2">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span> */}
        </div>
    );
}
export default ThemeToggle;