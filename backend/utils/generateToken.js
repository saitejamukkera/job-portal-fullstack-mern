import jwt from "jsonwebtoken";

export default function generateToken(id) {
  const token = jwt.sign(
    {
      id: id,
    },
    process.env.JWT_Secret,
    { expiresIn: "2d" }
  );

  return token;
}
