import { useContext } from "react";
import { Context, Theme } from "./SettingsContext";
import "./ThemeControl.css";

export default function ThemeControl() {
    const { settings, setSettings } = useContext(Context);

    const setTheme = (theme: Theme) => {
        setSettings({ ...settings, theme });
    };

    const options: { theme: Theme; icon: string; title: string }[] = [
        { theme: "system", icon: "⚙️", title: "System Theme" },
        { theme: "light", icon: "☀️", title: "Light Mode" },
        { theme: "dark", icon: "🌙", title: "Dark Mode" },
    ];

    return (
        <div className="theme-control">
            {options.map(({ theme, icon, title }) => (
                <button
                    key={theme}
                    className={settings.theme === theme ? "active" : ""}
                    onClick={() => setTheme(theme)}
                    title={title}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
}
