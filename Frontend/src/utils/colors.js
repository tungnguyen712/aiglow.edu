const colors = [
    "#f7c8d8",
    "#b3e5fc",
    "#ffecb3",
    "#c8e6c9",
    "#fff9c4",
    "#e1bee7",
    "#c5cae9",
    "#b2dfdb",
    "#f8bbd0",
    "#d1c4e9",
    "#f0f4c3",
    "#fce4ec",
    "#ffccbc",
    "#e0f7fa",
    "#c8e6c9",
    "#fff8e1",
    "#dcedc8",
    "#f3e5f5",
    "#ffb74d",
    "#ffcc80",
    "#ffb6c1",
    "#a5d6a7",
    "#b2dfdb",
    "#ffccff",
    "#d0f0c0",
    "#e6ee9c",
];

export const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};
