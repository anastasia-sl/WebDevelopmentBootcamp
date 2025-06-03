import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

console.log("Looking for views in:", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php");
    const drink = response.data.drinks[0];

    const cocktail = {
      name: drink.strDrink,
      image: drink.strDrinkThumb,
      instructions: drink.strInstructions,
      category: drink.strCategory,
    };

    res.render("index", { cocktail });
  } catch (error) {
    console.error("Error fetching cocktail:", error.message);
    res.render("index", { cocktail: null });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
