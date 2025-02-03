import mongoose from "mongoose";

const NavsSchema = new mongoose.Schema({
  nav: { type: String, required: true },
  linkNav: { type: String, required: true },
});

export default mongoose.model("Nav", NavsSchema);
