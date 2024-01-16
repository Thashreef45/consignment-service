import nodeApp from "./app";
import { config } from "dotenv";
config()


new nodeApp().listen(String(process.env.PORT))
