import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma";
import invariant from "invariant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    invariant(req.body.title, "No title");
    const experiment = await prisma.experiment.create({
      data: {
        title: req.body.title,
      },
    });
    return res.status(200).json({ name: "John Doe" });
  }

  res.status(400).json({ error: "Not allowed" });
}
