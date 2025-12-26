const API = import.meta.env.VITE_API_BASE;

export async function detectIngredients(file: File) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API}/detect`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Detect failed");
    return res.json(); // { ingredients: [{name, confidence}] }
}

export async function fetchRecipes(ingredients: string[]) {
    const res = await fetch(`${API}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
    });
    if (!res.ok) throw new Error("Recipes failed");
    return res.json(); // { recipes: [...] }
}
