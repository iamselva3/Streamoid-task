import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/Users.js";  

async function run() {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/mappingdb"
  );

  const users = [
    { name: "Super Admin", email: "super@local", password: "SuperPass123!", role: "superadmin" },
    { name: "Marketplace Admin", email: "admin@local", password: "AdminPass123!", role: "admin" },
    { name: "Seller Joe", email: "seller@local", password: "SellerPass123!", role: "seller" },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log("exists", u.email);
      continue;
    }

    const hash = await bcrypt.hash(u.password, 10);

    await User.create({
      name: u.name,
      email: u.email,
      passwordHash: hash,
      role: u.role,
    });

    console.log("created", u.email, "password:", u.password);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
